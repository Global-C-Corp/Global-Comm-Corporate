import { Container, Grid, SectionLabel, Slot } from '@/components/blocks/Layout'
import { homeV4 } from '@/content/homeV4'

const { work } = homeV4

/**
 * 04 — Réalisations.
 *
 * Le point d'art direction le plus fort après le Hero. Chaque projet a sa
 * propre composition : le premier pleine largeur en 16:9, le second en 4/7
 * texte-visuel, le troisième inversé 7/4. Jamais trois cartes égales sur une
 * grille en trois colonnes.
 *
 * Aucun projet approuvé n'existe dans le dépôt : les trois entrées sont donc
 * des emplacements. La composition, elle, est réelle et prête à recevoir les
 * visuels.
 */
export function SelectedWork() {
  const [first, second, third] = work.projects

  return (
    <section className="border-b border-border bg-background" aria-labelledby="work-heading">
      <Container className="py-32 md:py-36">
        <Grid>
          <SectionLabel className="lg:col-span-2">{work.label}</SectionLabel>
          <h2
            id="work-heading"
            className="mt-6 max-w-[20ch] text-heading-32 text-foreground md:text-heading-48 lg:col-span-7 lg:col-start-5 lg:mt-0"
          >
            {work.heading}
          </h2>
        </Grid>

        {/* --- Projet 01 : pleine largeur, le plus fort ------------------- */}
        <article className="mt-20 md:mt-24">
          <Slot label={first.pending} title={first.slot} className="aspect-[16/9] w-full" />
          <div className="mt-5 flex flex-wrap items-baseline justify-between gap-4 border-t border-border pt-5">
            <p className="font-[family-name:var(--font-geist-mono)] text-label-12 uppercase text-muted-foreground">
              01 / SECTOR / LOCATION
            </p>
            <p className="font-[family-name:var(--font-geist-mono)] text-label-12 uppercase text-muted-foreground">
              {work.viewLabel} ↗
            </p>
          </div>
        </article>

        {/* --- Projet 02 : texte à gauche, visuel à droite ---------------- */}
        <Grid className="mt-24 md:mt-28">
          <div className="lg:col-span-4 lg:pt-6">
            <h3 className="text-heading-24 text-foreground">{second.slot}</h3>
            <p className="mt-4 max-w-[36ch] text-copy-16 text-muted-foreground">{second.pending}</p>
            <p className="mt-6 font-[family-name:var(--font-geist-mono)] text-label-12 uppercase text-muted-foreground">
              {work.viewLabel} ↗
            </p>
          </div>
          <Slot
            label="Project visual to be supplied"
            className="mt-8 aspect-[16/10] w-full lg:col-span-7 lg:col-start-6 lg:mt-0"
          />
        </Grid>

        {/* --- Projet 03 : composition inversée --------------------------- */}
        <Grid className="mt-24 md:mt-28">
          <Slot
            label="Project visual to be supplied"
            className="aspect-[4/3] w-full lg:col-span-7 lg:row-start-1"
          />
          <div className="mt-8 lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:mt-0 lg:pt-6">
            <h3 className="text-heading-24 text-foreground">{third.slot}</h3>
            <p className="mt-4 max-w-[36ch] text-copy-16 text-muted-foreground">{third.pending}</p>
            <p className="mt-6 font-[family-name:var(--font-geist-mono)] text-label-12 uppercase text-muted-foreground">
              {work.viewLabel} ↗
            </p>
          </div>
        </Grid>
      </Container>
    </section>
  )
}
