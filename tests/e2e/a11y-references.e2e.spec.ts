import { expect, test } from '@playwright/test'

const BASE = 'http://localhost:3000'
const locales = ['fr', 'en', 'es'] as const

type Locale = (typeof locales)[number]

/**
 * Every ID an ARIA attribute points at must exist in the same document.
 *
 * A dangling `aria-labelledby` is invisible in a browser and invisible in a
 * screenshot: the section simply loses its accessible name. It reaches
 * production when a label is rendered conditionally — an optional CMS heading,
 * say — while the reference to it is not. This walks the real HTML of every
 * public template in all three locales and fails on the first broken pointer,
 * naming the attribute and the missing ID.
 *
 * `aria-controls` on a disclosure is deliberately included: the mobile menu
 * panel must exist in the DOM for the reference to resolve, even while closed.
 */

const REFERENCING_ATTRIBUTES = [
  'aria-labelledby',
  'aria-describedby',
  'aria-controls',
  'aria-owns',
  'aria-details',
  'aria-errormessage',
] as const

const PATHS: Record<Locale, string>[] = [
  { fr: '/fr', en: '/en', es: '/es' },
  { fr: '/fr/services', en: '/en/services', es: '/es/services' },
  {
    fr: '/fr/services/marketing-digital',
    en: '/en/services/digital-marketing',
    es: '/es/services/marketing-digital',
  },
  { fr: '/fr/work', en: '/en/work', es: '/es/work' },
  {
    fr: '/fr/work/amrec-55-ans-programme-unesco',
    en: '/en/work/amrec-55-years-unesco-programme',
    es: '/es/work/amrec-55-anos-programa-unesco',
  },
  { fr: '/fr/company', en: '/en/company', es: '/es/company' },
  { fr: '/fr/contact', en: '/en/contact', es: '/es/contact' },
]

for (const paths of PATHS) {
  for (const locale of locales) {
    const path = paths[locale]

    test(`aria references resolve · ${path}`, async ({ page }) => {
      const response = await page.goto(`${BASE}${path}`)
      expect(response?.status()).toBe(200)

      const dangling = await page.evaluate((attributes) => {
        const broken: { attribute: string; value: string; missing: string; on: string }[] = []

        for (const attribute of attributes) {
          for (const element of Array.from(document.querySelectorAll(`[${attribute}]`))) {
            const value = element.getAttribute(attribute) ?? ''
            // These attributes take an ID *list*, so each token is checked.
            for (const id of value.split(/\s+/).filter(Boolean)) {
              if (!document.getElementById(id)) {
                broken.push({
                  attribute,
                  value,
                  missing: id,
                  on: `${element.tagName.toLowerCase()}${element.className ? `.${String(element.className).split(/\s+/)[0]}` : ''}`,
                })
              }
            }
          }
        }

        return broken
      }, REFERENCING_ATTRIBUTES as unknown as string[])

      expect(dangling, `dangling ARIA references on ${path}`).toEqual([])
    })

    test(`ids are unique · ${path}`, async ({ page }) => {
      const response = await page.goto(`${BASE}${path}`)
      expect(response?.status()).toBe(200)

      // A duplicated ID makes every reference to it ambiguous, so the
      // guarantee above is only worth as much as this one.
      const duplicates = await page.evaluate(() => {
        const seen = new Map<string, number>()
        for (const element of Array.from(document.querySelectorAll('[id]'))) {
          const id = element.id
          if (!id) continue
          seen.set(id, (seen.get(id) ?? 0) + 1)
        }
        return Array.from(seen.entries())
          .filter(([, count]) => count > 1)
          .map(([id, count]) => `${id} ×${count}`)
      })

      expect(duplicates, `duplicate element IDs on ${path}`).toEqual([])
    })
  }
}

/**
 * Heading structure, checked on the same set of pages.
 *
 * Exactly one h1 per page, and no skipped level on the way down — h1 straight
 * to h3 leaves a screen-reader user unable to tell what the h3s belong to.
 */
for (const paths of PATHS) {
  for (const locale of locales) {
    const path = paths[locale]

    test(`heading structure · ${path}`, async ({ page }) => {
      const response = await page.goto(`${BASE}${path}`)
      expect(response?.status()).toBe(200)

      const levels = await page.evaluate(() =>
        Array.from(document.querySelectorAll('main h1, main h2, main h3, main h4, main h5, main h6')).map(
          (heading) => Number(heading.tagName.slice(1)),
        ),
      )

      expect(levels.filter((level) => level === 1), `h1 count on ${path}`).toHaveLength(1)

      const skips: string[] = []
      for (let i = 1; i < levels.length; i += 1) {
        if (levels[i] > levels[i - 1] + 1) skips.push(`h${levels[i - 1]} → h${levels[i]} at index ${i}`)
      }
      expect(skips, `skipped heading levels on ${path}`).toEqual([])
    })
  }
}
