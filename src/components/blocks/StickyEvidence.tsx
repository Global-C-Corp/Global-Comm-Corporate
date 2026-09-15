'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Container, SectionLabel } from '@/components/blocks/Layout'

export type StickyEvidenceItem = {
  id: string
  tab: string
  title: string
  body?: string
  image: string
  alt?: string
  href?: string
}

export function StickyEvidence({ items }: { items: StickyEvidenceItem[] }) {
  const [active, setActive] = useState(0)
  const refs = useRef<Array<HTMLElement | null>>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (!visible) return
        const next = Number((visible.target as HTMLElement).dataset.index)
        if (Number.isFinite(next)) setActive(next)
      },
      { rootMargin: '-18% 0px -48% 0px', threshold: [0.2, 0.45, 0.7] },
    )

    refs.current.forEach((node) => node && observer.observe(node))
    return () => observer.disconnect()
  }, [items.length])

  if (items.length === 0) return null

  const jumpTo = (index: number) => {
    refs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section id="evidence" className="scroll-mt-20 border-b border-border bg-[#FAFAF8]" aria-labelledby="evidence-heading">
      <Container className="py-20 md:py-28">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionLabel>SELECTED EVIDENCE</SectionLabel>
          </div>
          <h2 id="evidence-heading" className="max-w-[15ch] text-heading-40 text-foreground [text-wrap:balance] md:text-heading-48 lg:col-span-7 lg:col-start-5">
            What strategy becomes when it reaches execution.
          </h2>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-6">
          <aside className="self-start lg:sticky lg:top-24 lg:col-span-3">
            <div className="grid grid-cols-2 gap-1 border border-border bg-background p-1 lg:grid-cols-1">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => jumpTo(index)}
                  aria-current={active === index ? 'true' : undefined}
                  className={`min-h-11 min-w-0 rounded-[3px] px-4 py-3 text-left text-label-12 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${active === index ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-[#F5F5F2] hover:text-foreground'}`}
                >
                  <span className="block truncate">{item.tab}</span>
                </button>
              ))}
            </div>
          </aside>

          <div className="lg:col-span-9 lg:col-start-4">
            {items.map((item, index) => (
              <article
                key={item.id}
                ref={(node) => { refs.current[index] = node }}
                data-index={index}
                className="grid min-h-[70vh] scroll-mt-28 gap-8 border-t border-border py-12 first:border-t-0 first:pt-0 md:grid-cols-12 md:items-center"
              >
                <div className="relative min-h-72 overflow-hidden border border-border bg-background md:col-span-7 md:min-h-[31rem]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.alt || ''}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>

                <div className="md:col-span-5 md:pl-5">
                  <p className="font-[family-name:var(--font-geist-mono)] text-label-12 tabular-nums text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-4 text-heading-32 text-foreground">{item.title}</h3>
                  {item.body ? <p className="mt-5 text-copy-16 text-muted-foreground [text-wrap:pretty]">{item.body}</p> : null}
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="group mt-8 inline-flex min-h-11 items-center gap-2 rounded-[4px] text-button-14 text-foreground transition-colors duration-150 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                    >
                      Explore
                      <ArrowUpRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
