import type { GlobalConfig } from 'payload'
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
    { name: 'featuredProjects', type: 'relationship', relationTo: 'projects', hasMany: true },
    ctaField('closingCTA'),
    ...pageGlobalEditorialFields,
  ],
}
