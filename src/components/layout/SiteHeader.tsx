import type { Locale } from '@/i18n/locale'
import { toNavLinks } from '@/lib/nav'
import { getSiteChrome } from '@/services/cms/globals'
import type { LocaleAvailability } from '@/services/seo/hreflang'
import type { Route } from '@/services/seo/urls'
import { Header } from './Header'

export async function SiteHeader({
  locale,
  route,
  availability,
  draft = false,
}: {
  locale: Locale
  route: Route
  availability: LocaleAvailability
  draft?: boolean
}) {
  const { navigation } = await getSiteChrome(locale, draft)
  const links = toNavLinks(locale, navigation?.primaryNavigation)

  return <Header locale={locale} links={links} route={route} availability={availability} />
}
