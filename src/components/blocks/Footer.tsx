import Link from 'next/link'
import { Container, Grid } from '@/components/blocks/Layout'
import { homeV4 } from '@/content/homeV4'

const { footer } = homeV4

/**
 * 09 — Pied de page.
 *
 * Retour immédiat au calme après le bleu. Hairlines, typographie retenue,
 * quatre liens. Pas de sitemap SaaS sur cinq colonnes.
 *
 * L'URL LinkedIn reste un emplacement : le dépôt n'en contient aucune, et
 * pointer vers un profil inventé serait pire que ne rien afficher.
 */
export function Footer() {
  return (
    <footer className="bg-background">
      <Container className="pb-10 pt-20">
        <Grid>
          <div className="lg:col-span-5">
            <p className="text-label-12 font-medium tracking-[0.04em] text-foreground">
              {footer.wordmark}
            </p>
            <p className="mt-4 text-copy-16 text-muted-foreground">{footer.location}</p>
          </div>

          <nav className="mt-10 lg:col-span-3 lg:mt-0" aria-label="Footer">
            <ul className="space-y-3">
              {footer.links.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-copy-16 text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-10 lg:col-span-2 lg:mt-0">
            <ul className="flex gap-4 lg:flex-col lg:gap-3">
              {footer.locales.map((locale) => (
                <li key={locale.label}>
                  <Link
                    href={locale.href}
                    className="font-[family-name:var(--font-geist-mono)] text-label-12 text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {locale.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 lg:col-span-2 lg:mt-0">
            <p className="font-[family-name:var(--font-geist-mono)] text-label-12 uppercase text-muted-foreground">
              {footer.external.label} — {footer.external.pending}
            </p>
          </div>
        </Grid>

        <div className="mt-20 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-border pt-8">
          <p className="text-copy-14 text-muted-foreground">{footer.copyright}</p>
          <ul className="flex gap-6">
            {footer.legal.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-copy-14 text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
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
