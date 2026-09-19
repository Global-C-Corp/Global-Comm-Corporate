'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Container, Wordmark } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'
import { cn } from '@/lib/utils'

const { header } = homeV5

/**
 * Global header — approved homepage reference (04 §12.2).
 *
 * The bar is part of the hero canvas: over the dark opening section it is
 * transparent and inverted so the hero reaches the top edge of the screen,
 * rather than sitting in a white band above it. Once the page leaves the hero
 * it condenses onto a light surface with a brand-blue hairline.
 *
 * Composition is the reference's: wordmark left, primary nav centred with a
 * blue underline on the current page, FR / EN / ES right. There is deliberately
 * no CTA button in the bar — the reference does not carry one.
 */
export function GlobalHeader({
  overDark = false,
  current = 'Work',
}: {
  overDark?: boolean
  current?: string
}) {
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
  const tone = overDark && !condensed ? 'dark' : 'light'

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />

      <header
        data-bar={state}
        data-tone={tone}
        className={cn(
          'group/bar z-50 pt-[env(safe-area-inset-top)]',
          // Over a dark opening section the bar leaves the flow and overlays
          // it. In flow it would only reveal the page background behind
          // itself — a white band cutting the hero off.
          overDark ? 'fixed inset-x-0 top-0' : 'sticky top-0',
          // No `relative` here: tailwind-merge keeps the *last* position
          // utility, so it would silently cancel the line above and drop the
          // bar back into the flow.
          'border-b border-transparent bg-background/80 backdrop-blur-xl',
          'data-[tone=dark]:bg-transparent data-[tone=dark]:backdrop-blur-none',
          'supports-[backdrop-filter]:data-[tone=dark]:bg-transparent',
          'transition-[background-color,border-color,box-shadow] duration-300 ease-out',
          'data-[bar=condensed]:border-border data-[bar=condensed]:bg-background/92',
          'data-[bar=condensed]:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)]',
        )}
      >
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
            'grid h-[5.5rem] grid-cols-[auto_1fr_auto] items-center gap-6',
            'transition-[height] duration-300 ease-out',
            'group-data-[bar=condensed]/bar:h-16',
          )}
        >
          {/* The legal name is dropped when the bar condenses: at 64px it has
              no room to breathe, and the lowercase mark still reads. */}
          <Wordmark
            tone={tone}
            className="group-data-[bar=condensed]/bar:[&>span:last-child]:hidden"
          />

          <nav aria-label="Primary" className="hidden justify-center md:flex">
            <ul className="flex items-center gap-1">
              {header.nav.map((item) => {
                const isCurrent = item.label === current

                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      aria-current={isCurrent ? 'page' : undefined}
                      className={cn(
                        'group/nav relative inline-flex min-h-11 items-center px-4',
                        'text-copy-14 transition-colors duration-150',
                        isCurrent ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                        'group-data-[tone=dark]/bar:text-white/75 group-data-[tone=dark]/bar:hover:text-white',
                        isCurrent && 'group-data-[tone=dark]/bar:text-white',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                        'group-data-[tone=dark]/bar:focus-visible:outline-white',
                      )}
                    >
                      <span className="relative">
                        {item.label}
                        {/* Brand-blue underline marks the current page; on
                            hover the same rule draws in from the left. */}
                        <span
                          aria-hidden
                          className={cn(
                            'pointer-events-none absolute -bottom-1.5 left-0 h-[2px] w-full origin-left bg-primary',
                            'transition-transform duration-200 ease-out',
                            isCurrent
                              ? 'scale-x-100'
                              : 'scale-x-0 group-hover/nav:scale-x-100 group-focus-visible/nav:scale-x-100',
                          )}
                        />
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-1">
            <ul className="hidden items-center md:flex" aria-label="Languages">
              {header.locales.map((locale) => (
                <li key={locale.label}>
                  <Link
                    href={locale.href}
                    hrefLang={locale.label.toLowerCase()}
                    aria-current={locale.current ? 'true' : undefined}
                    className={cn(
                      'inline-flex min-h-11 items-center px-2',
                      'font-[family-name:var(--font-geist-mono)] text-label-12 uppercase tracking-[0.08em]',
                      'transition-colors duration-150',
                      locale.current
                        ? 'text-primary'
                        : cn(
                            'text-muted-foreground hover:text-foreground',
                            'group-data-[tone=dark]/bar:text-white/55 group-data-[tone=dark]/bar:hover:text-white',
                          ),
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                      'group-data-[tone=dark]/bar:focus-visible:outline-white',
                    )}
                  >
                    {locale.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Sheet open={open} onOpenChange={setOpen}>
              <button
                ref={triggerRef}
                type="button"
                className={cn(
                  'inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-[2px] px-2 md:hidden',
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
                <SheetTitle asChild>
                  <span>
                    <Wordmark href="/design/home" />
                  </span>
                </SheetTitle>

                <nav className="mt-10" aria-label="Primary">
                  <ul>
                    {header.nav.map((item, index) => (
                      <li key={item.label}>
                        <SheetClose asChild>
                          <Link
                            href={item.href}
                            aria-current={item.label === current ? 'page' : undefined}
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
                                'font-[family-name:var(--font-geist-mono)] text-label-12',
                                item.label === current ? 'text-primary' : 'text-muted-foreground',
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

                <ul className="mt-8 flex items-center gap-1" aria-label="Languages">
                  {header.locales.map((locale) => (
                    <li key={locale.label}>
                      <SheetClose asChild>
                        <Link
                          href={locale.href}
                          hrefLang={locale.label.toLowerCase()}
                          aria-current={locale.current ? 'true' : undefined}
                          className={cn(
                            'inline-flex min-h-11 min-w-11 items-center justify-center rounded-[2px] px-2',
                            'font-[family-name:var(--font-geist-mono)] text-label-12 uppercase tracking-[0.08em]',
                            locale.current ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                          )}
                        >
                          {locale.label}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>

                <SheetClose asChild>
                  <Button asChild size="lg" className="mt-8 w-full">
                    <Link href="/fr/contact">Start a project</Link>
                  </Button>
                </SheetClose>
              </SheetContent>
            </Sheet>
          </div>
        </Container>
      </header>
    </>
  )
}
