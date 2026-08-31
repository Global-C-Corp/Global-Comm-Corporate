import { logCmsFailure } from '@/lib/log'
import { locales } from '@/i18n/locale'
import { isLocalePublic } from '@/lib/publication'
import type { LocaleAvailability } from '@/services/seo/hreflang'
import { getPayloadClient } from './context'

type LocalizedSlugCollection = 'services' | 'projects' | 'industries'

type PageGlobalSlug = 'home-page' | 'services-page' | 'work-page' | 'company-page' | 'contact-page'

type SlugDoc = {
  _status?: string
  slug?: string | null
  translationStatus?: Record<string, string | null | undefined> | null
  meta?: { robots?: { noIndex?: boolean | null } | null } | null
}

/**
 * Per-locale slug + public status for one document. Drives reciprocal
 * hreflang alternates, the language switcher and the sitemap
 * (CLAUDE.md §58, §61, §68) from a single source of truth.
 */
export async function getLocalizedAvailability(
  collection: LocalizedSlugCollection,
  id: number | string,
): Promise<LocaleAvailability> {
  const payload = await getPayloadClient()
  const availability: LocaleAvailability = {}

  await Promise.all(
    locales.map(async (locale) => {
      try {
        const doc = (await payload.findByID({
          collection,
          id,
          locale,
          fallbackLocale: false,
          draft: false,
          depth: 0,
          overrideAccess: false,
        })) as SlugDoc

        availability[locale] = {
          isPublic: isLocalePublic(doc, locale) && !doc.meta?.robots?.noIndex,
          slug: doc.slug ?? undefined,
        }
      } catch (error) {
        // Not readable anonymously (unpublished) — not a public locale.
        logCmsFailure(`availability(${collection}, ${locale})`, error)
        availability[locale] = { isPublic: false }
      }
    }),
  )

  return availability
}

/** Same invariant for the static page globals, whose routes carry no slug. */
export async function getGlobalAvailability(slug: PageGlobalSlug): Promise<LocaleAvailability> {
  const payload = await getPayloadClient()
  const availability: LocaleAvailability = {}

  await Promise.all(
    locales.map(async (locale) => {
      try {
        const doc = (await payload.findGlobal({
          slug,
          locale,
          fallbackLocale: false,
          draft: false,
          depth: 0,
          overrideAccess: false,
        })) as SlugDoc

        availability[locale] = {
          isPublic: isLocalePublic(doc, locale) && !doc.meta?.robots?.noIndex,
        }
      } catch (error) {
        logCmsFailure(`availability(${slug}, ${locale})`, error)
        availability[locale] = { isPublic: false }
      }
    }),
  )

  return availability
}
