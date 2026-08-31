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

/** Top-level pillars only (CLAUDE.md §30, §75 — five service pillars). */
export async function getServicePillars(ctx: QueryContext): Promise<Service[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'services',
    ...baseQueryOptions(ctx),
    where: combineWhere(approvedLocaleWhere(ctx), { parent: { exists: false } }),
    limit: 50,
    depth: 1,
    sort: ['displayOrder', 'name'],
  })
  return result.docs
}

export async function getChildServices(ctx: QueryContext, parentId: number | string): Promise<Service[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'services',
    ...baseQueryOptions(ctx),
    where: combineWhere(approvedLocaleWhere(ctx), { parent: { equals: parentId } }),
    limit: 50,
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
