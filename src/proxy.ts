import { NextResponse, type NextRequest } from 'next/server'
import { services } from '@/content/services'
import { PILLARS, ROOT_MERGES } from '@/services/cms/pillarConfig'

/**
 * Edge request handling — the `middleware` convention, renamed to `proxy` in
 * Next.js 16.
 *
 * The public site is single-language and unprefixed. Two things still need to
 * happen at the edge:
 *
 *   1. Trailing slashes are normalized away, so one page never answers at two
 *      addresses (§54).
 *   2. Every URL the site published under `/fr/`, `/en/` or `/es/` keeps
 *      working. Those were indexed and linked, so they redirect permanently to
 *      their unprefixed equivalent rather than 404.
 *
 * Payload still stores three locales; the frontend simply no longer routes on
 * them.
 */

/**
 * The prefixes the site actually published under, written out here rather than
 * imported from `src/i18n/locale.ts`.
 *
 * This list is historical fact: it must keep matching `/fr`, `/en` and `/es`
 * for as long as those URLs exist on the web. The Payload locale list is a
 * live setting — adding or removing a locale there must not silently start or
 * stop redirecting a public URL.
 */
const LEGACY_LOCALE_PREFIXES = ['fr', 'en', 'es'] as const

const PILLAR_SLUGS = new Set(services.map((service) => service.slug))

/**
 * Every service slug the site ever published — the pre-consolidation slugs and
 * the three locales' slugs — mapped onto the one page that now covers it.
 * `pillarConfig` is the authority; this only restates it as a lookup.
 */
const LEGACY_SERVICE_SLUGS: Record<string, string> = (() => {
  const map: Record<string, string> = {}

  for (const [key, pillar] of Object.entries(PILLARS)) {
    const target = pillar.slugs.fr
    map[key] = target
    for (const slug of [...Object.values(pillar.slugs), ...Object.values(pillar.previousSlugs)]) {
      map[slug] = target
    }
  }

  // A root that stopped being public folds into the pillar that absorbed it.
  for (const [from, key] of Object.entries(ROOT_MERGES)) {
    const target = PILLARS[key]?.slugs.fr
    if (target) map[from] = target
  }

  return map
})()

/** Maps a path that followed the locale prefix onto its unprefixed successor. */
function successorPath(rest: string): string {
  const [section, ...tail] = rest.split('/').filter(Boolean)

  switch (section) {
    case undefined:
      return '/home'
    case 'company':
    case 'contact':
      return `/${section}`
    case 'services': {
      const slug = tail[0]
      if (!slug) return '/services'
      if (PILLAR_SLUGS.has(slug)) return `/services/${slug}`
      const target = LEGACY_SERVICE_SLUGS[slug]
      // A folded or unknown service has no page of its own; the overview is
      // the closest honest answer.
      return target ? `/services/${target}` : '/services'
    }
    case 'work':
      return tail[0] ? `/work/${tail[0]}` : '/work'
    // Industry landing pages were retired with the localized routes. The work
    // archive is what they listed.
    case 'industries':
      return '/work'
    default:
      return `/${[section, ...tail].join('/')}`
  }
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  const trimmed = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  const segments = trimmed.split('/').filter(Boolean)
  const [first, ...rest] = segments

  /*
   * Both corrections are decided before responding, so nothing here can bounce
   * a URL through an intermediate address.
   *
   * Next.js normalizes a trailing slash away with its own 308 before the proxy
   * runs, so in practice `trimmed` already equals `pathname`. Keeping the trim
   * means a URL that does reach here with a slash is still mapped in one hop
   * rather than falling through unhandled. Disabling that framework redirect
   * (`skipTrailingSlashRedirect`) would let the proxy own both corrections, but
   * it also turns normalization off for /admin and /api, which this refactor
   * has no business changing.
   */
  const isLegacyLocale = Boolean(first) && (LEGACY_LOCALE_PREFIXES as readonly string[]).includes(first)
  const destination = isLegacyLocale ? successorPath(rest.join('/')) : trimmed

  if (destination === pathname) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = destination
  url.search = search
  return NextResponse.redirect(url, 308)
}

export const config = {
  // Payload admin, API routes, design mockups, static assets and files are
  // never rewritten.
  matcher: [
    '/((?!admin|api|preview|design|_next/static|_next/image|media|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
}
