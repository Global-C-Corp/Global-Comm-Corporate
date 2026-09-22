'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown, Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * shadcn/ui Accordion, new-york style. Authored locally because the registry
 * host is blocked here; the API matches the registry component.
 *
 * Radix supplies the keyboard contract this needs — Enter/Space to toggle,
 * arrow keys between triggers, Home/End to the ends — and the open state is
 * exposed through aria-expanded on a real button, so the trigger stays
 * announced correctly when the panel animates.
 */
function Accordion({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('border-b border-border', className)}
      {...props}
    />
  )
}

/**
 * `indicator` selects how open/closed is signed:
 * - `chevron` (default) for disclosure inside a page
 * - `plus` for an FAQ list, where the approved composition shows +/−
 *
 * It is a variant rather than a call-site override so the mapping between the
 * behavioural state and its visual sign stays centralized (03 §2A.2, §2B).
 */
function AccordionTrigger({
  className,
  children,
  indicator = 'chevron',
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  indicator?: 'chevron' | 'plus'
}) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'group/trigger',
          'flex flex-1 items-start justify-between gap-6 py-6 text-left text-base font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          indicator === 'chevron' && '[&[data-state=open]>svg]:rotate-180',
          className,
        )}
        {...props}
      >
        {children}
        {indicator === 'chevron' ? (
          <ChevronDown
            aria-hidden
            className="mt-0.5 size-5 shrink-0 text-primary transition-transform duration-200"
          />
        ) : (
          <span aria-hidden className="mt-0.5 shrink-0 text-muted-foreground">
            <Plus className="size-4 group-data-[state=open]/trigger:hidden" />
            <Minus className="hidden size-4 text-primary group-data-[state=open]/trigger:block" />
          </span>
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden data-[state=closed]:animate-none data-[state=open]:animate-none"
      {...props}
    >
      <div className={cn('pb-6 pr-10 text-sm leading-relaxed text-muted-foreground', className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
