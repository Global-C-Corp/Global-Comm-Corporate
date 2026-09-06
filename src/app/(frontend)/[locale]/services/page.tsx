import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SiteHeader } from '@/components/layout/SiteHeader'
import {
  Band,
  CTA,
  Heading,
  PageHeader,
  ProjectTile,
  TileGrid,
} from '@/components/ui/Primitives'
import { getDictionary } from '@/i18n/dictionaries'
import { populated } from '@/lib/relations'
import type { Project } from '@/payload-types'
import { getGlobalAvailability } from '@/services/cms/availability'
import { getServicesPage } from '@/services/cms/globals'
import { getPageContext } from '@/services/cms/pageContext'
import { getFeaturedProjects } from '@/services/cms/projects'
import { getServices } from '@/services/cms/services'
import { resolvePageSEO } from '@/services/seo/resolvePageSEO'
import { buildPath, type Route } from '@/services/seo/urls'

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

      <main id="main" className="gc-tw bg-background">
        <PageHeader eyebrow={page.eyebrow} heading={page.heading} intro={page.intro} />

        {pillars.length > 0 && (
          <Band surface labelledBy="pillars">
            <Heading id="pillars">{t.sections.whatWeDo}</Heading>

            <div className="mt-10 grid gap-px border border-border bg-border md:grid-cols-2">
              {pillars.map((service) => {
                const folded = foldedByPillar.get(String(service.id)) ?? []
                const href = service.slug
                  ? buildPath(ctx.locale, { type: 'service', slug: service.slug })
                  : null

                return (
                  <article key={service.id} className="flex flex-col bg-background p-8 md:p-10">
                    <h3 className="text-xl font-semibold text-foreground">
                      {href ? (
                        <Link href={href} className="hover:text-primary">
                          {service.name}
                        </Link>
                      ) : (
                        service.name
                      )}
                    </h3>
                    {service.shortDescription && (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {service.shortDescription}
                      </p>
                    )}

                    {/* Absorbed capabilities are listed, not linked: they have
                        no public page of their own (§29-§30). */}
                    {folded.length > 0 && (
                      <ul className="mt-6 space-y-2 text-sm text-foreground">
                        {folded.map((child) => (
                          <li key={child.id} className="border-t border-border pt-2">
                            {child.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                )
              })}
            </div>
          </Band>
        )}

        {projects.length > 0 && (
          <Band labelledBy="services-work">
            <Heading id="services-work">{t.sections.selectedWork}</Heading>
            <div className="mt-10">
              <TileGrid>
                {projects.map((project) => {
                  const client = typeof project.client === 'object' ? project.client?.name : undefined
                  return (
                    <ProjectTile
                      key={project.id}
                      href={project.slug ? buildPath(ctx.locale, { type: 'project', slug: project.slug }) : null}
                      title={project.title}
                      meta={[client, project.year ? String(project.year) : undefined].filter(Boolean).join(' · ')}
                      excerpt={project.excerpt}
                    />
                  )
                })}
              </TileGrid>
            </div>
          </Band>
        )}

        {page.closingCTA?.label && (
          <Band surface>
            <CTA cta={page.closingCTA} locale={ctx.locale} />
          </Band>
        )}
      </main>
    </>
  )
}
