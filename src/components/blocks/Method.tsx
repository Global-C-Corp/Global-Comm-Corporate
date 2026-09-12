import { Container, Grid, SectionLabel } from '@/components/blocks/Layout'
import { homeV4 } from '@/content/homeV4'

const { method } = homeV4

/**
 * 05 — Méthode.
 *
 * Les trois étapes descendent en escalier dans la grille : 01 en haut à
 * gauche, 02 décalé vers le bas, 03 plus bas encore. La progression dans la
 * grille EST le diagramme — pas de timeline dessinée, pas de flèches
 * décoratives.
 *
 * Le décalage disparaît sous `lg`, où il deviendrait du vide sans lecture.
 */
const OFFSETS = ['lg:mt-0', 'lg:mt-24', 'lg:mt-48'] as const

export function Method() {
  return (
    <section className="border-b border-border bg-background" aria-labelledby="method-heading">
      <Container className="py-32 md:py-36">
        <Grid>
          <SectionLabel className="lg:col-span-2">{method.label}</SectionLabel>
          <h2
            id="method-heading"
            className="mt-6 text-heading-32 text-foreground md:text-heading-48 lg:col-span-7 lg:col-start-5 lg:mt-0"
          >
            {method.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </Grid>

        <Grid className="mt-20 md:mt-24">
          {method.steps.map((step, index) => (
            <div
              key={step.number}
              className={`border-t border-foreground pt-6 max-lg:mt-12 max-lg:first:mt-0 lg:col-span-4 ${OFFSETS[index]}`}
            >
              <span
                aria-hidden
                className="font-[family-name:var(--font-geist-mono)] text-label-12 text-primary"
              >
                {step.number}
              </span>
              <h3 className="mt-5 text-heading-24 text-foreground">
                {step.name.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h3>
              <p className="mt-4 max-w-[30ch] text-copy-16 text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </Grid>
      </Container>
    </section>
  )
}
