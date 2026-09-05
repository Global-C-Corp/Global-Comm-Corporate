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

/**
 * Runs pending migrations and PROVES they were applied.
 *
 * `payload migrate` cannot be used unattended. When the target database was
 * ever schema-pushed in dev, Payload records a marker row in
 * `payload_migrations` with `batch = -1`, and the next migrate run stops to ask
 * whether to continue. In a non-interactive shell that prompt has no answer, so
 * @payloadcms/drizzle takes `process.exit(0)` — on both the cancel branch and
 * the decline branch.
 *
 * Exit code zero is the whole problem. `payload migrate && next build` then
 * proceeds to a green build with the schema unmigrated, which is the one
 * failure mode a build step exists to prevent.
 *
 * This wrapper closes it from both ends:
 *
 *   1. The marker is detected up front and handled explicitly, so the prompt
 *      never fires. On production it is a hard stop, because a production
 *      database should never have been dev-pushed and quietly migrating over
 *      one risks the data loss the prompt warns about.
 *   2. Whatever happens, the recorded migrations are re-read afterwards and
 *      compared against the files. Anything still pending exits non-zero. That
 *      check does not depend on knowing why a migration was skipped, so it also
 *      catches whatever the next version of this bug looks like.
 */

const ACCEPT_DEV_PUSH =
  process.argv.includes('--accept-dev-push') || process.env.PAYLOAD_ACCEPT_DEV_PUSH === 'true'

const IS_PRODUCTION =
  process.env.VERCEL_ENV === 'production' ||
  (!process.env.VERCEL_ENV && process.env.NODE_ENV === 'production')

const DEV_PUSH_BATCH = -1

type MigrationRow = { id: number | string; name: string; batch?: number | null }

/**
 * Reads what the database says has been applied.
 *
 * On a database that has never been migrated the `payload_migrations` table
 * does not exist yet, which Postgres reports as undefined_table (42P01). That
 * is the expected first-run state, not a failure — but only that specific
 * error is treated as empty, so a genuine connection or permission problem
 * still surfaces instead of being read as "nothing applied yet".
 */
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
    const code = (error as { cause?: { code?: string }; code?: string })?.cause?.code ??
      (error as { code?: string })?.code
    const message = error instanceof Error ? error.message : String(error)

    if (code === '42P01' || /relation .*payload_migrations.* does not exist/i.test(message)) {
      return []
    }
    throw error
  }
}

async function main() {
  const payload = await getPayload({ config })

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

  // ---- the dev-push marker ------------------------------------------------
  if (devPushRows.length > 0) {
    if (IS_PRODUCTION && !ACCEPT_DEV_PUSH) {
      throw new Error(
        [
          'This database carries a dev schema-push marker (payload_migrations batch -1).',
          'Its schema was pushed directly rather than migrated, so applying migrations',
          'over it can destroy data — which is exactly what `payload migrate` stops to ask',
          'about, then silently skips when nothing can answer.',
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

    if (!ACCEPT_DEV_PUSH) {
      console.log('(non-production: cleared automatically)')
    }

    // A direct statement, not payload.delete: this is a bookkeeping row in
    // Payload's own table, and routing it through document deletion drags in
    // preference cleanup and hooks that have nothing to do with migrating.
    const db = payload.db as unknown as { drizzle: { execute: (query: unknown) => Promise<unknown> } }
    await db.drizzle.execute(sql`DELETE FROM payload_migrations WHERE batch = -1`)
  }

  if (pending.length === 0) {
    console.log('\nNothing to migrate.\n')
    return
  }

  // ---- run ----------------------------------------------------------------
  await payload.db.migrate()

  // ---- prove it -----------------------------------------------------------
  // The migrate call above can terminate the process on its own. Reaching this
  // point is necessary but not sufficient: what matters is what the table says.
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

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(`\n${error instanceof Error ? error.message : error}\n`)
    process.exit(1)
  })
