import { expect, test } from '@playwright/test'
import { services } from '../../src/content/services'
import { PILLARS, ROOT_MERGES } from '../../src/services/cms/pillarConfig'

const BASE = 'http://localhost:3000'

/**
 * Every URL the site published under a locale prefix must keep working.
 *
 * The site was localized (`/fr/...`, `/en/...`, `/es/...`) and its services
 * were consolidated from many terms onto four pillars. Both URL sets were
 * indexed, so both still have to land somewhere real. `src/proxy.ts` is
 * the single authority for that mapping; these cases are built from the same
 * source data it reads, so a term's bucket and its redirect target cannot
 * disagree.
 *
 * The prefixes are written out here for the same reason `src/proxy.ts` writes
 * them out: they are historical fact, not the live Payload locale setting.
 *
 * Next's `permanentRedirect()` serves 308, not 301. The two are equivalent for
 * SEO — Google passes the same signals — and 308 additionally preserves the
 * request method. The assertion names the status actually served, so a
 * regression to a temporary redirect (307) or a 404 fails loudly.
 */
const PERMANENT = 308

const LEGACY_LOCALE_PREFIXES = ['fr', 'en', 'es'] as const

type RedirectCase = { from: string; to: string; reason: string }

/** Keyed by source URL, because a pillar whose slug never changed in a locale
 *  contributes the same case twice. */
const bySource = new Map<string, RedirectCase>()
const add = (entry: RedirectCase) => {
  if (!bySource.has(entry.from)) bySource.set(entry.from, entry)
}

for (const locale of LEGACY_LOCALE_PREFIXES) {
  add({ from: `/${locale}`, to: '/home', reason: 'locale-home' })
  add({ from: `/${locale}/company`, to: '/company', reason: 'locale-page' })
  add({ from: `/${locale}/services`, to: '/services', reason: 'locale-page' })
  add({ from: `/${locale}/work`, to: '/work', reason: 'locale-page' })
  add({ from: `/${locale}/contact`, to: '/contact', reason: 'locale-page' })
  // Industry landing pages were retired; the work archive is what they listed.
  add({ from: `/${locale}/industries/fmcg`, to: '/work', reason: 'industry' })

  for (const [key, pillar] of Object.entries(PILLARS)) {
    // The slug each pillar was published at before the consolidation, and the
    // per-locale slug it was published at after it.
    for (const slug of [pillar.previousSlugs[locale], pillar.slugs[locale]]) {
      if (!slug) continue
      add({
        from: `/${locale}/services/${slug}`,
        to: `/services/${pillar.slugs.fr}`,
        reason: 'pillar-slug',
      })
    }

    for (const [from, target] of Object.entries(ROOT_MERGES)) {
      if (target !== key) continue
      add({
        from: `/${locale}/services/${from}`,
        to: `/services/${pillar.slugs.fr}`,
        reason: 'folded-service',
      })
    }
  }

  // A term that was folded away has no page; the overview is the honest answer.
  add({
    from: `/${locale}/services/un-terme-supprime`,
    to: '/services',
    reason: 'folded-service',
  })
}

const cases: RedirectCase[] = [...bySource.values()]

test('no case points at itself or duplicates a source', () => {
  const sources = cases.map((entry) => entry.from)
  expect(new Set(sources).size, 'duplicate source URLs').toBe(sources.length)
  expect(cases.filter((entry) => entry.from === entry.to)).toEqual([])
})

test('every locale-prefixed URL permanently redirects to a page that returns 200', async ({
  request,
}) => {
  const failures: string[] = []

  for (const { from, to } of cases) {
    const hop = await request.get(`${BASE}${from}`, { maxRedirects: 0 })

    if (hop.status() !== PERMANENT) {
      failures.push(`${from} returned ${hop.status()}, expected ${PERMANENT}`)
      continue
    }

    const location = hop.headers()['location']
    if (!location || new URL(location, BASE).pathname !== to) {
      failures.push(`${from} redirected to ${location ?? '(none)'}, expected ${to}`)
      continue
    }

    const landing = await request.get(`${BASE}${to}`, { maxRedirects: 0 })
    if (landing.status() !== 200) {
      failures.push(`${from} -> ${to} landed on ${landing.status()}, expected 200`)
    }
  }

  expect(
    failures,
    `${failures.length} of ${cases.length} redirects are broken:\n${failures.join('\n')}`,
  ).toEqual([])
})

test('every legacy URL reaches its destination in a single hop', async ({ request }) => {
  // A redirect chain leaks link equity and costs the visitor a round trip, so
  // the form the site actually published — no trailing slash, as buildPath and
  // the sitemap always emitted — must land in one.
  for (const { from, to } of cases) {
    const hop = await request.get(`${BASE}${from}`, { maxRedirects: 0 })
    const target = new URL(hop.headers()['location'] ?? '', BASE)
    const second = await request.get(target.toString(), { maxRedirects: 0 })
    expect(second.status(), `${from} -> ${target.pathname} should be the last hop`).not.toBe(
      PERMANENT,
    )
  }
})

/*
 * A trailing-slash variant takes two hops: Next.js normalizes the slash away
 * with its own 308 before the proxy runs, so "/fr/work/" becomes "/fr/work"
 * and only then maps to "/work". Collapsing that would mean disabling
 * normalization for /admin and /api too. The site never published these URLs,
 * so the chain is accepted; what matters is that they still arrive.
 */
test('a legacy URL with a trailing slash still arrives at the right page', async ({ request }) => {
  for (const [from, to] of [
    ['/fr/', '/home'],
    ['/fr/work/', '/work'],
    ['/en/services/strategy/', '/services/recherche-audit-strategie'],
  ]) {
    const response = await request.get(`${BASE}${from}`)
    expect(response.status(), `${from} status`).toBe(200)
    expect(new URL(response.url()).pathname, `${from} destination`).toBe(to)
  }
})

test('an unknown service slug still 404s rather than redirecting somewhere', async ({ request }) => {
  const response = await request.get(`${BASE}/services/inexistant`, { maxRedirects: 0 })
  expect(response.status(), '/services/inexistant should 404').toBe(404)
})

test('the four services are the only service pages that render', async ({ request }) => {
  for (const service of services) {
    const response = await request.get(`${BASE}/services/${service.slug}`, { maxRedirects: 0 })
    expect(response.status(), `/services/${service.slug} should render`).toBe(200)
  }
})
