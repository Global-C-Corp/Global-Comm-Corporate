import { describe, expect, it } from 'vitest'
import { buildCanonical, isValidCanonicalOverride, resolveCanonical } from '@/services/seo/canonical'
import { buildPath, PRODUCTION_ORIGIN, stripTrackingParams } from '@/services/seo/urls'
import { resolvePageSEO } from '@/services/seo/resolvePageSEO'

/**
 * CLAUDE.md §47-§59, §132-§133.
 *
 * The public site is single-language and unprefixed, so there is one canonical
 * URL per page and no hreflang cluster to keep reciprocal.
 */
describe('canonical URLs', () => {
  it('builds absolute HTTPS URLs on the production host', () => {
    const canonical = buildCanonical({ type: 'project', slug: 'brand-system' })
    expect(canonical).toBe('https://globalcomm.ma/work/brand-system')
    expect(canonical.startsWith('https://')).toBe(true)
  })

  it('serves the homepage at /home, not at the bare origin', () => {
    expect(buildPath({ type: 'home' })).toBe('/home')
    expect(buildCanonical({ type: 'home' })).toBe('https://globalcomm.ma/home')
  })

  it('carries no locale prefix', () => {
    expect(buildPath({ type: 'services' })).toBe('/services')
    expect(buildPath({ type: 'service', slug: 'branding-communication' })).toBe(
      '/services/branding-communication',
    )
    expect(buildPath({ type: 'work' })).toBe('/work')
  })

  it('emits no trailing slash', () => {
    expect(buildPath({ type: 'contact' }).endsWith('/')).toBe(false)
    expect(buildPath({ type: 'company' })).toBe('/company')
  })

  it('strips tracking parameters', () => {
    const stripped = stripTrackingParams(
      'https://globalcomm.ma/work/project?utm_source=linkedin&utm_medium=social&gclid=abc',
    )
    expect(stripped).toBe('https://globalcomm.ma/work/project')
  })

  it('keeps non-tracking query parameters', () => {
    expect(stripTrackingParams('https://globalcomm.ma/work?service=branding&utm_source=x')).toBe(
      'https://globalcomm.ma/work?service=branding',
    )
  })

  it('rejects overrides that are not absolute HTTPS URLs on a trusted host', () => {
    expect(isValidCanonicalOverride('http://globalcomm.ma/home')).toBe(false)
    expect(isValidCanonicalOverride('/services')).toBe(false)
    expect(isValidCanonicalOverride('https://preview.vercel.app/home')).toBe(false)
    expect(isValidCanonicalOverride('https://globalcomm.ma/company')).toBe(true)
  })

  it('falls back to the computed canonical when an override is invalid', () => {
    expect(
      resolveCanonical({ route: { type: 'company' }, canonicalOverride: 'http://localhost:3000/home' }),
    ).toBe(`${PRODUCTION_ORIGIN}/company`)
  })
})

describe('metadata resolution', () => {
  it('applies the SEO fallback chain', () => {
    const metadata = resolvePageSEO({
      entity: { title: 'Projet X', excerpt: 'Un résumé' },
      route: { type: 'project', slug: 'projet-x' },
    })

    expect(metadata.title).toBe('Projet X — Global Comm')
    expect(metadata.description).toBe('Un résumé')
  })

  it('prefers explicit SEO values over derived ones', () => {
    const metadata = resolvePageSEO({
      entity: {
        title: 'Projet X',
        excerpt: 'Un résumé',
        meta: { title: 'Explicit', description: 'Explicit desc' },
      },
      route: { type: 'project', slug: 'projet-x' },
    })

    expect(metadata.title).toBe('Explicit')
    expect(metadata.description).toBe('Explicit desc')
  })

  it('sets og:url equal to the canonical URL', () => {
    const metadata = resolvePageSEO({
      entity: { name: 'Branding et communication' },
      route: { type: 'service', slug: 'branding-communication' },
    })

    expect(metadata.openGraph?.url).toBe(metadata.alternates?.canonical)
    expect(metadata.openGraph?.url).toBe('https://globalcomm.ma/services/branding-communication')
  })

  it('emits no hreflang alternates', () => {
    const metadata = resolvePageSEO({ entity: { name: 'Branding' }, route: { type: 'services' } })
    expect(metadata.alternates?.languages).toBeUndefined()
  })

  it('marks preview responses noindex', () => {
    const metadata = resolvePageSEO({
      entity: { name: 'Branding' },
      route: { type: 'service', slug: 'branding-communication' },
      isPreview: true,
    })

    expect(metadata.robots).toMatchObject({ index: false })
  })

  it('honours a stored noIndex flag', () => {
    const metadata = resolvePageSEO({
      entity: { name: 'Branding', meta: { robots: { noIndex: true } } },
      route: { type: 'service', slug: 'branding-communication' },
    })

    expect(metadata.robots).toMatchObject({ index: false })
  })
})
