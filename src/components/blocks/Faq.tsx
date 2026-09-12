'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Container, Grid, SectionLabel } from '@/components/blocks/Layout'
import { homeV4 } from '@/content/homeV4'

const { faq } = homeV4

/**
 * 07 — Questions fréquentes.
 *
 * Accordéon Radix : le contrat clavier vient de la primitive, pas d'un
 * comportement maison. Séparateurs en hairline, aucune carte arrondie autour
 * de chaque question.
 *
 * La première est ouverte au chargement : une pile de titres fermés ne montre
 * pas qu'il y a des réponses derrière.
 */
export function Faq() {
  return (
    <section className="border-b border-border bg-background" aria-labelledby="faq-heading">
      <Container className="py-32 md:py-36">
        <Grid>
          <div className="lg:col-span-4">
            <SectionLabel>{faq.label}</SectionLabel>
            <h2 id="faq-heading" className="mt-6 max-w-[20ch] text-heading-32 text-foreground">
              {faq.support}
            </h2>
          </div>

          <div className="mt-12 lg:col-span-7 lg:col-start-6 lg:mt-0">
            <Accordion type="single" collapsible defaultValue="faq-0" className="border-t border-border">
              {faq.items.map((item, index) => (
                <AccordionItem key={item.question} value={`faq-${index}`}>
                  <AccordionTrigger className="py-6 text-copy-18 font-medium text-foreground hover:text-primary">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="max-w-[62ch] pb-6 pr-8 text-copy-16 text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Grid>
      </Container>
    </section>
  )
}
