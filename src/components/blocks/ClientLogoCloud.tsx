import type { HeroLogo } from '@/components/blocks/Hero'
import { Container, SectionLabel } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { experience } = homeV5

/**
 * Selected Experience — approved reference (04 §12.7).
 *
 * The quiet transitional band between the work and the evidence: a label, one
 * sentence, and the client marks themselves on white with generous space. No
 * container, no grid chrome, no "trusted by" language.
 *
 * When no approved logo exists the reference shows an explicit editorial line
 * naming what is missing. 04 §12.7 allows that only on preview/design routes,
 * and it is never replaced by invented proof.
 */
export function ClientLogoCloud({ logos = [] }: { logos?: HeroLogo[] }) {
  return (
    <section id="clients" className="scroll-mt-24 bg-background" aria-labelledby="clients-heading">
      <Container className="py-16 md:py-20">
        <SectionLabel>{experience.label}</SectionLabel>
        <h2 id="clients-heading" className="mt-3 max-w-[44ch] text-copy-14 text-muted-foreground">
          {experience.support}
        </h2>

        {logos.length > 0 ? (
          <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-16 gap-y-10">
            {logos.map((logo) => {
              const image = (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo.logo}
                  alt={logo.name}
                  loading="lazy"
                  decoding="async"
                  className="max-h-8 max-w-32 object-contain opacity-60 transition-opacity duration-150 hover:opacity-100"
                />
              )

              return (
                <li key={logo.id} translate="no">
                  {logo.href ? (
                    <a
                      href={logo.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                    >
                      {image}
                    </a>
                  ) : (
                    image
                  )}
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="mt-12 text-center text-copy-14 text-muted-foreground/80">
            {experience.pendingAssets}
          </p>
        )}
      </Container>
    </section>
  )
}
