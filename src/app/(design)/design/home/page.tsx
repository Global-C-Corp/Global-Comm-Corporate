import type { Metadata } from 'next'
import { Evidence } from '@/components/blocks/Evidence'
import { Faq } from '@/components/blocks/Faq'
import { FinalCta } from '@/components/blocks/FinalCta'
import { Footer } from '@/components/blocks/Footer'
import { FrozenExpertise } from '@/components/blocks/FrozenExpertise'
import { GlobalHeader } from '@/components/blocks/GlobalHeader'
import { Hero, HeroClosing } from '@/components/blocks/Hero'
import { PlatformExpertise } from '@/components/blocks/PlatformExpertise'
import { Method } from '@/components/blocks/Method'
import { PointOfView } from '@/components/blocks/PointOfView'
import { SelectedWork } from '@/components/blocks/SelectedWork'

export const metadata: Metadata = {
  title: 'Global Comm — Home V5.1',
  robots: { index: false, follow: false },
}

/**
 * Home V5.1 — maquette isolée.
 *
 * Composition seule : chaque bloc porte sa propre mise en page, la page ne
 * fait que les ordonner. Server Component, comme la majorité des blocs ;
 * seuls l'en-tête, les onglets plateformes, les réalisations et la FAQ
 * franchissent la frontière client, parce qu'ils portent une interaction.
 *
 * La section Expertises est figée : markup inchangé et typographie d'origine
 * épinglée, donc rendu identique au commit de référence. La page ne lui
 * applique qu'un filet d'intégration externe. Elle garde ses 80rem pendant
 * que le reste de la page respire à 84rem.
 */
export default function HomeV5() {
  return (
    <>
      <GlobalHeader />

      <main id="main">
        <Hero />
        <PlatformExpertise />
        <HeroClosing />
        <PointOfView />
        <FrozenExpertise className="border-y border-border" />
        <SelectedWork />
        <Method />
        <Evidence />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
    </>
  )
}
