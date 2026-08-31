/**
 * Single source of truth for supported locales.
 * CLAUDE.md §10 — do not duplicate locale constants elsewhere in the project.
 */
export const locales = ['fr', 'en', 'es'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'fr'

export const localeLabels: Record<Locale, string> = {
  fr: 'FR',
  en: 'EN',
  es: 'ES',
}

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
}

/**
 * Field name holding a locale's translation status. Payload strips a
 * trailing `.<locale>` from query paths when resolving localized fields, so
 * these subfields cannot be named after the locale codes themselves.
 */
export function translationStatusKey<L extends Locale>(locale: L): `${L}Status` {
  return `${locale}Status`
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

export function assertLocale(value: string): Locale {
  if (!isLocale(value)) {
    throw new Error(`Invalid locale: ${value}`)
  }
  return value
}
