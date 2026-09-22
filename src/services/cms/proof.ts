import type { Client, Testimonial } from '@/payload-types'
import { approvedLocaleWhere, baseQueryOptions, combineWhere, getPayloadClient, type QueryContext } from './context'

export async function getFeaturedClients(ctx: QueryContext, limit = 12): Promise<Client[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'clients',
    ...baseQueryOptions(ctx),
    where: combineWhere(approvedLocaleWhere(ctx), { featured: { equals: true } }),
    limit,
    depth: 1,
    sort: ['displayOrder', 'name', 'id'],
  })
  return result.docs
}

/**
 * Approved client records for a reference band, used when no client has been
 * marked `featured` yet. Every row is a published, locale-approved client —
 * the fallback widens the selection, it never invents an organisation
 * (CLAUDE.md §105).
 *
 * This mirrors the featured/fallback idiom the Services page already uses for
 * projects.
 */
export async function getPublishedClients(ctx: QueryContext, limit = 12): Promise<Client[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'clients',
    ...baseQueryOptions(ctx),
    where: approvedLocaleWhere(ctx),
    limit,
    depth: 1,
    sort: ['displayOrder', 'name', 'id'],
  })
  return result.docs
}

export async function getFeaturedTestimonials(ctx: QueryContext, limit = 6): Promise<Testimonial[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'testimonials',
    ...baseQueryOptions(ctx),
    where: combineWhere(approvedLocaleWhere(ctx), { featured: { equals: true } }),
    limit,
    depth: 1,
    sort: ['displayOrder', 'id'],
  })
  return result.docs
}

export async function getTestimonialsForProject(ctx: QueryContext, projectId: number | string): Promise<Testimonial[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'testimonials',
    ...baseQueryOptions(ctx),
    where: combineWhere(approvedLocaleWhere(ctx), { project: { equals: projectId } }),
    limit: 5,
    depth: 1,
  })
  return result.docs
}
