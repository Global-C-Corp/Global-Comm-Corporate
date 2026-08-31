import type { Access, FieldAccess, PayloadRequest } from 'payload'
import type { Role } from './roles'

export function getRole(req: PayloadRequest): Role | undefined {
  const user = req.user as { role?: Role } | null | undefined
  return user?.role
}

export const isAdmin: Access = ({ req }) => getRole(req) === 'admin'

export const isPublisherOrAdmin: Access = ({ req }) => {
  const role = getRole(req)
  return role === 'admin' || role === 'publisher'
}

/** Any authenticated internal role (excludes anonymous public visitors). */
export const isInternalUser: Access = ({ req }) => Boolean(getRole(req))

/** Editor and above may create/update editorial drafts; AI is handled separately. */
export const isEditorUp: Access = ({ req }) => {
  const role = getRole(req)
  return role === 'admin' || role === 'publisher' || role === 'editor'
}

export const isEditorOrAI: Access = ({ req }) => {
  const role = getRole(req)
  return role === 'admin' || role === 'publisher' || role === 'editor' || role === 'ai_editor'
}

/**
 * Only admin may delete editorial content. Publisher is not granted delete
 * (CLAUDE.md §23 lists no delete right for publisher), and AI/editor are
 * explicitly forbidden from deleting production content (§24, §25, §138).
 */
export const isAdminOnlyDelete: Access = isAdmin

/**
 * Public read of editorial content: internal roles can see everything
 * (including drafts, for review); anonymous visitors are constrained to
 * published documents only. This is enforced here — not just in query
 * helpers — so a forgotten `draft: false` flag can never leak a draft
 * (CLAUDE.md §27, §125, §138).
 */
export const publicReadPublishedOnly: Access = ({ req }) => {
  if (getRole(req)) return true
  return {
    _status: {
      equals: 'published',
    },
  }
}

/** Field-level access restricting a field to publisher/admin only (e.g. canonicalOverride). */
export const fieldPublisherOrAdmin: FieldAccess = ({ req }) => {
  const role = getRole(req)
  return role === 'admin' || role === 'publisher'
}

/** Field-level access restricting a field to admin only. */
export const fieldAdminOnly: FieldAccess = ({ req }) => getRole(req) === 'admin'
