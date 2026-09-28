import { NextResponse, type NextRequest } from 'next/server'
import { services } from '@/content/services'
import { locales } from '@/i18n/locale'
import { PILLARS, ROOT_MERGES } from '@/services/cms/pillarConfig'

/**
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

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (pathname.length > 1 && pathname.endsWith('/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(/\/+$/, '')
    return NextResponse.redirect(url, 308)
  }

  const segments = pathname.split('/').filter(Boolean)
  const [first, ...rest] = segments

  if (first && (locales as readonly string[]).includes(first)) {
    const url = request.nextUrl.clone()
    url.pathname = successorPath(rest.join('/'))
    url.search = search
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

export const config = {
  // Payload admin, API routes, design mockups, static assets and files are
  // never rewritten.
  matcher: [
    '/((?!admin|api|preview|design|_next/static|_next/image|media|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
}
