import 'dotenv/config'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '../src/payload.config'
import { locales, type Locale } from '../src/i18n/locale'
import { PILLARS, currentPillarConfig, pillarKeyForFrSlug } from '../src/services/cms/pillarConfig'
import { resolvePillarAssignments, type ServiceNode } from '../src/services/cms/servicePillars'
import { buildPath } from '../src/services/seo/urls'

/**
 * Generates concrete Redirect documents for every URL the consolidation
 * removes (CLAUDE.md §70).
 *
 * Deliberately materialised rather than computed at request time: a 301 is a
 * long-lived promise to search engines and it should be reviewable data an
 * editor can inspect and correct, not a function of whatever the taxonomy
 * happens to say on the next render.
 *
 * Three sources, all derived from the same pillar resolver used to assign the
 * grouping, so a term's bucket and its redirect target cannot disagree:
 *
 *   1. every folded service  -> its pillar's page, per locale
 *   2. every industry        -> the work archive, per locale
 *   3. every renamed pillar  -> its own new URL, per locale
 *
 * The run aborts before writing anything if a service that is not a pillar has
 * no `foldedInto`, naming every offending term. Emitting a partial set would
 * leave live URLs pointing at nothing while looking like success.
 *
 * Dry run by default. Pass --apply to write.
 */

const APPLY = process.argv.includes('--apply')

/** Committed so every generated 301 is reviewable in the pull request diff. */
const MANIFEST_PATH = 'tests/fixtures/redirects.json'

type AdminActor = { id: number; email: string; role: 'admin'; collection: 'users' }

type LocalizedDoc = { id: number; slugs: Record<Locale, string>; name: string }

export type RedirectPlan = {
  from: string
  to: string
  reason: 'folded-service' | 'industry' | 'pillar-renamed'
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
  if (existing) return { id: existing.id, email: existing.email, role: 'admin', collection: 'users' }
  return { id: 0, email: 'redirects@local', role: 'admin', collection: 'users' }
}

const idOf = (value: unknown): number | null => {
  if (value === null || value === undefined) return null
  if (typeof value === 'object' && 'id' in (value as Record<string, unknown>)) {
    return Number((value as { id: number }).id)
  }
  return Number(value)
}

/** Reads a collection once per locale so every localized slug is available. */
async function loadLocalized(
  payload: Payload,
  collection: 'services' | 'industries',
): Promise<Map<number, LocalizedDoc>> {
  const byId = new Map<number, LocalizedDoc>()

  for (const locale of locales) {
    const result = await payload.find({
      collection,
      locale,
      fallbackLocale: false,
      limit: 1000,
      depth: 0,
      draft: false,
      overrideAccess: true,
    })

    for (const doc of result.docs) {
      const id = Number(doc.id)
      const entry = byId.get(id) ?? { id, slugs: {} as Record<Locale, string>, name: '' }
      if (doc.slug) entry.slugs[locale] = String(doc.slug)
      if (locale === 'fr' && doc.name) entry.name = String(doc.name)
      byId.set(id, entry)
    }
  }

  return byId
}

