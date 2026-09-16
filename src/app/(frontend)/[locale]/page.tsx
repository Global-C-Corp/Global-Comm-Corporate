import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { JsonLd, organizationSchema } from '@/components/seo/JsonLd'
import { TestimonialBlock } from '@/components/testimonial/TestimonialBlock'
import { Band, Bullets, CTA, Heading, Kicker, Ordinal, Prose } from '@/components/ui/Primitives'
import { isMedia, mediaURL } from '@/lib/media'
import { populated } from '@/lib/relations'
import type { Client, Project, Service, Testimonial } from '@/payload-types'
import { getGlobalAvailability } from '@/services/cms/availability'
import { getHomePage, getSiteChrome } from '@/services/cms/globals'
import { getPageContext } from '@/services/cms/pageContext'
import { getFeaturedProjects } from '@/services/cms/projects'
import { getFeaturedClients, getFeaturedTestimonials } from '@/services/cms/proof'
import { resolvePageSEO } from '@/services/seo/resolvePageSEO'
import { buildPath, type Route } from '@/services/seo/urls'

const route: Route = { type: 'home' }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const { ctx, site, draft } = await getPageContext(locale)
  const page = await getHomePage(ctx)
  if (!page) return {}

  return resolvePageSEO({
    entity: { heading: page.heroHeading, excerpt: page.heroBody, meta: page.meta },
    locale: ctx.locale,
    route,
    site,
    availability: await getGlobalAvailability('home-page'),
    isPreview: draft,
  })
}

const values = (items?: { value?: string | null }[] | null): string[] =>
  (items ?? []).map((item) => item.value).filter((value): value is string => Boolean(value))

function projectMedia(project: Project): { url?: string; alt: string } {
  const source = project.featuredMedia ?? project.heroMedia
  return {
    url: mediaURL(source, 'projectFeature') ?? mediaURL(source),
    alt: isMedia(source) && source.alt ? source.alt : project.title,
  }
}

