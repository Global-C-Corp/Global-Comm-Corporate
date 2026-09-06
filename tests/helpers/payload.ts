import { getPayload, type Payload, type PayloadRequest } from 'payload'
import config from '@/payload.config'
import type { Role } from '@/access/roles'

let cached: Payload | null = null

export async function getTestPayload(): Promise<Payload> {
  if (!cached) {
    cached = await getPayload({ config: await config })
  }
  return cached
}

export type TestUser = { id: number; email: string; role: Role; collection: 'users' }

async function findUserByEmail(payload: Payload, email: string) {
  const result = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })

  return result.docs[0]
}

/**
 * Creates (or reuses) a real user per role, so tests exercise the same
 * access-control and hook paths as the Admin UI, REST and MCP.
 *
 * Integration suites run in parallel. Two suites can therefore both observe
 * that a role user is missing and race to create the same unique email. If the
 * other suite wins that race, re-read the row and reuse it instead of failing
 * the entire CI run on the expected uniqueness constraint.
 */
export async function ensureUser(role: Role): Promise<TestUser> {
  const payload = await getTestPayload()
  const email = `${role}@test.local`

  const existing = await findUserByEmail(payload, email)
  if (existing) {
    return { id: existing.id, email, role, collection: 'users' }
  }

  try {
    const created = await payload.create({
      collection: 'users',
      data: { email, password: 'test-password-1234', role, name: role },
      overrideAccess: true,
    })

    return { id: created.id, email, role, collection: 'users' }
  } catch (error) {
    const concurrent = await findUserByEmail(payload, email)
    if (concurrent) {
      return { id: concurrent.id, email, role, collection: 'users' }
    }

    throw error
  }
}

/** Minimal PayloadRequest for exercising content-ops services directly. */
export async function requestFor(user: TestUser | null): Promise<PayloadRequest> {
  const payload = await getTestPayload()
  return {
    payload,
    user: user as unknown as PayloadRequest['user'],
    payloadAPI: 'local',
    locale: 'fr',
    headers: new Headers(),
    context: {},
  } as unknown as PayloadRequest
}

export async function cleanupCollection(collection: 'clients' | 'projects' | 'testimonials'): Promise<void> {
  const payload = await getTestPayload()
  await payload.delete({
    collection,
    where: { id: { exists: true } },
    overrideAccess: true,
  })
}
