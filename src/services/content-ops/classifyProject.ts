import { z } from 'zod'
import { writeAuditLog } from './audit'
import { applyFieldWhitelist, assertEditorialActor, buildProvenance, detectConflict } from './guards'
import { resolveTaxonomyTerms } from './taxonomy'
import { failure, success, type OperationContext, type OperationResult } from './types'

export const classifyProjectSchema = z.object({
  projectId: z.number(),
  services: z.array(z.string().min(1)).max(20).optional(),
  industries: z.array(z.string().min(1)).max(10).optional(),
  projectTypes: z.array(z.string().min(1)).max(10).optional(),
  contextTags: z.array(z.string().min(1)).max(20).optional(),
  expectedUpdatedAt: z.string().optional(),
})

export type ClassifyProjectInput = z.infer<typeof classifyProjectSchema>

/** CLAUDE.md §99 — classification only; unrelated fields are not writable. */
const WRITABLE_FIELDS = ['services', 'industries', 'projectTypes', 'contextTags', 'taxonomySuggestions', 'aiMeta'] as const

export async function classifyProject(
  ctx: OperationContext,
  input: ClassifyProjectInput,
): Promise<OperationResult<{ id: number; taxonomySuggestions: string[] }>> {
  const actorCheck = assertEditorialActor(ctx)
  if (actorCheck) {
    await writeAuditLog(ctx, { action: 'classifyProject', result: 'rejected', errorCode: 'forbidden' })
    return actorCheck as OperationResult<never>
  }

  let existing
  try {
    existing = await ctx.req.payload.findByID({
      collection: 'projects',
      id: input.projectId,
      draft: true,
      depth: 0,
      overrideAccess: false,
      req: ctx.req,
    })
  } catch {
    return failure('not_found', 'Project not found.')
  }

  const conflict = detectConflict(existing, input.expectedUpdatedAt)
  if (conflict) {
    await writeAuditLog(ctx, {
      action: 'classifyProject',
      result: 'rejected',
      targetCollection: 'projects',
      targetDocument: input.projectId,
      errorCode: 'conflict',
    })
    return conflict as OperationResult<never>
  }

  const [services, industries, projectTypes, contextTags] = await Promise.all([
    resolveTaxonomyTerms(ctx, 'services', input.services),
    resolveTaxonomyTerms(ctx, 'industries', input.industries),
    resolveTaxonomyTerms(ctx, 'project-types', input.projectTypes),
    resolveTaxonomyTerms(ctx, 'context-tags', input.contextTags),
  ])

  const suggestions = [
    ...services.unresolved,
    ...industries.unresolved,
    ...projectTypes.unresolved,
    ...contextTags.unresolved,
  ]

  const { data } = applyFieldWhitelist(
    {
      services: input.services ? services.ids : undefined,
      industries: input.industries ? industries.ids : undefined,
      projectTypes: input.projectTypes ? projectTypes.ids : undefined,
      contextTags: input.contextTags ? contextTags.ids : undefined,
      taxonomySuggestions: suggestions.length > 0 ? suggestions.map((label) => ({ label })) : undefined,
      aiMeta: buildProvenance(ctx),
    },
    WRITABLE_FIELDS,
  )

  try {
    await ctx.req.payload.update({
      collection: 'projects',
      id: input.projectId,
      data: data as never,
      draft: true,
      overrideAccess: false,
      req: ctx.req,
    })

    await writeAuditLog(ctx, {
      action: 'classifyProject',
      result: 'success',
      targetCollection: 'projects',
      targetDocument: input.projectId,
      changedFields: Object.keys(data),
    })

    return success({ id: input.projectId, taxonomySuggestions: suggestions })
  } catch (error) {
    await writeAuditLog(ctx, { action: 'classifyProject', result: 'error', targetCollection: 'projects' })
    return failure('invalid_input', error instanceof Error ? error.message : 'Failed to classify project.')
  }
}
