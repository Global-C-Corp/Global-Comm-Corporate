import type { CollectionConfig } from 'payload'
import { isAdminOnlyDelete, isPublisherOrAdmin } from '@/access/predicates'

/**
 * CLAUDE.md §81, §114-§115. Private contact-form submissions. No MCP
 * access, no AI access — this collection is never registered with the MCP
 * plugin (see payload.config.ts).
 */
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  access: {
    // Public visitors submit the contact form anonymously.
    create: () => true,
    delete: isAdminOnlyDelete,
    read: isPublisherOrAdmin,
    update: isPublisherOrAdmin,
  },
  admin: {
    useAsTitle: 'company',
    defaultColumns: ['name', 'company', 'email', 'createdAt'],
    group: 'Private',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'company', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'website', type: 'text' },
    { name: 'projectType', type: 'relationship', relationTo: 'project-types' },
    { name: 'estimatedBudget', type: 'text' },
    { name: 'desiredStart', type: 'date' },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'consent',
      type: 'checkbox',
      required: true,
      validate: (value) => (value === true ? true : 'Consent is required.'),
    },
  ],
}
