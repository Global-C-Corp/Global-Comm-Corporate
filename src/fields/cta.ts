import type { Field } from 'payload'

/** Structured call-to-action: localized label + internal/external target. */
export const ctaField = (name: string): Field => ({
  name,
  type: 'group',
  fields: [
    { name: 'label', type: 'text', localized: true },
    { name: 'url', type: 'text' },
  ],
})
