import type { Field } from 'payload'
import { fieldPublisherOrAdmin } from '@/access/predicates'

/**
 * CLAUDE.md §109 — only authorized humans (publisher/admin) may create,
 * rename, merge, delete a taxonomy term or edit its aliases/internal
 * definition. AI and editors may still edit the term's public-facing
 * descriptive content (shortDescription, longDescription, etc.) — this
 * wrapper is applied only to the structural/identity fields.
 *
 * Because these fields are required, restricting `create` access on them
 * also prevents non-authorized roles from creating brand new terms at all,
 * while leaving `update` open on every other field of an existing term.
 */
export function governed(field: Field): Field {
  return {
    ...field,
    access: {
      create: fieldPublisherOrAdmin,
      update: fieldPublisherOrAdmin,
    },
  } as Field
}
