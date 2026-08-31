import Link from 'next/link'
import type { Locale } from '@/i18n/locale'
import { getDictionary } from '@/i18n/dictionaries'
import type { LocaleAvailability } from '@/services/seo/hreflang'
import { buildPath, type Route } from '@/services/seo/urls'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileNav, type NavLink } from './MobileNav'

export function Header({
  locale,
  links,
  route,
  availability,
}: {
  locale: Locale
  links: NavLink[]
  route: Route
  availability: LocaleAvailability
}) {
  const dictionary = getDictionary(locale)

  return (
    <header className="gc-header">
      <div className="gc-container gc-header__inner">
        <Link href={buildPath(locale, { type: 'home' })} className="gc-wordmark">
          GLOBAL COMM<span>.</span>
        </Link>

        <nav className="gc-nav gc-nav--primary" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={`${link.url}-${link.label}`}
              href={link.url}
              className="gc-nav__link"
              target={link.opensInNewTab ? '_blank' : undefined}
              rel={link.opensInNewTab ? 'noopener noreferrer' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="gc-header__actions">
          <LanguageSwitcher
            currentLocale={locale}
            route={route}
            availability={availability}
            label={dictionary.a11y.languageSwitcher}
          />
          <MobileNav links={links} labels={{ menu: dictionary.nav.menu, close: dictionary.nav.close }} />
        </div>
      </div>
    </header>
  )
}
