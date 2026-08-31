/**
 * CLAUDE.md §121-§122. Public read paths fall back to "not available" when a
 * query fails, because an unpublished document legitimately throws Forbidden
 * or NotFound. Everything else — a missing table, an unreachable database, a
 * misconfigured connection — is an incident, and must not be indistinguishable
 * from ordinary unpublished content.
 */

/** Access/visibility outcomes that are part of normal operation. */
function isExpectedAccessError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const { name, status } = error as { name?: string; status?: number }
  return name === 'Forbidden' || name === 'NotFound' || status === 403 || status === 404
}

export function logCmsFailure(scope: string, error: unknown): void {
  if (isExpectedAccessError(error)) return

  const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error)
  console.error(`[cms] ${scope} failed — serving empty state. ${message}`)
}
