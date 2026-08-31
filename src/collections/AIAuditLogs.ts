import type { CollectionConfig } from 'payload'
import { isPublisherOrAdmin } from '@/access/predicates'
import { locales } from '@/i18n/locale'

/**
 * CLAUDE.md §108. Immutable audit trail of every AI content-operation.
 * Written only by the content-ops service layer via `overrideAccess: true`
 * (there is no natural request-context user to attribute a system log
 * entry to) — never through the public API, REST, GraphQL or MCP.
 */
export const AIAuditLogs: CollectionConfig = {
  slug: 'ai-audit-logs',
  access: {
    create: () => false,
    delete: () => false,
    read: isPublisherOrAdmin,
    update: () => false,
  },
  admin: {
    useAsTitle: 'tool',
    defaultColumns: ['timestamp', 'actor', 'tool', 'action', 'targetCollection', 'result'],
    group: 'Private',
  },
  fields: [
    { name: 'timestamp', type: 'date', required: true, defaultValue: () => new Date().toISOString() },
    { name: 'actor', type: 'relationship', relationTo: 'users' },
    { name: 'apiKeyReference', type: 'text' },
    { name: 'tool', type: 'text', required: true },
    { name: 'action', type: 'text', required: true },
    { name: 'targetCollection', type: 'text' },
    { name: 'targetDocument', type: 'text' },
    { name: 'result', type: 'select', required: true, options: ['success', 'rejected', 'error'] },
    { name: 'correlationId', type: 'text', required: true, index: true },
    { name: 'changedFields', type: 'json' },
    { name: 'locale', type: 'select', options: locales.map((l) => ({ label: l, value: l })) },
    { name: 'errorCode', type: 'text' },
  ],
}
