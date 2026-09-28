import { siteConfig } from '@/config/site'
import { buildAbsoluteURL, type Route } from '@/services/seo/urls'

/**
 * Generated only from verified content. Never emits ratings, review counts,
 * awards or offers.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Source-owned and CMS content only; no user-supplied HTML reaches this string.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

export function organizationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: siteConfig.name,
    url: buildAbsoluteURL({ type: 'home' }),
    description: siteConfig.tagline,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    ...(siteConfig.socialLinks.length > 0
      ? { sameAs: siteConfig.socialLinks.map((link) => link.url) }
      : {}),
  }
}

export function breadcrumbSchema(trail: { name: string; route: Route }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: buildAbsoluteURL(item.route),
    })),
  }
}
