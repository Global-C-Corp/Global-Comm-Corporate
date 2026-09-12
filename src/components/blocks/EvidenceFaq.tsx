'use client'

import { Check, Minus, Plus } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Container, SectionLabel } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { evidence, faq } = homeV5

function EvidenceVisual({ label }: { label: string }) {
  return (
    <div className="relative min-h-56 overflow-hidden bg-[#efede7] p-6">
      <div className="absolute -left-8 -top-10 h-40 w-40 rotate-12 bg-background shadow-sm" />
      <div className="absolute bottom-8 left-8 z-10 rotate-[-7deg] bg-background px-5 py-7 shadow-md">
        <p className="text-heading-24 leading-[1.05]">From<br />insight<br />to opportunity</p>
      </div>
      <span className="absolute right-6 top-6 font-[family-name:var(--font-geist-mono)] text-label-12 uppercase text-muted-foreground">{label}</span>
      <span className="absolute bottom-6 right-6 h-px w-20 bg-primary" />
    </div>
  )
}

export function EvidenceFaq() {
  return (
    <section className="bg-[#FAFAF8]">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionLabel>{evidence.label}</SectionLabel>
            <Tabs defaultValue={evidence.categories[0].label} className="mt-5">
              <TabsList variant="line" className="h-auto w-full justify-start gap-6 overflow-x-auto border-b border-border p-0 pb-[5px]">
                {evidence.categories.map((category) => (
                  <TabsTrigger key={category.label} value={category.label} className="h-auto flex-none px-0 py-3 text-label-12">
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {evidence.categories.map((category) => (
                <TabsContent key={category.label} value={category.label} className="pt-5">
                  <div className="grid gap-px bg-border sm:grid-cols-2">
                    <EvidenceVisual label={category.label} />
                    <div className="bg-background p-6">
                      <h3 className="text-heading-20 text-foreground">{category.deliverable}</h3>
                      <p className="mt-3 text-copy-14 text-muted-foreground">{category.body}</p>
                      <ul className="mt-6 space-y-3">
                        {category.points.map((point) => (
                          <li key={point} className="flex items-center gap-3 text-copy-13 text-foreground">
                            <span className="grid size-4 place-items-center rounded-full bg-primary text-primary-foreground">
                              <Check aria-hidden className="size-2.5" />
                            </span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="lg:col-span-6">
            <SectionLabel>{faq.label}</SectionLabel>
            <Accordion type="single" collapsible defaultValue="faq-0" className="mt-5 border-t border-border bg-background">
              {faq.items.map((item, index) => (
                <AccordionItem key={item.question} value={`faq-${index}`} className="px-5">
                  <AccordionTrigger className="group py-5 text-left text-copy-14 font-semibold hover:no-underline">
                    <span className="flex items-center gap-3">
                      <span className="text-primary group-data-[state=open]:hidden"><Plus aria-hidden className="size-3.5" /></span>
                      <span className="hidden text-primary group-data-[state=open]:inline"><Minus aria-hidden className="size-3.5" /></span>
                      {item.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pl-7 pr-4 text-copy-13 text-muted-foreground">
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
