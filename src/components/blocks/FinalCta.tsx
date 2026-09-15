import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Container } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { finalCTA } = homeV5

export function FinalCta() {
  return (
    <section id="contact-cta" className="relative scroll-mt-20 overflow-hidden bg-primary text-primary-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:72px_72px]"
      />

      <Container className="relative py-16 md:py-20">
        <div className="overflow-hidden border border-white/24 bg-white/[0.075] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_1px_2px_rgba(0,0,0,0.18),0_24px_64px_rgba(0,0,80,0.20)] backdrop-blur-sm">
          <div className="grid lg:grid-cols-12">
            <div className="border-b border-white/20 p-7 md:p-10 lg:col-span-8 lg:border-b-0 lg:border-r">
              <p className="font-[family-name:var(--font-geist-mono)] text-label-12 uppercase tracking-[0.16em] text-primary-foreground/68">
                LET&apos;S TALK
              </p>
              <h2 className="mt-4 max-w-[12ch] text-heading-40 [text-wrap:balance] md:text-heading-56">
                {finalCTA.heading}
              </h2>
            </div>

            <div className="flex flex-col justify-between p-7 md:p-10 lg:col-span-4">
              <p className="max-w-[34ch] text-copy-16 text-primary-foreground/76 [text-wrap:pretty]">
                {finalCTA.support}
              </p>

              <div>
                <Separator className="my-7 bg-white/22" />

                <ul className="space-y-3">
                  {['Strategy', 'Brand', 'Digital growth'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-copy-14 text-primary-foreground/82">
                      <span className="grid size-5 place-items-center rounded-[4px] bg-white text-primary">
                        <Check aria-hidden className="size-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="group mt-8 w-full justify-between bg-background text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.18),0_10px_28px_rgba(0,0,0,0.10)] hover:bg-foreground hover:text-background focus-visible:outline-white"
                >
                  <Link href={finalCTA.action.href}>
                    {finalCTA.action.label}
                    <ArrowRight aria-hidden className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid border-t border-white/20 sm:grid-cols-3">
            {['Clear brief', 'Focused scope', 'Measurable execution'].map((item) => (
              <div key={item} className="border-b border-white/14 px-6 py-4 font-[family-name:var(--font-geist-mono)] text-label-12 uppercase tracking-[0.12em] text-white/62 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                {item}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
