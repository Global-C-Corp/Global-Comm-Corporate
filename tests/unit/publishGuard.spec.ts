import { describe, expect, it } from 'vitest'
import { applyEditorialGuard } from '@/hooks/enforceEditorialWorkflow'

const approvedAll = { frStatus: 'approved', enStatus: 'approved', esStatus: 'approved' }

/** CLAUDE.md §18, §27, §128 — the server-side publish guard. */
describe('publish guard', () => {
  it('blocks AI from publishing', () => {
    expect(() =>
      applyEditorialGuard({
        data: { _status: 'published' },
        originalDoc: { reviewStatus: 'approved', translationStatus: approvedAll, dirtyLocales: [] },
        role: 'ai_editor',
        operation: 'update',
      }),
    ).toThrow()
  })

  it('blocks an editor from publishing', () => {
    expect(() =>
      applyEditorialGuard({
        data: { _status: 'published' },
        originalDoc: { reviewStatus: 'approved', translationStatus: approvedAll, dirtyLocales: [] },
        role: 'editor',
        operation: 'update',
      }),
    ).toThrow()
  })

  it('blocks a publisher from publishing content that is not approved', () => {
    expect(() =>
      applyEditorialGuard({
        data: { _status: 'published' },
        originalDoc: { reviewStatus: 'needs_review', translationStatus: approvedAll, dirtyLocales: [] },
        role: 'publisher',
        operation: 'update',
      }),
    ).toThrow()
  })

  it('blocks publishing when a dirty locale is unapproved', () => {
    expect(() =>
      applyEditorialGuard({
        data: { _status: 'published' },
        originalDoc: {
          reviewStatus: 'approved',
          translationStatus: { frStatus: 'approved', enStatus: 'approved', esStatus: 'needs_review' },
          dirtyLocales: ['en', 'es'],
        },
        role: 'publisher',
        operation: 'update',
      }),
    ).toThrow()
  })

  it('allows publishing when every dirty locale is approved, and clears dirtyLocales', () => {
    const data = applyEditorialGuard({
      data: { _status: 'published' },
      originalDoc: {
        reviewStatus: 'approved',
        translationStatus: { frStatus: 'approved', enStatus: 'approved', esStatus: 'approved' },
        dirtyLocales: ['es'],
      },
      role: 'publisher',
      operation: 'update',
    })

    expect(data.dirtyLocales).toEqual([])
  })

  it('marks the edited locale dirty when localized content changes', () => {
    const data = applyEditorialGuard({
      data: { title: 'Nouveau titre' },
      originalDoc: { reviewStatus: 'editorial_draft', dirtyLocales: [] },
      role: 'editor',
      requestLocale: 'fr',
      operation: 'update',
    })

    expect(data.dirtyLocales).toEqual(['fr'])
  })

  it('does not mark a locale dirty for bookkeeping-only changes', () => {
    const data = applyEditorialGuard({
      data: { reviewStatus: 'needs_review' },
      originalDoc: { reviewStatus: 'editorial_draft', dirtyLocales: [] },
      role: 'editor',
      requestLocale: 'fr',
      operation: 'update',
    })

    expect(data.dirtyLocales).toEqual([])
  })

  it('rejects an invalid reviewStatus transition', () => {
    expect(() =>
      applyEditorialGuard({
        data: { reviewStatus: 'approved' },
        originalDoc: { reviewStatus: 'ai_draft' },
        role: 'ai_editor',
        operation: 'update',
      }),
    ).toThrow()
  })

  it('defaults a new AI document to ai_draft', () => {
    const data = applyEditorialGuard({ data: { title: 'x' }, role: 'ai_editor', operation: 'create' })
    expect(data.reviewStatus).toBe('ai_draft')
  })
})
