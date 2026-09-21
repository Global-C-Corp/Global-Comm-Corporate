import { CTA } from '@/components/ui/Primitives'
import type { Locale } from '@/i18n/locale'
import { mediaURL } from '@/lib/media'

/**
 * Our Belief — the page's single dark interruption.
 *
 * Statement left, media centre, support and a quiet action right. Kept short
 * and flat: no gradient, no glow, no glass, no rounded container. The page
 * returns to the light surface immediately after it.
 */
export function BeliefSection({
  label,
  heading,
  body,
  media,
  cta,
  locale,
}: {
  label?: string | null
  heading?: string | null
  body?: string | null
  media?: unknown
  cta?: { label?: string | null; url?: string | null } | null
  locale: Locale
}) {
  if (!heading) return null
  const image = mediaURL(media, 'projectFeature') || mediaURL(media, 'hero')

  return (
    <section className="bg-foreground text-background" aria-labelledby="belief-heading">
      <div className="mx-auto w-full max-w-[80rem] px-5 py-20 sm:px-6 md:px-8 md:py-24 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            {label ? (
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-background/55">
                {label}
              </p>
            ) : null}
            <h2
              id="belief-heading"
              className="mt-6 max-w-[16ch] text-balance font-sans text-3xl font-semibold leading-[1.08] tracking-[-0.035em] md:text-[2.5rem]"
            >
              {heading}
            </h2>
          </div>

          <div className="lg:col-span-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-background/10">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-4">
            {body ? (
              <p className="max-w-[34ch] text-pretty text-base leading-relaxed text-background/75">
                {body}
              </p>
            ) : null}

            {cta?.label ? (
              <div className="mt-8 [&_a]:border-background/35 [&_a]:bg-transparent [&_a]:text-background hover:[&_a]:border-background hover:[&_a]:bg-background hover:[&_a]:text-foreground [&_a]:focus-visible:outline-background">
                <CTA cta={cta} locale={locale} variant="secondary" />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
