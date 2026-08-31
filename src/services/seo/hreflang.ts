import { defaultLocale, locales, type Locale } from '@/i18n/locale'
import { buildAbsoluteURL, type Route } from './urls'

/**
 * Per-locale public availability of one entity. `slug` is the localized
 * slug for that locale (CLAUDE.md §60-§61) — never reuse another locale's
 * slug when building an alternate.
 */
export type LocaleAvailability = Partial<
  Record<
    Locale,
    {
      isPublic: boolean
      slug?: string
    }
  >
>

export type Alternates = {
  languages: Partial<Record<Locale | 'x-default', string>>
}

function routeForLocale(route: Route, slug?: string): Route | null {
  if ('slug' in route) {
    if (!slug) return null
    return { ...route, slug }
  }
  return route
}

/**
 * CLAUDE.md §58-§59. Alternates are emitted only for locales that are
 * publicly approved and indexable; missing, ai_draft, needs_review and
 * noIndex locales are omitted. Alternates are reciprocal by construction —
 * every caller derives them from the same availability map.
 */
export function buildAlternates({
  route,
  availability,
  includeXDefault = true,
}: {
  route: Route
  availability: LocaleAvailability
  includeXDefault?: boolean
}): Alternates {
  const languages: Partial<Record<Locale | 'x-default', string>> = {}

  for (const locale of locales) {
    const entry = availability[locale]
    if (!entry?.isPublic) continue
    const localeRoute = routeForLocale(route, entry.slug)
    if (!localeRoute) continue
    languages[locale] = buildAbsoluteURL(locale, localeRoute)
  }

  if (includeXDefault && languages[defaultLocale]) {
    languages['x-default'] = languages[defaultLocale]
  }

  return { languages }
}
