import type { GlobalConfig } from 'payload'
import { globalPublishGate } from '@/lib/adminComponents'
import { revalidateGlobal } from '@/hooks/revalidate'
import { isEditorOrAI, publicReadPublishedOnly } from '@/access/predicates'
import { globalPreview } from '@/lib/adminPreview'
import { ctaField } from '@/fields/cta'
import { pageGlobalEditorialFields } from '@/fields/editorial'
import { enforceEditorialWorkflowGlobal } from '@/hooks/enforceEditorialWorkflow'

/** CLAUDE.md §42, §75. */
export const ServicesPage: GlobalConfig = {
  slug: 'services-page',
  access: {
    read: publicReadPublishedOnly,
    update: isEditorOrAI,
  },
  admin: {
    ...globalPublishGate,
    ...globalPreview('services-page'),
    group: 'Pages',
  },
  versions: {
    drafts: true,
    max: 50,
  },
  hooks: {
    afterChange: [revalidateGlobal('services-page')],
    beforeChange: [enforceEditorialWorkflowGlobal],
  },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'text', localized: true },
    { name: 'intro', type: 'textarea', localized: true },
    { name: 'heroMedia', type: 'upload', relationTo: 'media' },
    ctaField('primaryCTA'),
    ctaField('secondaryCTA'),

    /**
     * The approved Services composition carries editorial copy that had no
     * home in this global: the experience band, the practices introduction,
     * the belief interruption, the method sequence and the closing block.
     *
     * They are fields rather than page constants because CLAUDE.md §4 gives
     * Payload the page's editorial content. Each one is optional — an empty
     * group hides its section rather than showing a hole (§139).
     */
    { name: 'experienceLabel', type: 'textarea', localized: true },

    {
      name: 'practices',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'heading', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
      ],
    },

    {
      name: 'belief',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'heading', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
        { name: 'media', type: 'upload', relationTo: 'media' },
        ctaField('cta'),
      ],
    },

    {
      name: 'method',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'heading', type: 'text', localized: true },
        { name: 'intro', type: 'textarea', localized: true },
        {
          name: 'steps',
          type: 'array',
          maxRows: 6,
          fields: [
            { name: 'title', type: 'text', required: true, localized: true },
            { name: 'body', type: 'textarea', localized: true },
          ],
        },
      ],
    },

    { name: 'workHeading', type: 'text', localized: true },
    { name: 'featuredProjects', type: 'relationship', relationTo: 'projects', hasMany: true },

    {
      name: 'closing',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'heading', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
        { name: 'secondaryLabel', type: 'text', localized: true },
      ],
    },
    ctaField('closingCTA'),
    ...pageGlobalEditorialFields,
  ],
}
