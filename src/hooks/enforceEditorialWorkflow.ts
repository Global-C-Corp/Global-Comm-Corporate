import { APIError, ValidationError } from 'payload'
import type { CollectionBeforeChangeHook, GlobalBeforeChangeHook } from 'payload'
import { canPublish, canTransitionReviewStatus, isReviewStatus } from '@/access/editorialStateMachine'
import { getRole } from '@/access/predicates'
import { hasContentChange } from '@/lib/contentChange'
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
 * Request-level opt-in for the compound approve-and-publish action.
 *
 * §18 and §27 require that review and every dirty locale be approved before
 * a document publishes. They do not require those approvals to arrive as
 * separate saves: an actor who may set both fields and then publish can
 * already reach that end state, three round trips later. This flag lets one
 * authorized request carry the preconditions it satisfies.
 *
 * It is deliberately explicit rather than implied by every publish, so a
 * bare `_status: 'published'` through REST, GraphQL, the Local API or an MCP
 * tool still meets the strict gate unchanged.
 */
export const APPROVE_AND_PUBLISH = '_approveAndPublish'

/**
 * Fields that never represent editorial content by themselves. A change
 * limited to these fields does not mark a locale dirty (CLAUDE.md §16).
 */
const BOOKKEEPING_FIELDS = new Set([
  'id',
  '_status',
  APPROVE_AND_PUBLISH,
  'reviewStatus',
  'translationStatus',
  'dirtyLocales',
  'approvedBy',
  'approvedAt',
  'taxonomySuggestions',
  'sourceReferences',
  'aiMeta',
  'updatedAt',
  'createdAt',
])

type EditorialDoc = {
  approvedBy?: unknown
  approvedAt?: string | null
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
  /** Recorded as the approver when this request moves review to approved. */
  userId?: number | string | null
  requestLocale?: string | null
  operation: 'create' | 'update'
}

/**
 * Enforces CLAUDE.md §17-§18, §26-§27 regardless of entry point (Admin UI,
 * REST, GraphQL, Local API, or an MCP tool). UI restrictions alone are
 * insufficient (§27) — this is the server-side authority.
 */
export function applyEditorialGuard({ data, originalDoc, role, userId, requestLocale, operation }: GuardArgs) {
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
  // Payload passes the whole merged document here, so this compares values
  // against what is stored rather than trusting which keys are present —
  // otherwise opening a document in a locale and saving would mark it dirty
  // and manufacture approval work.
  const touchedNonBookkeepingField = hasContentChange(data, originalDoc, BOOKKEEPING_FIELDS)
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

  let effectiveReviewStatus = (data.reviewStatus as string | undefined) ?? previousReviewStatus
  const effectiveTranslationStatus = {
    ...(originalDoc?.translationStatus ?? {}),
    ...(data.translationStatus as Record<string, string> | undefined),
  }

  const requestedApproveAndPublish = data[APPROVE_AND_PUBLISH] === true
  delete data[APPROVE_AND_PUBLISH]

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

    // The compound action satisfies the preconditions in this same request,
    // but only ones this role could have satisfied on its own: approval is
    // still checked against the transition table, and only locales already
    // marked dirty are approved, so publishing FR never publishes EN or ES.
    if (requestedApproveAndPublish) {
      if (effectiveReviewStatus !== 'approved') {
        if (!canTransitionReviewStatus(role, previousReviewStatus, 'approved')) {
          throw new EditorialWorkflowError(
            `Your role (${role ?? 'none'}) cannot move the review status from ` +
              `“${previousReviewStatus ?? 'new'}” to “approved”, so it cannot approve and publish in one step.`,
            403,
          )
        }
        data.reviewStatus = 'approved'
        effectiveReviewStatus = 'approved'
      }

      for (const locale of existingDirty) {
        const key = translationStatusKey(locale as Locale)
        if (effectiveTranslationStatus[key] !== 'approved') {
          effectiveTranslationStatus[key] = 'approved'
        }
      }
      data.translationStatus = { ...effectiveTranslationStatus }
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

  // Payload's version rows carry no author, so approval provenance is stored
  // on the document itself. It is written on whichever request moves review to
  // approved, so the manual path and the compound action record it alike, in
  // the same version snapshot as the publish.
  if (data.reviewStatus === 'approved' && previousReviewStatus !== 'approved') {
    data.approvedBy = userId ?? null
    data.approvedAt = new Date().toISOString()
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
    userId: req.user?.id,
    requestLocale: req.locale,
    operation,
  })
}

export const enforceEditorialWorkflowGlobal: GlobalBeforeChangeHook = ({ data, originalDoc, req }) => {
  return applyEditorialGuard({
    data,
    originalDoc,
    role: getRole(req),
    userId: req.user?.id,
    requestLocale: req.locale,
    operation: originalDoc ? 'update' : 'create',
  })
}
