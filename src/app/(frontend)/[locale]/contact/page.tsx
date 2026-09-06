import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ContactForm } from '@/components/contact/ContactForm'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { Kicker, PageHeader, Prose } from '@/components/ui/Primitives'
import { getDictionary } from '@/i18n/dictionaries'
import { getGlobalAvailability } from '@/services/cms/availability'
import { baseQueryOptions, getPayloadClient } from '@/services/cms/context'
import { getContactPage, getSiteChrome } from '@/services/cms/globals'
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

  const [{ settings }, projectTypes, availability] = await Promise.all([
    getSiteChrome(ctx.locale, draft),
    payload
      .find({ collection: 'project-types', ...baseQueryOptions(ctx), limit: 50, depth: 0, sort: ['displayOrder'] })
      .then((result) => result.docs.map((doc) => ({ id: doc.id, name: doc.name }))),
    getGlobalAvailability('contact-page'),
  ])

  return (
    <>
      <SiteHeader locale={ctx.locale} route={route} availability={availability} draft={draft} />

      <main id="main" className="gc-tw bg-background">
        <PageHeader eyebrow={page.eyebrow} heading={page.heading} intro={page.intro} />

        <div className="mx-auto w-full max-w-[76rem] px-6 pb-24 md:px-10 md:pb-32">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              {page.formIntro && <Prose text={page.formIntro} className="mb-10" />}
              <ContactForm
                action={submitInquiry}
                dictionary={t}
                projectTypes={projectTypes}
                companyName={settings.companyName}
              />
            </div>

            <aside className="space-y-8 lg:col-span-4 lg:col-start-9">
              {page.directContact && (
                <div className="border-t border-foreground pt-5">
                  <Kicker>{t.meta.direct}</Kicker>
                  <p className="mt-3 text-sm text-foreground">{page.directContact}</p>
                </div>
              )}
              {page.officeLocation && (
                <div className="border-t border-foreground pt-5">
                  <Kicker>{t.meta.office}</Kicker>
                  <p className="mt-3 text-sm text-foreground">{page.officeLocation}</p>
                </div>
              )}
              {page.closingText && (
                <p className="text-sm leading-relaxed text-muted-foreground">{page.closingText}</p>
              )}
            </aside>
          </div>
        </div>
      </main>
    </>
  )
}
