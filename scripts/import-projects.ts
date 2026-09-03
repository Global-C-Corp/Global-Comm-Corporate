import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '../src/payload.config'
import { locales, translationStatusKey, type Locale } from '../src/i18n/locale'

type Localized<T> = { fr: T; en: T; es: T }

type Metric = {
  value?: string
  label: Localized<string>
  sourceNote?: string
}

type SourceReference = {
  type: 'user_provided' | 'uploaded_document' | 'existing_cms' | 'public_url' | 'human_verified'
  label: string
  url?: string
  note?: string
  capturedAt?: string
}

type ProjectSource = {
  _sourceProjectNumber: number
  _sourceHeading: string
  title: Localized<string>
  slug: Localized<string>
  client: string
  year?: string | number
  location?: string
  externalURL?: string
  featured?: boolean
  displayOrder?: number
  shortStatement?: Localized<string>
  excerpt?: Localized<string>
  services?: string[]
  industries?: string[]
  projectTypes?: string[]
  contextTags?: string[]
  taxonomySuggestions?: Array<string | { label: string }>
  challenge?: Localized<string>
  approach?: Localized<string>
  deliverables?: Localized<string[] | string>
  outcome?: Localized<string>
  resultsNote?: Localized<string>
  metrics?: Metric[]
  sourceReferences?: SourceReference[]
  aiMeta?: Record<string, unknown>
  seo_fr?: { title?: string; description?: string; noIndex?: boolean; noFollow?: boolean }
  seo_en?: { title?: string; description?: string; noIndex?: boolean; noFollow?: boolean }
  seo_es?: { title?: string; description?: string; noIndex?: boolean; noFollow?: boolean }
  openGraph?: Localized<{ title?: string; description?: string; image?: string }>
  translationStatus?: Localized<string>
  dirtyLocales?: string[]
  reviewStatus?: string
  _status?: string
}

type Actor = {
  id: number | string
  email: string
  role: 'admin'
  collection: 'users'
}

const APPROVE_AND_PUBLISH = '_approveAndPublish'

const APPLY = process.argv.includes('--apply')
const FORCE_PUBLISH_ALL = process.argv.includes('--publish-all')

/**
 * These records explicitly say their scope/deliverables/results still need
 * documentation. They stay draft unless --publish-all is deliberately passed.
 */
const DRAFT_ONLY_SOURCE_PROJECTS = new Set([2, 3, 13, 16, 17, 20])

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

function richTextFromParagraphs(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: null,
      children: paragraphs
        .map((text) => text.trim())
        .filter(Boolean)
        .map((text) => ({
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: null,
          textFormat: 0,
          textStyle: '',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text,
              version: 1,
            },
          ],
        })),
    },
  }
}

function richTextFromText(value?: string) {
  if (!value?.trim()) return undefined
  const paragraphs = value
    .split(/\n\s*\n/g)
    .map((part) => part.trim())
    .filter(Boolean)
  return richTextFromParagraphs(paragraphs)
}

function richTextFromDeliverables(value?: string[] | string) {
  if (!value) return undefined
  const items = Array.isArray(value) ? value : [value]
  return richTextFromParagraphs(items.map((item) => `• ${item}`))
}

function exactYear(value?: string | number): number | undefined {
  if (typeof value === 'number' && Number.isInteger(value)) return value
  if (typeof value === 'string' && /^\d{4}$/.test(value.trim())) return Number(value.trim())
  return undefined
}

function translationNeedsReview() {
  return Object.fromEntries(locales.map((locale) => [translationStatusKey(locale), 'needs_review']))
}

function sourceTaxonomySuggestions(source: ProjectSource) {
  return (source.taxonomySuggestions ?? [])
    .map((entry) => (typeof entry === 'string' ? { label: entry } : entry))
    .filter((entry) => Boolean(entry?.label))
}

function normalizeAIMeta(source?: Record<string, unknown>) {
  if (!source) return undefined
  const { actorUser: _actorUser, targetLocale: _targetLocale, ...rest } = source

  // actorUser is a Payload users relationship, while the source carries a name.
  // targetLocale is a single select, while the source may carry "en,es".
  return {
    ...rest,
    generatedByAI: Boolean(source.generatedByAI),
  }
}

function seoFor(source: ProjectSource, locale: Locale) {
  return source[`seo_${locale}` as keyof ProjectSource] as
    { title?: string; description?: string; noIndex?: boolean; noFollow?: boolean } | undefined
}

async function loadSource(): Promise<ProjectSource[]> {
  const file = path.join(dirname, 'project-import-data.json')
  return JSON.parse(await readFile(file, 'utf8')) as ProjectSource[]
}

