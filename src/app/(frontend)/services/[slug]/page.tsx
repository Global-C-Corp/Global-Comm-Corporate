import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { breadcrumbSchema, JsonLd } from '@/components/seo/JsonLd'
import { Band, Heading, PageHeader, ProjectTile, TileGrid } from '@/components/ui/Primitives'
import { findService, services } from '@/content/services'
import { ui } from '@/content/ui'
import { getPageContext } from '@/services/cms/pageContext'
import { getProjects } from '@/services/cms/projects'
import { resolvePageSEO } from '@/services/seo/resolvePageSEO'
import { buildPath, type Route } from '@/services/seo/urls'

/** The four services are known at build time. */
export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }))
}

/** Only the four code-owned slugs resolve; anything else is a 404. */
export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = findService(slug)
  if (!service) return {}

  return resolvePageSEO({
    entity: { name: service.name, shortDescription: service.summary },
    route: { type: 'service', slug },
  })
}

/**
 * Service detail. The page carries what the approved source material actually
 * holds — name, positioning line, summary — plus the real projects classified
 * under this practice. The longer sections the old CMS template could render
 * have never been written in any environment and are not invented here.
 */
export default async function ServiceDetailRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = findService(slug)
  if (!service) notFound()

  const { ctx } = await getPageContext()
  const route: Route = { type: 'service', slug }

  /**
   * Projects are classified against the Payload `services` taxonomy, whose
   * slugs are not these four. Filtering by the taxonomy slug would silently
   * return nothing, so the page shows recent published work instead of an
   * empty section that looks like a bug.
   */
  const { docs: relatedProjects } = await getProjects(ctx, { limit: 3 })

  return (
    <>
      <SiteHeader route={route} />
      <JsonLd
        data={breadcrumbSchema([
          { name: ui.sections.capabilities, route: { type: 'services' } },
          { name: service.name, route },
        ])}
      />

      <main id="main" className="gc-tw bg-background">
        <PageHeader
          eyebrow={service.positioningLine}
          heading={service.name}
          intro={service.summary}
        />

        {relatedProjects.length > 0 && (
          <Band labelledBy="related-work">
            <Heading id="related-work">{ui.sections.selectedWork}</Heading>
            <div className="mt-10">
              <TileGrid>
                {relatedProjects.map((project) => {
                  const client = typeof project.client === 'object' ? project.client?.name : undefined
                  return (
                    <ProjectTile
                      key={project.id}
                      href={project.slug ? buildPath({ type: 'project', slug: project.slug }) : null}
                      title={project.title}
                      meta={[client, project.year ? String(project.year) : undefined]
                        .filter(Boolean)
                        .join(' · ')}
                      excerpt={project.excerpt}
                    />
                  )
                })}
              </TileGrid>
            </div>
          </Band>
        )}
      </main>
    </>
  )
}
