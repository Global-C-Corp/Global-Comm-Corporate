import type { Metadata } from 'next'
import type { Client, Project, Service } from '@/payload-types'
import { ClientLogoCloud, type ClientLogoItem } from '@/components/blocks/ClientLogoCloud'
import { ExpertiseShowcase, type ExpertiseShowcaseItem } from '@/components/blocks/ExpertiseShowcase'
import { FaqSection } from '@/components/blocks/FaqSection'
import { FinalCta } from '@/components/blocks/FinalCta'
import { Footer } from '@/components/blocks/Footer'
import { GlobalHeader } from '@/components/blocks/GlobalHeader'
import { Hero, type HeroLogo, type HeroSlide } from '@/components/blocks/Hero'
import { PlatformExpertise } from '@/components/blocks/PlatformExpertise'
import { PointOfView } from '@/components/blocks/PointOfView'
import { SelectedWork, type SelectedWorkItem } from '@/components/blocks/SelectedWork'
import { StickyEvidence, type StickyEvidenceItem } from '@/components/blocks/StickyEvidence'
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

  const heroLogos: HeroLogo[] = clients.map((client) => {
    const logo = mediaURL(client.logo, 'logo')

    return {
      id: String(client.id),
      name: client.name,
      ...(logo ? { logo } : {}),
      ...(client.websiteURL ? { href: client.websiteURL } : {}),
    } satisfies HeroLogo
  })

  const clientLogos: ClientLogoItem[] = heroLogos
    .filter((logo): logo is HeroLogo & { logo: string } => Boolean(logo.logo))
    .map((logo) => ({
      id: logo.id,
      name: logo.name,
      logo: logo.logo,
      ...(logo.href ? { href: logo.href } : {}),
    }))

  const expertiseItems: ExpertiseShowcaseItem[] = (page?.expertise?.items ?? []).map((item, index) => {
    const service = populatedService(item.service)
    const image = service ? mediaURL(service.heroMedia, 'projectFeature') || mediaURL(service.heroMedia, 'hero') : undefined
    const alt = service && isMedia(service.heroMedia) ? service.heroMedia.alt || '' : ''

    return {
      id: String(item.id ?? service?.id ?? index),
      number: item.number || String(index + 1).padStart(2, '0'),
      title: item.title || service?.name || 'Expertise',
      ...(item.tagline || service?.shortDescription ? { tagline: item.tagline || service?.shortDescription || '' } : {}),
      ...(item.body || service?.shortDescription ? { body: item.body || service?.shortDescription || '' } : {}),
      ...(image ? { image } : {}),
      ...(alt ? { alt } : {}),
      ...(service?.slug ? { href: `/fr/services/${service.slug}` } : {}),
      ...(item.ctaLabel ? { ctaLabel: item.ctaLabel } : {}),
    }
  })

  const workItems: SelectedWorkItem[] = projects.map((project) => {
    const image =
      mediaURL(project.featuredMedia, 'projectFeature') ||
      mediaURL(project.heroMedia, 'projectFeature') ||
      mediaURL(project.featuredMedia, 'projectCard') ||
      mediaURL(project.heroMedia, 'hero')

    const source = project.featuredMedia || project.heroMedia
    const alt = isMedia(source) ? source.alt || project.title : project.title

    const services = (project.services ?? [])
      .map((service) => (typeof service === 'object' && service ? service.name : null))
      .filter((name): name is string => Boolean(name))
      .join(' · ')

    return {
      id: String(project.id),
      title: project.title,
      ...(services ? { disciplines: services } : {}),
      ...(project.excerpt || project.shortStatement ? { body: project.excerpt || project.shortStatement || '' } : {}),
      ...(image ? { image } : {}),
      alt,
      href: project.slug ? `/fr/work/${project.slug}` : '/fr/work',
    }
  })

  const serviceEvidence: StickyEvidenceItem[] = expertiseItems
    .filter((item): item is ExpertiseShowcaseItem & { image: string } => Boolean(item.image))
    .map((item) => ({
      id: item.id,
      tab: item.title,
      title: item.title,
      ...(item.body || item.tagline ? { body: item.body || item.tagline || '' } : {}),
      image: item.image,
      ...(item.alt ? { alt: item.alt } : {}),
      ...(item.href ? { href: item.href } : {}),
    }))

  const projectEvidence: StickyEvidenceItem[] = workItems
    .filter((item): item is SelectedWorkItem & { image: string } => Boolean(item.image))
    .map((item) => ({
      id: `project-${item.id}`,
      tab: item.title,
      title: item.title,
      ...(item.body ? { body: item.body } : {}),
      image: item.image,
      ...(item.alt ? { alt: item.alt } : {}),
      href: item.href,
    }))

  const evidenceItems = (serviceEvidence.length >= 2 ? serviceEvidence : projectEvidence).slice(0, 4)

  return (
    <>
      <GlobalHeader />
      <main id="main" className="gc-design-page">
        <Hero slides={heroSlides} logos={heroLogos} />
        <PlatformExpertise />
        <PointOfView />

        <ExpertiseShowcase
          kicker={page?.expertise?.kicker || undefined}
          heading={page?.expertise?.heading || undefined}
          intro={page?.expertise?.intro || undefined}
          items={expertiseItems}
        />

        <SelectedWork items={workItems} />

        <ClientLogoCloud
          logos={clientLogos}
          kicker={page?.proof?.kicker || undefined}
          heading={page?.proof?.heading || undefined}
          body={page?.proof?.body || undefined}
        />

        <StickyEvidence items={evidenceItems} />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
