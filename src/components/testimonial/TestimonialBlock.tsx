import type { Locale } from '@/i18n/locale'
import type { Testimonial } from '@/payload-types'

/**
 * CLAUDE.md §37 — a translated quote must never be presented as if it were
 * the original wording, so a translation is labelled with its source locale.
 */
export function TestimonialBlock({ testimonial, locale }: { testimonial: Testimonial; locale: Locale }) {
  const isOriginalLocale = testimonial.originalLocale === locale
  const quote = isOriginalLocale ? testimonial.originalQuote : (testimonial.translatedQuote ?? undefined)

  if (!quote) return null

  const attribution = [testimonial.personName, testimonial.personRole, testimonial.organizationName]
    .filter(Boolean)
    .join(' · ')

  return (
    <figure style={{ margin: 0 }}>
      <blockquote className="gc-quote" lang={isOriginalLocale ? undefined : locale}>
        “{quote}”
      </blockquote>
      {attribution && <figcaption className="gc-quote__attribution">{attribution}</figcaption>}
      {!isOriginalLocale && (
        <p className="gc-quote__note">
          Translated from {testimonial.originalLocale?.toUpperCase()}
        </p>
      )}
    </figure>
  )
}
