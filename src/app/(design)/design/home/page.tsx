import type { Metadata } from 'next'
import { EvidenceFaq } from '@/components/blocks/EvidenceFaq'
import { FinalCta } from '@/components/blocks/FinalCta'
import { Footer } from '@/components/blocks/Footer'
import { FrozenExpertise } from '@/components/blocks/FrozenExpertise'
import { GlobalHeader } from '@/components/blocks/GlobalHeader'
import { Hero } from '@/components/blocks/Hero'
import { Method } from '@/components/blocks/Method'
import { PlatformExpertise } from '@/components/blocks/PlatformExpertise'
import { PointOfView } from '@/components/blocks/PointOfView'
import { SelectedWork } from '@/components/blocks/SelectedWork'

export const metadata: Metadata = {
  title: 'Global Comm — Home Direct Visual Clone',
  robots: { index: false, follow: false },
}

export default function HomeDesignPreview() {
  return (
    <>
      <GlobalHeader />
      <main id="main">
        <Hero />
        <PlatformExpertise />
        <PointOfView />
        <FrozenExpertise />
        <SelectedWork />
        <Method />
        <EvidenceFaq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
