import { getDictionary } from '@/i18n/dictionaries'
import { locales, localeLabels, type Locale } from '@/i18n/locale'
import type { LocaleAvailability } from '@/services/seo/hreflang'
import { buildPath, type Route } from '@/services/seo/urls'
import { HeaderBar, type LocaleChoice } from './HeaderBar'
import type { NavLink } from '@/lib/nav'

/**
 * Server half of the site header: it resolves everything the bar renders —
 * localized navigation, the current path, and which locales may actually be
 * linked — and hands the result to the client bar, which owns only the
 * condensing behaviour and the mobile sheet.
 */
export function Header({
  locale,
  links,
  route,
  availability,
  overDark = false,
}: {
  locale: Locale
  links: NavLink[]
  route: Route
  availability: LocaleAvailability
  overDark?: boolean
}) {
  const dictionary = getDictionary(locale)
  const homeHref = buildPath(locale, { type: 'home' })
  const currentUrl = buildPath(locale, route)

  /**
   * CLAUDE.md §61: switch to the equivalent entity's localized slug, and never
   * offer a locale whose translation is not public.
   */
  const localeChoices: LocaleChoice[] = locales.map((code) => {
    if (code === locale) {
      return { code, label: localeLabels[code], href: null, isCurrent: true }
    }

    const entry = availability[code]
    if (!entry?.isPublic) {
      return { code, label: localeLabels[code], href: null, isCurrent: false }
    }

    const localeRoute: Route = 'slug' in route ? { ...route, slug: entry.slug ?? route.slug } : route
    return { code, label: localeLabels[code], href: buildPath(code, localeRoute), isCurrent: false }
  })

  return (
    <HeaderBar
      overDark={overDark}
      homeHref={homeHref}
      links={links}
      currentUrl={currentUrl}
      locales={localeChoices}
      labels={{
        menu: dictionary.nav.menu,
        close: dictionary.nav.close,
        primary: dictionary.a11y.primaryNavigation,
        languages: dictionary.a11y.languageSwitcher,
      }}
    />
  )
}
