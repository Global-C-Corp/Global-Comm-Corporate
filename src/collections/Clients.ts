import type { CollectionConfig } from 'payload'
import { revalidateCollection, revalidateOnDelete } from '@/hooks/revalidate'
import { isAdminOnlyDelete, isEditorOrAI, publicReadPublishedOnly } from '@/access/predicates'
import { editorialFields } from '@/fields/editorial'
import { enforceEditorialWorkflowCollection } from '@/hooks/enforceEditorialWorkflow'

/**
 * CLAUDE.md §34. No initial standalone public route — used as a shared
 * reference (logos, featured clients) from other pages.
 */
export const Clients: CollectionConfig = {
  slug: 'clients',
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
    afterChange: [revalidateCollection('clients')],
    afterDelete: [revalidateOnDelete('clients')],
    beforeChange: [enforceEditorialWorkflowCollection],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'websiteURL', type: 'text' },
    { name: 'shortDescription', type: 'textarea', localized: true },
    { name: 'longDescription', type: 'richText', localized: true },
    { name: 'industries', type: 'relationship', relationTo: 'industries', hasMany: true },
    { name: 'location', type: 'text' },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'displayOrder', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    ...editorialFields,
  ],
}
