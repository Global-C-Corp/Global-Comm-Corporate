export type AdvisoryLockQueryResult = {
  rows: Array<Record<string, unknown>>
}

export type AdvisoryLockClient = {
  query: (text: string, values?: unknown[]) => Promise<AdvisoryLockQueryResult>
  release: () => void
}

export type AdvisoryLockPool = {
  connect: () => Promise<AdvisoryLockClient>
}

export type AdvisoryLockHandle = {
  release: () => Promise<void>
}

export type AdvisoryLockOptions = {
  timeoutMs?: number
  pollIntervalMs?: number
}

// Two-int PostgreSQL advisory-lock namespace dedicated to this application's
// production migration critical section. Every deployment uses the same key.
const MIGRATION_LOCK_KEY_A = 0x474343 // "GCC"
const MIGRATION_LOCK_KEY_B = 1

const DEFAULT_TIMEOUT_MS = 180_000
const DEFAULT_POLL_INTERVAL_MS = 3_000

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Acquires a session-level PostgreSQL advisory lock on a dedicated pooled
 * connection and keeps that exact connection checked out until release().
 *
 * The migration work itself may use other pool connections; the dedicated
 * session is the cross-deployment mutex. Every migration process must acquire
 * this same lock before entering the critical section.
 */
export async function acquireMigrationLock(
  pool: AdvisoryLockPool,
  options: AdvisoryLockOptions = {},
): Promise<AdvisoryLockHandle> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const pollIntervalMs = options.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS

  if (timeoutMs < 0) throw new Error('Migration lock timeout must be >= 0ms.')
  if (pollIntervalMs <= 0) throw new Error('Migration lock poll interval must be > 0ms.')

  const client = await pool.connect()
  const startedAt = Date.now()

  try {
    while (true) {
      const result = await client.query(
        'SELECT pg_try_advisory_lock($1::integer, $2::integer) AS acquired',
        [MIGRATION_LOCK_KEY_A, MIGRATION_LOCK_KEY_B],
      )

      if (result.rows[0]?.acquired === true) {
        let released = false

        return {
          async release() {
            if (released) return
            released = true

            try {
              const unlock = await client.query(
                'SELECT pg_advisory_unlock($1::integer, $2::integer) AS released',
                [MIGRATION_LOCK_KEY_A, MIGRATION_LOCK_KEY_B],
              )

              if (unlock.rows[0]?.released !== true) {
                throw new Error('PostgreSQL reported that the migration advisory lock was not held by this session.')
              }
            } finally {
              client.release()
            }
          },
        }
      }

      const elapsed = Date.now() - startedAt
      if (elapsed >= timeoutMs) {
        throw new Error(
          `Another deployment currently owns the Global Comm migration lock. Timed out after ${timeoutMs}ms without making schema changes.`,
        )
      }

      await sleep(Math.min(pollIntervalMs, Math.max(1, timeoutMs - elapsed)))
    }
  } catch (error) {
    client.release()
    throw error
  }
}
