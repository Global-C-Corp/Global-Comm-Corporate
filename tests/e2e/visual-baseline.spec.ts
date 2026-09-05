import { expect, test } from '@playwright/test'

const BASE = 'http://localhost:3000'
const locales = ['fr', 'en', 'es'] as const

type Locale = (typeof locales)[number]

/**
 * Visual baseline for the Tailwind + shadcn migration.
 *
 * Every template is captured once per locale at a desktop and a mobile width
 * before any markup changes. Later PRs migrate one template at a time and diff
 * against these snapshots, so "does the case study page still look right" is a
 * pixel diff rather than a manual pass over 18 pages.
 *
 * Snapshots are platform-specific — Playwright suffixes each file with the
 * browser and OS it was recorded on, so a Linux baseline is only compared
 * against Linux runs. Regenerate with `pnpm run test:visual:update`.
 *
 * Exemplar entities are pinned deliberately rather than discovered at runtime,
 * so a content edit cannot silently change what is being compared:
 *
 *   service detail  → "Marketing digital", a root service that survives the
 *                     consolidation to four service pages.
 *   case study      → "AMREC — 55 ans / programme UNESCO", the published
 *                     project with the longest narrative and three metrics,
 *                     so the optional metrics block is exercised.
 *   industry detail → "Grande consommation". This template is removed in
 *                     PR 2; it is captured so the removal is a deliberate
 *                     deletion of a known baseline rather than a silent gap.
 */

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
] as const

const TEMPLATES: { name: string; paths: Record<Locale, string> }[] = [
  {
    name: 'home',
    paths: { fr: '/fr', en: '/en', es: '/es' },
  },
  {
    name: 'services-index',
    paths: { fr: '/fr/services', en: '/en/services', es: '/es/services' },
  },
  {
    name: 'service-detail',
    paths: {
      fr: '/fr/services/marketing-digital',
      en: '/en/services/digital-marketing',
      es: '/es/services/marketing-digital',
    },
  },
  {
    name: 'work-index',
    paths: { fr: '/fr/work', en: '/en/work', es: '/es/work' },
  },
  {
    name: 'case-study-detail',
    paths: {
      fr: '/fr/work/amrec-55-ans-programme-unesco',
      en: '/en/work/amrec-55-years-unesco-programme',
      es: '/es/work/amrec-55-anos-programa-unesco',
    },
  },
  {
    name: 'industry-detail',
    paths: {
      fr: '/fr/industries/grande-consommation',
      en: '/en/industries/fmcg',
      es: '/es/industries/gran-consumo',
    },
  },
  {
    name: 'company',
    paths: { fr: '/fr/company', en: '/en/company', es: '/es/company' },
  },
  {
    name: 'contact',
    paths: { fr: '/fr/contact', en: '/en/contact', es: '/es/contact' },
  },
]

for (const viewport of VIEWPORTS) {
  test.describe(`visual baseline — ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } })

    for (const template of TEMPLATES) {
      for (const locale of locales) {
        test(`${template.name} · ${locale}`, async ({ page }) => {
          const response = await page.goto(`${BASE}${template.paths[locale]}`)

          // Without this a 404 or an error page would be captured as if it
          // were the template, and the baseline would encode the failure.
          expect(response?.status()).toBe(200)
          await expect(page.locator('h1').first()).toBeVisible()

          await expect(page).toHaveScreenshot(
            `${template.name}-${locale}-${viewport.name}.png`,
            { fullPage: true, animations: 'disabled' },
          )
        })
      }
    }
  })
}
