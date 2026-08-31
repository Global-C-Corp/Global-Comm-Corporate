import { z } from 'zod'
import { textToLexical } from '@/lib/lexical'
import { writeAuditLog } from './audit'
import { applyFieldWhitelist, assertEditorialActor, buildProvenance, detectConflict } from './guards'
import { resolveTaxonomyTerms } from './taxonomy'
import { failure, success, type OperationContext, type OperationResult } from './types'
import { localeSchema, sourceReferenceSchema } from './schemas'

export const draftClientSchema = z.object({
  clientId: z.number().optional(),
  name: z.string().min(1).max(200),
  websiteURL: z.string().url().max(300).optional(),
  location: z.string().max(160).optional(),
  shortDescription: z.string().max(600).optional(),
  longDescription: z.string().max(6000).optional(),
  industries: z.array(z.string().min(1)).max(10).optional(),
  sourceReferences: z.array(sourceReferenceSchema).min(1),
  locale: localeSchema.default('fr'),
  expectedUpdatedAt: z.string().optional(),
})

export type DraftClientInput = z.infer<typeof draftClientSchema>

const WRITABLE_FIELDS = [
  'name',
  'websiteURL',
  'location',
  'shortDescription',
  'longDescription',
  'industries',
  'sourceReferences',
  'aiMeta',
  'translationStatus',
  'taxonomySuggestions',
] as const

function normalizeName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

function domainOf(url: string | undefined): string | null {
  if (!url) return null
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

/**
 * CLAUDE.md §96, §111. Matches an existing client by explicit id, then
 * domain, then normalized exact name. Ambiguity is reported, never merged.
 */
async function findExistingClient(ctx: OperationContext, input: DraftClientInput) {
  if (input.clientId) {
    try {
      const doc = await ctx.req.payload.findByID({
        collection: 'clients',
        id: input.clientId,
        draft: true,
        depth: 0,
        overrideAccess: false,
        req: ctx.req,
      })
      return { doc, ambiguous: false as const }
    } catch {
      return { doc: null, ambiguous: false as const }
    }
  }

  const domain = domainOf(input.websiteURL)
  if (domain) {
    const byDomain = await ctx.req.payload.find({
      collection: 'clients',
      where: { websiteURL: { like: domain } },
      draft: true,
      depth: 0,
      limit: 5,
      overrideAccess: false,
      req: ctx.req,
    })
    if (byDomain.totalDocs === 1) return { doc: byDomain.docs[0], ambiguous: false as const }
    if (byDomain.totalDocs > 1) return { doc: null, ambiguous: true as const }
  }

  const byName = await ctx.req.payload.find({
    collection: 'clients',
    where: { name: { equals: input.name.trim() } },
    draft: true,
    depth: 0,
    limit: 5,
    overrideAccess: false,
    req: ctx.req,
  })

  const exact = byName.docs.filter((doc) => normalizeName(doc.name) === normalizeName(input.name))
  if (exact.length === 1) return { doc: exact[0], ambiguous: false as const }
  if (exact.length > 1) return { doc: null, ambiguous: true as const }

  return { doc: null, ambiguous: false as const }
}

export async function draftClient(
  ctx: OperationContext,
  input: DraftClientInput,
): Promise<OperationResult<{ id: number; created: boolean; taxonomySuggestions: string[] }>> {
  const actorCheck = assertEditorialActor(ctx)
  if (actorCheck) {
    await writeAuditLog(ctx, { action: 'draftClient', result: 'rejected', errorCode: 'forbidden' })
    return actorCheck as OperationResult<never>
  }

  const existing = await findExistingClient(ctx, input)
  if (existing.ambiguous) {
    await writeAuditLog(ctx, { action: 'draftClient', result: 'rejected', errorCode: 'ambiguous_match' })
    return failure('ambiguous_match', 'Multiple clients match. Pass clientId explicitly to disambiguate.')
  }

  if (existing.doc) {
    const conflict = detectConflict(existing.doc, input.expectedUpdatedAt)
    if (conflict) {
      await writeAuditLog(ctx, {
        action: 'draftClient',
        result: 'rejected',
        targetCollection: 'clients',
        targetDocument: existing.doc.id,
        errorCode: 'conflict',
      })
      return conflict as OperationResult<never>
    }
  }

  const industries = await resolveTaxonomyTerms(ctx, 'industries', input.industries)

  const { data } = applyFieldWhitelist(
    {
      name: input.name.trim(),
      websiteURL: input.websiteURL,
      location: input.location,
      shortDescription: input.shortDescription,
      longDescription: input.longDescription ? textToLexical(input.longDescription) : undefined,
      industries: industries.ids.length > 0 ? industries.ids : undefined,
      sourceReferences: input.sourceReferences,
      aiMeta: buildProvenance(ctx, { targetLocale: input.locale }),
      taxonomySuggestions: industries.unresolved.map((label) => ({ label })),
    },
    WRITABLE_FIELDS,
  )

  try {
    const doc = existing.doc
      ? await ctx.req.payload.update({
          collection: 'clients',
          id: existing.doc.id,
          locale: input.locale,
          data: { ...data, reviewStatus: 'ai_draft' } as never,
          draft: true,
          overrideAccess: false,
          req: ctx.req,
        })
      : await ctx.req.payload.create({
          collection: 'clients',
          locale: input.locale,
          data: { ...data, reviewStatus: 'ai_draft' } as never,
          draft: true,
          overrideAccess: false,
          req: ctx.req,
        })

    await writeAuditLog(ctx, {
      action: 'draftClient',
      result: 'success',
      targetCollection: 'clients',
      targetDocument: doc.id,
      changedFields: Object.keys(data),
      locale: input.locale,
    })

    return success({ id: doc.id, created: !existing.doc, taxonomySuggestions: industries.unresolved })
  } catch (error) {
    await writeAuditLog(ctx, { action: 'draftClient', result: 'error', targetCollection: 'clients' })
    return failure('invalid_input', error instanceof Error ? error.message : 'Failed to draft client.')
  }
}
