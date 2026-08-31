import { describe, expect, it } from 'vitest'
import { buildAlternates } from '@/services/seo/hreflang'
import { buildCanonical, isValidCanonicalOverride, resolveCanonical } from '@/services/seo/canonical'
import { buildPath, PRODUCTION_ORIGIN, stripTrackingParams } from '@/services/seo/urls'
import { resolvePageSEO } from '@/services/seo/resolvePageSEO'

/** CLAUDE.md §47-§59, §132-§133. */
describe('canonical URLs', () => {
  it('builds absolute HTTPS URLs on the production host', () => {
    const canonical = buildCanonical('en', { type: 'project', slug: 'brand-system' })
    expect(canonical).toBe('https://globalcomm.ma/en/work/brand-system')
    expect(canonical.startsWith('https://')).toBe(true)
  })

  it('self-canonicalizes each locale rather than pointing at the default locale', () => {
    expect(buildCanonical('es', { type: 'home' })).toBe('https://globalcomm.ma/es')
    expect(buildCanonical('en', { type: 'services' })).toBe('https://globalcomm.ma/en/services')
    expect(buildCanonical('fr', { type: 'services' })).not.toBe(buildCanonical('en', { type: 'services' }))
  })

  it('uses the localized slug for each locale', () => {
    expect(buildPath('fr', { type: 'service', slug: 'strategie-de-marque' })).toBe('/fr/services/strategie-de-marque')
    expect(buildPath('es', { type: 'service', slug: 'estrategia-de-marca' })).toBe('/es/services/estrategia-de-marca')
  })

  it('emits no trailing slash', () => {
    expect(buildPath('fr', { type: 'home' })).toBe('/fr')
    expect(buildPath('fr', { type: 'contact' }).endsWith('/')).toBe(false)
  })

  it('strips tracking parameters', () => {
    const stripped = stripTrackingParams(
      'https://globalcomm.ma/en/work/project?utm_source=linkedin&utm_medium=social&gclid=abc',
    )
    expect(stripped).toBe('https://globalcomm.ma/en/work/project')
  })

  it('keeps non-tracking query parameters', () => {
    expect(stripTrackingParams('https://globalcomm.ma/fr/work?service=branding&utm_source=x')).toBe(
      'https://globalcomm.ma/fr/work?service=branding',
    )
  })

  it('rejects overrides that are not absolute HTTPS URLs on a trusted host', () => {
    expect(isValidCanonicalOverride('http://globalcomm.ma/fr')).toBe(false)
    expect(isValidCanonicalOverride('/fr/services')).toBe(false)
    expect(isValidCanonicalOverride('https://preview.vercel.app/fr')).toBe(false)
    expect(isValidCanonicalOverride('https://globalcomm.ma/fr/company')).toBe(true)
  })

  it('falls back to the computed canonical when an override is invalid', () => {
    expect(
      resolveCanonical({ locale: 'fr', route: { type: 'company' }, canonicalOverride: 'http://localhost:3000/fr' }),
    ).toBe(`${PRODUCTION_ORIGIN}/fr/company`)
  })
})

describe('hreflang alternates', () => {
  it('includes only public translations', () => {
    const alternates = buildAlternates({
      route: { type: 'service', slug: 'brand-strategy' },
      availability: {
        fr: { isPublic: true, slug: 'strategie-de-marque' },
        en: { isPublic: true, slug: 'brand-strategy' },
        es: { isPublic: false },
      },
    })

    expect(alternates.languages.fr).toBe('https://globalcomm.ma/fr/services/strategie-de-marque')
    expect(alternates.languages.en).toBe('https://globalcomm.ma/en/services/brand-strategy')
    expect(alternates.languages.es).toBeUndefined()
  })

  it('omits a public locale that has no slug for a slugged route', () => {
    const alternates = buildAlternates({
      route: { type: 'project', slug: 'x' },
      availability: { fr: { isPublic: true }, en: { isPublic: true, slug: 'x' } },
    })
    expect(alternates.languages.fr).toBeUndefined()
    expect(alternates.languages.en).toBe('https://globalcomm.ma/en/work/x')
  })

  it('points x-default at the default locale when it is public', () => {
    const alternates = buildAlternates({
      route: { type: 'home' },
      availability: { fr: { isPublic: true }, en: { isPublic: true }, es: { isPublic: true } },
    })
    expect(alternates.languages['x-default']).toBe('https://globalcomm.ma/fr')
  })

  it('omits x-default when the default locale is not public', () => {
    const alternates = buildAlternates({
      route: { type: 'home' },
      availability: { fr: { isPublic: false }, en: { isPublic: true } },
    })
    expect(alternates.languages['x-default']).toBeUndefined()
  })
})

describe('metadata resolution', () => {
  const site = { siteName: 'Global Comm', defaultTitle: 'Global Comm', defaultDescription: 'Default description' }

  it('applies the SEO fallback chain', () => {
    const metadata = resolvePageSEO({
      entity: { title: 'Projet X', excerpt: 'Un résumé' },
      locale: 'fr',
      route: { type: 'project', slug: 'projet-x' },
      site,
      availability: { fr: { isPublic: true, slug: 'projet-x' } },
    })

    expect(metadata.title).toBe('Projet X — Global Comm')
    expect(metadata.description).toBe('Un résumé')
  })

  it('prefers explicit SEO values over derived ones', () => {
    const metadata = resolvePageSEO({
      entity: { title: 'Projet X', excerpt: 'Un résumé', meta: { title: 'Explicit', description: 'Explicit desc' } },
      locale: 'fr',
      route: { type: 'project', slug: 'projet-x' },
      site,
      availability: {},
    })

    expect(metadata.title).toBe('Explicit')
    expect(metadata.description).toBe('Explicit desc')
  })

  it('sets og:url equal to the canonical URL', () => {
    const metadata = resolvePageSEO({
      entity: { name: 'Branding' },
      locale: 'en',
      route: { type: 'service', slug: 'branding' },
      site,
      availability: { en: { isPublic: true, slug: 'branding' } },
    })

    expect(metadata.openGraph?.url).toBe(metadata.alternates?.canonical)
    expect(metadata.openGraph?.url).toBe('https://globalcomm.ma/en/services/branding')
  })

  it('marks preview responses noindex', () => {
    const metadata = resolvePageSEO({
      entity: { name: 'Branding' },
      locale: 'en',
      route: { type: 'service', slug: 'branding' },
      site,
      availability: {},
      isPreview: true,
    })

    expect(metadata.robots).toMatchObject({ index: false })
  })

  it('honours a stored noIndex flag', () => {
    const metadata = resolvePageSEO({
      entity: { name: 'Branding', meta: { robots: { noIndex: true } } },
      locale: 'en',
      route: { type: 'service', slug: 'branding' },
      site,
      availability: {},
    })

    expect(metadata.robots).toMatchObject({ index: false })
  })
})
