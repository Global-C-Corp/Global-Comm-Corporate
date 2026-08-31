import type { Field } from 'payload'
import { locales } from '@/i18n/locale'
import { defaultReviewStatus, reviewStatuses } from '@/access/editorialStateMachine'

/**
 * Shared editorial-workflow fields (CLAUDE.md §16, §26, §106-§107).
 * Spread these into every multilingual public entity and page global.
 */
export const editorialFields: Field[] = [
  {
    name: 'reviewStatus',
    type: 'select',
    required: true,
    defaultValue: ({ user }) => defaultReviewStatus((user as { role?: string } | undefined)?.role as never),
    options: reviewStatuses.map((value) => ({ label: value, value })),
    admin: {
      position: 'sidebar',
    },
  },
  {
    name: 'translationStatus',
    type: 'group',
    admin: { position: 'sidebar' },
    fields: locales.map((locale) => ({
      name: locale,
      type: 'select',
      defaultValue: 'missing',
      options: [
        { label: 'Missing', value: 'missing' },
        { label: 'AI draft', value: 'ai_draft' },
        { label: 'Needs review', value: 'needs_review' },
        { label: 'Approved', value: 'approved' },
      ],
    })),
  },
  {
    name: 'dirtyLocales',
    type: 'select',
    hasMany: true,
    options: locales.map((locale) => ({ label: locale, value: locale })),
    admin: {
      position: 'sidebar',
      description: 'Locales changed since the last publish. Managed automatically.',
      readOnly: true,
    },
  },
  {
    name: 'taxonomySuggestions',
    type: 'array',
    admin: {
      position: 'sidebar',
      description: 'Unrecognized classification terms suggested by AI, pending human review (CLAUDE.md §33, §109).',
    },
    fields: [{ name: 'label', type: 'text', required: true }],
  },
  {
    name: 'sourceReferences',
    type: 'array',
    fields: [
      {
        name: 'type',
        type: 'select',
        required: true,
        options: ['user_provided', 'uploaded_document', 'existing_cms', 'public_url', 'human_verified'],
      },
      { name: 'label', type: 'text', required: true },
      { name: 'url', type: 'text' },
      { name: 'note', type: 'text' },
      { name: 'capturedAt', type: 'date' },
    ],
  },
  {
    name: 'aiMeta',
    type: 'group',
    label: 'AI Provenance',
    admin: { position: 'sidebar', description: 'CLAUDE.md §106 — never stores hidden chain-of-thought.' },
    fields: [
      { name: 'generatedByAI', type: 'checkbox', defaultValue: false },
      { name: 'provider', type: 'text' },
      { name: 'model', type: 'text' },
      { name: 'operation', type: 'text' },
      { name: 'generatedAt', type: 'date' },
      { name: 'runId', type: 'text' },
      { name: 'actorUser', type: 'relationship', relationTo: 'users' },
      { name: 'sourceLocale', type: 'select', options: locales.map((l) => ({ label: l, value: l })) },
      { name: 'targetLocale', type: 'select', options: locales.map((l) => ({ label: l, value: l })) },
      { name: 'lastAIUpdate', type: 'date' },
    ],
  },
]

/**
 * Page globals (CLAUDE.md §41-§45) are not classified/evidenced entities,
 * so taxonomySuggestions and sourceReferences don't apply to them.
 */
export const pageGlobalEditorialFields: Field[] = editorialFields.filter(
  (field) => !('name' in field) || (field.name !== 'taxonomySuggestions' && field.name !== 'sourceReferences'),
)
