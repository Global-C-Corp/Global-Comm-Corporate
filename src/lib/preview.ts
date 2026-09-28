import { buildPath, type Route } from '@/services/seo/urls'

export const PREVIEW_PATH = '/preview'

type PreviewTarget = { collection: string; slug?: string | null }

/**
 * Preview renders a real public route.
 *
 * Only projects are previewable now: the corporate pages are source-owned, so
 * a draft of the old `home-page` / `company-page` globals has nothing to show
 * — the page would render the same code-owned copy either way. Saying so is
 * better than opening a preview that silently ignores the draft.
 */
export function previewRouteFor({ collection, slug }: PreviewTarget): Route | null {
  switch (collection) {
    case 'projects':
      return slug ? { type: 'project', slug } : { type: 'work' }
    default:
      return null
  }
}

export function previewPathFor(target: PreviewTarget): string | null {
  const route = previewRouteFor(target)
  if (!route) return null
  return buildPath(route)
}

/** URL handed to Payload Admin's preview button. */
export function buildPreviewURL({
  collection,
  slug,
  serverURL,
  secret,
}: PreviewTarget & { serverURL: string; secret: string }): string {
  const params = new URLSearchParams({ secret, collection })
  if (slug) params.set('slug', slug)

  return `${serverURL}${PREVIEW_PATH}?${params.toString()}`
}
