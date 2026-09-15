'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { Container, SectionLabel } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { work } = homeV5

export type SelectedWorkItem = {
  id: string
  title: string
  disciplines?: string
  body?: string
  image?: string
  alt?: string
  href: string
}

export function SelectedWork({ items }: { items: SelectedWorkItem[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return

    const sync = () => setCurrent(api.selectedScrollSnap())
    sync()
    api.on('select', sync)
    api.on('reInit', sync)

    return () => {
      api.off('select', sync)
      api.off('reInit', sync)
    }
  }, [api])

  if (items.length === 0) return null

  return (
    <section id="selected-work" className="scroll-mt-20 border-b border-border bg-[#FAFAF8]" aria-labelledby="work-heading">
      <Container className="py-20 md:py-28">
        <div className="flex items-end justify-between gap-6">
          <div>
            <SectionLabel>{work.label}</SectionLabel>
            <h2 id="work-heading" className="mt-4 max-w-[12ch] text-heading-40 text-foreground [text-wrap:balance] md:text-heading-48">
              Selected work.
            </h2>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="mr-2 font-[family-name:var(--font-geist-mono)] text-label-12 tabular-nums text-muted-foreground">
              {String(current + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </span>
            <Button type="button" variant="outline" size="icon" onClick={() => api?.scrollPrev()} aria-label="Previous project">
              <ArrowLeft aria-hidden />
            </Button>
            <Button type="button" variant="outline" size="icon" onClick={() => api?.scrollNext()} aria-label="Next project">
              <ArrowRight aria-hidden />
            </Button>
          </div>
        </div>

        <Carousel setApi={setApi} opts={{ align: 'start', loop: true }} className="mt-8">
          <CarouselContent className="-ml-5">
            {items.map((item, index) => {
              const featured = index % 3 === 0

              return (
                <CarouselItem
                  key={item.id}
                  className={`pl-5 ${featured ? 'basis-[92%] md:basis-[72%] xl:basis-[58%]' : 'basis-[88%] md:basis-[56%] xl:basis-[40%]'}`}
                >
                  <article className="group grid h-full min-h-[31rem] overflow-hidden border border-border bg-background shadow-[0_1px_2px_rgba(0,0,0,0.05),0_18px_42px_rgba(0,0,0,0.035)]">
                    <Link
                      href={item.href}
                      aria-label={`View ${item.title} case study`}
                      className="relative block min-h-72 overflow-hidden bg-[#F5F5F2] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
                    >
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.alt || item.title}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out motion-reduce:transform-none group-hover:scale-[1.015]"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,#ececec,#dadbff)]">
                          <span className="absolute bottom-7 left-7 text-heading-32 text-primary/35">{item.title}</span>
                        </div>
                      )}
                    </Link>

                    <div className="flex min-h-48 flex-col justify-between p-6 md:p-7">
                      <div>
                        <p className="font-[family-name:var(--font-geist-mono)] text-label-12 tabular-nums text-primary">
                          {String(index + 1).padStart(2, '0')}
                        </p>
                        <h3 translate="no" className="mt-3 text-heading-24 text-foreground md:text-heading-32">{item.title}</h3>
                        {item.disciplines ? <p className="mt-2 text-label-12 text-muted-foreground">{item.disciplines}</p> : null}
                        {item.body ? <p className="mt-5 max-w-[48ch] text-copy-14 text-muted-foreground [text-wrap:pretty]">{item.body}</p> : null}
                      </div>

                      <Link
                        href={item.href}
                        className="group/link mt-7 inline-flex min-h-11 w-fit items-center gap-2 rounded-[4px] text-button-14 text-foreground transition-colors duration-150 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                      >
                        View case study
                        <ArrowUpRight aria-hidden className="size-4 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                      </Link>
                    </div>
                  </article>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>

        <div className="mt-6 flex items-center justify-between sm:hidden">
          <span className="font-[family-name:var(--font-geist-mono)] text-label-12 tabular-nums text-muted-foreground">
            {String(current + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </span>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="icon" onClick={() => api?.scrollPrev()} aria-label="Previous project">
              <ArrowLeft aria-hidden />
            </Button>
            <Button type="button" variant="outline" size="icon" onClick={() => api?.scrollNext()} aria-label="Next project">
              <ArrowRight aria-hidden />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
