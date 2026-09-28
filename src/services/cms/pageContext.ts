import { draftMode } from 'next/headers'
import type { QueryContext } from './context'

export type PageContext = {
  draft: boolean
  ctx: QueryContext
}

/**
 * Shared per-request setup for every public page.
 *
 * The public site is single-language, so the query context is pinned to the
 * French row. Payload still stores three locales internally; the frontend
 * simply never asks for the other two.
 */
export async function getPageContext(): Promise<PageContext> {
  const { isEnabled: draft } = await draftMode()
  return { draft, ctx: { locale: 'fr', draft } }
}
