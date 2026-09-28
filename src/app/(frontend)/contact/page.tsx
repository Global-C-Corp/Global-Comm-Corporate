import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/ContactForm'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { PageHeader, Prose } from '@/components/ui/Primitives'
import { contactContent } from '@/content/contact'
import { ui } from '@/content/ui'
import { baseQueryOptions, getPayloadClient } from '@/services/cms/context'
import { getPageContext } from '@/services/cms/pageContext'
import { resolvePageSEO } from '@/services/seo/resolvePageSEO'
import type { Route } from '@/services/seo/urls'
import { submitInquiry } from './actions'

const route: Route = { type: 'contact' }

export async function generateMetadata(): Promise<Metadata> {
  const { draft } = await getPageContext()
  return resolvePageSEO({
    entity: { heading: contactContent.heading, excerpt: contactContent.intro, meta: contactContent.meta },
    route,
    isPreview: draft,
  })
}

/**
 * Page copy is source-owned; the form still writes to the Payload `inquiries`
 * collection through the existing Server Action.
 */
export default async function ContactPageRoute() {
  const { ctx } = await getPageContext()
  const payload = await getPayloadClient()

  const projectTypes = await payload
    .find({
      collection: 'project-types',
      ...baseQueryOptions(ctx),
      limit: 50,
      depth: 0,
      sort: ['displayOrder', 'id'],
    })
    .then((result) => result.docs.map((doc) => ({ id: doc.id, name: doc.name })))

  return (
    <>
      <SiteHeader route={route} />

      <main id="main" className="gc-tw bg-background">
        <PageHeader
          eyebrow={contactContent.eyebrow}
          heading={contactContent.heading}
          intro={contactContent.intro}
        />

        <div className="mx-auto w-full max-w-[76rem] px-6 pb-24 md:px-10 md:pb-32">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Prose text={contactContent.formIntro} className="mb-10" />
              <ContactForm action={submitInquiry} dictionary={ui} projectTypes={projectTypes} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
