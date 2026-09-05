import { beforeAll, describe, expect, it } from 'vitest'
import type { Payload } from 'payload'
import { ensureUser, getTestPayload, type TestUser } from '../helpers/payload'

/**
 * The public service grouping controls live URLs, so it is governed exactly
 * like a term's identity (CLAUDE.md §109) and its structural invariants are
 * enforced server-side rather than only in the Admin form (§27).
 */
describe('service pillars', () => {
  let payload: Payload
  let admin: TestUser
  let publisher: TestUser
  let editor: TestUser

  let pillarId: number
  let plainId: number

  const run = Date.now()

  beforeAll(async () => {
    payload = await getTestPayload()
    ;[admin, publisher, editor] = await Promise.all([
      ensureUser('admin'),
      ensureUser('publisher'),
      ensureUser('editor'),
    ])

    const pillar = await payload.create({
      collection: 'services',
      locale: 'fr',
      data: { name: `Pilier ${run}`, isPillar: true } as never,
      draft: true,
      overrideAccess: false,
      user: admin as never,
    })
    pillarId = pillar.id

    const plain = await payload.create({
      collection: 'services',
      locale: 'fr',
      data: { name: `Terme ${run}` } as never,
      draft: true,
      overrideAccess: false,
      user: admin as never,
    })
    plainId = plain.id
  })

  it('lets a publisher fold a term into a pillar', async () => {
    const doc = await payload.update({
      collection: 'services',
      id: plainId,
      data: { foldedInto: pillarId } as never,
      draft: true,
      overrideAccess: false,
      user: publisher as never,
    })

    const folded = typeof doc.foldedInto === 'object' ? doc.foldedInto?.id : doc.foldedInto
    expect(Number(folded)).toBe(pillarId)
  })

  it('does not let an editor change the grouping (§109)', async () => {
    const before = await payload.findByID({
      collection: 'services',
      id: plainId,
      depth: 0,
      overrideAccess: true,
    })

    await payload.update({
      collection: 'services',
      id: plainId,
      data: { isPillar: true } as never,
      draft: true,
      overrideAccess: false,
      user: editor as never,
    })

    const after = await payload.findByID({
      collection: 'services',
      id: plainId,
      depth: 0,
      overrideAccess: true,
    })

    // Field-level access silently drops the value rather than throwing, so the
    // proof is that the stored grouping is unchanged.
    expect(after.isPillar).toBe(before.isPillar)
    expect(after.isPillar).not.toBe(true)
  })

  it('refuses a term folded into a non-pillar', async () => {
    const other = await payload.create({
      collection: 'services',
      locale: 'fr',
      data: { name: `Cible non pilier ${run}` } as never,
      draft: true,
      overrideAccess: false,
      user: admin as never,
    })

    await expect(
      payload.update({
        collection: 'services',
        id: plainId,
        data: { foldedInto: other.id } as never,
        draft: true,
        overrideAccess: false,
        user: admin as never,
      }),
    ).rejects.toThrow(/must point at a pillar/i)
  })

  it('refuses a pillar that is also folded', async () => {
    await expect(
      payload.update({
        collection: 'services',
        id: pillarId,
        data: { foldedInto: plainId, isPillar: true } as never,
        draft: true,
        overrideAccess: false,
        user: admin as never,
      }),
    ).rejects.toThrow(/cannot itself be folded/i)
  })

  it('refuses a term folded into itself', async () => {
    await expect(
      payload.update({
        collection: 'services',
        id: plainId,
        data: { foldedInto: plainId } as never,
        draft: true,
        overrideAccess: false,
        user: admin as never,
      }),
    ).rejects.toThrow(/folded into itself/i)
  })
})
