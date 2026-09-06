import Link from 'next/link'
import type { Locale } from '@/i18n/locale'
import type { NavLink } from './MobileNav'

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

  return (
    <footer className="gc-tw border-t border-border bg-background">
      <div className="mx-auto w-full max-w-[76rem] px-6 py-16 md:px-10 md:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm font-bold tracking-[-0.01em] text-foreground">GLOBAL COMM<span className="text-primary">.</span></p>
            {address && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{address}</p>}
          </div>

          {footerLinks.length > 0 && (
            <nav aria-label="Footer">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{companyName}</p>
              <ul className="mt-4 space-y-2 text-sm [&_a]:text-foreground [&_a:hover]:text-primary">
                {footerLinks.map((link) => (
                  <li key={`${link.url}-${link.label}`}>
                    <Link href={link.url}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Contact</p>
            <ul className="mt-4 space-y-2 text-sm [&_a]:text-foreground [&_a:hover]:text-primary">
              {primaryEmail && (
                <li>
                  <a href={`mailto:${primaryEmail}`}>{primaryEmail}</a>
                </li>
              )}
              {primaryPhone && (
                <li>
                  <a href={`tel:${primaryPhone.replace(/\s+/g, '')}`}>{primaryPhone}</a>
                </li>
              )}
            </ul>
          </div>

          {socialLinks && socialLinks.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Social</p>
              <ul className="mt-4 space-y-2 text-sm [&_a]:text-foreground [&_a:hover]:text-primary">
                {socialLinks.map((social) =>
                  social?.url ? (
                    <li key={social.url}>
                      <a href={social.url} target="_blank" rel="noopener noreferrer">
                        {social.platform ?? social.url}
                      </a>
                    </li>
                  ) : null,
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-border pt-8 text-sm text-muted-foreground">
          <p>{copyrightText ?? `© ${year} ${companyName}`}</p>
          {legalLinks.length > 0 && (
            <nav aria-label="Legal" lang={locale}>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm [&_a]:text-muted-foreground [&_a:hover]:text-foreground">
                {legalLinks.map((link) => (
                  <li key={`${link.url}-${link.label}`}>
                    <Link href={link.url}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </footer>
  )
}
