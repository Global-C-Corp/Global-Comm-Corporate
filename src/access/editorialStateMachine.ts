import type { Role } from './roles'

/**
 * Custom editorial workflow state (CLAUDE.md §26), layered on top of
 * Payload's native `_status` (draft | published).
 */
export const reviewStatuses = [
  'ai_draft',
  'editorial_draft',
  'needs_review',
  'revision_requested',
  'approved',
] as const

export type ReviewStatus = (typeof reviewStatuses)[number]

/**
 * Editorial stage names for the Admin UI (CLAUDE.md §26).
 *
 * `_status` (draft | published) and `reviewStatus` are independent axes, and
 * naming positions on both of them "draft" made the model unreadable: an
 * `editorial_draft` that is also a Payload `draft` says nothing about which
 * one an editor needs to change. Stored values are unchanged — these are
 * labels only, so no migration and no rewrite of existing rows.
 */
export const reviewStatusLabels: Record<ReviewStatus, string> = {
  ai_draft: 'Written by AI',
  editorial_draft: 'In progress',
  needs_review: 'Submitted for review',
  revision_requested: 'Changes requested',
  approved: 'Approved',
}

export function isReviewStatus(value: unknown): value is ReviewStatus {
  return typeof value === 'string' && (reviewStatuses as readonly string[]).includes(value)
}

export function defaultReviewStatus(role: Role | undefined): ReviewStatus {
  return role === 'ai_editor' ? 'ai_draft' : 'editorial_draft'
}

type Transition = { from: ReviewStatus | undefined; to: ReviewStatus }

const aiTransitions: Transition[] = [
  { from: undefined, to: 'ai_draft' },
  { from: 'ai_draft', to: 'ai_draft' },
  { from: 'ai_draft', to: 'needs_review' },
  { from: 'revision_requested', to: 'ai_draft' },
  { from: 'revision_requested', to: 'needs_review' },
]

const editorTransitions: Transition[] = [
  { from: undefined, to: 'editorial_draft' },
  { from: 'editorial_draft', to: 'editorial_draft' },
  { from: 'editorial_draft', to: 'needs_review' },
  { from: 'revision_requested', to: 'editorial_draft' },
  { from: 'revision_requested', to: 'needs_review' },
]

/**
 * §26 enumerates the publisher's review-gate transitions
 * (needs_review → revision_requested | approved, approved → published), but
 * that list is not exhaustive: §23 also grants a publisher `create`,
 * `update`, `review`, `request revision` and `approve` without qualifying
 * whose document it is. Treating §26 as a whitelist left a publisher unable
 * to move a draft they had just created — a role named for an action that
 * could not perform it. A publisher therefore reviews any draft, whoever
 * authored it, and remains the approval authority §23 describes.
 */
const publisherTransitions: Transition[] = [
  { from: undefined, to: 'editorial_draft' },
  { from: 'editorial_draft', to: 'editorial_draft' },
  { from: 'editorial_draft', to: 'needs_review' },
  { from: 'editorial_draft', to: 'revision_requested' },
  { from: 'editorial_draft', to: 'approved' },
  { from: 'ai_draft', to: 'ai_draft' },
  { from: 'ai_draft', to: 'needs_review' },
  { from: 'ai_draft', to: 'revision_requested' },
  { from: 'ai_draft', to: 'approved' },
  { from: 'needs_review', to: 'needs_review' },
  { from: 'needs_review', to: 'revision_requested' },
  { from: 'needs_review', to: 'approved' },
  { from: 'approved', to: 'approved' },
  { from: 'approved', to: 'needs_review' },
  { from: 'approved', to: 'revision_requested' },
  { from: 'revision_requested', to: 'revision_requested' },
  { from: 'revision_requested', to: 'needs_review' },
  { from: 'revision_requested', to: 'approved' },
]

/**
 * Returns whether `role` may move a document's reviewStatus from `from` to `to`.
 * Admin is the escalation path and is intentionally unrestricted (CLAUDE.md §22).
 */
export function canTransitionReviewStatus(
  role: Role | undefined,
  from: ReviewStatus | undefined,
  to: ReviewStatus,
): boolean {
  if (role === 'admin') return true
  if (from === to) return true

  const table: Record<Exclude<Role, 'admin'>, Transition[]> = {
    ai_editor: aiTransitions,
    editor: editorTransitions,
    publisher: publisherTransitions,
  }

  const allowed = role ? table[role] : undefined
  if (!allowed) return false

  return allowed.some((transition) => transition.from === from && transition.to === to)
}

/** CLAUDE.md §27 — only publisher/admin may publish, and only once approved. */
export function canPublish(role: Role | undefined): boolean {
  return role === 'publisher' || role === 'admin'
}
