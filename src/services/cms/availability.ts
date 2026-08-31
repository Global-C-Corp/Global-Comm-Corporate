import { locales, type Locale } from '@/i18n/locale'
import { isLocalePublic } from '@/lib/publication'
import type { LocaleAvailability } from '@/services/seo/hreflang'
import { getPayloadClient } from './context'

type LocalizedSlugCollection = 'services' | 'projects' | 'industries'

type SlugDoc = {
  _status?: string
  slug?: string | null
  translationStatus?: Partial<Record<Locale, string>>
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
      } catch {
        // Not readable anonymously (unpublished) — not a public locale.
        availability[locale] = { isPublic: false }
      }
    }),
  )

  return availability
}
