import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Container } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { finalCTA } = homeV5

export function FinalCta() {
  return (
    <section id="contact-cta" className="relative scroll-mt-20 overflow-hidden bg-primary text-primary-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:72px_72px]" />

      <Container className="relative py-16 md:py-20">
        <div className="grid overflow-hidden border border-white/24 bg-white/[0.075] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_1px_2px_rgba(0,0,0,0.18),0_24px_64px_rgba(0,0,80,0.20)] backdrop-blur-sm lg:grid-cols-12">
          <div className="border-b border-white/20 p-7 md:p-10 lg:col-span-8 lg:border-b-0 lg:border-r">
            <p className="font-[family-name:var(--font-geist-mono)] text-label-12 uppercase tracking-[0.16em] text-primary-foreground/68">
              LET&apos;S TALK
            </p>
            <h2 className="mt-4 max-w-[12ch] text-heading-40 [text-wrap:balance] md:text-heading-56">
              {finalCTA.heading}
            </h2>
          </div>

          <div className="flex flex-col justify-between p-7 md:p-10 lg:col-span-4">
            <div>
              <p className="max-w-[34ch] text-copy-16 text-primary-foreground/74 [text-wrap:pretty]">
                {finalCTA.support}
              </p>
              <Separator className="my-7 bg-white/22" />
            </div>

            <Button
              asChild
              size="lg"
              variant="secondary"
              className="group w-full justify-between bg-background text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.18),0_10px_28px_rgba(0,0,0,0.10)] hover:bg-foreground hover:text-background focus-visible:outline-white"
            >
              <Link href={finalCTA.action.href}>
                {finalCTA.action.label}
                <ArrowRight aria-hidden className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
