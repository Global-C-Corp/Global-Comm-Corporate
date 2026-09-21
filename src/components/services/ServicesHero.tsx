import Link from 'next/link'
import { ActionLink } from '@/components/ui/Primitives'
import type { Locale } from '@/i18n/locale'
import { mediaURL } from '@/lib/media'
import { cn } from '@/lib/utils'

/**
 * Services hero — near 50/50 editorial split.
 *
 * The headline is two statements: the first names what to stop doing, the
 * second what to start. The approved composition sets the second in brand
 * blue, so the string is split on its first sentence boundary rather than
 * stored as two fields — the copy stays one editable headline in Payload.
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
    <section className="bg-background" aria-labelledby="services-hero-heading">
      <div className="mx-auto w-full max-w-[80rem] px-5 pb-20 pt-16 sm:px-6 md:px-8 md:pb-28 md:pt-24 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            {eyebrow ? (
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {eyebrow}
              </p>
            ) : null}

            <h1
              id="services-hero-heading"
              className="mt-8 max-w-[15ch] text-balance font-sans text-4xl font-semibold leading-[1.04] tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl"
            >
              {lead}
              {accent ? (
                <>
                  {' '}
                  <span className="text-primary">{accent}</span>
                </>
              ) : null}
            </h1>

            {intro ? (
              <p className="mt-8 max-w-[46ch] text-pretty text-base leading-relaxed text-muted-foreground">
                {intro}
              </p>
            ) : null}

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <ActionLink href={primary.href}>{primary.label} →</ActionLink>
              {/*
                The shared `quiet` variant sets `min-h-0`, which leaves a 20px
                target. The secondary action keeps the same quiet treatment but
                its own 44px height, rather than changing the primitive for
                every page that uses it.
              */}
              <Link
                href={secondary.href}
                className="inline-flex min-h-11 items-center text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors duration-150 hover:text-primary hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {secondary.label} →
              </Link>
            </div>
          </div>

          {/*
            Sharp geometry, no card chrome and no shadow: the media sits
            directly beside the typeframe rather than floating in whitespace.
          */}
          <div
            className={cn(
              'relative aspect-[4/3] w-full overflow-hidden lg:aspect-[5/4]',
              image ? 'bg-secondary' : 'bg-muted',
            )}
          >
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
      </div>
    </section>
  )
}
