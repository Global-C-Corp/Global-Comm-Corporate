import type { Field } from 'payload'
import { slugify } from '@/lib/slugify'
import { governed } from './taxonomyGovernance'

/**
 * Localized, unique, auto-derived slug (CLAUDE.md §60, §70). Governed:
 * changing a published slug affects canonical URLs and requires redirect
 * handling, so only publisher/admin may set it directly.
 */
export function localizedSlugField(sourceFieldName: string): Field {
  return governed({
    name: 'slug',
    type: 'text',
    required: true,
    localized: true,
    unique: true,
    index: true,
    hooks: {
      beforeValidate: [
        ({ value, siblingData }) => {
          if (typeof value === 'string' && value.trim() !== '') return slugify(value)
          const source = (siblingData as Record<string, unknown> | undefined)?.[sourceFieldName]
          return typeof source === 'string' ? slugify(source) : value
        },
      ],
    },
    admin: {
      position: 'sidebar',
    },
  })
}
