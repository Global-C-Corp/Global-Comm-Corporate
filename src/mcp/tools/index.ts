import { randomUUID } from 'crypto'
import type { PayloadRequest } from 'payload'
import type { z } from 'zod'
import { auditContent, auditContentSchema } from '@/services/content-ops/auditContent'
import { classifyProject, classifyProjectSchema } from '@/services/content-ops/classifyProject'
import { draftClient, draftClientSchema } from '@/services/content-ops/draftClient'
import { draftProject, draftProjectSchema } from '@/services/content-ops/draftProject'
import { draftTestimonial, draftTestimonialSchema } from '@/services/content-ops/draftTestimonial'
import { prepareSEO, prepareSEOSchema } from '@/services/content-ops/prepareSEO'
import { submitForReview, submitForReviewSchema } from '@/services/content-ops/submitForReview'
import { translateContent, translateContentSchema } from '@/services/content-ops/translateContent'
import type { OperationContext, OperationResult } from '@/services/content-ops/types'

type ToolResponse = { content: Array<{ text: string; type: 'text' }> }

function respond(result: OperationResult<unknown>): ToolResponse {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result.ok ? { ok: true, data: result.data } : result, null, 2),
      },
    ],
  }
}

/**
 * MCP handlers stay thin: validate, build the operation context, delegate to
 * the content-operations service (CLAUDE.md §94, §103). Bearer tokens are
 * never read or logged here — the plugin resolves them to req.user.
 */
function buildTool<Schema extends z.ZodType>(
  name: string,
  description: string,
  schema: Schema,
  run: (ctx: OperationContext, input: z.infer<Schema>) => Promise<OperationResult<unknown>>,
) {
  return {
    name,
    description,
    parameters: (schema as unknown as { shape: z.ZodRawShape }).shape,
    handler: async (args: Record<string, unknown>, req: PayloadRequest): Promise<ToolResponse> => {
      const parsed = schema.safeParse(args)
      if (!parsed.success) {
        return respond({
          ok: false,
          code: 'invalid_input',
          message: 'Input failed schema validation.',
          details: parsed.error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
        })
      }

      const ctx: OperationContext = {
        req,
        tool: name,
        correlationId: randomUUID(),
        provider: typeof args.provider === 'string' ? args.provider : undefined,
        model: typeof args.model === 'string' ? args.model : undefined,
      }

      return respond(await run(ctx, parsed.data))
    },
  }
}

export const aiTools = [
  buildTool(
    'draftClient',
    'Create or update a Client as an AI draft. Matches an existing client by id, domain, then exact name; reports ambiguity instead of merging. Requires at least one source reference. Never publishes.',
    draftClientSchema,
    draftClient,
  ),
  buildTool(
    'draftProject',
    'Create or update a Project as an AI draft. Resolves the client, assigns only existing taxonomy terms (unknown terms are returned as suggestions), and drops any metric that has no source. Never publishes.',
    draftProjectSchema,
    draftProject,
  ),
  buildTool(
    'draftTestimonial',
    'Create or update a Testimonial as an AI draft. Requires a source and attribution; stores the original wording verbatim in its original locale. Never invent a testimonial.',
    draftTestimonialSchema,
    draftTestimonial,
  ),
  buildTool(
    'classifyProject',
    'Set a Project\'s services, industries, project types and context tags from existing vocabulary only. Unrecognized terms are recorded as taxonomy suggestions for a human.',
    classifyProjectSchema,
    classifyProject,
  ),
  buildTool(
    'translateContent',
    'Write supplied translations into a target locale for the localized fields of one document. Shared facts, relationships and metrics are never touched. Marks the target locale as an AI draft.',
    translateContentSchema,
    translateContent,
  ),
  buildTool(
    'prepareSEO',
    'Prepare SEO and OpenGraph metadata (and robots flags) for one locale of a document. Cannot set a canonical override.',
    prepareSEOSchema,
    prepareSEO,
  ),
  buildTool(
    'auditContent',
    'Read-only report of missing SEO, media, classification, evidence, proof and translations, plus unreviewed AI drafts.',
    auditContentSchema,
    auditContent,
  ),
  buildTool(
    'submitForReview',
    'Move an AI draft or a revision-requested document to needs_review. Never approves or publishes.',
    submitForReviewSchema,
    submitForReview,
  ),
]
