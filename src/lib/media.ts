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

export type TileImage = { url: string; alt: string }

/**
 * Picks the first authentic image for a project card from the candidates in
 * priority order, at the `projectCard` size (800×600).
 *
 * Returns undefined rather than substituting anything when a project has no
 * media of its own — a project tile never borrows an image (CLAUDE.md §105).
 * The media's own localized alt text wins; the project title is only the last
 * resort, so the alt still describes something real.
 */
export function tileImage(candidates: unknown[], fallbackAlt: string): TileImage | undefined {
  for (const candidate of candidates) {
    const url = mediaURL(candidate, 'projectCard')
    if (!url) continue
    const alt = isMedia(candidate) ? candidate.alt : undefined
    return { url, alt: alt?.trim() || fallbackAlt }
  }
  return undefined
}
