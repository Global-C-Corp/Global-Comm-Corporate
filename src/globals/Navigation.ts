import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '@/hooks/revalidate'
import { isEditorUp, publicReadPublishedOnly } from '@/access/predicates'
import { navItemsField } from '@/fields/navItem'

/** CLAUDE.md §40, §28 (drafts+versions enabled, no AI editing surface). */
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  access: {
    read: publicReadPublishedOnly,
    update: isEditorUp,
  },
  admin: {
    group: 'Site',
  },
  versions: {
    drafts: true,
    max: 20,
  },
  hooks: {
    afterChange: [revalidateGlobal('navigation')],
  },
  fields: [navItemsField('primaryNavigation'), navItemsField('footerNavigation'), navItemsField('legalNavigation')],
}
