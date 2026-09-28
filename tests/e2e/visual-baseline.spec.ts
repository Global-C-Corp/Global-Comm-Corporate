import { expect, test } from '@playwright/test'
import { settleForScreenshot } from './visual-readiness'

const BASE = 'http://localhost:3000'

/**
 * Visual baseline for the Tailwind + shadcn migration.
 *
 * Every public template is captured at a desktop and a mobile width. Later PRs
 * migrate one template at a time and diff against these snapshots, so "does the
 * case study page still look right" is a pixel diff rather than a manual pass
 * over every page.
 *
 * Snapshots are platform-specific — Playwright suffixes each file with the
 * browser and OS it was recorded on, so a Linux baseline is only compared
 * against Linux runs. Regenerate with `pnpm run test:visual:update`.
 *
 * Exemplar entities are pinned deliberately rather than discovered at runtime,
 * so a content edit cannot silently change what is being compared:
 *
 *   service detail  → "Marketing digital", one of the four public services.
 *   case study      → AMSD, one of the three owner-approved real projects
 *                     seeded by scripts/seed-visual-reference-projects.ts. It
 *                     is pinned because it carries a year, so the metadata
 *                     block is exercised rather than skipped.
 *
 * There is no synthetic fixture behind any of these. A baseline photographs
 * the composition the public will actually see, so every record it depends on
 * is real and source-backed (CLAUDE.md §105, §126).
 *
 * The industry-detail template was captured in the original baseline and has
 * been removed here along with the route itself: industries no longer have
 * public pages, and their URLs now 308 to the work archive (covered by
 * redirects.e2e.spec.ts).
 *
 * The per-locale captures are gone for the same reason: the public site is
 * single-language and unprefixed, so /fr, /en and /es are redirects now, not
 * templates. Seven templates at two widths, not twenty-one.
 */

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
] as const

const TEMPLATES: { name: string; path: string }[] = [
  { name: 'home', path: '/home' },
  { name: 'services-index', path: '/services' },
  { name: 'service-detail', path: '/services/marketing-digital' },
  { name: 'work-index', path: '/work' },
  { name: 'case-study-detail', path: '/work/amsd-communication-institutionnelle-integree' },
  { name: 'company', path: '/company' },
  { name: 'contact', path: '/contact' },
]

for (const viewport of VIEWPORTS) {
  test.describe(`visual baseline — ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } })

    for (const template of TEMPLATES) {
      test(template.name, async ({ page }) => {
        const response = await page.goto(`${BASE}${template.path}`, {
          waitUntil: 'domcontentloaded',
        })

        // Without this a 404 or an error page would be captured as if it
        // were the template, and the baseline would encode the failure.
        expect(response?.status()).toBe(200)
        await expect(page.locator('h1').first()).toBeVisible()

        // Visual baselines must not race lazy-loaded media, and must not
        // wait on a network that never falls silent. See visual-readiness.ts.
        await settleForScreenshot(page)

        await expect(page).toHaveScreenshot(`${template.name}-${viewport.name}.png`, {
          fullPage: true,
          animations: 'disabled',
        })
      })
    }
  })
}
