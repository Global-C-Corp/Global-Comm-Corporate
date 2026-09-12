'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { Globe2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Container } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { header } = homeV5

export function GlobalHeader() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-[#FAFAF8]/95 backdrop-blur supports-[backdrop-filter]:bg-[#FAFAF8]/90">
      <Container className="flex h-14 items-center justify-between gap-5 lg:h-16">
        <Link
          href="/design/home"
          className="text-label-12 font-semibold tracking-[-0.01em] text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          {header.wordmark}
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <nav aria-label="Primary">
            <ul className="flex items-center gap-7">
              {header.nav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-label-13 text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <span className="h-4 w-px bg-border" aria-hidden />
          <div className="flex items-center gap-2 text-label-12 text-foreground">
            <Globe2 aria-hidden className="size-3.5" />
            <span>EN</span>
          </div>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <button
            ref={triggerRef}
            type="button"
            className="text-label-13 text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring md:hidden"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            MENU
          </button>
          <SheetContent
            side="right"
            closeLabel="Close menu"
            onCloseAutoFocus={(event) => {
              event.preventDefault()
              triggerRef.current?.focus()
            }}
          >
            <SheetTitle className="text-label-12 font-semibold tracking-[-0.01em]">
              {header.wordmark}
            </SheetTitle>
            <nav className="mt-10" aria-label="Primary">
              <ul>
                {header.nav.map((item) => (
                  <li key={item.label}>
                    <SheetClose asChild>
                      <Link
                        href={item.href}
                        className="block border-b border-border py-5 text-heading-24 text-foreground transition-colors hover:text-primary"
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
              </ul>
            </nav>
            <SheetClose asChild>
              <Button asChild className="mt-10 w-full">
                <Link href="/fr/contact">Start a project</Link>
              </Button>
            </SheetClose>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  )
}
