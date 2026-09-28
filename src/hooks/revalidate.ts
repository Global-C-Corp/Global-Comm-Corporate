import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/**
 * Centralized revalidation (CLAUDE.md §86).
 *
 * The routes carry no locale segment any more, so a page is invalidated by its
 * own path. `[slug]` is still a dynamic pattern: one edit can change several
 * case studies at once (a renamed client, a replaced image), so the whole
 * segment is invalidated rather than a single document's URL.
 *
 * The corporate pages are source-owned and change only with a deploy, but they
 * still render Payload records — projects, clients, testimonials — so they stay
 * in the table.
 */
const ROUTE_PATTERNS = {
  home: '/home',
  services: '/services',
  serviceDetail: '/services/[slug]',
  work: '/work',
  projectDetail: '/work/[slug]',
  company: '/company',
  contact: '/contact',
} as const

type RouteKey = keyof typeof ROUTE_PATTERNS

/**
 * A revalidation that does not happen is a page that keeps serving stale
 * HTML, so a failure is reported rather than swallowed. Silence here is what
 * let a published Services edit sit behind build-time output indefinitely.
 *
 * Payload also writes outside a Next.js request scope — seed scripts,
 * migrations, tests — where `revalidatePath` throws because there is no cache
 * to invalidate. That is expected and not an incident, but it still earns a
 * line: it says the route was not refreshed, which is the fact that matters.
 * Each path is attempted on its own, so one failure cannot skip the rest.
 *
 * Only the path and the error's name and message are logged. Payload write
 * context, which can carry document data, is deliberately not included.
 */
function safeRevalidate(path: string, run: () => void): void {
  try {
    run()
  } catch (error) {
    const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error)
    console.error(`[revalidate] ${path} was not invalidated. ${message}`)
  }
}

function revalidateRoutes(keys: RouteKey[]) {
  for (const key of keys) {
    const pattern = ROUTE_PATTERNS[key]
    safeRevalidate(pattern, () => revalidatePath(pattern, 'page'))
  }
  safeRevalidate('/sitemap.xml', () => revalidatePath('/sitemap.xml'))
}

const AFFECTED_ROUTES: Record<string, RouteKey[]> = {
  services: ['home', 'services', 'serviceDetail', 'projectDetail'],
  projects: ['home', 'work', 'projectDetail', 'serviceDetail'],
  industries: ['home', 'serviceDetail', 'company'],
  clients: ['home', 'company', 'projectDetail'],
  testimonials: ['home', 'company', 'projectDetail'],
  media: ['home', 'services', 'serviceDetail', 'work', 'projectDetail', 'company'],
  'project-types': ['work', 'contact'],
  'context-tags': ['work'],
  // The page globals and `navigation` are still registered in Payload, but no
  // public route reads them any more, so editing one invalidates nothing.
  'site-settings': ['home', 'services', 'serviceDetail', 'work', 'projectDetail', 'company', 'contact'],
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
