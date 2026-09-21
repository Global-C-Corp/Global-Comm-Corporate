import { CTA } from '@/components/ui/Primitives'
import type { Locale } from '@/i18n/locale'
import { mediaURL } from '@/lib/media'

/**
 * Our Belief — the page's single dark interruption.
 *
 * Statement left, media through the centre, support and a quiet action right.
 * The media runs the full height of the band rather than sitting inside
 * padding, which is what gives the section its cinematic proportion in the
 * reference. Flat throughout: no gradient, no glow, no glass, no rounded
 * container. The page returns to the light surface immediately after it.
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
      <div className="grid items-stretch lg:grid-cols-12">
        <div className="flex items-center px-5 py-14 sm:px-6 md:px-8 lg:col-span-4 lg:py-14 lg:pl-16 lg:pr-10">
          <div>
            {label ? (
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-background/55">
                {label}
              </p>
            ) : null}
            <h2
              id="belief-heading"
              className="mt-5 max-w-[18ch] text-balance font-sans text-2xl font-semibold leading-[1.16] tracking-[-0.03em] md:text-[2rem]"
            >
              {heading}
            </h2>
          </div>
        </div>

        {/* Full-height media: no padding around it, so the band reads as one
            cinematic plate rather than a framed picture. */}
        <div className="relative min-h-[14rem] overflow-hidden bg-background/10 lg:col-span-4 lg:min-h-[17rem]">
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

        <div className="flex items-center px-5 py-14 sm:px-6 md:px-8 lg:col-span-4 lg:py-14 lg:pl-10 lg:pr-16">
          <div>
            {body ? (
              <p className="max-w-[32ch] text-pretty text-sm leading-relaxed text-background/75">
                {body}
              </p>
            ) : null}

            {cta?.label ? (
              <div className="mt-7 [&_a]:border-background/35 [&_a]:bg-transparent [&_a]:text-background hover:[&_a]:border-background hover:[&_a]:bg-background hover:[&_a]:text-foreground [&_a]:focus-visible:outline-background">
                <CTA cta={cta} locale={locale} variant="secondary" />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
