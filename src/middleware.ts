import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale, locales } from '@/i18n/locale'

/**
 * CLAUDE.md §12, §51, §54: every public route carries a locale prefix, `/`
 * redirects to the default locale, and there is no duplicate unprefixed
 * homepage. Trailing slashes are normalized away (§54).
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (pathname.length > 1 && pathname.endsWith('/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(/\/+$/, '')
    return NextResponse.redirect(url, 308)
  }

  const firstSegment = pathname.split('/')[1] ?? ''
  if ((locales as readonly string[]).includes(firstSegment)) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = pathname === '/' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`
  url.search = search
  return NextResponse.redirect(url, 307)
}

export const config = {
  // Payload admin, API routes, design mockups, static assets and files are
  // never localized.
  matcher: [
    '/((?!admin|api|preview|design|_next/static|_next/image|media|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
}
