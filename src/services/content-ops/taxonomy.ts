import type { CollectionSlug } from 'payload'
import type { Locale } from '@/i18n/locale'
import { locales } from '@/i18n/locale'
import { slugify } from '@/lib/slugify'
import type { OperationContext } from './types'

export type TaxonomyCollection = Extract<
  CollectionSlug,
  'services' | 'industries' | 'project-types' | 'context-tags'
>

export type TaxonomyResolution = {
  ids: number[]
  unresolved: string[]
}

/**
 * CLAUDE.md §33, §109 — AI assigns existing vocabulary only. Terms that do
 * not resolve are returned for `taxonomySuggestions`, never created.
 */
export async function resolveTaxonomyTerms(
  ctx: OperationContext,
  collection: TaxonomyCollection,
  terms: string[] | undefined,
): Promise<TaxonomyResolution> {
  if (!terms || terms.length === 0) return { ids: [], unresolved: [] }

  const ids: number[] = []
  const unresolved: string[] = []

  for (const term of terms) {
    const candidateSlug = slugify(term)
    let matchedId: number | null = null

    for (const locale of locales as readonly Locale[]) {
      const result = await ctx.req.payload.find({
        collection,
        locale,
        fallbackLocale: false,
        draft: true,
        depth: 0,
        limit: 1,
        overrideAccess: false,
        req: ctx.req,
        where: {
          or: [{ slug: { equals: candidateSlug } }, { name: { equals: term } }],
        },
      })

      const doc = result.docs[0]
      if (doc) {
        matchedId = doc.id
        break
      }
    }

    if (matchedId === null) {
      unresolved.push(term)
    } else if (!ids.includes(matchedId)) {
      ids.push(matchedId)
    }
  }

  return { ids, unresolved }
}
