import Link from 'next/link'
import type { Locale } from '@/i18n/locale'
import { cn } from '@/lib/utils'

/**
 * Shared public-site primitives.
 *
 * They express the locked Global Comm grammar: sharp geometry, generous space,
 * controlled blue, nearly invisible chrome and predictable interaction states.
 */

export function Band({
  children,
  surface = false,
  labelledBy,
  className,
}: {
  children: React.ReactNode
  surface?: boolean
  labelledBy?: string
  className?: string
}) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={cn(surface ? 'bg-secondary' : 'bg-background', className)}
    >
      <div className="mx-auto w-full max-w-[80rem] px-5 py-24 sm:px-6 md:px-8 md:py-32 lg:px-12">{children}</div>
    </section>
  )
}

export function Kicker({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <p id={id} className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </p>
  )
}

export function Heading({
  children,
  as: Tag = 'h2',
  className,
  id,
}: {
  children: React.ReactNode
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  id?: string
}) {
  return (
    <Tag
      id={id}
      className={cn(
        'max-w-[22ch] text-balance font-sans font-semibold text-foreground',
        Tag === 'h1'
          ? 'text-5xl leading-[1] tracking-[-0.045em] md:text-7xl'
          : Tag === 'h2'
            ? 'text-3xl leading-[1.06] tracking-[-0.035em] md:text-5xl'
            : 'text-2xl leading-[1.12] tracking-[-0.025em] md:text-3xl',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

/** CMS plain text stored as blank-line separated paragraphs. */
export function Prose({ text, className }: { text?: string | null; className?: string }) {
  if (!text) return null
  const paragraphs = text.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean)
  if (paragraphs.length === 0) return null

  return (
    <div className={cn('max-w-[65ch] space-y-4 text-base leading-[1.65] text-foreground', className)}>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  )
}

export function ActionLink({
  href,
  children,
  variant = 'primary',
}: {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'quiet'
}) {
  const base =
    'inline-flex min-h-11 items-center justify-center rounded-md text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

  const variants = {
    primary: 'bg-primary px-5 text-primary-foreground hover:bg-brand-hover active:bg-brand-active',
    secondary:
      'border border-border bg-background px-5 text-foreground hover:border-foreground hover:bg-secondary active:bg-muted',
    quiet: 'min-h-0 px-0 text-foreground underline decoration-border underline-offset-4 hover:text-primary hover:decoration-primary',
  } as const

  return (
    <Link href={href} className={cn(base, variants[variant])}>
      {children}
    </Link>
  )
}

/** A call to action stored as { label, url }; renders nothing without a label. */
export function CTA({
  cta,
  locale,
  variant = 'primary',
}: {
  cta?: { label?: string | null; url?: string | null } | null
  locale: Locale
  variant?: 'primary' | 'secondary' | 'quiet'
}) {
  if (!cta?.label) return null
  const raw = cta.url ?? '/'
  const href = raw.startsWith('/') && !raw.startsWith(`/${locale}`) ? `/${locale}${raw}` : raw
  return (
    <ActionLink href={href} variant={variant}>
      {cta.label}
    </ActionLink>
  )
}

export function Ordinal({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-medium tracking-[0.08em] text-primary">{children}</span>
}

export function Bullets({ items }: { items: string[] }) {
  if (items.length === 0) return null
  return (
    <ul className="space-y-3 text-sm leading-relaxed text-foreground">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3">
          <span aria-hidden className="mt-[0.55em] h-1.5 w-1.5 shrink-0 bg-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/** Page hero used by inner templates. */
export function PageHeader({
  eyebrow,
  heading,
  intro,
}: {
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
}) {
  return (
    <div className="mx-auto w-full max-w-[80rem] px-5 pb-20 pt-20 sm:px-6 md:px-8 md:pb-28 md:pt-28 lg:px-12">
      {eyebrow && <Kicker>{eyebrow}</Kicker>}
      {heading && <Heading as="h1" className="mt-5">{heading}</Heading>}
      {intro && <Prose text={intro} className="mt-8 max-w-[58ch] text-lg text-muted-foreground" />}
    </div>
  )
}

/** Project summary shared by archives and related-work surfaces. */
export function ProjectTile({
  href,
  title,
  meta,
  excerpt,
  ctaLabel,
}: {
  href?: string | null
  title: string
  meta?: string
  excerpt?: string | null
  ctaLabel?: string | null
}) {
  return (
    <li className="min-w-0">
      {meta && <p className="text-xs font-medium tracking-[0.06em] text-muted-foreground">{meta}</p>}
      <h3 className="mt-3 text-xl font-semibold leading-snug tracking-[-0.02em] text-foreground">
        {href ? (
          <Link href={href} className="transition-colors duration-150 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
            {title}
          </Link>
        ) : (
          title
        )}
      </h3>
      {excerpt && <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-muted-foreground">{excerpt}</p>}
      {href && ctaLabel && (
        <p className="mt-5">
          <ActionLink href={href} variant="quiet">
            {ctaLabel}
          </ActionLink>
        </p>
      )}
    </li>
  )
}

/** Quiet editorial grid; grouping comes from space rather than boxes. */
export function TileGrid({ children, columns = 3 }: { children: React.ReactNode; columns?: 2 | 3 }) {
  return (
    <ul
      className={cn(
        'grid gap-x-8 gap-y-14',
        columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3',
      )}
    >
      {children}
    </ul>
  )
}

/** Typographic frame for Payload Lexical output. */
export function RichProse({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'max-w-[68ch] text-base leading-[1.7] text-foreground',
        '[&_p]:mt-5 [&_p:first-child]:mt-0',
        '[&_h2]:mt-12 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:tracking-[-0.03em]',
        '[&_h3]:mt-10 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-[-0.02em]',
        '[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:pl-5',
        '[&_li]:mt-2',
        '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4',
        '[&_strong]:font-semibold',
        className,
      )}
    >
      {children}
    </div>
  )
}
