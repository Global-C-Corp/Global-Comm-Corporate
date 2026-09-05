/**
 * Resolves which of the four public pillars absorbs each service term
 * (CLAUDE.md §29-§30).
 *
 * Pure and side-effect free so it can be unit tested and reused by both the
 * consolidation script and the redirect generator: the same function that
 * assigns a term to a pillar decides where that term's old URL redirects, so
 * the two can never disagree.
 *
 * Buckets are derived by walking each term's real `parent` chain to its root.
 * Only two things are declared rather than derived — the set of pillars, and
 * roots that merge into a pillar — because neither is expressible in a
 * hierarchy that has no edge between two roots.
 */

export type ServiceNode = {
  id: number
  slug: string
  name: string
  parentId: number | null
}

export type PillarAssignment = {
  node: ServiceNode
  role: 'pillar' | 'folded'
  /** The pillar that absorbs this term. Undefined only when role is 'pillar'. */
  pillarSlug?: string
  /** The root the parent walk landed on, before any merge was applied. */
  viaRoot: string
  derivedFrom: 'declared-pillar' | 'parent-walk' | 'root-merge'
}

export type PillarResolution = {
  assignments: PillarAssignment[]
  /** Human-readable reasons, each naming the term that could not be placed. */
  mismatches: string[]
}

export type ResolveInput = {
  nodes: ServiceNode[]
  /** Slugs of the terms that keep a public URL. */
  pillarSlugs: string[]
  /** Root slug → pillar slug, for roots that lose their public URL. */
  rootMerges: Record<string, string>
}

export class PillarConfigError extends Error {}

export function resolvePillarAssignments({
  nodes,
  pillarSlugs,
  rootMerges,
}: ResolveInput): PillarResolution {
  const byId = new Map(nodes.map((node) => [node.id, node]))
  const bySlug = new Map(nodes.map((node) => [node.slug, node]))
  const isPillarSlug = new Set(pillarSlugs)

  // A pillar that does not exist would silently swallow every term below it.
  const missing = pillarSlugs.filter((slug) => !bySlug.has(slug))
  if (missing.length > 0) {
    throw new PillarConfigError(`Declared pillars not found: ${missing.join(', ')}`)
  }

  const badTargets = Object.entries(rootMerges).filter(([, target]) => !isPillarSlug.has(target))
  if (badTargets.length > 0) {
    throw new PillarConfigError(
      `Root merges must target a pillar: ${badTargets.map(([from, to]) => `${from} -> ${to}`).join(', ')}`,
    )
  }

  const assignments: PillarAssignment[] = []
  const mismatches: string[] = []

  for (const node of nodes) {
    if (isPillarSlug.has(node.slug)) {
      assignments.push({ node, role: 'pillar', viaRoot: node.slug, derivedFrom: 'declared-pillar' })
      continue
    }

    const root = walkToRoot(node, byId)

    if (!root) {
      mismatches.push(`"${node.name}" (${node.slug}) — parent chain is broken or cyclic; no root reachable`)
      continue
    }

    if (isPillarSlug.has(root.slug)) {
      assignments.push({
        node,
        role: 'folded',
        pillarSlug: root.slug,
        viaRoot: root.slug,
        derivedFrom: 'parent-walk',
      })
      continue
    }

    const merged = rootMerges[root.slug]
    if (merged) {
      assignments.push({
        node,
        role: 'folded',
        pillarSlug: merged,
        viaRoot: root.slug,
        derivedFrom: 'root-merge',
      })
      continue
    }

    mismatches.push(
      `"${node.name}" (${node.slug}) — root "${root.slug}" is neither a pillar nor merged into one`,
    )
  }

  return { assignments, mismatches }
}

/**
 * Returns the root of `node`'s parent chain, or undefined when the chain is
 * broken (a dangling parent id) or cyclic. A cycle must not hang the caller,
 * so visited ids are tracked rather than trusting the data.
 */
function walkToRoot(node: ServiceNode, byId: Map<number, ServiceNode>): ServiceNode | undefined {
  let cursor: ServiceNode | undefined = node
  const seen = new Set<number>()

  while (cursor && cursor.parentId !== null) {
    if (seen.has(cursor.id)) return undefined
    seen.add(cursor.id)
    cursor = byId.get(cursor.parentId)
  }

  return cursor
}
