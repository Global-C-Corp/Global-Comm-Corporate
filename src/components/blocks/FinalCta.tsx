import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container, Grid } from '@/components/blocks/Layout'
import { homeV4 } from '@/content/homeV4'

const { finalCTA } = homeV4

/**
 * 08 — Appel à l'action final.
 *
 * Second et dernier pic d'intensité. La section entière passe en #0000FF :
 * c'est le moment de marque de la page, et la raison pour laquelle le bleu
 * reste rare partout ailleurs.
 *
 * L'impact vient du bleu, de l'espace, de l'échelle et du contraste. Aucun
 * dégradé, aucun halo, aucun flou, aucune ombre.
 */
export function FinalCta() {
  return (
    <section className="bg-primary text-primary-foreground" aria-labelledby="cta-heading">
      <Container className="flex min-h-[34rem] flex-col justify-center py-28 md:min-h-[38rem] md:py-32">
        <Grid>
          <h2
            id="cta-heading"
            className="text-heading-40 sm:text-heading-56 lg:col-span-8 lg:text-heading-64"
          >
            {finalCTA.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>

          <div className="mt-12 lg:col-span-4 lg:mt-0 lg:flex lg:flex-col lg:justify-end">
            <p className="max-w-[38ch] text-copy-16 text-primary-foreground/85">{finalCTA.support}</p>
            <Link
              href={finalCTA.action.href}
              className="group mt-8 inline-flex items-center gap-3 border-b border-primary-foreground/40 pb-3 text-copy-18 text-primary-foreground transition-colors duration-150 hover:border-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-background"
            >
              {finalCTA.action.label}
              <ArrowRight
                aria-hidden
                className="size-5 transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Grid>
      </Container>
    </section>
  )
}
