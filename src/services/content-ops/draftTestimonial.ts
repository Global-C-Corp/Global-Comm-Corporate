import { z } from 'zod'
import { writeAuditLog } from './audit'
import { applyFieldWhitelist, assertEditorialActor, buildProvenance, detectConflict } from './guards'
import { localeSchema, sourceReferenceSchema } from './schemas'
import { failure, success, type OperationContext, type OperationResult } from './types'

export const draftTestimonialSchema = z
  .object({
    testimonialId: z.number().optional(),
    internalTitle: z.string().min(1).max(200),
    originalQuote: z.string().min(1).max(4000),
    originalLocale: localeSchema,
    personName: z.string().max(160).optional(),
    personRole: z.string().max(160).optional(),
    organizationName: z.string().max(200).optional(),
    clientId: z.number().optional(),
    projectId: z.number().optional(),
    sourceReferences: z.array(sourceReferenceSchema).min(1),
    expectedUpdatedAt: z.string().optional(),
  })
  .refine((value) => Boolean(value.personName || value.organizationName), {
    message: 'Attribution is required: provide personName or organizationName.',
    path: ['personName'],
  })

export type DraftTestimonialInput = z.infer<typeof draftTestimonialSchema>

const WRITABLE_FIELDS = [
  'internalTitle',
  'originalQuote',
  'originalLocale',
  'personName',
  'personRole',
  'organizationName',
  'client',
  'project',
  'sourceReferences',
  'aiMeta',
] as const

/**
 * CLAUDE.md §37, §98, §105 — a testimonial requires a source and supported
 * attribution, the original wording is stored verbatim in its own locale,
 * and AI may never invent one.
 */
export async function draftTestimonial(
  ctx: OperationContext,
  input: DraftTestimonialInput,
): Promise<OperationResult<{ id: number; created: boolean }>> {
  const actorCheck = assertEditorialActor(ctx)
  if (actorCheck) {
    await writeAuditLog(ctx, { action: 'draftTestimonial', result: 'rejected', errorCode: 'forbidden' })
    return actorCheck as OperationResult<never>
  }

  let existing: { id: number; reviewStatus?: string | null; updatedAt?: string | null } | null = null
  if (input.testimonialId) {
    try {
      existing = await ctx.req.payload.findByID({
        collection: 'testimonials',
        id: input.testimonialId,
        draft: true,
        depth: 0,
        overrideAccess: false,
        req: ctx.req,
      })
    } catch {
      return failure('not_found', 'Testimonial not found.')
    }

    const conflict = detectConflict(existing, input.expectedUpdatedAt)
    if (conflict) {
      await writeAuditLog(ctx, {
        action: 'draftTestimonial',
        result: 'rejected',
        targetCollection: 'testimonials',
        targetDocument: existing.id,
        errorCode: 'conflict',
      })
      return conflict as OperationResult<never>
    }
  }

  const { data } = applyFieldWhitelist(
    {
      internalTitle: input.internalTitle,
      // Stored exactly as supplied — never paraphrased or "improved".
      originalQuote: input.originalQuote,
      originalLocale: input.originalLocale,
      personName: input.personName,
      personRole: input.personRole,
      organizationName: input.organizationName,
      client: input.clientId,
      project: input.projectId,
      sourceReferences: input.sourceReferences,
      aiMeta: buildProvenance(ctx, { sourceLocale: input.originalLocale }),
    },
    WRITABLE_FIELDS,
  )

  try {
    const doc = existing
      ? await ctx.req.payload.update({
          collection: 'testimonials',
          id: existing.id,
          locale: input.originalLocale,
          data: { ...data, reviewStatus: 'ai_draft' } as never,
          draft: true,
          overrideAccess: false,
          req: ctx.req,
        })
      : await ctx.req.payload.create({
          collection: 'testimonials',
          locale: input.originalLocale,
          data: { ...data, reviewStatus: 'ai_draft' } as never,
          draft: true,
          overrideAccess: false,
          req: ctx.req,
        })

    await writeAuditLog(ctx, {
      action: 'draftTestimonial',
      result: 'success',
      targetCollection: 'testimonials',
      targetDocument: doc.id,
      changedFields: Object.keys(data),
      locale: input.originalLocale,
    })

    return success({ id: doc.id, created: !existing })
  } catch (error) {
    await writeAuditLog(ctx, { action: 'draftTestimonial', result: 'error', targetCollection: 'testimonials' })
    return failure('invalid_input', error instanceof Error ? error.message : 'Failed to draft testimonial.')
  }
}
