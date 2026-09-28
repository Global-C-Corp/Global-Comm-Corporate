import { buildAbsoluteURL, PRODUCTION_ORIGIN, type Route } from './urls'

/**
 * Every indexable page is self-canonical. An override is accepted only when it
 * is a syntactically valid absolute HTTPS URL, and by default only on the
 * production host.
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

export function buildCanonical(route: Route): string {
  return buildAbsoluteURL(route)
}

export function resolveCanonical({
  route,
  canonicalOverride,
  allowExternalHost = false,
}: {
  route: Route
  canonicalOverride?: string | null
  allowExternalHost?: boolean
}): string {
  if (canonicalOverride && isValidCanonicalOverride(canonicalOverride, { allowExternalHost })) {
    return canonicalOverride
  }
  return buildCanonical(route)
}
