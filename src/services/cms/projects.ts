import type { Where } from 'payload'
import type { Project } from '@/payload-types'
import { isLocalePublic } from '@/lib/publication'
import { approvedLocaleWhere, baseQueryOptions, combineWhere, getPayloadClient, type QueryContext } from './context'

export type ProjectFilters = {
  service?: string
  industry?: string
  projectType?: string
}

/**
 * Work archive filters are matched on localized slugs of the related
 * taxonomy terms (CLAUDE.md §77).
 */
async function taxonomyIdFromSlug(
  ctx: QueryContext,
  collection: 'services' | 'industries' | 'project-types',
  slug: string,
): Promise<number | string | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection,
    ...baseQueryOptions(ctx),
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  return result.docs[0]?.id ?? null
}

export async function getProjects(
  ctx: QueryContext,
  { filters, limit = 24, page = 1 }: { filters?: ProjectFilters; limit?: number; page?: number } = {},
): Promise<{ docs: Project[]; totalPages: number; page: number; totalDocs: number }> {
  const payload = await getPayloadClient()

  const filterClauses: Where[] = []
  if (filters?.service) {
    const id = await taxonomyIdFromSlug(ctx, 'services', filters.service)
    filterClauses.push(id ? { services: { in: [id] } } : { id: { exists: false } })
  }
  if (filters?.industry) {
    const id = await taxonomyIdFromSlug(ctx, 'industries', filters.industry)
    filterClauses.push(id ? { industries: { in: [id] } } : { id: { exists: false } })
  }
  if (filters?.projectType) {
    const id = await taxonomyIdFromSlug(ctx, 'project-types', filters.projectType)
    filterClauses.push(id ? { projectTypes: { in: [id] } } : { id: { exists: false } })
  }

  const result = await payload.find({
    collection: 'projects',
    ...baseQueryOptions(ctx),
    where: combineWhere(approvedLocaleWhere(ctx), ...filterClauses),
    limit,
    page,
    depth: 1,
    sort: ['displayOrder', '-year'],
  })

  return { docs: result.docs, totalPages: result.totalPages, page: result.page ?? 1, totalDocs: result.totalDocs }
}

export async function getFeaturedProjects(ctx: QueryContext, limit = 6): Promise<Project[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'projects',
    ...baseQueryOptions(ctx),
    where: combineWhere(approvedLocaleWhere(ctx), { featured: { equals: true } }),
    limit,
    depth: 1,
    sort: ['displayOrder', '-year'],
  })
  return result.docs
}

export async function getProjectBySlug(ctx: QueryContext, slug: string): Promise<Project | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'projects',
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

/** Related work for a service or industry detail page (CLAUDE.md §76, §79). */
export async function getProjectsByRelation(
  ctx: QueryContext,
  relation: 'services' | 'industries',
  id: number | string,
  limit = 6,
): Promise<Project[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'projects',
    ...baseQueryOptions(ctx),
    where: combineWhere(approvedLocaleWhere(ctx), { [relation]: { in: [id] } }),
    limit,
    depth: 1,
    sort: ['displayOrder', '-year'],
  })
  return result.docs
}
