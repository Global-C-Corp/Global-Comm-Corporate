import { services } from '@/content/services'

/**
 * Site navigation — source-owned.
 *
 * Previously read from the Payload `navigation` global. Navigation is a
 * structural decision that ships with the code, not something an editor should
 * change without a deploy, so it lives here.
 *
 * The Services submenu is derived from the canonical service list; adding a
 * service to src/content/services.ts adds it to the menu automatically.
 */
export type NavLink = {
  label: string
  url: string
  opensInNewTab?: boolean
  children?: readonly NavLink[]
}

const serviceLinks: readonly NavLink[] = services.map((service) => ({
  label: service.name,
  url: `/services/${service.slug}`,
}))

/** The order the site has shipped with; only the source has changed. */
export const primaryNavigation: readonly NavLink[] = [
  { label: 'Services', url: '/services', children: serviceLinks },
  { label: 'Réalisations', url: '/work' },
  { label: 'Entreprise', url: '/company' },
  { label: 'Contact', url: '/contact' },
]

export const footerNavigation: readonly NavLink[] = [
  { label: 'Services', url: '/services' },
  { label: 'Réalisations', url: '/work' },
  { label: 'Entreprise', url: '/company' },
  { label: 'Contact', url: '/contact' },
]

/** None recorded yet; the CMS global had no legal links. */
export const legalNavigation: readonly NavLink[] = []
