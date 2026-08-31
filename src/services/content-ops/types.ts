import type { PayloadRequest } from 'payload'
import type { Locale } from '@/i18n/locale'

/**
 * Every AI content operation runs through this layer (CLAUDE.md §94).
 * MCP tool handlers stay thin: schema in, service call out.
 */
export type OperationContext = {
  req: PayloadRequest
  tool: string
  correlationId: string
  provider?: string
  model?: string
  locale?: Locale
}

export type OperationErrorCode =
  | 'forbidden'
  | 'invalid_input'
  | 'not_found'
  | 'ambiguous_match'
  | 'conflict'
  | 'unsupported_taxonomy'
  | 'evidence_required'

export type OperationResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: OperationErrorCode; message: string; details?: unknown }

export function failure(
  code: OperationErrorCode,
  message: string,
  details?: unknown,
): { ok: false; code: OperationErrorCode; message: string; details?: unknown } {
  return { ok: false, code, message, details }
}

export function success<T>(data: T): { ok: true; data: T } {
  return { ok: true, data }
}
