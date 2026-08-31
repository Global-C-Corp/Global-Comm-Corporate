import type { Locale } from '@/i18n/locale'
import type { NavLink } from '@/components/layout/MobileNav'

type StoredNavItem = {
  label?: string | null
  url?: string | null
  opensInNewTab?: boolean | null
}

/**
 * Navigation targets are stored locale-agnostically ("/work") and prefixed
 * at render time, so one menu serves all three locales (CLAUDE.md §12, §40).
 * External absolute URLs pass through untouched.
 */
export function localizeNavHref(locale: Locale, url: string): string {
  if (/^https?:\/\//i.test(url) || url.startsWith('mailto:') || url.startsWith('tel:')) return url
  if (url === '/' || url === '') return `/${locale}`
  return `/${locale}${url.startsWith('/') ? url : `/${url}`}`
}

export function toNavLinks(locale: Locale, items?: StoredNavItem[] | null): NavLink[] {
  if (!items) return []
  return items
    .filter((item): item is StoredNavItem & { label: string; url: string } => Boolean(item?.label && item?.url))
    .map((item) => ({
      label: item.label,
      url: localizeNavHref(locale, item.url),
      opensInNewTab: item.opensInNewTab ?? false,
    }))
}
