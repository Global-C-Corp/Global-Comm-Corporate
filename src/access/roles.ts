/**
 * Role model (CLAUDE.md §21-25).
 * Central definition — collections and hooks must import from here rather
 * than re-declaring role strings.
 */
export const roles = ['admin', 'publisher', 'editor', 'ai_editor'] as const

export type Role = (typeof roles)[number]

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (roles as readonly string[]).includes(value)
}
