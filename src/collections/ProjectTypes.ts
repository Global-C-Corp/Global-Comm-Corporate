import type { CollectionConfig } from 'payload'
import { revalidateCollection, revalidateOnDelete } from '@/hooks/revalidate'
import { isAdminOnlyDelete, isPublisherOrAdmin } from '@/access/predicates'
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
    // Controlled vocabulary has no draft state, so there is no _status to filter on.
    read: () => true,
    update: isPublisherOrAdmin,
  },
  admin: {
    useAsTitle: 'name',
    group: 'Taxonomy',
  },
  hooks: {
    afterChange: [revalidateCollection('project-types')],
    afterDelete: [revalidateOnDelete('project-types')],
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
