import { Forbidden } from 'payload'
import type { CollectionBeforeChangeHook, GlobalBeforeChangeHook } from 'payload'
import { canPublish, canTransitionReviewStatus, isReviewStatus } from '@/access/editorialStateMachine'
import { getRole } from '@/access/predicates'
import { locales } from '@/i18n/locale'

/**
 * Fields that never represent editorial content by themselves. A change
 * limited to these fields does not mark a locale dirty (CLAUDE.md §16).
 */
const BOOKKEEPING_FIELDS = new Set([
  'id',
  '_status',
  'reviewStatus',
  'translationStatus',
  'dirtyLocales',
  'taxonomySuggestions',
  'sourceReferences',
  'aiMeta',
  'updatedAt',
  'createdAt',
])

type EditorialDoc = {
  reviewStatus?: string
  translationStatus?: Record<string, string>
  dirtyLocales?: string[]
}

type GuardArgs = {
  data: Record<string, unknown> & EditorialDoc
  originalDoc?: (Record<string, unknown> & EditorialDoc) | null
  role: ReturnType<typeof getRole>
  requestLocale?: string | null
  operation: 'create' | 'update'
}

/**
 * Enforces CLAUDE.md §17-§18, §26-§27 regardless of entry point (Admin UI,
 * REST, GraphQL, Local API, or an MCP tool). UI restrictions alone are
 * insufficient (§27) — this is the server-side authority.
 */
export function applyEditorialGuard({ data, originalDoc, role, requestLocale, operation }: GuardArgs) {
  const previousReviewStatus = isReviewStatus(originalDoc?.reviewStatus) ? originalDoc?.reviewStatus : undefined

  if (typeof data.reviewStatus === 'string' && data.reviewStatus !== previousReviewStatus) {
    if (!isReviewStatus(data.reviewStatus)) {
      throw new Forbidden()
    }
    if (!canTransitionReviewStatus(role, previousReviewStatus, data.reviewStatus)) {
      throw new Forbidden()
    }
  }

  // Track which locale is being edited in this request (CLAUDE.md §16).
  const touchedNonBookkeepingField = Object.keys(data).some((key) => !BOOKKEEPING_FIELDS.has(key))
  const existingDirty = new Set(originalDoc?.dirtyLocales ?? [])
  if (touchedNonBookkeepingField && requestLocale && (locales as readonly string[]).includes(requestLocale)) {
    existingDirty.add(requestLocale)
  }

  const effectiveReviewStatus = (data.reviewStatus as string | undefined) ?? previousReviewStatus
  const effectiveTranslationStatus = {
    ...(originalDoc?.translationStatus ?? {}),
    ...(data.translationStatus as Record<string, string> | undefined),
  }

  // Publishing gate (CLAUDE.md §27): _status is set to 'published' by Payload
  // when an operation is called with draft:false (Admin "Publish" button, or
  // an explicit publish request) — never by directly writing the field.
  if (data._status === 'published') {
    if (!canPublish(role)) {
      throw new Forbidden()
    }
    if (effectiveReviewStatus !== 'approved') {
      throw new Forbidden()
    }
    for (const locale of existingDirty) {
      if (effectiveTranslationStatus[locale] !== 'approved') {
        throw new Forbidden()
      }
    }
    // A successful publish clears dirtyLocales — everything live is now clean.
    data.dirtyLocales = []
  } else {
    data.dirtyLocales = Array.from(existingDirty)
  }

  if (operation === 'create' && !data.reviewStatus) {
    data.reviewStatus = role === 'ai_editor' ? 'ai_draft' : 'editorial_draft'
  }

  return data
}

export const enforceEditorialWorkflowCollection: CollectionBeforeChangeHook = ({
  data,
  originalDoc,
  req,
  operation,
}) => {
  return applyEditorialGuard({
    data,
    originalDoc,
    role: getRole(req),
    requestLocale: req.locale,
    operation,
  })
}

export const enforceEditorialWorkflowGlobal: GlobalBeforeChangeHook = ({ data, originalDoc, req }) => {
  return applyEditorialGuard({
    data,
    originalDoc,
    role: getRole(req),
    requestLocale: req.locale,
    operation: originalDoc ? 'update' : 'create',
  })
}
