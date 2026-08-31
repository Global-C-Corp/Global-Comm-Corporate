import type { GlobalConfig } from 'payload'
import { isEditorOrAI, publicReadPublishedOnly } from '@/access/predicates'
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
    group: 'Pages',
  },
  versions: {
    drafts: true,
    max: 50,
  },
  hooks: {
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
