import { getRole } from '@/access/predicates'
import type { Locale } from '@/i18n/locale'
import { translationStatusKey } from '@/i18n/locale'
import { failure, type OperationContext, type OperationResult } from './types'

/**
 * CLAUDE.md §113 — every tool declares exactly what it may write. Anything
 * outside the whitelist is dropped rather than silently persisted, and a
 * model-generated object is never handed to Payload as-is (§103).
 */
export function applyFieldWhitelist<T extends Record<string, unknown>>(
  input: T,
  allowed: readonly string[],
): { data: Record<string, unknown>; rejected: string[] } {
  const data: Record<string, unknown> = {}
  const rejected: string[] = []

  for (const [key, value] of Object.entries(input)) {
    if (value === undefined) continue
    if (allowed.includes(key)) {
      data[key] = value
    } else {
      rejected.push(key)
    }
  }

  return { data, rejected }
}

/** AI provenance stamped on every AI write (CLAUDE.md §106, §138). */
export function buildProvenance(
  ctx: OperationContext,
  { sourceLocale, targetLocale }: { sourceLocale?: Locale; targetLocale?: Locale } = {},
) {
  const now = new Date().toISOString()
  const actorId = ctx.req.user?.id

  return {
    generatedByAI: true,
    provider: ctx.provider,
    model: ctx.model,
    operation: ctx.tool,
    generatedAt: now,
    runId: ctx.correlationId,
    actorUser: typeof actorId === 'number' ? actorId : undefined,
    sourceLocale,
    targetLocale,
    lastAIUpdate: now,
  }
}

/**
 * CLAUDE.md §112 — AI must not overwrite current human work. An approved or
 * published document is off-limits until a human moves it back into a
 * drafting state.
 */
export function detectConflict(
  doc: { reviewStatus?: string | null; _status?: string | null; updatedAt?: string | null },
  expectedUpdatedAt?: string,
): OperationResult<true> | null {
  if (doc.reviewStatus === 'approved') {
    return failure('conflict', 'Document is approved; AI may not modify it until a human requests revisions.')
  }
  if (expectedUpdatedAt && doc.updatedAt && doc.updatedAt !== expectedUpdatedAt) {
    return failure('conflict', 'Document changed since it was read. Re-read the document and retry.')
  }
  return null
}

/** AI may only ever act as an editorial operator, never as a publisher (§25). */
export function assertEditorialActor(ctx: OperationContext): OperationResult<true> | null {
  const role = getRole(ctx.req)
  if (!role) {
    return failure('forbidden', 'Authentication required.')
  }
  if (role === 'ai_editor' || role === 'editor' || role === 'publisher' || role === 'admin') {
    return null
  }
  return failure('forbidden', 'Role is not permitted to run content operations.')
}

/** Marks the locale being drafted as an AI draft awaiting human review (§16, §64). */
export function aiTranslationStatus(locale: Locale) {
  return { [translationStatusKey(locale)]: 'ai_draft' as const }
}

/**
 * CLAUDE.md §36, §105 — a metric may only be written when it carries a
 * source. Unsupported values are dropped, never estimated.
 */
export function filterEvidencedMetrics(
  metrics: { value?: string; label: string; sourceNote?: string }[] | undefined,
): { kept: { value?: string; label: string; sourceNote?: string }[]; dropped: number } {
  if (!metrics) return { kept: [], dropped: 0 }

  const kept = metrics.filter((metric) => !metric.value || Boolean(metric.sourceNote))
  return { kept, dropped: metrics.length - kept.length }
}
