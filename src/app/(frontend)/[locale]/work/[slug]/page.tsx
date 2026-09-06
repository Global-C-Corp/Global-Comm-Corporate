import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { breadcrumbSchema, JsonLd } from '@/components/seo/JsonLd'
import { TestimonialBlock } from '@/components/testimonial/TestimonialBlock'
import { RichText } from '@/components/ui/RichText'
import { Band, Heading, PageHeader, ProjectTile, RichProse, TileGrid } from '@/components/ui/Primitives'
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

  const related = relatedProjects.filter((item) => item.id !== project.id)

  return (
    <>
      <SiteHeader locale={ctx.locale} route={route} availability={availability} draft={draft} />
      <JsonLd
        data={breadcrumbSchema(ctx.locale, [
          { name: t.sections.selectedWork, route: { type: 'work' } },
          { name: project.title, route },
        ])}
      />

      <main id="main" className="gc-tw bg-background">
        <PageHeader
          eyebrow={[clientName, project.year].filter(Boolean).join(' · ')}
          heading={project.title}
          intro={project.shortStatement}
        />

        <div className="mx-auto w-full max-w-[76rem] px-6 md:px-10">
          {heroImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroImage} alt={project.title} className="w-full border border-border" />
          )}

          <dl className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {clientName && (
              <div className="bg-background p-6">
                <dt className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{t.meta.client}</dt>
                <dd className="mt-2 text-sm text-foreground">{clientName}</dd>
              </div>
            )}
            {services.length > 0 && (
              <div className="bg-background p-6">
                <dt className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  {t.sections.capabilities}
                </dt>
                <dd className="mt-2 text-sm text-foreground">
                  {services.map((service) => service.name).join(', ')}
                </dd>
              </div>
            )}
            {industries.length > 0 && (
              <div className="bg-background p-6">
                <dt className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  {t.sections.industries}
                </dt>
                <dd className="mt-2 text-sm text-foreground">
                  {industries.map((industry) => industry.name).join(', ')}
                </dd>
              </div>
            )}
            {project.location && (
              <div className="bg-background p-6">
                <dt className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{t.meta.location}</dt>
                <dd className="mt-2 text-sm text-foreground">{project.location}</dd>
              </div>
            )}
          </dl>
        </div>

        {project.challenge && (
          <Band labelledBy="challenge">
            <Heading id="challenge">{t.sections.challenge}</Heading>
            <RichProse className="mt-8">
              <RichText data={project.challenge} />
            </RichProse>
          </Band>
        )}

        {project.approach && (
          <Band surface labelledBy="approach">
            <Heading id="approach">{t.sections.approach}</Heading>
            <RichProse className="mt-8">
              <RichText data={project.approach} />
            </RichProse>
          </Band>
        )}

        {gallery.length > 0 && (
          <Band>
            <div className="grid gap-6 md:grid-cols-2">
              {gallery.map((url) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={url} src={url} alt="" loading="lazy" className="w-full border border-border" />
              ))}
            </div>
          </Band>
        )}

        {project.deliverables && (
          <Band labelledBy="deliverables">
            <Heading id="deliverables">{t.sections.deliverables}</Heading>
            <RichProse className="mt-8">
              <RichText data={project.deliverables} />
            </RichProse>
          </Band>
        )}

        {project.outcome && (
          <Band surface labelledBy="outcome">
            <Heading id="outcome">{t.sections.outcome}</Heading>
            <RichProse className="mt-8">
              <RichText data={project.outcome} />
            </RichProse>
            {project.resultsNote && (
              <p className="mt-6 max-w-[62ch] text-sm text-muted-foreground">{project.resultsNote}</p>
            )}
          </Band>
        )}

        {/* Every metric shown carries its source; unsourced values never
            render (CLAUDE.md §36, §139). */}
        {metrics.length > 0 && (
          <Band labelledBy="metrics">
            <Heading id="metrics">{t.sections.metrics}</Heading>
            <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.id ?? metric.label} className="bg-background p-8">
                  <p className="text-4xl font-semibold tracking-[-0.02em] text-primary">{metric.value}</p>
                  <p className="mt-3 text-sm font-medium text-foreground">{metric.label}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{metric.sourceNote}</p>
                </div>
              ))}
            </div>
          </Band>
        )}

        {testimonials.length > 0 && (
          <Band surface labelledBy="proof">
            <Heading id="proof">{t.sections.testimonials}</Heading>
            <div className="mt-10 grid gap-px border border-border bg-border md:grid-cols-2">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-background p-8">
                  <TestimonialBlock testimonial={testimonial} locale={ctx.locale} />
                </div>
              ))}
            </div>
          </Band>
        )}

        {services.length > 0 && (
          <Band labelledBy="related-services">
            <Heading id="related-services">{t.sections.relatedServices}</Heading>
            {/* Only the four pillars have pages. A folded term is named but not
                linked, so the page never sends a reader through a redirect
                (§29-§30, §70). */}
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              {services.map((service) => (
                <li key={service.id}>
                  {service.isPillar && service.slug ? (
                    <Link
                      href={buildPath(ctx.locale, { type: 'service', slug: service.slug })}
                      className="text-primary underline underline-offset-4 hover:text-foreground"
                    >
                      {service.name}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">{service.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </Band>
        )}

        {related.length > 0 && (
          <Band surface labelledBy="related-work">
            <Heading id="related-work">{t.sections.relatedWork}</Heading>
            <div className="mt-10">
              <TileGrid>
                {related.map((item) => {
                  const itemClient = typeof item.client === 'object' ? item.client?.name : undefined
                  return (
                    <ProjectTile
                      key={item.id}
                      href={item.slug ? buildPath(ctx.locale, { type: 'project', slug: item.slug }) : null}
                      title={item.title}
                      meta={[itemClient, item.year ? String(item.year) : undefined].filter(Boolean).join(' · ')}
                      excerpt={item.excerpt}
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
