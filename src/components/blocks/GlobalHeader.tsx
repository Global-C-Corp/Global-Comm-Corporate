'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Container } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'
import { cn } from '@/lib/utils'

const { header } = homeV5

/**
 * Global header (CLAUDE.md §82 — presentation is open, structure is not).
 *
 * The visual idea is an instrument bar rather than a nav strip. Over a dark
 * opening section (`overDark`) it starts fully transparent and inverted, so the
 * hero runs to the top edge of the screen instead of being cut off by a white
 * band; once the page moves it collapses onto a hairline of brand blue and
 * takes on surface and weight.
 * The wordmark itself never moves or resizes — a brandmark that reflows while
 * you scroll reads as an accident rather than a decision.
 *
 * Structure is unchanged: wordmark, primary nav, language, mobile menu. The
 * desktop CTA is new as *presentation*, not as new information — `Start a
 * project` already existed in the mobile sheet pointing at the same route, but
 * a desktop visitor had no way to act on it from the header.
 */
export function GlobalHeader({ overDark = false }: { overDark?: boolean }) {
  const [open, setOpen] = useState(false)
  const [condensed, setCondensed] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  /**
   * An IntersectionObserver on a sentinel above the header, rather than a
   * scroll listener: the crossing is reported off the main thread, so the bar
   * cannot stutter against scroll events on a long page.
   */
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => setCondensed(!entry?.isIntersecting),
      { threshold: 0 },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  const state = condensed ? 'condensed' : 'rest'

  /**
   * One axis drives every colour in the bar. Over a dark opening section the
   * header dissolves into it and inverts; the moment it condenses it becomes
   * the light bar again, whatever is behind it.
   */
  const tone = overDark && !condensed ? 'dark' : 'light'

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />

      <header
        data-bar={state}
        data-tone={tone}
        className={cn(
          'group/bar z-50 pt-[env(safe-area-inset-top)]',
          /*
           * Over a dark opening section the bar leaves the flow entirely and
           * overlays it, so the hero runs to the top edge of the screen. In
           * flow it would only reveal the page background behind itself — a
           * white band cutting the hero off, which is the thing being fixed.
           * Everywhere else it stays sticky and occupies its own height.
           */
          overDark ? 'fixed inset-x-0 top-0' : 'sticky top-0',
          // No `relative` here: tailwind-merge keeps the *last* position
          // utility, so it would silently cancel the line above and drop the
          // bar back into the flow. `sticky` and `fixed` both establish the
          // containing block the hairline below needs.
          'border-b border-transparent bg-[#FAFAF8]/72 backdrop-blur-xl',
          'data-[tone=dark]:bg-transparent data-[tone=dark]:backdrop-blur-none',
          'supports-[backdrop-filter]:data-[tone=dark]:bg-transparent',
          'transition-[background-color,border-color,box-shadow] duration-300 ease-out',
          'supports-[backdrop-filter]:bg-[#FAFAF8]/62',
          'data-[bar=condensed]:border-black/10 data-[bar=condensed]:bg-[#FAFAF8]/92',
          'data-[bar=condensed]:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_30px_rgba(0,0,0,0.05)]',
          'supports-[backdrop-filter]:data-[bar=condensed]:bg-[#FAFAF8]/86',
        )}
      >
        {/*
         * The blue hairline is the scroll signal, drawn from the centre out so
         * the bar reads as locking into place. It is the only brand colour the
         * header carries at rest.
         */}
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-x-0 bottom-[-1px] h-px origin-center bg-primary',
            'scale-x-0 transition-transform duration-500 ease-out',
            'group-data-[bar=condensed]/bar:scale-x-100',
          )}
        />

        <Container
          className={cn(
            'flex items-center justify-between gap-6',
            'h-20 transition-[height] duration-300 ease-out',
            'group-data-[bar=condensed]/bar:h-14',
          )}
        >
          <Link
            href="/design/home"
            translate="no"
            className={cn(
              'inline-flex min-h-11 items-center font-semibold uppercase whitespace-nowrap',
              // The wordmark is long enough to wrap to two lines beside the
              // menu button at 390px. It tightens rather than wraps: a
              // brandmark broken across two lines stops reading as one mark.
              'text-[0.6875rem] tracking-[0.02em] sm:text-label-12 sm:tracking-[0.055em]',
              'text-foreground',
              'transition-colors duration-150 hover:text-primary',
              'group-data-[tone=dark]/bar:text-white group-data-[tone=dark]/bar:hover:text-white/80',
              'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
              'group-data-[tone=dark]/bar:focus-visible:outline-white',
            )}
          >
            {header.wordmark}
          </Link>

          <div className="hidden items-center md:flex">
            <nav aria-label="Primary">
              <ul className="flex items-center">
                {header.nav.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={cn(
                        'group/nav inline-flex min-h-11 items-center px-3.5',
                        'text-label-13 text-muted-foreground',
                        'transition-colors duration-150 hover:text-foreground',
                        'group-data-[tone=dark]/bar:text-white/80 group-data-[tone=dark]/bar:hover:text-white',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                        'group-data-[tone=dark]/bar:focus-visible:outline-white',
                      )}
                    >
                      {/*
                       * A rule that draws from the left of the word, replacing
                       * the grey pill this had before: a pill makes every item
                       * look like a button, a rule points at one word. Anchored
                       * to the text box, not to the link box, so it stays put
                       * when the bar changes height.
                       */}
                      <span className="relative">
                        {item.label}
                        <span
                          aria-hidden
                          className={cn(
                            'pointer-events-none absolute -bottom-1.5 left-0 h-px w-full bg-primary',
                            'group-data-[tone=dark]/bar:bg-white',
                            'origin-left scale-x-0 transition-transform duration-200 ease-out',
                            'group-hover/nav:scale-x-100 group-focus-visible/nav:scale-x-100',
                          )}
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <span
              className="mx-3 h-4 w-px bg-border transition-colors duration-300 group-data-[tone=dark]/bar:bg-white/25"
              aria-hidden
            />

            <Link
              href="/en"
              aria-label="Switch language to English"
              className={cn(
                'inline-flex min-h-11 items-center rounded-[3px] px-2.5',
                'font-[family-name:var(--font-geist-mono)] text-label-12 uppercase tracking-[0.08em]',
                'transition-colors duration-150',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                'group-data-[tone=dark]/bar:focus-visible:outline-white',
              )}
            >
              <span aria-hidden className="text-foreground group-data-[tone=dark]/bar:text-white">
                FR
              </span>
              <span aria-hidden className="px-1 text-border group-data-[tone=dark]/bar:text-white/30">
                /
              </span>
              <span
                aria-hidden
                className={cn(
                  'text-muted-foreground transition-colors duration-150 hover:text-foreground',
                  'group-data-[tone=dark]/bar:text-white/65 group-data-[tone=dark]/bar:hover:text-white',
                )}
              >
                EN
              </span>
            </Link>

            <Button
              asChild
              size="sm"
              className="group/cta ml-3 group-data-[tone=dark]/bar:focus-visible:outline-white"
            >
              <Link href="/fr/contact">
                Start a project
                <ArrowRight
                  aria-hidden
                  className="transition-transform duration-200 group-hover/cta:translate-x-0.5"
                />
              </Link>
            </Button>
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <button
              ref={triggerRef}
              type="button"
              className={cn(
                'inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-[3px] px-3 md:hidden',
                'font-[family-name:var(--font-geist-mono)] text-label-12 uppercase tracking-[0.1em]',
                'text-foreground transition-colors duration-150 hover:bg-foreground/[0.045]',
                'group-data-[tone=dark]/bar:text-white group-data-[tone=dark]/bar:hover:bg-white/10',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                'group-data-[tone=dark]/bar:focus-visible:outline-white',
              )}
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-label="Open navigation menu"
              onClick={() => setOpen(true)}
            >
              <span aria-hidden className="flex flex-col gap-[3px]">
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-4 bg-current" />
              </span>
              Menu
            </button>

            <SheetContent
              side="right"
              closeLabel="Close menu"
              onCloseAutoFocus={(event) => {
                event.preventDefault()
                triggerRef.current?.focus()
              }}
            >
              <SheetTitle className="text-label-12 font-semibold uppercase tracking-[0.055em]">
                {header.wordmark}
              </SheetTitle>

              {/*
               * The sheet gets the numbered index the bar cannot afford: a
               * standing menu is a list of destinations, so it reads as one.
               */}
              <nav className="mt-10" aria-label="Primary">
                <ul>
                  {header.nav.map((item, index) => (
                    <li key={item.label}>
                      <SheetClose asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            'group/item flex min-h-14 items-baseline gap-4 border-b border-border py-4',
                            'text-heading-24 text-foreground',
                            'transition-colors duration-150 hover:text-primary',
                            'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring',
                          )}
                        >
                          <span
                            aria-hidden
                            className={cn(
                              'font-[family-name:var(--font-geist-mono)] text-label-12 text-muted-foreground',
                              'transition-colors duration-150 group-hover/item:text-primary',
                            )}
                          >
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          {item.label}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>

              <SheetClose asChild>
                <Button asChild size="lg" className="group/cta mt-10 w-full">
                  <Link href="/fr/contact">
                    Start a project
                    <ArrowRight
                      aria-hidden
                      className="transition-transform duration-200 group-hover/cta:translate-x-0.5"
                    />
                  </Link>
                </Button>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </Container>
      </header>
    </>
  )
}
