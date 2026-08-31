import { beforeAll, describe, expect, it } from 'vitest'
import type { Payload } from 'payload'
import { ensureUser, getTestPayload, type TestUser } from '../helpers/payload'

/**
 * CLAUDE.md §11, §14, §129 — field-level localization, no public fallback,
 * and shared facts that stay shared across locales.
 */
describe('localization', () => {
  let payload: Payload
  let editor: TestUser
  let clientId: number
  let projectId: number

  const sourceReferences = [{ type: 'user_provided' as const, label: 'Source' }]
  // Slugs are unique per locale, so titles must be unique per test run.
  const run = Date.now()

  beforeAll(async () => {
    payload = await getTestPayload()
    editor = await ensureUser('editor')

    const client = await payload.create({
      collection: 'clients',
      data: { name: `Localization Client ${Date.now()}`, sourceReferences },
      draft: true,
      overrideAccess: false,
      user: editor as never,
    })
    clientId = client.id

    const project = await payload.create({
      collection: 'projects',
      locale: 'fr',
      data: {
        title: `Titre français ${run}`,
        client: clientId,
        year: 2025,
        sourceReferences,
      } as never,
      draft: true,
      overrideAccess: false,
      user: editor as never,
    })
    projectId = project.id

    await payload.update({
      collection: 'projects',
      id: projectId,
      locale: 'en',
      data: { title: `English title ${run}` } as never,
      draft: true,
      overrideAccess: false,
      user: editor as never,
    })
  })

  it('returns the requested locale', async () => {
    const fr = await payload.findByID({ collection: 'projects', id: projectId, locale: 'fr', draft: true, overrideAccess: true })
    const en = await payload.findByID({ collection: 'projects', id: projectId, locale: 'en', draft: true, overrideAccess: true })

    expect(fr.title).toBe(`Titre français ${run}`)
    expect(en.title).toBe(`English title ${run}`)
  })

  it('does not fall back across locales when fallbackLocale is false', async () => {
    const es = await payload.findByID({
      collection: 'projects',
      id: projectId,
      locale: 'es',
      fallbackLocale: false,
      draft: true,
      overrideAccess: true,
    })

    expect(es.title).toBeFalsy()
  })

  it('keeps shared facts identical across locales', async () => {
    const fr = await payload.findByID({ collection: 'projects', id: projectId, locale: 'fr', draft: true, depth: 0, overrideAccess: true })
    const es = await payload.findByID({ collection: 'projects', id: projectId, locale: 'es', draft: true, depth: 0, overrideAccess: true })

    expect(fr.client).toBe(clientId)
    expect(es.client).toBe(clientId)
    expect(fr.year).toBe(2025)
    expect(es.year).toBe(2025)
  })

  it('tracks each edited locale in dirtyLocales', async () => {
    const doc = await payload.findByID({ collection: 'projects', id: projectId, draft: true, overrideAccess: true })
    expect(doc.dirtyLocales).toEqual(expect.arrayContaining(['fr', 'en']))
  })

  it('requires a source on testimonials', async () => {
    await expect(
      payload.create({
        collection: 'testimonials',
        data: {
          internalTitle: 'No source',
          originalQuote: 'They were great.',
          originalLocale: 'en',
          personName: 'A. Person',
          sourceReferences: [],
        } as never,
        draft: true,
        overrideAccess: false,
        user: editor as never,
      }),
    ).rejects.toThrow()
  })

  it('requires attribution on testimonials', async () => {
    await expect(
      payload.create({
        collection: 'testimonials',
        data: {
          internalTitle: 'No attribution',
          originalQuote: 'They were great.',
          originalLocale: 'en',
          sourceReferences,
        } as never,
        draft: true,
        overrideAccess: false,
        user: editor as never,
      }),
    ).rejects.toThrow()
  })

  it('requires evidence for a project metric', async () => {
    await expect(
      payload.create({
        collection: 'projects',
        locale: 'fr',
        data: {
          title: `Métrique sans source ${run}`,
          client: clientId,
          sourceReferences,
          metrics: [{ value: '+45%', label: 'Croissance' }],
        } as never,
        draft: true,
        overrideAccess: false,
        user: editor as never,
      }),
    ).rejects.toThrow()
  })

  it('accepts a metric that cites a source', async () => {
    const doc = await payload.create({
      collection: 'projects',
      locale: 'fr',
      data: {
        title: `Métrique sourcée ${run}`,
        client: clientId,
        sourceReferences,
        metrics: [{ value: '+45%', label: 'Croissance', sourceNote: 'Rapport client 2025' }],
      } as never,
      draft: true,
      overrideAccess: false,
      user: editor as never,
    })

    expect(doc.metrics?.[0]?.value).toBe('+45%')
  })
})
