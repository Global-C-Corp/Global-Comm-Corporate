import type { PayloadRequest, TypedUser, Where } from 'payload'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { translationStatusKey, type Locale } from '@/i18n/locale'

export async function getPayloadClient() {
  return getPayload({ config: configPromise })
}

/**
 * Every request-facing query carries this context. `draft` is true only in
 * an authenticated preview session (CLAUDE.md §87); public rendering always
 * runs with draft: false and no user.
 */
export type QueryContext = {
  locale: Locale
  draft?: boolean
  user?: TypedUser | null
}

/**
 * CLAUDE.md §85, §125 — request-facing reads never bypass access control,
 * never fall back across locales, and never see drafts unless a preview
 * session explicitly asked for them.
 */
export function baseQueryOptions(ctx: QueryContext) {
  return {
    locale: ctx.locale,
    fallbackLocale: false as const,
    draft: ctx.draft ?? false,
    overrideAccess: false,
    user: ctx.user ?? undefined,
  }
}

/**
 * A locale is publicly renderable only when its translation is approved
 * (CLAUDE.md §17). Applied as a query constraint so pagination counts stay
 * correct; preview sessions deliberately skip it.
 */
export function approvedLocaleWhere(ctx: QueryContext): Where | undefined {
  if (ctx.draft) return undefined
  return {
    [`translationStatus.${translationStatusKey(ctx.locale)}`]: {
      equals: 'approved',
    },
  }
}

export function combineWhere(...clauses: (Where | undefined)[]): Where | undefined {
  const present = clauses.filter((clause): clause is Where => Boolean(clause))
  if (present.length === 0) return undefined
  if (present.length === 1) return present[0]
  return { and: present }
}

export function requestUser(req: PayloadRequest): TypedUser | null {
  return (req.user as TypedUser | null) ?? null
}
