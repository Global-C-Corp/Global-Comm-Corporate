import Link from 'next/link'
import { CTA } from '@/components/ui/Primitives'
import type { Locale } from '@/i18n/locale'
import { Container } from '@/components/ui/Layout'

/**
 * Closing CTA — deliberately light.
 *
 * Unlike the approved homepage, the Services page does not end on a full-blue
 * band. It closes calm: the statement on the left, a short explanation and one
 * primary action on the right, with a quiet secondary link beneath.
 */
export function ServicesClosingCTA({
  label,
  heading,
  body,
  cta,
  secondaryLabel,
  secondaryHref,
  locale,
}: {
  label?: string | null
  heading?: string | null
  body?: string | null
  cta?: { label?: string | null; url?: string | null } | null
  secondaryLabel?: string | null
  secondaryHref: string
  locale: Locale
}) {
  if (!heading && !cta?.label) return null

  return (
    <section className="bg-secondary" aria-labelledby="services-closing-heading">
      <Container className="py-10 md:py-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
          <div className="lg:col-span-7">
            {label ? (
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {label}
              </p>
            ) : null}
            {heading ? (
              <h2
                id="services-closing-heading"
                className="mt-5 max-w-[16ch] text-balance font-sans text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground md:text-[2.5rem]"
              >
                {heading}
              </h2>
            ) : null}
          </div>

          <div className="lg:col-span-5 lg:pt-3">
            {body ? (
              <p className="max-w-[42ch] text-pretty text-base leading-relaxed text-muted-foreground">
                {body}
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-6">
              {cta?.label ? <CTA cta={cta} locale={locale} /> : null}

              {secondaryLabel ? (
                <Link
                  href={secondaryHref}
                  className="inline-flex min-h-11 items-center text-sm text-foreground underline decoration-border underline-offset-[6px] transition-colors duration-150 hover:text-primary hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {secondaryLabel}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
