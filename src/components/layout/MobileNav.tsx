'use client'

import { useId, useState } from 'react'
import Link from 'next/link'

export type NavLink = {
  label: string
  url: string
  opensInNewTab?: boolean | null
}

/**
 * Client component only where interaction demands it (CLAUDE.md §116).
 * On wide viewports CSS shows the same list without any JavaScript.
 */
export function MobileNav({ links, labels }: { links: NavLink[]; labels: { menu: string; close: string } }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  if (links.length === 0) return null

  return (
    <>
      <button
        type="button"
        className="rounded-sm border border-border px-4 py-2 text-sm text-foreground md:hidden"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? labels.close : labels.menu}
      </button>
      {open && (
        <nav
          id={panelId}
          className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-border bg-background p-6 md:hidden"
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
      )}
    </>
  )
}
