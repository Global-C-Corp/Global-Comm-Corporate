import type { Field } from 'payload'
import { fieldPublisherOrAdmin } from '@/access/predicates'

/** Not exported from the plugin's public types — shape matches its `fields` option. */
type FieldsOverride = (args: { defaultFields: Field[] }) => Field[]

/**
 * Extends the Payload SEO plugin's default `meta` group (title, description,
 * image) with the OpenGraph, robots and canonicalOverride fields required by
 * CLAUDE.md §46-§57. Title/description are localized; canonicalOverride is
 * restricted to publisher/admin (§56 — AI can never write it).
 */
export const seoFieldsOverride: FieldsOverride = ({ defaultFields }) => {
  const localizedDefaults = defaultFields.map((field) => {
    if ('name' in field && (field.name === 'title' || field.name === 'description')) {
      return { ...field, localized: true } as Field
    }
    return field
  })

  const openGraphGroup: Field = {
    name: 'openGraph',
    type: 'group',
    label: 'OpenGraph',
    fields: [
      { name: 'title', type: 'text', localized: true },
      { name: 'description', type: 'textarea', localized: true },
      { name: 'image', type: 'upload', relationTo: 'media' },
    ],
  }

  const robotsGroup: Field = {
    name: 'robots',
    type: 'group',
    label: 'Robots',
    fields: [
      { name: 'noIndex', type: 'checkbox', defaultValue: false },
      { name: 'noFollow', type: 'checkbox', defaultValue: false },
    ],
  }

  const canonicalOverrideField: Field = {
    name: 'canonicalOverride',
    type: 'text',
    label: 'Canonical URL override (advanced)',
    admin: {
      description:
        'Absolute HTTPS URL. Publisher/admin only. Never set for ordinary pages — canonicals are computed automatically.',
    },
    access: {
      update: fieldPublisherOrAdmin,
    },
  }

  return [...localizedDefaults, openGraphGroup, robotsGroup, canonicalOverrideField]
}
