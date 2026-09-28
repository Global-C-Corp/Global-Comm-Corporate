import Link from 'next/link'
import { Container, Wordmark } from '@/components/ui/Layout'
import { footerNavigation, legalNavigation } from '@/config/navigation'
import { copyrightText, siteConfig } from '@/config/site'
import { buildPath } from '@/services/seo/urls'

const linkClass =
  'inline-flex min-h-11 items-center rounded-[2px] text-copy-14 text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

const quietLinkClass =
  'inline-flex min-h-11 items-center rounded-[2px] text-copy-13 text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

/**
 * Site footer — the approved composition, on source-owned values.
 *
 * The page returns to quiet after the closing interruption: the mark and the
 * address on the left, core navigation on the right, and one hairline above the
 * legal line. The FR / EN / ES switcher that used to sit here is gone with the
 * rest of the locale routing.
 *
 * Sections whose content does not exist are omitted rather than filled.
 */
export function Footer() {
  const socials = siteConfig.socialLinks.filter((social) => Boolean(social.url))

  return (
    <footer className="bg-background">
      <Container className="py-14 md:py-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div>
            <Wordmark href={buildPath({ type: 'home' })} />
            {siteConfig.address ? (
              <p className="mt-4 text-copy-13 text-muted-foreground">{siteConfig.address}</p>
            ) : null}
          </div>

          {footerNavigation.length > 0 ? (
            <div className="flex flex-wrap items-center gap-x-10 gap-y-2">
              <nav aria-label={siteConfig.name}>
                <ul className="flex flex-wrap items-center gap-x-8">
                  {footerNavigation.map((link) => (
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
            </div>
          ) : null}
        </div>

        {(siteConfig.email || siteConfig.phone || socials.length > 0) && (
          <ul className="mt-10 flex flex-wrap items-center gap-x-8">
            {siteConfig.email ? (
              <li>
                <a className={quietLinkClass} href={`mailto:${siteConfig.email}`}>
                  {siteConfig.email}
                </a>
              </li>
            ) : null}
            {siteConfig.phone ? (
              <li>
                <a className={quietLinkClass} href={`tel:${siteConfig.phone.replace(/\s+/g, '')}`}>
                  {siteConfig.phone}
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
                  {social.platform || social.url}
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-copy-13 text-muted-foreground">{copyrightText}</p>
          {legalNavigation.length > 0 ? (
            <ul className="flex flex-wrap items-center gap-x-6">
              {legalNavigation.map((link) => (
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
