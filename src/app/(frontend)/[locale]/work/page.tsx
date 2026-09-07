import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { WorkFilters } from '@/components/project/WorkFilters'
import { Band, CTA, PageHeader, ProjectTile, TileGrid } from '@/components/ui/Primitives'
import { getDictionary } from '@/i18n/dictionaries'
import { getGlobalAvailability } from '@/services/cms/availability'
import { getPayloadClient, baseQueryOptions } from '@/services/cms/context'
import { getWorkPage } from '@/services/cms/globals'
import { getIndustries } from '@/services/cms/industries'
import { getPageContext } from '@/services/cms/pageContext'
import { getProjects } from '@/services/cms/projects'
import { getServices } from '@/services/cms/services'
import { isMediaLed, projectTiles } from '@/services/cms/projectTiles'
import { resolvePageSEO } from '@/services/seo/resolvePageSEO'
import { buildPath, type Route } from '@/services/seo/urls'

const route: Route = { type: 'work' }

type SearchParams = Promise<{ service?: string; industry?: string; type?: string; page?: string }>

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: SearchParams
}): Promise<Metadata> {
  const { locale } = await params
  const query = await searchParams
  const { ctx, site, draft } = await getPageContext(locale)
  const page = await getWorkPage(ctx)
  if (!page) return {}

  const hasFilters = Boolean(query.service || query.industry || query.type || query.page)

  const metadata = resolvePageSEO({
    entity: { heading: page.heading, excerpt: page.intro, meta: page.meta },
    locale: ctx.locale,
    route,
    site,
    availability: await getGlobalAvailability('work-page'),
    isPreview: draft,
  })

  // Filter combinations canonicalize to the archive and are noindex, follow
  // (CLAUDE.md §53).
  if (hasFilters) {
    return { ...metadata, robots: { index: false, follow: true } }
  }
  return metadata
}

export default async function WorkArchiveRoute({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: SearchParams
}) {
  const { locale } = await params
  const query = await searchParams
  const { ctx, draft } = await getPageContext(locale)

  const page = await getWorkPage(ctx)
  if (!page) notFound()

  const t = getDictionary(ctx.locale)
  const currentPage = Number.parseInt(query.page ?? '1', 10) || 1

  const [projects, services, industries, projectTypes, availability] = await Promise.all([
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
        sort: ['displayOrder', 'name'],
      })
      return result.docs
    })(),
    getGlobalAvailability('work-page'),
  ])

  const pageURL = (n: number) =>
    `${buildPath(ctx.locale, route)}?${new URLSearchParams({ ...query, page: String(n) }).toString()}`

  const workTiles = projectTiles(projects.docs, ctx.locale)
  const workTilesAreMediaLed = isMediaLed(workTiles)

  return (
    <>
      <SiteHeader locale={ctx.locale} route={route} availability={availability} draft={draft} />

      <main id="main" className="gc-tw bg-background">
        <PageHeader eyebrow={page.eyebrow} heading={page.heading} intro={page.intro} />

        <div className="mx-auto w-full max-w-[76rem] px-6 pb-20 md:px-10 md:pb-28">
          <WorkFilters
            action={buildPath(ctx.locale, route)}
            services={services
              .filter((service) => service.slug)
              .map((service) => ({ slug: service.slug as string, label: service.name }))}
            industries={industries
              .filter((industry) => industry.slug)
              .map((industry) => ({ slug: industry.slug as string, label: industry.name }))}
            projectTypes={projectTypes
              .filter((projectType) => projectType.slug)
              .map((projectType) => ({ slug: projectType.slug as string, label: projectType.name }))}
            selected={{ service: query.service, industry: query.industry, type: query.type }}
            dictionary={t}
          />

          <div className="mt-10">
            {projects.docs.length > 0 ? (
              <TileGrid>
                {workTiles.map(({ project, href, meta, image }) => (
                  <ProjectTile
                    key={project.id}
                    href={href}
                    title={project.title}
                    meta={meta}
                    excerpt={project.excerpt}
                    image={image}
                    mediaLed={workTilesAreMediaLed}
                    headingLevel="h2"
                  />
                ))}
              </TileGrid>
            ) : (
              <p className="border border-border p-8 text-sm text-muted-foreground">{t.actions.noResults}</p>
            )}
          </div>

          {projects.totalPages > 1 && (
            <nav className="mt-10 flex gap-4" aria-label={t.a11y.pagination}>
              {projects.page > 1 && (
                <a
                  className="rounded-sm border border-border px-6 py-3 text-sm font-medium text-foreground hover:border-foreground"
                  href={pageURL(projects.page - 1)}
                >
                  {t.actions.previous}
                </a>
              )}
              {projects.page < projects.totalPages && (
                <a
                  className="rounded-sm border border-border px-6 py-3 text-sm font-medium text-foreground hover:border-foreground"
                  href={pageURL(projects.page + 1)}
                >
                  {t.actions.next}
                </a>
              )}
            </nav>
          )}
        </div>

        {page.closingCTA?.label && (
          <Band surface>
            <CTA cta={page.closingCTA} locale={ctx.locale} />
          </Band>
        )}
      </main>
    </>
  )
}
