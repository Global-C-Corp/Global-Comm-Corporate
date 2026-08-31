import Link from 'next/link'
import { locales, localeLabels, type Locale } from '@/i18n/locale'
import type { LocaleAvailability } from '@/services/seo/hreflang'
import { buildPath, type Route } from '@/services/seo/urls'

/**
 * CLAUDE.md §61. Switches using the equivalent entity's localized slug, and
 * never links to a locale whose translation isn't public — such a locale is
 * rendered as inert text instead of a 404 link.
 */
export function LanguageSwitcher({
  currentLocale,
  route,
  availability,
  label,
}: {
  currentLocale: Locale
  route: Route
  availability: LocaleAvailability
  label: string
}) {
  return (
    <nav className="gc-lang" aria-label={label}>
      {locales.map((locale) => {
        const entry = availability[locale]
        const isCurrent = locale === currentLocale

        if (isCurrent) {
          return (
            <span key={locale} className="gc-lang__item" aria-current="true">
              {localeLabels[locale]}
            </span>
          )
        }

        if (!entry?.isPublic) {
          return (
            <span key={locale} className="gc-lang__item gc-lang__item--disabled" aria-disabled="true">
              {localeLabels[locale]}
            </span>
          )
        }

        const localeRoute: Route = 'slug' in route ? { ...route, slug: entry.slug ?? route.slug } : route

        return (
          <Link key={locale} className="gc-lang__item" href={buildPath(locale, localeRoute)} hrefLang={locale}>
            {localeLabels[locale]}
          </Link>
        )
      })}
    </nav>
  )
}
