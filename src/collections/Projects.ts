import type { CollectionConfig, Field } from 'payload'
import { collectionPublishGate } from '@/lib/adminComponents'
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
/**
 * A metric is one of three kinds, and the public page always says which:
 * - measured: a real result — requires a sourceNote;
 * - estimate: a projection — shown with an "Estimation" label, no source needed;
 * - target: an objective — shown with an "Objectif" label, no source needed.
 * Owner decision 2026-09-28 (option A): estimates are allowed, but only when
 * labelled as such, never presented as measured results.
 */
const metricsField: Field = {
  name: 'metrics',
  type: 'array',
  fields: [
    {
      name: 'kind',
      type: 'select',
      defaultValue: 'measured',
      required: true,
      options: [
        { label: 'Measured result (needs a source)', value: 'measured' },
        { label: 'Estimate (shown as “Estimation”)', value: 'estimate' },
        { label: 'Target (shown as “Objectif”)', value: 'target' },
      ],
    },
    {
      name: 'value',
      type: 'text',
      admin: { description: 'A measured value needs a sourceNote. Otherwise mark it as an estimate or a target.' },
      validate: (value: string | null | undefined, { siblingData }: { siblingData: unknown }) => {
        const sibling = siblingData as { sourceNote?: string; kind?: string } | undefined
        if (value && (sibling?.kind ?? 'measured') === 'measured' && !sibling?.sourceNote) {
          return 'A measured value requires a sourceNote. Mark it as an estimate or a target otherwise.'
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
    ...collectionPublishGate,
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
