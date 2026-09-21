import Link from 'next/link'
import type { Service } from '@/payload-types'
import { mediaURL } from '@/lib/media'
import { Container } from '@/components/ui/Layout'

/**
 * Four specialist practices — the page's primary informational section.
 *
 * The four pillars read as one editorial system: a blue number with a hairline
 * running from it to the column edge, the practice name, its positioning line,
 * a wide media rectangle, the description and a text link — separated by thin
 * vertical rules rather than boxed. Deliberately not four cards: no container,
 * no radius, no shadow, no icon (04 §13.4, 03 §6.2).
 *
 * The reference draws an index and previous/next controls at the far right of
 * the introduction. All four practices are visible at once, so those controls
 * would command nothing; the vertical rule that anchors that corner is kept
 * and the deceptive controls are not built (brief §9).
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
    <section className="bg-secondary" aria-labelledby="practices-heading">
      <Container className="py-14 md:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            {label ? (
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {label}
              </p>
            ) : null}
            {heading ? (
              <h2
                id="practices-heading"
                className="mt-5 max-w-[18ch] text-balance font-sans text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground md:text-[2.5rem]"
              >
                {heading}
              </h2>
            ) : null}
          </div>

          <div className="space-y-4 lg:col-span-5 lg:pt-1">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="max-w-[46ch] text-pretty text-sm leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* The rule that closes the introduction's right edge in the
              reference. It carries no control, so it is decorative structure
              and hidden from assistive technology. */}
          <div aria-hidden className="hidden lg:col-span-1 lg:block">
            <span className="block h-full w-px bg-border" />
          </div>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-y-14 sm:grid-cols-2 lg:-ml-10 lg:grid-cols-4 lg:gap-y-0">
          {practices.map((service, index) => {
            const href = hrefFor(service)
            const image =
              mediaURL(service.heroMedia, 'projectCard') ||
              mediaURL(service.heroMedia, 'projectFeature')

            return (
              <li
                key={service.id}
                className="flex min-w-0 flex-col sm:border-l sm:border-border sm:px-7 [&:nth-child(-n+2)]:sm:border-l-0 [&:nth-child(-n+2)]:sm:pl-0 lg:border-l lg:px-0 lg:pl-10 lg:[&:nth-child(-n+2)]:pl-10 lg:[&:first-child]:border-l-0"
              >
                {/* Number and rule sit on one line, as in the reference. */}
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium tabular-nums tracking-[0.08em] text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span aria-hidden className="h-px flex-1 bg-border" />
                </div>

                <h3 className="mt-7 text-lg font-semibold tracking-[-0.02em] text-foreground">
                  {service.name}
                </h3>

                {service.positioningLine ? (
                  <p className="mt-3 max-w-[15rem] text-[0.65rem] font-medium uppercase leading-[1.6] tracking-[0.12em] text-muted-foreground lg:min-h-[2.1rem]">
                    {service.positioningLine}
                  </p>
                ) : null}

                <div className="relative mt-6 aspect-[16/10] w-full overflow-hidden bg-muted">
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
                      className="inline-flex items-center py-3 -my-3 text-sm font-medium text-primary transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {exploreLabel(service)} →
                    </Link>
                  </p>
                ) : null}
              </li>
            )
          })}
        </ol>
      </Container>
    </section>
  )
}
