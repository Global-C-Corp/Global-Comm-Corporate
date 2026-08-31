import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { TestimonialBlock } from '@/components/testimonial/TestimonialBlock'
import { RichText } from '@/components/ui/RichText'
import { CTALinks, Section, SectionHeader } from '@/components/ui/Sections'
import { getDictionary } from '@/i18n/dictionaries'
import { mediaURL } from '@/lib/media'
import { populated } from '@/lib/relations'
import type { Client, Industry, Testimonial } from '@/payload-types'
import { getGlobalAvailability } from '@/services/cms/availability'
import { getCompanyPage } from '@/services/cms/globals'
import { getPageContext } from '@/services/cms/pageContext'
import { resolvePageSEO } from '@/services/seo/resolvePageSEO'
import type { Route } from '@/services/seo/urls'

const route: Route = { type: 'company' }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const { ctx, site, draft } = await getPageContext(locale)
  const page = await getCompanyPage(ctx)
  if (!page) return {}

  return resolvePageSEO({
    entity: { heading: page.heading, excerpt: page.intro, meta: page.meta },
    locale: ctx.locale,
    route,
    site,
    availability: await getGlobalAvailability('company-page'),
    isPreview: draft,
  })
}

export default async function CompanyPageRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const { ctx, draft } = await getPageContext(locale)

  const page = await getCompanyPage(ctx)
  if (!page) notFound()

  const t = getDictionary(ctx.locale)
  const availability = await getGlobalAvailability('company-page')

  const clients = populated<Client>(page.selectedClients)
  const industries = populated<Industry>(page.selectedIndustries)
  const testimonials = populated<Testimonial>(page.selectedTestimonials)

  return (
    <>
      <SiteHeader locale={ctx.locale} route={route} availability={availability} draft={draft} />

      <main id="main">
        <div className="gc-container gc-page-header">
          {page.eyebrow && <p className="gc-eyebrow">{page.eyebrow}</p>}
          {page.heading && <h1>{page.heading}</h1>}
          {page.intro && <p className="gc-lead" style={{ marginTop: '1.5rem' }}>{page.intro}</p>}
        </div>

        {page.whoWeAre && (
          <Section labelledBy="who-we-are">
            <SectionHeader id="who-we-are" heading={t.sections.whatWeDo} />
            <RichText data={page.whoWeAre} />
          </Section>
        )}

        {page.whatWeBelieve && (
          <Section labelledBy="what-we-believe">
            <SectionHeader id="what-we-believe" heading={t.sections.method} />
            <RichText data={page.whatWeBelieve} />
          </Section>
        )}

        {page.howWeWork && (
          <Section surface labelledBy="how-we-work">
            <SectionHeader id="how-we-work" heading={t.sections.approach} />
            <RichText data={page.howWeWork} />
          </Section>
        )}

        {clients.length > 0 && (
          <Section labelledBy="company-clients">
            <SectionHeader id="company-clients" heading={t.sections.selectedClients} />
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

        {industries.length > 0 && (
          <Section labelledBy="company-industries">
            <SectionHeader id="company-industries" heading={t.sections.industries} />
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

        {testimonials.length > 0 && (
          <Section surface labelledBy="company-testimonials">
            <SectionHeader id="company-testimonials" heading={t.sections.testimonials} />
            <div className="gc-grid gc-grid--2">
              {testimonials.map((testimonial) => (
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
