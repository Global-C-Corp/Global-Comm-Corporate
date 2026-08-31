import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { ProjectCard } from '@/components/project/ProjectCard'
import { WorkFilters } from '@/components/project/WorkFilters'
import { CTALinks, Section } from '@/components/ui/Sections'
import { getDictionary } from '@/i18n/dictionaries'
import { getGlobalAvailability } from '@/services/cms/availability'
import { getPayloadClient, baseQueryOptions } from '@/services/cms/context'
import { getWorkPage } from '@/services/cms/globals'
import { getIndustries } from '@/services/cms/industries'
import { getPageContext } from '@/services/cms/pageContext'
import { getProjects } from '@/services/cms/projects'
import { getServices } from '@/services/cms/services'
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

  return (
    <>
      <SiteHeader locale={ctx.locale} route={route} availability={availability} draft={draft} />

      <main id="main">
        <div className="gc-container gc-page-header">
          {page.eyebrow && <p className="gc-eyebrow">{page.eyebrow}</p>}
          {page.heading && <h1>{page.heading}</h1>}
          {page.intro && <p className="gc-lead" style={{ marginTop: '1.5rem' }}>{page.intro}</p>}
        </div>

        <Section flush>
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

          {projects.docs.length > 0 ? (
            <div className="gc-grid gc-grid--3">
              {projects.docs.map((project) => (
                <ProjectCard key={project.id} project={project} locale={ctx.locale} />
              ))}
            </div>
          ) : (
            <p className="gc-lead">—</p>
          )}

          {projects.totalPages > 1 && (
            <nav className="gc-button-row" aria-label="Pagination">
              {projects.page > 1 && (
                <a
                  className="gc-button gc-button--secondary"
                  href={`${buildPath(ctx.locale, route)}?${new URLSearchParams({ ...query, page: String(projects.page - 1) }).toString()}`}
                >
                  {t.actions.previous}
                </a>
              )}
              {projects.page < projects.totalPages && (
                <a
                  className="gc-button gc-button--secondary"
                  href={`${buildPath(ctx.locale, route)}?${new URLSearchParams({ ...query, page: String(projects.page + 1) }).toString()}`}
                >
                  {t.actions.next}
                </a>
              )}
            </nav>
          )}
        </Section>

        {page.closingCTA?.label && (
          <Section surface>
            <CTALinks ctas={[page.closingCTA]} locale={ctx.locale} />
          </Section>
        )}
      </main>
    </>
  )
}
