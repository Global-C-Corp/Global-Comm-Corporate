import 'dotenv/config'
import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '../src/payload.config'
import { locales, translationStatusKey } from '../src/i18n/locale'

/**
 * Deterministic content used only by the E2E visual-regression suite.
 *
 * The production seed deliberately never fabricates clients or case studies.
 * Visual tests still need one stable project-detail route on a fresh CI
 * database, so this script creates an explicitly synthetic fixture and refuses
 * to run outside CI unless E2E_FIXTURE_SEED=true is set.
 */

if (process.env.CI !== 'true' && process.env.E2E_FIXTURE_SEED !== 'true') {
  throw new Error('Refusing to seed E2E fixtures outside CI. Set E2E_FIXTURE_SEED=true to opt in explicitly.')
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

  return { id: 0, email: 'e2e-fixture@local', role: 'admin', collection: 'users' }
}

async function main() {
  const payload = await getPayload({ config })
  const actor = await resolveActor(payload)

  const existingClients = await payload.find({
    collection: 'clients',
    where: { name: { equals: 'E2E Fixture Client' } },
    limit: 1,
    depth: 0,
    draft: true,
    overrideAccess: true,
  })

  const client =
    existingClients.docs[0] ??
    (await payload.create({
      collection: 'clients',
      locale: 'fr',
      draft: false,
      overrideAccess: true,
      user: actor,
      data: {
        name: 'E2E Fixture Client',
        featured: false,
        displayOrder: 9999,
        ...editorialState,
      } as never,
    }))

  const existingProjects = await payload.find({
    collection: 'projects',
    locale: 'fr',
    fallbackLocale: false,
    where: { slug: { equals: 'e2e-case-study' } },
    limit: 1,
    depth: 0,
    draft: true,
    overrideAccess: true,
  })

  const project =
    existingProjects.docs[0] ??
    (await payload.create({
      collection: 'projects',
      locale: 'fr',
      draft: false,
      overrideAccess: true,
      user: actor,
      data: {
        title: 'E2E Case Study',
        slug: 'e2e-case-study',
        client: client.id,
        year: 2026,
        featured: false,
        displayOrder: 9999,
        shortStatement: 'Synthetic fixture used only for automated visual regression.',
        excerpt: 'Synthetic fixture used only for automated visual regression.',
        sourceReferences: [
          {
            type: 'human_verified',
            label: 'Automated E2E fixture',
            note: 'Synthetic test content. Never intended for production publishing.',
          },
        ],
        ...editorialState,
      } as never,
    }))

  for (const locale of locales.filter((value) => value !== 'fr')) {
    await payload.update({
      collection: 'projects',
      id: project.id,
      locale,
      draft: false,
      overrideAccess: true,
      user: actor,
      data: {
        title: 'E2E Case Study',
        slug: 'e2e-case-study',
        shortStatement: 'Synthetic fixture used only for automated visual regression.',
        excerpt: 'Synthetic fixture used only for automated visual regression.',
      } as never,
    })
  }

  console.log(`✓ E2E fixture client=${client.id} project=${project.id}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
