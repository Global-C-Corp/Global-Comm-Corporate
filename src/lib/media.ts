import { PRODUCTION_ORIGIN } from '@/services/seo/urls'

export type MediaLike = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
  sizes?: Record<string, { url?: string | null; width?: number | null; height?: number | null } | null | undefined> | null
}

export function isMedia(value: unknown): value is MediaLike {
  return typeof value === 'object' && value !== null && 'url' in value
}

/** Resolves a media document (or relationship id) to a renderable URL. */
export function mediaURL(value: unknown, size?: string): string | undefined {
  if (!isMedia(value)) return undefined
  if (size) {
    const sized = value.sizes?.[size]
    if (sized?.url) return sized.url
  }
  return value.url ?? undefined
}

/** Metadata (OG/Twitter/JSON-LD) requires absolute URLs on the production host. */
export function absoluteMediaURL(value: unknown, size?: string): string | undefined {
  const url = mediaURL(value, size)
  if (!url) return undefined
  if (/^https?:\/\//.test(url)) return url
  return `${PRODUCTION_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`
}
