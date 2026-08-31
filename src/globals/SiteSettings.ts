import type { GlobalConfig } from 'payload'
import { isAdmin } from '@/access/predicates'

/** CLAUDE.md §39. Never store secrets here — this is editable via Payload Admin. */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    update: isAdmin,
  },
  admin: {
    group: 'Site',
  },
  fields: [
    { name: 'companyName', type: 'text', required: true, defaultValue: 'Global Communication Corporate' },
    { name: 'shortName', type: 'text', defaultValue: 'Global Comm' },
    { name: 'siteURL', type: 'text', required: true, defaultValue: 'https://globalcomm.ma' },
    { name: 'tagline', type: 'text', localized: true },
    { name: 'primaryEmail', type: 'email' },
    { name: 'primaryPhone', type: 'text' },
    { name: 'address', type: 'textarea', localized: true },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: ['linkedin', 'instagram', 'facebook', 'x', 'youtube'],
          required: true,
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'organizationLogo', type: 'upload', relationTo: 'media' },
    {
      name: 'defaultSEO',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
      ],
    },
    { name: 'defaultOGImage', type: 'upload', relationTo: 'media' },
    { name: 'copyrightText', type: 'text', localized: true },
    {
      name: 'analytics',
      type: 'group',
      admin: { description: 'Public analytics configuration only — never secrets.' },
      fields: [{ name: 'plausibleDomain', type: 'text' }],
    },
  ],
}
