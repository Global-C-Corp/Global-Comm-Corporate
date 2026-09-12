import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Container, SectionLabel } from '@/components/blocks/Layout'
import { PikotaPlate, OgloPlate, AmsdPlate } from '@/components/blocks/WorkPlates'
import { homeV5 } from '@/content/homeV5'

const { work } = homeV5

export function SelectedWork() {
  return (
    <section className="bg-[#FAFAF8]" aria-labelledby="work-heading">
      <Container className="py-16 md:py-20">
        <div className="flex items-end justify-between gap-6">
          <SectionLabel>{work.label}</SectionLabel>
          <Link href={work.viewAll.href} className="group hidden items-center gap-2 text-label-13 text-foreground sm:inline-flex">
            {work.viewAll.label}
            <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-5 grid gap-px bg-border lg:grid-cols-12">
          <article className="bg-background p-7 lg:col-span-3">
            <p className="font-[family-name:var(--font-geist-mono)] text-label-12 uppercase tracking-[0.16em] text-muted-foreground">
              Featured project
            </p>
            <h2 id="work-heading" className="mt-10 text-heading-48 text-foreground">PIKOTA</h2>
            <p className="mt-3 text-label-13 text-foreground">{work.projects[0].disciplines}</p>
            <p className="mt-7 max-w-[28ch] text-copy-14 text-muted-foreground">{work.projects[0].body}</p>
            <Link href="/fr/work" className="group mt-10 inline-flex items-center gap-2 text-label-13 text-primary">
              View case study
              <ArrowUpRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </article>

          <div className="bg-background lg:col-span-6">
            <PikotaPlate />
          </div>

          <div className="grid gap-px bg-border lg:col-span-3">
            <article className="group bg-background">
              <div className="overflow-hidden">
                <OgloPlate />
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <h3 className="text-heading-20">OGLO NUTS</h3>
                  <p className="mt-1 text-label-12 text-muted-foreground">{work.projects[1].disciplines}</p>
                </div>
                <span className="grid size-8 place-items-center rounded-full border border-border group-hover:bg-foreground group-hover:text-background">
                  <ArrowRight aria-hidden className="size-3.5" />
                </span>
              </div>
            </article>

            <article className="group bg-background">
              <div className="overflow-hidden">
                <AmsdPlate />
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <h3 className="text-heading-20">AMSD</h3>
                  <p className="mt-1 text-label-12 text-muted-foreground">{work.projects[2].disciplines}</p>
                </div>
                <span className="grid size-8 place-items-center rounded-full border border-border group-hover:bg-foreground group-hover:text-background">
                  <ArrowRight aria-hidden className="size-3.5" />
                </span>
              </div>
            </article>
          </div>
        </div>

        <Link href={work.viewAll.href} className="mt-6 inline-flex items-center gap-2 text-label-13 sm:hidden">
          {work.viewAll.label} <ArrowRight aria-hidden className="size-3.5" />
        </Link>
      </Container>
    </section>
  )
}
