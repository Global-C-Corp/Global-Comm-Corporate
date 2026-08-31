import type { Field } from 'payload'
import { slugify } from '@/lib/slugify'

/**
 * Localized, unique, auto-derived slug (CLAUDE.md §60).
 *
 * Anyone who may edit the document may set the slug — it is derived from a
 * title they already control. What needs protecting is changing the slug of
 * an already-published document, because that changes a live URL and
 * requires redirect handling (§70); that rule is enforced for every write
 * path in the editorial guard hook, not by hiding the field.
 */
export function localizedSlugField(sourceFieldName: string): Field {
  return {
    name: 'slug',
    type: 'text',
    required: true,
    localized: true,
    unique: true,
    index: true,
    hooks: {
      beforeValidate: [
        ({ value, siblingData, data, originalDoc }) => {
          if (typeof value === 'string' && value.trim() !== '') return slugify(value)

          const source =
            (siblingData as Record<string, unknown> | undefined)?.[sourceFieldName] ??
            (data as Record<string, unknown> | undefined)?.[sourceFieldName] ??
            (originalDoc as Record<string, unknown> | undefined)?.[sourceFieldName]

          return typeof source === 'string' && source.trim() !== '' ? slugify(source) : value
        },
      ],
    },
    admin: {
      position: 'sidebar',
      description: 'Auto-derived from the title. Changing it on a published page requires a publisher.',
    },
  }
}
