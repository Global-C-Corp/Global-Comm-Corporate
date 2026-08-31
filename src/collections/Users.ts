import type { CollectionConfig } from 'payload'
import { getRole, isAdmin } from '@/access/predicates'
import { roles } from '@/access/roles'

/**
 * CLAUDE.md §21-§25. Only admin manages users. A user may read/update their
 * own record (e.g. change their own password) but never their own role.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
  },
  auth: true,
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: ({ req }) => {
      if (isAdmin({ req })) return true
      if (req.user) return { id: { equals: req.user.id } }
      return false
    },
    update: ({ req }) => {
      if (isAdmin({ req })) return true
      if (req.user) return { id: { equals: req.user.id } }
      return false
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: roles.map((value) => ({ label: value, value })),
      access: {
        // Only admin may assign or change a role (CLAUDE.md §21, §109).
        update: ({ req }) => getRole(req) === 'admin',
      },
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
