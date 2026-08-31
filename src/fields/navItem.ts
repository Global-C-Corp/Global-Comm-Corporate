import type { Field } from 'payload'

/**
 * Structured navigation target (CLAUDE.md §40) — no arbitrary HTML. `url`
 * is either an internal relative path (starting with "/") or an absolute
 * external URL.
 */
export const navItemsField = (name: string): Field => ({
  name,
  type: 'array',
  fields: [
    { name: 'label', type: 'text', required: true, localized: true },
    { name: 'url', type: 'text', required: true },
    { name: 'opensInNewTab', type: 'checkbox', defaultValue: false },
  ],
})
