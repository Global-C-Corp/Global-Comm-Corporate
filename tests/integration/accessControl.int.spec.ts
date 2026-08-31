import { beforeAll, describe, expect, it } from 'vitest'
import type { Payload } from 'payload'
import { ensureUser, getTestPayload, type TestUser } from '../helpers/payload'

/**
 * CLAUDE.md §129 — proves the access model against a real database:
 * who may draft, who may publish, and what anonymous visitors can see.
 */
describe('access control', () => {
  let payload: Payload
  let admin: TestUser
  let publisher: TestUser
  let editor: TestUser
  let aiEditor: TestUser
  let clientId: number

  const sourceReferences = [{ type: 'user_provided' as const, label: 'Kickoff brief' }]
  // Slugs are unique per locale, so titles must be unique per test run.
  const run = Date.now()

  beforeAll(async () => {
    payload = await getTestPayload()
    ;[admin, publisher, editor, aiEditor] = await Promise.all([
      ensureUser('admin'),
      ensureUser('publisher'),
      ensureUser('editor'),
      ensureUser('ai_editor'),
    ])

    const client = await payload.create({
      collection: 'clients',
      data: { name: `Access Test Client ${Date.now()}`, sourceReferences },
      draft: true,
      overrideAccess: false,
      user: editor as never,
    })
    clientId = client.id
  })

  it('lets AI create a draft', async () => {
    const doc = await payload.create({
      collection: 'projects',
      locale: 'fr',
      data: { title: `Projet IA ${run}`, client: clientId, sourceReferences } as never,
      draft: true,
      overrideAccess: false,
      user: aiEditor as never,
    })

    expect(doc.id).toBeDefined()
    expect(doc.reviewStatus).toBe('ai_draft')
    expect(doc._status).toBe('draft')
  })

  it('does not let AI publish', async () => {
    const doc = await payload.create({
      collection: 'projects',
      locale: 'fr',
      data: { title: `Tentative de publication ${run}`, client: clientId, sourceReferences } as never,
      draft: true,
      overrideAccess: false,
      user: aiEditor as never,
    })

    await expect(
      payload.update({
        collection: 'projects',
        id: doc.id,
        data: { _status: 'published' } as never,
        overrideAccess: false,
        user: aiEditor as never,
      }),
    ).rejects.toThrow()
  })

  it('does not let AI approve', async () => {
    const doc = await payload.create({
      collection: 'projects',
      locale: 'fr',
      data: { title: `Tentative approbation ${run}`, client: clientId, sourceReferences } as never,
      draft: true,
      overrideAccess: false,
      user: aiEditor as never,
    })

    await expect(
      payload.update({
        collection: 'projects',
        id: doc.id,
        data: { reviewStatus: 'approved' } as never,
        draft: true,
        overrideAccess: false,
        user: aiEditor as never,
      }),
    ).rejects.toThrow()
  })

  it('does not let AI delete production content', async () => {
    const doc = await payload.create({
      collection: 'projects',
      locale: 'fr',
      data: { title: `Suppression interdite ${run}`, client: clientId, sourceReferences } as never,
      draft: true,
      overrideAccess: false,
      user: aiEditor as never,
    })

    await expect(
      payload.delete({ collection: 'projects', id: doc.id, overrideAccess: false, user: aiEditor as never }),
    ).rejects.toThrow()
  })

  it('does not let AI create taxonomy', async () => {
    await expect(
      payload.create({
        collection: 'context-tags',
        locale: 'fr',
        data: { name: 'Invented Tag' } as never,
        overrideAccess: false,
        user: aiEditor as never,
      }),
    ).rejects.toThrow()
  })

  it('does not let AI read inquiries', async () => {
    await payload.create({
      collection: 'inquiries',
      data: {
        name: 'Prospect',
        company: 'Prospect SARL',
        email: 'prospect@example.com',
        message: 'We would like to discuss a rebrand.',
        consent: true,
      },
      overrideAccess: true,
    })

    // Access is denied outright rather than returning an empty result set.
    await expect(
      payload.find({
        collection: 'inquiries',
        overrideAccess: false,
        user: aiEditor as never,
      }),
    ).rejects.toThrow()
  })

  it('lets a publisher read inquiries', async () => {
    const result = await payload.find({
      collection: 'inquiries',
      overrideAccess: false,
      user: publisher as never,
    })
    expect(result.totalDocs).toBeGreaterThan(0)
  })

  it('does not let an editor publish', async () => {
    const doc = await payload.create({
      collection: 'projects',
      locale: 'fr',
      data: { title: `Editeur publication ${run}`, client: clientId, sourceReferences } as never,
      draft: true,
      overrideAccess: false,
      user: editor as never,
    })

    await expect(
      payload.update({
        collection: 'projects',
        id: doc.id,
        data: { _status: 'published' } as never,
        overrideAccess: false,
        user: editor as never,
      }),
    ).rejects.toThrow()
  })

  it('does not let a publisher publish unapproved content', async () => {
    const doc = await payload.create({
      collection: 'projects',
      locale: 'fr',
      data: { title: `Non approuvé ${run}`, client: clientId, sourceReferences } as never,
      draft: true,
      overrideAccess: false,
      user: editor as never,
    })

    await expect(
      payload.update({
        collection: 'projects',
        id: doc.id,
        data: { _status: 'published' } as never,
        overrideAccess: false,
        user: publisher as never,
      }),
    ).rejects.toThrow()
  })

  it('does not let a publisher publish when a dirty locale is unapproved', async () => {
    const doc = await payload.create({
      collection: 'projects',
      locale: 'fr',
      data: { title: `Multilingue ${run}`, client: clientId, sourceReferences } as never,
      draft: true,
      overrideAccess: false,
      user: editor as never,
    })

    // Editing the Spanish locale marks it dirty while it is still unapproved.
    await payload.update({
      collection: 'projects',
      id: doc.id,
      locale: 'es',
      data: { title: `Proyecto multilingüe ${run}` } as never,
      draft: true,
      overrideAccess: false,
      user: editor as never,
    })

    await payload.update({
      collection: 'projects',
      id: doc.id,
      data: {
        reviewStatus: 'needs_review',
      } as never,
      draft: true,
      overrideAccess: false,
      user: editor as never,
    })

    await payload.update({
      collection: 'projects',
      id: doc.id,
      data: {
        reviewStatus: 'approved',
        translationStatus: { frStatus: 'approved', esStatus: 'needs_review' },
      } as never,
      draft: true,
      overrideAccess: false,
      user: publisher as never,
    })

    await expect(
      payload.update({
        collection: 'projects',
        id: doc.id,
        data: { _status: 'published' } as never,
        overrideAccess: false,
        user: publisher as never,
      }),
    ).rejects.toThrow()
  })

  it('lets a publisher publish an approved draft, and anonymous visitors then see it', async () => {
    const doc = await payload.create({
      collection: 'projects',
      locale: 'fr',
      data: { title: `Projet publiable ${run}`, client: clientId, sourceReferences } as never,
      draft: true,
      overrideAccess: false,
      user: editor as never,
    })

    await payload.update({
      collection: 'projects',
      id: doc.id,
      data: { reviewStatus: 'needs_review' } as never,
      draft: true,
      overrideAccess: false,
      user: editor as never,
    })

    await payload.update({
      collection: 'projects',
      id: doc.id,
      data: {
        reviewStatus: 'approved',
        translationStatus: { frStatus: 'approved' },
      } as never,
      draft: true,
      overrideAccess: false,
      user: publisher as never,
    })

    const published = await payload.update({
      collection: 'projects',
      id: doc.id,
      data: { _status: 'published' } as never,
      overrideAccess: false,
      user: publisher as never,
    })

    expect(published._status).toBe('published')
    expect(published.dirtyLocales).toEqual([])

    const anonymous = await payload.find({
      collection: 'projects',
      where: { id: { equals: doc.id } },
      draft: false,
      overrideAccess: false,
    })
    expect(anonymous.totalDocs).toBe(1)
  })

  it('hides drafts from anonymous visitors', async () => {
    const doc = await payload.create({
      collection: 'projects',
      locale: 'fr',
      data: { title: `Brouillon privé ${run}`, client: clientId, sourceReferences } as never,
      draft: true,
      overrideAccess: false,
      user: editor as never,
    })

    const anonymous = await payload.find({
      collection: 'projects',
      where: { id: { equals: doc.id } },
      draft: false,
      overrideAccess: false,
    })

    expect(anonymous.totalDocs).toBe(0)
  })

  it('lets only admin delete content', async () => {
    const doc = await payload.create({
      collection: 'projects',
      locale: 'fr',
      data: { title: `À supprimer ${run}`, client: clientId, sourceReferences } as never,
      draft: true,
      overrideAccess: false,
      user: editor as never,
    })

    await expect(
      payload.delete({ collection: 'projects', id: doc.id, overrideAccess: false, user: editor as never }),
    ).rejects.toThrow()

    await expect(
      payload.delete({ collection: 'projects', id: doc.id, overrideAccess: false, user: admin as never }),
    ).resolves.toBeDefined()
  })
})
