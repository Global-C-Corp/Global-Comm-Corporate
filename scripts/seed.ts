import 'dotenv/config'
import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '../src/payload.config'
import { locales, translationStatusKey } from '../src/i18n/locale'
import { slugify } from '../src/lib/slugify'
import {
  contextTagSeeds,
  homeCopy,
  industrySeeds,
  navigationSeed,
  pageCopy,
  projectTypeSeeds,
  serviceTree,
  type Localized,
  type ServiceSeed,
} from './seed-data'

/**
 * Idempotent seed of controlled vocabulary and site defaults (CLAUDE.md §126).
 * Never seeds fabricated clients, testimonials, results or awards.
 *
 * By default everything is seeded as an unpublished draft — publishing stays
 * a human act (§138 HUMAN_IS_FINAL_PUBLISHER). Pass --publish (or set
 * SEED_PUBLISH=true) in local/test environments that need public content,
 * for example to run the E2E suite.
 *
 * This is a trusted internal script, so `overrideAccess: true` is used
 * deliberately and only here (§85).
 */

const shouldPublish = process.argv.includes('--publish') || process.env.SEED_PUBLISH === 'true'

/**
 * The editorial guard reads the acting user's role on every write, including
 * writes made with overrideAccess. The seed is an operator action, so it runs
 * as an admin: a real admin account when one exists, otherwise a synthetic
 * actor that exists only for the duration of this script (no credentials are
 * created).
 */
type SeedActor = { id: number; email: string; role: 'admin'; collection: 'users' }

async function resolveSeedActor(payload: Payload): Promise<SeedActor> {
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
  return { id: 0, email: 'seed@local', role: 'admin', collection: 'users' }
}

let actor: SeedActor

const approvedTranslationStatus = Object.fromEntries(
  locales.map((locale) => [translationStatusKey(locale), 'approved']),
)
const draftTranslationStatus = Object.fromEntries(
  locales.map((locale) => [translationStatusKey(locale), 'needs_review']),
)

function editorialState() {
  return shouldPublish
    ? {
        reviewStatus: 'approved' as const,
        translationStatus: approvedTranslationStatus,
        dirtyLocales: [],
        _status: 'published' as const,
      }
    : { reviewStatus: 'editorial_draft' as const, translationStatus: draftTranslationStatus, dirtyLocales: [] }
}

async function findBySlug(payload: Payload, collection: 'services' | 'industries' | 'project-types' | 'context-tags', slug: string) {
  const result = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    locale: 'fr',
    limit: 1,
    depth: 0,
    draft: true,
    overrideAccess: true,
  })
  return result.docs[0] ?? null
}

async function upsertLocalizedTerm(
  payload: Payload,
  collection: 'services' | 'industries' | 'project-types' | 'context-tags',
  seed: { key: string; name: Localized },
  extra: Record<string, unknown> = {},
) {
  const frSlug = slugify(seed.name.fr)
  const existing = await findBySlug(payload, collection, frSlug)

  const baseData = {
    name: seed.name.fr,
    slug: frSlug,
    ...extra,
  }

  const doc = existing
    ? await payload.update({
        collection,
        id: existing.id,
        locale: 'fr',
        data: baseData,
        draft: !shouldPublish,
        overrideAccess: true,
        user: actor,
      })
    : await payload.create({
        collection,
        locale: 'fr',
        data: baseData as never,
        draft: !shouldPublish,
        overrideAccess: true,
        user: actor,
      })

  for (const locale of locales.filter((l) => l !== 'fr')) {
    await payload.update({
      collection,
      id: doc.id,
      locale,
      data: { name: seed.name[locale], slug: slugify(seed.name[locale]) } as never,
      draft: !shouldPublish,
      overrideAccess: true,
      user: actor,
    })
  }

  return doc
}

async function seedServices(payload: Payload) {
  let order = 0
  for (const pillar of serviceTree) {
    const parentDoc = await upsertLocalizedTerm(payload, 'services', pillar, {
      displayOrder: order++,
      featured: true,
      ...editorialState(),
    })

    for (const child of pillar.children ?? ([] as ServiceSeed[])) {
      await upsertLocalizedTerm(payload, 'services', child, {
        parent: parentDoc.id,
        displayOrder: order++,
        ...editorialState(),
      })
    }
  }
  console.log(`✓ services (${serviceTree.length} pillars)`)
}

async function seedIndustries(payload: Payload) {
  let order = 0
  for (const industry of industrySeeds) {
    await upsertLocalizedTerm(payload, 'industries', industry, { displayOrder: order++, ...editorialState() })
  }
  console.log(`✓ industries (${industrySeeds.length})`)
}

async function seedProjectTypes(payload: Payload) {
  let order = 0
  for (const projectType of projectTypeSeeds) {
    await upsertLocalizedTerm(payload, 'project-types', projectType, { displayOrder: order++ })
  }
  console.log(`✓ project types (${projectTypeSeeds.length})`)
}

async function seedContextTags(payload: Payload) {
  for (const tag of contextTagSeeds) {
    await upsertLocalizedTerm(payload, 'context-tags', tag)
  }
  console.log(`✓ context tags (${contextTagSeeds.length})`)
}

/**
 * Localized array rows must be written by id after the first locale —
 * re-sending rows without ids makes Payload recreate them and drop the
 * labels already stored for other locales.
 */
