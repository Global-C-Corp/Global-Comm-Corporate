'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import {
  BrandSystemPlate,
  DigitalCampaignPlate,
  TechnologyPlate,
} from '@/components/blocks/WorkPlates'
import { Container, SectionLabel } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { work } = homeV5

const PLATES = {
  brand: BrandSystemPlate,
  campaign: DigitalCampaignPlate,
  technology: TechnologyPlate,
} as const

/**
 * 04 — Réalisations.
 *
 * Le moment d'énergie visuelle de la page. Trois disciplines, trois
 * compositions différentes : la première pleine largeur, les deux suivantes en
 * 7/5 puis 5/7 inversé. Jamais trois cartes égales.
 *
 * Sur mobile, un Carousel Embla remplace l'empilement : trois plaques hautes
 * à la suite se parcourent mal au pouce, alors qu'un balayage horizontal les
 * présente une par une à pleine échelle.
 *
 * Les plaques représentent les disciplines, pas des projets clients — aucun
 * n'est approuvé dans le dépôt. Rien ne prétend le contraire à l'écran.
 */
function Entry({
  entry,
  className,
  reversed = false,
}: {
  entry: (typeof work.disciplines)[number]
  className?: string
  reversed?: boolean
}) {
  const Plate = PLATES[entry.key]

  return (
    <article className={className}>
      <div
        className={`grid gap-8 lg:grid-cols-12 lg:gap-12 ${reversed ? '' : ''}`}
      >
        <div
          className={`group relative lg:col-span-7 ${reversed ? 'lg:order-2 lg:col-start-6' : ''}`}
        >
          <div className="overflow-hidden transition-transform duration-200 ease-out group-hover:scale-[1.01]">
            <Plate />
          </div>
        </div>

        <div
          className={`flex flex-col justify-end lg:col-span-4 lg:pb-2 ${reversed ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-9'}`}
        >
          <span
            aria-hidden
            className="font-[family-name:var(--font-geist-mono)] text-label-12 text-primary"
          >
            {entry.index}
          </span>
          <h3 className="mt-4 text-heading-24 text-foreground">{entry.name}</h3>
          <p className="mt-3 font-[family-name:var(--font-geist-mono)] text-label-12 uppercase text-muted-foreground">
            {entry.disciplines}
          </p>
          <p className="mt-5 max-w-[38ch] text-copy-16 text-muted-foreground">{entry.body}</p>
        </div>
      </div>
    </article>
  )
}

export function SelectedWork() {
  const [lead, ...rest] = work.disciplines
  const LeadPlate = PLATES[lead.key]

  return (
    <section className="bg-background" aria-labelledby="work-heading">
      <Container className="py-28 md:py-36">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <SectionLabel className="lg:col-span-3">{work.label}</SectionLabel>
          <div className="lg:col-span-8 lg:col-start-5">
            <h2 id="work-heading" className="max-w-[18ch] text-heading-32 text-foreground md:text-heading-56">
              {work.heading}
            </h2>
            <p className="mt-6 max-w-[52ch] text-copy-18 text-muted-foreground">{work.intro}</p>
          </div>
        </div>

        {/* --- Desktop : compositions asymétriques ------------------------ */}
        <div className="mt-20 hidden md:block">
          {/* Entrée principale : plaque pleine largeur, métadonnées en pied. */}
          <article className="group">
            <div className="overflow-hidden transition-transform duration-200 ease-out group-hover:scale-[1.01]">
              <LeadPlate />
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <span
                  aria-hidden
                  className="font-[family-name:var(--font-geist-mono)] text-label-12 text-primary"
                >
                  {lead.index}
                </span>
                <h3 className="mt-3 text-heading-32 text-foreground">{lead.name}</h3>
              </div>
              <div className="lg:col-span-6 lg:col-start-7">
                <p className="font-[family-name:var(--font-geist-mono)] text-label-12 uppercase text-muted-foreground">
                  {lead.disciplines}
                </p>
                <p className="mt-4 max-w-[46ch] text-copy-16 text-muted-foreground">{lead.body}</p>
              </div>
            </div>
          </article>

          <Entry entry={rest[0]} className="mt-28" />
          <Entry entry={rest[1]} className="mt-28" reversed />
        </div>

        {/* --- Mobile : parcours au pouce -------------------------------- */}
        <div className="mt-14 md:hidden">
          <Carousel opts={{ align: 'start' }}>
            <CarouselContent>
              {work.disciplines.map((entry) => {
                const Plate = PLATES[entry.key]
                return (
                  <CarouselItem key={entry.key} className="basis-[88%]">
                    <Plate />
                    <span
                      aria-hidden
                      className="mt-5 block font-[family-name:var(--font-geist-mono)] text-label-12 text-primary"
                    >
                      {entry.index}
                    </span>
                    <h3 className="mt-3 text-heading-24 text-foreground">{entry.name}</h3>
                    <p className="mt-2 font-[family-name:var(--font-geist-mono)] text-label-12 uppercase text-muted-foreground">
                      {entry.disciplines}
                    </p>
                    <p className="mt-4 text-copy-16 text-muted-foreground">{entry.body}</p>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="mt-20">
          <Link
            href={work.viewAll.href}
            className="group inline-flex items-center gap-2 border-b border-foreground/25 pb-2 text-copy-18 text-foreground transition-colors duration-150 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            {work.viewAll.label}
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </Container>
    </section>
  )
}
