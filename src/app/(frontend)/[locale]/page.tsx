import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { JsonLd, organizationSchema } from '@/components/seo/JsonLd'
import { TestimonialBlock } from '@/components/testimonial/TestimonialBlock'
import {
  Band,
  Bullets,
  CTA,
  Heading,
  Kicker,
  Ordinal,
  ProjectTile,
  Prose,
  TileGrid,
} from '@/components/ui/Primitives'
import { getDictionary } from '@/i18n/dictionaries'
import { mediaURL } from '@/lib/media'
import { populated } from '@/lib/relations'
import type { Client, Project, Service, Testimonial } from '@/payload-types'
import { getGlobalAvailability } from '@/services/cms/availability'
import { getHomePage, getSiteChrome } from '@/services/cms/globals'
import { getPageContext } from '@/services/cms/pageContext'
import { getFeaturedProjects } from '@/services/cms/projects'
import { isMediaLed, projectTiles } from '@/services/cms/projectTiles'
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

export default async function HomePageRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const { ctx, draft } = await getPageContext(locale)

  const page = await getHomePage(ctx)
  // No approved translation means no page — never fabricate a fallback (CLAUDE.md §14, §139).
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

  // Only clients with an approved logo can appear in the wall. With none, the
  // strip hides rather than rendering a row of bare names (§105, §139).
  const clientLogos = clients
    .map((client) => ({ client, logo: mediaURL(client.logo, 'logo') }))
    .filter((entry): entry is { client: Client; logo: string } => Boolean(entry.logo))

  const t = getDictionary(ctx.locale)

  // Every labelled Band needs its aria-labelledby target to exist. The CMS
  // heading is optional, so a section label from the UI dictionary (§62) backs
  // it up rather than leaving the reference dangling.
  const expertiseHeading = page.expertise?.heading || t.sections.whatWeDo
  const workHeading = page.workSection?.heading || t.sections.selectedWork
  const approachHeading = page.approach?.heading || t.sections.method
  const faqHeading = page.faq?.heading || t.sections.faq
  const proofHeading = page.proof?.heading || t.sections.testimonials
  const positioningHeading = page.positioning?.heading || t.sections.positioning

  const workTiles = projectTiles(projects, ctx.locale)
  const workIsMediaLed = isMediaLed(workTiles)

  const heroImage = mediaURL(page.heroMedia, 'hero')
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

      {/* Everything below is inside the Preflight boundary (CLAUDE.md §83). */}
      <main id="main" className="gc-tw bg-background">
        {/* ---- 1. Hero ------------------------------------------------- */}
        <section className="mx-auto w-full max-w-[76rem] px-6 pt-16 pb-20 md:px-10 md:pt-24 md:pb-28">
          {clientLogos.length > 0 && page.heroEyebrow && (
            <div className="mb-12 border-b border-border pb-8">
              <Kicker>{page.heroEyebrow}</Kicker>
              <ul className="mt-5 flex flex-wrap items-center gap-x-10 gap-y-6">
                {clientLogos.map(({ client, logo }) => (
                  <li key={client.id}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo} alt={client.name} loading="lazy" className="max-h-8 w-auto" />
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              {page.heroHeading && <Heading as="h1">{page.heroHeading}</Heading>}
              <Prose text={page.heroBody} className="mt-8 text-lg" />
              <div className="mt-10 flex flex-wrap gap-4">
                <CTA cta={page.primaryCTA} locale={ctx.locale} />
                <CTA cta={page.secondaryCTA} locale={ctx.locale} variant="secondary" />
              </div>
            </div>

            {(heroImage || overlayItems.length > 0) && (
              <div className="lg:col-span-5">
                {/* Without a hero image the panel sizes to its content rather
                    than stretching to a tall empty box. */}
                <div className={heroImage ? 'relative h-full border border-border' : 'border border-border'}>
                  {heroImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={heroImage} alt="" className="h-full w-full object-cover" />
                  ) : null}
                  {overlayItems.length > 0 && (
                    <div className={heroImage ? 'absolute inset-x-0 bottom-0 bg-background/95 p-6' : 'p-6'}>
                      {page.hero?.overlayLabel && <Kicker>{page.hero.overlayLabel}</Kicker>}
                      <ul className="mt-4 space-y-1 text-sm text-foreground">
                        {overlayItems.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ---- 2. Positionnement --------------------------------------- */}
        {(page.positioning?.heading || page.positioning?.body || positioningPillars.length > 0) && (
          <Band surface labelledBy="positioning">
            {page.positioning?.kicker && <Kicker>{page.positioning.kicker}</Kicker>}
            <Heading id="positioning" className={page.positioning?.kicker ? 'mt-5' : undefined}>
              {positioningHeading}
            </Heading>
            <Prose text={page.positioning?.body} className="mt-8" />

            {positioningPillars.length > 0 && (
              <ul className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                {positioningPillars.map((pillar, index) => (
                  <li key={pillar.id ?? index} className="border-t border-foreground pt-5">
                    <h3 className="text-base font-semibold text-foreground">{pillar.title}</h3>
                    {pillar.body && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>}
                  </li>
                ))}
              </ul>
            )}
          </Band>
        )}

        {/* ---- 3. Services --------------------------------------------- */}
        {serviceItems.length > 0 && (
          <Band labelledBy="services">
            {page.expertise?.kicker && <Kicker>{page.expertise.kicker}</Kicker>}
            <Heading id="services" className={page.expertise?.kicker ? 'mt-5' : undefined}>
              {expertiseHeading}
            </Heading>
            <Prose text={page.expertise?.intro} className="mt-8" />

            <div className="mt-16 grid gap-px border border-border bg-border md:grid-cols-2">
              {serviceItems.map((item, index) => {
                const href = serviceHref(item.service)
                const offerings = values(item.offerings)
                return (
                  <article key={item.id ?? index} className="flex flex-col bg-background p-8 md:p-10">
                    <div className="flex items-baseline gap-4">
                      {item.number && <Ordinal>{item.number}</Ordinal>}
                      {item.title && <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>}
                    </div>
                    {item.tagline && <p className="mt-4 text-base font-medium text-foreground">{item.tagline}</p>}
                    {item.body && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>}

                    {offerings.length > 0 && (
                      <ul className="mt-6 space-y-2 text-sm text-foreground">
                        {offerings.map((offering) => (
                          <li key={offering} className="border-t border-border pt-2">
                            {offering}
                          </li>
                        ))}
                      </ul>
                    )}

                    {href && item.ctaLabel && (
                      <p className="mt-8">
                        <Link
                          href={href}
                          className="text-sm font-medium text-primary underline underline-offset-4 hover:text-foreground"
                        >
                          {item.ctaLabel}
                        </Link>
                      </p>
                    )}
                  </article>
                )
              })}
            </div>

            <div className="mt-12">
              <CTA cta={page.expertise?.sectionCTA} locale={ctx.locale} variant="secondary" />
            </div>
          </Band>
        )}

        {/* ---- 4. Réalisations ----------------------------------------- */}
        {projects.length > 0 && (
          <Band surface labelledBy="work">
            {page.workSection?.kicker && <Kicker>{page.workSection.kicker}</Kicker>}
            <Heading id="work" className={page.workSection?.kicker ? 'mt-5' : undefined}>
              {workHeading}
            </Heading>
            <Prose text={page.workSection?.body} className="mt-8" />

            <div className="mt-16">
              <TileGrid>
                {workTiles.map(({ project, href, meta, image }, index) => (
                  <ProjectTile
                    key={project.id}
                    href={href}
                    title={project.title}
                    meta={meta}
                    excerpt={project.excerpt}
                    ctaLabel={page.workSection?.itemCTALabel}
                    image={image}
                    mediaLed={workIsMediaLed}
                    priority={index === 0}
                  />
                ))}
              </TileGrid>
            </div>

            <div className="mt-12">
              <CTA cta={page.workSection?.sectionCTA} locale={ctx.locale} variant="secondary" />
            </div>
          </Band>
        )}

        {/* ---- 5. Notre approche --------------------------------------- */}
        {approachSteps.length > 0 && (
          <Band labelledBy="approach">
            {page.approach?.kicker && <Kicker>{page.approach.kicker}</Kicker>}
            <Heading id="approach" className={page.approach?.kicker ? 'mt-5' : undefined}>
              {approachHeading}
            </Heading>
            <Prose text={page.approach?.body} className="mt-8" />

            <ol className="mt-16 space-y-px border border-border bg-border">
              {approachSteps.map((step, index) => (
                <li key={step.id ?? index} className="bg-background p-8 md:p-10">
                  <div className="grid gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                      <div className="flex items-baseline gap-4">
                        {step.number && <Ordinal>{step.number}</Ordinal>}
                        {step.title && <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>}
                      </div>
                      {step.tagline && <p className="mt-4 text-base text-foreground">{step.tagline}</p>}
                    </div>

                    <div className="lg:col-span-5">
                      <Prose text={step.body} className="text-sm" />
                      <div className="mt-6">
                        <Bullets items={values(step.bullets)} />
                      </div>
                    </div>

                    {step.result && (
                      <div className="lg:col-span-3">
                        {step.resultLabel && <Kicker>{step.resultLabel}</Kicker>}
                        <p className="mt-3 text-sm font-medium text-foreground">{step.result}</p>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </Band>
        )}

        {/* ---- 6. Preuves ----------------------------------------------
            Copy renders only when there is real evidence to introduce.
            Zero approved testimonials and zero client logos means the whole
            band is hidden rather than shown empty (CLAUDE.md §105, §139). */}
        {(testimonials.length > 0 || clientLogos.length > 0) && (
          <Band surface labelledBy="proof">
            {page.proof?.kicker && <Kicker>{page.proof.kicker}</Kicker>}
            <Heading id="proof" className={page.proof?.kicker ? 'mt-5' : undefined}>
              {proofHeading}
            </Heading>
            <Prose text={page.proof?.body} className="mt-8" />

            {testimonials.length > 0 && (
              <div className="mt-14 grid gap-px border border-border bg-border md:grid-cols-2">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-background p-8">
                    <TestimonialBlock testimonial={testimonial} locale={ctx.locale} />
                  </div>
                ))}
              </div>
            )}
          </Band>
        )}

        {/* ---- 7. Questions fréquentes --------------------------------- */}
        {faqItems.length > 0 && (
          <Band labelledBy="faq">
            {page.faq?.kicker && <Kicker>{page.faq.kicker}</Kicker>}
            <Heading id="faq" className={page.faq?.kicker ? 'mt-5' : undefined}>
              {faqHeading}
            </Heading>

            <dl className="mt-14 border-t border-border">
              {faqItems.map((item, index) => (
                <div key={item.id ?? index} className="grid gap-4 border-b border-border py-8 lg:grid-cols-12 lg:gap-10">
                  <dt className="text-base font-semibold text-foreground lg:col-span-5">{item.question}</dt>
                  <dd className="text-sm leading-relaxed text-muted-foreground lg:col-span-7">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </Band>
        )}

        {/* ---- 8. Appel à l'action final -------------------------------- */}
        {page.closing?.heading && (
          <Band surface labelledBy="closing">
            {page.closing.kicker && <Kicker>{page.closing.kicker}</Kicker>}
            <Heading id="closing" className={page.closing.kicker ? 'mt-5' : undefined}>
              {page.closing.heading}
            </Heading>
            <Prose text={page.closing.body} className="mt-8" />
            <div className="mt-10">
              <CTA cta={page.closingCTA} locale={ctx.locale} />
              {page.closing.reassurance && (
                <p className="mt-4 text-sm text-muted-foreground">{page.closing.reassurance}</p>
              )}
            </div>
          </Band>
        )}
      </main>
    </>
  )
}