export default async function HomePageRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const { ctx, draft } = await getPageContext(locale)

  const page = await getHomePage(ctx)
  if (!page) notFound()

  const selectedClients = populated<Client>(page.featuredClients)
  const selectedProjects = populated<Project>(page.featuredProjects)
  const selectedTestimonials = populated<Testimonial>(page.featuredTestimonials)

  const [fallbackProjects, fallbackClients, fallbackTestimonials, availability] = await Promise.all([
    selectedProjects.length === 0 ? getFeaturedProjects(ctx) : Promise.resolve([]),
    selectedClients.length === 0 ? getFeaturedClients(ctx) : Promise.resolve([]),
    selectedTestimonials.length === 0 ? getFeaturedTestimonials(ctx) : Promise.resolve([]),
    getGlobalAvailability('home-page'),
  ])

  const { settings } = await getSiteChrome(ctx.locale, draft)

  const clients = selectedClients.length > 0 ? selectedClients : fallbackClients
  const projects = selectedProjects.length > 0 ? selectedProjects : fallbackProjects
  const testimonials = selectedTestimonials.length > 0 ? selectedTestimonials : fallbackTestimonials
  const featuredProjects = projects.slice(0, 4)

  const clientLogos = clients
    .map((client) => ({ client, logo: mediaURL(client.logo, 'logo') }))
    .filter((entry): entry is { client: Client; logo: string } => Boolean(entry.logo))

  const heroImage = mediaURL(page.heroMedia, 'hero')
  const heroAlt = isMedia(page.heroMedia) && page.heroMedia.alt ? page.heroMedia.alt : ''
  const overlayItems = values(page.hero?.overlayItems)
  const serviceItems = page.expertise?.items ?? []
  const approachSteps = page.approach?.steps ?? []
  const faqItems = page.faq?.items ?? []
  const positioningPillars = page.positioning?.pillars ?? []

  const serviceHref = (service: Service | number | null | undefined): string | null => {
    if (!service || typeof service !== 'object') return null
    return service.slug ? buildPath(ctx.locale, { type: 'service', slug: service.slug }) : null
  }

  return (
    <>
      <SiteHeader locale={ctx.locale} route={route} availability={availability} draft={draft} />
      <JsonLd data={organizationSchema(settings, ctx.locale)} />

      <main id="main" className="gc-tw bg-background">
        {/* 01 — HERO: corporate mastery first, branded composition second. */}
        <section className="mx-auto w-full max-w-[80rem] px-5 pb-24 pt-16 sm:px-6 md:px-8 md:pb-32 md:pt-24 lg:px-12 lg:pt-28">
          <div className="grid items-end gap-14 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              {page.heroEyebrow && <Kicker>{page.heroEyebrow}</Kicker>}
              {page.heroHeading && (
                <Heading
                  as="h1"
                  className="mt-6 max-w-[15ch] text-[clamp(3.5rem,7vw,6.75rem)] leading-[0.94] tracking-[-0.055em]"
                >
                  {page.heroHeading}
                </Heading>
              )}
              <Prose
                text={page.heroBody}
                className="mt-8 max-w-[54ch] text-lg leading-[1.6] text-muted-foreground md:text-xl"
              />
              <div className="mt-10 flex flex-wrap gap-3">
                <CTA cta={page.primaryCTA} locale={ctx.locale} />
                <CTA cta={page.secondaryCTA} locale={ctx.locale} variant="secondary" />
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="relative min-h-[21rem] overflow-hidden bg-secondary sm:min-h-[25rem] lg:min-h-[30rem]">
                <div aria-hidden className="absolute left-0 top-0 h-2/5 w-2/3 bg-primary" />
                {heroImage ? (
                  <div className="absolute inset-x-5 bottom-5 top-14 overflow-hidden bg-background sm:inset-x-6 sm:bottom-6 sm:top-16">
                    {/* Payload media may include SVG; keep the raw media path here rather than forcing image optimization. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={heroImage} alt={heroAlt} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div aria-hidden className="absolute bottom-8 right-0 h-px w-3/4 bg-foreground" />
                )}

                {(page.hero?.overlayLabel || overlayItems.length > 0) && (
                  <div className="absolute bottom-0 left-0 max-w-[88%] bg-background p-5 sm:p-6">
                    {page.hero?.overlayLabel && <Kicker>{page.hero.overlayLabel}</Kicker>}
                    {overlayItems.length > 0 && (
                      <ul className="mt-3 space-y-1 text-sm leading-relaxed text-foreground">
                        {overlayItems.slice(0, 4).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 02 — BRAND MARKET POSITIONING: quiet, editorial, no card wall. */}
        {page.positioning?.heading && (
          <Band surface labelledBy="positioning-heading">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7">
                {page.positioning.kicker && <Kicker>{page.positioning.kicker}</Kicker>}
                <Heading id="positioning-heading" className="mt-5 max-w-[18ch]">
                  {page.positioning.heading}
                </Heading>
              </div>
              <div className="lg:col-span-5 lg:pt-8">
                <Prose text={page.positioning.body} className="text-muted-foreground" />
              </div>
            </div>

            {positioningPillars.length > 0 && (
              <ul className="mt-20 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                {positioningPillars.map((pillar, index) => (
                  <li key={pillar.id ?? index}>
                    <span className="text-xs font-medium tracking-[0.08em] text-primary">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em] text-foreground">{pillar.title}</h3>
                    {pillar.body && (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Band>
        )}

        {/* 03 — SERVICES: structured editorial rows, not SaaS cards. */}
        {serviceItems.length > 0 && (
          <Band labelledBy="services-heading">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                {page.expertise?.kicker && <Kicker>{page.expertise.kicker}</Kicker>}
                {page.expertise?.heading && (
                  <Heading id="services-heading" className="mt-5">
                    {page.expertise.heading}
                  </Heading>
                )}
              </div>
              <div className="lg:col-span-6 lg:col-start-7 lg:pt-8">
                <Prose text={page.expertise?.intro} className="text-muted-foreground" />
              </div>
            </div>

            <div className="mt-20">
              {serviceItems.map((item, index) => {
                const href = serviceHref(item.service)
                const offerings = values(item.offerings)
                return (
                  <article
                    key={item.id ?? index}
                    className="grid gap-6 border-t border-border py-9 md:grid-cols-12 md:gap-8 md:py-11"
                  >
                    <div className="md:col-span-1">
                      <Ordinal>{item.number ?? String(index + 1).padStart(2, '0')}</Ordinal>
                    </div>
                    <div className="md:col-span-4">
                      {item.title && (
                        <h3 className="text-xl font-semibold tracking-[-0.025em] text-foreground md:text-2xl">
                          {item.title}
                        </h3>
                      )}
                      {item.tagline && <p className="mt-3 text-sm font-medium text-foreground">{item.tagline}</p>}
                    </div>
                    <div className="md:col-span-4">
                      {item.body && <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>}
                      {offerings.length > 0 && (
                        <div className="mt-5">
                          <Bullets items={offerings.slice(0, 4)} />
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-3 md:text-right">
                      {href && item.ctaLabel && (
                        <Link
                          href={href}
                          className="text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors duration-150 hover:text-primary hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                        >
                          {item.ctaLabel}
                        </Link>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>

            <div className="mt-10">
              <CTA cta={page.expertise?.sectionCTA} locale={ctx.locale} variant="secondary" />
            </div>
          </Band>
        )}

        {/* 04 — SELECTED WORK: strongest visual moment on the homepage. */}
        {featuredProjects.length > 0 && (
          <Band surface labelledBy="work-heading">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7">
                {page.workSection?.kicker && <Kicker>{page.workSection.kicker}</Kicker>}
                {page.workSection?.heading && (
                  <Heading id="work-heading" className="mt-5 max-w-[16ch]">
                    {page.workSection.heading}
                  </Heading>
                )}
              </div>
              <div className="lg:col-span-5 lg:pt-8">
                <Prose text={page.workSection?.body} className="text-muted-foreground" />
              </div>
            </div>

            <ul className="mt-20 grid gap-x-8 gap-y-16 md:grid-cols-2">
              {featuredProjects.map((project, index) => {
                const href = project.slug
                  ? buildPath(ctx.locale, { type: 'project', slug: project.slug })
                  : null
                const client = typeof project.client === 'object' ? project.client?.name : undefined
                const meta = [client, project.year ? String(project.year) : undefined].filter(Boolean).join(' · ')
                const media = projectMedia(project)
                const featured = index === 0

                return (
                  <li key={project.id} className={featured ? 'md:col-span-2' : undefined}>
                    {media.url && (
                      <div className={featured ? 'aspect-[16/9] overflow-hidden bg-background' : 'aspect-[4/3] overflow-hidden bg-background'}>
                        {href ? (
                          <Link href={href} className="block h-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={media.url}
                              alt={media.alt}
                              loading={featured ? 'eager' : 'lazy'}
                              className="h-full w-full object-cover transition-transform duration-300 motion-safe:hover:scale-[1.01]"
                            />
                          </Link>
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={media.url} alt={media.alt} loading="lazy" className="h-full w-full object-cover" />
                        )}
                      </div>
                    )}

                    <div className="mt-5 flex items-start justify-between gap-6">
                      <div>
                        {meta && <p className="text-xs font-medium tracking-[0.06em] text-muted-foreground">{meta}</p>}
                        <h3 className={featured ? 'mt-2 text-2xl font-semibold tracking-[-0.03em] text-foreground md:text-3xl' : 'mt-2 text-xl font-semibold tracking-[-0.025em] text-foreground'}>
                          {href ? (
                            <Link href={href} className="transition-colors duration-150 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
                              {project.title}
                            </Link>
                          ) : (
                            project.title
                          )}
                        </h3>
                        {project.excerpt && (
                          <p className="mt-3 max-w-[56ch] text-sm leading-relaxed text-muted-foreground">{project.excerpt}</p>
                        )}
                      </div>
                      <span aria-hidden className="mt-1 h-2 w-2 shrink-0 bg-primary" />
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="mt-14">
              <CTA cta={page.workSection?.sectionCTA} locale={ctx.locale} variant="secondary" />
            </div>
          </Band>
        )}

        {/* 05 — METHOD: numbered sequence, calm after the expressive work section. */}
        {approachSteps.length > 0 && (
          <Band labelledBy="approach-heading">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                {page.approach?.kicker && <Kicker>{page.approach.kicker}</Kicker>}
                {page.approach?.heading && (
                  <Heading id="approach-heading" className="mt-5">
                    {page.approach.heading}
                  </Heading>
                )}
              </div>
              <div className="lg:col-span-6 lg:col-start-7 lg:pt-8">
                <Prose text={page.approach?.body} className="text-muted-foreground" />
              </div>
            </div>

            <ol className="mt-20 grid gap-10 md:grid-cols-3 md:gap-8">
              {approachSteps.slice(0, 3).map((step, index) => (
                <li key={step.id ?? index} className="border-t border-border pt-6">
                  <Ordinal>{step.number ?? String(index + 1).padStart(2, '0')}</Ordinal>
                  {step.title && (
                    <h3 className="mt-5 text-xl font-semibold tracking-[-0.025em] text-foreground">{step.title}</h3>
                  )}
                  {step.tagline && <p className="mt-3 text-sm font-medium text-foreground">{step.tagline}</p>}
                  <Prose text={step.body} className="mt-5 text-sm text-muted-foreground" />
                  <div className="mt-6">
                    <Bullets items={values(step.bullets).slice(0, 4)} />
                  </div>
                  {step.result && (
                    <div className="mt-7 bg-secondary p-5">
                      {step.resultLabel && <Kicker>{step.resultLabel}</Kicker>}
                      <p className="mt-3 text-sm font-medium leading-relaxed text-foreground">{step.result}</p>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </Band>
        )}

        {/* 06 — PROOF: contextualized evidence, logos are no longer above the fold. */}
        {(testimonials.length > 0 || clientLogos.length > 0) && page.proof?.heading && (
          <Band surface labelledBy="proof-heading">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-6">
                {page.proof.kicker && <Kicker>{page.proof.kicker}</Kicker>}
                <Heading id="proof-heading" className="mt-5">
                  {page.proof.heading}
                </Heading>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:pt-8">
                <Prose text={page.proof.body} className="text-muted-foreground" />
              </div>
            </div>

            {clientLogos.length > 0 && (
              <ul className="mt-16 flex flex-wrap items-center gap-x-12 gap-y-8" aria-label="Selected clients">
                {clientLogos.slice(0, 8).map(({ client, logo }) => (
                  <li key={client.id}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo} alt={client.name} loading="lazy" className="max-h-7 w-auto opacity-70 grayscale" />
                  </li>
                ))}
              </ul>
            )}

            {testimonials.length > 0 && (
              <div className="mt-20 grid gap-12 md:grid-cols-2">
                {testimonials.slice(0, 2).map((testimonial) => (
                  <TestimonialBlock key={testimonial.id} testimonial={testimonial} locale={ctx.locale} />
                ))}
              </div>
            )}
          </Band>
        )}

        {/* Optional supporting FAQ: stays quiet and disappears when CMS has no items. */}
        {faqItems.length > 0 && (
          <Band labelledBy="faq-heading">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                {page.faq?.kicker && <Kicker>{page.faq.kicker}</Kicker>}
                {page.faq?.heading && (
                  <Heading id="faq-heading" className="mt-5 text-3xl md:text-4xl">
                    {page.faq.heading}
                  </Heading>
                )}
              </div>
              <dl className="lg:col-span-7 lg:col-start-6">
                {faqItems.map((item, index) => (
                  <div key={item.id ?? index} className="border-t border-border py-7">
                    <dt className="text-base font-semibold tracking-[-0.015em] text-foreground">{item.question}</dt>
                    <dd className="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted-foreground">{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Band>
        )}

        {/* 07 — FINAL CTA: one deliberate brand interruption. */}
        {page.closing?.heading && (
          <section className="bg-primary text-primary-foreground" aria-labelledby="closing-heading">
            <div className="mx-auto w-full max-w-[80rem] px-5 py-24 sm:px-6 md:px-8 md:py-32 lg:px-12">
              {page.closing.kicker && (
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-primary-foreground/70">
                  {page.closing.kicker}
                </p>
              )}
              <Heading
                id="closing-heading"
                className="mt-5 max-w-[17ch] text-primary-foreground md:text-6xl"
              >
                {page.closing.heading}
              </Heading>
              <Prose text={page.closing.body} className="mt-8 max-w-[54ch] text-primary-foreground/80" />
              <div className="mt-10">
                <CTA cta={page.closingCTA} locale={ctx.locale} variant="secondary" />
                {page.closing.reassurance && (
                  <p className="mt-4 text-sm text-primary-foreground/70">{page.closing.reassurance}</p>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  )
}
