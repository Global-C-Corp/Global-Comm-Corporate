import { z } from 'zod'
import { locales } from '@/i18n/locale'

export const localeSchema = z.enum(locales)

/** CLAUDE.md §107 — every AI-written fact carries where it came from. */
export const sourceReferenceSchema = z.object({
  type: z.enum(['user_provided', 'uploaded_document', 'existing_cms', 'public_url', 'human_verified']),
  label: z.string().min(1).max(300),
  url: z.string().url().max(500).optional(),
  note: z.string().max(1000).optional(),
  capturedAt: z.string().optional(),
})

export const metricSchema = z.object({
  value: z.string().max(60).optional(),
  label: z.string().min(1).max(160),
  sourceNote: z.string().max(500).optional(),
})
