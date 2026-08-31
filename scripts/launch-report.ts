import 'dotenv/config'
import { getPayload, type Payload } from 'payload'
import config from '../src/payload.config'
import { locales, localeNames, translationStatusKey, type Locale } from '../src/i18n/locale'
import { APPROVE_AND_PUBLISH } from '../src/hooks/enforceEditorialWorkflow'

/**
 * Launch report (CLAUDE.md §110) — every publishable document × locale, and
 * what is stopping it going live.
 *
 * Read-only by default. With --approve-and-publish it drives the same guard
 * path the Admin UI uses: one payload.update per document, as a real user,
 * with overrideAccess:false, so every document gets its own authorization
 * decision and a partial failure is reported rather than swallowed.
 *
 *   pnpm run launch:report
 *   pnpm run launch:report -- --blocked-by=review
 *   pnpm run launch:report -- --json
 *   pnpm run launch:report -- --as=you@example.com --approve-and-publish
 */
const COLLECTIONS = ['services', 'industries', 'clients', 'projects', 'testimonials'] as const
const GLOBALS = ['home-page', 'services-page', 'work-page', 'company-page', 'contact-page'] as const

type Blocker = 'none' | 'unpublished' | 'review' | 'translation'

type Row = {
  entity: string
  kind: 'collection' | 'global'
  id: number | null
  label: string
  locale: Locale
  status: string
  reviewStatus: string
  translationStatus: string
  dirty: boolean
  blocker: Blocker
  detail: string
}

type Doc = {
  id?: number
  title?: string | null
  name?: string | null
  internalTitle?: string | null
  _status?: string | null
  reviewStatus?: string | null
  translationStatus?: Record<string, string | null | undefined> | null
  dirtyLocales?: string[] | null
}

function classify(doc: Doc, locale: Locale): { blocker: Blocker; detail: string } {
  const translation = doc.translationStatus?.[translationStatusKey(locale)] ?? 'missing'
  const dirty = (doc.dirtyLocales ?? []).includes(locale)

  if (translation !== 'approved') {
    return {
      blocker: 'translation',
      detail: `${localeNames[locale]} translation is “${translation}”`,
    }
  }
  if (doc.reviewStatus !== 'approved') {
    return { blocker: 'review', detail: `editorial stage is “${doc.reviewStatus ?? 'not set'}”` }
  }
  if (doc._status !== 'published') {
    return { blocker: 'unpublished', detail: dirty ? 'approved, awaiting publish' : 'never published' }
  }
  return { blocker: 'none', detail: 'live' }
}

function toRows(entity: string, kind: Row['kind'], doc: Doc): Row[] {
  const label = doc.title ?? doc.name ?? doc.internalTitle ?? (doc.id ? `#${doc.id}` : entity)

  return locales.map((locale) => {
    const { blocker, detail } = classify(doc, locale)
    return {
      entity,
      kind,
      id: doc.id ?? null,
      label,
      locale,
      status: doc._status ?? 'draft',
      reviewStatus: doc.reviewStatus ?? 'not set',
      translationStatus: doc.translationStatus?.[translationStatusKey(locale)] ?? 'missing',
      dirty: (doc.dirtyLocales ?? []).includes(locale),
      blocker,
      detail,
    }
  })
}

async function collectRows(payload: Payload): Promise<Row[]> {
  const rows: Row[] = []

  for (const collection of COLLECTIONS) {
    const result = await payload.find({
      collection,
      draft: true,
      depth: 0,
      limit: 1000,
      overrideAccess: true,
    })
    for (const doc of result.docs as Doc[]) rows.push(...toRows(collection, 'collection', doc))
  }

  for (const slug of GLOBALS) {
    const doc = (await payload.findGlobal({ slug, draft: true, depth: 0, overrideAccess: true })) as Doc
    rows.push(...toRows(slug, 'global', doc))
  }

  return rows
}

