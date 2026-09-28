import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { breadcrumbSchema, JsonLd } from '@/components/seo/JsonLd'
import { TestimonialBlock } from '@/components/testimonial/TestimonialBlock'
import { RichText } from '@/components/ui/RichText'
import { Band, Heading, PageHeader, ProjectTile, RichProse, TileGrid } from '@/components/ui/Primitives'
import { ui } from '@/content/ui'
import { findService } from '@/content/services'
import { redirectOrNotFound } from '@/lib/routing'
import { mediaURL } from '@/lib/media'
import { populated } from '@/lib/relations'
import type { Industry, Service, Testimonial } from '@/payload-types'
import { getPageContext } from '@/services/cms/pageContext'
import { getProjectBySlug, getProjectsByRelation } from '@/services/cms/projects'
import { resolvePageSEO } from '@/services/seo/resolvePageSEO'
import { buildPath, type Route } from '@/services/seo/urls'

/** ISR backstop for CMS edits `revalidatePath` cannot reach — see src/hooks/revalidate.ts. */
export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { ctx, draft } = await getPageContext()
  const project = await getProjectBySlug(ctx, slug)
  if (!project) return {}

  return resolvePageSEO({
    entity: {
      title: project.title,
      excerpt: project.excerpt,
      heroMedia: project.heroMedia,
      meta: project.meta,
    },
    route: { type: 'project', slug },
    isPreview: draft,
  })
}

/**
 * The case study is the one page type that is genuinely dynamic: every field
 * below comes from the `projects` collection in Payload. Only the section
 * labels around it are source-owned.
 */
export default async function ProjectDetailRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { ctx } = await getPageContext()

  const project = await getProjectBySlug(ctx, slug)
  if (!project) return redirectOrNotFound(buildPath({ type: 'project', slug }))

  const route: Route = { type: 'project', slug }

  const services = populated<Service>(project.services)
  const industries = populated<Industry>(project.industries)
  const testimonials = populated<Testimonial>(project.relatedTestimonials)
  const gallery = (project.gallery ?? [])
    .map((item) => mediaURL(item.media, 'projectFeature'))
    .filter((url): url is string => Boolean(url))

  // A measured value renders only with its source. Estimates and targets
  // render with a visible label, so no projection reads as a result.
  const metrics = (project.metrics ?? []).filter(
    (metric) => metric.value && ((metric.kind ?? 'measured') !== 'measured' || metric.sourceNote),
  )
  const allMeasured = metrics.every((metric) => (metric.kind ?? 'measured') === 'measured')

  const relatedProjects = services[0]
    ? await getProjectsByRelation(ctx, 'services', services[0].id, 4)
    : []

  const heroImage = mediaURL(project.heroMedia ?? project.featuredMedia, 'hero')
  const clientName = typeof project.client === 'object' && project.client ? project.client.name : undefined

  const related = relatedProjects.filter((item) => item.id !== project.id)

  return (
    <>
      <SiteHeader route={route} />
      <JsonLd
        data={breadcrumbSchema([
          { name: ui.sections.selectedWork, route: { type: 'work' } },
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
                <dt className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Client</dt>
                <dd className="mt-2 text-sm text-foreground">{clientName}</dd>
              </div>
            )}
            {services.length > 0 && (
              <div className="bg-background p-6">
                <dt className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {ui.sections.capabilities}
                </dt>
                <dd className="mt-2 text-sm text-foreground">
                  {services.map((service) => service.name).join(', ')}
                </dd>
              </div>
            )}
            {industries.length > 0 && (
              <div className="bg-background p-6">
                <dt className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {ui.sections.industries}
                </dt>
                <dd className="mt-2 text-sm text-foreground">
                  {industries.map((industry) => industry.name).join(', ')}
                </dd>
              </div>
            )}
            {project.location && (
              <div className="bg-background p-6">
                <dt className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Location</dt>
                <dd className="mt-2 text-sm text-foreground">{project.location}</dd>
              </div>
            )}
          </dl>
        </div>

        {project.challenge && (
          <Band labelledBy="challenge">
            <Heading id="challenge">{ui.sections.challenge}</Heading>
            <RichProse className="mt-8">
              <RichText data={project.challenge} />
            </RichProse>
          </Band>
        )}

        {project.approach && (
          <Band surface labelledBy="approach">
            <Heading id="approach">{ui.sections.approach}</Heading>
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
            <Heading id="deliverables">{ui.sections.deliverables}</Heading>
            <RichProse className="mt-8">
              <RichText data={project.deliverables} />
            </RichProse>
          </Band>
        )}

        {project.outcome && (
          <Band surface labelledBy="outcome">
            <Heading id="outcome">{ui.sections.outcome}</Heading>
            <RichProse className="mt-8">
              <RichText data={project.outcome} />
            </RichProse>
            {project.resultsNote && (
              <p className="mt-6 max-w-[62ch] text-sm text-muted-foreground">{project.resultsNote}</p>
            )}
          </Band>
        )}

        {/* Measured metrics carry their source; estimates and targets carry a label. */}
        {metrics.length > 0 && (
          <Band labelledBy="metrics">
            <Heading id="metrics">{allMeasured ? ui.sections.metrics : ui.sections.metricsMixed}</Heading>
            <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.id ?? metric.label} className="bg-background p-8">
                  {(metric.kind ?? 'measured') !== 'measured' && (
                    <p className="mb-3 inline-block border border-border px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {metric.kind === 'target' ? ui.sections.metricTarget : ui.sections.metricEstimate}
                    </p>
                  )}
                  <p className="text-4xl font-semibold tracking-[-0.02em] text-primary">{metric.value}</p>
                  <p className="mt-3 text-sm font-medium text-foreground">{metric.label}</p>
                  {metric.sourceNote && <p className="mt-2 text-xs text-muted-foreground">{metric.sourceNote}</p>}
                </div>
              ))}
            </div>
          </Band>
        )}

        {testimonials.length > 0 && (
          <Band surface labelledBy="proof">
            <Heading id="proof">{ui.sections.testimonials}</Heading>
            <div className="mt-10 grid gap-px border border-border bg-border md:grid-cols-2">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-background p-8">
                  <TestimonialBlock testimonial={testimonial} />
                </div>
              ))}
            </div>
          </Band>
        )}

        {services.length > 0 && (
          <Band labelledBy="related-services">
            <Heading id="related-services">{ui.sections.relatedServices}</Heading>
            {/* Only the four service pages exist, and they are source-owned. A
                Payload service is linked when its slug matches one of them;
                every other term is named but not linked, so the page never
                sends a reader through a redirect or into a 404. */}
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              {services.map((service) => {
                const page = service.slug ? findService(service.slug) : undefined
                return (
                  <li key={service.id}>
                    {page ? (
                      <Link
                        href={buildPath({ type: 'service', slug: page.slug })}
                        className="text-primary underline underline-offset-4 hover:text-foreground"
                      >
                        {service.name}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">{service.name}</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </Band>
        )}

        {related.length > 0 && (
          <Band surface labelledBy="related-work">
            <Heading id="related-work">{ui.sections.relatedWork}</Heading>
            <div className="mt-10">
              <TileGrid>
                {related.map((item) => {
                  const itemClient = typeof item.client === 'object' ? item.client?.name : undefined
                  return (
                    <ProjectTile
                      key={item.id}
                      href={item.slug ? buildPath({ type: 'project', slug: item.slug }) : null}
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
