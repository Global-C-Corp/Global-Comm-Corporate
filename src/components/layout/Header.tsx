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
    <header className="gc-tw sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-[80rem] items-center justify-between gap-8 px-5 sm:px-6 md:px-8 lg:px-12">
        <Link
          href={buildPath(locale, { type: 'home' })}
          className="text-sm font-semibold tracking-[-0.025em] text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          GLOBAL COMM<span className="text-primary">.</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={`${link.url}-${link.label}`}
              href={link.url}
              className="text-[0.8125rem] font-medium text-foreground transition-colors duration-150 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              target={link.opensInNewTab ? '_blank' : undefined}
              rel={link.opensInNewTab ? 'noopener noreferrer' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
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
