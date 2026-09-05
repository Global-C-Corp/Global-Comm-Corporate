import type { Service } from '@/payload-types'
import { isLocalePublic } from '@/lib/publication'
import { approvedLocaleWhere, baseQueryOptions, combineWhere, getPayloadClient, type QueryContext } from './context'

export async function getServices(ctx: QueryContext, { limit = 100 }: { limit?: number } = {}): Promise<Service[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'services',
    ...baseQueryOptions(ctx),
    where: approvedLocaleWhere(ctx),
    limit,
    depth: 1,
    sort: ['displayOrder', 'name'],
  })
  return result.docs
}

/**
 * The services that have a public page (CLAUDE.md §29-§30).
 *
 * Publicness is read from `isPillar`, not from "has no parent": the taxonomy
 * still has five roots, but only four of them are public — "Création &
 * Contenu" is folded into Branding. Deriving this from the hierarchy would
 * silently republish that root.
 */
export async function getServicePillars(ctx: QueryContext): Promise<Service[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'services',
    ...baseQueryOptions(ctx),
    where: combineWhere(approvedLocaleWhere(ctx), { isPillar: { equals: true } }),
    limit: 50,
    depth: 1,
    sort: ['displayOrder', 'name'],
  })
  return result.docs
}

/**
 * Everything a pillar absorbs, presented on its page as sections rather than
 * links. This follows `foldedInto`, so it includes terms that sit under a
 * different parent in the hierarchy — the six content-creation terms appear
 * under Branding even though their parent is still "Création & Contenu".
 */
export async function getFoldedServices(ctx: QueryContext, pillarId: number | string): Promise<Service[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'services',
    ...baseQueryOptions(ctx),
    where: combineWhere(approvedLocaleWhere(ctx), { foldedInto: { equals: pillarId } }),
    limit: 100,
    depth: 0,
    sort: ['displayOrder', 'name'],
  })
  return result.docs
}

export async function getServiceBySlug(ctx: QueryContext, slug: string): Promise<Service | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'services',
    ...baseQueryOptions(ctx),
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  const doc = result.docs[0]
  if (!doc) return null
  if (!ctx.draft && !isLocalePublic(doc, ctx.locale)) return null
  return doc
}
