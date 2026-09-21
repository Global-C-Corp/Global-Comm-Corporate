import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container, SectionLabel } from '@/components/ui/Layout'

/** One family in the numbered list: everything the row renders, already resolved. */
export type ExpertiseItem = {
  id: string
  number: string
  name: string
  promise?: string | null
  href?: string | null
}

/**
 * Four Expertises — approved reference (04 §12.5).
 *
 * Editorial split: the argument on the left, the four families as numbered
 * rows on the right. Rows are separated by hairlines, not boxed — 04 §12.5 is
 * explicit that this must not become four identical SaaS cards.
 *
 * Each row is a single link covering the whole row, so the arrow, the title
 * and the promise are one target rather than three.
 */
export function Expertise({
  kicker,
  heading,
  body = [],
  cta,
  items = [],
}: {
  kicker?: string | null
  heading?: string | null
  body?: string[]
  cta?: { label?: string | null; url?: string | null } | null
  items?: ExpertiseItem[]
}) {
  if (!heading && items.length === 0) return null

  return (
    <section id="expertises" className="scroll-mt-24 bg-background" aria-labelledby="expertises-heading">
      <Container className="py-20 md:py-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            {kicker ? <SectionLabel>{kicker}</SectionLabel> : null}

            {heading ? (
              <h2
                id="expertises-heading"
                className="mt-6 max-w-[30ch] text-heading-32 leading-[1.14] tracking-[-0.03em] text-foreground [text-wrap:balance]"
              >
                {heading}
              </h2>
            ) : null}

            <div className="mt-8 space-y-4">
              {body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="max-w-[48ch] text-copy-14 leading-[1.6] text-muted-foreground [text-wrap:pretty]"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {cta?.label && cta.url ? (
              <Button asChild variant="outline" size="lg" className="group mt-10">
                <Link href={cta.url}>
                  {cta.label}
                  <ArrowRight
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </Button>
            ) : null}
          </div>

          <ul className="lg:col-span-6">
            {items.map((item) => {
              const row = (
                <>
                  <span
                    aria-hidden
                    className="mt-[0.2rem] shrink-0 font-mono text-copy-14 tabular-nums text-primary"
                  >
                    {item.number}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-copy-16 font-semibold tracking-[-0.01em] text-foreground transition-colors duration-150 group-hover/row:text-primary">
                      {item.name}
                    </span>
                    {item.promise ? (
                      <span className="mt-1.5 block max-w-[46ch] text-copy-14 leading-[1.55] text-muted-foreground [text-wrap:pretty]">
                        {item.promise}
                      </span>
                    ) : null}
                  </span>

                  {item.href ? (
                    <ArrowRight
                      aria-hidden
                      className="mt-1 size-4 shrink-0 text-muted-foreground transition-[transform,color] duration-200 group-hover/row:translate-x-1 group-hover/row:text-primary"
                    />
                  ) : null}
                </>
              )

              return (
                <li key={item.id} className="border-b border-border first:border-t">
                  {/* One link covering the whole row, so the number, the title
                      and the promise are a single target rather than three.
                      A family with no published service page is not a link. */}
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="group/row flex items-start gap-6 py-7 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
                    >
                      {row}
                    </Link>
                  ) : (
                    <div className="group/row flex items-start gap-6 py-7">{row}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </Container>
    </section>
  )
}
