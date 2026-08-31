import { z } from 'zod'
import { getPayloadClient } from '@/services/cms/context'

/**
 * CLAUDE.md §81, §115. Server-side validation with hard length caps, and a
 * short-window duplicate check that survives serverless (no in-memory state).
 */
const singleLine = (max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    // Strip CR/LF so a value can never be used to inject headers downstream.
    .transform((value) => value.replace(/[\r\n]+/g, ' '))

export const inquirySchema = z.object({
  name: singleLine(120),
  company: singleLine(160),
  email: z.string().trim().email().max(254),
  phone: singleLine(40).optional().or(z.literal('')),
  website: singleLine(200).optional().or(z.literal('')),
  projectType: z.string().trim().max(60).optional().or(z.literal('')),
  estimatedBudget: singleLine(80).optional().or(z.literal('')),
  desiredStart: z.string().trim().max(40).optional().or(z.literal('')),
  message: z.string().trim().min(10).max(5000),
  consent: z.literal(true, { errorMap: () => ({ message: 'required' }) }),
})

export type InquiryInput = z.infer<typeof inquirySchema>

export type InquiryResult = { ok: true } | { ok: false; errors: Record<string, string> }

const DUPLICATE_WINDOW_MS = 5 * 60 * 1000

export async function createInquiry(raw: unknown): Promise<InquiryResult> {
  const parsed = inquirySchema.safeParse(raw)
  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (typeof key === 'string' && !errors[key]) errors[key] = issue.message
    }
    return { ok: false, errors }
  }

  const data = parsed.data
  const payload = await getPayloadClient()

  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString()
  const recent = await payload.find({
    collection: 'inquiries',
    where: {
      and: [{ email: { equals: data.email } }, { createdAt: { greater_than: since } }],
    },
    limit: 1,
    depth: 0,
    // Duplicate detection is a server-side integrity check on a collection
    // the public cannot read; the submitter is anonymous by design.
    overrideAccess: true,
  })

  if (recent.totalDocs > 0) {
    return { ok: false, errors: { message: 'duplicate' } }
  }

  const projectTypeId = data.projectType ? Number.parseInt(data.projectType, 10) : undefined

  await payload.create({
    collection: 'inquiries',
    overrideAccess: false,
    data: {
      name: data.name,
      company: data.company,
      email: data.email,
      phone: data.phone || undefined,
      website: data.website || undefined,
      projectType: Number.isFinite(projectTypeId) ? projectTypeId : undefined,
      estimatedBudget: data.estimatedBudget || undefined,
      desiredStart: data.desiredStart || undefined,
      message: data.message,
      consent: true,
    },
  })

  return { ok: true }
}
