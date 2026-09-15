import type { Metadata } from 'next'
import type { Client, Project, Service } from '@/payload-types'
import { ClientLogoCloud } from '@/components/blocks/ClientLogoCloud'
import { EvidenceFaq, type EvidenceMedia } from '@/components/blocks/EvidenceFaq'
import { FinalCta } from '@/components/blocks/FinalCta'
import { Footer } from '@/components/blocks/Footer'
import { FrozenExpertise } from '@/components/blocks/FrozenExpertise'
import { GlobalHeader } from '@/components/blocks/GlobalHeader'
import { Hero, type HeroLogo, type HeroSlide } from '@/components/blocks/Hero'
import { PlatformExpertise } from '@/components/blocks/PlatformExpertise'
import { PointOfView } from '@/components/blocks/PointOfView'
import { SelectedWork, type SelectedWorkItem } from '@/components/blocks/SelectedWork'
import { isMedia, mediaURL } from '@/lib/media'
import { populated } from '@/lib/relations'
import { getHomePage } from '@/services/cms/globals'
import { getFeaturedClients } from '@/services/cms/proof'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Global Comm — Homepage Preview',
  robots: { index: false, follow: false },
}

const ctx = { locale: 'fr' as const, draft: false }

function populatedService(value: Service | number | string | null | undefined): Service | null {
  return typeof value === 'object' && value !== null ? value : null
}

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

  const heroLogos: HeroLogo[] = clients
    .map((client) => {
      const logo = mediaURL(client.logo, 'logo')
      if (!logo) return null

      return {
        id: String(client.id),
        name: client.name,
        logo,
        ...(client.websiteURL ? { href: client.websiteURL } : {}),
      } satisfies HeroLogo
    })
    .filter((logo): logo is NonNullable<typeof logo> => logo !== null)

  const expertiseImages = (page?.expertise?.items ?? []).map((item) => {
    const service = populatedService(item.service)
    if (!service) return undefined
    return mediaURL(service.heroMedia, 'projectFeature') || mediaURL(service.heroMedia, 'hero')
  })

  const workItems: SelectedWorkItem[] = projects.map((project) => {
    const image =
      mediaURL(project.featuredMedia, 'projectFeature') ||
      mediaURL(project.heroMedia, 'projectFeature') ||
      mediaURL(project.featuredMedia, 'projectCard') ||
      mediaURL(project.heroMedia, 'hero')

    const media = isMedia(project.featuredMedia)
      ? project.featuredMedia
      : isMedia(project.heroMedia)
        ? project.heroMedia
        : null

    const disciplines = (project.services ?? [])
      .map((service) => (typeof service === 'object' && service ? service.name : null))
      .filter((name): name is string => Boolean(name))
      .join(' · ')

    return {
      id: String(project.id),
      title: project.title,
      disciplines,
      body: project.excerpt || project.shortStatement || '',
      ...(image ? { image } : {}),
      alt: media?.alt?.trim() || project.title,
      href: project.slug ? `/fr/work/${project.slug}` : '/fr/work',
    }
  })

  const evidenceMedia: EvidenceMedia[] = []
  const seenEvidenceUrls = new Set<string>()

  for (const project of projects) {
    const candidates = [
      project.featuredMedia,
      project.heroMedia,
      ...(project.gallery ?? []).map((entry) => entry.media),
    ]

    for (const candidate of candidates) {
      const url =
        mediaURL(candidate, 'projectFeature') ||
        mediaURL(candidate, 'projectCard') ||
        mediaURL(candidate, 'hero')

      if (!url || seenEvidenceUrls.has(url)) continue
      seenEvidenceUrls.add(url)

      evidenceMedia.push({
        url,
        alt: isMedia(candidate) ? candidate.alt?.trim() || project.title : project.title,
      })

      if (evidenceMedia.length >= 4) break
    }

    if (evidenceMedia.length >= 4) break
  }

  return (
    <>
      <GlobalHeader />
      <main id="main" className="gc-design-page">
        <Hero slides={heroSlides} logos={heroLogos} />
        <PlatformExpertise />
        <PointOfView />
        <FrozenExpertise images={expertiseImages} />
        <SelectedWork items={workItems} />
        <ClientLogoCloud logos={heroLogos} />
        <EvidenceFaq media={evidenceMedia} />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
