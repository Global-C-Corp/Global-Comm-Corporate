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
 * This is the only seed that creates projects and clients, and every record it
 * writes is a reproduction of an owner-approved entry in
 * scripts/project-import-data.json. There is deliberately no synthetic
 * alternative: a fixture project and client used to exist for E2E route
 * mechanics, and the attempt to make them serve the baselines too (9e265d8)
 * put an invented client into two public proof sections and twelve snapshots.
 * They were removed rather than hidden. Nothing here may be replaced with a
 * fabricated project or client to make a page look fuller.
 *
 * The E2E suite's project-detail coverage rides on these same records, by
 * localized slug — see tests/e2e/visual-baseline.spec.ts.
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
 * WIRING
 *
 * The three projects and their clients are created with `featured: true`.
 *
 * They used to be left unfeatured and attached to `services-page`
 * .featuredProjects instead, for two reasons that have both gone away: the
 * page globals are no longer read by any public route, and the synthetic
 * fixture record that made a published-client fallback unsafe no longer
 * exists. `featured` is now the one selection mechanism, and every record it
 * selects is real and owner-approved.
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
      // Featured: the reference bands on the homepage and the services page
      // select on this flag now that no page global is read at runtime.
      featured: true,
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
    // Featured: see the wiring note at the top of this file.
    featured: true,
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

  const projectIds: number[] = []
  const clientIds: number[] = []

  for (const [index, source] of loadApproved().entries()) {
    const clientName = source.client
    if (!clientName) {
      throw new Error(`Approved project "${source.slug.fr}" has no client name in the source data.`)
    }

    const clientId = await upsertClient(payload, actor, clientName)
    const projectId = await upsertProject(payload, actor, source, clientId, index + 1)
    projectIds.push(projectId)
    clientIds.push(clientId)

    console.log(`✓ ${clientName} — project=${projectId} client=${clientId}`)
  }

  console.log(`✓ featured projects = [${projectIds.join(', ')}]`)
  console.log(`✓ featured clients  = [${clientIds.join(', ')}]`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
