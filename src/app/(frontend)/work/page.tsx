import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { WorkFilters } from '@/components/project/WorkFilters'
import { PageHeader, ProjectTile, TileGrid } from '@/components/ui/Primitives'
import { ui } from '@/content/ui'
import { workContent } from '@/content/work'
import { baseQueryOptions, getPayloadClient } from '@/services/cms/context'
import { getIndustries } from '@/services/cms/industries'
import { getPageContext } from '@/services/cms/pageContext'
import { getProjects } from '@/services/cms/projects'
import { getServices } from '@/services/cms/services'
import { resolvePageSEO } from '@/services/seo/resolvePageSEO'
import { buildPath, type Route } from '@/services/seo/urls'

const route: Route = { type: 'work' }

type SearchParams = Promise<{ service?: string; industry?: string; type?: string; page?: string }>

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams
}): Promise<Metadata> {
  const query = await searchParams
  const { draft } = await getPageContext()

  const metadata = resolvePageSEO({
    entity: { heading: workContent.heading, excerpt: workContent.intro, meta: workContent.meta },
    route,
    isPreview: draft,
  })

  // Filter combinations canonicalize to the archive and are noindex, follow.
  const hasFilters = Boolean(query.service || query.industry || query.type || query.page)
  if (hasFilters) return { ...metadata, robots: { index: false, follow: true } }
  return metadata
}

/**
 * The page shell is source-owned; every project card comes from Payload. The
 * filters still run off the Payload taxonomy, which is unchanged.
 */
export default async function WorkArchiveRoute({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams
  const { ctx } = await getPageContext()
  const currentPage = Number.parseInt(query.page ?? '1', 10) || 1

  const [projects, taxonomyServices, industries, projectTypes] = await Promise.all([
    getProjects(ctx, {
      filters: { service: query.service, industry: query.industry, projectType: query.type },
      page: currentPage,
    }),
    getServices(ctx),
    getIndustries(ctx),
    (async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'project-types',
        ...baseQueryOptions(ctx),
        limit: 50,
        depth: 0,
        sort: ['displayOrder', 'name', 'id'],
      })
      return result.docs
    })(),
  ])

  const pageURL = (n: number) =>
    `${buildPath(route)}?${new URLSearchParams({ ...query, page: String(n) }).toString()}`

  return (
    <>
      <SiteHeader route={route} />

      <main id="main" className="gc-tw bg-background">
        <PageHeader
          eyebrow={workContent.eyebrow}
          heading={workContent.heading}
          intro={workContent.intro}
        />

        <div className="mx-auto w-full max-w-[76rem] px-6 pb-20 md:px-10 md:pb-28">
          <WorkFilters
            action={buildPath(route)}
            services={taxonomyServices
              .filter((service) => service.slug)
              .map((service) => ({ slug: service.slug as string, label: service.name }))}
            industries={industries
              .filter((industry) => industry.slug)
              .map((industry) => ({ slug: industry.slug as string, label: industry.name }))}
            projectTypes={projectTypes
              .filter((projectType) => projectType.slug)
              .map((projectType) => ({ slug: projectType.slug as string, label: projectType.name }))}
            selected={{ service: query.service, industry: query.industry, type: query.type }}
            dictionary={ui}
          />

          <div className="mt-10">
            {projects.docs.length > 0 ? (
              <TileGrid>
                {projects.docs.map((project) => {
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
            ) : (
              <p className="border border-border p-8 text-sm text-muted-foreground">
                {ui.actions.all} — 0
              </p>
            )}
          </div>

          {projects.totalPages > 1 && (
            <nav className="mt-10 flex gap-4" aria-label="Pagination">
              {projects.page > 1 && (
                <a
                  className="rounded-sm border border-border px-6 py-3 text-sm font-medium text-foreground hover:border-foreground"
                  href={pageURL(projects.page - 1)}
                >
                  {ui.actions.previous}
                </a>
              )}
              {projects.page < projects.totalPages && (
                <a
                  className="rounded-sm border border-border px-6 py-3 text-sm font-medium text-foreground hover:border-foreground"
                  href={pageURL(projects.page + 1)}
                >
                  {ui.actions.next}
                </a>
              )}
            </nav>
          )}
        </div>
      </main>
    </>
  )
}
