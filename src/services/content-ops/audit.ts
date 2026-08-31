import type { Locale } from '@/i18n/locale'
import type { OperationContext, OperationErrorCode } from './types'

/**
 * CLAUDE.md §108. Written with overrideAccess because the audit collection
 * denies writes to every API caller — only this service may append to it.
 * Never records API keys, passwords or model reasoning.
 */
export async function writeAuditLog(
  ctx: OperationContext,
  entry: {
    action: string
    result: 'success' | 'rejected' | 'error'
    targetCollection?: string
    targetDocument?: string | number
    changedFields?: string[]
    locale?: Locale
    errorCode?: OperationErrorCode
  },
): Promise<void> {
  const actorId = ctx.req.user?.id

  try {
    await ctx.req.payload.create({
      collection: 'ai-audit-logs',
      overrideAccess: true,
      req: ctx.req,
      data: {
        timestamp: new Date().toISOString(),
        actor: typeof actorId === 'number' ? actorId : undefined,
        apiKeyReference: ctx.provider ? `${ctx.provider}${ctx.model ? `/${ctx.model}` : ''}` : undefined,
        tool: ctx.tool,
        action: entry.action,
        targetCollection: entry.targetCollection,
        targetDocument: entry.targetDocument !== undefined ? String(entry.targetDocument) : undefined,
        result: entry.result,
        correlationId: ctx.correlationId,
        changedFields: entry.changedFields ?? [],
        locale: entry.locale,
        errorCode: entry.errorCode,
      },
    })
  } catch (error) {
    // An audit write must never mask the operation's own outcome, but it
    // must be visible in server logs (CLAUDE.md §122).
    ctx.req.payload.logger.error({ err: error, correlationId: ctx.correlationId }, 'Failed to write AI audit log')
  }
}
