import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container, Grid, SectionLabel } from '@/components/blocks/Layout'
import { homeV4 } from '@/content/homeV4'

const { hero, trust, platforms } = homeV4

/**
 * Hero compound : eyebrow, H1, copie de soutien, actions, preuve client,
 * expertise plateformes, phrase de clôture.
 *
 * Deux asymétries volontaires. Le H1 tient sur 8 colonnes quand la copie de
 * soutien en occupe 4 ; et cette copie démarre plus bas que le H1, à peu près
 * à hauteur de sa deuxième ligne, au lieu de s'aligner sur son sommet.
 *
 * Le fond reste #FAFAF8 du header jusqu'à la fin du bloc de confiance : c'est
 * un seul objet visuel, pas quatre sections empilées.
 */
export function Hero() {
  return (
    <section className="bg-[#FAFAF8]" aria-labelledby="hero-heading">
      <Container className="pb-20 pt-14 md:pb-28 md:pt-16">
        <SectionLabel>{hero.eyebrow}</SectionLabel>

        <Grid className="mt-7 md:mt-8">
          <h1
            id="hero-heading"
            className="text-heading-40 text-foreground sm:text-heading-48 lg:col-span-8 lg:text-heading-56 xl:text-heading-72"
          >
            {hero.heading}
          </h1>

          {/* Décalage assumé : la copie démarre vers la deuxième ligne du H1. */}
          <div className="mt-8 lg:col-span-4 lg:mt-0 lg:pt-[4.5rem] xl:pt-[6.5rem]">
            <p className="max-w-[46ch] text-copy-18 text-muted-foreground">{hero.support}</p>
          </div>
        </Grid>

        {/* Une action primaire, une exploratoire. Pas deux boutons de poids égal. */}
        <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8 md:mt-12">
          <Button asChild size="default" className="text-button-14">
            <Link href={hero.primaryCTA.href}>{hero.primaryCTA.label}</Link>
          </Button>
          <Link
            href={hero.secondaryCTA.href}
            className="group inline-flex items-center gap-2 text-button-14 text-foreground transition-colors duration-150 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            {hero.secondaryCTA.label}
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </Container>

      {/* ---- Trusted by -------------------------------------------------- */}
      <Container className="pb-16 md:pb-20">
        <div className="border-t border-border pt-10 md:pt-12">
          <Grid>
            <SectionLabel className="lg:col-span-2">{trust.label}</SectionLabel>
            <p className="mt-3 max-w-[42ch] text-copy-16 text-muted-foreground lg:col-span-5 lg:mt-0">
              {trust.support}
            </p>
          </Grid>

          {/* Aucun logo dans le dépôt : cinq emplacements, rien d'inventé. */}
          <ul className="mt-10 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
            {trust.logos.map((logo) => (
              <li key={logo.pending} className="flex h-24 items-center justify-center bg-[#FAFAF8] px-4">
                <span className="font-[family-name:var(--font-geist-mono)] text-label-12 uppercase text-muted-foreground">
                  {logo.pending}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {/* ---- Platform expertise ------------------------------------------ */}
      <Container className="border-t border-border bg-background py-16 md:py-20">
        <Grid>
          <SectionLabel className="lg:col-span-3">{platforms.label}</SectionLabel>
          <p className="mt-3 max-w-[44ch] text-copy-16 text-muted-foreground lg:col-span-5 lg:col-start-5 lg:mt-0">
            {platforms.support}
          </p>
        </Grid>

        {/* Compétence opérationnelle, pas un partenariat : aucun badge, aucun
            logo officiel, aucune mention de certification. */}
        <ul className="mt-12 grid grid-cols-2 border-t border-border lg:grid-cols-4">
          {platforms.items.map((name) => (
            <li
              key={name}
              className="border-b border-border py-7 text-heading-24 text-foreground lg:border-b-0 lg:border-r lg:last:border-r-0 lg:pl-6 lg:first:pl-0"
            >
              {name}
            </li>
          ))}
        </ul>
      </Container>

      {/* ---- Closing statement ------------------------------------------- */}
      <Container className="bg-background pb-28 pt-20 md:pb-36 md:pt-24">
        <Grid>
          <p className="text-heading-32 text-foreground md:text-heading-40 lg:col-span-7 lg:col-start-5">
            {hero.closing}
          </p>
        </Grid>
      </Container>
    </section>
  )
}
