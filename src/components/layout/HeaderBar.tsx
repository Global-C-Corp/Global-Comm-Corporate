'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Sheet, SheetClose, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Container, Wordmark } from '@/components/ui/Layout'
import type { NavLink } from '@/lib/nav'
import { cn } from '@/lib/utils'

/** One locale entry in the switcher. A null href means the translation is not public. */
export type LocaleChoice = {
  code: string
  label: string
  href: string | null
  isCurrent: boolean
}

/**
 * The site header bar — the approved homepage composition, for every route.
 *
 * Over a dark opening section the bar is transparent and inverted so the hero
 * reaches the top edge of the screen; everywhere else it sits on the light
 * surface and condenses to 64px with a brand-blue hairline once the page
 * scrolls past it (04 §12.2, 03 §20).
 *
 * Nothing here is authored: the navigation comes from the Payload Navigation
 * global and the locale entries from the route's real availability, so a
 * locale whose translation is not public is rendered inert rather than linked
 * to a 404 (CLAUDE.md §61).
 */
export function HeaderBar({
  overDark = false,
  homeHref,
  links,
  currentUrl,
  locales,
  labels,
}: {
  overDark?: boolean
  homeHref: string
  links: NavLink[]
  currentUrl: string
  locales: LocaleChoice[]
  labels: { menu: string; close: string; primary: string; languages: string }
}) {
  const [open, setOpen] = useState(false)
  const [condensed, setCondensed] = useState(false)
  const mobileSheetId = 'global-navigation-sheet'
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

  /**
   * A link is current when the route path matches it, or sits beneath it —
   * `/fr/work/oglo-nuts` marks `Work`. The home link would match everything,
   * so it is compared exactly.
   */
  const isCurrent = (url: string) =>
    url === homeHref ? currentUrl === url : currentUrl === url || currentUrl.startsWith(`${url}/`)

  const localeClass = (locale: LocaleChoice, inSheet: boolean) =>
    cn(
      'inline-flex min-h-11 items-center px-2',
      inSheet && 'min-w-11 justify-center rounded-[2px]',
      'font-mono text-label-12 uppercase tracking-[0.08em]',
      'transition-colors duration-150',
      locale.isCurrent
        ? cn(
            // Brand blue on the near-black hero would sit near 2:1, so the
            // current locale inverts to white while the bar is dark.
            'text-primary',
            !inSheet && 'group-data-[tone=dark]/bar:text-white',
          )
        : locale.href
          ? cn(
              'text-muted-foreground hover:text-foreground',
              !inSheet &&
                'group-data-[tone=dark]/bar:text-white/55 group-data-[tone=dark]/bar:hover:text-white',
            )
          : cn('text-border', !inSheet && 'group-data-[tone=dark]/bar:text-white/35'),
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      !inSheet && 'group-data-[tone=dark]/bar:focus-visible:outline-white',
    )

  const localeItem = (locale: LocaleChoice, inSheet: boolean) => {
    if (locale.isCurrent) {
      return (
        <span className={localeClass(locale, inSheet)} aria-current="true">
          {locale.label}
        </span>
      )
    }

    if (!locale.href) {
      return (
        <span className={localeClass(locale, inSheet)} aria-disabled="true">
          {locale.label}
        </span>
      )
    }

    return (
      <Link className={localeClass(locale, inSheet)} href={locale.href} hrefLang={locale.code}>
        {locale.label}
      </Link>
    )
  }

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
            href={homeHref}
            tone={tone}
            className="group-data-[bar=condensed]/bar:[&>span:last-child]:hidden"
          />

          <nav aria-label={labels.primary} className="hidden justify-center md:flex">
            <ul className="flex items-center gap-1">
              {links.map((link) => {
                const current = isCurrent(link.url)

                return (
                  <li key={`${link.url}-${link.label}`}>
                    <Link
                      href={link.url}
                      aria-current={current ? 'page' : undefined}
                      target={link.opensInNewTab ? '_blank' : undefined}
                      rel={link.opensInNewTab ? 'noopener noreferrer' : undefined}
                      className={cn(
                        'group/nav relative inline-flex min-h-11 items-center px-4',
                        'text-copy-14 transition-colors duration-150',
                        current ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                        'group-data-[tone=dark]/bar:text-white/75 group-data-[tone=dark]/bar:hover:text-white',
                        current && 'group-data-[tone=dark]/bar:text-white',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                        'group-data-[tone=dark]/bar:focus-visible:outline-white',
                      )}
                    >
                      <span className="relative">
                        {link.label}
                        {/* Brand-blue underline marks the current page; on
                            hover the same rule draws in from the left. */}
                        <span
                          aria-hidden
                          className={cn(
                            'pointer-events-none absolute -bottom-1.5 left-0 h-[2px] w-full origin-left bg-primary',
                            'transition-transform duration-200 ease-out',
                            current
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
            <ul className="hidden items-center md:flex" aria-label={labels.languages}>
              {locales.map((locale) => (
                <li key={locale.code}>{localeItem(locale, false)}</li>
              ))}
            </ul>

            <Sheet open={open} onOpenChange={setOpen}>
              <button
                ref={triggerRef}
                type="button"
                className={cn(
                  'inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-[2px] px-2 md:hidden',
                  'font-mono text-label-12 uppercase tracking-[0.1em]',
                  'text-foreground transition-colors duration-150 hover:bg-foreground/[0.045]',
                  'group-data-[tone=dark]/bar:text-white group-data-[tone=dark]/bar:hover:bg-white/10',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                  'group-data-[tone=dark]/bar:focus-visible:outline-white',
                )}
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls={mobileSheetId}
                onClick={() => setOpen(true)}
              >
                <span aria-hidden className="flex flex-col gap-[3px]">
                  <span className="block h-px w-4 bg-current" />
                  <span className="block h-px w-4 bg-current" />
                </span>
                {labels.menu}
              </button>

              <SheetContent
                id={mobileSheetId}
                side="right"
                closeLabel={labels.close}
                onCloseAutoFocus={(event) => {
                  event.preventDefault()
                  triggerRef.current?.focus()
                }}
              >
                <SheetTitle asChild>
                  <span>
                    <Wordmark href={homeHref} />
                  </span>
                </SheetTitle>

                <nav className="mt-10" aria-label={labels.primary}>
                  <ul>
                    {links.map((link, index) => (
                      <li key={`${link.url}-${link.label}`}>
                        <SheetClose asChild>
                          <Link
                            href={link.url}
                            aria-current={isCurrent(link.url) ? 'page' : undefined}
                            target={link.opensInNewTab ? '_blank' : undefined}
                            rel={link.opensInNewTab ? 'noopener noreferrer' : undefined}
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
                                'font-mono text-label-12',
                                isCurrent(link.url) ? 'text-primary' : 'text-muted-foreground',
                                'transition-colors duration-150 group-hover/item:text-primary',
                              )}
                            >
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            {link.label}
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                </nav>

                <ul className="mt-8 flex items-center gap-1" aria-label={labels.languages}>
                  {locales.map((locale) => (
                    <li key={locale.code}>
                      {locale.href && !locale.isCurrent ? (
                        <SheetClose asChild>{localeItem(locale, true)}</SheetClose>
                      ) : (
                        localeItem(locale, true)
                      )}
                    </li>
                  ))}
                </ul>
              </SheetContent>
            </Sheet>
          </div>
        </Container>
      </header>
    </>
  )
}
