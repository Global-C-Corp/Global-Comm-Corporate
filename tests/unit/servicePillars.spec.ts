import { describe, expect, it } from 'vitest'
import {
  PillarConfigError,
  resolvePillarAssignments,
  type ServiceNode,
} from '@/services/cms/servicePillars'
import { PILLAR_SLUGS, ROOT_MERGES } from '@/services/cms/pillarConfig'

const node = (id: number, slug: string, parentId: number | null = null): ServiceNode => ({
  id,
  slug,
  name: slug,
  parentId,
})

/** Mirrors the shape of the real taxonomy: pillar roots, a merged root, children. */
const tree: ServiceNode[] = [
  node(2, 'strategie'),
  node(3, 'audit-diagnostic', 2),
  node(7, 'branding'),
  node(8, 'identite-de-marque', 7),
  node(13, 'creation-contenu'),
  node(15, 'creation-de-contenu', 13),
  node(20, 'marketing-digital'),
  node(27, 'optimisation-de-la-conversion', 20),
  node(28, 'web-technologie'),
  node(34, 'solutions-ia', 28),
]

const resolve = (nodes: ServiceNode[]) =>
  resolvePillarAssignments({ nodes, pillarSlugs: PILLAR_SLUGS, rootMerges: ROOT_MERGES })

describe('resolvePillarAssignments', () => {
  it('marks exactly the four declared pillars', () => {
    const { assignments } = resolve(tree)
    const pillars = assignments.filter((a) => a.role === 'pillar').map((a) => a.node.slug)
    expect(pillars.sort()).toEqual(
      ['branding', 'marketing-digital', 'strategie', 'web-technologie'].sort(),
    )
  })

  it('folds a child into the pillar at the top of its parent chain', () => {
    const { assignments } = resolve(tree)
    const child = assignments.find((a) => a.node.slug === 'audit-diagnostic')
    expect(child?.pillarSlug).toBe('strategie')
    expect(child?.derivedFrom).toBe('parent-walk')
  })

  it('folds a merged root and its children into the merge target', () => {
    const { assignments } = resolve(tree)
    const root = assignments.find((a) => a.node.slug === 'creation-contenu')
    const child = assignments.find((a) => a.node.slug === 'creation-de-contenu')

    expect(root?.pillarSlug).toBe('branding')
    expect(child?.pillarSlug).toBe('branding')
    // The root is still reported, so a reviewer can see why it moved.
    expect(child?.viaRoot).toBe('creation-contenu')
    expect(child?.derivedFrom).toBe('root-merge')
  })

  it('places conversion optimization by its real parent, not by topic', () => {
    // Its parent is Marketing digital, though it reads like a web/tech term.
    const { assignments } = resolve(tree)
    const cro = assignments.find((a) => a.node.slug === 'optimisation-de-la-conversion')
    expect(cro?.pillarSlug).toBe('marketing-digital')
  })

  it('assigns every term exactly once and reports no mismatch for the real shape', () => {
    const { assignments, mismatches } = resolve(tree)
    expect(mismatches).toEqual([])
    expect(assignments).toHaveLength(tree.length)
    expect(new Set(assignments.map((a) => a.node.id)).size).toBe(tree.length)
  })

  it('names a term whose root is neither a pillar nor merged', () => {
    const orphanRoot = node(90, 'evenementiel')
    const orphanChild = node(91, 'salons', 90)
    const { mismatches, assignments } = resolve([...tree, orphanRoot, orphanChild])

    expect(mismatches).toHaveLength(2)
    expect(mismatches.join('\n')).toContain('evenementiel')
    expect(mismatches.join('\n')).toContain('salons')
    // The unplaceable terms are excluded rather than guessed at.
    expect(assignments.map((a) => a.node.slug)).not.toContain('salons')
  })

  it('names a term whose parent id dangles', () => {
    const { mismatches } = resolve([...tree, node(92, 'orphelin', 999)])
    expect(mismatches.join('\n')).toContain('orphelin')
    expect(mismatches.join('\n')).toContain('no root reachable')
  })

  it('does not hang on a cycle in the hierarchy', () => {
    const a = node(80, 'boucle-a', 81)
    const b = node(81, 'boucle-b', 80)
    const { mismatches } = resolve([...tree, a, b])
    expect(mismatches.join('\n')).toContain('boucle-a')
    expect(mismatches.join('\n')).toContain('boucle-b')
  })

  it('refuses a configuration whose pillar does not exist', () => {
    expect(() =>
      resolvePillarAssignments({
        nodes: tree,
        pillarSlugs: [...PILLAR_SLUGS, 'inexistant'],
        rootMerges: ROOT_MERGES,
      }),
    ).toThrow(PillarConfigError)
  })

  it('refuses a root merge that targets a non-pillar', () => {
    expect(() =>
      resolvePillarAssignments({
        nodes: tree,
        pillarSlugs: PILLAR_SLUGS,
        rootMerges: { 'creation-contenu': 'audit-diagnostic' },
      }),
    ).toThrow(PillarConfigError)
  })
})
