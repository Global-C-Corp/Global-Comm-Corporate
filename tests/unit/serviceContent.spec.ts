import { describe, expect, it } from 'vitest'
import { findService, services } from '@/content/services'
import { primaryNavigation } from '@/config/navigation'
import { homeContent } from '@/content/home'
import { PILLARS } from '@/services/cms/pillarConfig'
import { buildPath } from '@/services/seo/urls'

/**
 * The four public services are source-owned (`src/content/services.ts`), while
 * `pillarConfig` still classifies Payload's `services` taxonomy onto the same
 * four buckets. Nothing forces the two to agree at runtime, so it is asserted
 * here: if a slug or a name drifts on either side, the service pages, the
 * legacy-URL redirects in `src/proxy.ts` and the related-services links on
 * a case study stop lining up.
 */
describe('the four services', () => {
  it('matches the pillar configuration one for one', () => {
    const fromConfig = Object.values(PILLARS).map((pillar) => ({
      slug: pillar.slugs.fr,
      name: pillar.names.fr,
      positioningLine: pillar.positioning.fr,
      summary: pillar.summary.fr,
    }))

    expect([...services].sort((a, b) => a.slug.localeCompare(b.slug))).toEqual(
      fromConfig.sort((a, b) => a.slug.localeCompare(b.slug)),
    )
  })

  it('has four entries with unique slugs', () => {
    expect(services).toHaveLength(4)
    expect(new Set(services.map((service) => service.slug)).size).toBe(4)
  })

  it('resolves a known slug and rejects an unknown one', () => {
    expect(findService('marketing-digital')?.name).toBe('Marketing digital')
    expect(findService('strategie')).toBeUndefined()
  })
})

describe('links into the services', () => {
  it('lists every service in the header submenu, and nothing else', () => {
    const submenu = primaryNavigation.find((link) => link.url === '/services')?.children ?? []
    expect(submenu.map((link) => link.url)).toEqual(
      services.map((service) => buildPath({ type: 'service', slug: service.slug })),
    )
  })

  it('points every homepage expertise card at a service that exists', () => {
    for (const item of homeContent.services.items) {
      expect(findService(item.serviceSlug), `${item.title} -> ${item.serviceSlug}`).toBeDefined()
    }
  })
})
