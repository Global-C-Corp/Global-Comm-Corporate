import { z } from 'zod'
import { writeAuditLog } from './audit'
import { assertEditorialActor, buildProvenance, detectConflict } from './guards'
import { localeSchema } from './schemas'
import { failure, success, type OperationContext, type OperationResult } from './types'
import type { Locale } from '@/i18n/locale'

export const prepareSEOSchema = z.object({
  collection: z.enum(['services', 'industries', 'projects', 'clients', 'testimonials']),
  documentId: z.number(),
  locale: localeSchema,
  title: z.string().max(200).optional(),
  description: z.string().max(400).optional(),
  openGraphTitle: z.string().max(200).optional(),
  openGraphDescription: z.string().max(400).optional(),
  openGraphImageId: z.number().optional(),
  noIndex: z.boolean().optional(),
  noFollow: z.boolean().optional(),
  expectedUpdatedAt: z.string().optional(),
})

export type PrepareSEOInput = z.infer<typeof prepareSEOSchema>

/**
 * CLAUDE.md §100 — SEO/OG copy and robots flags only. canonicalOverride is
 * absent by construction here, and is additionally blocked by field-level
 * access control (§56, §138 AI_CAN_SET_CANONICAL_OVERRIDE = false).
 */
export async function prepareSEO(
  ctx: OperationContext,
  input: PrepareSEOInput,
): Promise<OperationResult<{ id: number; changedFields: string[] }>> {
  const actorCheck = assertEditorialActor(ctx)
  if (actorCheck) {
    await writeAuditLog(ctx, { action: 'prepareSEO', result: 'rejected', errorCode: 'forbidden' })
    return actorCheck as OperationResult<never>
  }

  let existing
  try {
    existing = await ctx.req.payload.findByID({
      collection: input.collection,
      id: input.documentId,
      locale: input.locale,
      fallbackLocale: false,
      draft: true,
      depth: 0,
      overrideAccess: false,
      req: ctx.req,
    })
  } catch {
    return failure('not_found', 'Document not found.')
  }

  const conflict = detectConflict(existing, input.expectedUpdatedAt)
  if (conflict) {
    await writeAuditLog(ctx, {
      action: 'prepareSEO',
      result: 'rejected',
      targetCollection: input.collection,
      targetDocument: input.documentId,
      errorCode: 'conflict',
      locale: input.locale as Locale,
    })
    return conflict as OperationResult<never>
  }

  const meta: Record<string, unknown> = {}
  const changedFields: string[] = []

  if (input.title !== undefined) {
    meta.title = input.title
    changedFields.push('meta.title')
  }
  if (input.description !== undefined) {
    meta.description = input.description
    changedFields.push('meta.description')
  }

  const openGraph: Record<string, unknown> = {}
  if (input.openGraphTitle !== undefined) {
    openGraph.title = input.openGraphTitle
    changedFields.push('meta.openGraph.title')
  }
  if (input.openGraphDescription !== undefined) {
    openGraph.description = input.openGraphDescription
    changedFields.push('meta.openGraph.description')
  }
  if (input.openGraphImageId !== undefined) {
    openGraph.image = input.openGraphImageId
    changedFields.push('meta.openGraph.image')
  }
  if (Object.keys(openGraph).length > 0) meta.openGraph = openGraph

  const robots: Record<string, unknown> = {}
  if (input.noIndex !== undefined) {
    robots.noIndex = input.noIndex
    changedFields.push('meta.robots.noIndex')
  }
  if (input.noFollow !== undefined) {
    robots.noFollow = input.noFollow
    changedFields.push('meta.robots.noFollow')
  }
  if (Object.keys(robots).length > 0) meta.robots = robots

  if (changedFields.length === 0) {
    return failure('invalid_input', 'No SEO fields supplied.')
  }

  try {
    await ctx.req.payload.update({
      collection: input.collection,
      id: input.documentId,
      locale: input.locale,
      data: {
        meta,
        reviewStatus: 'ai_draft',
        aiMeta: buildProvenance(ctx, { targetLocale: input.locale as Locale }),
      } as never,
      draft: true,
      overrideAccess: false,
      req: ctx.req,
    })

    await writeAuditLog(ctx, {
      action: 'prepareSEO',
      result: 'success',
      targetCollection: input.collection,
      targetDocument: input.documentId,
      changedFields,
      locale: input.locale as Locale,
    })

    return success({ id: input.documentId, changedFields })
  } catch (error) {
    await writeAuditLog(ctx, { action: 'prepareSEO', result: 'error', targetCollection: input.collection })
    return failure('invalid_input', error instanceof Error ? error.message : 'Failed to prepare SEO.')
  }
}
