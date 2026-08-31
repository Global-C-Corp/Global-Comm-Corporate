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

const publisherTransitions: Transition[] = [
  { from: undefined, to: 'editorial_draft' },
  { from: 'editorial_draft', to: 'editorial_draft' },
  { from: 'ai_draft', to: 'ai_draft' },
  { from: 'needs_review', to: 'needs_review' },
  { from: 'needs_review', to: 'revision_requested' },
  { from: 'needs_review', to: 'approved' },
  { from: 'approved', to: 'approved' },
  { from: 'approved', to: 'needs_review' },
  { from: 'revision_requested', to: 'revision_requested' },
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
