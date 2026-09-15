'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Minus, Plus } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Container, SectionLabel } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { evidence, faq } = homeV5

export type EvidenceMedia = {
  url: string
  alt: string
}

export function EvidenceFaq({ media = [] }: { media?: EvidenceMedia[] }) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeEvidence, setActiveEvidence] = useState(0)
  const evidenceRefs = useRef<Array<HTMLElement | null>>([])

  const requestedFaq = searchParams.get('faq')
  const validFaq =
    requestedFaq === 'none'
      ? undefined
      : faq.items.some((_, index) => `faq-${index}` === requestedFaq)
        ? requestedFaq
        : 'faq-0'

  const updateFaq = (value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set('faq', value)
    else params.delete('faq')
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (!visible) return
        const index = Number((visible.target as HTMLElement).dataset.index)
        if (Number.isFinite(index)) setActiveEvidence(index)
      },
      { rootMargin: '-18% 0px -48% 0px', threshold: [0.2, 0.45, 0.7] },
    )

    evidenceRefs.current.forEach((node) => node && observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const jumpToEvidence = (index: number) => {
    evidenceRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section id="evidence" className="scroll-mt-20 bg-[#FAFAF8]" aria-labelledby="evidence-heading">
      <Container className="py-20 md:py-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 lg:col-span-7">
            <SectionLabel>{evidence.label}</SectionLabel>
            <h2 id="evidence-heading" className="mt-4 max-w-[14ch] text-heading-32 text-foreground [text-wrap:balance] md:text-heading-40">
              {evidence.heading}
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-[10rem_minmax(0,1fr)]">
              <div className="self-start md:sticky md:top-24">
                <div className="grid grid-cols-2 gap-1 border border-border bg-background p-1 md:grid-cols-1">
                  {evidence.categories.map((category, index) => (
                    <button
                      key={category.label}
                      type="button"
                      onClick={() => jumpToEvidence(index)}
                      aria-current={activeEvidence === index ? 'true' : undefined}
                      className={`min-h-11 min-w-0 rounded-[3px] px-3 py-2 text-left text-label-12 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${activeEvidence === index ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-[#F5F5F2] hover:text-foreground'}`}
                    >
                      <span className="block truncate">{category.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                {evidence.categories.map((category, index) => {
                  const picture = media.length > 0 ? media[index % media.length] : undefined

                  return (
                    <article
                      key={category.label}
                      ref={(node) => { evidenceRefs.current[index] = node }}
                      data-index={index}
                      className="scroll-mt-28 border-t border-border py-10 first:border-t-0 first:pt-0"
                    >
                      {picture ? (
                        <div className="relative min-h-64 overflow-hidden border border-border bg-background">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={picture.url} alt={picture.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                        </div>
                      ) : null}

                      <div className={picture ? 'pt-6' : ''}>
                        <h3 className="text-heading-20 text-foreground">{category.deliverable}</h3>
                        <p className="mt-3 text-copy-14 text-muted-foreground [text-wrap:pretty]">{category.body}</p>
                        <ul className="mt-6 space-y-2">
                          {category.points.map((point) => (
                            <li key={point} className="flex gap-3 text-copy-13 text-foreground">
                              <span aria-hidden className="text-primary">—</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <SectionLabel>{faq.label}</SectionLabel>
            <p className="mt-4 max-w-[34ch] text-copy-16 text-muted-foreground [text-wrap:pretty]">{faq.support}</p>

            <Accordion
              type="single"
              collapsible
              value={validFaq ?? undefined}
              onValueChange={(value) => updateFaq(value || 'none')}
              className="mt-8 overflow-hidden border border-border bg-background"
            >
              {faq.items.map((item, index) => (
                <AccordionItem key={item.question} value={`faq-${index}`} className="px-5">
                  <AccordionTrigger className="group min-h-14 py-4 text-left text-copy-14 font-semibold hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring">
                    <span className="flex items-start gap-3 pr-4">
                      <span className="mt-0.5 text-primary group-data-[state=open]:hidden">
                        <Plus aria-hidden className="size-4" />
                      </span>
                      <span className="mt-0.5 hidden text-primary group-data-[state=open]:inline">
                        <Minus aria-hidden className="size-4" />
                      </span>
                      <span className="[text-wrap:pretty]">{item.question}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pl-7 pr-4 text-copy-13 text-muted-foreground [text-wrap:pretty]">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Container>
    </section>
  )
}
