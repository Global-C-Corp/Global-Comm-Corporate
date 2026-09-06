import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { breadcrumbSchema, JsonLd } from '@/components/seo/JsonLd'
import { AbsorbedCapability } from '@/components/service/AbsorbedCapability'
import { Band, Heading, PageHeader, ProjectTile, RichProse, TileGrid } from '@/components/ui/Primitives'
import { RichText } from '@/components/ui/RichText'
import { getDictionary } from '@/i18n/dictionaries'
import { redirectOrNotFound } from '@/lib/routing'
import { getLocalizedAvailability } from '@/services/cms/availability'
import { getPageContext } from '@/services/cms/pageContext'
import { getProjectsByRelation } from '@/services/cms/projects'
import { isMediaLed, projectTiles } from '@/services/cms/projectTiles'
import { getFoldedServices, getServiceBySlug } from '@/services/cms/services'
import { resolvePageSEO } from '@/services/seo/resolvePageSEO'
import { buildPath, type Route } from '@/services/seo/urls'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const { ctx, site, draft } = await getPageContext(locale)
  const service = await getServiceBySlug(ctx, slug)
  if (!service) return {}

  const route: Route = { type: 'service', slug }

  return resolvePageSEO({
    entity: {
      name: service.name,
      shortDescription: service.shortDescription,
      heroMedia: service.heroMedia,
      meta: service.meta,
    },
    locale: ctx.locale,
    route,
    site,
    availability: await getLocalizedAvailability('services', service.id),
    isPreview: draft,
  })
}

export default async function ServiceDetailRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const { ctx, draft } = await getPageContext(locale)

  const service = await getServiceBySlug(ctx, slug)

  // Only the four pillars have a public page. A folded term falls through to
  // its Payload redirect record, which 301s to the pillar that absorbed it
  // (CLAUDE.md §29-§30, §70).
  if (!service || !service.isPillar) {
    return redirectOrNotFound(buildPath(ctx.locale, { type: 'service', slug }), ctx.locale)
  }

  const t = getDictionary(ctx.locale)
  const route: Route = { type: 'service', slug }

  const [absorbed, relatedProjects, availability] = await Promise.all([
    getFoldedServices(ctx, service.id),
    getProjectsByRelation(ctx, 'services', service.id),
    getLocalizedAvailability('services', service.id),
  ])

  const tiles = projectTiles(relatedProjects, ctx.locale)
  const tilesAreMediaLed = isMediaLed(tiles)

  return (
    <>
      <SiteHeader locale={ctx.locale} route={route} availability={availability} draft={draft} />
      <JsonLd
        data={breadcrumbSchema(ctx.locale, [
          { name: t.sections.capabilities, route: { type: 'services' } },
          { name: service.name, route },
        ])}
      />

      <main id="main" className="gc-tw bg-background">
        <PageHeader
          eyebrow={t.sections.capabilities}
          heading={service.name}
          intro={service.shortDescription}
        />

        {/* Empty sections are hidden rather than rendered blank (CLAUDE.md §76, §139). */}
        {service.clientProblem && (
          <Band surface labelledBy="client-problem">
            <Heading id="client-problem">{t.sections.clientProblem}</Heading>
            <RichProse className="mt-8">
              <RichText data={service.clientProblem} />
            </RichProse>
          </Band>
        )}

        {service.longDescription && (
          <Band labelledBy="what-we-do">
            <Heading id="what-we-do">{t.sections.whatWeDo}</Heading>
            <RichProse className="mt-8">
              <RichText data={service.longDescription} />
            </RichProse>
          </Band>
        )}

        {/* Absorbed capabilities are sections, not links: these terms no
            longer have a public page (§29-§30). */}
        {absorbed.length > 0 && (
          <Band surface labelledBy="capabilities">
            <Heading id="capabilities">{t.sections.capabilities}</Heading>
            <div className="mt-10 grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
              {absorbed.map((child) => (
                <AbsorbedCapability key={child.id} service={child} />
              ))}
            </div>
          </Band>
        )}

        {relatedProjects.length > 0 && (
          <Band labelledBy="related-work">
            <Heading id="related-work">{t.sections.selectedWork}</Heading>
            <div className="mt-10">
              <TileGrid>
                {tiles.map(({ project, href, meta, image }) => (
                  <ProjectTile
                    key={project.id}
                    href={href}
                    title={project.title}
                    meta={meta}
                    excerpt={project.excerpt}
                    image={image}
                    mediaLed={tilesAreMediaLed}
                  />
                ))}
              </TileGrid>
            </div>
          </Band>
        )}

        {service.approach && (
          <Band surface labelledBy="approach">
            <Heading id="approach">{t.sections.approach}</Heading>
            <RichProse className="mt-8">
              <RichText data={service.approach} />
            </RichProse>
          </Band>
        )}

        {service.deliverables && (
          <Band labelledBy="deliverables">
            <Heading id="deliverables">{t.sections.deliverables}</Heading>
            <RichProse className="mt-8">
              <RichText data={service.deliverables} />
            </RichProse>
          </Band>
        )}

        {service.outcomes && (
          <Band surface labelledBy="outcomes">
            <Heading id="outcomes">{t.sections.outcome}</Heading>
            <RichProse className="mt-8">
              <RichText data={service.outcomes} />
            </RichProse>
          </Band>
        )}
      </main>
    </>
  )
}
