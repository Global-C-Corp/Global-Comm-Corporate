import { Container, Grid, SectionLabel } from '@/components/blocks/Layout'
import { homeV4 } from '@/content/homeV4'

const { pointOfView } = homeV4

/**
 * 02 — Point de vue stratégique.
 *
 * La section la plus calme de la page : elle fait retomber l'intensité après
 * le Hero. Pas de CTA, pas de carte, pas d'illustration, pas d'icône. Une
 * déclaration, une hairline, deux colonnes de texte.
 */
export function PointOfView() {
  return (
    <section className="border-b border-border bg-background" aria-labelledby="pov-heading">
      <Container className="py-28 md:py-32">
        <Grid>
          <SectionLabel className="lg:col-span-2">{pointOfView.label}</SectionLabel>
          <h2 id="pov-heading" className="mt-6 text-heading-32 text-foreground md:text-heading-48 lg:col-span-7 lg:col-start-4 lg:mt-0">
            {pointOfView.statement.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </Grid>

        <hr className="mt-16 border-border md:mt-20" />

        <Grid className="mt-12 md:mt-16">
          <p className="max-w-[44ch] text-copy-18 text-muted-foreground lg:col-span-5">
            {pointOfView.left}
          </p>
          <p className="mt-6 max-w-[44ch] text-copy-18 text-muted-foreground lg:col-span-5 lg:col-start-7 lg:mt-0">
            {pointOfView.right}
          </p>
        </Grid>
      </Container>
    </section>
  )
}
