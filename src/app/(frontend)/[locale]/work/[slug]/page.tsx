import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { breadcrumbSchema, JsonLd } from '@/components/seo/JsonLd'
import { ProjectCard } from '@/components/project/ProjectCard'
import { TestimonialBlock } from '@/components/testimonial/TestimonialBlock'
import { RichText } from '@/components/ui/RichText'
import { Section, SectionHeader } from '@/components/ui/Sections'
import { getDictionary } from '@/i18n/dictionaries'
import { redirectOrNotFound } from '@/lib/routing'
import { mediaURL } from '@/lib/media'
import { populated } from '@/lib/relations'
import type { Industry, Service, Testimonial } from '@/payload-types'
import { getLocalizedAvailability } from '@/services/cms/availability'
import { getPageContext } from '@/services/cms/pageContext'
import { getProjectBySlug, getProjectsByRelation } from '@/services/cms/projects'
import { resolvePageSEO } from '@/services/seo/resolvePageSEO'
import { buildPath, type Route } from '@/services/seo/urls'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const { ctx, site, draft } = await getPageContext(locale)
  const project = await getProjectBySlug(ctx, slug)
  if (!project) return {}

  return resolvePageSEO({
    entity: {
      title: project.title,
      excerpt: project.excerpt,
      heroMedia: project.heroMedia,
      meta: project.meta,
    },
    locale: ctx.locale,
    route: { type: 'project', slug },
    site,
    availability: await getLocalizedAvailability('projects', project.id),
    isPreview: draft,
  })
}

export default async function ProjectDetailRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const { ctx, draft } = await getPageContext(locale)

  const project = await getProjectBySlug(ctx, slug)
  if (!project) return redirectOrNotFound(buildPath(ctx.locale, { type: 'project', slug }), ctx.locale)

  const t = getDictionary(ctx.locale)
  const route: Route = { type: 'project', slug }

  const services = populated<Service>(project.services)
  const industries = populated<Industry>(project.industries)
  const testimonials = populated<Testimonial>(project.relatedTestimonials)
  const gallery = (project.gallery ?? [])
    .map((item) => mediaURL(item.media, 'projectFeature'))
    .filter((url): url is string => Boolean(url))

  // Metrics without evidence are never rendered (CLAUDE.md §36, §139).
  const metrics = (project.metrics ?? []).filter((metric) => metric.value && metric.sourceNote)

  const [relatedProjects, availability] = await Promise.all([
    services[0] ? getProjectsByRelation(ctx, 'services', services[0].id, 4) : Promise.resolve([]),
    getLocalizedAvailability('projects', project.id),
  ])

  const heroImage = mediaURL(project.heroMedia ?? project.featuredMedia, 'hero')
  const clientName = typeof project.client === 'object' && project.client ? project.client.name : undefined

  return (
    <>
      <SiteHeader locale={ctx.locale} route={route} availability={availability} draft={draft} />
      <JsonLd
        data={breadcrumbSchema(ctx.locale, [
          { name: t.sections.selectedWork, route: { type: 'work' } },
          { name: project.title, route },
        ])}
      />

      <main id="main">
        <div className="gc-container gc-page-header">
          <p className="gc-eyebrow">{[clientName, project.year].filter(Boolean).join(' · ')}</p>
          <h1>{project.title}</h1>
          {project.shortStatement && (
            <p className="gc-lead" style={{ marginTop: '1.5rem' }}>
              {project.shortStatement}
            </p>
          )}
        </div>

        {heroImage && (
          <div className="gc-container" style={{ marginBottom: '3rem' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImage} alt={project.title} />
          </div>
        )}

        <div className="gc-container">
          <dl className="gc-detail-meta">
            {clientName && (
              <div>
                <dt>Client</dt>
                <dd>{clientName}</dd>
              </div>
            )}
            {services.length > 0 && (
              <div>
                <dt>{t.sections.capabilities}</dt>
                <dd>{services.map((service) => service.name).join(', ')}</dd>
              </div>
            )}
            {industries.length > 0 && (
              <div>
                <dt>{t.sections.industries}</dt>
                <dd>{industries.map((industry) => industry.name).join(', ')}</dd>
              </div>
            )}
            {project.location && (
              <div>
                <dt>Location</dt>
                <dd>{project.location}</dd>
              </div>
            )}
          </dl>
        </div>

        {project.challenge && (
          <Section labelledBy="challenge">
            <SectionHeader id="challenge" heading={t.sections.challenge} />
            <RichText data={project.challenge} />
          </Section>
        )}

        {project.approach && (
          <Section labelledBy="approach">
            <SectionHeader id="approach" heading={t.sections.approach} />
            <RichText data={project.approach} />
          </Section>
        )}

        {gallery.length > 0 && (
          <Section surface>
            <div className="gc-grid gc-grid--2">
              {gallery.map((url) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={url} src={url} alt="" loading="lazy" />
              ))}
            </div>
          </Section>
        )}

        {project.deliverables && (
          <Section labelledBy="deliverables">
            <SectionHeader id="deliverables" heading={t.sections.deliverables} />
            <RichText data={project.deliverables} />
          </Section>
        )}

        {project.outcome && (
          <Section labelledBy="outcome">
            <SectionHeader id="outcome" heading={t.sections.outcome} />
            <RichText data={project.outcome} />
            {project.resultsNote && <p className="gc-card__body">{project.resultsNote}</p>}
          </Section>
        )}

        {metrics.length > 0 && (
          <Section surface labelledBy="metrics">
            <SectionHeader id="metrics" heading={t.sections.metrics} />
            <div className="gc-metrics">
              {metrics.map((metric) => (
                <div key={metric.id ?? metric.label}>
                  <p className="gc-metric__value">{metric.value}</p>
                  <p className="gc-metric__label">{metric.label}</p>
                  <p className="gc-metric__source">{metric.sourceNote}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {testimonials.length > 0 && (
          <Section labelledBy="proof">
            <SectionHeader id="proof" heading={t.sections.testimonials} />
            <div className="gc-grid gc-grid--2">
              {testimonials.map((testimonial) => (
                <TestimonialBlock key={testimonial.id} testimonial={testimonial} locale={ctx.locale} />
              ))}
            </div>
          </Section>
        )}

        {services.length > 0 && (
          <Section labelledBy="related-services">
            <SectionHeader id="related-services" heading={t.sections.relatedServices} />
            <ul className="gc-footer__list">
              {services.map((service) =>
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

        {relatedProjects.filter((related) => related.id !== project.id).length > 0 && (
          <Section surface labelledBy="related-work">
            <SectionHeader id="related-work" heading={t.sections.relatedWork} />
            <div className="gc-grid gc-grid--3">
              {relatedProjects
                .filter((related) => related.id !== project.id)
                .map((related) => (
                  <ProjectCard key={related.id} project={related} locale={ctx.locale} />
                ))}
            </div>
          </Section>
        )}
      </main>
    </>
  )
}
