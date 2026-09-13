'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { Separator } from '@/components/ui/separator'
import { HeroSection } from '@/components/ui/glass-video-hero'
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
  logo?: string
  href?: string
}

function HeroVisual({ slides }: { slides: HeroSlide[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)

  useEffect(() => {
    if (!api) return

    const sync = () => setCurrent(api.selectedScrollSnap())
    const stopAutoRotate = () => setAutoRotate(false)

    sync()
    api.on('select', sync)
    api.on('reInit', sync)
    api.on('pointerDown', stopAutoRotate)

    return () => {
      api.off('select', sync)
      api.off('reInit', sync)
      api.off('pointerDown', stopAutoRotate)
    }
  }, [api])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')

    const syncMotionPreference = () => {
      if (media.matches) setAutoRotate(false)
    }

    syncMotionPreference()
    media.addEventListener('change', syncMotionPreference)

    return () => media.removeEventListener('change', syncMotionPreference)
  }, [])

  useEffect(() => {
    if (!api || slides.length < 2 || !autoRotate) return

    const timer = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return

      const next = api.selectedScrollSnap() + 1
      api.scrollTo(next >= slides.length ? 0 : next)
    }, 6000)

    return () => window.clearInterval(timer)
  }, [api, autoRotate, slides.length])

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
        {slides.map((slide, index) => (
          <CarouselItem key={slide.id} className="pl-0">
            <article className="relative min-h-[29rem] overflow-hidden bg-foreground sm:min-h-[32rem] lg:min-h-[35rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt=""
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
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

      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between rounded-[4px] border border-white/18 bg-black/45 px-4 py-3 text-white shadow-[0_1px_2px_rgba(0,0,0,0.42),0_10px_28px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <span className="font-[family-name:var(--font-geist-mono)] text-label-12 tabular-nums text-white/72">
          {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            aria-label={autoRotate ? 'Pause hero carousel' : 'Play hero carousel'}
                onClick={() => setAutoRotate((value) => !value)}
            className="grid size-11 place-items-center rounded-[4px] border border-white/22 bg-white/8 text-white transition-colors duration-150 hover:border-white/45 hover:bg-white/16 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {autoRotate ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4" />}
          </button>
          <button
            type="button"
            aria-label="Previous hero slide"
            onClick={() => {
              setAutoRotate(false)
              api?.scrollPrev()
            }}
            className="grid size-11 place-items-center rounded-[4px] border border-white/22 bg-white/8 text-white transition-colors duration-150 hover:border-white/45 hover:bg-white/16 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ArrowLeft aria-hidden className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next hero slide"
            onClick={() => {
              setAutoRotate(false)
              api?.scrollNext()
            }}
            className="grid size-11 place-items-center rounded-[4px] border border-white/22 bg-white text-black transition-colors duration-150 hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ArrowRight aria-hidden className="size-4" />
          </button>
        </div>
      </div>
    </Carousel>
  )
}

function LogoMark({ logo, duplicate = false }: { logo: HeroLogo; duplicate?: boolean }) {
  const content = logo.logo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo.logo}
      alt={duplicate ? '' : logo.name}
      className="max-h-8 w-auto max-w-32 object-contain grayscale brightness-0 invert opacity-75 transition-all duration-200 group-hover:grayscale-0 group-hover:brightness-100 group-hover:invert-0 group-hover:opacity-100"
      loading={duplicate ? 'lazy' : 'eager'}
    />
  ) : (
    <span className="text-heading-20 font-medium tracking-[-0.03em] text-white/72 transition-colors group-hover:text-white">
      {logo.name}
    </span>
  )

  const className =
    'group flex h-12 min-w-32 shrink-0 items-center justify-center px-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring'

  return logo.href ? (
    <a
      href={logo.href}
      target="_blank"
      rel="noreferrer"
      className={className}
      translate="no"
      aria-hidden={duplicate || undefined}
      tabIndex={duplicate ? -1 : undefined}
    >
      {content}
    </a>
  ) : (
    <span className={className} translate="no" aria-hidden={duplicate || undefined}>
      {content}
    </span>
  )
}

function LogoMarquee({ logos }: { logos: HeroLogo[] }) {
  const [paused, setPaused] = useState(false)
  const source = logos.length > 0
    ? logos
    : experience.names.map((name, index) => ({
        id: `fallback-${index}`,
        name,
      } satisfies HeroLogo))

  const sequence = useMemo(() => {
    if (source.length === 0) return []
    const repeats = Math.max(1, Math.ceil(8 / source.length))
    return Array.from({ length: repeats }, () => source).flat()
  }, [source])

  if (sequence.length === 0) return null

  return (
    <div className="gc-logo-marquee-viewport relative min-w-0 overflow-hidden pr-14 lg:col-span-9 [mask-image:linear-gradient(to_right,transparent,black_7%,black_88%,transparent)]">
      <div className="gc-logo-marquee-track flex w-max" data-paused={paused}>
        <div className="gc-logo-marquee-group flex shrink-0 items-center gap-12 pr-12">
          {sequence.map((logo, index) => (
            <LogoMark key={`a-${logo.id}-${index}`} logo={logo} />
          ))}
        </div>
        <div className="gc-logo-marquee-group flex shrink-0 items-center gap-12 pr-12" aria-hidden>
          {sequence.map((logo, index) => (
            <LogoMark key={`b-${logo.id}-${index}`} logo={logo} duplicate />
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label={paused ? 'Play client logo marquee' : 'Pause client logo marquee'}
        onClick={() => setPaused((value) => !value)}
        className="absolute right-0 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-[4px] border border-white/22 bg-black/35 text-white backdrop-blur-xl transition-colors duration-150 hover:border-white/45 hover:bg-black/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {paused ? <Play aria-hidden className="size-4" /> : <Pause aria-hidden className="size-4" />}
      </button>
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
    <HeroSection
      className="min-h-0"
      aria-labelledby="hero-heading"
      poster={slides[0]?.image}
    >
      <Container className="pb-10 pt-12 md:pb-12 md:pt-16">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5">
            <SectionLabel className="text-white/68">{hero.eyebrow}</SectionLabel>
            <h1
              id="hero-heading"
              className="mt-7 max-w-[11ch] text-heading-40 text-white sm:text-heading-48 lg:text-heading-64 xl:text-heading-72"
            >
              {hero.heading}
            </h1>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="group shadow-[0_1px_2px_rgba(0,0,0,0.35),0_10px_28px_rgba(0,0,255,0.20)] focus-visible:outline-white">
                <Link href={hero.primaryCTA.href}>
                  {hero.primaryCTA.label}
                  <ArrowRight
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="group border-white/24 bg-white/8 px-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.24)] backdrop-blur-xl hover:border-white/42 hover:bg-white/14 hover:text-white focus-visible:outline-white">
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
            <p className="max-w-[28ch] text-copy-18 text-white/72">{hero.support}</p>
            <div className="mt-12 lg:mt-0">
              <Separator className="bg-white/22" />
              <p className="mt-5 max-w-[25ch] text-copy-14 text-white/66">
                {hero.closing}
              </p>
            </div>
          </div>
        </div>

        <Separator className="mt-10 bg-white/22" />

        <div className="grid gap-6 py-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-3">
            <SectionLabel className="text-white/68">{experience.label}</SectionLabel>
            <p className="mt-2 max-w-[24ch] text-copy-14 text-white/62">
              {experience.support}
            </p>
          </div>

          <LogoMarquee logos={logos} />
        </div>
      </Container>
    </HeroSection>
  )
}
