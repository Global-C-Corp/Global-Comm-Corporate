import type { Metadata } from 'next'
import { ClientLogoCloud } from '@/components/blocks/ClientLogoCloud'
import { EvidenceFaq, type EvidenceMedia } from '@/components/blocks/EvidenceFaq'
import { Expertise, type ExpertiseItem } from '@/components/blocks/Expertise'
import { FinalCta } from '@/components/blocks/FinalCta'
import { Hero, type HeroLogo, type HeroSlide } from '@/components/blocks/Hero'
import { PointOfView } from '@/components/blocks/PointOfView'
import { SelectedWork, type SelectedWorkItem } from '@/components/blocks/SelectedWork'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { JsonLd, organizationSchema } from '@/components/seo/JsonLd'
import { homeContent } from '@/content/home'
import { findService } from '@/content/services'
import { ui } from '@/content/ui'
import { isMedia, mediaURL } from '@/lib/media'
import { getPageContext } from '@/services/cms/pageContext'
import { projectTiles } from '@/services/cms/projectTiles'
import { getFeaturedProjects } from '@/services/cms/projects'
import { getFeaturedClients, getPublishedClients } from '@/services/cms/proof'
import { resolvePageSEO } from '@/services/seo/resolvePageSEO'
import { buildPath, type Route } from '@/services/seo/urls'

/** ISR backstop for the Payload records this page shows — see src/hooks/revalidate.ts. */
export const revalidate = 60

const route: Route = { type: 'home' }

export async function generateMetadata(): Promise<Metadata> {
  const { draft } = await getPageContext()

  return resolvePageSEO({
    entity: { heading: homeContent.hero.heading, excerpt: homeContent.hero.body },
    route,
    isPreview: draft,
  })
}

/** Splits a copy block into the paragraphs it was written with. */
const paragraphs = (value: string): string[] =>
  value.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean)

/**
 * Homepage — the approved composition (04 §12.1).
 *
 * Every string comes from `src/content/home.ts`: the corporate page is source
 * code now, not a Payload global. What still comes from Payload is the proof —
 * real projects and real client records — because that is the part that
 * genuinely changes without a deploy.
 *
 * The two absences the previous version reported are unchanged, and for the
 * same reason: Platform Expertise has no approved copy, and the hero has no
 * accent phrase or closing line. Neither is invented here.
 */
export default async function HomePageRoute() {
  const { ctx } = await getPageContext()

  const featuredProjects = await getFeaturedProjects(ctx)
  const featuredClients = await getFeaturedClients(ctx, 16)

  /**
   * No client is marked `featured` in the CMS, so the featured query returns
   * nothing and the reference band would disappear entirely. Widening to every
   * approved published client selects more real records; it never invents one.
   */
  const clients = featuredClients.length > 0 ? featuredClients : await getPublishedClients(ctx, 16)
  const projects = featuredProjects

  const contactHref = buildPath({ type: 'contact' })
  const workHref = buildPath({ type: 'work' })
  const servicesHref = buildPath({ type: 'services' })

  /** Hero carousel: only projects that actually carry an image can be a slide. */
  const heroSlides: HeroSlide[] = projects
    .map((project) => {
      const image =
        mediaURL(project.heroMedia, 'hero') ||
        mediaURL(project.featuredMedia, 'projectFeature') ||
        mediaURL(project.featuredMedia, 'projectCard')
      if (!image) return null

      const clientName =
        typeof project.client === 'object' && project.client ? project.client.name : ''
      const href = project.slug ? buildPath({ type: 'project', slug: project.slug }) : null

      return {
        id: String(project.id),
        image,
        eyebrow: clientName || ui.sections.selectedWork,
        title: project.shortStatement || project.title,
        body: project.excerpt || '',
        ...(href ? { href } : {}),
      } satisfies HeroSlide
    })
    .filter((slide): slide is HeroSlide => slide !== null)

  const clientLogos: HeroLogo[] = clients
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
    .filter((logo): logo is HeroLogo => logo !== null)

  const workItems: SelectedWorkItem[] = projectTiles(projects).map(
    ({ project, href, meta, image }) => ({
      id: String(project.id),
      title: project.title,
      disciplines: meta,
      body: project.excerpt || project.shortStatement || '',
      ...(image ? { image: image.url } : {}),
      alt: image?.alt || project.title,
      href: href || workHref,
    }),
  )

  /**
   * The evidence rail shows the four positioning pillars. They are the page's
   * own statements of what the work produces, so nothing here is composed for
   * the layout.
   */
  const evidenceCategories = homeContent.positioning.pillars.map((pillar, index) => ({
    key: `pillar-${index}`,
    label: pillar.title,
    body: pillar.body,
  }))

  /** One image per evidence category, taken from the projects already selected. */
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

  /** An expertise card links to its service page; an unknown slug is not linked. */
  const expertiseItems: ExpertiseItem[] = homeContent.services.items.map((item, index) => {
    const service = findService(item.serviceSlug)
    return {
      id: item.serviceSlug,
      number: item.number || String(index + 1).padStart(2, '0'),
      name: item.title,
      promise: item.tagline,
      href: service ? buildPath({ type: 'service', slug: service.slug }) : null,
    }
  })

  return (
    <>
      <SiteHeader route={route} overDark />
      <JsonLd data={organizationSchema()} />

      <main id="main" className="gc-design-page">
        <Hero
          eyebrow={homeContent.hero.eyebrow}
          heading={homeContent.hero.heading}
          support={homeContent.hero.body}
          primaryCTA={{ label: homeContent.hero.primaryCTA, url: contactHref }}
          secondaryCTA={{ label: homeContent.hero.secondaryCTA, url: workHref }}
          slides={heroSlides}
        />

        <PointOfView
          label={homeContent.positioning.kicker}
          heading={homeContent.positioning.heading}
        />

        <Expertise
          kicker={homeContent.services.kicker}
          heading={homeContent.services.heading}
          body={paragraphs(homeContent.services.intro)}
          cta={{ label: homeContent.services.sectionCTA, url: servicesHref }}
          items={expertiseItems}
        />

        <SelectedWork
          label={homeContent.work.kicker}
          heading={homeContent.work.heading}
          viewAll={{ label: homeContent.work.sectionCTA, url: workHref }}
          items={workItems}
        />

        <ClientLogoCloud
          label={ui.sections.selectedClients}
          support={homeContent.proof.body}
          logos={clientLogos}
        />

        <EvidenceFaq
          evidenceLabel={homeContent.proof.kicker}
          evidenceHeading={homeContent.proof.heading}
          categories={evidenceCategories}
          faqLabel={homeContent.faq.kicker}
          faqSupport={homeContent.faq.heading}
          faqItems={homeContent.faq.items.map((item) => ({
            question: item.question,
            answer: item.answer,
          }))}
          media={evidenceMedia}
        />

        <FinalCta
          heading={homeContent.closing.heading}
          support={homeContent.closing.body}
          cta={{ label: homeContent.closing.cta, url: contactHref }}
        />
      </main>
    </>
  )
}
