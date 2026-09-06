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
