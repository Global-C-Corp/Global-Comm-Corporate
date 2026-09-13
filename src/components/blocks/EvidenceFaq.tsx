'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Check, Minus, Plus } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Container, SectionLabel } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { evidence, faq } = homeV5

function EvidenceVisual({ label }: { label: string }) {
  return (
    <div className="relative min-h-64 overflow-hidden bg-[#efede7] p-6">
      <div className="absolute -left-8 -top-10 h-40 w-40 rotate-12 border border-black/5 bg-background shadow-[0_1px_2px_rgba(0,0,0,0.08),0_14px_28px_rgba(0,0,0,0.06)]" />
      <div className="absolute bottom-8 left-8 z-10 rotate-[-7deg] border border-black/6 bg-background px-5 py-7 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_16px_32px_rgba(0,0,0,0.10)]">
        <p className="text-heading-24 leading-[1.05]">
          From
          <br />
          insight
          <br />
          to opportunity
        </p>
      </div>
      <span className="absolute right-6 top-6 font-[family-name:var(--font-geist-mono)] text-label-12 uppercase text-muted-foreground">
        {label}
      </span>
      <span className="absolute bottom-6 right-6 h-px w-20 bg-primary" />
    </div>
  )
}

export function EvidenceFaq() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const evidenceLabels = new Set(evidence.categories.map((category) => category.label as string))
  const requestedEvidence = searchParams.get('evidence')
  const activeEvidence =
    requestedEvidence && evidenceLabels.has(requestedEvidence)
      ? requestedEvidence
      : evidence.categories[0].label

  const requestedFaq = searchParams.get('faq')
  const validFaq = faq.items.some((_, index) => `faq-${index}` === requestedFaq)
    ? requestedFaq
    : 'faq-0'

  const updateParam = (name: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) params.set(name, value)
    else params.delete(name)

    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  return (
    <section id="evidence" className="scroll-mt-20 bg-[#FAFAF8]" aria-labelledby="evidence-heading">
      <Container className="py-20 md:py-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 lg:col-span-7">
            <SectionLabel>{evidence.label}</SectionLabel>
            <h2
              id="evidence-heading"
              className="mt-4 max-w-[14ch] text-heading-32 text-foreground [text-wrap:balance] md:text-heading-40"
            >
              {evidence.heading}
            </h2>

            <Tabs value={activeEvidence} onValueChange={(value) => updateParam('evidence', value)} className="mt-8">
              <TabsList className="grid h-auto w-full grid-cols-2 gap-1 border border-border bg-background p-1 sm:grid-cols-4">
                {evidence.categories.map((category) => (
                  <TabsTrigger
                    key={category.label}
                    value={category.label}
                    className="min-h-11 min-w-0 whitespace-normal rounded-[3px] px-2 py-2 text-center text-label-12 data-[state=active]:border-black/8 data-[state=active]:bg-[#F5F5F2]"
                  >
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {evidence.categories.map((category) => (
                <TabsContent key={category.label} value={category.label} className="mt-5">
                  <div className="grid overflow-hidden border border-border bg-border sm:grid-cols-2">
                    <EvidenceVisual label={category.label} />
                    <div className="bg-background p-6 md:p-7">
                      <h3 className="text-heading-20 text-foreground">{category.deliverable}</h3>
                      <p className="mt-3 text-copy-14 text-muted-foreground [text-wrap:pretty]">{category.body}</p>
                      <ul className="mt-7 space-y-3">
                        {category.points.map((point) => (
                          <li key={point} className="flex items-start gap-3 text-copy-13 text-foreground">
                            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-[4px] bg-primary text-primary-foreground">
                              <Check aria-hidden className="size-3" />
                            </span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="lg:col-span-5">
            <SectionLabel>{faq.label}</SectionLabel>
            <p className="mt-4 max-w-[34ch] text-copy-16 text-muted-foreground [text-wrap:pretty]">{faq.support}</p>

            <Accordion
              type="single"
              collapsible
              value={validFaq ?? undefined}
              onValueChange={(value) => updateParam('faq', value || undefined)}
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
