import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '@/hooks/revalidate'
import { isEditorOrAI, publicReadPublishedOnly } from '@/access/predicates'
import { globalPreview } from '@/lib/adminPreview'
import { ctaField } from '@/fields/cta'
import { pageGlobalEditorialFields } from '@/fields/editorial'
import { enforceEditorialWorkflowGlobal } from '@/hooks/enforceEditorialWorkflow'

/** CLAUDE.md §44, §80. */
export const CompanyPage: GlobalConfig = {
  slug: 'company-page',
  access: {
    read: publicReadPublishedOnly,
    update: isEditorOrAI,
  },
  admin: {
    ...globalPreview('company-page'),
    group: 'Pages',
  },
  versions: {
    drafts: true,
    max: 50,
  },
  hooks: {
    afterChange: [revalidateGlobal('company-page')],
    beforeChange: [enforceEditorialWorkflowGlobal],
  },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'text', localized: true },
    { name: 'intro', type: 'textarea', localized: true },
    { name: 'whoWeAre', type: 'richText', localized: true },
    { name: 'whatWeBelieve', type: 'richText', localized: true },
    { name: 'howWeWork', type: 'richText', localized: true },
    { name: 'selectedClients', type: 'relationship', relationTo: 'clients', hasMany: true },
    { name: 'selectedIndustries', type: 'relationship', relationTo: 'industries', hasMany: true },
    { name: 'selectedTestimonials', type: 'relationship', relationTo: 'testimonials', hasMany: true },
    ctaField('closingCTA'),
    ...pageGlobalEditorialFields,
  ],
}
