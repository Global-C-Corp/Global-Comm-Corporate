import type { Metadata } from 'next'
import type { Client, Project } from '@/payload-types'
import { EvidenceFaq } from '@/components/blocks/EvidenceFaq'
import { FinalCta } from '@/components/blocks/FinalCta'
import { Footer } from '@/components/blocks/Footer'
import { FrozenExpertise } from '@/components/blocks/FrozenExpertise'
import { GlobalHeader } from '@/components/blocks/GlobalHeader'
import { Hero, type HeroLogo, type HeroSlide } from '@/components/blocks/Hero'
import { Method } from '@/components/blocks/Method'
import { PlatformExpertise } from '@/components/blocks/PlatformExpertise'
import { PointOfView } from '@/components/blocks/PointOfView'
import { SelectedWork } from '@/components/blocks/SelectedWork'
import { mediaURL } from '@/lib/media'
import { populated } from '@/lib/relations'
import { getHomePage } from '@/services/cms/globals'
import { getFeaturedClients } from '@/services/cms/proof'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Global Comm — Home Direct Visual Clone',
  robots: { index: false, follow: false },
}

const ctx = { locale: 'fr' as const, draft: false }

export default async function HomeDesignPreview() {
  const page = await getHomePage(ctx)

  const projects = populated<Project>(page?.featuredProjects)
  const selectedClients = populated<Client>(page?.featuredClients)
  const clients = selectedClients.length > 0 ? selectedClients : await getFeaturedClients(ctx, 16)

  const heroSlides: HeroSlide[] = projects
    .map((project) => {
      const image =
        mediaURL(project.heroMedia, 'hero') ||
        mediaURL(project.featuredMedia, 'projectFeature') ||
        mediaURL(project.featuredMedia, 'projectCard')

      if (!image) return null

      const clientName =
        typeof project.client === 'object' && project.client
          ? project.client.name
          : 'SELECTED WORK'

      return {
        id: String(project.id),
        image,
        eyebrow: clientName,
        title: project.shortStatement || project.title,
        body: project.excerpt || '',
        ...(project.slug ? { href: `/fr/work/${project.slug}` } : {}),
      } satisfies HeroSlide
    })
    .filter((slide): slide is NonNullable<typeof slide> => slide !== null)

  const heroLogos: HeroLogo[] = clients.map((client) => {
    const logo = mediaURL(client.logo, 'logo')

    return {
      id: String(client.id),
      name: client.name,
      ...(logo ? { logo } : {}),
      ...(client.websiteURL ? { href: client.websiteURL } : {}),
    } satisfies HeroLogo
  })

  return (
    <>
      <GlobalHeader />
      <main id="main">
        <Hero slides={heroSlides} logos={heroLogos} />
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
