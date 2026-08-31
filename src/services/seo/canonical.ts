import type { Locale } from '@/i18n/locale'
import { buildAbsoluteURL, PRODUCTION_ORIGIN, type Route } from './urls'

/**
 * CLAUDE.md §47-§48, §56. Every publicly indexable language page is
 * self-canonical; cross-language canonicalization is forbidden. An override
 * is accepted only when it is a syntactically valid absolute HTTPS URL.
 */
export function isValidCanonicalOverride(value: string, { allowExternalHost = false } = {}): boolean {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    return false
  }
  if (url.protocol !== 'https:') return false
  if (!allowExternalHost && url.origin !== PRODUCTION_ORIGIN) return false
  return true
}

export function buildCanonical(locale: Locale, route: Route): string {
  return buildAbsoluteURL(locale, route)
}

export function resolveCanonical({
  locale,
  route,
  canonicalOverride,
  allowExternalHost = false,
}: {
  locale: Locale
  route: Route
  canonicalOverride?: string | null
  allowExternalHost?: boolean
}): string {
  if (canonicalOverride && isValidCanonicalOverride(canonicalOverride, { allowExternalHost })) {
    return canonicalOverride
  }
  return buildCanonical(locale, route)
}
