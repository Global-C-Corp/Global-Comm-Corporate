import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ContactForm } from '@/components/contact/ContactForm'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { Section } from '@/components/ui/Sections'
import { getDictionary } from '@/i18n/dictionaries'
import { getGlobalAvailability } from '@/services/cms/availability'
import { baseQueryOptions, getPayloadClient } from '@/services/cms/context'
import { getContactPage } from '@/services/cms/globals'
import { getPageContext } from '@/services/cms/pageContext'
import { resolvePageSEO } from '@/services/seo/resolvePageSEO'
import type { Route } from '@/services/seo/urls'
import { submitInquiry } from './actions'

const route: Route = { type: 'contact' }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const { ctx, site, draft } = await getPageContext(locale)
  const page = await getContactPage(ctx)
  if (!page) return {}

  return resolvePageSEO({
    entity: { heading: page.heading, excerpt: page.intro, meta: page.meta },
    locale: ctx.locale,
    route,
    site,
    availability: await getGlobalAvailability('contact-page'),
    isPreview: draft,
  })
}

export default async function ContactPageRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const { ctx, draft } = await getPageContext(locale)

  const page = await getContactPage(ctx)
  if (!page) notFound()

  const t = getDictionary(ctx.locale)
  const payload = await getPayloadClient()

  const [projectTypes, availability] = await Promise.all([
    payload
      .find({ collection: 'project-types', ...baseQueryOptions(ctx), limit: 50, depth: 0, sort: ['displayOrder'] })
      .then((result) => result.docs.map((doc) => ({ id: doc.id, name: doc.name }))),
    getGlobalAvailability('contact-page'),
  ])

  return (
    <>
      <SiteHeader locale={ctx.locale} route={route} availability={availability} draft={draft} />

      <main id="main">
        <div className="gc-container gc-page-header">
          {page.eyebrow && <p className="gc-eyebrow">{page.eyebrow}</p>}
          {page.heading && <h1>{page.heading}</h1>}
          {page.intro && <p className="gc-lead" style={{ marginTop: '1.5rem' }}>{page.intro}</p>}
        </div>

        <Section flush>
          <div className="gc-grid gc-grid--2">
            <div>
              {page.formIntro && <p className="gc-lead">{page.formIntro}</p>}
              <ContactForm action={submitInquiry} dictionary={t} projectTypes={projectTypes} />
            </div>
            <aside className="gc-stack">
              {page.directContact && (
                <div>
                  <p className="gc-eyebrow">Direct</p>
                  <p>{page.directContact}</p>
                </div>
              )}
              {page.officeLocation && (
                <div>
                  <p className="gc-eyebrow">Office</p>
                  <p>{page.officeLocation}</p>
                </div>
              )}
              {page.closingText && <p className="gc-card__body">{page.closingText}</p>}
            </aside>
          </div>
        </Section>
      </main>
    </>
  )
}
