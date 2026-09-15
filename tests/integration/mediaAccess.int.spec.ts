// @vitest-environment node
// `file-type`, which Payload uses to sniff an upload's real MIME type, resolves
// to a browser build under the suite's default jsdom environment and rejects
// every file. This spec needs a real upload, so it runs in Node.
import os from 'node:os'
import path from 'node:path'
import { beforeAll, describe, expect, it } from 'vitest'
import sharp from 'sharp'
import type { Payload } from 'payload'
import { ensureUser, getTestPayload, type TestUser } from '../helpers/payload'

/**
 * CLAUDE.md §38, §114, §125, §129.
 *
 * Regression cover for a 500 that took down every public page carrying an
 * image: `media` has no drafts/versions, so it has no `_status` column, but
 * its read access used the published-only predicate. Any anonymous read —
 * including the relationship population behind a project hero — threw
 * `APIError: Cannot find field for path at _status` before a single pixel
 * rendered. The failure was invisible in a database with no media rows.
 */
describe('media access', () => {
  let payload: Payload
  let editor: TestUser
  let mediaId: number

  beforeAll(async () => {
    payload = await getTestPayload()
    editor = await ensureUser('editor')

    const filePath = path.join(os.tmpdir(), `media-access-${Date.now()}.png`)
    await sharp({
      create: { width: 2400, height: 1500, channels: 3, background: { r: 10, g: 10, b: 20 } },
    })
      .png()
      .toFile(filePath)

    const created = await payload.create({
      collection: 'media',
      overrideAccess: false,
      user: editor as never,
      filePath,
      data: {
        alt: 'Access test asset',
        credit: 'Studio credit',
        source: 'internal drive',
        internalNotes: 'not for public consumption',
        usageRights: 'licensed',
        clientApproved: true,
      },
    })

    mediaId = created.id
  })

  it('lets an anonymous visitor read media without a _status query', async () => {
    const found = await payload.find({
      collection: 'media',
      where: { id: { equals: mediaId } },
      draft: false,
      overrideAccess: false,
    })

    expect(found.totalDocs).toBe(1)
    expect(found.docs[0]?.url).toBeTruthy()
  })

  it('withholds internal rights metadata from anonymous visitors', async () => {
    const doc = await payload.findByID({
      collection: 'media',
      id: mediaId,
      overrideAccess: false,
    })

    expect(doc.alt).toBe('Access test asset')
    expect(doc.credit).toBe('Studio credit')

    expect(doc.internalNotes).toBeUndefined()
    expect(doc.source).toBeUndefined()
    expect(doc.usageRights).toBeUndefined()
    expect(doc.usageExpiration).toBeUndefined()
    expect(doc.clientApproved).toBeUndefined()
  })

  it('still shows internal rights metadata to an internal role', async () => {
    const doc = await payload.findByID({
      collection: 'media',
      id: mediaId,
      overrideAccess: false,
      user: editor as never,
    })

    expect(doc.internalNotes).toBe('not for public consumption')
    expect(doc.source).toBe('internal drive')
    expect(doc.usageRights).toBe('licensed')
    expect(doc.clientApproved).toBe(true)
  })
})
