import { describe, expect, it } from 'vitest'
import { canTransitionReviewStatus, reviewStatuses, type ReviewStatus } from '@/access/editorialStateMachine'
import { roles, type Role } from '@/access/roles'

/**
 * A role named for an action must be able to perform it. This asserts the
 * state machine has no dead ends: from every state a role can encounter,
 * there is a path to a state that discharges that role's responsibility.
 *
 * Terminals differ by role, and deliberately so (CLAUDE.md §24-§26):
 * editors and AI hand work off at `needs_review` and can never reach
 * `approved`; publisher and admin are the approval authority.
 */
const TERMINALS: Record<Role, ReviewStatus[]> = {
  ai_editor: ['needs_review'],
  editor: ['needs_review'],
  publisher: ['approved', 'revision_requested'],
  admin: ['approved', 'revision_requested'],
}

/**
 * States a role can find itself holding. Editors and AI only ever handle
 * their own drafts or work sent back to them; publisher and admin review
 * whatever anyone else produced, so they must cope with every state.
 */
const ENCOUNTERED: Record<Role, ReviewStatus[]> = {
  ai_editor: ['ai_draft', 'revision_requested'],
  editor: ['editorial_draft', 'revision_requested'],
  publisher: [...reviewStatuses],
  admin: [...reviewStatuses],
}

/** Breadth-first search over the transitions this role is permitted to make. */
function reaches(role: Role, from: ReviewStatus, targets: ReviewStatus[]): boolean {
  const seen = new Set<ReviewStatus>([from])
  const queue: ReviewStatus[] = [from]

  while (queue.length > 0) {
    const current = queue.shift()!
    if (targets.includes(current)) return true

    for (const next of reviewStatuses) {
      if (seen.has(next)) continue
      if (canTransitionReviewStatus(role, current, next)) {
        seen.add(next)
        queue.push(next)
      }
    }
  }

  return false
}

describe('editorial state machine reachability', () => {
  for (const role of roles) {
    for (const from of ENCOUNTERED[role]) {
      it(`${role} can drive a document out of ${from}`, () => {
        expect(reaches(role, from, TERMINALS[role])).toBe(true)
      })
    }
  }

  it('never lets an editor or AI reach approved', () => {
    for (const role of ['editor', 'ai_editor'] as const) {
      for (const from of reviewStatuses) {
        expect(canTransitionReviewStatus(role, from, 'approved')).toBe(from === 'approved')
      }
    }
  })
})
