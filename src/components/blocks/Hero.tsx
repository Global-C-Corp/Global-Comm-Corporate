import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Container, SectionLabel } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { hero, credibility } = homeV5

/**
 * Hero compound : eyebrow, H1, copie de soutien, actions, socle de
 * crédibilité, puis phrase de clôture.
 *
 * Composition 8/4 avec deux asymétries volontaires — la copie de soutien et
 * les actions occupent la colonne droite, démarrant plus bas que le H1, et un
 * filet bleu court ancre l'eyebrow. La densité vient de là, pas d'une
 * illustration.
 *
 * Pas de rail de logos : aucun logo client approuvé n'existe. La confiance
 * repose sur trois faits vérifiables sur la façon de travailler, ce qui vaut
 * mieux qu'une rangée de cadres vides.
 */
export function Hero() {
  return (
    <section className="bg-[#FAFAF8]" aria-labelledby="hero-heading">
      <Container className="pb-24 pt-16 md:pb-28 md:pt-20">
        <div className="flex items-center gap-4">
          <span aria-hidden className="h-px w-10 bg-primary" />
          <SectionLabel>{hero.eyebrow}</SectionLabel>
        </div>

        <div className="mt-10 grid gap-x-6 gap-y-10 lg:grid-cols-12 lg:gap-y-0">
          <h1
            id="hero-heading"
            className="text-heading-40 text-foreground sm:text-heading-48 lg:col-span-8 lg:text-heading-64 xl:text-heading-72"
          >
            {hero.heading}
          </h1>

          <div className="lg:col-span-4 lg:flex lg:flex-col lg:justify-end lg:pb-2">
            <p className="max-w-[44ch] text-copy-20 text-muted-foreground">{hero.support}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Button asChild size="default">
                <Link href={hero.primaryCTA.href}>{hero.primaryCTA.label}</Link>
              </Button>
              <Link
                href={hero.secondaryCTA.href}
                className="group inline-flex items-center gap-2 text-button-14 text-foreground transition-colors duration-150 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                {hero.secondaryCTA.label}
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Socle de crédibilité : trois faits, pas cinq logos absents. */}
        <Separator className="mt-20 md:mt-24" />
        <div className="grid gap-x-6 gap-y-8 pt-10 lg:grid-cols-12">
          <SectionLabel className="lg:col-span-3">{credibility.label}</SectionLabel>
          <dl className="grid gap-x-6 gap-y-8 sm:grid-cols-3 lg:col-span-8 lg:col-start-5">
            {credibility.items.map((item) => (
              <div key={item.term}>
                <dt className="font-[family-name:var(--font-geist-mono)] text-label-12 uppercase text-primary">
                  {item.term}
                </dt>
                <dd className="mt-3 max-w-[28ch] text-copy-14 text-muted-foreground">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  )
}

/**
 * Phrase de clôture du Hero compound, sur fond blanc pour marquer la sortie
 * de la zone off-white sans poser de filet supplémentaire.
 */
export function HeroClosing() {
  return (
    <section className="bg-background" aria-label="Positioning statement">
      <Container className="pb-28 pt-24 md:pb-36 md:pt-28">
        <div className="grid lg:grid-cols-12">
          <p className="text-heading-32 text-foreground md:text-heading-40 lg:col-span-8 lg:col-start-4">
            {hero.closing}
          </p>
        </div>
      </Container>
    </section>
  )
}
