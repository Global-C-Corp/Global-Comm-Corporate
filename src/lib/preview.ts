import type { Locale } from '@/i18n/locale'
import { defaultLocale, isLocale } from '@/i18n/locale'
import { buildPath, type Route } from '@/services/seo/urls'

export const PREVIEW_PATH = '/preview'

type PreviewTarget = { collection: string; slug?: string | null }

/**
 * Preview always renders a real public route, in the correct locale, using
 * the localized slug (CLAUDE.md §87).
 */
export function previewRouteFor({ collection, slug }: PreviewTarget): Route | null {
  switch (collection) {
    case 'services':
      return slug ? { type: 'service', slug } : { type: 'services' }
    case 'projects':
      return slug ? { type: 'project', slug } : { type: 'work' }
    case 'industries':
      return slug ? { type: 'industry', slug } : null
    case 'home-page':
      return { type: 'home' }
    case 'services-page':
      return { type: 'services' }
    case 'work-page':
      return { type: 'work' }
    case 'company-page':
      return { type: 'company' }
    case 'contact-page':
      return { type: 'contact' }
    default:
      return null
  }
}

export function previewPathFor(target: PreviewTarget, locale: Locale): string | null {
  const route = previewRouteFor(target)
  if (!route) return null
  return buildPath(locale, route)
}

/** URL handed to Payload Admin's preview button. */
export function buildPreviewURL({
  collection,
  slug,
  locale,
  serverURL,
  secret,
}: PreviewTarget & { locale: string; serverURL: string; secret: string }): string {
  const resolvedLocale: Locale = isLocale(locale) ? locale : defaultLocale
  const params = new URLSearchParams({
    secret,
    collection,
    locale: resolvedLocale,
  })
  if (slug) params.set('slug', slug)

  return `${serverURL}${PREVIEW_PATH}?${params.toString()}`
}
