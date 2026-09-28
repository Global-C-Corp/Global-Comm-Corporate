/**
 * The one canonical production host. Deliberately a constant rather than an
 * env var: canonical URLs must never point at localhost, a preview deployment
 * or a CMS alias.
 */
export const PRODUCTION_ORIGIN = 'https://globalcomm.ma'

/** Stripped from every canonical URL. */
export const TRACKING_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'fbclid',
] as const

/**
 * Every public page the site serves. The site is single-language, so a route
 * is fully described by its type and slug — there is no locale to carry.
 */
export type Route =
  | { type: 'home' }
  | { type: 'company' }
  | { type: 'services' }
  | { type: 'service'; slug: string }
  | { type: 'work' }
  | { type: 'project'; slug: string }
  | { type: 'contact' }

/**
 * The single route builder used by canonical URLs, the sitemap, internal
 * links, OG URLs and redirects. No trailing slash.
 *
 * `/home` is the homepage. `/` redirects to it rather than serving the same
 * content at two addresses.
 */
export function buildPath(route: Route): string {
  switch (route.type) {
    case 'home':
      return '/home'
    case 'company':
      return '/company'
    case 'services':
      return '/services'
    case 'service':
      return `/services/${route.slug}`
    case 'work':
      return '/work'
    case 'project':
      return `/work/${route.slug}`
    case 'contact':
      return '/contact'
  }
}

export function buildAbsoluteURL(route: Route): string {
  return `${PRODUCTION_ORIGIN}${buildPath(route)}`
}

/** Removes tracking parameters and any trailing slash. */
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
