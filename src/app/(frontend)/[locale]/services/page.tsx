import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { BeliefSection } from '@/components/services/BeliefSection'
import { ExperienceStrip } from '@/components/services/ExperienceStrip'
import { MethodSection } from '@/components/services/MethodSection'
import { PracticesSection } from '@/components/services/PracticesSection'
import { ServicesClosingCTA } from '@/components/services/ServicesClosingCTA'
import { ServicesHero } from '@/components/services/ServicesHero'
import { ServicesSelectedWork } from '@/components/services/ServicesSelectedWork'
import { getDictionary } from '@/i18n/dictionaries'
import { populated } from '@/lib/relations'
import type { Client, Project, Service } from '@/payload-types'
import { getGlobalAvailability } from '@/services/cms/availability'
import { getServicesPage } from '@/services/cms/globals'
import { getPageContext } from '@/services/cms/pageContext'
import { getFeaturedProjects } from '@/services/cms/projects'
import { getFeaturedClients, getPublishedClients } from '@/services/cms/proof'
import { getServices } from '@/services/cms/services'
import { resolvePageSEO } from '@/services/seo/resolvePageSEO'
import { buildPath, type Route } from '@/services/seo/urls'

/** ISR backstop for CMS edits `revalidatePath` cannot reach — see src/hooks/revalidate.ts. */
export const revalidate = 60

const route: Route = { type: 'services' }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const { ctx, site, draft } = await getPageContext(locale)
  const page = await getServicesPage(ctx)
  if (!page) return {}

  return resolvePageSEO({
    entity: { heading: page.heading, excerpt: page.intro, meta: page.meta },
    locale: ctx.locale,
    route,
    site,
    availability: await getGlobalAvailability('services-page'),
    isPreview: draft,
  })
}

export default async function ServicesPageRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const { ctx, draft } = await getPageContext(locale)

  const page = await getServicesPage(ctx)
  if (!page) notFound()

  const t = getDictionary(ctx.locale)
  const selectedProjects = populated<Project>(page.featuredProjects)
  const selectedClients = populated<Client>(page.featuredClients)

  const [allServices, fallbackProjects, featuredClients, availability] = await Promise.all([
    getServices(ctx),
    selectedProjects.length === 0 ? getFeaturedProjects(ctx) : Promise.resolve([]),
    selectedClients.length === 0 ? getFeaturedClients(ctx, 12) : Promise.resolve([]),
    getGlobalAvailability('services-page'),
  ])

  /**
   * Same three-step idiom this page uses for projects: an explicit editorial
   * selection first, then featured clients, then any approved client record.
   *
   * The explicit step exists because the two fallbacks answer "who may be
   * shown", not "who should be". Every published client qualified, so a
   * fixture record could reach this band — a public proof section. Naming the
   * selection makes the band's contents a decision rather than a side effect,
   * and an empty selection still falls through to the old behaviour.
   *
   * The fetch deliberately exceeds the six marks the band renders. Asking for
   * exactly six made `clients.length > shown.length` false however many
   * approved clients existed, so the band could never show its "and more"
   * mark — the reference's closing element on that row.
   */
  const clients =
    selectedClients.length > 0
      ? selectedClients
      : featuredClients.length > 0
        ? featuredClients
        : await getPublishedClients(ctx, 12)

  /**
   * Four public pillars. Grouping still follows `isPillar`, so the existing
   * service taxonomy and the /{locale}/services/{slug} detail routes are
   * unchanged by this composition — only their presentation is.
   */
  const pillars = allServices.filter((service) => service.isPillar)
  const projects = (selectedProjects.length > 0 ? selectedProjects : fallbackProjects).slice(0, 3)

  const servicePath = (service: Service) =>
    service.slug ? buildPath(ctx.locale, { type: 'service', slug: service.slug }) : null
  const projectPath = (project: Project) =>
    project.slug ? buildPath(ctx.locale, { type: 'project', slug: project.slug }) : null

  const contactHref = buildPath(ctx.locale, { type: 'contact' })
  const workHref = buildPath(ctx.locale, { type: 'work' })

  return (
    <>
      <SiteHeader locale={ctx.locale} route={route} availability={availability} draft={draft} />

      <main id="main" className="gc-tw bg-background">
        <ServicesHero
          eyebrow={page.eyebrow}
          heading={page.heading}
          intro={page.intro}
          media={page.heroMedia}
          primary={{
            label: page.primaryCTA?.label || t.actions.startProject,
            href: page.primaryCTA?.url || contactHref,
          }}
          secondary={{
            label: page.secondaryCTA?.label || t.actions.viewOurWork,
            href: page.secondaryCTA?.url || workHref,
          }}
        />

        <ExperienceStrip
          label={page.experienceLabel}
          clients={clients as Client[]}
          andMoreLabel={t.actions.andMore}
        />

        <PracticesSection
          label={page.practices?.label}
          heading={page.practices?.heading}
          body={page.practices?.body}
          practices={pillars}
          hrefFor={servicePath}
          exploreLabel={(service) => `${t.actions.explore} ${service.name}`}
        />

        <BeliefSection
          label={page.belief?.label}
          heading={page.belief?.heading}
          body={page.belief?.body}
          media={page.belief?.media}
          cta={page.belief?.cta}
          locale={ctx.locale}
        />

        <MethodSection
          label={page.method?.label}
          heading={page.method?.heading}
          intro={page.method?.intro}
          steps={page.method?.steps ?? []}
        />

        <ServicesSelectedWork
          label={t.sections.selectedWork}
          heading={page.workHeading}
          projects={projects}
          hrefFor={projectPath}
          seeAllHref={workHref}
          seeAllLabel={t.actions.seeAllWork}
          viewLabel={t.actions.viewCaseStudy}
        />

        <ServicesClosingCTA
          label={page.closing?.label}
          heading={page.closing?.heading}
          body={page.closing?.body}
          cta={page.closingCTA}
          secondaryLabel={page.closing?.secondaryLabel}
          secondaryHref={contactHref}
          locale={ctx.locale}
        />
      </main>
    </>
  )
}
