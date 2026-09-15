'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { Container, SectionLabel } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { work } = homeV5

export type SelectedWorkItem = {
  id: string
  title: string
  disciplines: string
  body: string
  image?: string
  alt: string
  href: string
}

function chunks<T>(items: T[], size: number): T[][] {
  const result: T[][] = []
  for (let index = 0; index < items.length; index += size) result.push(items.slice(index, index + size))
  return result
}

function ProjectImage({ item, className = '' }: { item: SelectedWorkItem; className?: string }) {
  return (
    <div className={`relative min-h-56 overflow-hidden bg-[#F5F5F2] ${className}`}>
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image}
          alt={item.alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out motion-reduce:transform-none group-hover:scale-[1.015]"
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#ececec,#dadbff)]">
          <span translate="no" className="absolute bottom-6 left-6 text-heading-24 text-primary/35">{item.title}</span>
        </div>
      )}
    </div>
  )
}

export function SelectedWork({ items = [] }: { items?: SelectedWorkItem[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const groups = useMemo(() => chunks(items, 3), [items])

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

  if (groups.length === 0) return null

  return (
    <section id="selected-work" className="scroll-mt-20 border-b border-border bg-[#FAFAF8]" aria-labelledby="work-heading">
      <Container className="py-20 md:py-28">
        <div className="flex items-end justify-between gap-6">
          <div>
            <SectionLabel>{work.label}</SectionLabel>
            <h2 id="work-heading" className="sr-only">{work.label}</h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="mr-2 hidden font-[family-name:var(--font-geist-mono)] text-label-12 tabular-nums text-muted-foreground sm:inline">
              {String(current + 1).padStart(2, '0')} / {String(groups.length).padStart(2, '0')}
            </span>
            <Button type="button" variant="outline" size="icon" onClick={() => api?.scrollPrev()} aria-label="Previous projects">
              <ArrowLeft aria-hidden />
            </Button>
            <Button type="button" variant="outline" size="icon" onClick={() => api?.scrollNext()} aria-label="Next projects">
              <ArrowRight aria-hidden />
            </Button>
          </div>
        </div>

        <Carousel setApi={setApi} opts={{ loop: true }} className="mt-6">
          <CarouselContent className="-ml-5">
            {groups.map((group, groupIndex) => {
              const featured = group[0]
              const second = group[1]
              const third = group[2]

              return (
                <CarouselItem key={featured.id} className="pl-5">
                  <div className="grid gap-5 lg:grid-cols-12">
                    <article className="flex min-h-[28rem] flex-col justify-between border border-border bg-background p-7 lg:col-span-3 lg:p-8">
                      <div>
                        <p className="font-[family-name:var(--font-geist-mono)] text-label-12 uppercase tracking-[0.16em] text-muted-foreground">
                          {String(groupIndex * 3 + 1).padStart(2, '0')}
                        </p>
                        <h3 translate="no" className="mt-8 text-heading-32 text-foreground md:text-heading-40">{featured.title}</h3>
                        {featured.disciplines ? <p className="mt-3 text-label-13 text-foreground">{featured.disciplines}</p> : null}
                        {featured.body ? <p className="mt-7 max-w-[28ch] text-copy-14 text-muted-foreground [text-wrap:pretty]">{featured.body}</p> : null}
                      </div>

                      <Link
                        href={featured.href}
                        className="group mt-8 inline-flex min-h-11 w-fit items-center gap-2 rounded-[4px] text-label-13 text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        View case study
                        <ArrowUpRight aria-hidden className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    </article>

                    <Link
                      href={featured.href}
                      aria-label={`View ${featured.title} case study`}
                      className="group border border-border bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:col-span-6"
                    >
                      <ProjectImage item={featured} className="h-full min-h-[28rem]" />
                    </Link>

                    <div className="grid gap-5 lg:col-span-3">
                      {[second, third].filter((item): item is SelectedWorkItem => Boolean(item)).map((item, index) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          className="group overflow-hidden border border-border bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                          aria-label={`View ${item.title} case study`}
                        >
                          <ProjectImage item={item} className="min-h-44" />
                          <div className="flex min-h-20 items-center justify-between gap-4 px-5 py-4">
                            <div className="min-w-0">
                              <h3 translate="no" className="text-heading-20">{item.title}</h3>
                              {item.disciplines ? <p className="mt-1 truncate text-label-12 text-muted-foreground">{item.disciplines}</p> : null}
                            </div>
                            <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-[4px] border border-border text-foreground transition-colors duration-150 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
                              <ArrowRight className="size-4" />
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>

        <Link
          href={work.viewAll.href}
          className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-[4px] px-1 text-label-13 text-foreground transition-colors duration-150 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {work.viewAll.label}
          <ArrowRight aria-hidden className="size-3.5" />
        </Link>
      </Container>
    </section>
  )
}
