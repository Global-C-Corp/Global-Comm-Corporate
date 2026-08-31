import { APIError, ValidationError } from 'payload'
import type { CollectionBeforeChangeHook, GlobalBeforeChangeHook } from 'payload'
import { canPublish, canTransitionReviewStatus, isReviewStatus } from '@/access/editorialStateMachine'
import { getRole } from '@/access/predicates'
import { locales, localeNames, translationStatusKey, type Locale } from '@/i18n/locale'

/**
 * The publish gate refuses for four quite different reasons. Saying which one
 * applied — and what to do about it — is the difference between a workflow an
 * editor can follow and one that looks broken (CLAUDE.md §121).
 */
class EditorialWorkflowError extends APIError {
  constructor(message: string, status = 400) {
    super(message, status, undefined, true)
  }
}

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
  _status?: string | null
  slug?: string | null
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
      throw new EditorialWorkflowError(`“${data.reviewStatus}” is not a valid review status.`)
    }
    if (!canTransitionReviewStatus(role, previousReviewStatus, data.reviewStatus)) {
      throw new EditorialWorkflowError(
        `Your role (${role ?? 'none'}) cannot move the review status from “${previousReviewStatus ?? 'new'}” to ` +
          `“${data.reviewStatus}”. Editors and AI submit work for review; only a publisher or admin approves it.`,
        403,
      )
    }
  }

  // Track which locale is being edited in this request (CLAUDE.md §16).
  const touchedNonBookkeepingField = Object.keys(data).some((key) => !BOOKKEEPING_FIELDS.has(key))
  const existingDirty = new Set(originalDoc?.dirtyLocales ?? [])
  if (touchedNonBookkeepingField && requestLocale && (locales as readonly string[]).includes(requestLocale)) {
    existingDirty.add(requestLocale)
  }

  // CLAUDE.md §36, §105 — a metric value always carries its source. Payload
  // skips field validation on draft saves, so this invariant is enforced here
  // for every write path rather than only at publish time.
  if (Array.isArray(data.metrics)) {
    const unsupported = (data.metrics as { value?: unknown; sourceNote?: unknown }[]).some(
      (metric) => Boolean(metric?.value) && !metric?.sourceNote,
    )
    if (unsupported) {
      throw new ValidationError({
        errors: [{ path: 'metrics', message: 'A metric value requires a sourceNote citing where it came from.' }],
      })
    }
  }

  // Changing a published slug changes a live URL (CLAUDE.md §70).
  if (
    typeof data.slug === 'string' &&
    originalDoc?._status === 'published' &&
    typeof originalDoc.slug === 'string' &&
    data.slug !== originalDoc.slug &&
    !canPublish(role)
  ) {
    throw new EditorialWorkflowError(
      'Changing the slug of a published document changes a live URL and needs a redirect. ' +
        'Only a publisher or admin can do that.',
      403,
    )
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
      throw new EditorialWorkflowError(
        `Only a publisher or admin can publish. Your role is ${role ?? 'none'}.`,
        403,
      )
    }
    if (effectiveReviewStatus !== 'approved') {
      throw new EditorialWorkflowError(
        `This document cannot be published while its review status is “${effectiveReviewStatus ?? 'new'}”. ` +
          'Set Review status to “approved” first, then publish.',
      )
    }
    for (const locale of existingDirty) {
      const status = effectiveTranslationStatus[translationStatusKey(locale as Locale)] ?? 'missing'
      if (status !== 'approved') {
        throw new EditorialWorkflowError(
          `The ${localeNames[locale as Locale]} (${locale.toUpperCase()}) translation is “${status}”, not approved. ` +
            `Every locale edited since the last publish (${Array.from(existingDirty)
              .map((entry) => entry.toUpperCase())
              .join(', ')}) must be approved under Translation status before this document can be published.`,
        )
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
