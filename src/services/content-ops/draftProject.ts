import { z } from 'zod'
import { textToLexical } from '@/lib/lexical'
import { writeAuditLog } from './audit'
import {
  applyFieldWhitelist,
  assertEditorialActor,
  buildProvenance,
  detectConflict,
  filterEvidencedMetrics,
} from './guards'
import { localeSchema, metricSchema, sourceReferenceSchema } from './schemas'
import { resolveTaxonomyTerms } from './taxonomy'
import { failure, success, type OperationContext, type OperationResult } from './types'

export const draftProjectSchema = z.object({
  projectId: z.number().optional(),
  clientId: z.number().optional(),
  clientName: z.string().max(200).optional(),
  title: z.string().min(1).max(240),
  year: z.number().int().min(1900).max(2200).optional(),
  location: z.string().max(160).optional(),
  shortStatement: z.string().max(400).optional(),
  excerpt: z.string().max(800).optional(),
  challenge: z.string().max(8000).optional(),
  approach: z.string().max(8000).optional(),
  deliverables: z.string().max(8000).optional(),
  outcome: z.string().max(8000).optional(),
  resultsNote: z.string().max(2000).optional(),
  services: z.array(z.string().min(1)).max(20).optional(),
  industries: z.array(z.string().min(1)).max(10).optional(),
  projectTypes: z.array(z.string().min(1)).max(10).optional(),
  contextTags: z.array(z.string().min(1)).max(20).optional(),
  metrics: z.array(metricSchema).max(12).optional(),
  sourceReferences: z.array(sourceReferenceSchema).min(1),
  locale: localeSchema.default('fr'),
  expectedUpdatedAt: z.string().optional(),
})

export type DraftProjectInput = z.infer<typeof draftProjectSchema>

const WRITABLE_FIELDS = [
  'title',
  'client',
  'year',
  'location',
  'shortStatement',
  'excerpt',
  'challenge',
  'approach',
  'deliverables',
  'outcome',
  'resultsNote',
  'services',
  'industries',
  'projectTypes',
  'contextTags',
  'metrics',
  'sourceReferences',
  'taxonomySuggestions',
  'aiMeta',
] as const

async function resolveClient(ctx: OperationContext, input: DraftProjectInput): Promise<number | null> {
  if (input.clientId) return input.clientId
  if (!input.clientName) return null

  const result = await ctx.req.payload.find({
    collection: 'clients',
    where: { name: { equals: input.clientName.trim() } },
    draft: true,
    depth: 0,
    limit: 2,
    overrideAccess: false,
    req: ctx.req,
  })

  if (result.totalDocs === 1) return result.docs[0].id
  return null
}

/**
 * CLAUDE.md §97. Resolves the client, assigns only controlled taxonomy,
 * records unrecognized terms as suggestions, drops unsupported metrics, and
 * always writes a draft.
 */
export async function draftProject(
  ctx: OperationContext,
  input: DraftProjectInput,
): Promise<
  OperationResult<{ id: number; created: boolean; taxonomySuggestions: string[]; droppedMetrics: number }>
> {
  const actorCheck = assertEditorialActor(ctx)
  if (actorCheck) {
    await writeAuditLog(ctx, { action: 'draftProject', result: 'rejected', errorCode: 'forbidden' })
    return actorCheck as OperationResult<never>
  }

  const clientId = await resolveClient(ctx, input)
  if (!input.projectId && !clientId) {
    await writeAuditLog(ctx, { action: 'draftProject', result: 'rejected', errorCode: 'not_found' })
    return failure(
      'not_found',
      'Could not resolve exactly one client. Draft the client first, or pass clientId explicitly.',
    )
  }

  let existing: { id: number; reviewStatus?: string | null; updatedAt?: string | null } | null = null
  if (input.projectId) {
    try {
      existing = await ctx.req.payload.findByID({
        collection: 'projects',
        id: input.projectId,
        draft: true,
        depth: 0,
        overrideAccess: false,
        req: ctx.req,
      })
    } catch {
      await writeAuditLog(ctx, { action: 'draftProject', result: 'rejected', errorCode: 'not_found' })
      return failure('not_found', 'Project not found.')
    }

    const conflict = detectConflict(existing, input.expectedUpdatedAt)
    if (conflict) {
      await writeAuditLog(ctx, {
        action: 'draftProject',
        result: 'rejected',
        targetCollection: 'projects',
        targetDocument: existing.id,
        errorCode: 'conflict',
      })
      return conflict as OperationResult<never>
    }
  }

  const [services, industries, projectTypes, contextTags] = await Promise.all([
    resolveTaxonomyTerms(ctx, 'services', input.services),
    resolveTaxonomyTerms(ctx, 'industries', input.industries),
    resolveTaxonomyTerms(ctx, 'project-types', input.projectTypes),
    resolveTaxonomyTerms(ctx, 'context-tags', input.contextTags),
  ])

  const suggestions = [
    ...services.unresolved,
    ...industries.unresolved,
    ...projectTypes.unresolved,
    ...contextTags.unresolved,
  ]

  const metrics = filterEvidencedMetrics(input.metrics)

  const { data } = applyFieldWhitelist(
    {
      title: input.title.trim(),
      client: clientId ?? undefined,
      year: input.year,
      location: input.location,
      shortStatement: input.shortStatement,
      excerpt: input.excerpt,
      challenge: input.challenge ? textToLexical(input.challenge) : undefined,
      approach: input.approach ? textToLexical(input.approach) : undefined,
      deliverables: input.deliverables ? textToLexical(input.deliverables) : undefined,
      outcome: input.outcome ? textToLexical(input.outcome) : undefined,
      resultsNote: input.resultsNote,
      services: services.ids.length > 0 ? services.ids : undefined,
      industries: industries.ids.length > 0 ? industries.ids : undefined,
      projectTypes: projectTypes.ids.length > 0 ? projectTypes.ids : undefined,
      contextTags: contextTags.ids.length > 0 ? contextTags.ids : undefined,
      metrics: metrics.kept.length > 0 ? metrics.kept : undefined,
      sourceReferences: input.sourceReferences,
      taxonomySuggestions: suggestions.map((label) => ({ label })),
      aiMeta: buildProvenance(ctx, { targetLocale: input.locale }),
    },
    WRITABLE_FIELDS,
  )

  try {
    const doc = existing
      ? await ctx.req.payload.update({
          collection: 'projects',
          id: existing.id,
          locale: input.locale,
          data: { ...data, reviewStatus: 'ai_draft' } as never,
          draft: true,
          overrideAccess: false,
          req: ctx.req,
        })
      : await ctx.req.payload.create({
          collection: 'projects',
          locale: input.locale,
          data: { ...data, reviewStatus: 'ai_draft' } as never,
          draft: true,
          overrideAccess: false,
          req: ctx.req,
        })

    await writeAuditLog(ctx, {
      action: 'draftProject',
      result: 'success',
      targetCollection: 'projects',
      targetDocument: doc.id,
      changedFields: Object.keys(data),
      locale: input.locale,
    })

    return success({
      id: doc.id,
      created: !existing,
      taxonomySuggestions: suggestions,
      droppedMetrics: metrics.dropped,
    })
  } catch (error) {
    await writeAuditLog(ctx, { action: 'draftProject', result: 'error', targetCollection: 'projects' })
    return failure('invalid_input', error instanceof Error ? error.message : 'Failed to draft project.')
  }
}
