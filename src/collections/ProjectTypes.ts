import type { CollectionConfig } from 'payload'
import { isAdminOnlyDelete, isPublisherOrAdmin, publicReadPublishedOnly } from '@/access/predicates'
import { localizedSlugField } from '@/fields/slug'
import { governed } from '@/fields/taxonomyGovernance'

/**
 * CLAUDE.md §29, §32. Answers: "What type of engagement?" — not a home for
 * capabilities (SEO, Photography, ...); those belong under Services.
 * No public detail route (§72), so no drafts/versions/SEO needed. Entire
 * collection is taxonomy governance (§109): only publisher/admin write.
 */
export const ProjectTypes: CollectionConfig = {
  slug: 'project-types',
  access: {
    create: isPublisherOrAdmin,
    delete: isAdminOnlyDelete,
    read: publicReadPublishedOnly,
    update: isPublisherOrAdmin,
  },
  admin: {
    useAsTitle: 'name',
    group: 'Taxonomy',
  },
  fields: [
    governed({ name: 'name', type: 'text', required: true, localized: true }),
    localizedSlugField('name'),
    governed({
      name: 'internalDefinition',
      type: 'textarea',
      admin: { description: 'Internal only — never rendered publicly.' },
    }),
    { name: 'displayOrder', type: 'number', defaultValue: 0 },
  ],
}
