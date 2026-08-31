/**
 * CLAUDE.md §121-§122. Public read paths fall back to "not available" when a
 * query fails, because an unpublished document legitimately throws Forbidden
 * or NotFound. Everything else — a missing table, an unreachable database, a
 * misconfigured connection — is an incident, and must not be indistinguishable
 * from ordinary unpublished content.
 */

/**
 * Outcomes that are part of normal operation rather than incidents.
 *
 * Keyed on the HTTP status Payload assigns rather than the error's class
 * name: any 4xx from an APIError is the server correctly declining a
 * request — Forbidden, NotFound, and the editorial workflow refusals, which
 * subclass APIError and would otherwise be recorded as outages if a write
 * path ever routed through this logger. 5xx and non-API errors (an
 * unreachable database, a missing table) stay incidents.
 */
function isExpectedAccessError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const { name, status } = error as { name?: string; status?: number }
  if (typeof status === 'number' && status >= 400 && status < 500) return true
  return name === 'Forbidden' || name === 'NotFound'
}

export function logCmsFailure(scope: string, error: unknown): void {
  if (isExpectedAccessError(error)) return

  const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error)
  console.error(`[cms] ${scope} failed — serving empty state. ${message}`)
}
