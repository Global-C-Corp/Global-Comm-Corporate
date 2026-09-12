import { Container, Grid, SectionLabel, Slot } from '@/components/blocks/Layout'
import { homeV4 } from '@/content/homeV4'

const { evidence } = homeV4

/**
 * 06 — Preuves choisies.
 *
 * Preuve qualitative uniquement. Le dépôt ne contient aucun résultat chiffré
 * vérifié, et le brief est explicite : un chiffre inventé coûte plus qu'il ne
 * rapporte. Chaque catégorie décrit donc ce que la discipline produit
 * réellement, et l'artefact qui l'illustrera reste un emplacement.
 *
 * Rangées séparées par des hairlines plutôt que quatre cartes : le contenu
 * n'a pas besoin d'une surface autonome pour se lire.
 */
export function Evidence() {
  return (
    <section className="border-b border-border bg-[#FAFAF8]" aria-labelledby="evidence-heading">
      <Container className="py-32 md:py-36">
        <Grid>
          <SectionLabel className="lg:col-span-2">{evidence.label}</SectionLabel>
          <h2
            id="evidence-heading"
            className="mt-6 max-w-[22ch] text-heading-32 text-foreground md:text-heading-48 lg:col-span-7 lg:col-start-5 lg:mt-0"
          >
            {evidence.heading}
          </h2>
        </Grid>

        <ul className="mt-20 border-t border-border md:mt-24">
          {evidence.categories.map((category) => (
            <li key={category.label} className="border-b border-border py-10">
              <Grid>
                <p className="font-[family-name:var(--font-geist-mono)] text-label-12 uppercase text-primary lg:col-span-2">
                  {category.label}
                </p>
                <p className="mt-4 max-w-[40ch] text-copy-18 text-foreground lg:col-span-5 lg:col-start-4 lg:mt-0">
                  {category.body}
                </p>
                <Slot label={category.pending} className="mt-6 lg:col-span-3 lg:col-start-10 lg:mt-0" />
              </Grid>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
