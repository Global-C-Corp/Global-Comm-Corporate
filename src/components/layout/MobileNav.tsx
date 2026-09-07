'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export type NavLink = {
  label: string
  url: string
  opensInNewTab?: boolean | null
}

/**
 * Client component only where interaction demands it (CLAUDE.md §116).
 * On wide viewports CSS shows the same list without any JavaScript.
 *
 * The panel is always in the DOM and hidden with `display: none` rather than
 * conditionally rendered. `aria-controls` has to point at an element that
 * exists — a reference to a node React has not mounted yet resolves to
 * nothing, which is invisible on screen and silently strips the relationship
 * for assistive technology.
 */
export function MobileNav({ links, labels }: { links: NavLink[]; labels: { menu: string; close: string } }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    // Focus would otherwise be left on a link that just became display:none.
    toggleRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  if (links.length === 0) return null

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="rounded-sm border border-border px-4 py-2 text-sm text-foreground md:hidden"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? labels.close : labels.menu}
      </button>
      <nav
        id={panelId}
        className={cn(
          'absolute inset-x-0 top-full flex-col gap-1 border-b border-border bg-background p-6 md:hidden',
          open ? 'flex' : 'hidden',
        )}
        aria-label={labels.menu}
      >
        {links.map((link) => (
          <Link
            key={`${link.url}-${link.label}`}
            href={link.url}
            className="py-2 text-sm text-foreground hover:text-primary"
            target={link.opensInNewTab ? '_blank' : undefined}
            rel={link.opensInNewTab ? 'noopener noreferrer' : undefined}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  )
}
