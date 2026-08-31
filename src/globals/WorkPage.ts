import type { GlobalConfig } from 'payload'
import { globalPublishGate } from '@/lib/adminComponents'
import { revalidateGlobal } from '@/hooks/revalidate'
import { isEditorOrAI, publicReadPublishedOnly } from '@/access/predicates'
import { globalPreview } from '@/lib/adminPreview'
import { ctaField } from '@/fields/cta'
import { pageGlobalEditorialFields } from '@/fields/editorial'
import { enforceEditorialWorkflowGlobal } from '@/hooks/enforceEditorialWorkflow'

/** CLAUDE.md §43, §77. */
export const WorkPage: GlobalConfig = {
  slug: 'work-page',
  access: {
    read: publicReadPublishedOnly,
    update: isEditorOrAI,
  },
  admin: {
    ...globalPublishGate,
    ...globalPreview('work-page'),
    group: 'Pages',
  },
  versions: {
    drafts: true,
    max: 50,
  },
  hooks: {
    afterChange: [revalidateGlobal('work-page')],
    beforeChange: [enforceEditorialWorkflowGlobal],
  },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'text', localized: true },
    { name: 'intro', type: 'textarea', localized: true },
    ctaField('closingCTA'),
    ...pageGlobalEditorialFields,
  ],
}