function printTable(rows: Row[]) {
  const width = (pick: (row: Row) => string, min: number) =>
    Math.max(min, ...rows.map((row) => pick(row).length))
  const entityWidth = width((row) => row.entity, 8)
  const labelWidth = Math.min(38, width((row) => row.label, 6))

  let current = ''
  for (const row of rows) {
    if (row.entity !== current) {
      current = row.entity
      console.log(`\n${row.entity.toUpperCase()}`)
    }
    const label = row.label.length > labelWidth ? `${row.label.slice(0, labelWidth - 1)}…` : row.label
    const mark = row.blocker === 'none' ? '●' : '○'
    console.log(
      `  ${mark} ${label.padEnd(labelWidth)} ${row.locale.toUpperCase()}  ` +
        `${row.status.padEnd(9)} ${row.reviewStatus.padEnd(18)} ${row.translationStatus.padEnd(12)}` +
        `${row.dirty ? ' dirty' : '     '}  ${row.detail}`,
    )
  }
  console.log(`\n${'-'.repeat(entityWidth + 60)}`)
}

function summarize(rows: Row[]) {
  const counts = rows.reduce<Record<Blocker, number>>(
    (accumulator, row) => {
      accumulator[row.blocker] += 1
      return accumulator
    },
    { none: 0, unpublished: 0, review: 0, translation: 0 },
  )

  console.log(
    `${rows.length} document×locale — live ${counts.none}, ` +
      `blocked on translation ${counts.translation}, on review ${counts.review}, ` +
      `approved but unpublished ${counts.unpublished}`,
  )
}

/** One update per document, through the same guard the Admin UI hits. */
async function approveAndPublish(payload: Payload, rows: Row[], actorEmail: string) {
  const users = await payload.find({
    collection: 'users',
    where: { email: { equals: actorEmail } },
    limit: 1,
    overrideAccess: true,
  })
  const actor = users.docs[0]
  if (!actor) throw new Error(`No user with email ${actorEmail}`)

  // One entry per document, not per locale: publishing is a document-level act.
  const targets = new Map<string, Row>()
  for (const row of rows) {
    if (row.blocker === 'none') continue
    targets.set(`${row.entity}:${row.id ?? 'global'}`, row)
  }

  console.log(`\nApproving and publishing ${targets.size} document(s) as ${actorEmail} (role: ${actor.role})\n`)

  let succeeded = 0
  let failed = 0

  for (const target of targets.values()) {
    const name = `${target.entity}${target.id ? ` #${target.id}` : ''} — ${target.label}`
    try {
      if (target.kind === 'global') {
        await payload.updateGlobal({
          slug: target.entity as (typeof GLOBALS)[number],
          data: { _status: 'published', [APPROVE_AND_PUBLISH]: true } as never,
          overrideAccess: false,
          user: actor as never,
        })
      } else {
        await payload.update({
          collection: target.entity as (typeof COLLECTIONS)[number],
          id: target.id as number,
          data: { _status: 'published', [APPROVE_AND_PUBLISH]: true } as never,
          overrideAccess: false,
          user: actor as never,
        })
      }
      succeeded += 1
      console.log(`  ✓ ${name}`)
    } catch (error) {
      failed += 1
      console.log(`  ✗ ${name} — ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  console.log(`\n${succeeded} published, ${failed} refused.`)
  if (failed > 0) process.exitCode = 1
}

async function main() {
  const args = process.argv.slice(2)
  const flag = (name: string) => args.find((entry) => entry.startsWith(`--${name}=`))?.split('=')[1]
  const blockedBy = flag('blocked-by') as Blocker | undefined
  const actorEmail = flag('as')
  const wantsJSON = args.includes('--json')
  const wantsPublish = args.includes('--approve-and-publish')

  const payload = await getPayload({ config })
  const all = await collectRows(payload)
  const rows = blockedBy ? all.filter((row) => row.blocker === blockedBy) : all

  if (wantsJSON) {
    console.log(JSON.stringify(rows, null, 2))
  } else {
    printTable(rows)
    summarize(rows)
  }

  if (wantsPublish) {
    if (!actorEmail) throw new Error('--approve-and-publish requires --as=<publisher or admin email>')
    await approveAndPublish(payload, rows, actorEmail)
  }

  process.exit(process.exitCode ?? 0)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
