import type { Locale } from '@/i18n/locale'
import { routeFamilies } from '@/i18n/routing'

/**
 * The one canonical production host (CLAUDE.md §50, §55). Deliberately a
 * constant rather than an env var: canonical URLs must never point at
 * localhost, a preview deployment or a CMS alias (§138).
 */
export const PRODUCTION_ORIGIN = 'https://globalcomm.ma'

/** CLAUDE.md §52 — stripped from every canonical URL. */
export const TRACKING_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'fbclid',
] as const

export type Route =
  | { type: 'home' }
  | { type: 'services' }
  | { type: 'service'; slug: string }
  | { type: 'work' }
  | { type: 'project'; slug: string }
  | { type: 'industry'; slug: string }
  | { type: 'company' }
  | { type: 'contact' }

/**
 * The single route builder used by canonical, hreflang, the language
 * switcher, the sitemap, internal links, OG URLs and redirects
 * (CLAUDE.md §49). No trailing slash (§54).
 */
export function buildPath(locale: Locale, route: Route): string {
  switch (route.type) {
    case 'home':
      return `/${locale}`
    case 'services':
      return `/${locale}/${routeFamilies.services}`
    case 'service':
      return `/${locale}/${routeFamilies.services}/${route.slug}`
    case 'work':
      return `/${locale}/${routeFamilies.work}`
    case 'project':
      return `/${locale}/${routeFamilies.work}/${route.slug}`
    case 'industry':
      return `/${locale}/${routeFamilies.industries}/${route.slug}`
    case 'company':
      return `/${locale}/${routeFamilies.company}`
    case 'contact':
      return `/${locale}/${routeFamilies.contact}`
  }
}

export function buildAbsoluteURL(locale: Locale, route: Route): string {
  return `${PRODUCTION_ORIGIN}${buildPath(locale, route)}`
}

/** Removes tracking parameters and any trailing slash (CLAUDE.md §52, §54). */
export function stripTrackingParams(input: string): string {
  const url = new URL(input, PRODUCTION_ORIGIN)
  for (const param of TRACKING_PARAMS) {
    url.searchParams.delete(param)
  }
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.replace(/\/+$/, '')
  }
  return url.toString().replace(/\?$/, '')
}
