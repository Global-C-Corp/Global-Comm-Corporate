import type { CollectionConfig } from 'payload'
import { revalidateCollection, revalidateOnDelete } from '@/hooks/revalidate'
import {
  fieldInternalOnly,
  isAdminOnlyDelete,
  isEditorOrAI,
  publicReadUnversioned,
} from '@/access/predicates'

/**
 * CLAUDE.md §38. Media metadata is editorial data (rights, credit,
 * approvals) even though the binary itself lives in object storage.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: isEditorOrAI,
    delete: isAdminOnlyDelete,
    read: publicReadUnversioned,
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
  hooks: {
    afterChange: [revalidateCollection('media')],
    afterDelete: [revalidateOnDelete('media')],
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
    // Attribution travels with the asset wherever it is displayed, so credit
    // and copyright owner stay publicly readable.
    { name: 'credit', type: 'text' },
    { name: 'copyrightOwner', type: 'text' },
    // Rights administration is internal: it says what Global Comm is allowed
    // to do with an asset, which is commercial information, not page content.
    {
      name: 'usageRights',
      type: 'select',
      options: ['full_ownership', 'licensed', 'client_provided', 'stock', 'unknown'],
      defaultValue: 'unknown',
      access: { read: fieldInternalOnly },
    },
    { name: 'usageExpiration', type: 'date', access: { read: fieldInternalOnly } },
    {
      name: 'clientApproved',
      type: 'checkbox',
      defaultValue: false,
      access: { read: fieldInternalOnly },
    },
    { name: 'source', type: 'text', access: { read: fieldInternalOnly } },
    {
      name: 'internalNotes',
      type: 'textarea',
      admin: { position: 'sidebar' },
      access: { read: fieldInternalOnly },
    },
  ],
}
