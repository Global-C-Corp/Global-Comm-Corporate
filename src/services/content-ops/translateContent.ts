import { z } from 'zod'
import { translateApprovedTerm } from '@/i18n/terminology'
import { textToLexical } from '@/lib/lexical'
import { writeAuditLog } from './audit'
import { aiTranslationStatus, assertEditorialActor, buildProvenance, detectConflict } from './guards'
import { localeSchema } from './schemas'
import { failure, success, type OperationContext, type OperationResult } from './types'
import type { Locale } from '@/i18n/locale'

/**
 * Localized fields the translation tool may write, per collection
 * (CLAUDE.md §19, §64, §113). Shared facts — relationships, metric values,
 * client identity, media — are deliberately absent.
 */
const TRANSLATABLE_FIELDS: Record<string, { plain: string[]; rich: string[] }> = {
  services: {
    plain: ['name', 'shortDescription'],
    rich: ['longDescription', 'clientProblem', 'approach', 'deliverables', 'outcomes'],
  },
  industries: {
    plain: ['name', 'shortDescription'],
    rich: ['longDescription', 'challenges', 'capabilities'],
  },
  projects: {
    plain: ['title', 'shortStatement', 'excerpt', 'resultsNote'],
    rich: ['challenge', 'approach', 'deliverables', 'outcome'],
  },
  clients: {
    plain: ['shortDescription'],
    rich: ['longDescription'],
  },
  testimonials: {
    plain: ['translatedQuote'],
    rich: [],
  },
}

export const translateContentSchema = z.object({
  collection: z.enum(['services', 'industries', 'projects', 'clients', 'testimonials']),
  documentId: z.number(),
  sourceLocale: localeSchema,
  targetLocale: localeSchema,
  translations: z.record(z.string(), z.string().max(8000)),
  expectedUpdatedAt: z.string().optional(),
})

export type TranslateContentInput = z.infer<typeof translateContentSchema>

/**
 * CLAUDE.md §64-§65. The MCP client supplies the translated strings; this
 * service enforces which fields may be translated, normalizes approved
 * terminology, preserves every shared fact, and saves a draft with the
 * target locale marked as an AI draft. It never approves or publishes.
 */
export async function translateContent(
  ctx: OperationContext,
  input: TranslateContentInput,
): Promise<OperationResult<{ id: number; translatedFields: string[]; rejectedFields: string[] }>> {
  const actorCheck = assertEditorialActor(ctx)
  if (actorCheck) {
    await writeAuditLog(ctx, { action: 'translateContent', result: 'rejected', errorCode: 'forbidden' })
    return actorCheck as OperationResult<never>
  }

  if (input.sourceLocale === input.targetLocale) {
    return failure('invalid_input', 'sourceLocale and targetLocale must differ.')
  }

  let existing
  try {
    existing = await ctx.req.payload.findByID({
      collection: input.collection,
      id: input.documentId,
      locale: input.targetLocale,
      fallbackLocale: false,
      draft: true,
      depth: 0,
      overrideAccess: false,
      req: ctx.req,
    })
  } catch {
    return failure('not_found', 'Document not found.')
  }

  const conflict = detectConflict(existing, input.expectedUpdatedAt)
  if (conflict) {
    await writeAuditLog(ctx, {
      action: 'translateContent',
      result: 'rejected',
      targetCollection: input.collection,
      targetDocument: input.documentId,
      errorCode: 'conflict',
      locale: input.targetLocale as Locale,
    })
    return conflict as OperationResult<never>
  }

  const allowed = TRANSLATABLE_FIELDS[input.collection]
  const data: Record<string, unknown> = {}
  const translatedFields: string[] = []
  const rejectedFields: string[] = []

  for (const [field, value] of Object.entries(input.translations)) {
    const normalized = translateApprovedTerm(value, input.sourceLocale as Locale, input.targetLocale as Locale)

    if (allowed.plain.includes(field)) {
      data[field] = normalized
      translatedFields.push(field)
    } else if (allowed.rich.includes(field)) {
      data[field] = textToLexical(normalized)
      translatedFields.push(field)
    } else {
      rejectedFields.push(field)
    }
  }

  if (translatedFields.length === 0) {
    await writeAuditLog(ctx, {
      action: 'translateContent',
      result: 'rejected',
      targetCollection: input.collection,
      targetDocument: input.documentId,
      errorCode: 'invalid_input',
    })
    return failure('invalid_input', 'No translatable fields supplied.', { rejectedFields })
  }

  try {
    await ctx.req.payload.update({
      collection: input.collection,
      id: input.documentId,
      locale: input.targetLocale,
      data: {
        ...data,
        reviewStatus: 'ai_draft',
        translationStatus: aiTranslationStatus(input.targetLocale as Locale),
        aiMeta: buildProvenance(ctx, {
          sourceLocale: input.sourceLocale as Locale,
          targetLocale: input.targetLocale as Locale,
        }),
      } as never,
      draft: true,
      overrideAccess: false,
      req: ctx.req,
    })

    await writeAuditLog(ctx, {
      action: 'translateContent',
      result: 'success',
      targetCollection: input.collection,
      targetDocument: input.documentId,
      changedFields: translatedFields,
      locale: input.targetLocale as Locale,
    })

    return success({ id: input.documentId, translatedFields, rejectedFields })
  } catch (error) {
    await writeAuditLog(ctx, { action: 'translateContent', result: 'error', targetCollection: input.collection })
    return failure('invalid_input', error instanceof Error ? error.message : 'Failed to translate content.')
  }
}
