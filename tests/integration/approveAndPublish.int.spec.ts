import { beforeAll, describe, expect, it } from 'vitest'
import type { Payload } from 'payload'
import { ensureUser, getTestPayload, type TestUser } from '../helpers/payload'

/**
 * CLAUDE.md §18, §27 — the compound action must reach the same end state as
 * the manual three-save sequence, leave the same trail behind it, and refuse
 * in exactly the cases a plain publish refuses.
 */
describe('approve and publish', () => {
  let payload: Payload
  let admin: TestUser
  let publisher: TestUser
  let editor: TestUser
  const run = Date.now()
  const sourceReferences = [{ type: 'user_provided' as const, label: 'Kickoff brief' }]

  const newDraft = async (label: string, user: TestUser) =>
    payload.create({
      collection: 'clients',
      locale: 'fr',
      data: { name: `${label} ${run}`, sourceReferences },
      draft: true,
      overrideAccess: false,
      user: user as never,
    })

  const latestVersion = async (id: number) => {
    const versions = await payload.findVersions({
      collection: 'clients',
      where: { parent: { equals: id } },
      sort: '-updatedAt',
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    return versions.docs[0]?.version as unknown as Record<string, unknown> | undefined
  }

  beforeAll(async () => {
    payload = await getTestPayload()
    ;[admin, publisher, editor] = await Promise.all([
      ensureUser('admin'),
      ensureUser('publisher'),
      ensureUser('editor'),
    ])
  })

  it('publishes a fresh draft in a single operation', async () => {
    const doc = await newDraft('Compound', admin)
    expect(doc.reviewStatus).toBe('editorial_draft')

    const published = await payload.update({
      collection: 'clients',
      id: doc.id,
      data: { _status: 'published', _approveAndPublish: true } as never,
      overrideAccess: false,
      user: admin as never,
    })

    expect(published._status).toBe('published')
    expect(published.reviewStatus).toBe('approved')
    expect(published.translationStatus?.frStatus).toBe('approved')
    expect(published.dirtyLocales).toEqual([])
  })

  it('leaves the same trail as the manual sequence, in one version', async () => {
    // Manual: approve, approve the locale, then publish — three saves.
    const manual = await newDraft('Manual', publisher)
    for (const data of [
      { reviewStatus: 'approved' },
      { translationStatus: { frStatus: 'approved' } },
    ]) {
      await payload.update({
        collection: 'clients',
        id: manual.id,
        data: data as never,
        draft: true,
        overrideAccess: false,
        user: publisher as never,
      })
    }
    await payload.update({
      collection: 'clients',
      id: manual.id,
      data: { _status: 'published' } as never,
      overrideAccess: false,
      user: publisher as never,
    })

    // Compound: the same end state in one save.
    const compound = await newDraft('Compound trail', publisher)
    await payload.update({
      collection: 'clients',
      id: compound.id,
      data: { _status: 'published', _approveAndPublish: true } as never,
      overrideAccess: false,
      user: publisher as never,
    })

    const manualVersion = await latestVersion(manual.id)
    const compoundVersion = await latestVersion(compound.id)

    for (const version of [manualVersion, compoundVersion]) {
      expect(version).toBeDefined()
      expect(version?._status).toBe('published')
      expect(version?.reviewStatus).toBe('approved')
      expect((version?.translationStatus as { frStatus?: string })?.frStatus).toBe('approved')
      // Payload version rows carry no author, so the approver is recorded on
      // the document — by whom, and in the same snapshot as the publish.
      expect(version?.approvedBy).toBe(publisher.id)
      expect(version?.approvedAt).toBeTruthy()
    }
  })

  it('refuses an editor, because the role is checked before anything is approved', async () => {
    const doc = await newDraft('Editor compound', editor)

    await expect(
      payload.update({
        collection: 'clients',
        id: doc.id,
        data: { _status: 'published', _approveAndPublish: true } as never,
        overrideAccess: false,
        user: editor as never,
      }),
    ).rejects.toThrow(/only a publisher or admin can publish/i)

    const after = await payload.findByID({ collection: 'clients', id: doc.id, draft: true, overrideAccess: true })
    expect(after.reviewStatus).toBe('editorial_draft')
    expect(after._status).toBe('draft')
  })

  it('still refuses a bare publish that carries no flag', async () => {
    const doc = await newDraft('Bare publish', admin)

    await expect(
      payload.update({
        collection: 'clients',
        id: doc.id,
        data: { _status: 'published' } as never,
        overrideAccess: false,
        user: admin as never,
      }),
    ).rejects.toThrow(/review status is “editorial_draft”/i)
  })

  it('approves only the locales that were edited', async () => {
    const doc = await newDraft('Locale scope', admin)
    await payload.update({
      collection: 'clients',
      id: doc.id,
      locale: 'en',
      data: { shortDescription: 'English copy' } as never,
      draft: true,
      overrideAccess: false,
      user: admin as never,
    })

    const published = await payload.update({
      collection: 'clients',
      id: doc.id,
      data: { _status: 'published', _approveAndPublish: true } as never,
      overrideAccess: false,
      user: admin as never,
    })

    expect(published.translationStatus?.frStatus).toBe('approved')
    expect(published.translationStatus?.enStatus).toBe('approved')
    // ES was never touched, so it stays unpublishable (§17).
    expect(published.translationStatus?.esStatus).toBe('missing')
  })
})
