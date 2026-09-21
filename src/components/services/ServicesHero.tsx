import Link from 'next/link'
import { ActionLink } from '@/components/ui/Primitives'
import type { Locale } from '@/i18n/locale'
import { mediaURL } from '@/lib/media'

/**
 * Services hero — near 50/50 editorial split on the off-white surface.
 *
 * The headline is two statements: the first names what to stop doing, the
 * second what to start. The approved composition sets the second in brand
 * blue and starts it on its own line, so the string is split on its first
 * sentence boundary rather than stored as two fields — the copy stays one
 * editable headline in Payload.
 *
 * The media bleeds to the right viewport edge and starts immediately under the
 * header, as in the reference: it reads as an editorial plate rather than a
 * picture floating inside the text container.
 */
function splitStatements(heading: string): [string, string | null] {
  const match = heading.match(/^(.+?[.!?])\s+(.+)$/s)
  if (!match) return [heading, null]
  return [match[1], match[2]]
}

export function ServicesHero({
  eyebrow,
  heading,
  intro,
  media,
  mediaAlt,
  primary,
  secondary,
}: {
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  media?: unknown
  mediaAlt?: string
  primary: { label: string; href: string }
  secondary: { label: string; href: string }
  locale?: Locale
}) {
  const [lead, accent] = splitStatements(heading ?? '')
  const image = mediaURL(media, 'hero') || mediaURL(media, 'projectFeature')

  return (
    <section className="bg-secondary" aria-labelledby="services-hero-heading">
      <div className="grid items-stretch lg:grid-cols-2">
        <div className="flex items-center">
          {/*
            The text column keeps the page gutter on its left and the container
            measure on its right, so the type stays aligned with every section
            below while the media runs past it.
          */}
          <div className="w-full px-5 py-16 sm:px-6 md:px-8 md:py-20 lg:py-24 lg:pl-16 lg:pr-12">
            {eyebrow ? (
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {eyebrow}
              </p>
            ) : null}

            <h1
              id="services-hero-heading"
              className="mt-8 max-w-[14ch] text-balance font-sans text-4xl font-semibold leading-[1.04] tracking-[-0.04em] text-foreground sm:text-5xl lg:text-[3.5rem]"
            >
              {lead}
              {/*
                The reference starts the second statement on its own line. Left
                inline it only fell there by luck of the English measure: FR and
                ES began the blue mid-line, which reads as one run-on sentence
                rather than the approved two-statement headline.
              */}
              {accent ? <span className="block text-primary">{accent}</span> : null}
            </h1>

            {intro ? (
              <p className="mt-8 max-w-[42ch] text-pretty text-base leading-relaxed text-muted-foreground">
                {intro}
              </p>
            ) : null}

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <ActionLink href={primary.href}>{primary.label} →</ActionLink>
              {/*
                The shared `quiet` variant sets `min-h-0`, which leaves a 20px
                target. The secondary action keeps that treatment with its own
                44px height rather than changing the primitive for every page.
              */}
              <Link
                href={secondary.href}
                className="inline-flex min-h-11 items-center text-sm font-medium text-foreground underline decoration-border underline-offset-[6px] transition-colors duration-150 hover:text-primary hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {secondary.label} →
              </Link>
            </div>
          </div>
        </div>

        <div className="relative min-h-[18rem] w-full overflow-hidden bg-muted lg:min-h-[34rem]">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={mediaAlt ?? ''}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
        </div>
      </div>
    </section>
  )
}
