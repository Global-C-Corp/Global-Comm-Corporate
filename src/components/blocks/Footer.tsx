import Link from 'next/link'
import { Container, Wordmark } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'
import { cn } from '@/lib/utils'

const { footer } = homeV5

const linkClass =
  'inline-flex min-h-11 items-center rounded-[2px] text-copy-14 text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

/**
 * Footer — approved reference (04 §12.10).
 *
 * The page returns to quiet after the blue interruption: the mark and the
 * location on the left, core navigation in the middle, FR / EN / ES on the
 * right, and one hairline above the legal line. Generous space, no columns of
 * link lists.
 */
export function Footer() {
  return (
    <footer className="bg-background">
      <Container className="py-14 md:py-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div>
            <Wordmark />
            <p className="mt-4 text-copy-13 text-muted-foreground">{footer.location}</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-10 gap-y-2">
            <nav aria-label="Footer">
              <ul className="flex flex-wrap items-center gap-x-8">
                {footer.links.map((item) => (
                  <li key={item.label}>
                    <Link className={linkClass} href={item.href}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <ul className="flex items-center" aria-label="Languages">
              {footer.locales.map((locale) => (
                <li key={locale.label}>
                  <Link
                    className={cn(
                      'inline-flex min-h-11 min-w-11 items-center justify-center rounded-[2px] px-2',
                      'font-[family-name:var(--font-geist-mono)] text-label-12 uppercase tracking-[0.08em]',
                      'transition-colors duration-150',
                      locale.label === 'FR'
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                    )}
                    href={locale.href}
                    hrefLang={locale.label.toLowerCase()}
                    aria-current={locale.label === 'FR' ? 'true' : undefined}
                  >
                    {locale.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-copy-13 text-muted-foreground">{footer.copyright}</p>
          <ul className="flex flex-wrap items-center gap-x-6">
            {footer.legal.map((item) => (
              <li key={item.label}>
                <Link
                  className="inline-flex min-h-11 items-center rounded-[2px] text-copy-13 text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  )
}
