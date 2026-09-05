import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { TestimonialBlock } from '@/components/testimonial/TestimonialBlock'
import { RichText } from '@/components/ui/RichText'
import { Band, CTA, Heading, PageHeader, RichProse } from '@/components/ui/Primitives'
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

  const clientLogos = clients
    .map((client) => ({ client, logo: mediaURL(client.logo, 'logo') }))
    .filter((entry): entry is { client: Client; logo: string } => Boolean(entry.logo))

  return (
    <>
      <SiteHeader locale={ctx.locale} route={route} availability={availability} draft={draft} />

      <main id="main" className="gc-tw bg-background">
        <PageHeader eyebrow={page.eyebrow} heading={page.heading} intro={page.intro} />

        {page.whoWeAre && (
          <Band labelledBy="who-we-are">
            <Heading id="who-we-are">{t.sections.whatWeDo}</Heading>
            <RichProse className="mt-8">
              <RichText data={page.whoWeAre} />
            </RichProse>
          </Band>
        )}

        {page.whatWeBelieve && (
          <Band surface labelledBy="what-we-believe">
            <Heading id="what-we-believe">{t.sections.method}</Heading>
            <RichProse className="mt-8">
              <RichText data={page.whatWeBelieve} />
            </RichProse>
          </Band>
        )}

        {page.howWeWork && (
          <Band labelledBy="how-we-work">
            <Heading id="how-we-work">{t.sections.approach}</Heading>
            <RichProse className="mt-8">
              <RichText data={page.howWeWork} />
            </RichProse>
          </Band>
        )}

        {/* Only clients with an approved logo appear; a bare name row is not
            evidence (§105, §139). */}
        {clientLogos.length > 0 && (
          <Band surface labelledBy="company-clients">
            <Heading id="company-clients">{t.sections.selectedClients}</Heading>
            <ul className="mt-10 flex flex-wrap items-center gap-x-12 gap-y-8">
              {clientLogos.map(({ client, logo }) => (
                <li key={client.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logo} alt={client.name} loading="lazy" className="max-h-10 w-auto" />
                </li>
              ))}
            </ul>
          </Band>
        )}

        {industries.length > 0 && (
          <Band labelledBy="company-industries">
            <Heading id="company-industries">{t.sections.industries}</Heading>
            <ul className="mt-10 grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
              {industries.map((industry) => (
                <li key={industry.id} className="bg-background p-8">
                  <p className="text-base font-semibold text-foreground">{industry.name}</p>
                  {industry.shortDescription && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {industry.shortDescription}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </Band>
        )}

        {testimonials.length > 0 && (
          <Band surface labelledBy="company-testimonials">
            <Heading id="company-testimonials">{t.sections.testimonials}</Heading>
            <div className="mt-10 grid gap-px border border-border bg-border md:grid-cols-2">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-background p-8">
                  <TestimonialBlock testimonial={testimonial} locale={ctx.locale} />
                </div>
              ))}
            </div>
          </Band>
        )}

        {page.closingCTA?.label && (
          <Band>
            <CTA cta={page.closingCTA} locale={ctx.locale} />
          </Band>
        )}
      </main>
    </>
  )
}
