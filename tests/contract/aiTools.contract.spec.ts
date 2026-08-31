import { beforeAll, describe, expect, it } from 'vitest'
import type { Payload, PayloadRequest } from 'payload'
import { auditContent } from '@/services/content-ops/auditContent'
import { classifyProject } from '@/services/content-ops/classifyProject'
import { draftClient } from '@/services/content-ops/draftClient'
import { draftProject } from '@/services/content-ops/draftProject'
import { draftTestimonial } from '@/services/content-ops/draftTestimonial'
import { prepareSEO } from '@/services/content-ops/prepareSEO'
import { submitForReview } from '@/services/content-ops/submitForReview'
import { translateContent } from '@/services/content-ops/translateContent'
import { aiTools } from '@/mcp/tools'
import type { OperationContext } from '@/services/content-ops/types'
import { ensureUser, getTestPayload, requestFor, type TestUser } from '../helpers/payload'

/**
 * CLAUDE.md §130 — MCP contract. These exercise the content-operations
 * layer that every MCP tool handler delegates to, using a real ai_editor
 * user and real access control (overrideAccess: false), which is the same
 * path a bearer-authenticated MCP request takes once the plugin has
 * resolved the API key to that user.
 */
describe('AI tool contract', () => {
  let payload: Payload
  let aiEditor: TestUser
  let aiReq: PayloadRequest
  let anonReq: PayloadRequest
  let clientId: number

  const sourceReferences = [{ type: 'user_provided' as const, label: 'Client kickoff notes' }]

  const ctxFor = (req: PayloadRequest, tool: string): OperationContext => ({
    req,
    tool,
    correlationId: `test-${tool}-${Date.now()}`,
    provider: 'test',
    model: 'test-model',
  })

  beforeAll(async () => {
    payload = await getTestPayload()
    aiEditor = await ensureUser('ai_editor')
    aiReq = await requestFor(aiEditor)
    anonReq = await requestFor(null)
  })

  it('exposes exactly the eight required tools', () => {
    expect(aiTools.map((tool) => tool.name).sort()).toEqual(
      [
        'auditContent',
        'classifyProject',
        'draftClient',
        'draftProject',
        'draftTestimonial',
        'prepareSEO',
        'submitForReview',
        'translateContent',
      ].sort(),
    )
  })

  it('rejects an unauthenticated caller', async () => {
    const result = await draftClient(ctxFor(anonReq, 'draftClient'), {
      name: 'Anonymous Co',
      sourceReferences,
      locale: 'fr',
    })

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('forbidden')
  })

  it('rejects input that fails schema validation', async () => {
    const tool = aiTools.find((entry) => entry.name === 'draftClient')!
    const response = await tool.handler({ name: '' }, aiReq)
    const payloadJson = JSON.parse(response.content[0].text)

    expect(payloadJson.ok).toBe(false)
    expect(payloadJson.code).toBe('invalid_input')
  })

  it('drafts a client and records provenance', async () => {
    const result = await draftClient(ctxFor(aiReq, 'draftClient'), {
      name: `AI Client ${Date.now()}`,
      websiteURL: 'https://example.com',
      shortDescription: 'A description supplied by the operator.',
      industries: ['Retail'],
      sourceReferences,
      locale: 'fr',
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return

    clientId = result.data.id
    const doc = await payload.findByID({ collection: 'clients', id: clientId, draft: true, overrideAccess: true })

    expect(doc._status).toBe('draft')
    expect(doc.reviewStatus).toBe('ai_draft')
    expect(doc.aiMeta?.generatedByAI).toBe(true)
    expect(doc.aiMeta?.operation).toBe('draftClient')
    expect(doc.sourceReferences?.length).toBeGreaterThan(0)
  })

  it('writes an audit record for each operation', async () => {
    const logs = await payload.find({
      collection: 'ai-audit-logs',
      where: { tool: { equals: 'draftClient' } },
      sort: '-timestamp',
      limit: 1,
      overrideAccess: true,
    })

    expect(logs.totalDocs).toBeGreaterThan(0)
    expect(logs.docs[0].result).toBe('success')
    expect(logs.docs[0].correlationId).toBeTruthy()
  })

  it('reports ambiguity rather than merging clients', async () => {
    const name = `Ambiguous Co ${Date.now()}`
    for (let index = 0; index < 2; index += 1) {
      await payload.create({
        collection: 'clients',
        data: { name, sourceReferences },
        draft: true,
        overrideAccess: true,
        user: aiEditor as never,
      })
    }

    const result = await draftClient(ctxFor(aiReq, 'draftClient'), { name, sourceReferences, locale: 'fr' })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('ambiguous_match')
  })

  it('drops metrics with no source and records unknown taxonomy as suggestions', async () => {
    const result = await draftProject(ctxFor(aiReq, 'draftProject'), {
      clientId,
      title: `AI Project ${Date.now()}`,
      services: ['Branding', 'Totally Invented Service'],
      metrics: [
        { value: '+80%', label: 'Growth' },
        { value: '2.1M', label: 'Reach', sourceNote: 'Platform export' },
      ],
      sourceReferences,
      locale: 'fr',
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(result.data.droppedMetrics).toBe(1)
    expect(result.data.taxonomySuggestions).toContain('Totally Invented Service')

    const doc = await payload.findByID({ collection: 'projects', id: result.data.id, draft: true, overrideAccess: true })
    expect(doc._status).toBe('draft')
    expect(doc.metrics).toHaveLength(1)
    expect(doc.taxonomySuggestions?.some((entry) => entry.label === 'Totally Invented Service')).toBe(true)
  })

  it('never creates taxonomy for an unknown term', async () => {
    const before = await payload.count({ collection: 'context-tags', overrideAccess: true })

    await draftProject(ctxFor(aiReq, 'draftProject'), {
      clientId,
      title: `Taxonomy Test ${Date.now()}`,
      contextTags: ['Nonexistent Tag'],
      sourceReferences,
      locale: 'fr',
    })

    const after = await payload.count({ collection: 'context-tags', overrideAccess: true })
    expect(after.totalDocs).toBe(before.totalDocs)
  })

  it('requires a source and attribution on a testimonial', async () => {
    const noSource = await draftTestimonial(ctxFor(aiReq, 'draftTestimonial'), {
      internalTitle: 'Invalid',
      originalQuote: 'Great work.',
      originalLocale: 'en',
      personName: 'A. Person',
      sourceReferences: [],
    } as never)
    expect(noSource.ok).toBe(false)
  })

  it('preserves the original testimonial wording verbatim', async () => {
    const quote = 'They rebuilt our brand system in twelve weeks.'
    const result = await draftTestimonial(ctxFor(aiReq, 'draftTestimonial'), {
      internalTitle: `Testimonial ${Date.now()}`,
      originalQuote: quote,
      originalLocale: 'en',
      personName: 'Jordan Reyes',
      organizationName: 'Example Group',
      sourceReferences,
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return

    const doc = await payload.findByID({
      collection: 'testimonials',
      id: result.data.id,
      draft: true,
      overrideAccess: true,
    })
    expect(doc.originalQuote).toBe(quote)
    expect(doc.originalLocale).toBe('en')
    expect(doc._status).toBe('draft')
  })

  it('translates only whitelisted localized fields, leaving shared facts alone', async () => {
    const created = await draftProject(ctxFor(aiReq, 'draftProject'), {
      clientId,
      title: `Translatable ${Date.now()}`,
      year: 2024,
      sourceReferences,
      locale: 'fr',
    })
    expect(created.ok).toBe(true)
    if (!created.ok) return

    const result = await translateContent(ctxFor(aiReq, 'translateContent'), {
      collection: 'projects',
      documentId: created.data.id,
      sourceLocale: 'fr',
      targetLocale: 'es',
      translations: {
        title: 'Proyecto traducido',
        year: '1999',
        client: '99',
      },
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(result.data.translatedFields).toEqual(['title'])
    expect(result.data.rejectedFields).toEqual(expect.arrayContaining(['year', 'client']))

    const es = await payload.findByID({
      collection: 'projects',
      id: created.data.id,
      locale: 'es',
      draft: true,
      depth: 0,
      overrideAccess: true,
    })

    expect(es.title).toBe('Proyecto traducido')
    expect(es.year).toBe(2024)
    expect(es.client).toBe(clientId)
    expect(es.translationStatus?.esStatus).toBe('ai_draft')
  })

  it('prepares SEO without touching the canonical override', async () => {
    const created = await draftProject(ctxFor(aiReq, 'draftProject'), {
      clientId,
      title: `SEO Project ${Date.now()}`,
      sourceReferences,
      locale: 'fr',
    })
    expect(created.ok).toBe(true)
    if (!created.ok) return

    const result = await prepareSEO(ctxFor(aiReq, 'prepareSEO'), {
      collection: 'projects',
      documentId: created.data.id,
      locale: 'fr',
      title: 'Titre SEO',
      description: 'Description SEO',
      openGraphTitle: 'Titre OG',
    })

    expect(result.ok).toBe(true)

    const doc = await payload.findByID({
      collection: 'projects',
      id: created.data.id,
      locale: 'fr',
      draft: true,
      overrideAccess: true,
    })

    expect(doc.meta?.title).toBe('Titre SEO')
    expect(doc.meta?.openGraph?.title).toBe('Titre OG')
    expect(doc.meta?.canonicalOverride).toBeFalsy()
  })

  it('submits for review but can never approve', async () => {
    const created = await draftProject(ctxFor(aiReq, 'draftProject'), {
      clientId,
      title: `Review Project ${Date.now()}`,
      sourceReferences,
      locale: 'fr',
    })
    expect(created.ok).toBe(true)
    if (!created.ok) return

    const submitted = await submitForReview(ctxFor(aiReq, 'submitForReview'), {
      collection: 'projects',
      documentId: created.data.id,
    })
    expect(submitted.ok).toBe(true)

    const doc = await payload.findByID({
      collection: 'projects',
      id: created.data.id,
      draft: true,
      overrideAccess: true,
    })
    expect(doc.reviewStatus).toBe('needs_review')

    // Submitting again is idempotent, and approving is never available to AI.
    const again = await submitForReview(ctxFor(aiReq, 'submitForReview'), {
      collection: 'projects',
      documentId: created.data.id,
    })
    expect(again.ok).toBe(true)

    await expect(
      payload.update({
        collection: 'projects',
        id: created.data.id,
        data: { reviewStatus: 'approved' } as never,
        draft: true,
        overrideAccess: false,
        user: aiEditor as never,
      }),
    ).rejects.toThrow()
  })

  it('refuses to modify an approved document', async () => {
    const publisher = await ensureUser('publisher')
    const created = await draftProject(ctxFor(aiReq, 'draftProject'), {
      clientId,
      title: `Approved Project ${Date.now()}`,
      sourceReferences,
      locale: 'fr',
    })
    expect(created.ok).toBe(true)
    if (!created.ok) return

    await submitForReview(ctxFor(aiReq, 'submitForReview'), {
      collection: 'projects',
      documentId: created.data.id,
    })
    await payload.update({
      collection: 'projects',
      id: created.data.id,
      data: { reviewStatus: 'approved' } as never,
      draft: true,
      overrideAccess: true,
      user: publisher as never,
    })

    const result = await classifyProject(ctxFor(aiReq, 'classifyProject'), {
      projectId: created.data.id,
      services: ['Branding'],
    })

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('conflict')
  })

  it('audits content read-only', async () => {
    const result = await auditContent(ctxFor(aiReq, 'auditContent'), { collection: 'projects', limit: 5 })
    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(Array.isArray(result.data.documents)).toBe(true)
    for (const doc of result.data.documents) {
      expect(doc).toHaveProperty('missing')
      expect(doc).toHaveProperty('translations')
    }
  })
})
