'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Container, SectionLabel } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'
import { cn } from '@/lib/utils'

const { evidence, faq } = homeV5

export type EvidenceMedia = {
  url: string
  alt: string
}

function titleCase(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase()
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
export function EvidenceFaq({ media = [] }: { media?: EvidenceMedia[] }) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const evidenceKeys = evidence.categories.map((category) => category.label.toLowerCase())
  const requestedEvidence = searchParams.get('evidence')
  const activeEvidence =
    requestedEvidence && evidenceKeys.includes(requestedEvidence)
      ? requestedEvidence
      : evidenceKeys[0]

  const requestedFaq = searchParams.get('faq')
  const activeFaq =
    requestedFaq === 'none'
      ? undefined
      : faq.items.some((_, index) => `faq-${index}` === requestedFaq)
        ? requestedFaq
        : 'faq-0'

  const setParam = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  return (
    <section
      id="evidence"
      className="scroll-mt-24 border-t border-border bg-[#FAFAF8]"
      aria-labelledby="evidence-heading"
    >
      <Container className="py-20 md:py-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-0">
          <div className="min-w-0 lg:col-span-7 lg:pr-14">
            <SectionLabel>{evidence.label}</SectionLabel>
            <h2
              id="evidence-heading"
              className="mt-6 max-w-[24ch] text-heading-32 leading-[1.14] tracking-[-0.03em] text-foreground [text-wrap:balance]"
            >
              {evidence.heading}
            </h2>

            <Tabs
              value={activeEvidence}
              onValueChange={(value) => setParam('evidence', value)}
              orientation="vertical"
              className="mt-10 flex-col gap-8 sm:flex-row"
            >
              <TabsList className="h-fit w-full shrink-0 flex-col items-stretch gap-0 rounded-none bg-transparent p-0 sm:w-32">
                {evidence.categories.map((category) => (
                  <TabsTrigger
                    key={category.label}
                    value={category.label.toLowerCase()}
                    className={cn(
                      'group/cat relative min-h-11 justify-start rounded-none border-0 border-l border-border bg-transparent px-4 text-left text-copy-14',
                      'text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:text-primary',
                    )}
                  >
                    {titleCase(category.label)}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 -left-px w-[2px] origin-top scale-y-0 bg-primary transition-transform duration-200 ease-out group-data-[state=active]/cat:scale-y-100"
                    />
                  </TabsTrigger>
                ))}
              </TabsList>

              {evidence.categories.map((category, index) => {
                const picture = media.length > 0 ? media[index % media.length] : undefined

                return (
                  <TabsContent
                    key={category.label}
                    value={category.label.toLowerCase()}
                    className="mt-0 min-w-0 flex-1"
                  >
                    <div className="grid gap-8 sm:grid-cols-[minmax(0,1fr)_11rem]">
                      <div className="min-w-0">
                        <h3 className="text-copy-16 font-semibold tracking-[-0.01em] text-foreground">
                          {category.deliverable}
                        </h3>
                        <p className="mt-2.5 max-w-[42ch] text-copy-14 leading-[1.55] text-muted-foreground [text-wrap:pretty]">
                          {category.body}
                        </p>

                        <ul className="mt-7">
                          {category.points.map((point) => (
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
            <SectionLabel>{faq.label}</SectionLabel>
            <p className="mt-3 max-w-[38ch] text-copy-14 text-muted-foreground [text-wrap:pretty]">
              {faq.support}
            </p>

            <Accordion
              type="single"
              collapsible
              value={activeFaq ?? undefined}
              onValueChange={(value) => setParam('faq', value || 'none')}
              className="mt-8"
            >
              {faq.items.map((item, index) => (
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
