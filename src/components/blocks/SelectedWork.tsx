'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { Container, SectionLabel } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'
import { cn } from '@/lib/utils'

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

/**
 * Three projects per slide: one dominant feature and two supporting stacks,
 * rotating so every project takes the feature position in turn.
 */
function buildBentoSlides(items: SelectedWorkItem[]): SelectedWorkItem[][] {
  if (items.length === 0) return []
  if (items.length < 3) return [items]

  return items.map((_, index) => [
    items[index],
    items[(index + 1) % items.length],
    items[(index + 2) % items.length],
  ])
}

function ProjectTile({
  item,
  className,
  sizes,
  priority = false,
}: {
  item: SelectedWorkItem
  className?: string
  sizes: string
  priority?: boolean
}) {
  return (
    <figure className={cn('flex min-w-0 flex-col', className)}>
      <Link
        href={item.href}
        aria-label={`View the ${item.title} case study`}
        className="group/tile relative block flex-1 overflow-hidden bg-[#EFEFEA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt=""
            sizes={sizes}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out motion-reduce:transform-none group-hover/tile:scale-[1.02]"
          />
        ) : (
          <span
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(135deg,#EFEFEA_0%,#E4E4F4_58%,#D6D6FF_100%)]"
          />
        )}

        <span
          aria-hidden
          className="absolute right-4 top-4 grid size-9 place-items-center bg-black/45 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover/tile:opacity-100 group-focus-visible/tile:opacity-100"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </Link>

      <figcaption
        translate="no"
        className="mt-3 truncate text-copy-13 text-muted-foreground"
      >
        {item.title}
      </figcaption>
    </figure>
  )
}

/**
 * Selected Work — approved reference (04 §12.6).
 *
 * The strongest visual moment on the page: an editorial bento of three
 * projects, one large on the left and two stacked on the right, with real gaps
 * and quiet captions under each image. No card chrome and no text panel — the
 * media carries the section, per 04 §12.6 and 03 §24.
 */
export function SelectedWork({ items = [] }: { items?: SelectedWorkItem[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const groups = useMemo(() => buildBentoSlides(items), [items])

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

  // The reference's support line names what is still missing. It is shown only
  // while that is true — never over approved media (01 §5, CLAUDE.md §105).
  const assetsPending = items.every((item) => !item.image)

  return (
    <section id="selected-work" className="scroll-mt-24 bg-[#FAFAF8]" aria-labelledby="work-heading">
      <Container className="py-20 md:py-28">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <SectionLabel>{work.label}</SectionLabel>
            <h2 id="work-heading" className="sr-only">
              {work.label}
            </h2>
            {assetsPending ? (
              <p className="mt-2 text-copy-13 text-muted-foreground">{work.pendingAssets}</p>
            ) : null}
          </div>

          <Link
            href={work.viewAll.href}
            className="group/all inline-flex min-h-11 items-center gap-1.5 text-copy-14 text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span className="relative">
              {work.viewAll.label}
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-0.5 block h-px bg-primary"
              />
            </span>
            <ArrowUpRight
              aria-hidden
              className="size-3.5 transition-transform duration-200 group-hover/all:translate-x-0.5 group-hover/all:-translate-y-0.5"
            />
          </Link>
        </div>

        <Carousel setApi={setApi} opts={{ loop: groups.length > 1, align: 'start' }} className="mt-8">
          <CarouselContent className="-ml-5">
            {groups.map((group, groupIndex) => {
              const [feature, ...stack] = group

              return (
                /* Off-screen slides leave the tab order: three case-study
                   links each would otherwise be reachable but invisible. */
                <CarouselItem
                  key={`${feature.id}-${groupIndex}`}
                  className="pl-5"
                  inert={groupIndex !== current ? true : undefined}
                >
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-stretch">
                    <ProjectTile
                      item={feature}
                      priority={groupIndex === 0}
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      className="min-h-[20rem] lg:col-span-7 lg:min-h-[34rem]"
                    />

                    {stack.length > 0 ? (
                      <div className="flex min-w-0 flex-col gap-5 lg:col-span-5">
                        {stack.map((item) => (
                          <ProjectTile
                            key={item.id}
                            item={item}
                            sizes="(min-width: 1024px) 32vw, 100vw"
                            className="min-h-[13rem] flex-1"
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>

        {groups.length > 1 ? (
          <div className="mt-6 flex items-center justify-end gap-2">
            <span
              aria-hidden
              className="mr-1 font-[family-name:var(--font-geist-mono)] text-label-12 tabular-nums text-muted-foreground"
            >
              {String(current + 1).padStart(2, '0')} / {String(groups.length).padStart(2, '0')}
            </span>
            <span className="sr-only" aria-live="polite">
              Slide {current + 1} of {groups.length}
            </span>

            {[
              { label: 'Previous projects', icon: ArrowLeft, action: () => api?.scrollPrev() },
              { label: 'Next projects', icon: ArrowRight, action: () => api?.scrollNext() },
            ].map(({ label, icon: Icon, action }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                onClick={action}
                className="grid size-11 place-items-center rounded-[2px] border border-border text-foreground transition-colors duration-150 hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Icon aria-hidden className="size-4" />
              </button>
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  )
}
