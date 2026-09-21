import Link from 'next/link'
import type { Service } from '@/payload-types'
import { mediaURL } from '@/lib/media'

/**
 * Four specialist practices — the page's primary informational section.
 *
 * The four pillars read as one editorial system: a number over a hairline,
 * the practice name, its positioning line, a wide media rectangle, the
 * description and a text link. Deliberately not four cards — no container,
 * no radius, no shadow, no icon (04 §12.5, 03 §6).
 *
 * The approved composition shows an index treatment beside the introduction.
 * It is omitted here: all four practices are visible at once, so an `01 / 04`
 * counter and previous/next controls would describe an interaction that does
 * not exist.
 */
export function PracticesSection({
  label,
  heading,
  body,
  practices,
  hrefFor,
  exploreLabel,
}: {
  label?: string | null
  heading?: string | null
  body?: string | null
  practices: Service[]
  hrefFor: (service: Service) => string | null
  exploreLabel: (service: Service) => string
}) {
  if (practices.length === 0) return null

  const paragraphs = (body ?? '').split(/\n{2,}/).filter(Boolean)

  return (
    <section className="bg-background" aria-labelledby="practices-heading">
      <div className="mx-auto w-full max-w-[80rem] px-5 py-24 sm:px-6 md:px-8 md:py-32 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            {label ? (
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {label}
              </p>
            ) : null}
            {heading ? (
              <h2
                id="practices-heading"
                className="mt-6 max-w-[16ch] text-balance font-sans text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground md:text-5xl"
              >
                {heading}
              </h2>
            ) : null}
          </div>

          <div className="space-y-5 lg:pt-2">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="max-w-[54ch] text-pretty text-base leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <ol className="mt-20 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {practices.map((service, index) => {
            const href = hrefFor(service)
            const image = mediaURL(service.heroMedia, 'projectCard') || mediaURL(service.heroMedia, 'projectFeature')

            return (
              <li key={service.id} className="flex min-w-0 flex-col">
                <span className="text-xs font-medium tabular-nums tracking-[0.08em] text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span aria-hidden className="mt-3 block h-px w-full bg-border" />

                <h3 className="mt-6 text-xl font-semibold tracking-[-0.02em] text-foreground">
                  {service.name}
                </h3>

                {service.positioningLine ? (
                  <p className="mt-3 max-w-[22ch] text-[0.7rem] font-medium uppercase leading-[1.5] tracking-[0.12em] text-muted-foreground">
                    {service.positioningLine}
                  </p>
                ) : null}

                <div className="relative mt-7 aspect-[4/3] w-full overflow-hidden bg-secondary">
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

                {service.shortDescription ? (
                  <p className="mt-6 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {service.shortDescription}
                  </p>
                ) : null}

                {href ? (
                  <p className="mt-6">
                    <Link
                      href={href}
                      className="inline-flex min-h-11 items-center text-sm font-medium text-primary transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {exploreLabel(service)} →
                    </Link>
                  </p>
                ) : null}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
