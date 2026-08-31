import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { isLocale, type Locale } from '@/i18n/locale'
import type { SiteDefaults } from '@/services/seo/resolvePageSEO'
import { getSiteChrome } from './globals'
import type { QueryContext } from './context'

export type PageContext = {
  locale: Locale
  draft: boolean
  ctx: QueryContext
  site: SiteDefaults
}

/**
 * Shared per-request setup for every public page: validates the locale
 * segment, resolves draft mode, and loads site-level SEO defaults once.
 */
export async function getPageContext(localeParam: string): Promise<PageContext> {
  if (!isLocale(localeParam)) notFound()
  const locale: Locale = localeParam

  const { isEnabled: draft } = await draftMode()
  const ctx: QueryContext = { locale, draft }
  const { settings } = await getSiteChrome(locale, draft)

  return {
    locale,
    draft,
    ctx,
    site: {
      siteName: settings?.shortName || settings?.companyName || 'Global Comm',
      defaultTitle: settings?.defaultSEO?.title,
      defaultDescription: settings?.defaultSEO?.description,
      defaultOGImage: settings?.defaultOGImage,
    },
  }
}
