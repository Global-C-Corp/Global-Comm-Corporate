import type { Metadata } from 'next'
import type { Locale } from '@/i18n/locale'
import { absoluteMediaURL } from '@/lib/media'
import { buildAlternates, type LocaleAvailability } from './hreflang'
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

export type SiteDefaults = {
  siteName: string
  defaultTitle?: string | null
  defaultDescription?: string | null
  defaultOGImage?: unknown
}

/**
 * Only production is indexable. Preview/staging deployments are always
 * noindex (CLAUDE.md §69).
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
 * Centralized metadata resolution (CLAUDE.md §66-§67). No textual
 * cross-language fallback: everything passed in is already resolved for
 * one locale with `fallbackLocale: false`.
 */
export function resolvePageSEO({
  entity,
  locale,
  route,
  site,
  availability,
  isPreview = false,
}: {
  entity: SeoEntity
  locale: Locale
  route: Route
  site: SiteDefaults
  availability: LocaleAvailability
  isPreview?: boolean
}): Metadata {
  const meta = entity.meta ?? undefined

  const title =
    meta?.title ||
    (entityTitle(entity) ? `${entityTitle(entity)} — ${site.siteName}` : undefined) ||
    site.defaultTitle ||
    site.siteName

  const description = meta?.description || entityDescription(entity) || site.defaultDescription || undefined

  const ogTitle = meta?.openGraph?.title || meta?.title || entityTitle(entity) || title
  const ogDescription = meta?.openGraph?.description || meta?.description || entityDescription(entity) || description
  const ogImage =
    absoluteMediaURL(meta?.openGraph?.image, 'openGraph') ??
    absoluteMediaURL(meta?.image, 'openGraph') ??
    absoluteMediaURL(entity.heroMedia, 'openGraph') ??
    absoluteMediaURL(site.defaultOGImage, 'openGraph')

  const canonical = resolveCanonical({ locale, route, canonicalOverride: meta?.canonicalOverride })
  const alternates = buildAlternates({ route, availability })

  const noIndex = isPreview || !isIndexableEnvironment() || Boolean(meta?.robots?.noIndex)
  const noFollow = Boolean(meta?.robots?.noFollow)

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: alternates.languages,
    },
    robots: {
      index: !noIndex,
      follow: !noFollow,
    },
    openGraph: {
      // og:url always equals the canonical URL (CLAUDE.md §57).
      url: canonical,
      title: ogTitle,
      description: ogDescription ?? undefined,
      siteName: site.siteName,
      locale,
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
