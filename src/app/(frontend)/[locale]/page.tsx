import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ClientLogoCloud } from '@/components/blocks/ClientLogoCloud'
import { EvidenceFaq, type EvidenceMedia } from '@/components/blocks/EvidenceFaq'
import { Expertise, type ExpertiseItem } from '@/components/blocks/Expertise'
import { FinalCta } from '@/components/blocks/FinalCta'
import { Hero, type HeroLogo, type HeroSlide } from '@/components/blocks/Hero'
import { PointOfView } from '@/components/blocks/PointOfView'
import { SelectedWork, type SelectedWorkItem } from '@/components/blocks/SelectedWork'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { JsonLd, organizationSchema } from '@/components/seo/JsonLd'
import { getDictionary } from '@/i18n/dictionaries'
import { isMedia, mediaURL } from '@/lib/media'
import { populated } from '@/lib/relations'
import type { Client, Project, Service } from '@/payload-types'
import { getGlobalAvailability } from '@/services/cms/availability'
import { getHomePage, getSiteChrome } from '@/services/cms/globals'
import { getPageContext } from '@/services/cms/pageContext'
import { projectTiles } from '@/services/cms/projectTiles'
import { getFeaturedProjects } from '@/services/cms/projects'
import { getFeaturedClients, getPublishedClients } from '@/services/cms/proof'
import { resolvePageSEO } from '@/services/seo/resolvePageSEO'
import { buildPath, type Route } from '@/services/seo/urls'

const route: Route = { type: 'home' }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const { ctx, site, draft } = await getPageContext(locale)
  const page = await getHomePage(ctx)
  if (!page) return {}

  return resolvePageSEO({
    entity: { heading: page.heroHeading, excerpt: page.heroBody, meta: page.meta },
    locale: ctx.locale,
    route,
    site,
    availability: await getGlobalAvailability('home-page'),
    isPreview: draft,
  })
}

/** Splits a CMS textarea into the paragraphs an editor separated by blank lines. */
const paragraphs = (value?: string | null): string[] =>
  (value ?? '').split(/\n{2,}/).map((part) => part.trim()).filter(Boolean)

/**
 * Homepage — the approved composition (04 §12.1), on production data.
 *
 * Section order is the approved one: dark split hero, Point of View, the four
 * expertises, Selected Work, Selected Experience, Evidence + FAQ, and the
 * full-width blue closing band. Every string comes from the Home Page global
 * in the requested locale; the blocks decide only where it sits.
 *
 * Two deliberate absences, both reported rather than filled:
 *   - Platform Expertise (approved section 03) has no field anywhere in the
 *     CMS, so rendering it would mean shipping untranslated English copy to
 *     /fr and /es. The section is omitted until the model exists.
 *   - The hero's brand-blue accent phrase and its closing statement line have
 *     no field either, so the headline renders whole and the hairline band is
 *     not drawn, rather than inventing an emphasis.
 */
export default async function HomePageRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const { ctx, draft } = await getPageContext(locale)
  const dictionary = getDictionary(ctx.locale)

  const page = await getHomePage(ctx)
  if (!page) notFound()

  const selectedClients = populated<Client>(page.featuredClients)
  const selectedProjects = populated<Project>(page.featuredProjects)

  const [fallbackProjects, fallbackClients, availability] = await Promise.all([
    selectedProjects.length === 0 ? getFeaturedProjects(ctx) : Promise.resolve([]),
    selectedClients.length === 0 ? getFeaturedClients(ctx, 16) : Promise.resolve([]),
    getGlobalAvailability('home-page'),
  ])

  const { settings } = await getSiteChrome(ctx.locale, draft)

  /**
   * No client is marked `featured` in the CMS, so the featured query returns
   * nothing and the reference band would disappear entirely. Widening to every
   * approved published client is the same featured/fallback idiom the Services
   * page uses — it selects more real records, it never invents one.
   */
  const featuredOrAll =
    fallbackClients.length > 0 || selectedClients.length > 0
      ? fallbackClients
      : await getPublishedClients(ctx, 16)
  const clients = selectedClients.length > 0 ? selectedClients : featuredOrAll
  const projects = selectedProjects.length > 0 ? selectedProjects : fallbackProjects

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
      const href = project.slug ? buildPath(ctx.locale, { type: 'project', slug: project.slug }) : null

      return {
        id: String(project.id),
        image,
        eyebrow: clientName || dictionary.sections.selectedWork,
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

  const workItems: SelectedWorkItem[] = projectTiles(projects, ctx.locale).map(
    ({ project, href, meta, image }) => ({
      id: String(project.id),
      title: project.title,
      disciplines: meta,
      body: project.excerpt || project.shortStatement || '',
      ...(image ? { image: image.url } : {}),
      alt: image?.alt || project.title,
      href: href || buildPath(ctx.locale, { type: 'work' }),
    }),
  )

  /**
   * The evidence rail shows the four positioning pillars the CMS already
   * carries. They are the page's own statements of what the work produces, so
   * nothing here is composed for the layout.
   */
  const evidenceCategories = (page.positioning?.pillars ?? [])
    .filter((pillar) => Boolean(pillar.title))
    .map((pillar, index) => ({
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

  const serviceHref = (service: Service | number | null | undefined): string | null => {
    if (!service || typeof service !== 'object' || !service.slug) return null
    return buildPath(ctx.locale, { type: 'service', slug: service.slug })
  }

  const expertiseItems: ExpertiseItem[] = (page.expertise?.items ?? [])
    .filter((item) => Boolean(item.title))
    .map((item, index) => ({
      id: String(item.id ?? index),
      number: item.number ?? String(index + 1).padStart(2, '0'),
      name: item.title as string,
      promise: item.tagline || item.body,
      href: serviceHref(item.service),
    }))

  const faqItems = (page.faq?.items ?? []).map((item) => ({
    question: item.question,
    answer: item.answer,
  }))

  return (
    <>
      <SiteHeader
        locale={ctx.locale}
        route={route}
        availability={availability}
        draft={draft}
        overDark
      />
      <JsonLd data={organizationSchema(settings, ctx.locale)} />

      <main id="main" className="gc-design-page">
        <Hero
          eyebrow={page.heroEyebrow}
          heading={page.heroHeading}
          support={page.heroBody}
          primaryCTA={page.primaryCTA}
          secondaryCTA={page.secondaryCTA}
          slides={heroSlides}
        />

        <PointOfView label={page.positioning?.kicker} heading={page.positioning?.heading} />

        <Expertise
          kicker={page.expertise?.kicker}
          heading={page.expertise?.heading}
          body={paragraphs(page.expertise?.intro)}
          cta={page.expertise?.sectionCTA}
          items={expertiseItems}
        />

        <SelectedWork
          label={page.workSection?.kicker}
          heading={page.workSection?.heading}
          viewAll={page.workSection?.sectionCTA}
          items={workItems}
        />

        <ClientLogoCloud
          label={dictionary.sections.selectedClients}
          support={page.proof?.body}
          logos={clientLogos}
        />

        <EvidenceFaq
          evidenceLabel={page.proof?.kicker}
          evidenceHeading={page.proof?.heading}
          categories={evidenceCategories}
          faqLabel={page.faq?.kicker}
          faqSupport={page.faq?.heading}
          faqItems={faqItems}
          media={evidenceMedia}
        />

        <FinalCta
          heading={page.closing?.heading}
          support={page.closing?.body}
          cta={page.closingCTA}
        />
      </main>
    </>
  )
}
