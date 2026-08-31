import type { CollectionConfig } from 'payload'
import { isAdminOnlyDelete, isEditorOrAI, publicReadPublishedOnly } from '@/access/predicates'

/**
 * CLAUDE.md §38. Media metadata is editorial data (rights, credit,
 * approvals) even though the binary itself lives in object storage.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: isEditorOrAI,
    delete: isAdminOnlyDelete,
    read: publicReadPublishedOnly,
    update: isEditorOrAI,
  },
  admin: {
    useAsTitle: 'alt',
  },
  upload: {
    imageSizes: [
      { name: 'logo', width: 240, height: undefined, fit: 'inside' },
      { name: 'thumbnail', width: 400, height: 300, fit: 'cover' },
      { name: 'projectCard', width: 800, height: 600, fit: 'cover' },
      { name: 'projectFeature', width: 1600, height: 900, fit: 'cover' },
      { name: 'hero', width: 2400, height: 1350, fit: 'cover' },
      { name: 'openGraph', width: 1200, height: 630, fit: 'cover' },
      { name: 'portrait', width: 600, height: 800, fit: 'cover' },
    ],
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/svg+xml'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
    },
    { name: 'credit', type: 'text' },
    { name: 'copyrightOwner', type: 'text' },
    {
      name: 'usageRights',
      type: 'select',
      options: ['full_ownership', 'licensed', 'client_provided', 'stock', 'unknown'],
      defaultValue: 'unknown',
    },
    { name: 'usageExpiration', type: 'date' },
    { name: 'clientApproved', type: 'checkbox', defaultValue: false },
    { name: 'source', type: 'text' },
    {
      name: 'internalNotes',
      type: 'textarea',
      admin: { position: 'sidebar' },
    },
  ],
}
