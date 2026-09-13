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
import { Separator } from '@/components/ui/separator'
import { Container, SectionLabel } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { hero, experience } = homeV5

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

  useEffect(() => {
    if (!api || slides.length < 2) return

    const timer = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return

      const next = api.selectedScrollSnap() + 1
      api.scrollTo(next >= slides.length ? 0 : next)
    }, 6000)

    return () => window.clearInterval(timer)
  }, [api, slides.length])

  if (slides.length === 0) {
    return (
      <div className="relative min-h-[29rem] overflow-hidden bg-[#dce9ff] sm:min-h-[32rem] lg:min-h-[35rem]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_14%,rgba(0,0,255,0.18),transparent_34%)]" />
        <div
          className="absolute -left-[6%] top-[8%] h-[74%] w-[58%] bg-[#262626]"
          style={{ clipPath: 'polygon(0 0, 100% 18%, 72% 100%, 9% 82%)' }}
        />
        <div
          className="absolute left-[18%] top-[26%] h-[54%] w-[58%] bg-[#b9b9b4]"
          style={{ clipPath: 'polygon(0 13%, 100% 0, 82% 100%, 16% 86%)' }}
        />
        <div className="absolute bottom-0 right-0 h-[56%] w-[43%] bg-primary" />
        <div className="absolute bottom-0 right-[43%] h-[28%] w-[31%] bg-[#f4f1e8]" />

        <div className="absolute right-8 top-8 max-w-[10rem] text-primary-foreground sm:right-10 sm:top-10">
          <p className="text-heading-24 font-normal leading-[1.05] tracking-[-0.03em] sm:text-heading-32">
            BRANDS
            <br />
            PEOPLE
            <br />
            PROGRESS
          </p>
          <span className="mt-6 block h-8 w-px bg-primary-foreground/70" />
          <p className="mt-6 font-[family-name:var(--font-geist-mono)] text-[0.55rem] uppercase tracking-[0.2em] text-primary-foreground/80">
            Strategy
            <br />
            Creative
            <br />
            Technology
            <br />
            Real growth
          </p>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-background/90 px-4 py-3 backdrop-blur-sm">
          <span className="font-[family-name:var(--font-geist-mono)] text-label-12 text-muted-foreground">
            01 / 01
          </span>
          <p className="text-label-12 text-muted-foreground">
            Add media to Home Page → Featured Projects in Payload
          </p>
        </div>
      </div>
    )
  }

  return (
    <Carousel setApi={setApi} opts={{ loop: true }} className="group">
      <CarouselContent className="-ml-0">
        {slides.map((slide) => (
          <CarouselItem key={slide.id} className="pl-0">
            <article className="relative min-h-[29rem] overflow-hidden bg-foreground sm:min-h-[32rem] lg:min-h-[35rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/18 to-black/12" />

              <div className="absolute inset-x-0 bottom-0 p-6 pb-20 text-white sm:p-8 sm:pb-20">
                <p className="font-[family-name:var(--font-geist-mono)] text-label-12 uppercase tracking-[0.15em] text-white/65">
                  {slide.eyebrow}
                </p>
                <h2 className="mt-3 max-w-[16ch] text-heading-24 text-white sm:text-heading-32">
                  {slide.title}
                </h2>
                {slide.body ? (
                  <p className="mt-3 max-w-[42ch] text-copy-14 text-white/72">
                    {slide.body}
                  </p>
                ) : null}

                {slide.href ? (
                  <Link
                    href={slide.href}
                    className="group/link mt-5 inline-flex items-center gap-2 text-button-14 text-white"
                  >
                    View case study
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                    />
                  </Link>
                ) : null}
              </div>
            </article>
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between bg-background/90 px-4 py-3 backdrop-blur-sm">
        <span className="font-[family-name:var(--font-geist-mono)] text-label-12 text-muted-foreground">
          {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous hero slide"
            onClick={() => api?.scrollPrev()}
            className="grid size-8 place-items-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-foreground"
          >
            <ArrowLeft aria-hidden className="size-3.5" />
          </button>
          <button
            type="button"
            aria-label="Next hero slide"
            onClick={() => api?.scrollNext()}
            className="grid size-8 place-items-center rounded-full bg-foreground text-background transition-colors hover:bg-primary"
          >
            <ArrowRight aria-hidden className="size-3.5" />
          </button>
        </div>
      </div>
    </Carousel>
  )
}

function LogoMarquee({ logos }: { logos: HeroLogo[] }) {
  if (logos.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-5 lg:col-span-9">
        {experience.names.map((name) => (
          <div
            key={name}
            className="flex min-h-10 items-center border-l border-border pl-5 first:border-l-0 first:pl-0"
          >
            <span className="text-heading-20 font-medium tracking-[-0.03em] text-foreground">
              {name}
            </span>
          </div>
        ))}
      </div>
    )
  }

  const items = logos.length < 6 ? [...logos, ...logos, ...logos] : [...logos, ...logos]

  return (
    <div className="relative min-w-0 overflow-hidden lg:col-span-9 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className="gc-hero-logo-marquee flex w-max items-center gap-12 pr-12">
        {items.map((logo, index) => {
          const image = (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo.logo}
              alt={logo.name}
              className="max-h-8 w-auto max-w-32 object-contain grayscale opacity-70 transition-all duration-200 hover:grayscale-0 hover:opacity-100"
              loading={index < logos.length ? 'eager' : 'lazy'}
            />
          )

          return logo.href ? (
            <a
              key={`${logo.id}-${index}`}
              href={logo.href}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 min-w-28 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              {image}
            </a>
          ) : (
            <span
              key={`${logo.id}-${index}`}
              className="flex h-10 min-w-28 items-center justify-center"
            >
              {image}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export function Hero({
  slides = [],
  logos = [],
}: {
  slides?: HeroSlide[]
  logos?: HeroLogo[]
}) {
  return (
    <section
      className="gc-hero-grain relative isolate overflow-hidden bg-[#FAFAF8]"
      aria-labelledby="hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_18%,rgba(0,0,255,0.19),transparent_28%),radial-gradient(circle_at_28%_34%,rgba(255,255,255,0.92),transparent_34%),linear-gradient(135deg,#fafaf8_0%,#f4f4ef_42%,#e5e5ff_100%)]" />

      <Container className="pb-10 pt-12 md:pb-12 md:pt-16">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5">
            <SectionLabel>{hero.eyebrow}</SectionLabel>
            <h1
              id="hero-heading"
              className="mt-7 max-w-[11ch] text-heading-40 text-foreground sm:text-heading-48 lg:text-heading-64 xl:text-heading-72"
            >
              {hero.heading}
            </h1>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="group">
                <Link href={hero.primaryCTA.href}>
                  {hero.primaryCTA.label}
                  <ArrowRight
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="group px-2">
                <Link href={hero.secondaryCTA.href}>
                  {hero.secondaryCTA.label}
                  <ArrowRight
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-4">
            <HeroVisual slides={slides} />
          </div>

          <div className="flex flex-col justify-between lg:col-span-3 lg:pl-4">
            <p className="max-w-[28ch] text-copy-18 text-foreground/65">{hero.support}</p>
            <div className="mt-12 lg:mt-0">
              <Separator />
              <p className="mt-5 max-w-[25ch] text-copy-14 text-foreground/60">
                {hero.closing}
              </p>
            </div>
          </div>
        </div>

        <Separator className="mt-10 bg-foreground/12" />

        <div className="grid gap-6 py-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-3">
            <SectionLabel>{experience.label}</SectionLabel>
            <p className="mt-2 max-w-[24ch] text-copy-14 text-foreground/55">
              {experience.support}
            </p>
          </div>

          <LogoMarquee logos={logos} />
        </div>
      </Container>
    </section>
  )
}
