import type { Locale } from '@/i18n/locale'
import { buildPath, type Route } from '@/services/seo/urls'
import { getPayloadClient } from './context'

export type ResolvedRedirect = { destination: string; permanent: boolean }

type ReferenceValue = { relationTo: string; value: number | { slug?: string | null } }

function routeForReference(reference: ReferenceValue): Route | null {
  const slug = typeof reference.value === 'object' ? reference.value.slug : undefined
  if (!slug) return null

  switch (reference.relationTo) {
    case 'services':
      return { type: 'service', slug }
    case 'projects':
      return { type: 'project', slug }
    case 'industries':
      return { type: 'industry', slug }
    default:
      return null
  }
}

/**
 * CLAUDE.md §70 — Payload owns redirect records, Next.js performs the HTTP
 * redirect. Looked up when a route would otherwise 404, so a changed
 * published slug keeps its old URL working. A reference target resolves
 * through the same route builder as canonicals, in the requested locale.
 */
export async function findRedirect(fromPath: string, locale: Locale): Promise<ResolvedRedirect | null> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'redirects',
    where: { from: { equals: fromPath } },
    locale,
    fallbackLocale: false,
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })

  const record = result.docs[0]
  if (!record?.to) return null

  const permanent = record.type !== '302'

  if (typeof record.to.url === 'string' && record.to.url.trim() !== '') {
    return { destination: record.to.url, permanent }
  }

  const reference = record.to.reference as ReferenceValue | null | undefined
  if (reference) {
    const route = routeForReference(reference)
    if (route) return { destination: buildPath(locale, route), permanent }
  }

  return null
}