async function resolveAdmin(payload: Payload): Promise<Actor> {
  const admins = await payload.find({
    collection: 'users',
    where: { role: { equals: 'admin' } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const admin = admins.docs[0]
  if (!admin) {
    throw new Error(
      'No Payload admin user exists. Create an admin account in Payload Admin before running the importer.',
    )
  }

  return {
    id: admin.id,
    email: admin.email,
    role: 'admin',
    collection: 'users',
  }
}

async function findClient(payload: Payload, name: string) {
  const result = await payload.find({
    collection: 'clients',
    where: { name: { equals: name } },
    limit: 1,
    depth: 0,
    draft: true,
    overrideAccess: true,
  })
  return result.docs[0] ?? null
}

async function ensureClient(payload: Payload, actor: Actor, name: string, shouldPublish: boolean) {
  const existing = await findClient(payload, name)

  if (!APPLY) {
    return {
      id: existing?.id ?? null,
      status: existing ? 'existing' : 'would-create',
      published: existing?._status === 'published',
    }
  }

  let client = existing
  if (!client) {
    client = await payload.create({
      collection: 'clients',
      locale: 'fr',
      draft: true,
      overrideAccess: true,
      user: actor,
      data: {
        name,
        reviewStatus: 'needs_review',
        translationStatus: translationNeedsReview(),
        sourceReferences: [
          {
            type: 'user_provided',
            label: 'GLOBAL_COMM_PROJECT_CONTENT_FILLED.md',
            note: `Client name imported from project source: ${name}`,
            capturedAt: new Date().toISOString(),
          },
        ],
      } as any,
    })
  }

  if (shouldPublish && client._status !== 'published') {
    client = await payload.update({
      collection: 'clients',
      id: client.id,
      data: {
        _status: 'published',
        [APPROVE_AND_PUBLISH]: true,
      } as never,
      overrideAccess: false,
      user: actor as never,
    })
  }

  return {
    id: client.id,
    status: existing ? 'existing' : 'created',
    published: client._status === 'published',
  }
}

const taxonomyCollections = {
  services: 'services',
  industries: 'industries',
  projectTypes: 'project-types',
  contextTags: 'context-tags',
} as const

async function resolveTerms(
  payload: Payload,
  collection: (typeof taxonomyCollections)[keyof typeof taxonomyCollections],
  names: string[],
) {
  const ids: Array<number | string> = []
  const missing: string[] = []

  for (const name of names) {
    const result = await payload.find({
      collection,
      where: { name: { equals: name } },
      locale: 'en',
      limit: 1,
      depth: 0,
      draft: true,
      overrideAccess: true,
    })

    const doc = result.docs[0]
    if (doc) ids.push(doc.id)
    else missing.push(name)
  }

  return { ids, missing }
}

async function findProjectByFrenchSlug(payload: Payload, slug: string) {
  const result = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    locale: 'fr',
    limit: 1,
    depth: 0,
    draft: true,
    overrideAccess: true,
  })
  return result.docs[0] ?? null
}

function localizedProjectData(
  source: ProjectSource,
  locale: Locale,
  metricRows?: Array<{ id?: string | number }>,
) {
  const seo = seoFor(source, locale)
  const metricData = (source.metrics ?? []).map((metric, index) => ({
    ...(metricRows?.[index]?.id ? { id: metricRows[index].id } : {}),
    value: metric.value ?? '',
    label: metric.label?.[locale] ?? '',
    sourceNote: metric.sourceNote ?? '',
  }))

  const data: Record<string, unknown> = {
    title: source.title[locale],
    slug: source.slug[locale],
    shortStatement: source.shortStatement?.[locale] ?? '',
    excerpt: source.excerpt?.[locale] ?? '',
    challenge: richTextFromText(source.challenge?.[locale]),
    approach: richTextFromText(source.approach?.[locale]),
    deliverables: richTextFromDeliverables(source.deliverables?.[locale]),
    outcome: richTextFromText(source.outcome?.[locale]),
    resultsNote: source.resultsNote?.[locale] ?? '',
    metrics: metricData,
    meta: {
      title: seo?.title ?? '',
      description: seo?.description ?? '',
    },
    openGraph: {
      title: source.openGraph?.[locale]?.title ?? '',
      description: source.openGraph?.[locale]?.description ?? '',
    },
  }

  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined))
}