async function main() {
  const payload = await getPayload({ config })
  const actor = await resolveActor(payload)

  const services = await loadLocalized(payload, 'services')
  const industries = await loadLocalized(payload, 'industries')

  // The grouping stored in Payload is authoritative; the resolver is used to
  // cross-check it, so a hand edit in Admin that contradicts the hierarchy is
  // surfaced rather than silently followed.
  const raw = await payload.find({
    collection: 'services',
    locale: 'fr',
    fallbackLocale: false,
    limit: 1000,
    depth: 0,
    draft: false,
    overrideAccess: true,
  })

  const nodes: ServiceNode[] = raw.docs.map((doc) => ({
    id: Number(doc.id),
    slug: String(doc.slug ?? ''),
    name: String(doc.name ?? ''),
    parentId: idOf(doc.parent),
  }))

  const stored = new Map(
    raw.docs.map((doc) => [
      Number(doc.id),
      { isPillar: Boolean(doc.isPillar), foldedInto: idOf(doc.foldedInto) },
    ]),
  )

  const { pillarSlugs, rootMerges } = currentPillarConfig(nodes.map((node) => node.slug))
  const { assignments, mismatches: resolverMismatches } = resolvePillarAssignments({
    nodes,
    pillarSlugs,
    rootMerges,
  })

  const errors: string[] = [...resolverMismatches]
  const plans: RedirectPlan[] = []

  // ---- 1. folded services --------------------------------------------------
  for (const node of nodes) {
    const state = stored.get(node.id)
    if (state?.isPillar) continue

    if (state?.foldedInto == null) {
      errors.push(`"${node.name}" (${node.slug}) is not a pillar and has no foldedInto — no redirect target`)
      continue
    }

    const target = services.get(state.foldedInto)
    if (!target) {
      errors.push(`"${node.name}" (${node.slug}) is folded into service ${state.foldedInto}, which was not found`)
      continue
    }

    const source = services.get(node.id)
    for (const locale of locales) {
      const fromSlug = source?.slugs[locale]
      const toSlug = target.slugs[locale]
      if (!fromSlug) {
        errors.push(`"${node.name}" has no ${locale.toUpperCase()} slug — its ${locale} URL cannot be redirected`)
        continue
      }
      if (!toSlug) {
        errors.push(`Pillar "${target.name}" has no ${locale.toUpperCase()} slug — cannot be a redirect target`)
        continue
      }
      plans.push({
        from: buildPath(locale, { type: 'service', slug: fromSlug }),
        to: buildPath(locale, { type: 'service', slug: toSlug }),
        reason: 'folded-service',
      })
    }
  }

  // ---- 2. industries -------------------------------------------------------
  for (const industry of industries.values()) {
    for (const locale of locales) {
      const slug = industry.slugs[locale]
      if (!slug) {
        errors.push(`Industry "${industry.name}" has no ${locale.toUpperCase()} slug — its URL cannot be redirected`)
        continue
      }
      plans.push({
        from: buildPath(locale, { type: 'industry', slug }),
        to: buildPath(locale, { type: 'work' }),
        reason: 'industry',
      })
    }
  }

  // ---- 3. renamed pillars --------------------------------------------------
  for (const assignment of assignments.filter((a) => a.role === 'pillar')) {
    const key = pillarKeyForFrSlug(assignment.node.slug)
    if (!key) {
      errors.push(`Pillar "${assignment.node.name}" (${assignment.node.slug}) is not in the pillar configuration`)
      continue
    }

    // Sourced from the recorded previous slugs, not from the document, so the
    // set stays the same whether or not the rename has already been applied.
    for (const locale of locales) {
      const oldSlug = PILLARS[key].previousSlugs[locale]
      const newSlug = PILLARS[key].slugs[locale]
      if (!oldSlug || oldSlug === newSlug) continue
      plans.push({
        from: buildPath(locale, { type: 'service', slug: oldSlug }),
        to: buildPath(locale, { type: 'service', slug: newSlug }),
        reason: 'pillar-renamed',
      })
    }
  }

  // A new pillar slug that collides with a term still using it would make one
  // of the two unreachable, so it is caught before anything is written.
  const targetSlugs = new Set<string>()
  for (const key of Object.keys(PILLARS)) {
    for (const locale of locales) targetSlugs.add(`${locale}:${PILLARS[key].slugs[locale]}`)
  }
  for (const node of nodes) {
    if (stored.get(node.id)?.isPillar) continue
    const doc = services.get(node.id)
    for (const locale of locales) {
      const slug = doc?.slugs[locale]
      if (slug && targetSlugs.has(`${locale}:${slug}`)) {
        errors.push(`"${node.name}" already uses ${locale.toUpperCase()} slug "${slug}", which a pillar is being renamed to`)
      }
    }
  }

  // ---- report --------------------------------------------------------------
  const byReason = (reason: RedirectPlan['reason']) => plans.filter((p) => p.reason === reason)

  for (const reason of ['folded-service', 'industry', 'pillar-renamed'] as const) {
    const items = byReason(reason)
    console.log(`\n${reason.toUpperCase()} (${items.length})\n`)
    for (const item of items) console.log(`  ${item.from.padEnd(52)} -> ${item.to}`)
  }

  const duplicates = plans
    .map((plan) => plan.from)
    .filter((from, index, all) => all.indexOf(from) !== index)
  for (const from of new Set(duplicates)) {
    errors.push(`Two redirects claim the same source URL "${from}"`)
  }

  const selfReferencing = plans.filter((plan) => plan.from === plan.to)
  for (const plan of selfReferencing) {
    errors.push(`Redirect from "${plan.from}" points at itself`)
  }

  // The plan is written out as a committed manifest so the full set of 301s is
  // reviewable in a diff, and so the E2E suite can assert against it without
  // booting Payload inside a Playwright worker.
  const sorted = [...plans].sort((a, b) => a.from.localeCompare(b.from))
  mkdirSync(dirname(MANIFEST_PATH), { recursive: true })
  writeFileSync(MANIFEST_PATH, `${JSON.stringify(sorted, null, 2)}\n`)
  console.log(`\nmanifest written to ${MANIFEST_PATH}`)

  console.log(`\ntotal=${plans.length} errors=${errors.length}`)

  if (errors.length > 0) {
    console.log('\nERRORS\n')
    for (const line of errors) console.log(`  ✗ ${line}`)
  }

  if (!APPLY) {
    console.log('\nNo database writes were performed. Run again with --apply.\n')
    if (errors.length > 0) process.exitCode = 1
    return
  }

  if (errors.length > 0) {
    throw new Error(`Refusing to write ${plans.length} redirects: ${errors.length} problem(s) listed above.`)
  }

  // ---- write ---------------------------------------------------------------
  // Slugs move first so the redirect targets exist before anything points at
  // them. Both steps are idempotent: `from` is unique, and a slug already at
  // its target value is skipped.
  for (const assignment of assignments.filter((a) => a.role === 'pillar')) {
    const key = pillarKeyForFrSlug(assignment.node.slug)
    if (!key) continue
    const doc = services.get(assignment.node.id)

    for (const locale of locales) {
      const newSlug = PILLARS[key].slugs[locale]
      if (doc?.slugs[locale] === newSlug) continue
      await payload.update({
        collection: 'services',
        id: assignment.node.id,
        locale,
        data: { slug: newSlug },
        draft: false,
        overrideAccess: true,
        user: actor,
      })
      console.log(`  slug     ${locale} ${doc?.slugs[locale]} -> ${newSlug}`)
    }
  }

  let created = 0
  let updated = 0

  for (const plan of plans) {
    const existing = await payload.find({
      collection: 'redirects',
      where: { from: { equals: plan.from } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    const data = {
      from: plan.from,
      to: { type: 'custom' as const, url: plan.to },
      type: '301' as const,
    }

    if (existing.docs[0]) {
      await payload.update({
        collection: 'redirects',
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
        user: actor,
      })
      updated += 1
      continue
    }

    await payload.create({ collection: 'redirects', data, overrideAccess: true, user: actor })
    created += 1
  }

  console.log(`\nredirects created=${created} updated=${updated} total=${plans.length}`)
  console.log('\nDone.\n')
}

main()
  .then(() => process.exit(process.exitCode ?? 0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
