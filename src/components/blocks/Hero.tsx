'use client'

import { useEffect, useState } from 'react'
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
import { cn } from '@/lib/utils'

const { hero } = homeV5

export type HeroSlide = {
  id: string
  image: string
  eyebrow: string
  title: string
  body: string
  href?: string
}

export type HeroLogo = {
  id: string
  name: string
  logo: string
  href?: string
}

/**
 * Hero project carousel — approved reference (04 §12.2, 03 §21).
 *
 * The media is presented clean: no overlay text, no card chrome. Caption,
 * index and controls sit on one quiet row *below* the image, which is what
 * lets the photograph read as work rather than as a banner.
 *
 * Progression is manual only. The reference shows explicit previous/next
 * controls and a visible index, and 01 §8 forbids autoplay without a reason of
 * composition — so there is no timer here at all.
 */
function HeroVisual({ slides }: { slides: HeroSlide[] }) {
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

  const active = slides[current]
  const total = Math.max(slides.length, 1)

  return (
    <div className="flex flex-col">
      <div className="relative aspect-[16/13] w-full overflow-hidden bg-white/[0.04] sm:aspect-[4/3] lg:aspect-[16/15]">
        {slides.length === 0 ? (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#101018_0%,#16162a_60%,#1d1dff_240%)]" />
        ) : (
          <Carousel setApi={setApi} opts={{ loop: true }} className="h-full">
            <CarouselContent className="-ml-0 h-full">
              {slides.map((slide, index) => {
                const media = (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.image}
                      alt={slide.href ? '' : slide.title}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      fetchPriority={index === 0 ? 'high' : 'auto'}
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    {slide.href ? (
                      <span
                        aria-hidden
                        className="absolute right-4 top-4 grid size-9 place-items-center bg-black/45 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover/slide:opacity-100 group-focus-visible/slide:opacity-100"
                      >
                        <ArrowUpRight className="size-4" />
                      </span>
                    ) : null}
                  </>
                )

                return (
                  /*
                   * Embla keeps every slide in the DOM, so without `inert` a
                   * keyboard user tabs through six invisible case-study links
                   * before reaching the controls (WCAG 2.4.3).
                   */
                  <CarouselItem
                    key={slide.id}
                    className="h-full pl-0"
                    inert={index !== current ? true : undefined}
                  >
                    <div className="relative h-full w-full overflow-hidden">
                      {slide.href ? (
                        <Link
                          href={slide.href}
                          aria-label={`View the ${slide.title} case study`}
                          className="group/slide absolute inset-0 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
                        >
                          {media}
                        </Link>
                      ) : (
                        media
                      )}
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
          </Carousel>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="min-w-0 truncate text-copy-13 text-white/55">
          {active?.eyebrow ?? 'Visual concept'}
        </p>

        <div className="flex shrink-0 items-center gap-2">
          <span
            aria-hidden
            className="mr-1 font-[family-name:var(--font-geist-mono)] text-label-12 tabular-nums text-white/55"
          >
            {String(Math.min(current + 1, total)).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <span className="sr-only" aria-live="polite">
            Project {Math.min(current + 1, total)} of {total}
          </span>

          {[
            { label: 'Previous project', icon: ArrowLeft, action: () => api?.scrollPrev() },
            { label: 'Next project', icon: ArrowRight, action: () => api?.scrollNext() },
          ].map(({ label, icon: Icon, action }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              disabled={slides.length < 2}
              onClick={action}
              className={cn(
                'grid size-11 place-items-center rounded-[2px] border border-white/25 text-white',
                'transition-colors duration-150 hover:border-white/60 hover:bg-white/10',
                'disabled:pointer-events-none disabled:opacity-40',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
              )}
            >
              <Icon aria-hidden className="size-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Hero({ slides = [] }: { slides?: HeroSlide[]; logos?: HeroLogo[] }) {
  return (
    <section
      className="relative isolate overflow-hidden bg-[#08080B] text-white"
      aria-labelledby="hero-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_88%_8%,rgba(0,0,255,0.28),transparent_42%),linear-gradient(160deg,#08080B_0%,#0B0B14_62%,#111134_100%)]"
      />

      {/* pt clears the overlaying header (5.5rem) plus the section's own room. */}
      <Container className="pb-10 pt-[8.5rem] md:pb-12 md:pt-[10rem]">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionLabel className="text-white/55">{hero.eyebrow}</SectionLabel>

            <h1
              id="hero-heading"
              className="mt-7 max-w-[14ch] text-heading-40 leading-[1.08] tracking-[-0.035em] text-white sm:text-heading-48 lg:text-heading-56"
            >
              {hero.heading}{' '}
              {/* The closing phrase carries the approved brand-blue rule. It is
                  a drawn box-shadow rather than an underline so the weight and
                  the gap to the baseline stay under our control. */}
              <span className="relative inline-block">
                {hero.headingAccent}
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-1 block h-[4px] bg-primary"
                />
              </span>
            </h1>

            <p className="mt-8 max-w-[46ch] text-copy-16 leading-[1.6] text-white/70 [text-wrap:pretty]">
              {hero.support}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-6">
              <Button asChild size="lg" className="group focus-visible:outline-white">
                <Link href={hero.primaryCTA.href}>
                  {hero.primaryCTA.label}
                  <ArrowUpRight
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </Button>

              <Link
                href={hero.secondaryCTA.href}
                className="group inline-flex min-h-11 items-center gap-2 rounded-[2px] text-copy-14 text-white transition-colors duration-150 hover:text-white/75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {hero.secondaryCTA.label}
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <HeroVisual slides={slides} />
          </div>
        </div>
      </Container>

      {/* Quiet closing statement, set off by a hairline across the full
          measure and marked with a short brand rule. */}
      <div className="border-t border-white/12">
        <Container className="py-5">
          <p className="flex items-start gap-4 text-copy-13 text-white/55">
            <span aria-hidden className="mt-[0.35rem] block h-3 w-px shrink-0 bg-primary" />
            <span className="[text-wrap:pretty]">{hero.closing}</span>
          </p>
        </Container>
      </div>
    </section>
  )
}
