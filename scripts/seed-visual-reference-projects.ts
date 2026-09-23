import 'dotenv/config'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '../src/payload.config'
import { locales, translationStatusKey } from '../src/i18n/locale'

/**
 * Real, source-backed content for the visual-regression baselines.
 *
 * This is deliberately NOT `seed-e2e.ts`. The two serve different purposes and
 * must not be merged again:
 *
 *   seed-e2e.ts                  technical fixture. Synthetic and isolated.
 *                                Route mechanics, /work/e2e-case-study,
 *                                localization behaviour. Never public-facing.
 *
 *   seed-visual-reference-*.ts   visual reference. Real projects only, so a
 *                                baseline photographs the composition the
 *                                public will actually see.
 *
 * Featuring the synthetic fixture was tried in 9e265d8 and reverted: it put an
 * invented client into two public proof sections and twelve baselines.
 *
 * SCOPE, and why it is this narrow
 *
 * Three projects are reproduced — OgloNuts, AMSD, AJM — and only the fields
 * the owner approved as safe to use as-is: title, shortStatement, excerpt,
 * client name, and a numeric year where the source carries one.
 *
 * Deliberately NOT copied, and not to be added without a separate decision:
 *
 *   metrics       every metric in these three records is self-attested to
 *                 "Historique de travail Global Comm" or a personal CV. AJM's
 *                 also puts a date range in a numeric metric slot. CLAUDE.md
 *                 §36 and §105 require evidence for a public number.
 *   media         none of the three carries hero, featured or gallery media.
 *                 Cards render without an image rather than with a stand-in.
 *   narrative     challenge / approach / deliverables / outcome / resultsNote
 *                 exist in the source but were not part of the approved set,
 *                 and Selected Work does not read them.
 *
 * The source records in scripts/project-import-data.json are NOT modified.
 * They keep `_status: draft` and `reviewStatus: needs_review`. This script
 * writes approved, published copies into a CI database only.
 *
 * WIRING, and why it protects the home baselines
 *
 * The projects are created with `featured: false` and attached explicitly to
 * `services-page.featuredProjects`. The home page reads its own global and
 * otherwise falls back to `getFeaturedProjects`, which filters on `featured`.
 * Leaving the flag false means the home page still finds nothing, so the
 * approved locked home baselines stay exactly as they are. Covering the home
 * page's Selected Work is a separate decision, because it necessarily changes
 * those baselines.
 */

if (process.env.CI !== 'true' && process.env.E2E_FIXTURE_SEED !== 'true') {
  throw new Error(
    'Refusing to seed visual reference content outside CI. Set E2E_FIXTURE_SEED=true to opt in explicitly.',
  )
}

/** Slugs the owner approved, in the order Selected Work should show them. */
const APPROVED_FR_SLUGS = [
  'oglonuts-plateforme-marque-ecosysteme-b2b',
  'amsd-communication-institutionnelle-integree',
  'ajm-presence-digitale-communication-interculturelle',
] as const

type Localized = Partial<Record<(typeof locales)[number], string>>

type SourceProject = {
  title: Localized
  slug: Localized
  excerpt?: Localized
  shortStatement?: Localized
  client?: string
  year?: unknown
  sourceReferences?: Array<Record<string, unknown>>
}

type AdminActor = { id: number; email: string; role: 'admin'; collection: 'users' }

const translationStatus = Object.fromEntries(
  locales.map((locale) => [translationStatusKey(locale), 'approved']),
)

const editorialState = {
  reviewStatus: 'approved' as const,
  translationStatus,
  dirtyLocales: [],
  _status: 'published' as const,
}

