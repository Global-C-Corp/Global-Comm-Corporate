import type { MetadataRoute } from 'next'
import { buildSitemapEntries } from '@/services/seo/sitemapEntries'
import { isIndexableEnvironment } from '@/services/seo/resolvePageSEO'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Preview/staging is noindex, so it publishes no sitemap (CLAUDE.md §69).
  if (!isIndexableEnvironment()) return []

  const entries = await buildSitemapEntries()
  return entries.map((entry) => ({
    url: entry.url,
    lastModified: entry.lastModified,
  }))
}
