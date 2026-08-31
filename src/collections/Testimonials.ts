import type { CollectionBeforeValidateHook, CollectionConfig, Field } from 'payload'
import { collectionPublishGate } from '@/lib/adminComponents'
import { revalidateCollection, revalidateOnDelete } from '@/hooks/revalidate'
import { ValidationError } from 'payload'
import { isAdminOnlyDelete, isEditorOrAI, publicReadPublishedOnly } from '@/access/predicates'
import { editorialFields } from '@/fields/editorial'
import { locales } from '@/i18n/locale'
import { enforceEditorialWorkflowCollection } from '@/hooks/enforceEditorialWorkflow'

/**
 * CLAUDE.md §37 — source and attribution are required, original wording is
 * preserved verbatim, and AI may never invent a testimonial.
 */
const requireSourceAndAttribution: CollectionBeforeValidateHook = ({ data, operation }) => {
  if (operation !== 'create' && operation !== 'update') return data
  if (!data) return data

  const hasAttribution = Boolean(data.personName) || Boolean(data.organizationName)
  if (!hasAttribution) {
    throw new ValidationError({
      errors: [{ path: 'personName', message: 'A testimonial requires attribution: personName or organizationName.' }],
      collection: 'testimonials',
    })
  }

  const sourceReferences = (data.sourceReferences as unknown[] | undefined) ?? []
  if (sourceReferences.length === 0) {
    throw new ValidationError({
      errors: [{ path: 'sourceReferences', message: 'A testimonial requires at least one sourceReference.' }],
      collection: 'testimonials',
    })
  }

  return data
}

const editorialFieldsWithoutSourceReferences = editorialFields.filter(
  (field): field is Field => !('name' in field) || field.name !== 'sourceReferences',
)

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: {
    create: isEditorOrAI,
    delete: isAdminOnlyDelete,
    read: publicReadPublishedOnly,
    update: isEditorOrAI,
  },
  admin: {
    ...collectionPublishGate,
    useAsTitle: 'internalTitle',
    defaultColumns: ['internalTitle', 'personName', 'organizationName', 'reviewStatus', '_status'],
    group: 'Content',
  },
  versions: {
    drafts: { autosave: false },
    maxPerDoc: 50,
  },
  hooks: {
    afterChange: [revalidateCollection('testimonials')],
    afterDelete: [revalidateOnDelete('testimonials')],
    beforeValidate: [requireSourceAndAttribution],
    beforeChange: [enforceEditorialWorkflowCollection],
  },
  fields: [
    { name: 'internalTitle', type: 'text', required: true, admin: { description: 'Not rendered publicly.' } },
    { name: 'originalQuote', type: 'textarea', required: true },
    { name: 'originalLocale', type: 'select', required: true, options: locales.map((l) => ({ label: l, value: l })) },
    { name: 'translatedQuote', type: 'textarea', localized: true },
    { name: 'personName', type: 'text' },
    { name: 'personRole', type: 'text' },
    { name: 'organizationName', type: 'text' },
    { name: 'client', type: 'relationship', relationTo: 'clients' },
    { name: 'project', type: 'relationship', relationTo: 'projects' },
    { name: 'personPhoto', type: 'upload', relationTo: 'media' },
    { name: 'organizationLogo', type: 'upload', relationTo: 'media' },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'displayOrder', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    {
      name: 'sourceReferences',
      type: 'array',
      minRows: 1,
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
    ...editorialFieldsWithoutSourceReferences,
  ],
}
