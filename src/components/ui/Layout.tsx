import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * Conteneur et grille de la homepage approuvée.
 *
 * La maquette de référence place le bord du contenu à ~69px d'un viewport de
 * 1440px. `max-w-[90rem]` + gouttière de 64px donne 64px : la mesure de
 * contenu est de 1312px, à quatre pixels près celle de la référence.
 *
 * Gouttières : 20px mobile, 32px tablette, 64px desktop.
 */
export function Container({
  children,
  className,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'header' | 'footer'
}) {
  return (
    <Tag className={cn('mx-auto w-full max-w-[90rem] px-5 sm:px-8 lg:px-16', className)}>
      {children}
    </Tag>
  )
}

/**
 * Grille 12 colonnes, gap 24px. Linéarisée sous `lg` : la référence recompose
 * le mobile plutôt que de comprimer le desktop, donc chaque bloc décide de son
 * empilement.
 */
export function Grid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('grid gap-x-6 lg:grid-cols-12', className)}>{children}</div>
}

/** Libellé de section : mono, petite capitale. Jamais un niveau de titre. */
export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'font-mono text-label-12 uppercase tracking-[0.1em] text-muted-foreground',
        className,
      )}
    >
      {children}
    </p>
  )
}

/**
 * Marque Global Comm telle qu'elle apparaît dans la maquette approuvée :
 * « global comm » en bas de casse, suivi du carré bleu de marque, avec la
 * raison sociale en très petite capitale en dessous.
 *
 * Le carré est décoratif — la raison sociale porte déjà le ™ —, donc il est
 * masqué aux technologies d'assistance.
 */
export function Wordmark({
  href = '/design/home',
  tone = 'light',
  showLegalName = true,
  className,
}: {
  href?: string
  tone?: 'light' | 'dark'
  showLegalName?: boolean
  className?: string
}) {
  return (
    <Link
      href={href}
      translate="no"
      className={cn(
        // py/-my gives the mark a 44px target while it still occupies only
        // its own height in the bar (03 §32).
        'group/mark inline-flex flex-col justify-center gap-1 rounded-[2px] py-2 -my-2',
        'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
        tone === 'dark' && 'focus-visible:outline-white',
        className,
      )}
    >
      <span className="flex items-center gap-2">
        <span
          className={cn(
            'text-[1.0625rem] font-semibold leading-none tracking-[-0.025em]',
            tone === 'dark' ? 'text-white' : 'text-foreground',
          )}
        >
          global comm
        </span>
        <span aria-hidden className="mb-[1px] block size-[0.5rem] bg-primary" />
      </span>

      {showLegalName ? (
        <span
          className={cn(
            'text-[0.5rem] font-medium uppercase leading-none tracking-[0.12em]',
            tone === 'dark' ? 'text-white/55' : 'text-muted-foreground',
          )}
        >
          Global Communication Corporate ™
        </span>
      ) : null}
    </Link>
  )
}
