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
    <figure>
      <blockquote
        className="border-l-2 border-primary pl-5 text-base leading-relaxed text-foreground"
        lang={isOriginalLocale ? undefined : locale}
      >
        “{quote}”
      </blockquote>
      {attribution && (
        <figcaption className="mt-4 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
          {attribution}
        </figcaption>
      )}
      {!isOriginalLocale && (
        <p className="mt-2 text-xs text-muted-foreground">
          Translated from {testimonial.originalLocale?.toUpperCase()}
        </p>
      )}
    </figure>
  )
}
