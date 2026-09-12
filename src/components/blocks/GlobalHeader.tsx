'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Container } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { header } = homeV5

/**
 * En-tête : 72px desktop, 64px mobile, même fond que le Hero dont il fait
 * visuellement partie. Une hairline en bas, rien d'autre — pas de pilule
 * flottante, pas de flou, pas d'ombre.
 *
 * Le panneau mobile est piloté par l'état plutôt que par SheetTrigger : Radix
 * pose sinon un aria-controls permanent sur le déclencheur alors qu'il ne
 * monte le panneau qu'à l'ouverture, laissant une référence vers un
 * identifiant inexistant tant que le menu est fermé. Le retour du focus est
 * rétabli explicitement.
 */
export function GlobalHeader() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  return (
    <header className="border-b border-border bg-[#FAFAF8]">
      <Container className="flex h-16 items-center justify-between gap-6 lg:h-[72px]">
        <Link
          href="/design/home"
          className="text-label-12 font-medium tracking-[0.04em] text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          {header.wordmark}
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {header.nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-label-14 text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <button
            ref={triggerRef}
            type="button"
            className="text-label-14 text-foreground transition-colors duration-150 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring md:hidden"
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
            <SheetTitle className="text-label-12 font-medium tracking-[0.04em] text-foreground">
              {header.wordmark}
            </SheetTitle>
            <nav aria-label="Primary">
              <ul className="flex flex-col">
                {header.nav.map((item) => (
                  <li key={item.label}>
                    <SheetClose asChild>
                      <Link
                        href={item.href}
                        className="block border-b border-border py-4 text-copy-18 text-foreground transition-colors duration-150 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
              </ul>
            </nav>
            <SheetClose asChild>
              <Button asChild className="w-full">
                <Link href="/fr/contact">Start a project</Link>
              </Button>
            </SheetClose>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  )
}
