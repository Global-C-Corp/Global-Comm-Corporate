import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { JsonLd, organizationSchema } from '@/components/seo/JsonLd'
import { ProjectCard } from '@/components/project/ProjectCard'
import { ServiceCard } from '@/components/service/ServiceCard'
import { TestimonialBlock } from '@/components/testimonial/TestimonialBlock'
import { CTALinks, Section, SectionHeader } from '@/components/ui/Sections'
import { getDictionary } from '@/i18n/dictionaries'
import { mediaURL } from '@/lib/media'
import { populated } from '@/lib/relations'
import type { Client, Industry, Project, Testimonial } from '@/payload-types'
import { getGlobalAvailability } from '@/services/cms/availability'
import { getHomePage, getSiteChrome } from '@/services/cms/globals'
import { getPageContext } from '@/services/cms/pageContext'
import { getFeaturedProjects } from '@/services/cms/projects'
import { getFeaturedClients, getFeaturedTestimonials } from '@/services/cms/proof'
import { getServicePillars } from '@/services/cms/services'
import { resolvePageSEO } from '@/services/seo/resolvePageSEO'
import type { Route } from '@/services/seo/urls'

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

export default async function HomePageRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const { ctx, draft } = await getPageContext(locale)

  const page = await getHomePage(ctx)
  // No approved translation means no page — never fabricate a fallback (CLAUDE.md §14, §139).
  if (!page) notFound()

  const t = getDictionary(ctx.locale)

  const selectedClients = populated<Client>(page.featuredClients)
  const selectedProjects = populated<Project>(page.featuredProjects)
  const industries = populated<Industry>(page.featuredIndustries)
  const testimonials = populated<Testimonial>(page.featuredTestimonials)

  const [pillars, fallbackProjects, fallbackClients, fallbackTestimonials, availability] = await Promise.all([
    getServicePillars(ctx),
    selectedProjects.length === 0 ? getFeaturedProjects(ctx) : Promise.resolve([]),
    selectedClients.length === 0 ? getFeaturedClients(ctx) : Promise.resolve([]),
    testimonials.length === 0 ? getFeaturedTestimonials(ctx) : Promise.resolve([]),
    getGlobalAvailability('home-page'),
  ])

  const { settings } = await getSiteChrome(ctx.locale, draft)

  const clients = selectedClients.length > 0 ? selectedClients : fallbackClients
  const projects = selectedProjects.length > 0 ? selectedProjects : fallbackProjects
  const quotes = testimonials.length > 0 ? testimonials : fallbackTestimonials

  return (
    <>
      <SiteHeader locale={ctx.locale} route={route} availability={availability} draft={draft} />
      <JsonLd data={organizationSchema(settings, ctx.locale)} />

      <main id="main">
        <div className="gc-container gc-hero">
          {page.heroEyebrow && <p className="gc-eyebrow">{page.heroEyebrow}</p>}
          {page.heroHeading && <h1 className="gc-hero__heading">{page.heroHeading}</h1>}
          {page.heroBody && <p className="gc-lead gc-hero__body">{page.heroBody}</p>}
          <CTALinks ctas={[page.primaryCTA, page.secondaryCTA]} locale={ctx.locale} />
        </div>

        {clients.length > 0 && (
          <Section surface labelledBy="selected-clients">
            <h2 id="selected-clients" className="gc-eyebrow">
              {t.sections.selectedClients}
            </h2>
            <div className="gc-logo-wall">
              {clients.map((client) => {
                const logo = mediaURL(client.logo, 'logo')
                return (
                  <div key={client.id} className="gc-logo-wall__item">
                    {logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logo} alt={client.name} loading="lazy" style={{ maxHeight: '2.5rem' }} />
                    ) : (
                      client.name
                    )}
                  </div>
                )
              })}
            </div>
          </Section>
        )}

        {pillars.length > 0 && (
          <Section labelledBy="what-we-do">
            <SectionHeader id="what-we-do" heading={t.sections.whatWeDo} />
            <div className="gc-grid gc-grid--3">
              {pillars.map((service) => (
                <ServiceCard key={service.id} service={service} locale={ctx.locale} />
              ))}
            </div>
          </Section>
        )}

        {projects.length > 0 && (
          <Section labelledBy="selected-work">
            <SectionHeader id="selected-work" heading={t.sections.selectedWork} />
            <div className="gc-grid gc-grid--3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} locale={ctx.locale} />
              ))}
            </div>
          </Section>
        )}

        {(page.methodHeading || page.methodIntro) && (
          <Section surface labelledBy="method">
            <SectionHeader
              id="method"
              eyebrow={t.sections.method}
              heading={page.methodHeading}
              intro={page.methodIntro}
            />
          </Section>
        )}

        {industries.length > 0 && (
          <Section labelledBy="industries">
            <SectionHeader id="industries" heading={t.sections.industries} />
            <div className="gc-grid gc-grid--3">
              {industries.map((industry) => (
                <article key={industry.id} className="gc-card">
                  <p className="gc-card__title">{industry.name}</p>
                  {industry.shortDescription && <p className="gc-card__body">{industry.shortDescription}</p>}
                </article>
              ))}
            </div>
          </Section>
        )}

        {quotes.length > 0 && (
          <Section surface labelledBy="testimonials">
            <SectionHeader id="testimonials" heading={t.sections.testimonials} />
            <div className="gc-grid gc-grid--2">
              {quotes.map((testimonial) => (
                <TestimonialBlock key={testimonial.id} testimonial={testimonial} locale={ctx.locale} />
              ))}
            </div>
          </Section>
        )}

        {page.closingCTA?.label && (
          <Section>
            <CTALinks ctas={[page.closingCTA]} locale={ctx.locale} />
          </Section>
        )}
      </main>
    </>
  )
}
