import { z } from 'zod'
import { APPROVE_AND_PUBLISH } from '@/hooks/enforceEditorialWorkflow'
import { locales } from '@/i18n/locale'
import { writeAuditLog } from './audit'
import { assertEditorialActor, buildProvenance, detectConflict } from './guards'
import { failure, success, type OperationContext, type OperationResult } from './types'

/**
 * Fields no content operation may write, whatever the role: system fields
 * Payload owns, and the workflow fields that are set through `publish` below.
 */
const RESERVED_FIELDS = ['id', 'createdAt', 'updatedAt', '_status', 'reviewStatus', 'aiMeta', APPROVE_AND_PUBLISH]

export const updateContentSchema = z.object({
  collection: z.enum(['services', 'industries', 'projects', 'clients', 'testimonials']),
  documentId: z.number(),
  locale: z.enum(locales).optional(),
  data: z.record(z.string(), z.unknown()).default({}),
  publish: z.boolean().default(false),
  expectedUpdatedAt: z.string().optional(),
  provider: z.string().optional(),
  model: z.string().optional(),
})

export type UpdateContentInput = z.infer<typeof updateContentSchema>

/**
 * Owner decision (2026-09-28): the AI editor may edit any content field of a
 * document and publish it. What still holds on every call:
 * - access control runs as the AI user (overrideAccess: false);
 * - the editorial hook still requires a sourceNote for any metric value,
 *   blocks slug changes without the right role and checks locale completeness;
 * - provenance (aiMeta) and an audit log entry are written;
 * - a stale read is rejected instead of overwriting newer work.
 */
export async function updateContent(
  ctx: OperationContext,
  input: UpdateContentInput,
): Promise<OperationResult<{ id: number; published: boolean; changedFields: string[] }>> {
  const actorCheck = assertEditorialActor(ctx)
  if (actorCheck) {
    await writeAuditLog(ctx, { action: 'updateContent', result: 'rejected', errorCode: 'forbidden' })
    return actorCheck as OperationResult<never>
  }

  let existing
  try {
    existing = await ctx.req.payload.findByID({
      collection: input.collection,
      id: input.documentId,
      draft: true,
      depth: 0,
      locale: input.locale,
      overrideAccess: false,
      req: ctx.req,
    })
  } catch {
    return failure('not_found', 'Document not found.')
  }

  const conflict = detectConflict(existing as never, input.expectedUpdatedAt)
  if (conflict) {
    await writeAuditLog(ctx, {
      action: 'updateContent',
      result: 'rejected',
      targetCollection: input.collection,
      targetDocument: input.documentId,
      errorCode: 'conflict',
    })
    return conflict as OperationResult<never>
  }

  const data: Record<string, unknown> = {}
  const rejected: string[] = []
  for (const [key, value] of Object.entries(input.data)) {
    if (value === undefined) continue
    if (RESERVED_FIELDS.includes(key)) rejected.push(key)
    else data[key] = value
  }
  if (rejected.length > 0) {
    return failure('invalid_input', `These fields cannot be written directly: ${rejected.join(', ')}.`, { rejected })
  }

  const changedFields = Object.keys(data)
  data.aiMeta = buildProvenance(ctx, { targetLocale: input.locale })
  if (input.publish) {
    data._status = 'published'
    data[APPROVE_AND_PUBLISH] = true
  }

  try {
    await ctx.req.payload.update({
      collection: input.collection,
      id: input.documentId,
      data: data as never,
      locale: input.locale,
      draft: !input.publish,
      overrideAccess: false,
      req: ctx.req,
    })

    await writeAuditLog(ctx, {
      action: input.publish ? 'updateContent:publish' : 'updateContent',
      result: 'success',
      targetCollection: input.collection,
      targetDocument: input.documentId,
      changedFields,
      locale: input.locale,
    })

    return success({ id: input.documentId, published: input.publish, changedFields })
  } catch (error) {
    await writeAuditLog(ctx, {
      action: 'updateContent',
      result: 'error',
      targetCollection: input.collection,
      targetDocument: input.documentId,
    })
    return failure('invalid_input', error instanceof Error ? error.message : 'Failed to update the document.')
  }
}
