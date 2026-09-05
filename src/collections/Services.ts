import type { CollectionConfig } from 'payload'
import { collectionPublishGate } from '@/lib/adminComponents'
import { revalidateCollection, revalidateOnDelete } from '@/hooks/revalidate'
import { isAdminOnlyDelete, isEditorOrAI, publicReadPublishedOnly } from '@/access/predicates'
import { collectionPreview } from '@/lib/adminPreview'
import { editorialFields } from '@/fields/editorial'
import { localizedSlugField } from '@/fields/slug'
import { governed } from '@/fields/taxonomyGovernance'
import { enforceEditorialWorkflowCollection } from '@/hooks/enforceEditorialWorkflow'
import { enforceServicePillars } from '@/hooks/enforceServicePillars'

/**
 * Hierarchical service taxonomy + editorial page content (CLAUDE.md §29-§30).
 * Answers: "What did Global Comm do?"
 */
export const Services: CollectionConfig = {
  slug: 'services',
  access: {
    create: isEditorOrAI,
    delete: isAdminOnlyDelete,
    read: publicReadPublishedOnly,
    update: isEditorOrAI,
  },
  admin: {
    ...collectionPublishGate,
    ...collectionPreview('services'),
    useAsTitle: 'name',
    defaultColumns: ['name', 'parent', 'featured', 'reviewStatus', '_status'],
    group: 'Content',
  },
  versions: {
    drafts: { autosave: false },
    maxPerDoc: 50,
  },
  hooks: {
    afterChange: [revalidateCollection('services')],
    afterDelete: [revalidateOnDelete('services')],
    beforeChange: [enforceServicePillars, enforceEditorialWorkflowCollection],
  },
  fields: [
    governed({ name: 'name', type: 'text', required: true, localized: true }),
    localizedSlugField('name'),
    governed({
      name: 'parent',
      type: 'relationship',
      relationTo: 'services',
      admin: { position: 'sidebar' },
    }),
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
    { name: 'clientProblem', type: 'richText', localized: true },
    { name: 'approach', type: 'richText', localized: true },
    { name: 'deliverables', type: 'richText', localized: true },
    { name: 'outcomes', type: 'richText', localized: true },
    /**
     * Public grouping (CLAUDE.md §29-§30, §109).
     *
     * The taxonomy keeps its full hierarchy — every term still classifies
     * projects — but only the terms flagged here get a public URL. Every
     * other term declares the pillar that absorbs it, and that relationship
     * is what the redirect generator reads. Keeping the grouping in Payload
     * rather than in code means a mis-bucketed term is corrected by an
     * authorized human in Admin, not by a deploy.
     *
     * Both fields control live URLs, so they are governed exactly like the
     * term's identity fields.
     */
    governed({
      name: 'isPillar',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Publishes this service at /{locale}/services/{slug}. Only the four pillars are public.',
      },
    }),
    governed({
      name: 'foldedInto',
      type: 'relationship',
      relationTo: 'services',
      filterOptions: () => ({ isPillar: { equals: true } }),
      admin: {
        position: 'sidebar',
        condition: (data) => !data?.isPillar,
        description: 'The pillar that absorbs this term. Its public URL redirects here.',
      },
    }),
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'displayOrder', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    ...editorialFields,
  ],
}
