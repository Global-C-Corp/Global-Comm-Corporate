'use client'

import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { homeHalbert } from '@/content/homeHalbert'
import { cn } from '@/lib/utils'

type Expertise = (typeof homeHalbert.expertise.items)[number]

/**
 * Les quatre expertises.
 *
 * Le bénéfice, la description et le livrable restent toujours visibles : ce
 * sont eux qui rendent l'offre comparable. Seule la liste des prestations
 * passe derrière un accordéon, sinon la section imposerait vingt puces au
 * lecteur avant qu'il ait choisi ce qui le concerne.
 *
 * Les entrées alternent leur alignement sur grand écran pour éviter quatre
 * cartes identiques empilées.
 */
export function ExpertiseList({
  items,
  scopeLabel,
  outcomeLabel,
}: {
  items: readonly Expertise[]
  scopeLabel: string
  outcomeLabel: string
}) {
  return (
    <ul className="mt-16 flex flex-col">
      {items.map((item, index) => (
        <li key={item.number} className="border-t border-border py-10 first:border-t-0 first:pt-0 md:py-14">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Une entrée sur deux inverse ses colonnes : quatre blocs
                strictement identiques se liraient comme une grille de cartes. */}
            <div className={cn('lg:col-span-5', index % 2 === 1 && 'lg:order-2 lg:col-start-8')}>
              <div className="flex items-baseline gap-4">
                <span aria-hidden className="text-sm font-medium tabular-nums text-primary">
                  {item.number}
                </span>
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-foreground md:text-2xl">
                  {item.name}
                </h3>
              </div>
              <p className="mt-5 max-w-[26ch] font-serif text-2xl leading-[1.2] tracking-[-0.01em] text-foreground md:text-[1.75rem]">
                {item.promise}
              </p>
            </div>

            <div className={cn('lg:col-span-7', index % 2 === 1 && 'lg:order-1 lg:col-start-1 lg:row-start-1')}>
              <p className="max-w-[58ch] text-base leading-relaxed text-muted-foreground">{item.body}</p>

              <Accordion type="single" collapsible className="mt-8 border-t border-border">
                <AccordionItem value={item.number} className="border-b-0">
                  <AccordionTrigger className="py-5 text-sm font-medium uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground">
                    {scopeLabel}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pr-0">
                    <ul className="grid gap-x-10 gap-y-2 sm:grid-cols-2">
                      {item.scope.map((entry) => (
                        <li key={entry} className="flex gap-3 text-sm text-foreground">
                          <span aria-hidden className="text-primary">
                            —
                          </span>
                          <span>{entry}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="border-t border-foreground pt-5">
                <p className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  {outcomeLabel}
                </p>
                <p className="mt-3 max-w-[52ch] text-base font-medium leading-relaxed text-foreground">
                  {item.outcome}
                </p>
              </div>

              <p className="mt-6">
                <Link
                  href={item.cta.href}
                  className="text-sm font-medium text-primary underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {item.cta.label}
                </Link>
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
