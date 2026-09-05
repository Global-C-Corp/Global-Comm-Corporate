import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { ProjectCard } from '@/components/project/ProjectCard'
import { ServiceCard } from '@/components/service/ServiceCard'
import { CTALinks, Section, SectionHeader } from '@/components/ui/Sections'
import { getDictionary } from '@/i18n/dictionaries'
import { populated } from '@/lib/relations'
import type { Project } from '@/payload-types'
import { getGlobalAvailability } from '@/services/cms/availability'
import { getServicesPage } from '@/services/cms/globals'
import { getPageContext } from '@/services/cms/pageContext'
import { getFeaturedProjects } from '@/services/cms/projects'
import { getServices } from '@/services/cms/services'
import { resolvePageSEO } from '@/services/seo/resolvePageSEO'
import type { Route } from '@/services/seo/urls'

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

  const [allServices, fallbackProjects, availability] = await Promise.all([
    getServices(ctx),
    selectedProjects.length === 0 ? getFeaturedProjects(ctx) : Promise.resolve([]),
    getGlobalAvailability('services-page'),
  ])

  // Four public pillars, each listing what it absorbs. Grouping follows
  // `foldedInto` rather than `parent`, so a term whose parent stopped being
  // public still appears under the pillar that took it over (§29-§30).
  const pillars = allServices.filter((service) => service.isPillar)
  const foldedByPillar = new Map<string, typeof allServices>()
  for (const service of allServices) {
    const pillarId = typeof service.foldedInto === 'object' ? service.foldedInto?.id : service.foldedInto
    if (pillarId === undefined || pillarId === null) continue
    const key = String(pillarId)
    foldedByPillar.set(key, [...(foldedByPillar.get(key) ?? []), service])
  }

  const projects = selectedProjects.length > 0 ? selectedProjects : fallbackProjects

  return (
    <>
      <SiteHeader locale={ctx.locale} route={route} availability={availability} draft={draft} />

      <main id="main">
        <div className="gc-container gc-page-header">
          {page.eyebrow && <p className="gc-eyebrow">{page.eyebrow}</p>}
          {page.heading && <h1>{page.heading}</h1>}
          {page.intro && <p className="gc-lead" style={{ marginTop: '1.5rem' }}>{page.intro}</p>}
        </div>

        {pillars.length > 0 && (
          <Section labelledBy="pillars">
            <SectionHeader id="pillars" heading={t.sections.whatWeDo} />
            <div className="gc-grid gc-grid--2">
              {pillars.map((service) => {
                const folded = foldedByPillar.get(String(service.id)) ?? []
                return (
                  <ServiceCard key={service.id} service={service} locale={ctx.locale}>
                    {folded.length > 0 && (
                      <ul className="gc-footer__list" style={{ marginTop: '0.5rem' }}>
                        {folded.map((child) => (
                          <li key={child.id} className="gc-card__body">
                            {child.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </ServiceCard>
                )
              })}
            </div>
          </Section>
        )}

        {projects.length > 0 && (
          <Section surface labelledBy="services-work">
            <SectionHeader id="services-work" heading={t.sections.selectedWork} />
            <div className="gc-grid gc-grid--3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} locale={ctx.locale} />
              ))}
            </div>
          </Section>
        )}

        {page.closingCTA?.label && (
          <Section>
            <CTALinks ctas={[page.closingCTA]} locale={ctx.locale} />
          </Section>
        )}
      </main>
    </>
  )
}
