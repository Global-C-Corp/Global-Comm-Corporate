import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

const BASE = 'http://localhost:3000'

/**
 * Every URL the consolidation removed must 301 to a page that returns 200, in
 * all three locales (CLAUDE.md §70).
 *
 * Cases come from the committed manifest that `pnpm run redirects:generate`
 * writes, so the set under test is the same set that was written to Payload and
 * is reviewable in the diff. Reading it from a file rather than booting Payload
 * inside a Playwright worker also keeps this suite independent of the CMS
 * runtime.
 */

type RedirectCase = { from: string; to: string; reason: string }

const cases: RedirectCase[] = JSON.parse(readFileSync('tests/fixtures/redirects.json', 'utf8'))

const EXPECTED = {
  // 30 folded services x 3 locales
  'folded-service': 90,
  // 13 industries x 3 locales
  industry: 39,
  // 3 renamed pillars x 3 locales; Marketing digital keeps its slugs
  'pillar-renamed': 9,
} as const

test('the manifest covers every removed URL in every locale', () => {
  for (const [reason, count] of Object.entries(EXPECTED)) {
    expect(cases.filter((entry) => entry.reason === reason), `${reason} redirects`).toHaveLength(count)
  }
  expect(cases).toHaveLength(138)

  // A locale silently missing would still satisfy the totals above.
  for (const locale of ['fr', 'en', 'es']) {
    const forLocale = cases.filter((entry) => entry.from.startsWith(`/${locale}/`))
    expect(forLocale.length, `${locale} redirects`).toBe(46)
  }
})

test('no redirect points at itself or duplicates a source', () => {
  const sources = cases.map((entry) => entry.from)
  expect(new Set(sources).size, 'duplicate source URLs').toBe(sources.length)
  expect(cases.filter((entry) => entry.from === entry.to)).toEqual([])
})

/**
 * Payload records these as type "301", but Next's permanentRedirect() serves
 * 308 Permanent Redirect. The two are equivalent for SEO — Google treats 301
 * and 308 identically and passes the same signals — and 308 additionally
 * preserves the request method. The assertion names the status actually served
 * rather than the one stored, so a regression to a temporary redirect (307) or
 * a 404 fails loudly.
 */
const PERMANENT = 308

test('every removed URL permanently redirects to a page that returns 200', async ({ request }) => {
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

  expect(failures, `${failures.length} of ${cases.length} redirects are broken:\n${failures.join('\n')}`).toEqual([])
})

test('an unknown slug still 404s rather than redirecting somewhere', async ({ request }) => {
  for (const path of ['/fr/services/inexistant', '/fr/industries/inexistant']) {
    const response = await request.get(`${BASE}${path}`, { maxRedirects: 0 })
    expect(response.status(), `${path} should 404`).toBe(404)
  }
})

test('the four pillars are the only service pages that render', async ({ request }) => {
  const pillars = [
    '/fr/services/recherche-audit-strategie',
    '/fr/services/branding-communication',
    '/fr/services/marketing-digital',
    '/fr/services/automatisation-ia',
  ]

  for (const path of pillars) {
    const response = await request.get(`${BASE}${path}`, { maxRedirects: 0 })
    expect(response.status(), `${path} should render`).toBe(200)
  }
})
