import { z } from 'zod'
import { APPROVE_AND_PUBLISH } from '@/hooks/enforceEditorialWorkflow'
import { locales } from '@/i18n/locale'
import { writeAuditLog } from './audit'
import { assertEditorialActor, buildProvenance, detectConflict } from './guards'
import { failure, success, type OperationContext, type OperationResult } from './types'

const PAGE_GLOBALS = ['home-page', 'services-page', 'work-page', 'company-page', 'contact-page'] as const

/**
 * System/workflow fields that an AI content payload must never set directly.
 * Publishing goes through the explicit publish flag so the normal server-side
 * editorial guard remains authoritative.
 */
const RESERVED_FIELDS = ['id', 'createdAt', 'updatedAt', '_status', 'reviewStatus', 'aiMeta', APPROVE_AND_PUBLISH]

export const updateGlobalContentSchema = z.object({
  global: z.enum(PAGE_GLOBALS),
  locale: z.enum(locales).optional(),
  data: z.record(z.string(), z.unknown()).default({}),
  publish: z.boolean().default(false),
  expectedUpdatedAt: z.string().optional(),
  provider: z.string().optional(),
  model: z.string().optional(),
})

export type UpdateGlobalContentInput = z.infer<typeof updateGlobalContentSchema>

/**
 * Guarded editor for page globals.
 *
 * Mirrors updateContent for collections while using Payload's Global API:
 * - access control always runs as the authenticated MCP actor;
 * - stale writes are rejected;
 * - workflow/system fields cannot be written directly;
 * - AI provenance and an audit log are recorded;
 * - drafts remain drafts unless publish=true is explicitly requested.
 */
export async function updateGlobalContent(
  ctx: OperationContext,
  input: UpdateGlobalContentInput,
): Promise<OperationResult<{ global: (typeof PAGE_GLOBALS)[number]; published: boolean; changedFields: string[] }>> {
  const actorCheck = assertEditorialActor(ctx)
  if (actorCheck) {
    await writeAuditLog(ctx, { action: 'updateGlobalContent', result: 'rejected', errorCode: 'forbidden' })
    return actorCheck as OperationResult<never>
  }

  let existing
  try {
    existing = await ctx.req.payload.findGlobal({
      slug: input.global,
      draft: true,
      depth: 0,
      locale: input.locale,
      overrideAccess: false,
      req: ctx.req,
    })
  } catch {
    return failure('not_found', 'Global not found.')
  }

  const conflict = detectConflict(existing as never, input.expectedUpdatedAt)
  if (conflict) {
    await writeAuditLog(ctx, {
      action: 'updateGlobalContent',
      result: 'rejected',
      targetCollection: input.global,
      targetDocument: input.global,
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
    await ctx.req.payload.updateGlobal({
      slug: input.global,
      data: data as never,
      locale: input.locale,
      draft: !input.publish,
      overrideAccess: false,
      req: ctx.req,
    })

    await writeAuditLog(ctx, {
      action: input.publish ? 'updateGlobalContent:publish' : 'updateGlobalContent',
      result: 'success',
      targetCollection: input.global,
      targetDocument: input.global,
      changedFields,
      locale: input.locale,
    })

    return success({ global: input.global, published: input.publish, changedFields })
  } catch (error) {
    await writeAuditLog(ctx, {
      action: 'updateGlobalContent',
      result: 'error',
      targetCollection: input.global,
      targetDocument: input.global,
    })
    return failure('invalid_input', error instanceof Error ? error.message : 'Failed to update the global.')
  }
}
