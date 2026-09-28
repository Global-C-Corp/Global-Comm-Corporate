import { services } from '@/content/services'
import { translationStatusKey } from '@/i18n/locale'
import { getPayloadClient } from '@/services/cms/context'
import { buildAbsoluteURL, type Route } from './urls'

type Entry = { url: string; lastModified?: Date }

type IndexableDoc = {
  slug?: string | null
  updatedAt?: string | null
  meta?: { robots?: { noIndex?: boolean | null } | null } | null
}

/**
 * The corporate pages are source-owned, so they are always in the sitemap —
 * there is no published/approved state to consult. Projects still come from
 * Payload and are still filtered on it.
 */
const staticRoutes: Route[] = [
  { type: 'home' },
  { type: 'company' },
  { type: 'services' },
  { type: 'work' },
  { type: 'contact' },
]

/**
 * Only canonical, indexable, public URLs. Every URL here is produced by the
 * same route builder used for canonicals, so sitemap URLs equal canonical URLs
 * exactly.
 */
export async function buildSitemapEntries(): Promise<Entry[]> {
  const entries: Entry[] = [
    ...staticRoutes.map((route) => ({ url: buildAbsoluteURL(route) })),
    ...services.map((service) => ({
      url: buildAbsoluteURL({ type: 'service', slug: service.slug }),
    })),
  ]

  entries.push(...(await projectEntries()))

  return entries
}

/**
 * Projects remain Payload-owned and still carry per-locale approval, so the
 * French row is what the public site publishes.
 */
async function projectEntries(): Promise<Entry[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'projects',
    locale: 'fr',
    fallbackLocale: false,
    draft: false,
    overrideAccess: false,
    where: { [`translationStatus.${translationStatusKey('fr')}`]: { equals: 'approved' } },
    limit: 1000,
    depth: 0,
  })

  return (result.docs as IndexableDoc[])
    .filter((doc) => doc.slug && !doc.meta?.robots?.noIndex)
    .map((doc) => ({
      url: buildAbsoluteURL({ type: 'project', slug: doc.slug as string }),
      lastModified: doc.updatedAt ? new Date(doc.updatedAt) : undefined,
    }))
}
