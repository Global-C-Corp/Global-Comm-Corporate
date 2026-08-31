import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '@/hooks/revalidate'
import { isEditorOrAI, publicReadPublishedOnly } from '@/access/predicates'
import { globalPreview } from '@/lib/adminPreview'
import { ctaField } from '@/fields/cta'
import { pageGlobalEditorialFields } from '@/fields/editorial'
import { enforceEditorialWorkflowGlobal } from '@/hooks/enforceEditorialWorkflow'

/** CLAUDE.md §41, §73-§74. */
export const HomePage: GlobalConfig = {
  slug: 'home-page',
  access: {
    read: publicReadPublishedOnly,
    update: isEditorOrAI,
  },
  admin: {
    ...globalPreview('home-page'),
    group: 'Pages',
  },
  versions: {
    drafts: true,
    max: 50,
  },
  hooks: {
    afterChange: [revalidateGlobal('home-page')],
    beforeChange: [enforceEditorialWorkflowGlobal],
  },
  fields: [
    { name: 'heroEyebrow', type: 'text', localized: true },
    { name: 'heroHeading', type: 'text', localized: true },
    { name: 'heroBody', type: 'textarea', localized: true },
    ctaField('primaryCTA'),
    ctaField('secondaryCTA'),
    { name: 'featuredClients', type: 'relationship', relationTo: 'clients', hasMany: true },
    { name: 'featuredProjects', type: 'relationship', relationTo: 'projects', hasMany: true },
    { name: 'featuredIndustries', type: 'relationship', relationTo: 'industries', hasMany: true },
    { name: 'featuredTestimonials', type: 'relationship', relationTo: 'testimonials', hasMany: true },
    { name: 'methodHeading', type: 'text', localized: true },
    { name: 'methodIntro', type: 'textarea', localized: true },
    ctaField('closingCTA'),
    ...pageGlobalEditorialFields,
  ],
}
