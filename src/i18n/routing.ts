/**
 * Stable, locale-independent route-family segments.
 * CLAUDE.md §13 — keep these stable; only content, entity slugs, SEO and
 * labels are localized, never these segment names.
 */
export const routeFamilies = {
  services: 'services',
  work: 'work',
  industries: 'industries',
  company: 'company',
  contact: 'contact',
} as const

export type RouteFamily = (typeof routeFamilies)[keyof typeof routeFamilies]
