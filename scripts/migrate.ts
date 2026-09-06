import 'dotenv/config'

/**
 * Schema push must never run during a migration (CLAUDE.md §89). Payload's own
 * migrate command sets this before init; so must we, because this script boots
 * Payload directly.
 */
process.env.PAYLOAD_MIGRATING = 'true'

import { sql } from '@payloadcms/db-postgres'
import { getPayload, readMigrationFiles } from 'payload'
import config from '../src/payload.config'
import { acquireMigrationLock, type AdvisoryLockPool } from '../src/lib/migrationLock'

/**
 * Runs pending migrations and PROVES they were applied.
 *
 * Production safety has two independent gates:
 *   1. a session-level PostgreSQL advisory lock serializes every deployment
 *      entering this migration critical section;
 *   2. migration history is re-read after migrate() and the process exits
 *      non-zero if anything remains pending.
 *
 * `payload migrate` cannot be used unattended when a database carries a
 * dev-schema-push marker (batch = -1), because the upstream prompt may resolve
 * to process.exit(0). This wrapper handles that marker explicitly.
 */

const ACCEPT_DEV_PUSH =
  process.argv.includes('--accept-dev-push') || process.env.PAYLOAD_ACCEPT_DEV_PUSH === 'true'

const IS_PRODUCTION =
  process.env.VERCEL_ENV === 'production' ||
  (!process.env.VERCEL_ENV && process.env.NODE_ENV === 'production')

const DEV_PUSH_BATCH = -1

type MigrationRow = { id: number | string; name: string; batch?: number | null }

async function readApplied(payload: Awaited<ReturnType<typeof getPayload>>): Promise<MigrationRow[]> {
  try {
    const result = await payload.find({
      collection: 'payload-migrations',
      limit: 0,
      depth: 0,
      overrideAccess: true,
    })
    return result.docs as MigrationRow[]
  } catch (error) {
    const code =
      (error as { cause?: { code?: string }; code?: string })?.cause?.code ??
      (error as { code?: string })?.code
    const message = error instanceof Error ? error.message : String(error)

    if (code === '42P01' || /relation .*payload_migrations.* does not exist/i.test(message)) {
      return []
    }
    throw error
  }
}

function getPostgresPool(payload: Awaited<ReturnType<typeof getPayload>>): AdvisoryLockPool {
  const db = payload.db as unknown as {
    pool?: AdvisoryLockPool
    drizzle?: { $client?: AdvisoryLockPool }
  }

  const pool = db.pool ?? db.drizzle?.$client
  if (!pool?.connect) {
    throw new Error(
      'Could not access the PostgreSQL pool required for the deployment migration advisory lock.',
    )
  }

  return pool
}

async function runLockedMigrations(payload: Awaited<ReturnType<typeof getPayload>>) {
  const files = await readMigrationFiles({ payload })
  const fileNames = files.map((file) => file.name)
  const recorded = await readApplied(payload)

  const devPushRows = recorded.filter((doc) => doc.batch === DEV_PUSH_BATCH)
  const applied = new Set(
    recorded.filter((doc) => doc.batch !== DEV_PUSH_BATCH).map((doc) => doc.name),
  )
  const pending = fileNames.filter((name) => !applied.has(name))

  console.log(`migrations on disk: ${fileNames.length}`)
  console.log(`already applied:    ${applied.size}`)
  console.log(`pending:            ${pending.length}${pending.length ? ` (${pending.join(', ')})` : ''}`)

  if (devPushRows.length > 0) {
    if (IS_PRODUCTION && !ACCEPT_DEV_PUSH) {
      throw new Error(
        [
          'This database carries a dev schema-push marker (payload_migrations batch -1).',
          'Its schema was pushed directly rather than migrated, so applying migrations',
          'over it can destroy data.',
          '',
          'Refusing to migrate a production database in that state. Either restore it from',
          'a migrated baseline, or set PAYLOAD_ACCEPT_DEV_PUSH=true once you have confirmed',
          'the pushed schema already matches the migrations.',
        ].join('\n'),
      )
    }

    console.log(
      `\nclearing ${devPushRows.length} dev-push marker row(s) so migrate does not stop to ask about them`,
    )

    if (!ACCEPT_DEV_PUSH) console.log('(non-production: cleared automatically)')

    const db = payload.db as unknown as {
      drizzle: { execute: (query: unknown) => Promise<unknown> }
    }
    await db.drizzle.execute(sql`DELETE FROM payload_migrations WHERE batch = -1`)
  }

  if (pending.length === 0) {
    console.log('\nNothing to migrate.\n')
    return
  }

  await payload.db.migrate()

  const after = await readApplied(payload)
  const nowApplied = new Set(
    after.filter((doc) => doc.batch !== DEV_PUSH_BATCH).map((doc) => doc.name),
  )
  const stillPending = pending.filter((name) => !nowApplied.has(name))

  if (stillPending.length > 0) {
    throw new Error(
      `Migration reported no error but ${stillPending.length} migration(s) are still unapplied: ${stillPending.join(', ')}`,
    )
  }

  console.log(`\nApplied ${pending.length} migration(s). Verified against payload_migrations.\n`)
}

async function main() {
  const payload = await getPayload({ config })
  const timeoutMs = Number(process.env.MIGRATION_LOCK_TIMEOUT_MS ?? 180_000)
  const pollIntervalMs = Number(process.env.MIGRATION_LOCK_POLL_MS ?? 3_000)

  console.log(
    `acquiring PostgreSQL deployment migration lock (timeout ${timeoutMs}ms, poll ${pollIntervalMs}ms)`,
  )

  const lock = await acquireMigrationLock(getPostgresPool(payload), {
    timeoutMs,
    pollIntervalMs,
  })

  console.log('migration lock acquired')

  try {
    await runLockedMigrations(payload)
  } finally {
    await lock.release()
    console.log('migration lock released')
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(`\n${error instanceof Error ? error.message : error}\n`)
    process.exit(1)
  })
