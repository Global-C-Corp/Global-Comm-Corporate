import 'dotenv/config'
import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '../src/payload.config'
import { locales } from '../src/i18n/locale'
import { PILLARS, currentPillarConfig, pillarKeyForFrSlug } from '../src/services/cms/pillarConfig'
import {
  resolvePillarAssignments,
  type PillarAssignment,
  type ServiceNode,
} from '../src/services/cms/servicePillars'

/**
 * Assigns the public service grouping: four pillars, every other term folded
 * into exactly one of them (CLAUDE.md §29-§30).
 *
 * Buckets are COMPUTED from each term's actual `parent` by the shared resolver
 * in src/services/cms/servicePillars.ts — the same function the redirect
 * generator uses, so a term's bucket and its 301 target can never disagree.
 * Any term the resolver cannot place is reported and, under --apply, aborts
 * the run: a term without a pillar would later produce a redirect to nowhere.
 *
 * Renames are applied here because the project owner approved them; §109
 * governance is preserved by running as an admin actor, as the seed does.
 * Slugs are deliberately NOT touched — changing one breaks a live URL, so they
 * move together with the redirects that cover them.
 *
 * Dry run by default. Pass --apply to write.
 */

const APPLY = process.argv.includes('--apply')

type AdminActor = { id: number; email: string; role: 'admin'; collection: 'users' }

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
  return { id: 0, email: 'consolidate@local', role: 'admin', collection: 'users' }
}

const idOf = (value: unknown): number | null => {
  if (value === null || value === undefined) return null
  if (typeof value === 'object' && 'id' in (value as Record<string, unknown>)) {
    return Number((value as { id: number }).id)
  }
  return Number(value)
}

function report(nodes: ServiceNode[], assignments: PillarAssignment[], mismatches: string[]) {
  const pillars = assignments.filter((a) => a.role === 'pillar')
  const folded = assignments.filter((a) => a.role === 'folded')

  console.log(`\nPILLARS (${pillars.length})\n`)
  for (const assignment of pillars) {
    const key = pillarKeyForFrSlug(assignment.node.slug)
    if (!key) continue
    console.log(`  ${key.padEnd(20)} "${assignment.node.name}"  ->  "${PILLARS[key].names.fr}"`)
  }

  console.log(`\nFOLDED (${folded.length})\n`)
  const grouped = new Map<string, PillarAssignment[]>()
  for (const assignment of folded) {
    const key = assignment.pillarSlug as string
    grouped.set(key, [...(grouped.get(key) ?? []), assignment])
  }
  for (const [slug, items] of grouped) {
    if (!items) continue
    console.log(`  → ${slug} (${items.length})`)
    for (const item of items) {
      const note = item.derivedFrom === 'root-merge' ? `  [via merged root "${item.viaRoot}"]` : ''
      console.log(`      ${item.node.slug.padEnd(34)} ${item.node.name}${note}`)
    }
  }

  if (mismatches.length > 0) {
    console.log(`\nMISMATCHES (${mismatches.length})\n`)
    for (const line of mismatches) console.log(`  ✗ ${line}`)
  } else {
    console.log('\nMISMATCHES: none — every term resolves to exactly one pillar.')
  }

  console.log(
    `\ntotal=${nodes.length} pillars=${pillars.length} folded=${folded.length} mismatches=${mismatches.length}`,
  )
}

async function main() {
  const payload = await getPayload({ config })
  const actor = await resolveActor(payload)

  const result = await payload.find({
    collection: 'services',
    locale: 'fr',
    fallbackLocale: false,
    limit: 1000,
    depth: 0,
    draft: true,
    overrideAccess: true,
  })

  const nodes: ServiceNode[] = result.docs.map((doc) => ({
    id: Number(doc.id),
    slug: String(doc.slug ?? ''),
    name: String(doc.name ?? ''),
    parentId: idOf(doc.parent),
  }))

  // Restated in terms of the slugs currently stored, so a second run still
  // recognises the pillars it renamed on the first.
  const { pillarSlugs, rootMerges } = currentPillarConfig(nodes.map((node) => node.slug))

  const { assignments, mismatches } = resolvePillarAssignments({
    nodes,
    pillarSlugs,
    rootMerges,
  })

  report(nodes, assignments, mismatches)

  if (!APPLY) {
    console.log('\nNo database writes were performed. Run again with --apply.\n')
    return
  }

  if (mismatches.length > 0) {
    throw new Error(
      `Refusing to write: ${mismatches.length} service(s) could not be assigned to a pillar (listed above).`,
    )
  }

  const idBySlug = new Map(nodes.map((node) => [node.slug, node.id]))

  // Pillars first: a term cannot be folded into a pillar that is not yet
  // flagged as one, because the beforeChange guard verifies the target.
  for (const assignment of assignments.filter((a) => a.role === 'pillar')) {
    for (const locale of locales) {
      await payload.update({
        collection: 'services',
        id: assignment.node.id,
        locale,
        data: {
          isPillar: true,
          foldedInto: null,
          name: PILLARS[pillarKeyForFrSlug(assignment.node.slug) as string].names[locale],
        },
        draft: false,
        overrideAccess: true,
        user: actor,
      })
    }
    console.log(`  pillar   ${assignment.node.slug}`)
  }

  for (const assignment of assignments.filter((a) => a.role === 'folded')) {
    await payload.update({
      collection: 'services',
      id: assignment.node.id,
      data: { isPillar: false, foldedInto: idBySlug.get(assignment.pillarSlug as string) },
      draft: false,
      overrideAccess: true,
      user: actor,
    })
    console.log(`  folded   ${assignment.node.slug} -> ${assignment.pillarSlug}`)
  }

  console.log('\nDone.\n')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
