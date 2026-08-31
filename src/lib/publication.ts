import { translationStatusKey, type Locale } from '@/i18n/locale'

export type PublishableDoc = {
  _status?: string | null
  translationStatus?: Record<string, string | null | undefined> | null
}

/**
 * Centralized publication invariant (CLAUDE.md §17). Never duplicate this
 * check in page components — import it everywhere a locale's visibility
 * needs to be decided.
 */
export function isLocalePublic(
  doc: PublishableDoc,
  locale: Locale,
  hasRequiredFields: (doc: PublishableDoc, locale: Locale) => boolean = () => true,
): boolean {
  return (
    doc._status === 'published' &&
    doc.translationStatus?.[translationStatusKey(locale)] === 'approved' &&
    hasRequiredFields(doc, locale)
  )
}
