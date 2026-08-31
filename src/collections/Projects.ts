import type { CollectionConfig, Field } from 'payload'
import { revalidateCollection, revalidateOnDelete } from '@/hooks/revalidate'
import { isAdminOnlyDelete, isEditorOrAI, publicReadPublishedOnly } from '@/access/predicates'
import { collectionPreview } from '@/lib/adminPreview'
import { editorialFields } from '@/fields/editorial'
import { localizedSlugField } from '@/fields/slug'
import { enforceEditorialWorkflowCollection } from '@/hooks/enforceEditorialWorkflow'

/**
 * CLAUDE.md §35-§36. The core portfolio entity. Metrics require evidence —
 * AI must never fabricate a plausible-looking number (§105, §138).
 */
const metricsField: Field = {
  name: 'metrics',
  type: 'array',
  fields: [
    {
      name: 'value',
      type: 'text',
      admin: { description: 'Leave empty rather than estimating a plausible number (CLAUDE.md §36).' },
      validate: (value: string | null | undefined, { siblingData }: { siblingData: unknown }) => {
        const sibling = siblingData as { sourceNote?: string } | undefined
        if (value && !sibling?.sourceNote) {
          return 'A metric value requires a sourceNote citing where it came from.'
        }
        return true
      },
    },
    { name: 'label', type: 'text', localized: true, required: true },
    { name: 'sourceNote', type: 'text' },
  ],
}

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    create: isEditorOrAI,
    delete: isAdminOnlyDelete,
    read: publicReadPublishedOnly,
    update: isEditorOrAI,
  },
  admin: {
    ...collectionPreview('projects'),
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'year', 'featured', 'reviewStatus', '_status'],
    group: 'Content',
  },
  versions: {
    drafts: { autosave: false },
    maxPerDoc: 50,
  },
  hooks: {
    afterChange: [revalidateCollection('projects')],
    afterDelete: [revalidateOnDelete('projects')],
    beforeChange: [enforceEditorialWorkflowCollection],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    localizedSlugField('title'),
    { name: 'client', type: 'relationship', relationTo: 'clients', required: true },
    { name: 'year', type: 'number', admin: { position: 'sidebar' } },
    { name: 'location', type: 'text' },
    { name: 'externalURL', type: 'text' },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'displayOrder', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'shortStatement', type: 'text', localized: true },
    { name: 'excerpt', type: 'textarea', localized: true },

    { name: 'services', type: 'relationship', relationTo: 'services', hasMany: true },
    { name: 'industries', type: 'relationship', relationTo: 'industries', hasMany: true },
    { name: 'projectTypes', type: 'relationship', relationTo: 'project-types', hasMany: true },
    { name: 'contextTags', type: 'relationship', relationTo: 'context-tags', hasMany: true },

    { name: 'challenge', type: 'richText', localized: true },
    { name: 'approach', type: 'richText', localized: true },
    { name: 'deliverables', type: 'richText', localized: true },
    { name: 'outcome', type: 'richText', localized: true },
    { name: 'resultsNote', type: 'textarea', localized: true },

    { name: 'heroMedia', type: 'upload', relationTo: 'media' },
    { name: 'featuredMedia', type: 'upload', relationTo: 'media' },
    {
      name: 'gallery',
      type: 'array',
      fields: [{ name: 'media', type: 'upload', relationTo: 'media', required: true }],
    },

    metricsField,

    { name: 'relatedTestimonials', type: 'relationship', relationTo: 'testimonials', hasMany: true },

    ...editorialFields,
  ],
}
