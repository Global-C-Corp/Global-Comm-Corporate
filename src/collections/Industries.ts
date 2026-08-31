import type { CollectionConfig } from 'payload'
import { isAdminOnlyDelete, isEditorOrAI, publicReadPublishedOnly } from '@/access/predicates'
import { editorialFields } from '@/fields/editorial'
import { localizedSlugField } from '@/fields/slug'
import { governed } from '@/fields/taxonomyGovernance'
import { enforceEditorialWorkflowCollection } from '@/hooks/enforceEditorialWorkflow'

/**
 * CLAUDE.md §29, §31. Answers: "What sector?"
 */
export const Industries: CollectionConfig = {
  slug: 'industries',
  access: {
    create: isEditorOrAI,
    delete: isAdminOnlyDelete,
    read: publicReadPublishedOnly,
    update: isEditorOrAI,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'featured', 'reviewStatus', '_status'],
    group: 'Content',
  },
  versions: {
    drafts: { autosave: false },
    maxPerDoc: 50,
  },
  hooks: {
    beforeChange: [enforceEditorialWorkflowCollection],
  },
  fields: [
    governed({ name: 'name', type: 'text', required: true, localized: true }),
    localizedSlugField('name'),
    governed({
      name: 'aliases',
      type: 'array',
      localized: true,
      fields: [{ name: 'value', type: 'text', required: true }],
    }),
    governed({
      name: 'internalDefinition',
      type: 'textarea',
      admin: { position: 'sidebar', description: 'Internal only — never rendered publicly.' },
    }),
    { name: 'shortDescription', type: 'textarea', localized: true },
    { name: 'longDescription', type: 'richText', localized: true },
    { name: 'heroMedia', type: 'upload', relationTo: 'media' },
    { name: 'challenges', type: 'richText', localized: true },
    { name: 'capabilities', type: 'richText', localized: true },
    {
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { description: 'Powers the "Relevant Capabilities" section on the industry page (CLAUDE.md §79).' },
    },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'displayOrder', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    ...editorialFields,
  ],
}
