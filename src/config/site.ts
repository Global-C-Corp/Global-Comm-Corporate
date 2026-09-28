/**
 * Site-level constants. Deployment facts, not editorial content — they change
 * with a deploy, not with a CMS edit, so they live here rather than in the
 * Payload `site-settings` global the frontend used to read.
 *
 * Values migrated verbatim from that global's French row.
 */
export const siteConfig = {
  name: 'Global Communication Corporate',
  shortName: 'Global Comm',
  url: 'https://globalcomm.ma',
  tagline: 'Stratégie. Création. Croissance.',
  email: 'contact@globalcomm.ma',
  phone: '0630611763',
  /** No address or social profiles are recorded yet; both were empty in the CMS. */
  address: null as string | null,
  socialLinks: [] as { platform: string; url: string }[],
} as const

export const copyrightText = `© ${new Date().getFullYear()} ${siteConfig.name}`
