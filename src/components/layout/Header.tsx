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
    <header className="gc-tw sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-[76rem] items-center justify-between gap-8 px-6 py-5 md:px-10">
        <Link href={buildPath(locale, { type: 'home' })} className="text-sm font-bold tracking-[-0.01em] text-foreground">
          GLOBAL COMM<span className="text-primary">.</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label={dictionary.a11y.primaryNav}>
          {links.map((link) => (
            <Link
              key={`${link.url}-${link.label}`}
              href={link.url}
              className="text-sm text-foreground hover:text-primary"
              target={link.opensInNewTab ? '_blank' : undefined}
              rel={link.opensInNewTab ? 'noopener noreferrer' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
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
