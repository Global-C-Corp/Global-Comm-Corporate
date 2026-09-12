import type { Metadata } from 'next'
import { Evidence } from '@/components/blocks/Evidence'
import { Faq } from '@/components/blocks/Faq'
import { FinalCta } from '@/components/blocks/FinalCta'
import { Footer } from '@/components/blocks/Footer'
import { FrozenExpertise } from '@/components/blocks/FrozenExpertise'
import { GlobalHeader } from '@/components/blocks/GlobalHeader'
import { Hero } from '@/components/blocks/Hero'
import { Method } from '@/components/blocks/Method'
import { PointOfView } from '@/components/blocks/PointOfView'
import { SelectedWork } from '@/components/blocks/SelectedWork'

export const metadata: Metadata = {
  title: 'Global Comm — Home V4',
  robots: { index: false, follow: false },
}

/**
 * Home V4 — maquette isolée.
 *
 * Composition seule : chaque bloc porte sa propre mise en page, la page ne
 * fait que les ordonner. Server Component, comme sept des dix blocs ; seuls
 * l'en-tête et la FAQ franchissent la frontière client, parce qu'ils ont une
 * interaction réelle.
 *
 * La section Expertises est figée. Elle est rendue telle qu'elle existait,
 * markup inchangé ; la page ne lui applique qu'un espacement d'intégration
 * externe. C'est aussi elle qui fixe la largeur du conteneur pour toute la
 * page — « the rest of the page must adapt around it ».
 */
export default function HomeV4() {
  return (
    <>
      <GlobalHeader />

      <main id="main">
        <Hero />
        <PointOfView />
        <FrozenExpertise />
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
