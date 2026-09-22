'use client'

import { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Container, SectionLabel } from '@/components/ui/Layout'
import { cn } from '@/lib/utils'

export type EvidenceMedia = {
  url: string
  alt: string
}

/** One entry on the evidence rail: what it is called, and what it says. */
export type EvidenceCategory = {
  key: string
  label: string
  deliverable?: string | null
  body?: string | null
  points?: string[]
}

export type FaqEntry = {
  question: string
  answer: string
}

/**
 * Selected Evidence + FAQ — approved reference (04 §12.8).
 *
 * One split section: the evidence on the left behind a vertical category rail,
 * the FAQ on the right behind a hairline. The evidence rail is a real tab set
 * (Radix, vertical orientation) so arrow keys move between categories and the
 * panel relationship is announced — the visual rail and the behaviour agree,
 * which is what 03 §2A.2 asks for.
 *
 * Neither side becomes a card wall: rows are separated by hairlines, and only
 * the open FAQ answer lifts onto its own surface, as in the reference.
 */
export function EvidenceFaq({
  evidenceLabel,
  evidenceHeading,
  categories = [],
  faqLabel,
  faqSupport,
  faqItems = [],
  media = [],
}: {
  evidenceLabel?: string | null
  evidenceHeading?: string | null
  categories?: EvidenceCategory[]
  faqLabel?: string | null
  faqSupport?: string | null
  faqItems?: FaqEntry[]
  media?: EvidenceMedia[]
}) {
  /**
   * Local state rather than URL search params: the homepage is statically
   * rendered, and reading search params would opt the whole route out of
   * prerendering for a deep link the approved composition never offers.
   */
  const [activeEvidence, setActiveEvidence] = useState(categories[0]?.key)
  const [activeFaq, setActiveFaq] = useState<string | undefined>('faq-0')

  if (categories.length === 0 && faqItems.length === 0) return null

  return (
    <section
      id="evidence"
      className="scroll-mt-24 border-t border-border bg-[#FAFAF8]"
      aria-labelledby="evidence-heading"
    >
      <Container className="py-20 md:py-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-0">
          <div className="min-w-0 lg:col-span-7 lg:pr-14">
            {evidenceLabel ? <SectionLabel>{evidenceLabel}</SectionLabel> : null}
            <h2
              id="evidence-heading"
              className="mt-6 max-w-[24ch] text-heading-32 leading-[1.14] tracking-[-0.03em] text-foreground [text-wrap:balance]"
            >
              {evidenceHeading}
            </h2>

            <Tabs
              value={activeEvidence}
              onValueChange={setActiveEvidence}
              orientation="vertical"
              className="mt-10 flex-col gap-8 sm:flex-row"
            >
              <TabsList className="h-fit w-full shrink-0 flex-col items-stretch gap-0 rounded-none bg-transparent p-0 sm:w-40">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.key}
                    value={category.key}
                    className={cn(
                      'group/cat relative min-h-11 justify-start whitespace-normal rounded-none border-0 border-l border-border bg-transparent px-4 py-2.5 text-left text-copy-14',
                      'text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:text-primary',
                    )}
                  >
                    {category.label}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 -left-px w-[2px] origin-top scale-y-0 bg-primary transition-transform duration-200 ease-out group-data-[state=active]/cat:scale-y-100"
                    />
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category, index) => {
                const picture = media.length > 0 ? media[index % media.length] : undefined

                return (
                  <TabsContent
                    key={category.key}
                    value={category.key}
                    className="mt-0 min-w-0 flex-1"
                  >
                    <div className="grid gap-8 sm:grid-cols-[minmax(0,1fr)_11rem]">
                      <div className="min-w-0">
                        {category.deliverable ? (
                          <h3 className="text-copy-16 font-semibold tracking-[-0.01em] text-foreground">
                            {category.deliverable}
                          </h3>
                        ) : null}
                        <p
                          className={cn(
                            'max-w-[42ch] text-copy-14 leading-[1.55] text-muted-foreground [text-wrap:pretty]',
                            category.deliverable && 'mt-2.5',
                          )}
                        >
                          {category.body}
                        </p>

                        <ul className="mt-7">
                          {(category.points ?? []).map((point) => (
                            <li
                              key={point}
                              className="border-t border-border py-3.5 text-copy-14 text-foreground"
                            >
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {picture ? (
                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EFEFEA] sm:aspect-auto sm:h-full sm:min-h-52">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={picture.url}
                            alt={picture.alt}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        </div>
                      ) : null}
                    </div>
                  </TabsContent>
                )
              })}
            </Tabs>
          </div>

          <div className="lg:col-span-5 lg:border-l lg:border-border lg:pl-14">
            {faqLabel ? <SectionLabel>{faqLabel}</SectionLabel> : null}
            {faqSupport ? (
              <p className="mt-3 max-w-[38ch] text-copy-14 text-muted-foreground [text-wrap:pretty]">
                {faqSupport}
              </p>
            ) : null}

            <Accordion
              type="single"
              collapsible
              value={activeFaq ?? undefined}
              onValueChange={(value) => setActiveFaq(value || undefined)}
              className="mt-8"
            >
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={item.question}
                  value={`faq-${index}`}
                  className="border-b border-border data-[state=open]:border-transparent data-[state=open]:bg-background"
                >
                  <AccordionTrigger
                    indicator="plus"
                    className="min-h-14 px-4 py-4 text-copy-14 font-medium focus-visible:outline-offset-[-2px]"
                  >
                    <span className="[text-wrap:pretty]">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-5 text-copy-14 leading-[1.55] text-muted-foreground [text-wrap:pretty]">
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
