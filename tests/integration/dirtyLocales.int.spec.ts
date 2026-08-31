import { beforeAll, describe, expect, it } from 'vitest'
import type { Payload } from 'payload'
import { ensureUser, getTestPayload, type TestUser } from '../helpers/payload'

/**
 * CLAUDE.md §16 — dirtyLocales identifies locales *changed* in the current
 * unpublished version. Opening a document in a locale and saving without
 * editing anything is not a change, and must not create approval work.
 */
describe('dirtyLocales tracking', () => {
  let payload: Payload
  let admin: TestUser
  const run = Date.now()
  const sourceReferences = [{ type: 'user_provided' as const, label: 'Kickoff brief' }]

  const publishedDoc = async (label: string) => {
    const doc = await payload.create({
      collection: 'clients',
      locale: 'fr',
      data: { name: `${label} ${run}`, sourceReferences },
      draft: true,
      overrideAccess: false,
      user: admin as never,
    })
    await payload.update({
      collection: 'clients',
      id: doc.id,
      data: { _status: 'published', _approveAndPublish: true } as never,
      overrideAccess: false,
      user: admin as never,
    })
    return doc.id
  }

  beforeAll(async () => {
    payload = await getTestPayload()
    admin = await ensureUser('admin')
  })

  it('does not mark a locale dirty when the save changes no content', async () => {
    const id = await publishedDoc('No-op save')

    const after = await payload.update({
      collection: 'clients',
      id,
      locale: 'es',
      data: { reviewStatus: 'approved' } as never,
      draft: true,
      overrideAccess: false,
      user: admin as never,
    })

    expect(after.dirtyLocales ?? []).not.toContain('es')
  })

  it('does not mark a locale dirty when the same values are resubmitted', async () => {
    const id = await publishedDoc('Resubmit')
    const current = await payload.findByID({ collection: 'clients', id, locale: 'es', draft: true, overrideAccess: true })

    const after = await payload.update({
      collection: 'clients',
      id,
      locale: 'es',
      data: { name: current.name, location: current.location } as never,
      draft: true,
      overrideAccess: false,
      user: admin as never,
    })

    expect(after.dirtyLocales ?? []).not.toContain('es')
  })

  it('marks a locale dirty as soon as its content actually changes', async () => {
    const id = await publishedDoc('Real edit')

    const after = await payload.update({
      collection: 'clients',
      id,
      locale: 'es',
      data: { shortDescription: 'Texto en español' } as never,
      draft: true,
      overrideAccess: false,
      user: admin as never,
    })

    expect(after.dirtyLocales).toContain('es')
  })

  it('marks a locale dirty when a shared field changes', async () => {
    const id = await publishedDoc('Shared edit')

    const after = await payload.update({
      collection: 'clients',
      id,
      locale: 'en',
      data: { location: 'Casablanca' } as never,
      draft: true,
      overrideAccess: false,
      user: admin as never,
    })

    expect(after.dirtyLocales).toContain('en')
  })
})
