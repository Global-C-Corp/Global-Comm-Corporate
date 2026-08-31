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
    sort: ['displayOrder', 'name'],
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
    sort: ['displayOrder'],
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
