import type { Industry } from '@/payload-types'
import { isLocalePublic } from '@/lib/publication'
import { approvedLocaleWhere, baseQueryOptions, getPayloadClient, type QueryContext } from './context'

export async function getIndustries(ctx: QueryContext, limit = 50): Promise<Industry[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'industries',
    ...baseQueryOptions(ctx),
    where: approvedLocaleWhere(ctx),
    limit,
    depth: 0,
    sort: ['displayOrder', 'name'],
  })
  return result.docs
}

export async function getIndustryBySlug(ctx: QueryContext, slug: string): Promise<Industry | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'industries',
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
