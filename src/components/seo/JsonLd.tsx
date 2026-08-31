import type { Locale } from '@/i18n/locale'
import { absoluteMediaURL } from '@/lib/media'
import type { SiteSetting } from '@/payload-types'
import { buildAbsoluteURL, type Route } from '@/services/seo/urls'

/**
 * CLAUDE.md §71 — generated only from verified Payload content. Never emits
 * ratings, review counts, awards or offers.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Payload content only; no user-supplied HTML reaches this string.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

export function organizationSchema(settings: SiteSetting | null, locale: Locale): Record<string, unknown> {
  const logo = absoluteMediaURL(settings?.organizationLogo)

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: settings?.companyName ?? 'Global Communication Corporate',
    url: buildAbsoluteURL(locale, { type: 'home' }),
    ...(settings?.tagline ? { description: settings.tagline } : {}),
    ...(logo ? { logo } : {}),
    ...(settings?.primaryEmail ? { email: settings.primaryEmail } : {}),
    ...(settings?.primaryPhone ? { telephone: settings.primaryPhone } : {}),
    ...(settings?.socialLinks?.length
      ? { sameAs: settings.socialLinks.map((link) => link.url).filter(Boolean) }
      : {}),
  }
}

export function breadcrumbSchema(
  locale: Locale,
  trail: { name: string; route: Route }[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: buildAbsoluteURL(locale, item.route),
    })),
  }
}
