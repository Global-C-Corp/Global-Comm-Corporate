import { describe, expect, it } from 'vitest'
import { canPublish, canTransitionReviewStatus, defaultReviewStatus } from '@/access/editorialStateMachine'

/** CLAUDE.md §26, §128 — role and state-transition rules. */
describe('editorial state machine', () => {
  it('lets AI draft and submit for review', () => {
    expect(canTransitionReviewStatus('ai_editor', undefined, 'ai_draft')).toBe(true)
    expect(canTransitionReviewStatus('ai_editor', 'ai_draft', 'ai_draft')).toBe(true)
    expect(canTransitionReviewStatus('ai_editor', 'ai_draft', 'needs_review')).toBe(true)
    expect(canTransitionReviewStatus('ai_editor', 'revision_requested', 'ai_draft')).toBe(true)
    expect(canTransitionReviewStatus('ai_editor', 'revision_requested', 'needs_review')).toBe(true)
  })

  it('never lets AI approve', () => {
    expect(canTransitionReviewStatus('ai_editor', 'needs_review', 'approved')).toBe(false)
    expect(canTransitionReviewStatus('ai_editor', 'ai_draft', 'approved')).toBe(false)
    expect(canTransitionReviewStatus('ai_editor', 'revision_requested', 'approved')).toBe(false)
  })

  it('never lets an editor approve', () => {
    expect(canTransitionReviewStatus('editor', 'needs_review', 'approved')).toBe(false)
    expect(canTransitionReviewStatus('editor', 'editorial_draft', 'needs_review')).toBe(true)
  })

  it('lets a publisher approve or request revisions from needs_review', () => {
    expect(canTransitionReviewStatus('publisher', 'needs_review', 'approved')).toBe(true)
    expect(canTransitionReviewStatus('publisher', 'needs_review', 'revision_requested')).toBe(true)
  })

  it('treats admin as unrestricted', () => {
    expect(canTransitionReviewStatus('admin', 'ai_draft', 'approved')).toBe(true)
  })

  it('rejects transitions for an unauthenticated actor', () => {
    expect(canTransitionReviewStatus(undefined, undefined, 'ai_draft')).toBe(false)
  })

  it('allows only publisher and admin to publish', () => {
    expect(canPublish('publisher')).toBe(true)
    expect(canPublish('admin')).toBe(true)
    expect(canPublish('editor')).toBe(false)
    expect(canPublish('ai_editor')).toBe(false)
    expect(canPublish(undefined)).toBe(false)
  })

  it('defaults AI-created documents to ai_draft and human ones to editorial_draft', () => {
    expect(defaultReviewStatus('ai_editor')).toBe('ai_draft')
    expect(defaultReviewStatus('editor')).toBe('editorial_draft')
    expect(defaultReviewStatus(undefined)).toBe('editorial_draft')
  })
})
