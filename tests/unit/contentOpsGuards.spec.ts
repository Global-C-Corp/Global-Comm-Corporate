import { describe, expect, it } from 'vitest'
import { applyFieldWhitelist, detectConflict, filterEvidencedMetrics } from '@/services/content-ops/guards'
import { isLocalePublic } from '@/lib/publication'
import { logCmsFailure } from '@/lib/log'
import { slugify } from '@/lib/slugify'
import { localizeNavHref } from '@/lib/nav'
import { translateApprovedTerm } from '@/i18n/terminology'

/** CLAUDE.md §36, §105, §112, §113, §128. */
describe('AI field whitelists', () => {
  it('keeps allowed fields and rejects everything else', () => {
    const { data, rejected } = applyFieldWhitelist(
      { title: 'ok', _status: 'published', reviewStatus: 'approved', meta: {} },
      ['title', 'meta'],
    )

    expect(data).toEqual({ title: 'ok', meta: {} })
    expect(rejected).toEqual(['_status', 'reviewStatus'])
  })

  it('drops undefined values instead of writing nulls', () => {
    const { data } = applyFieldWhitelist({ title: 'ok', excerpt: undefined }, ['title', 'excerpt'])
    expect(data).toEqual({ title: 'ok' })
  })
})

describe('AI evidence policy', () => {
  it('drops a metric value that has no source', () => {
    const { kept, dropped } = filterEvidencedMetrics([
      { value: '+45%', label: 'Growth' },
      { value: '1.2M', label: 'Reach', sourceNote: 'Client analytics export, 2025' },
      { label: 'Awareness' },
    ])

    expect(dropped).toBe(1)
    expect(kept).toHaveLength(2)
    expect(kept.some((metric) => metric.value === '+45%')).toBe(false)
  })

  it('keeps a labelled metric with no value at all', () => {
    const { kept, dropped } = filterEvidencedMetrics([{ label: 'Pending measurement' }])
    expect(dropped).toBe(0)
    expect(kept).toHaveLength(1)
  })
})

describe('concurrency guard', () => {
  it('refuses to modify an approved document', () => {
    const conflict = detectConflict({ reviewStatus: 'approved' })
    expect(conflict?.ok).toBe(false)
  })

  it('refuses when the document changed since it was read', () => {
    const conflict = detectConflict(
      { reviewStatus: 'ai_draft', updatedAt: '2026-01-02T00:00:00.000Z' },
      '2026-01-01T00:00:00.000Z',
    )
    expect(conflict?.ok).toBe(false)
  })

  it('permits an unchanged draft', () => {
    expect(
      detectConflict({ reviewStatus: 'ai_draft', updatedAt: '2026-01-01T00:00:00.000Z' }, '2026-01-01T00:00:00.000Z'),
    ).toBeNull()
  })
})

describe('locale publication invariant', () => {
  it('requires published status and an approved translation', () => {
    expect(isLocalePublic({ _status: 'published', translationStatus: { frStatus: 'approved' } }, 'fr')).toBe(true)
    expect(isLocalePublic({ _status: 'draft', translationStatus: { frStatus: 'approved' } }, 'fr')).toBe(false)
    expect(isLocalePublic({ _status: 'published', translationStatus: { frStatus: 'needs_review' } }, 'fr')).toBe(false)
    expect(isLocalePublic({ _status: 'published', translationStatus: {} }, 'es')).toBe(false)
  })

  it('supports a required-fields check', () => {
    const doc = { _status: 'published', translationStatus: { enStatus: 'approved' } }
    expect(isLocalePublic(doc, 'en', () => false)).toBe(false)
  })
})

describe('slug and nav helpers', () => {
  it('slugifies accented multilingual names', () => {
    expect(slugify('Stratégie de marque')).toBe('strategie-de-marque')
    expect(slugify('Généración & Leads!')).toBe('generacion-leads')
  })

  it('prefixes internal nav targets with the locale and leaves external URLs alone', () => {
    expect(localizeNavHref('es', '/work')).toBe('/es/work')
    expect(localizeNavHref('fr', '/')).toBe('/fr')
    expect(localizeNavHref('en', 'https://example.com')).toBe('https://example.com')
    expect(localizeNavHref('en', 'mailto:hello@example.com')).toBe('mailto:hello@example.com')
  })
})

describe('terminology glossary', () => {
  it('normalizes approved terms when translating', () => {
    expect(translateApprovedTerm('We handle Lead Generation for you', 'en', 'fr')).toContain('Génération de leads')
  })
})

describe('CMS failure logging', () => {
  const captureLog = (error: unknown): string[] => {
    const lines: string[] = []
    const original = console.error
    console.error = (...args: unknown[]) => lines.push(args.join(' '))
    try {
      logCmsFailure('scope', error)
    } finally {
      console.error = original
    }
    return lines
  }

  it('stays quiet for a document that is simply not public', () => {
    expect(captureLog(Object.assign(new Error('nope'), { name: 'Forbidden', status: 403 }))).toHaveLength(0)
    expect(captureLog(Object.assign(new Error('gone'), { name: 'NotFound', status: 404 }))).toHaveLength(0)
  })

  it('stays quiet for an editorial workflow refusal', () => {
    // Subclasses APIError, so it would otherwise read as an outage.
    expect(captureLog(Object.assign(new Error('not approved'), { name: 'EditorialWorkflowError', status: 400 })))
      .toHaveLength(0)
  })

  it('reports a real failure as an incident', () => {
    expect(captureLog(new Error('relation "clients" does not exist'))).toHaveLength(1)
    expect(captureLog(Object.assign(new Error('boom'), { name: 'APIError', status: 500 }))).toHaveLength(1)
  })
})
