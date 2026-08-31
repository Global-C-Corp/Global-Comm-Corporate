import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { breadcrumbSchema, JsonLd } from '@/components/seo/JsonLd'
import { ProjectCard } from '@/components/project/ProjectCard'
import { ServiceCard } from '@/components/service/ServiceCard'
import { RichText } from '@/components/ui/RichText'
import { Section, SectionHeader } from '@/components/ui/Sections'
import { getDictionary } from '@/i18n/dictionaries'
import { redirectOrNotFound } from '@/lib/routing'
import { getLocalizedAvailability } from '@/services/cms/availability'
import { getPageContext } from '@/services/cms/pageContext'
import { getProjectsByRelation } from '@/services/cms/projects'
import { getChildServices, getServiceBySlug } from '@/services/cms/services'
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
  if (!service) return redirectOrNotFound(buildPath(ctx.locale, { type: 'service', slug }), ctx.locale)

  const t = getDictionary(ctx.locale)
  const route: Route = { type: 'service', slug }

  const [children, relatedProjects, availability] = await Promise.all([
    getChildServices(ctx, service.id),
    getProjectsByRelation(ctx, 'services', service.id),
    getLocalizedAvailability('services', service.id),
  ])

  return (
    <>
      <SiteHeader locale={ctx.locale} route={route} availability={availability} draft={draft} />
      <JsonLd
        data={breadcrumbSchema(ctx.locale, [
          { name: t.sections.capabilities, route: { type: 'services' } },
          { name: service.name, route },
        ])}
      />

      <main id="main">
        <div className="gc-container gc-page-header">
          <p className="gc-eyebrow">{t.sections.capabilities}</p>
          <h1>{service.name}</h1>
          {service.shortDescription && (
            <p className="gc-lead" style={{ marginTop: '1.5rem' }}>
              {service.shortDescription}
            </p>
          )}
        </div>

        {/* Empty sections are hidden rather than rendered blank (CLAUDE.md §76, §139). */}
        {service.clientProblem && (
          <Section labelledBy="client-problem">
            <SectionHeader id="client-problem" heading={t.sections.clientProblem} />
            <RichText data={service.clientProblem} />
          </Section>
        )}

        {service.longDescription && (
          <Section labelledBy="what-we-do">
            <SectionHeader id="what-we-do" heading={t.sections.whatWeDo} />
            <RichText data={service.longDescription} />
          </Section>
        )}

        {children.length > 0 && (
          <Section surface labelledBy="capabilities">
            <SectionHeader id="capabilities" heading={t.sections.capabilities} />
            <div className="gc-grid gc-grid--3">
              {children.map((child) => (
                <ServiceCard key={child.id} service={child} locale={ctx.locale} />
              ))}
            </div>
          </Section>
        )}

        {relatedProjects.length > 0 && (
          <Section labelledBy="related-work">
            <SectionHeader id="related-work" heading={t.sections.selectedWork} />
            <div className="gc-grid gc-grid--3">
              {relatedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} locale={ctx.locale} />
              ))}
            </div>
          </Section>
        )}

        {service.approach && (
          <Section labelledBy="approach">
            <SectionHeader id="approach" heading={t.sections.approach} />
            <RichText data={service.approach} />
          </Section>
        )}

        {service.deliverables && (
          <Section labelledBy="deliverables">
            <SectionHeader id="deliverables" heading={t.sections.deliverables} />
            <RichText data={service.deliverables} />
          </Section>
        )}

        {service.outcomes && (
          <Section labelledBy="outcomes">
            <SectionHeader id="outcomes" heading={t.sections.outcome} />
            <RichText data={service.outcomes} />
          </Section>
        )}
      </main>
    </>
  )
}
