import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Container, SectionLabel } from '@/components/blocks/Layout'
import { PikotaPlate, OgloPlate, AmsdPlate } from '@/components/blocks/WorkPlates'
import { homeV5 } from '@/content/homeV5'

const { work } = homeV5

export function SelectedWork() {
  return (
    <section
      id="selected-work"
      className="scroll-mt-20 border-b border-border bg-[#FAFAF8]"
      aria-labelledby="work-heading"
    >
      <Container className="py-20 md:py-28">
        <div className="flex items-end justify-between gap-6">
          <div>
            <SectionLabel>{work.label}</SectionLabel>
            <h2 id="work-heading" className="sr-only">{work.label}</h2>
          </div>

          <Link
            href={work.viewAll.href}
            className="group hidden min-h-11 items-center gap-2 rounded-[4px] px-3 text-label-13 text-foreground transition-colors duration-150 hover:bg-foreground/[0.05] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:inline-flex"
          >
            {work.viewAll.label}
            <ArrowRight aria-hidden className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-6 grid gap-px overflow-hidden border border-border bg-border shadow-[0_1px_2px_rgba(0,0,0,0.05),0_20px_48px_rgba(0,0,0,0.045)] lg:grid-cols-12">
          <article className="bg-background p-7 lg:col-span-3 lg:p-8">
            <p className="font-[family-name:var(--font-geist-mono)] text-label-12 uppercase tracking-[0.16em] text-muted-foreground">
              Featured project
            </p>
            <h3 className="mt-10 text-heading-48 text-foreground">PIKOTA</h3>
            <p className="mt-3 text-label-13 text-foreground">{work.projects[0].disciplines}</p>
            <p className="mt-7 max-w-[28ch] text-copy-14 text-muted-foreground [text-wrap:pretty]">{work.projects[0].body}</p>
            <Link
              href="/fr/work"
              className="group mt-10 inline-flex min-h-11 items-center gap-2 rounded-[4px] px-1 text-label-13 text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              View case study
              <ArrowUpRight aria-hidden className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </article>

          <div className="group overflow-hidden bg-background lg:col-span-6">
            <div className="h-full transition-transform duration-300 motion-reduce:transform-none group-hover:scale-[1.012]">
              <PikotaPlate />
            </div>
          </div>

          <div className="grid gap-px bg-border lg:col-span-3">
            <Link
              href={work.viewAll.href}
              aria-label="View OGLO NUTS work"
              className="group block bg-background focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
            >
              <div className="overflow-hidden">
                <div className="transition-transform duration-300 motion-reduce:transform-none group-hover:scale-[1.015]">
                  <OgloPlate />
                </div>
              </div>
              <div className="flex min-h-20 items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <h3 className="text-heading-20">OGLO NUTS</h3>
                  <p className="mt-1 truncate text-label-12 text-muted-foreground">{work.projects[1].disciplines}</p>
                </div>
                <span
                  aria-hidden
                  className="grid size-11 shrink-0 place-items-center rounded-[4px] border border-border text-foreground transition-colors duration-150 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background"
                >
                  <ArrowRight className="size-4" />
                </span>
              </div>
            </Link>

            <Link
              href={work.viewAll.href}
              aria-label="View AMSD work"
              className="group block bg-background focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
            >
              <div className="overflow-hidden">
                <div className="transition-transform duration-300 motion-reduce:transform-none group-hover:scale-[1.015]">
                  <AmsdPlate />
                </div>
              </div>
              <div className="flex min-h-20 items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <h3 className="text-heading-20">AMSD</h3>
                  <p className="mt-1 truncate text-label-12 text-muted-foreground">{work.projects[2].disciplines}</p>
                </div>
                <span
                  aria-hidden
                  className="grid size-11 shrink-0 place-items-center rounded-[4px] border border-border text-foreground transition-colors duration-150 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background"
                >
                  <ArrowRight className="size-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>

        <Link
          href={work.viewAll.href}
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-[4px] px-2 text-label-13 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:hidden"
        >
          {work.viewAll.label}
          <ArrowRight aria-hidden className="size-3.5" />
        </Link>
      </Container>
    </section>
  )
}
