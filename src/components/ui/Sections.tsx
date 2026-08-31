import Link from 'next/link'
import type { ReactNode } from 'react'

export function Section({
  children,
  surface = false,
  flush = false,
  labelledBy,
}: {
  children: ReactNode
  surface?: boolean
  flush?: boolean
  labelledBy?: string
}) {
  const classNames = ['gc-section', surface ? 'gc-section--surface' : '', flush ? 'gc-section--flush' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <section className={classNames} aria-labelledby={labelledBy}>
      <div className="gc-container">{children}</div>
    </section>
  )
}

export function SectionHeader({
  eyebrow,
  heading,
  intro,
  id,
}: {
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  id?: string
}) {
  if (!heading && !intro && !eyebrow) return null
  return (
    <header style={{ marginBottom: '2.5rem' }}>
      {eyebrow && <p className="gc-eyebrow">{eyebrow}</p>}
      {heading && <h2 id={id}>{heading}</h2>}
      {intro && <p className="gc-lead" style={{ marginTop: '1rem' }}>{intro}</p>}
    </header>
  )
}

export type CTA = { label?: string | null; url?: string | null } | null | undefined

export function CTALinks({ ctas, locale }: { ctas: CTA[]; locale: string }) {
  const valid = ctas.filter((cta): cta is { label: string; url: string } => Boolean(cta?.label && cta?.url))
  if (valid.length === 0) return null

  return (
    <div className="gc-button-row">
      {valid.map((cta, index) => (
        <Link
          key={cta.url}
          href={cta.url.startsWith('/') && !cta.url.startsWith(`/${locale}`) ? `/${locale}${cta.url}` : cta.url}
          className={index === 0 ? 'gc-button' : 'gc-button gc-button--secondary'}
        >
          {cta.label}
        </Link>
      ))}
    </div>
  )
}
