import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { TestimonialBlock } from '@/components/testimonial/TestimonialBlock'
import { Band, CTA, Heading, PageHeader } from '@/components/ui/Primitives'
import { ProseBlocks } from '@/components/ui/ProseBlocks'
import { companyContent } from '@/content/company'
import { ui } from '@/content/ui'
import { mediaURL } from '@/lib/media'
import type { Client } from '@/payload-types'
import { getIndustries } from '@/services/cms/industries'
import { getPageContext } from '@/services/cms/pageContext'
import { getFeaturedTestimonials, getPublishedClients } from '@/services/cms/proof'
import { resolvePageSEO } from '@/services/seo/resolvePageSEO'
import type { Route } from '@/services/seo/urls'

/**
 * ISR backstop: the page copy is source-owned, but the industries, clients and
 * testimonials it shows come from Payload — see src/hooks/revalidate.ts.
 */
export const revalidate = 60

const route: Route = { type: 'company' }

export async function generateMetadata(): Promise<Metadata> {
  const { draft } = await getPageContext()
  return resolvePageSEO({
    entity: { heading: companyContent.heading, excerpt: companyContent.intro[0], meta: companyContent.meta },
    route,
    isPreview: draft,
  })
}

/**
 * Corporate copy is source-owned. The proof sections below it — client marks,
 * sectors and testimonials — stay Payload-backed, because those are facts
 * about real work rather than page copy.
 */
export default async function CompanyPageRoute() {
  const { ctx } = await getPageContext()

  const [clients, industries, testimonials] = await Promise.all([
    getPublishedClients(ctx, 12),
    getIndustries(ctx),
    getFeaturedTestimonials(ctx),
  ])

  const clientLogos = clients
    .map((client) => ({ client, logo: mediaURL(client.logo, 'logo') }))
    .filter((entry): entry is { client: Client; logo: string } => Boolean(entry.logo))

  return (
    <>
      <SiteHeader route={route} />

      <main id="main" className="gc-tw bg-background">
        <PageHeader
          eyebrow={companyContent.eyebrow}
          heading={companyContent.heading}
          intro={companyContent.intro.join('\n\n')}
        />

        <Band labelledBy="who-we-are">
          <Heading id="who-we-are">{ui.sections.whatWeDo}</Heading>
          <ProseBlocks blocks={companyContent.whoWeAre} className="mt-8" />
        </Band>

        <Band surface labelledBy="what-we-believe">
          <Heading id="what-we-believe">{ui.sections.method}</Heading>
          <ProseBlocks blocks={companyContent.whatWeBelieve} className="mt-8" />
        </Band>

        <Band labelledBy="how-we-work">
          <Heading id="how-we-work">{ui.sections.approach}</Heading>
          <ProseBlocks blocks={companyContent.howWeWork} className="mt-8" />
        </Band>

        {/* Only clients with an approved logo appear; a bare name row is not evidence. */}
        {clientLogos.length > 0 && (
          <Band surface labelledBy="company-clients">
            <Heading id="company-clients">{ui.sections.selectedClients}</Heading>
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
            <Heading id="company-industries">{ui.sections.industries}</Heading>
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
            <Heading id="company-testimonials">{ui.sections.testimonials}</Heading>
            <div className="mt-10 grid gap-px border border-border bg-border md:grid-cols-2">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-background p-8">
                  <TestimonialBlock testimonial={testimonial} />
                </div>
              ))}
            </div>
          </Band>
        )}

        <Band>
          <CTA cta={companyContent.closingCTA} />
        </Band>
      </main>
    </>
  )
}
