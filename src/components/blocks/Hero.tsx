import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Container, SectionLabel } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { hero, experience } = homeV5

function HeroVisual() {
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
      <div className="absolute bottom-[22%] left-[42%] h-16 w-2 bg-foreground" />
      <div className="absolute bottom-[21%] left-[40.8%] h-5 w-5 rounded-full bg-foreground" />

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
        <span className="font-[family-name:var(--font-geist-mono)] text-label-12 text-muted-foreground">01 / 03</span>
        <div className="flex gap-2">
          <span className="grid size-8 place-items-center rounded-full border border-border bg-background text-foreground">
            <ArrowLeft aria-hidden className="size-3.5" />
          </span>
          <span className="grid size-8 place-items-center rounded-full bg-foreground text-background">
            <ArrowRight aria-hidden className="size-3.5" />
          </span>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="bg-[#FAFAF8]" aria-labelledby="hero-heading">
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
                  <ArrowRight aria-hidden className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="group px-2">
                <Link href={hero.secondaryCTA.href}>
                  {hero.secondaryCTA.label}
                  <ArrowRight aria-hidden className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-4">
            <HeroVisual />
          </div>

          <div className="flex flex-col justify-between lg:col-span-3 lg:pl-4">
            <p className="max-w-[28ch] text-copy-18 text-muted-foreground">{hero.support}</p>
            <div className="mt-12 lg:mt-0">
              <Separator />
              <p className="mt-5 max-w-[25ch] text-copy-14 text-muted-foreground">
                {hero.closing}
              </p>
            </div>
          </div>
        </div>

        <Separator className="mt-10" />

        <div className="grid gap-6 py-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-3">
            <SectionLabel>{experience.label}</SectionLabel>
            <p className="mt-2 max-w-[24ch] text-copy-14 text-muted-foreground">{experience.support}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-5 lg:col-span-9">
            {experience.names.map((name) => (
              <div key={name} className="flex min-h-10 items-center border-l border-border pl-5 first:border-l-0 first:pl-0">
                <span className="text-heading-20 font-medium tracking-[-0.03em] text-foreground">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
