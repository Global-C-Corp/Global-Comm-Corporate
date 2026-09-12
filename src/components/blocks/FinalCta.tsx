import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Container, Grid } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { finalCTA } = homeV5

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

          <div className="mt-14 lg:col-span-4 lg:mt-0 lg:flex lg:flex-col lg:justify-end">
            <p className="max-w-[38ch] text-copy-16 text-primary-foreground/85">{finalCTA.support}</p>

            <Separator className="mt-8 bg-primary-foreground/25" />

            <Button
              asChild
              size="lg"
              className="mt-8 w-fit bg-background text-foreground hover:bg-foreground hover:text-background focus-visible:outline-background"
            >
              <Link href={finalCTA.action.href}>
                {finalCTA.action.label}
                <ArrowRight aria-hidden className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>

            <p className="mt-6 font-[family-name:var(--font-geist-mono)] text-label-12 uppercase text-primary-foreground/85">
              Rabat · Morocco — FR / EN / ES
            </p>
          </div>
        </Grid>
      </Container>
    </section>
  )
}
