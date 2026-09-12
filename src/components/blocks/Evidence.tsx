import { Container, SectionLabel } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { evidence } = homeV5

/**
 * 06 — Preuves choisies.
 *
 * Le moment « produit » de la page : quatre surfaces compactes en 2×2, avec
 * bordure fine, padding précis et état de survol — la densité shadcn plutôt
 * que l'éditorial des sections voisines.
 *
 * Preuve qualitative uniquement. Le dépôt ne contient aucun résultat chiffré
 * vérifié, et un chiffre inventé coûte plus qu'il ne rapporte. Chaque surface
 * nomme donc un livrable réel et ce qu'il contient.
 *
 * Le petit artefact visuel de chaque surface est une abstraction construite en
 * div : quatre traits dont la longueur varie, pas un faux graphique.
 */
const ARTIFACTS: Record<string, number[]> = {
  STRATEGY: [100, 62, 78, 40],
  BRAND: [48, 100, 70, 86],
  DIGITAL: [72, 94, 55, 100],
  TECHNOLOGY: [88, 44, 100, 66],
}

export function Evidence() {
  return (
    <section className="bg-[#F5F5F2]" aria-labelledby="evidence-heading">
      <Container className="py-28 md:py-36">
        <div className="grid gap-x-6 gap-y-6 lg:grid-cols-12">
          <SectionLabel className="lg:col-span-3">{evidence.label}</SectionLabel>
          <h2
            id="evidence-heading"
            className="max-w-[24ch] text-heading-32 text-foreground md:text-heading-48 lg:col-span-8 lg:col-start-5"
          >
            {evidence.heading}
          </h2>
        </div>

        <ul className="mt-16 grid gap-px bg-border md:mt-20 md:grid-cols-2">
          {evidence.categories.map((category) => (
            <li key={category.label}>
              <article className="group flex h-full flex-col justify-between gap-10 bg-background p-8 transition-colors duration-200 hover:bg-[#FAFAF8] md:p-10">
                <div>
                  <p className="font-[family-name:var(--font-geist-mono)] text-label-12 uppercase text-primary">
                    {category.label}
                  </p>
                  <h3 className="mt-5 text-heading-24 text-foreground">{category.deliverable}</h3>
                  <p className="mt-4 max-w-[40ch] text-copy-16 text-muted-foreground">{category.body}</p>
                </div>

                {/* Artefact : quatre mesures, pas un faux indicateur. */}
                <div aria-hidden className="flex flex-col gap-1.5">
                  {ARTIFACTS[category.label].map((w, i) => (
                    <span
                      key={i}
                      className={`block h-px transition-all duration-300 ${i === 0 ? 'bg-primary' : 'bg-foreground/20'} group-hover:opacity-100`}
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