async function importOne(payload: Payload, actor: Actor, source: ProjectSource) {
  const warnings: string[] = []
  let shouldPublish =
    FORCE_PUBLISH_ALL || !DRAFT_ONLY_SOURCE_PROJECTS.has(source._sourceProjectNumber)

  const year = exactYear(source.year)
  if (source.year && year === undefined) {
    warnings.push(
      `year "${source.year}" is a range/non-numeric value; Payload year is numeric, so year is left empty`,
    )
  }

  const [services, industries, projectTypes, contextTags] = await Promise.all([
    resolveTerms(payload, 'services', source.services ?? []),
    resolveTerms(payload, 'industries', source.industries ?? []),
    resolveTerms(payload, 'project-types', source.projectTypes ?? []),
    resolveTerms(payload, 'context-tags', source.contextTags ?? []),
  ])

  const missingTaxonomy = [
    ...services.missing.map((name) => `service:${name}`),
    ...industries.missing.map((name) => `industry:${name}`),
    ...projectTypes.missing.map((name) => `projectType:${name}`),
    ...contextTags.missing.map((name) => `contextTag:${name}`),
  ]

  if (missingTaxonomy.length) {
    warnings.push(`missing controlled taxonomy: ${missingTaxonomy.join(', ')}`)
    shouldPublish = false
  }

  const client = await ensureClient(payload, actor, source.client, shouldPublish)
  const existing = await findProjectByFrenchSlug(payload, source.slug.fr)

  if (!APPLY) {
    return {
      number: source._sourceProjectNumber,
      title: source.title.fr,
      action: existing ? 'would-update' : 'would-create',
      client: client.status,
      publish: shouldPublish,
      warnings,
    }
  }

  const commonData = {
    client: client.id,
    ...(year !== undefined ? { year } : {}),
    location: source.location ?? '',
    externalURL: source.externalURL ?? '',
    featured: Boolean(source.featured),
    displayOrder: source.displayOrder ?? 0,
    services: services.ids,
    industries: industries.ids,
    projectTypes: projectTypes.ids,
    contextTags: contextTags.ids,
    taxonomySuggestions: [
      ...sourceTaxonomySuggestions(source),
      ...missingTaxonomy.map((label) => ({ label })),
    ],
    sourceReferences: source.sourceReferences ?? [],
    aiMeta: normalizeAIMeta(source.aiMeta),
    reviewStatus: 'needs_review',
    translationStatus: translationNeedsReview(),
    robots: {
      noIndex: seoFor(source, 'fr')?.noIndex ?? true,
      noFollow: seoFor(source, 'fr')?.noFollow ?? false,
    },
  }

  let project = existing
    ? await payload.update({
        collection: 'projects',
        id: existing.id,
        locale: 'fr',
        draft: true,
        overrideAccess: true,
        user: actor,
        data: {
          ...commonData,
          ...localizedProjectData(source, 'fr', (existing.metrics ?? []) as any),
        } as any,
      })
    : await payload.create({
        collection: 'projects',
        locale: 'fr',
        draft: true,
        overrideAccess: true,
        user: actor,
        data: {
          ...commonData,
          ...localizedProjectData(source, 'fr'),
        } as any,
      })

  // Fetch after FR save so localized array rows (metrics) have stable IDs.
  project = await payload.findByID({
    collection: 'projects',
    id: project.id,
    locale: 'fr',
    draft: true,
    depth: 0,
    overrideAccess: true,
    user: actor,
  })

  for (const locale of locales.filter((entry) => entry !== 'fr')) {
    await payload.update({
      collection: 'projects',
      id: project.id,
      locale,
      draft: true,
      overrideAccess: true,
      user: actor,
      data: localizedProjectData(source, locale, (project.metrics ?? []) as any) as any,
    })
  }

  if (shouldPublish) {
    project = await payload.update({
      collection: 'projects',
      id: project.id,
      data: {
        _status: 'published',
        [APPROVE_AND_PUBLISH]: true,
      } as never,
      overrideAccess: false,
      user: actor as never,
    })
  }

  return {
    number: source._sourceProjectNumber,
    title: source.title.fr,
    action: existing ? 'updated' : 'created',
    client: client.status,
    publish: project._status === 'published',
    warnings,
  }
}

async function main() {
  console.log('Importer startup: loading Payload...')
  const payload = await getPayload({ config })
  console.log('Importer startup: Payload ready.')
  const actor = await resolveAdmin(payload)
  const source = await loadSource()

  console.log(`Mode: ${APPLY ? 'APPLY' : 'DRY RUN'}`)
  console.log(`Projects detected: ${source.length}`)
  console.log(
    FORCE_PUBLISH_ALL
      ? 'Publication rule: force publish all records'
      : `Publication rule: publish complete records; keep source projects ${[...DRAFT_ONLY_SOURCE_PROJECTS].join(', ')} as drafts`,
  )

  const results = []
  for (const project of source) {
    const result = await importOne(payload, actor, project)
    results.push(result)
    const state = result.publish ? 'PUBLISH' : 'DRAFT'
    console.log(
      `${String(result.number).padStart(2, '0')}  ${state.padEnd(7)}  ${result.action.padEnd(12)}  ${result.title}`,
    )
    for (const warning of result.warnings) console.log(`    ⚠ ${warning}`)
  }

  const published = results.filter((r) => r.publish).length
  const drafts = results.length - published
  const warned = results.filter((r) => r.warnings.length > 0).length

  console.log('')
  console.log(
    `Done. total=${results.length} published=${published} drafts=${drafts} warnings=${warned}`,
  )
  if (!APPLY) {
    console.log('No database writes were performed.')
    console.log('Run again with --apply to import.')
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
