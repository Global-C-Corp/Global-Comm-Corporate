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
    <footer className="gc-footer">
      <div className="gc-container">
        <div className="gc-footer__grid">
          <div>
            <p className="gc-wordmark">GLOBAL COMM<span>.</span></p>
            {address && <p className="gc-card__body">{address}</p>}
          </div>

          {footerLinks.length > 0 && (
            <nav aria-label="Footer">
              <p className="gc-footer__heading">{companyName}</p>
              <ul className="gc-footer__list">
                {footerLinks.map((link) => (
                  <li key={`${link.url}-${link.label}`}>
                    <Link href={link.url}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div>
            <p className="gc-footer__heading">Contact</p>
            <ul className="gc-footer__list">
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
              <p className="gc-footer__heading">Social</p>
              <ul className="gc-footer__list">
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

        <div className="gc-footer__bottom">
          <p style={{ margin: 0 }}>{copyrightText ?? `© ${year} ${companyName}`}</p>
          {legalLinks.length > 0 && (
            <nav aria-label="Legal" lang={locale}>
              <ul className="gc-footer__list" style={{ gridAutoFlow: 'column', gap: '1rem' }}>
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
