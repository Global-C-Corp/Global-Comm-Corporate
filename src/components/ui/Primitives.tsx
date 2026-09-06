import Image from 'next/image'
import Link from 'next/link'
import type { TileImage } from '@/lib/media'
import type { Locale } from '@/i18n/locale'
import { cn } from '@/lib/utils'

/**
 * Shared layout primitives for the migrated frontend, written against Tailwind
 * inside the `.gc-tw` Preflight boundary (CLAUDE.md §82-§83).
 *
 * Restrained on purpose: hairline borders, generous whitespace, a strong grid,
 * no shadows, and radii capped at 4px by the theme. No gradients, no glass, no
 * dashboard language.
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
      className={cn(
        'border-t border-border',
        surface ? 'bg-muted' : 'bg-background',
        className,
      )}
    >
      <div className="mx-auto w-full max-w-[76rem] px-6 py-20 md:px-10 md:py-28">{children}</div>
    </section>
  )
}

export function Kicker({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <p id={id} className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
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
  /** Target for a Band's aria-labelledby, so the landmark is named. */
  id?: string
}) {
  return (
    <Tag
      id={id}
      className={cn(
        'max-w-[24ch] text-balance font-sans font-semibold tracking-[-0.02em] text-foreground',
        Tag === 'h1' ? 'text-4xl leading-[1.05] md:text-6xl' : 'text-3xl leading-[1.1] md:text-4xl',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

/**
 * Renders copy that the CMS stores as blank-line separated paragraphs. Editors
 * type prose, not markup, so the split happens here rather than asking them to
 * think about elements.
 */
export function Prose({ text, className }: { text?: string | null; className?: string }) {
  if (!text) return null
  const paragraphs = text.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean)
  if (paragraphs.length === 0) return null

  return (
    <div className={cn('max-w-[62ch] space-y-4 text-base leading-relaxed text-foreground', className)}>
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
    'inline-flex items-center justify-center rounded-sm px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-foreground',
    secondary: 'border border-border text-foreground hover:border-foreground',
    quiet: 'px-0 py-0 text-foreground underline underline-offset-4 hover:text-primary',
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

/** Numbered rule used by the services and approach sections. */
export function Ordinal({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-medium tabular-nums text-primary">{children}</span>
}

export function Bullets({ items }: { items: string[] }) {
  if (items.length === 0) return null
  return (
    <ul className="space-y-2 text-sm text-foreground">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3 border-t border-border pt-2">
          <span aria-hidden className="text-primary">
            —
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/** Page hero used by every migrated inner template. */
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
    <div className="mx-auto w-full max-w-[76rem] px-6 pt-16 pb-16 md:px-10 md:pt-24 md:pb-20">
      {eyebrow && <Kicker>{eyebrow}</Kicker>}
      {heading && <Heading as="h1" className="mt-5">{heading}</Heading>}
      {intro && <Prose text={intro} className="mt-8 text-lg" />}
    </div>
  )
}

/**
 * One project in a grid. Shared by the homepage, the services pages and the
 * work archive so a case study looks the same wherever it is surfaced.
 *
 * The tile is image-led when the project actually has media of its own, and
 * text-led otherwise. `mediaLed` is decided per grid rather than per tile: it
 * keeps a row regular when some projects have media and others do not, and it
 * avoids a wall of identical placeholder fields when none of them do. Adding a
 * real image to one project is enough to flip the whole grid — no code change.
 *
 * The text-led field is deliberately typographic. It restates the project
 * title in the surface colour behind a brand rule; it is aria-hidden, because
 * the real title follows immediately below, and it never pretends to be
 * project imagery.
 */
export function ProjectTile({
  href,
  title,
  meta,
  excerpt,
  ctaLabel,
  image,
  mediaLed = false,
  priority = false,
}: {
  href?: string | null
  title: string
  meta?: string
  excerpt?: string | null
  ctaLabel?: string | null
  image?: TileImage
  /** Whether this grid shows a visual band above each tile at all. */
  mediaLed?: boolean
  /** Set on the first tile above the fold only; everything else lazy-loads. */
  priority?: boolean
}) {
  return (
    <li className="flex flex-col bg-background">
      {mediaLed &&
        (image ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-border bg-muted">
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority={priority}
            />
          </div>
        ) : (
          <div
            aria-hidden
            className="flex aspect-[4/3] w-full flex-col justify-between border-b border-border bg-muted p-8"
          >
            <span className="block h-1.5 w-10 bg-primary" />
            <span className="line-clamp-3 text-2xl font-semibold leading-tight tracking-[-0.02em] text-foreground/70">
              {title}
            </span>
          </div>
        ))}

      <div className="flex flex-1 flex-col p-8">
        {meta && <p className="text-xs text-muted-foreground">{meta}</p>}
        <h3 className="mt-4 text-lg font-semibold leading-snug text-foreground">
          {href ? (
            <Link href={href} className="hover:text-primary">
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        {excerpt && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{excerpt}</p>}
        {href && ctaLabel && (
          <p className="mt-6">
            <Link href={href} className="text-sm font-medium text-primary underline underline-offset-4 hover:text-foreground">
              {ctaLabel}
            </Link>
          </p>
        )}
      </div>
    </li>
  )
}

/** Bordered grid wrapper: hairline dividers via a 1px gap over the border colour. */
export function TileGrid({ children, columns = 3 }: { children: React.ReactNode; columns?: 2 | 3 }) {
  return (
    <ul
      className={cn(
        'grid gap-px border border-border bg-border',
        columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3',
      )}
    >
      {children}
    </ul>
  )
}

/**
 * Typographic frame for CMS rich text inside the Preflight boundary.
 *
 * Preflight deliberately strips heading sizes, list markers and margins, which
 * is right for markup we control but wrong for Lexical output an editor wrote.
 * These arbitrary variants restore just enough for editorial prose, without
 * adding the typography plugin for one component (§141).
 */
export function RichProse({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'max-w-[68ch] text-base leading-relaxed text-foreground',
        '[&_p]:mt-4 [&_p:first-child]:mt-0',
        '[&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold',
        '[&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold',
        '[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-5',
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