async function resolveActor(payload: Payload): Promise<AdminActor> {
  const admins = await payload.find({
    collection: 'users',
    where: { role: { equals: 'admin' } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const existing = admins.docs[0]
  if (existing) {
    return { id: existing.id, email: existing.email, role: 'admin', collection: 'users' }
  }

  return { id: 0, email: 'visual-reference@local', role: 'admin', collection: 'users' }
}

/**
 * Payload's `year` is numeric. OgloNuts records "2025-2026", which the project
 * importer already warns about and drops. A range is not a year, so it is left
 * empty rather than silently narrowed to one end of it.
 */
function numericYear(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isInteger(value)) return value
  if (typeof value === 'string' && /^\d{4}$/.test(value.trim())) return Number(value.trim())
  return undefined
}

function loadApproved(): SourceProject[] {
  const here = dirname(fileURLToPath(import.meta.url))
  const raw = JSON.parse(
    readFileSync(join(here, 'project-import-data.json'), 'utf8'),
  ) as SourceProject[]

  return APPROVED_FR_SLUGS.map((slug) => {
    const found = raw.find((project) => project.slug?.fr === slug)
    if (!found) {
      throw new Error(
        `Approved project "${slug}" is missing from project-import-data.json. ` +
          'The fixture reproduces owner-approved records only and will not invent one.',
      )
    }
    return found
  })
}

async function upsertClient(payload: Payload, actor: AdminActor, name: string): Promise<number> {
  const existing = await payload.find({
    collection: 'clients',
    where: { name: { equals: name } },
    limit: 1,
    depth: 0,
    draft: true,
    overrideAccess: true,
  })

  if (existing.docs[0]) return existing.docs[0].id as number

  const created = await payload.create({
    collection: 'clients',
    locale: 'fr',
    draft: false,
    overrideAccess: true,
    user: actor,
    data: {
      name,
      // Not featured: the client band already falls back to published clients,
      // and featuring these would change what the home page shows.
      featured: false,
      displayOrder: 100,
      ...editorialState,
    } as never,
  })

  return created.id as number
}

async function upsertProject(
  payload: Payload,
  actor: AdminActor,
  source: SourceProject,
  clientId: number,
  displayOrder: number,
): Promise<number> {
  const frSlug = source.slug.fr as string
  const year = numericYear(source.year)

  const existing = await payload.find({
    collection: 'projects',
    locale: 'fr',
    fallbackLocale: false,
    where: { slug: { equals: frSlug } },
    limit: 1,
    depth: 0,
    draft: true,
    overrideAccess: true,
  })

  const base = {
    client: clientId,
    // Left false on purpose — see the wiring note at the top of this file.
    featured: false,
    displayOrder,
    ...(year === undefined ? {} : { year }),
    ...(source.sourceReferences ? { sourceReferences: source.sourceReferences } : {}),
    ...editorialState,
  }

  const id =
    (existing.docs[0]?.id as number | undefined) ??
    ((
      await payload.create({
        collection: 'projects',
        locale: 'fr',
        draft: false,
        overrideAccess: true,
        user: actor,
        data: {
          title: source.title.fr,
          slug: frSlug,
          shortStatement: source.shortStatement?.fr,
          excerpt: source.excerpt?.fr,
          ...base,
        } as never,
      })
    ).id as number)

  // Each locale carries its own approved title, slug and copy; nothing falls
  // back across languages (CLAUDE.md §14).
  for (const locale of locales) {
    await payload.update({
      collection: 'projects',
      id,
      locale,
      draft: false,
      overrideAccess: true,
      user: actor,
      data: {
        title: source.title[locale],
        slug: source.slug[locale],
        shortStatement: source.shortStatement?.[locale],
        excerpt: source.excerpt?.[locale],
        ...base,
      } as never,
    })
  }

  return id
}

async function main() {
  const payload = await getPayload({ config })
  const actor = await resolveActor(payload)

  const ids: number[] = []

  for (const [index, source] of loadApproved().entries()) {
    const clientName = source.client
    if (!clientName) {
      throw new Error(`Approved project "${source.slug.fr}" has no client name in the source data.`)
    }

    const clientId = await upsertClient(payload, actor, clientName)
    const projectId = await upsertProject(payload, actor, source, clientId, index + 1)
    ids.push(projectId)

    console.log(`✓ ${clientName} — project=${projectId} client=${clientId}`)
  }

  // Explicit selection rather than the `featured` fallback, so what the
  // baseline photographs is stated here instead of emerging from a flag.
  await payload.updateGlobal({
    slug: 'services-page',
    draft: false,
    overrideAccess: true,
    user: actor,
    data: { featuredProjects: ids } as never,
  })

  console.log(`✓ services-page.featuredProjects = [${ids.join(', ')}]`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
