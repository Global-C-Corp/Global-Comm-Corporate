import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/Layout'

/**
 * Final CTA — approved reference (04 §12.9).
 *
 * A flat, full-width brand-blue interruption: the uppercase statement and its
 * serif support line on the left, one light button on the right. No inner
 * panel, no grid texture, no secondary message — 04 §12.9 asks for confidence
 * rather than urgency, and the surface alone carries it.
 */
export function FinalCta({
  heading,
  support,
  cta,
}: {
  heading?: string | null
  support?: string | null
  cta?: { label?: string | null; url?: string | null } | null
}) {
  if (!heading && !cta?.label) return null

  return (
    <section id="contact-cta" className="scroll-mt-24 bg-primary text-primary-foreground">
      <Container className="py-16 md:py-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="min-w-0">
            {heading ? (
              <h2 className="max-w-[20ch] text-heading-24 font-semibold uppercase leading-[1.1] tracking-[-0.015em] md:text-heading-32">
                {heading}
              </h2>
            ) : null}
            {support ? (
              <p className="mt-4 max-w-[52ch] font-serif text-[1.375rem] leading-[1.35] text-primary-foreground/85 [text-wrap:pretty] md:text-[1.5rem]">
                {support}
              </p>
            ) : null}
          </div>

          {cta?.label && cta.url ? (
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="group w-fit shrink-0 bg-background text-foreground hover:bg-background/90 focus-visible:outline-white"
            >
              <Link href={cta.url}>
                {cta.label}
                <ArrowUpRight
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </Button>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
