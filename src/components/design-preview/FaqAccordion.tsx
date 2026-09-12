'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { homeHalbert, PRICING_PUBLICLY_VALIDATED } from '@/content/homeHalbert'

type FaqItem = (typeof homeHalbert.faq.items)[number]

/**
 * FAQ.
 *
 * La première réponse est ouverte au chargement : la section répond à des
 * objections d'achat, et une pile de titres fermés ne montre pas qu'il y a
 * des réponses derrière.
 *
 * Une réponse porte un montant dont le document source demande explicitement
 * de valider l'affichage public. Tant que ce n'est pas fait, cette phrase est
 * remplacée par un emplacement visible plutôt que publiée telle quelle.
 */
export function FaqAccordion({ items }: { items: readonly FaqItem[] }) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="faq-0"
      className="mt-14 border-t border-border"
    >
      {items.map((item, index) => {
        const pricedIndex = 'pricedAnswerIndex' in item ? item.pricedAnswerIndex : null
        const pendingNote = 'pendingWithoutPrice' in item ? item.pendingWithoutPrice : null

        return (
          <AccordionItem key={item.question} value={`faq-${index}`}>
            <AccordionTrigger className="text-base md:text-lg">{item.question}</AccordionTrigger>
            <AccordionContent className="max-w-[68ch]">
              {item.lead && <p className="mb-3 text-base font-semibold text-foreground">{item.lead}</p>}
              {item.answer.map((paragraph, paragraphIndex) => {
                const isPriced = pricedIndex === paragraphIndex && !PRICING_PUBLICLY_VALIDATED
                if (isPriced) {
                  return (
                    <p
                      key={paragraph}
                      className="mb-3 border border-dashed border-foreground/25 bg-muted px-4 py-3 text-sm text-foreground"
                    >
                      <span className="mr-2 text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                        À fournir
                      </span>
                      {pendingNote}
                    </p>
                  )
                }
                return (
                  <p key={paragraph} className="mb-3 last:mb-0">
                    {paragraph}
                  </p>
                )
              })}
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
