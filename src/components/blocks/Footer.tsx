import Link from 'next/link'
import { Linkedin } from 'lucide-react'
import { Container } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { footer } = homeV5

export function Footer() {
  return (
    <footer className="bg-background">
      <Container className="py-10">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-label-12 font-semibold text-foreground">{footer.wordmark}</p>
            <p className="mt-2 text-copy-13 text-muted-foreground">{footer.location}</p>
          </div>

          <nav className="lg:col-span-2" aria-label="Footer">
            <ul className="space-y-1.5">
              {footer.links.map((item) => (
                <li key={item.label}>
                  <Link className="text-copy-13 text-muted-foreground hover:text-foreground" href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <ul className="flex gap-4">
              {footer.locales.map((locale) => (
                <li key={locale.label}>
                  <Link className="text-label-12 text-muted-foreground hover:text-foreground" href={locale.href}>{locale.label}</Link>
                </li>
              ))}
            </ul>
            <Linkedin aria-hidden className="mt-5 size-4 text-muted-foreground" />
          </div>

          <p className="max-w-[18ch] text-copy-13 text-muted-foreground lg:col-span-3">Building brands for a brighter tomorrow.</p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
          <p className="text-copy-13 text-muted-foreground">{footer.copyright}</p>
          <ul className="flex gap-5">
            {footer.legal.map((item) => (
              <li key={item.label}><Link className="text-copy-13 text-muted-foreground hover:text-foreground" href={item.href}>{item.label}</Link></li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  )
}
