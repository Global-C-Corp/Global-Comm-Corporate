import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '@/hooks/revalidate'
import { isEditorOrAI, publicReadPublishedOnly } from '@/access/predicates'
import { globalPreview } from '@/lib/adminPreview'
import { pageGlobalEditorialFields } from '@/fields/editorial'
import { enforceEditorialWorkflowGlobal } from '@/hooks/enforceEditorialWorkflow'

/** CLAUDE.md §45, §81. */
export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  access: {
    read: publicReadPublishedOnly,
    update: isEditorOrAI,
  },
  admin: {
    ...globalPreview('contact-page'),
    group: 'Pages',
  },
  versions: {
    drafts: true,
    max: 50,
  },
  hooks: {
    afterChange: [revalidateGlobal('contact-page')],
    beforeChange: [enforceEditorialWorkflowGlobal],
  },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'text', localized: true },
    { name: 'intro', type: 'textarea', localized: true },
    { name: 'directContact', type: 'textarea', localized: true },
    { name: 'officeLocation', type: 'textarea', localized: true },
    { name: 'formIntro', type: 'textarea', localized: true },
    { name: 'closingText', type: 'textarea', localized: true },
    ...pageGlobalEditorialFields,
  ],
}
