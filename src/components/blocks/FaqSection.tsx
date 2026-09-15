import { Minus, Plus } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Container, SectionLabel } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { faq } = homeV5

export function FaqSection() {
  return (
    <section className="border-b border-border bg-background" aria-labelledby="faq-heading">
      <Container className="py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel>{faq.label}</SectionLabel>
            <h2 id="faq-heading" className="mt-4 max-w-[12ch] text-heading-40 text-foreground [text-wrap:balance]">
              Questions before we start.
            </h2>
            <p className="mt-4 max-w-[34ch] text-copy-16 text-muted-foreground">{faq.support}</p>
          </div>

          <Accordion type="single" collapsible defaultValue="faq-0" className="overflow-hidden border border-border bg-background lg:col-span-8">
            {faq.items.map((item, index) => (
              <AccordionItem key={item.question} value={`faq-${index}`} className="px-5">
                <AccordionTrigger className="group min-h-14 py-4 text-left text-copy-14 font-semibold hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring">
                  <span className="flex items-start gap-3 pr-4">
                    <span className="mt-0.5 text-primary group-data-[state=open]:hidden"><Plus aria-hidden className="size-4" /></span>
                    <span className="mt-0.5 hidden text-primary group-data-[state=open]:inline"><Minus aria-hidden className="size-4" /></span>
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
      </Container>
    </section>
  )
}
