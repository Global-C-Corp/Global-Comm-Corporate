import { APIError, type CollectionBeforeChangeHook } from 'payload'

/**
 * Structural invariants for the public service grouping (CLAUDE.md §29-§30).
 *
 * These run in `beforeChange`, so they hold identically through the Admin UI,
 * REST, GraphQL, the Local API and MCP tools (CLAUDE.md §27) rather than only
 * where a form happens to enforce them.
 *
 * Deliberately NOT enforced here: "every non-pillar must declare a pillar".
 * Requiring it on save would make every existing term unsaveable the moment
 * the field is added, and would block an editor who is part-way through
 * creating a term. It is asserted instead where a missing value actually
 * causes harm — redirect generation, which refuses to emit a partial set and
 * names the offending term.
 */
export class ServicePillarError extends APIError {
  constructor(message: string) {
    super(message, 400, undefined, true)
  }
}

const idOf = (value: unknown): number | string | null => {
  if (value === null || value === undefined) return null
  if (typeof value === 'object' && 'id' in (value as Record<string, unknown>)) {
    return (value as { id: number | string }).id
  }
  return value as number | string
}

export const enforceServicePillars: CollectionBeforeChangeHook = async ({ data, originalDoc, req }) => {
  const isPillar = data?.isPillar ?? originalDoc?.isPillar ?? false
  const foldedInto = idOf('foldedInto' in (data ?? {}) ? data.foldedInto : originalDoc?.foldedInto)

  if (isPillar && foldedInto !== null) {
    throw new ServicePillarError(
      'A pillar cannot itself be folded into another service. Clear "Folded into", or uncheck "Is pillar".',
    )
  }

  if (foldedInto === null) return data

  const selfId = idOf(originalDoc?.id)
  if (selfId !== null && String(selfId) === String(foldedInto)) {
    throw new ServicePillarError('A service cannot be folded into itself.')
  }

  // A term folded into a non-pillar would redirect to a URL that does not
  // exist, so the target is verified rather than assumed.
  const target = await req.payload.findByID({
    collection: 'services',
    id: foldedInto,
    depth: 0,
    req,
    overrideAccess: false,
    disableErrors: true,
  })

  if (!target) {
    throw new ServicePillarError(`"Folded into" points at service ${foldedInto}, which does not exist.`)
  }

  if (!target.isPillar) {
    throw new ServicePillarError(
      `"Folded into" must point at a pillar. "${target.name ?? foldedInto}" is not one, so this term would redirect to a page that has no public URL.`,
    )
  }

  return data
}
