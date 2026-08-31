import { z } from 'zod'
import { canTransitionReviewStatus, isReviewStatus } from '@/access/editorialStateMachine'
import { getRole } from '@/access/predicates'
import { writeAuditLog } from './audit'
import { assertEditorialActor } from './guards'
import { failure, success, type OperationContext, type OperationResult } from './types'

export const submitForReviewSchema = z.object({
  collection: z.enum(['services', 'industries', 'projects', 'clients', 'testimonials']),
  documentId: z.number(),
})

export type SubmitForReviewInput = z.infer<typeof submitForReviewSchema>

/**
 * CLAUDE.md §102 — ai_draft → needs_review and revision_requested →
 * needs_review only. Approval remains a human act; the shared state machine
 * is the single authority for what a role may do.
 */
export async function submitForReview(
  ctx: OperationContext,
  input: SubmitForReviewInput,
): Promise<OperationResult<{ id: number; reviewStatus: 'needs_review' }>> {
  const actorCheck = assertEditorialActor(ctx)
  if (actorCheck) {
    await writeAuditLog(ctx, { action: 'submitForReview', result: 'rejected', errorCode: 'forbidden' })
    return actorCheck as OperationResult<never>
  }

  let existing
  try {
    existing = await ctx.req.payload.findByID({
      collection: input.collection,
      id: input.documentId,
      draft: true,
      depth: 0,
      overrideAccess: false,
      req: ctx.req,
    })
  } catch {
    return failure('not_found', 'Document not found.')
  }

  const current = isReviewStatus(existing.reviewStatus) ? existing.reviewStatus : undefined
  if (!canTransitionReviewStatus(getRole(ctx.req), current, 'needs_review')) {
    await writeAuditLog(ctx, {
      action: 'submitForReview',
      result: 'rejected',
      targetCollection: input.collection,
      targetDocument: input.documentId,
      errorCode: 'forbidden',
    })
    return failure('forbidden', `Cannot move ${current ?? 'new'} to needs_review from this role.`)
  }

  try {
    await ctx.req.payload.update({
      collection: input.collection,
      id: input.documentId,
      data: { reviewStatus: 'needs_review' } as never,
      draft: true,
      overrideAccess: false,
      req: ctx.req,
    })

    await writeAuditLog(ctx, {
      action: 'submitForReview',
      result: 'success',
      targetCollection: input.collection,
      targetDocument: input.documentId,
      changedFields: ['reviewStatus'],
    })

    return success({ id: input.documentId, reviewStatus: 'needs_review' })
  } catch (error) {
    await writeAuditLog(ctx, { action: 'submitForReview', result: 'error', targetCollection: input.collection })
    return failure('invalid_input', error instanceof Error ? error.message : 'Failed to submit for review.')
  }
}
