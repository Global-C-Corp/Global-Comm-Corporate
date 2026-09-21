import 'dotenv/config'
import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '../src/payload.config'
import { locales } from '../src/i18n/locale'
import { PILLARS, pillarKeyForFrSlug } from '../src/services/cms/pillarConfig'

/**
 * Seeds the two per-practice fields the approved Services composition needs:
 * `positioningLine` (the small uppercase line under the practice name) and
 * `shortDescription` (the paragraph under its media).
 *
 * Both were empty on every pillar in every locale, so two of the six elements
 * each practice column is composed of could not render at all. The values live
 * in src/services/cms/pillarConfig.ts beside the approved names, and land in
 * Payload as ordinary editable fields — an editor's later change wins, exactly
 * as it does for the names this script's sibling applied (CLAUDE.md §109).
 *
 * Separate from consolidate-services.ts on purpose: that script performs the
 * one-time grouping and has already run everywhere, so re-running it to carry
 * copy would mean re-deciding buckets. This one only writes two fields on the
 * pillars that already exist, and is idempotent.
 *
 * Dry run by default. Pass --apply to write.
 */

type AdminActor = { id: number; email: string; role: 'admin'; collection: 'users' }

const apply = process.argv.includes('--apply')

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
  return { id: 0, email: 'seed-pillar-copy@local', role: 'admin', collection: 'users' }
}

async function main() {
  const payload = await getPayload({ config })
  const actor = await resolveActor(payload)

  const pillars = await payload.find({
    collection: 'services',
    locale: 'fr',
    fallbackLocale: false,
    where: { isPillar: { equals: true } },
    limit: 100,
    depth: 0,
    draft: true,
    overrideAccess: true,
  })

  let written = 0
  let skipped = 0

  for (const pillar of pillars.docs) {
    const key = pillarKeyForFrSlug(String(pillar.slug))
    if (!key) {
      console.log(`  ✗ ${pillar.slug} — no pillar config for this slug`)
      skipped += 1
      continue
    }

    const entry = PILLARS[key]
    console.log(`  ${apply ? '→' : '·'} ${pillar.slug}  "${entry.positioning.en}"`)

    if (!apply) continue

    for (const locale of locales) {
      await payload.update({
        collection: 'services',
        id: pillar.id,
        locale,
        data: {
          positioningLine: entry.positioning[locale],
          shortDescription: entry.summary[locale],
        },
        draft: false,
        overrideAccess: true,
        user: actor,
      })
    }
    written += 1
  }

  console.log(`\npillars=${pillars.docs.length} written=${written} skipped=${skipped}`)
  if (!apply) console.log('\nNo database writes were performed. Run again with --apply.')
  process.exit(skipped > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
