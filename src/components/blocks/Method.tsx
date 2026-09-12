import { Container, Grid, SectionLabel } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { method } = homeV5

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
const OFFSETS = ['lg:mt-0', 'lg:mt-20', 'lg:mt-40'] as const

export function Method() {
  return (
    <section className="bg-background" aria-labelledby="method-heading">
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

        {/* Le déplacement dans la grille EST le diagramme : chaque étape
            descend d'un cran et avance d'un tiers. Un connecteur discret relie
            les trois sur grand écran, sans devenir une timeline dessinée. */}
        <div className="relative mt-20 md:mt-28">
          <span
            aria-hidden
            className="absolute left-0 right-0 top-0 hidden h-px bg-gradient-to-r from-primary via-border to-transparent lg:block"
          />
          <Grid>
            {method.steps.map((step, index) => (
              <div
                key={step.number}
                className={`max-lg:mt-14 max-lg:first:mt-0 lg:col-span-4 ${OFFSETS[index]}`}
              >
                <div className="flex items-baseline gap-5 border-t border-foreground pt-7 lg:border-t-0 lg:pt-10">
                  <span
                    aria-hidden
                    className={`font-[family-name:var(--font-geist-mono)] text-heading-32 leading-none ${index === 0 ? 'text-primary' : 'text-foreground/45'}`}
                  >
                    {step.number}
                  </span>
                  <h3 className="text-heading-24 text-foreground">
                    {step.name.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h3>
                </div>
                <p className="mt-5 max-w-[30ch] text-copy-16 text-muted-foreground lg:ml-[3.25rem]">
                  {step.body}
                </p>
              </div>
            ))}
          </Grid>
        </div>
      </Container>
    </section>
  )
}
