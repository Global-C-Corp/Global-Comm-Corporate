import Link from 'next/link'
import { Container } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { footer } = homeV5

const linkClass =
  'inline-flex min-h-11 items-center rounded-[4px] text-copy-13 text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <Container className="py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p translate="no" className="text-label-12 font-semibold text-foreground">{footer.wordmark}</p>
            <p className="mt-3 text-copy-13 text-muted-foreground">{footer.location}</p>
          </div>

          <nav className="lg:col-span-2" aria-label="Footer">
            <ul className="space-y-0.5">
              {footer.links.map((item) => (
                <li key={item.label}>
                  <Link className={linkClass} href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <ul className="flex flex-wrap gap-x-2" aria-label="Languages">
              {footer.locales.map((locale) => (
                <li key={locale.label}>
                  <Link
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[4px] px-2 text-label-12 text-muted-foreground transition-colors duration-150 hover:bg-foreground/[0.05] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    href={locale.href}
                    hrefLang={locale.label.toLowerCase()}
                  >
                    {locale.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <p className="max-w-[18ch] text-copy-13 text-muted-foreground [text-wrap:balance] lg:col-span-3">
            Building brands for a brighter tomorrow.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-copy-13 text-muted-foreground">{footer.copyright}</p>
          <ul className="flex flex-wrap gap-x-5">
            {footer.legal.map((item) => (
              <li key={item.label}>
                <Link className={linkClass} href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  )
}