async function seedNavigation(payload: Payload) {
  const rowsFor = (group: 'primary' | 'footer', locale: (typeof locales)[number]) =>
    navigationSeed[group].map((item) => ({ label: item.label[locale], url: item.url }))

  await payload.updateGlobal({
    slug: 'navigation',
    locale: 'fr',
    overrideAccess: true,
    user: actor,
    draft: !shouldPublish,
    data: {
      primaryNavigation: rowsFor('primary', 'fr'),
      footerNavigation: rowsFor('footer', 'fr'),
      ...(shouldPublish ? { _status: 'published' as const } : {}),
    },
  })

  const current = await payload.findGlobal({
    slug: 'navigation',
    locale: 'fr',
    draft: true,
    depth: 0,
    overrideAccess: true,
    user: actor,
  })

  for (const locale of locales.filter((l) => l !== 'fr')) {
    await payload.updateGlobal({
      slug: 'navigation',
      locale,
      overrideAccess: true,
      user: actor,
      draft: !shouldPublish,
      data: {
        primaryNavigation: (current.primaryNavigation ?? []).map((row, index) => ({
          id: row.id,
          url: row.url,
          label: navigationSeed.primary[index]?.label[locale] ?? row.label,
        })),
        footerNavigation: (current.footerNavigation ?? []).map((row, index) => ({
          id: row.id,
          url: row.url,
          label: navigationSeed.footer[index]?.label[locale] ?? row.label,
        })),
        ...(shouldPublish ? { _status: 'published' as const } : {}),
      },
    })
  }
}

async function seedGlobals(payload: Payload) {
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'fr',
    overrideAccess: true,
    user: actor,
    data: {
      companyName: 'Global Communication Corporate',
      shortName: 'Global Comm',
      siteURL: 'https://globalcomm.ma',
      tagline: 'Stratégie. Création. Croissance.',
    },
  })
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    overrideAccess: true,
    user: actor,
    data: { tagline: 'Strategy. Creative. Growth.' },
  })
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'es',
    overrideAccess: true,
    user: actor,
    data: { tagline: 'Estrategia. Creatividad. Crecimiento.' },
  })

  await seedNavigation(payload)

  for (const locale of locales) {
    await payload.updateGlobal({
      slug: 'home-page',
      locale,
      overrideAccess: true,
      user: actor,
      draft: !shouldPublish,
      data: {
        heroEyebrow: homeCopy.heroEyebrow[locale],
        heroHeading: homeCopy.heroHeading[locale],
        heroBody: homeCopy.heroBody[locale],
        primaryCTA: { label: homeCopy.primaryCTA.label[locale], url: homeCopy.primaryCTA.url },
        secondaryCTA: { label: homeCopy.secondaryCTA.label[locale], url: homeCopy.secondaryCTA.url },
        methodHeading: homeCopy.methodHeading[locale],
        methodIntro: homeCopy.methodIntro[locale],
        closingCTA: { label: homeCopy.closingCTA.label[locale], url: homeCopy.closingCTA.url },
        ...editorialState(),
      },
    })

    await payload.updateGlobal({
      slug: 'services-page',
      locale,
      overrideAccess: true,
      user: actor,
      draft: !shouldPublish,
      data: {
        eyebrow: pageCopy.services.eyebrow[locale],
        heading: pageCopy.services.heading[locale],
        intro: pageCopy.services.intro[locale],
        ...editorialState(),
      },
    })

    await payload.updateGlobal({
      slug: 'work-page',
      locale,
      overrideAccess: true,
      user: actor,
      draft: !shouldPublish,
      data: {
        eyebrow: pageCopy.work.eyebrow[locale],
        heading: pageCopy.work.heading[locale],
        intro: pageCopy.work.intro[locale],
        ...editorialState(),
      },
    })

    await payload.updateGlobal({
      slug: 'company-page',
      locale,
      overrideAccess: true,
      user: actor,
      draft: !shouldPublish,
      data: {
        eyebrow: pageCopy.company.eyebrow[locale],
        heading: pageCopy.company.heading[locale],
        intro: pageCopy.company.intro[locale],
        ...editorialState(),
      },
    })

    await payload.updateGlobal({
      slug: 'contact-page',
      locale,
      overrideAccess: true,
      user: actor,
      draft: !shouldPublish,
      data: {
        eyebrow: pageCopy.contact.eyebrow[locale],
        heading: pageCopy.contact.heading[locale],
        intro: pageCopy.contact.intro[locale],
        formIntro: pageCopy.contact.formIntro[locale],
        ...editorialState(),
      },
    })
  }
  console.log('✓ globals')
}

async function seedAdminUser(payload: Payload) {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD

  if (!email || !password) {
    console.log('· skipped admin user (set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create one)')
    return
  }

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.totalDocs > 0) {
    console.log('· admin user already exists')
    return
  }

  await payload.create({
    collection: 'users',
    data: { email, password, role: 'admin', name: 'Administrator' },
    overrideAccess: true,
  })
  console.log(`✓ admin user ${email}`)
}

async function main() {
  const payload = await getPayload({ config })
  actor = await resolveSeedActor(payload)

  console.log(shouldPublish ? 'Seeding (published) …' : 'Seeding (drafts — publish via Payload Admin) …')

  await seedAdminUser(payload)
  await seedServices(payload)
  await seedIndustries(payload)
  await seedProjectTypes(payload)
  await seedContextTags(payload)
  await seedGlobals(payload)

  console.log('Done.')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
