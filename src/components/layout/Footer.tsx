import Link from 'next/link'
import { Container, Wordmark } from '@/components/ui/Layout'
import { locales, localeLabels, type Locale } from '@/i18n/locale'
import type { NavLink } from '@/lib/nav'
import { buildPath } from '@/services/seo/urls'
import { cn } from '@/lib/utils'

const linkClass =
  'inline-flex min-h-11 items-center rounded-[2px] text-copy-14 text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

const quietLinkClass =
  'inline-flex min-h-11 items-center rounded-[2px] text-copy-13 text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

/**
 * Site footer — the approved composition (04 §12.10), on real Payload content.
 *
 * The page returns to quiet after the closing interruption: the mark and the
 * address on the left, core navigation and FR / EN / ES on the right, and one
 * hairline above the legal line. Deliberately not four columns of link lists.
 *
 * Every string here comes from Site Settings or the Navigation global; the
 * component only decides where they sit. Sections whose content the CMS does
 * not carry are omitted rather than filled.
 */
export function Footer({
  locale,
  footerLinks,
  legalLinks,
  companyName,
  copyrightText,
  primaryEmail,
  primaryPhone,
  address,
  socialLinks,
}: {
  locale: Locale
  footerLinks: NavLink[]
  legalLinks: NavLink[]
  companyName: string
  copyrightText?: string | null
  primaryEmail?: string | null
  primaryPhone?: string | null
  address?: string | null
  socialLinks?: { platform?: string | null; url?: string | null }[] | null
}) {
  const year = new Date().getFullYear()
  const socials = (socialLinks ?? []).filter(
    (social): social is { platform?: string | null; url: string } => Boolean(social?.url),
  )

  return (
    <footer className="bg-background">
      <Container className="py-14 md:py-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div>
            <Wordmark href={buildPath(locale, { type: 'home' })} />
            {address ? <p className="mt-4 text-copy-13 text-muted-foreground">{address}</p> : null}
          </div>

          <div className="flex flex-wrap items-center gap-x-10 gap-y-2">
            {footerLinks.length > 0 ? (
              <nav aria-label={companyName}>
                <ul className="flex flex-wrap items-center gap-x-8">
                  {footerLinks.map((link) => (
                    <li key={`${link.url}-${link.label}`}>
                      <Link
                        className={linkClass}
                        href={link.url}
                        target={link.opensInNewTab ? '_blank' : undefined}
                        rel={link.opensInNewTab ? 'noopener noreferrer' : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}

            {/* The locale entries point at each localized home, which is always
                public — unlike a deep route, where a missing translation would
                mean linking to a 404 (CLAUDE.md §61). */}
            <ul className="flex items-center">
              {locales.map((code) => {
                const isCurrent = code === locale
                const className = cn(
                  'inline-flex min-h-11 min-w-11 items-center justify-center rounded-[2px] px-2',
                  'font-mono text-label-12 uppercase tracking-[0.08em]',
                  'transition-colors duration-150',
                  isCurrent ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                )

                return (
                  <li key={code}>
                    {isCurrent ? (
                      <span className={className} aria-current="true">
                        {localeLabels[code]}
                      </span>
                    ) : (
                      <Link
                        className={className}
                        href={buildPath(code, { type: 'home' })}
                        hrefLang={code}
                      >
                        {localeLabels[code]}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {(primaryEmail || primaryPhone || socials.length > 0) && (
          <ul className="mt-10 flex flex-wrap items-center gap-x-8">
            {primaryEmail ? (
              <li>
                <a className={quietLinkClass} href={`mailto:${primaryEmail}`}>
                  {primaryEmail}
                </a>
              </li>
            ) : null}
            {primaryPhone ? (
              <li>
                <a className={quietLinkClass} href={`tel:${primaryPhone.replace(/\s+/g, '')}`}>
                  {primaryPhone}
                </a>
              </li>
            ) : null}
            {socials.map((social) => (
              <li key={social.url}>
                <a
                  className={quietLinkClass}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.platform ?? social.url}
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-copy-13 text-muted-foreground">
            {copyrightText ?? `© ${year} ${companyName}`}
          </p>
          {legalLinks.length > 0 ? (
            <ul className="flex flex-wrap items-center gap-x-6" lang={locale}>
              {legalLinks.map((link) => (
                <li key={`${link.url}-${link.label}`}>
                  <Link className={quietLinkClass} href={link.url}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Container>
    </footer>
  )
}
