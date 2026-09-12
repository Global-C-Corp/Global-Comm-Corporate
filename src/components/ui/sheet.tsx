'use client'

import * as React from 'react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * shadcn/ui Sheet, new-york style. Authored locally because the registry host
 * is blocked here; the API matches the registry component.
 *
 * Radix Dialog brings the focus trap, the Escape handler, focus return to the
 * trigger and the inert background — the behaviour a hand-rolled mobile menu
 * has to reimplement and usually gets wrong.
 */
function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close
const SheetTitle = SheetPrimitive.Title
const SheetDescription = SheetPrimitive.Description

function SheetContent({
  className,
  children,
  side = 'right',
  closeLabel = 'Close',
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
  closeLabel?: string
}) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/20" />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          'fixed z-50 flex flex-col gap-6 bg-background p-6 shadow-none',
          side === 'right' && 'inset-y-0 right-0 h-full w-[min(22rem,88vw)] border-l border-border',
          side === 'left' && 'inset-y-0 left-0 h-full w-[min(22rem,88vw)] border-r border-border',
          side === 'top' && 'inset-x-0 top-0 border-b border-border',
          side === 'bottom' && 'inset-x-0 bottom-0 border-t border-border',
          className,
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute right-5 top-5 rounded-sm p-1 text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <X aria-hidden className="size-5" />
          <span className="sr-only">{closeLabel}</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  )
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle, SheetDescription }
