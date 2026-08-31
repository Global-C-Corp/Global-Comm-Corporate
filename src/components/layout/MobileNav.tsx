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
        className="gc-menu-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? labels.close : labels.menu}
      </button>
      {open && (
        <nav id={panelId} className="gc-nav gc-nav--open" aria-label={labels.menu}>
          {links.map((link) => (
            <Link
              key={`${link.url}-${link.label}`}
              href={link.url}
              className="gc-nav__link"
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
