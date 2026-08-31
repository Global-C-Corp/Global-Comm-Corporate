import type { CollectionConfig } from 'payload'
import { isAdminOnlyDelete, isPublisherOrAdmin } from '@/access/predicates'
import { localizedSlugField } from '@/fields/slug'
import { governed } from '@/fields/taxonomyGovernance'

/**
 * CLAUDE.md §29, §33. Answers: "What objective/context?" AI assigns
 * existing values only; entire collection is taxonomy governance (§109).
 */
export const ContextTags: CollectionConfig = {
  slug: 'context-tags',
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
  fields: [
    governed({ name: 'name', type: 'text', required: true, localized: true }),
    localizedSlugField('name'),
    governed({
      name: 'internalDefinition',
      type: 'textarea',
      admin: { description: 'Internal only — never rendered publicly.' },
    }),
  ],
}
