import { logCmsFailure } from '@/lib/log'
import { locales, translationStatusKey, type Locale } from '@/i18n/locale'
import { getPayloadClient } from '@/services/cms/context'
import { buildAbsoluteURL, type Route } from './urls'

type Entry = { url: string; lastModified?: Date }

type PageGlobalSlug = 'home-page' | 'services-page' | 'work-page' | 'company-page' | 'contact-page'

const staticRoutes: { global: PageGlobalSlug; route: Route }[] = [
  { global: 'home-page', route: { type: 'home' } },
  { global: 'services-page', route: { type: 'services' } },
  { global: 'work-page', route: { type: 'work' } },
  { global: 'company-page', route: { type: 'company' } },
  { global: 'contact-page', route: { type: 'contact' } },
]

type IndexableDoc = {
  slug?: string | null
  updatedAt?: string | null
  meta?: { robots?: { noIndex?: boolean | null } | null } | null
}

/**
 * CLAUDE.md §68 — only canonical, indexable, publicly approved localized
 * routes. Every URL here is produced by the same route builder used for
 * canonicals, so sitemap URLs equal canonical URLs exactly.
 */
export async function buildSitemapEntries(): Promise<Entry[]> {
  const payload = await getPayloadClient()
  const entries: Entry[] = []

  for (const locale of locales) {
    for (const { global, route } of staticRoutes) {
      try {
        const doc = (await payload.findGlobal({
          slug: global,
          locale,
          fallbackLocale: false,
          draft: false,
          depth: 0,
          overrideAccess: false,
        })) as { _status?: string; translationStatus?: Record<string, string | null | undefined> | null } & IndexableDoc

        const approved = doc?.translationStatus?.[translationStatusKey(locale)] === 'approved'
        if (doc?._status === 'published' && approved && !doc?.meta?.robots?.noIndex) {
          entries.push({
            url: buildAbsoluteURL(locale, route),
            lastModified: doc.updatedAt ? new Date(doc.updatedAt) : undefined,
          })
        }
      } catch (error) {
        // Not publicly readable — excluded from the sitemap.
        logCmsFailure(`sitemap(${global}, ${locale})`, error)
      }
    }

    entries.push(...(await collectionEntries(locale, 'services', (slug) => ({ type: 'service', slug }))))
    entries.push(...(await collectionEntries(locale, 'projects', (slug) => ({ type: 'project', slug }))))
    entries.push(...(await collectionEntries(locale, 'industries', (slug) => ({ type: 'industry', slug }))))
  }

  return entries
}

async function collectionEntries(
  locale: Locale,
  collection: 'services' | 'projects' | 'industries',
  toRoute: (slug: string) => Route,
): Promise<Entry[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection,
    locale,
    fallbackLocale: false,
    draft: false,
    overrideAccess: false,
    where: { [`translationStatus.${translationStatusKey(locale)}`]: { equals: 'approved' } },
    limit: 1000,
    depth: 0,
  })

  return (result.docs as IndexableDoc[])
    .filter((doc) => doc.slug && !doc.meta?.robots?.noIndex)
    .map((doc) => ({
      url: buildAbsoluteURL(locale, toRoute(doc.slug as string)),
      lastModified: doc.updatedAt ? new Date(doc.updatedAt) : undefined,
    }))
}
