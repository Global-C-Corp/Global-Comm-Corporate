import type { Metadata } from 'next'
import type { Client, Project } from '@/payload-types'
import { ClientLogoCloud } from '@/components/blocks/ClientLogoCloud'
import { EvidenceFaq, type EvidenceMedia } from '@/components/blocks/EvidenceFaq'
import { FinalCta } from '@/components/blocks/FinalCta'
import { Expertise } from '@/components/blocks/Expertise'
import { Hero, type HeroLogo, type HeroSlide } from '@/components/blocks/Hero'
import { PlatformExpertise } from '@/components/blocks/PlatformExpertise'
import { PointOfView } from '@/components/blocks/PointOfView'
import { SelectedWork, type SelectedWorkItem } from '@/components/blocks/SelectedWork'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { isMedia, mediaURL } from '@/lib/media'
import { populated } from '@/lib/relations'
import { getGlobalAvailability } from '@/services/cms/availability'
import { getHomePage } from '@/services/cms/globals'
import { getFeaturedClients } from '@/services/cms/proof'
import { getFeaturedProjects } from '@/services/cms/projects'
import { projectTiles } from '@/services/cms/projectTiles'
import { homeV5 } from '@/content/homeV5'
import { homeHalbert } from '@/content/homeHalbert'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Global Comm — Homepage Preview',
  robots: { index: false, follow: false },
}

const ctx = { locale: 'fr' as const, draft: false }

export default async function HomeDesignPreview() {
  const page = await getHomePage(ctx)
  const availability = await getGlobalAvailability('home-page')

  const selectedProjects = populated<Project>(page?.featuredProjects)
  const fallbackProjects =
    selectedProjects.length === 0 ? await getFeaturedProjects(ctx) : []
  const projects = selectedProjects.length > 0 ? selectedProjects : fallbackProjects

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

  const workItems: SelectedWorkItem[] = projectTiles(projects, ctx.locale).map(
    ({ project, href, meta, image }) => ({
      id: String(project.id),
      title: project.title,
      disciplines: meta,
      body: project.excerpt || project.shortStatement || '',
      ...(image ? { image: image.url } : {}),
      alt: image?.alt || project.title,
      href: href || '/fr/work',
    }),
  )

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
      <SiteHeader locale={ctx.locale} route={{ type: 'home' }} availability={availability} overDark />
      <main id="main" className="gc-design-page">
        <Hero
          eyebrow={homeV5.hero.eyebrow}
          heading={homeV5.hero.heading}
          headingAccent={homeV5.hero.headingAccent}
          support={homeV5.hero.support}
          primaryCTA={{ label: homeV5.hero.primaryCTA.label, url: homeV5.hero.primaryCTA.href }}
          secondaryCTA={{ label: homeV5.hero.secondaryCTA.label, url: homeV5.hero.secondaryCTA.href }}
          closing={homeV5.hero.closing}
          slides={heroSlides}
        />
        <PlatformExpertise />
        <PointOfView
          label={homeV5.pointOfView.label}
          heading={`${homeV5.pointOfView.statement.lead} ${homeV5.pointOfView.statement.accent} ${homeV5.pointOfView.statement.tail}`}
          accent={homeV5.pointOfView.statement.accent}
        />
        <Expertise
          kicker={homeHalbert.expertise.kicker}
          heading={homeHalbert.expertise.title}
          body={[...homeHalbert.expertise.body]}
          cta={{
            label: homeHalbert.expertise.sectionCTA.label,
            url: homeHalbert.expertise.sectionCTA.href,
          }}
          items={homeHalbert.expertise.items.map((item) => ({
            id: item.number,
            number: item.number,
            name: item.name,
            promise: item.promise,
            href: item.cta.href,
          }))}
        />
        <SelectedWork
          label={homeV5.work.label}
          viewAll={{ label: homeV5.work.viewAll.label, url: homeV5.work.viewAll.href }}
          pendingAssetsNote={homeV5.work.pendingAssets}
          items={workItems}
        />
        <ClientLogoCloud
          label={homeV5.experience.label}
          support={homeV5.experience.support}
          logos={heroLogos}
          pendingAssetsNote={homeV5.experience.pendingAssets}
        />
        <EvidenceFaq
          evidenceLabel={homeV5.evidence.label}
          evidenceHeading={homeV5.evidence.heading}
          categories={homeV5.evidence.categories.map((category) => ({
            key: category.label.toLowerCase(),
            label: category.label.charAt(0) + category.label.slice(1).toLowerCase(),
            deliverable: category.deliverable,
            body: category.body,
            points: [...category.points],
          }))}
          faqLabel={homeV5.faq.label}
          faqSupport={homeV5.faq.support}
          faqItems={homeV5.faq.items.map((item) => ({ question: item.question, answer: item.answer }))}
          media={evidenceMedia}
        />
        <FinalCta
          heading={homeV5.finalCTA.heading}
          support={homeV5.finalCTA.support}
          cta={{ label: homeV5.finalCTA.action.label, url: homeV5.finalCTA.action.href }}
        />
      </main>
      <SiteFooter locale={ctx.locale} />
    </>
  )
}
