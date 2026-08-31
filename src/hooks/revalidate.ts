import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/**
 * Centralized revalidation (CLAUDE.md §86). Paths are invalidated by their
 * dynamic route pattern, which covers every locale of that route — shared
 * relationships and media are visible in all locales, so a change to one
 * document must not leave another locale stale.
 */
const ROUTE_PATTERNS = {
  home: '/[locale]',
  services: '/[locale]/services',
  serviceDetail: '/[locale]/services/[slug]',
  work: '/[locale]/work',
  projectDetail: '/[locale]/work/[slug]',
  industryDetail: '/[locale]/industries/[slug]',
  company: '/[locale]/company',
  contact: '/[locale]/contact',
} as const

type RouteKey = keyof typeof ROUTE_PATTERNS

function revalidateRoutes(keys: RouteKey[]) {
  for (const key of keys) {
    revalidatePath(ROUTE_PATTERNS[key], 'page')
  }
  revalidatePath('/sitemap.xml')
}

const AFFECTED_ROUTES: Record<string, RouteKey[]> = {
  services: ['home', 'services', 'serviceDetail', 'projectDetail', 'industryDetail'],
  projects: ['home', 'work', 'projectDetail', 'serviceDetail', 'industryDetail'],
  industries: ['home', 'industryDetail', 'serviceDetail', 'company'],
  clients: ['home', 'company', 'projectDetail'],
  testimonials: ['home', 'company', 'projectDetail'],
  media: ['home', 'services', 'serviceDetail', 'work', 'projectDetail', 'industryDetail', 'company'],
  'project-types': ['work', 'contact'],
  'context-tags': ['work'],
  'home-page': ['home'],
  'services-page': ['services'],
  'work-page': ['work'],
  'company-page': ['company'],
  'contact-page': ['contact'],
  navigation: ['home', 'services', 'serviceDetail', 'work', 'projectDetail', 'industryDetail', 'company', 'contact'],
  'site-settings': ['home', 'services', 'serviceDetail', 'work', 'projectDetail', 'industryDetail', 'company', 'contact'],
}

export function revalidateCollection(slug: string): CollectionAfterChangeHook {
  return ({ doc }) => {
    revalidateRoutes(AFFECTED_ROUTES[slug] ?? [])
    return doc
  }
}

export function revalidateOnDelete(slug: string): CollectionAfterDeleteHook {
  return ({ doc }) => {
    revalidateRoutes(AFFECTED_ROUTES[slug] ?? [])
    return doc
  }
}

export function revalidateGlobal(slug: string): GlobalAfterChangeHook {
  return ({ doc }) => {
    revalidateRoutes(AFFECTED_ROUTES[slug] ?? [])
    return doc
  }
}
