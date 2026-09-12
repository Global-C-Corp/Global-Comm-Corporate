'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import type { NavItem } from '@/content/homeHalbert'

/**
 * En-tête de la maquette : navigation lisible, un seul CTA principal, menu
 * mobile accessible.
 *
 * Le menu mobile est un Sheet Radix, donc piège de focus, fermeture par
 * Échap et retour du focus au déclencheur sans code maison. Le panneau se
 * ferme aussi au clic sur un lien, sinon il resterait ouvert derrière la
 * navigation.
 */
export function PreviewHeader({
  nav,
  locales,
  cta,
}: {
  nav: readonly NavItem[]
  locales: readonly string[]
  cta: { label: string; href: string }
}) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-[2px]">
      <div className="mx-auto flex h-16 w-full max-w-[80rem] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
        <Link
          href="/design/home"
          className="text-sm font-bold tracking-[-0.01em] text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          GLOBAL COMM<span className="text-primary">.</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigation principale">
          {nav.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className="text-sm text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-5">
          <ul className="hidden items-center gap-2 text-xs font-medium sm:flex" aria-label="Langues">
            {locales.map((code, index) => (
              <li key={code} className="flex items-center gap-2">
                {index > 0 && <span aria-hidden className="text-muted-foreground">/</span>}
                <span className={index === 0 ? 'text-primary' : 'text-muted-foreground'}>{code}</span>
              </li>
            ))}
          </ul>

          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href={cta.href}>{cta.label}</Link>
          </Button>

          {/* Le panneau est piloté par l'état plutôt que par SheetTrigger :
              Radix pose sinon un aria-controls permanent sur le déclencheur
              alors qu'il ne monte le panneau qu'à l'ouverture, laissant une
              référence vers un identifiant inexistant tant que le menu est
              fermé. aria-haspopup + aria-expanded décrivent correctement un
              déclencheur de dialogue, sans pointeur à tenir à jour. */}
          <Sheet open={open} onOpenChange={setOpen}>
            <Button
              ref={triggerRef}
              type="button"
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label="Ouvrir le menu"
              aria-haspopup="dialog"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu aria-hidden />
            </Button>
            <SheetContent
              side="right"
              closeLabel="Fermer le menu"
              // Radix rend normalement le focus à SheetTrigger ; sans lui, il
              // faut désigner explicitement le bouton, sinon la fermeture
              // renvoie le focus en tête de document.
              onCloseAutoFocus={(event) => {
                event.preventDefault()
                triggerRef.current?.focus()
              }}
            >
              <SheetTitle className="text-sm font-bold tracking-[-0.01em] text-foreground">
                GLOBAL COMM<span className="text-primary">.</span>
              </SheetTitle>
              <Separator />
              <nav aria-label="Navigation principale">
                <ul className="flex flex-col">
                  {nav.map((item) => (
                    <li key={item.href + item.label}>
                      <SheetClose asChild>
                        <Link
                          href={item.href}
                          className="block border-b border-border py-4 text-base text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
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
                  <Link href={cta.href}>{cta.label}</Link>
                </Button>
              </SheetClose>
              <ul className="flex items-center gap-3 text-xs font-medium" aria-label="Langues">
                {locales.map((code, index) => (
                  <li key={code} className="flex items-center gap-3">
                    {index > 0 && <span aria-hidden className="text-muted-foreground">/</span>}
                    <span className={index === 0 ? 'text-primary' : 'text-muted-foreground'}>{code}</span>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
