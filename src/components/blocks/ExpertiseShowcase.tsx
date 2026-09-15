import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Container, SectionLabel } from '@/components/blocks/Layout'

export type ExpertiseShowcaseItem = {
  id: string
  number: string
  title: string
  tagline?: string
  body?: string
  image?: string
  alt?: string
  href?: string
  ctaLabel?: string
}

export function ExpertiseShowcase({
  kicker,
  heading,
  intro,
  items,
}: {
  kicker?: string
  heading?: string
  intro?: string
  items: ExpertiseShowcaseItem[]
}) {
  if (items.length === 0) return null

  return (
    <section id="expertise" className="scroll-mt-20 border-b border-border bg-background" aria-labelledby="expertise-heading">
      <Container className="py-20 md:py-28">
        <div className="grid gap-8 border-b border-border pb-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-3">
            <SectionLabel>{kicker || 'OUR EXPERTISE'}</SectionLabel>
          </div>
          <div className="lg:col-span-8 lg:col-start-5">
            <h2 id="expertise-heading" className="max-w-[18ch] text-heading-40 text-foreground [text-wrap:balance] md:text-heading-48">
              {heading || 'QUATRE EXPERTISES. UN PROJET COORDONNÉ.'}
            </h2>
            {intro ? <p className="mt-5 max-w-[58ch] text-copy-16 text-muted-foreground [text-wrap:pretty]">{intro}</p> : null}
          </div>
        </div>

        <div>
          {items.map((item, index) => {
            const reversed = index % 2 === 1

            return (
              <article key={item.id} className="grid border-b border-border py-10 md:py-14 lg:grid-cols-12 lg:gap-6">
                <div className={`relative min-h-72 overflow-hidden border border-border bg-[#F5F5F2] lg:col-span-6 lg:min-h-[31rem] ${reversed ? 'lg:order-2 lg:col-start-7' : ''}`}>
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.alt || ''}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,#f5f5f2_0%,#ececf8_58%,#d9d9ff_100%)]">
                      <span className="absolute bottom-7 left-7 font-[family-name:var(--font-geist-mono)] text-heading-64 tabular-nums text-primary/24">
                        {item.number}
                      </span>
                    </div>
                  )}
                </div>

                <div className={`flex flex-col justify-center px-0 py-8 lg:col-span-5 lg:px-8 lg:py-12 ${reversed ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-8'}`}>
                  <p className="font-[family-name:var(--font-geist-mono)] text-label-12 tabular-nums text-primary">{item.number}</p>
                  <h3 className="mt-4 text-heading-32 text-foreground md:text-heading-40">{item.title}</h3>
                  {item.tagline ? <p className="mt-4 text-copy-18 text-foreground">{item.tagline}</p> : null}
                  {item.body ? <p className="mt-5 max-w-[48ch] text-copy-16 text-muted-foreground [text-wrap:pretty]">{item.body}</p> : null}

                  {item.href ? (
                    <Link
                      href={item.href}
                      className="group mt-8 inline-flex min-h-11 w-fit items-center gap-2 rounded-[4px] text-button-14 text-foreground transition-colors duration-150 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                    >
                      {item.ctaLabel || 'Discover the service'}
                      <ArrowUpRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
