import { Container, Grid, SectionLabel } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { pointOfView } = homeV5

/**
 * 02 — Point de vue stratégique.
 *
 * La section la plus calme de la page : elle fait retomber l'intensité après
 * le Hero. Pas de CTA, pas de carte, pas d'illustration, pas d'icône. Une
 * déclaration, une hairline, deux colonnes de texte.
 */
export function PointOfView() {
  return (
    <section className="bg-background" aria-labelledby="pov-heading">
      <Container className="py-32 md:py-40">
        <Grid>
          <SectionLabel className="lg:col-span-3">{pointOfView.label}</SectionLabel>

          <h2
            id="pov-heading"
            className="mt-8 text-heading-32 text-foreground md:text-heading-56 lg:col-span-9 lg:col-start-4 lg:mt-0"
          >
            {/* La seconde ligne est la bascule de l'argument : elle porte le bleu. */}
            <span className="block max-w-[20ch] text-muted-foreground">{pointOfView.statement[0]}</span>
            <span className="mt-3 block max-w-[20ch]">{pointOfView.statement[1]}</span>
          </h2>
        </Grid>

        <Grid className="mt-24 md:mt-28">
          <p className="max-w-[34ch] text-copy-18 text-muted-foreground lg:col-span-4 lg:col-start-4">
            {pointOfView.left}
          </p>
          <p className="mt-8 max-w-[34ch] text-copy-18 text-foreground lg:col-span-4 lg:col-start-9 lg:mt-0">
            <span aria-hidden className="mb-5 block h-px w-10 bg-primary" />
            {pointOfView.right}
          </p>
        </Grid>
      </Container>
    </section>
  )
}
