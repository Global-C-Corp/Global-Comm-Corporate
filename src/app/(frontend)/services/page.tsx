import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { BeliefSection } from '@/components/services/BeliefSection'
import { ExperienceStrip } from '@/components/services/ExperienceStrip'
import { MethodSection } from '@/components/services/MethodSection'
import { PracticesSection } from '@/components/services/PracticesSection'
import { ServicesClosingCTA } from '@/components/services/ServicesClosingCTA'
import { ServicesHero } from '@/components/services/ServicesHero'
import { ServicesSelectedWork } from '@/components/services/ServicesSelectedWork'
import { services, servicesContent } from '@/content/services'
import { ui } from '@/content/ui'
import type { Project } from '@/payload-types'
import { getPageContext } from '@/services/cms/pageContext'
import { getFeaturedProjects } from '@/services/cms/projects'
import { getFeaturedClients, getPublishedClients } from '@/services/cms/proof'
import { resolvePageSEO } from '@/services/seo/resolvePageSEO'
import { buildPath, type Route } from '@/services/seo/urls'

const route: Route = { type: 'services' }

/**
 * ISR backstop: the page copy is source-owned, but the client strip and the
 * project cards come from Payload — see src/hooks/revalidate.ts.
 */
export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const { draft } = await getPageContext()
  return resolvePageSEO({
    entity: { heading: servicesContent.heading, excerpt: servicesContent.intro, meta: servicesContent.meta },
    route,
    isPreview: draft,
  })
}

/**
 * Page copy and the four practices are source-owned. The proof surfaces — the
 * client strip and Selected Work — stay Payload-backed.
 */
export default async function ServicesPageRoute() {
  const { ctx } = await getPageContext()

  const [featuredProjects, featuredClients] = await Promise.all([
    getFeaturedProjects(ctx),
    getFeaturedClients(ctx, 12),
  ])

  const clients = featuredClients.length > 0 ? featuredClients : await getPublishedClients(ctx, 12)
  const projects: Project[] = featuredProjects.slice(0, 3)

  const projectPath = (project: Project) =>
    project.slug ? buildPath({ type: 'project', slug: project.slug }) : null

  return (
    <>
      <SiteHeader route={route} />

      <main id="main" className="gc-tw bg-background">
        <ServicesHero
          eyebrow={servicesContent.eyebrow}
          heading={servicesContent.heading}
          intro={servicesContent.intro}
          primary={{ label: servicesContent.primaryCTA.label, href: servicesContent.primaryCTA.url }}
          secondary={{ label: servicesContent.secondaryCTA.label, href: servicesContent.secondaryCTA.url }}
        />

        <ExperienceStrip
          label={servicesContent.experienceLabel}
          clients={clients}
          andMoreLabel={ui.actions.andMore}
        />

        <PracticesSection
          label={servicesContent.practices.label}
          heading={servicesContent.practices.heading}
          practices={services}
          hrefFor={(service) => buildPath({ type: 'service', slug: service.slug })}
          exploreLabel={(service) => `${ui.actions.explore} ${service.name}`}
        />

        <BeliefSection
          label={servicesContent.belief.label}
          heading={servicesContent.belief.heading}
          cta={{ label: servicesContent.belief.ctaLabel, url: buildPath({ type: 'company' }) }}
        />

        <MethodSection
          label={servicesContent.method.label}
          heading={servicesContent.method.heading}
          steps={servicesContent.method.steps}
        />

        <ServicesSelectedWork
          label={ui.sections.selectedWork}
          heading={servicesContent.workHeading}
          projects={projects}
          hrefFor={projectPath}
          seeAllHref={buildPath({ type: 'work' })}
          seeAllLabel={ui.actions.seeAllWork}
          viewLabel={ui.actions.viewCaseStudy}
        />

        <ServicesClosingCTA
          label={servicesContent.closing.label}
          heading={servicesContent.closing.heading}
          body={servicesContent.closing.body}
          cta={servicesContent.closing.cta}
        />
      </main>
    </>
  )
}
