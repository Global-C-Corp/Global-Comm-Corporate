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
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#FAFAF8]/92 pt-[env(safe-area-inset-top)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.035)] backdrop-blur-xl supports-[backdrop-filter]:bg-[#FAFAF8]/86">
      <Container className="flex h-16 items-center justify-between gap-5">
        <Link
          href="/design/home"
          translate="no"
          className="inline-flex min-h-11 items-center text-label-12 font-semibold tracking-[-0.01em] text-foreground transition-colors duration-150 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          {header.wordmark}
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          <nav aria-label="Primary">
            <ul className="flex items-center gap-1">
              {header.nav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center rounded-[4px] px-3 text-label-13 text-muted-foreground transition-colors duration-150 hover:bg-foreground/[0.045] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <span className="h-5 w-px bg-border" aria-hidden />

          <Link
            href="/en"
            aria-label="Switch language to English"
            className="inline-flex min-h-11 items-center gap-2 rounded-[4px] px-3 text-label-12 text-foreground transition-colors duration-150 hover:bg-foreground/[0.045] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Globe2 aria-hidden className="size-3.5" />
            <span>EN</span>
          </Link>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <button
            ref={triggerRef}
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[4px] px-3 text-label-13 text-foreground transition-colors duration-150 hover:bg-foreground/[0.045] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:hidden"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label="Open navigation menu"
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
                        className="flex min-h-14 items-center border-b border-border py-4 text-heading-24 text-foreground transition-colors duration-150 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
              </ul>
            </nav>

            <SheetClose asChild>
              <Button asChild size="lg" className="mt-10 w-full">
                <Link href="/fr/contact">Start a project</Link>
              </Button>
            </SheetClose>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  )
}
