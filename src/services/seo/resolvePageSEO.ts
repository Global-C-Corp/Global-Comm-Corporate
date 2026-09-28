import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { absoluteMediaURL } from '@/lib/media'
import { resolveCanonical } from './canonical'
import type { Route } from './urls'

export type SeoMeta = {
  title?: string | null
  description?: string | null
  image?: unknown
  openGraph?: {
    title?: string | null
    description?: string | null
    image?: unknown
  } | null
  robots?: {
    noIndex?: boolean | null
    noFollow?: boolean | null
  } | null
  canonicalOverride?: string | null
}

export type SeoEntity = {
  title?: string | null
  name?: string | null
  heading?: string | null
  excerpt?: string | null
  shortDescription?: string | null
  heroMedia?: unknown
  meta?: SeoMeta | null
}

/**
 * Only production is indexable. Preview/staging deployments are always
 * noindex.
 */
export function isIndexableEnvironment(): boolean {
  if (process.env.VERCEL_ENV) return process.env.VERCEL_ENV === 'production'
  return process.env.NODE_ENV === 'production'
}

function entityTitle(entity: SeoEntity): string | undefined {
  return entity.title ?? entity.name ?? entity.heading ?? undefined
}

function entityDescription(entity: SeoEntity): string | undefined {
  return entity.excerpt ?? entity.shortDescription ?? undefined
}

/**
 * Centralized metadata resolution.
 *
 * The site is single-language, so there are no `alternates.languages` and no
 * hreflang cluster to keep reciprocal — a single self-canonical URL is the
 * whole story.
 */
export function resolvePageSEO({
  entity,
  route,
  isPreview = false,
}: {
  entity: SeoEntity
  route: Route
  isPreview?: boolean
}): Metadata {
  const meta = entity.meta ?? undefined

  const title =
    meta?.title ||
    (entityTitle(entity) ? `${entityTitle(entity)} — ${siteConfig.shortName}` : undefined) ||
    siteConfig.name

  const description = meta?.description || entityDescription(entity) || siteConfig.tagline

  const ogTitle = meta?.openGraph?.title || meta?.title || entityTitle(entity) || title
  const ogDescription =
    meta?.openGraph?.description || meta?.description || entityDescription(entity) || description
  const ogImage =
    absoluteMediaURL(meta?.openGraph?.image, 'openGraph') ??
    absoluteMediaURL(meta?.image, 'openGraph') ??
    absoluteMediaURL(entity.heroMedia, 'openGraph')

  const canonical = resolveCanonical({ route, canonicalOverride: meta?.canonicalOverride })

  const noIndex = isPreview || !isIndexableEnvironment() || Boolean(meta?.robots?.noIndex)
  const noFollow = Boolean(meta?.robots?.noFollow)

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: !noIndex, follow: !noFollow },
    openGraph: {
      // og:url always equals the canonical URL.
      url: canonical,
      title: ogTitle,
      description: ogDescription ?? undefined,
      siteName: siteConfig.shortName,
      locale: 'fr',
      type: 'website',
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title: ogTitle,
      description: ogDescription ?? undefined,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}
