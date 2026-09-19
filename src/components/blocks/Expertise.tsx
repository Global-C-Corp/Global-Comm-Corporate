import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container, SectionLabel } from '@/components/blocks/Layout'
import { homeHalbert } from '@/content/homeHalbert'

const { expertise } = homeHalbert

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
export function Expertise() {
  return (
    <section id="expertises" className="scroll-mt-24 bg-background" aria-labelledby="expertises-heading">
      <Container className="py-20 md:py-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionLabel>{expertise.kicker}</SectionLabel>

            <h2
              id="expertises-heading"
              className="mt-6 max-w-[30ch] text-heading-32 leading-[1.14] tracking-[-0.03em] text-foreground [text-wrap:balance]"
            >
              {expertise.title}
            </h2>

            <div className="mt-8 space-y-4">
              {expertise.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="max-w-[48ch] text-copy-14 leading-[1.6] text-muted-foreground [text-wrap:pretty]"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <Button asChild variant="outline" size="lg" className="group mt-10">
              <Link href={expertise.sectionCTA.href}>
                {expertise.sectionCTA.label}
                <ArrowRight
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </Button>
          </div>

          <ul className="lg:col-span-6">
            {expertise.items.map((item) => (
              <li key={item.number} className="border-b border-border first:border-t">
                <Link
                  href={item.cta.href}
                  className="group/row flex items-start gap-6 py-7 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
                >
                  <span
                    aria-hidden
                    className="mt-[0.2rem] shrink-0 font-[family-name:var(--font-geist-mono)] text-copy-14 tabular-nums text-primary"
                  >
                    {item.number}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-copy-16 font-semibold tracking-[-0.01em] text-foreground transition-colors duration-150 group-hover/row:text-primary">
                      {item.name}
                    </span>
                    <span className="mt-1.5 block max-w-[46ch] text-copy-14 leading-[1.55] text-muted-foreground [text-wrap:pretty]">
                      {item.promise}
                    </span>
                  </span>

                  <ArrowRight
                    aria-hidden
                    className="mt-1 size-4 shrink-0 text-muted-foreground transition-[transform,color] duration-200 group-hover/row:translate-x-1 group-hover/row:text-primary"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
