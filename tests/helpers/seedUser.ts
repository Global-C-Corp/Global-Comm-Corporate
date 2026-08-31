import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

export const testUser = {
  email: 'dev@payloadcms.com',
  password: 'test',
  role: 'admin' as const,
}

/**
 * Seeds a test user for e2e admin tests.
 */
export async function seedTestUser(): Promise<void> {
  const payload = await getPayload({ config })

  // Delete existing test user if any
  await payload.delete({
    collection: 'users',
    where: {
      email: {
        equals: testUser.email,
      },
    },
  })

  // Create fresh test user
  await payload.create({
    collection: 'users',
    data: testUser,
  })
}

/**
 * Cleans up test user after tests
 */
export async function cleanupTestUser(): Promise<void> {
  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'users',
    where: {
      email: {
        equals: testUser.email,
      },
    },
  })
}

/**
 * A client draft with nothing approved, for exercising the publish gate.
 * Returns its id.
 *
 * The editorial guard reads the acting user's role on every write, including
 * writes made with overrideAccess, so this runs as the seeded admin — the
 * same pattern scripts/seed.ts uses (§85).
 */
export async function seedBlockedClient(): Promise<number> {
  const payload = await getPayload({ config })

  const admins = await payload.find({
    collection: 'users',
    where: { email: { equals: testUser.email } },
    limit: 1,
    overrideAccess: true,
  })
  const actor = admins.docs[0]

  const doc = await payload.create({
    collection: 'clients',
    locale: 'fr',
    data: {
      name: `Publish gate ${Date.now()}`,
      sourceReferences: [{ type: 'user_provided', label: 'Kickoff brief' }],
    },
    draft: true,
    overrideAccess: true,
    user: actor as never,
  })

  return doc.id
}
