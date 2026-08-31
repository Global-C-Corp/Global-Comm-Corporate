import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { ProjectCard } from '@/components/project/ProjectCard'
import { RichText } from '@/components/ui/RichText'
import { Section, SectionHeader } from '@/components/ui/Sections'
import { getDictionary } from '@/i18n/dictionaries'
import { redirectOrNotFound } from '@/lib/routing'
import { populated } from '@/lib/relations'
import type { Service } from '@/payload-types'
import { getLocalizedAvailability } from '@/services/cms/availability'
import { getIndustryBySlug } from '@/services/cms/industries'
import { getPageContext } from '@/services/cms/pageContext'
import { getProjectsByRelation } from '@/services/cms/projects'
import { resolvePageSEO } from '@/services/seo/resolvePageSEO'
import { buildPath, type Route } from '@/services/seo/urls'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const { ctx, site, draft } = await getPageContext(locale)
  const industry = await getIndustryBySlug(ctx, slug)
  if (!industry) return {}

  return resolvePageSEO({
    entity: {
      name: industry.name,
      shortDescription: industry.shortDescription,
      heroMedia: industry.heroMedia,
      meta: industry.meta,
    },
    locale: ctx.locale,
    route: { type: 'industry', slug },
    site,
    availability: await getLocalizedAvailability('industries', industry.id),
    isPreview: draft,
  })
}

export default async function IndustryDetailRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const { ctx, draft } = await getPageContext(locale)

  const industry = await getIndustryBySlug(ctx, slug)
  if (!industry) return redirectOrNotFound(buildPath(ctx.locale, { type: 'industry', slug }), ctx.locale)

  const t = getDictionary(ctx.locale)
  const route: Route = { type: 'industry', slug }

  const relatedServices = populated<Service>(industry.relatedServices)

  const [projects, availability] = await Promise.all([
    getProjectsByRelation(ctx, 'industries', industry.id),
    getLocalizedAvailability('industries', industry.id),
  ])

  return (
    <>
      <SiteHeader locale={ctx.locale} route={route} availability={availability} draft={draft} />

      <main id="main">
        <div className="gc-container gc-page-header">
          <p className="gc-eyebrow">{t.sections.industries}</p>
          <h1>{industry.name}</h1>
          {industry.shortDescription && (
            <p className="gc-lead" style={{ marginTop: '1.5rem' }}>
              {industry.shortDescription}
            </p>
          )}
        </div>

        {industry.challenges && (
          <Section labelledBy="challenges">
            <SectionHeader id="challenges" heading={t.sections.challenge} />
            <RichText data={industry.challenges} />
          </Section>
        )}

        {industry.capabilities && (
          <Section labelledBy="capabilities">
            <SectionHeader id="capabilities" heading={t.sections.capabilities} />
            <RichText data={industry.capabilities} />
          </Section>
        )}

        {projects.length > 0 && (
          <Section surface labelledBy="industry-work">
            <SectionHeader id="industry-work" heading={t.sections.selectedWork} />
            <div className="gc-grid gc-grid--3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} locale={ctx.locale} />
              ))}
            </div>
          </Section>
        )}

        {relatedServices.length > 0 && (
          <Section labelledBy="related-services">
            <SectionHeader id="related-services" heading={t.sections.relatedServices} />
            <ul className="gc-footer__list">
              {relatedServices.map((service) =>
                service.slug ? (
                  <li key={service.id}>
                    <Link href={buildPath(ctx.locale, { type: 'service', slug: service.slug })}>{service.name}</Link>
                  </li>
                ) : (
                  <li key={service.id}>{service.name}</li>
                ),
              )}
            </ul>
          </Section>
        )}
      </main>
    </>
  )
}
