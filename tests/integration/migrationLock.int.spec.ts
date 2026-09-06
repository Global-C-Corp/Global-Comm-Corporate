import { describe, expect, it } from 'vitest'
import { getTestPayload } from '../helpers/payload'
import { acquireMigrationLock, type AdvisoryLockPool } from '@/lib/migrationLock'

function getPool(payload: Awaited<ReturnType<typeof getTestPayload>>): AdvisoryLockPool {
  const db = payload.db as unknown as {
    pool?: AdvisoryLockPool
    drizzle?: { $client?: AdvisoryLockPool }
  }

  const pool = db.pool ?? db.drizzle?.$client
  if (!pool?.connect) throw new Error('Postgres pool unavailable in integration test')
  return pool
}

describe('migration advisory lock', () => {
  it('serializes deployment migration sessions and releases cleanly', async () => {
    const payload = await getTestPayload()
    const pool = getPool(payload)

    const first = await acquireMigrationLock(pool, { timeoutMs: 1_000, pollIntervalMs: 25 })

    await expect(
      acquireMigrationLock(pool, { timeoutMs: 100, pollIntervalMs: 25 }),
    ).rejects.toThrow(/Another deployment currently owns the Global Comm migration lock/)

    await first.release()

    const second = await acquireMigrationLock(pool, { timeoutMs: 1_000, pollIntervalMs: 25 })
    await second.release()
  })
})
