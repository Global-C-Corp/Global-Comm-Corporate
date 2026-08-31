import { z } from 'zod'
import { locales, translationStatusKey, type Locale } from '@/i18n/locale'
import { writeAuditLog } from './audit'
import { assertEditorialActor } from './guards'
import { success, type OperationContext, type OperationResult } from './types'

export const auditContentSchema = z.object({
  collection: z.enum(['services', 'industries', 'projects', 'clients', 'testimonials']),
  documentId: z.number().optional(),
  limit: z.number().int().min(1).max(100).default(25),
})

export type AuditContentInput = z.infer<typeof auditContentSchema>

export type ContentGap = {
  id: number
  title: string
  missing: string[]
  translations: Record<Locale, string>
  reviewStatus: string
  status: string
}

type AuditableDoc = {
  id: number
  title?: string | null
  name?: string | null
  internalTitle?: string | null
  excerpt?: string | null
  shortDescription?: string | null
  outcome?: unknown
  client?: unknown
  services?: unknown[]
  industries?: unknown[]
  projectTypes?: unknown[]
  heroMedia?: unknown
  featuredMedia?: unknown
  sourceReferences?: unknown[]
  relatedTestimonials?: unknown[]
  meta?: { title?: string | null; description?: string | null; openGraph?: { description?: string | null } | null } | null
  reviewStatus?: string | null
  _status?: string | null
  translationStatus?: Record<string, string | null | undefined> | null
}

function gapsFor(collection: string, doc: AuditableDoc): string[] {
  const missing: string[] = []

  if (!doc.meta?.title) missing.push('seo.title')
  if (!doc.meta?.description) missing.push('seo.description')
  if (!doc.meta?.openGraph?.description) missing.push('openGraph.description')
  if (!doc.sourceReferences || doc.sourceReferences.length === 0) missing.push('sourceReferences')

  if (collection === 'projects') {
    if (!doc.client) missing.push('client')
    if (!doc.services || doc.services.length === 0) missing.push('services')
    if (!doc.industries || doc.industries.length === 0) missing.push('industries')
    if (!doc.projectTypes || doc.projectTypes.length === 0) missing.push('projectTypes')
    if (!doc.outcome) missing.push('outcome')
    if (!doc.heroMedia && !doc.featuredMedia) missing.push('media')
    if (!doc.relatedTestimonials || doc.relatedTestimonials.length === 0) missing.push('proof')
  }

  if (collection === 'services' || collection === 'industries') {
    if (!doc.shortDescription) missing.push('shortDescription')
    if (!doc.heroMedia) missing.push('media')
  }

  if (doc.reviewStatus === 'ai_draft') missing.push('unreviewed AI draft')

  return missing
}

/**
 * CLAUDE.md §101, §110 — read-only. Reports what is missing so a human can
 * decide; never writes, and never fabricates content to close a gap.
 */
export async function auditContent(
  ctx: OperationContext,
  input: AuditContentInput,
): Promise<OperationResult<{ collection: string; documents: ContentGap[] }>> {
  const actorCheck = assertEditorialActor(ctx)
  if (actorCheck) {
    await writeAuditLog(ctx, { action: 'auditContent', result: 'rejected', errorCode: 'forbidden' })
    return actorCheck as OperationResult<never>
  }

  const documents: ContentGap[] = []

  for (const locale of locales) {
    const result = await ctx.req.payload.find({
      collection: input.collection,
      locale,
      fallbackLocale: false,
      draft: true,
      depth: 0,
      limit: input.limit,
      overrideAccess: false,
      req: ctx.req,
      where: input.documentId ? { id: { equals: input.documentId } } : undefined,
    })

    if (locale !== locales[0]) break

    for (const raw of result.docs as AuditableDoc[]) {
      const translations = Object.fromEntries(
        locales.map((l) => [l, raw.translationStatus?.[translationStatusKey(l)] ?? 'missing']),
      ) as Record<Locale, string>

      documents.push({
        id: raw.id,
        title: raw.title ?? raw.name ?? raw.internalTitle ?? `#${raw.id}`,
        missing: gapsFor(input.collection, raw),
        translations,
        reviewStatus: raw.reviewStatus ?? 'unknown',
        status: raw._status ?? 'draft',
      })
    }
  }

  await writeAuditLog(ctx, {
    action: 'auditContent',
    result: 'success',
    targetCollection: input.collection,
    targetDocument: input.documentId,
  })

  return success({ collection: input.collection, documents })
}
