import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ExpertiseList } from '@/components/design-preview/ExpertiseList'
import { homeHalbert } from '@/content/homeHalbert'

const { expertise } = homeHalbert

/**
 * Kicker — copie conforme de l'assistant local de l'ancienne page.
 *
 * Reproduit à l'identique, espace final de la chaîne de classes compris :
 * la section figée doit produire exactement le même HTML qu'avant
 * l'extraction, et cette égalité est vérifiée octet par octet.
 */
function Kicker({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={
        'text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-muted-foreground ' + (className ?? '')
      }
    >
      {children}
    </p>
  )
}

/**
 * SECTION FIGÉE — « QUATRE EXPERTISES. UN PROJET COORDONNÉ. »
 *
 * Design interne verrouillé. Le markup ci-dessous est repris caractère pour
 * caractère de l'implémentation précédente, où il vivait en clair dans la
 * page. Il n'a été déplacé que parce que la page a été reconstruite autour
 * de lui — aucune classe, aucun espacement, aucune balise n'a changé.
 *
 * Ce qui peut évoluer : uniquement l'espacement d'intégration externe, appliqué
 * par le parent via `className` sur le wrapper. Rien à l'intérieur.
 *
 * Conséquence assumée : son conteneur reste à 80rem. C'est lui qui fixe la
 * largeur de toute la page — « the rest of the page must adapt around it ».
 */
export function FrozenExpertise({ className }: { className?: string }) {
  return (
    <div className={className}>
      {/* ---- 03 Expertises — blanc ------------------------------------- */}
      <section className="border-b border-border bg-background" aria-labelledby="expertises">
        <div className="mx-auto w-full max-w-[80rem] px-5 py-20 sm:px-8 md:py-28 lg:px-12">
          <div className="max-w-[52ch]">
            <Kicker>{expertise.kicker}</Kicker>
            <h2
              id="expertises"
              className="mt-6 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-foreground md:text-[2.75rem]"
            >
              {expertise.title}
            </h2>
            <div className="mt-8 space-y-4">
              {expertise.body.map((paragraph) => (
                <p key={paragraph} className="text-base leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <ExpertiseList
            items={expertise.items}
            scopeLabel={expertise.scopeLabel}
            outcomeLabel={expertise.outcomeLabel}
          />

          <div className="mt-14">
            <Button asChild variant="outline">
              <Link href={expertise.sectionCTA.href}>{expertise.sectionCTA.label}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
