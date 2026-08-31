import type { MetadataRoute } from 'next'
import { isIndexableEnvironment } from '@/services/seo/resolvePageSEO'
import { PRODUCTION_ORIGIN } from '@/services/seo/urls'

export default function robots(): MetadataRoute.Robots {
  // Preview/staging must never be indexed (CLAUDE.md §69).
  if (!isIndexableEnvironment()) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/preview'],
      },
    ],
    sitemap: `${PRODUCTION_ORIGIN}/sitemap.xml`,
    host: PRODUCTION_ORIGIN,
  }
}
