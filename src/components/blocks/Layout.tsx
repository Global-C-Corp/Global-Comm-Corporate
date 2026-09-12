import { cn } from '@/lib/utils'

/**
 * Conteneur et grille V5.1.
 *
 * Système imbriqué : la mesure principale passe à 84rem (1344px), l'échelle
 * que V4 avait perdue en s'alignant sur la section figée. Celle-ci garde son
 * conteneur interne de 80rem — c'est elle qui impose sa mesure à elle-même, et
 * la page ne s'y aligne plus.
 *
 * Gouttières : 20px mobile, 32px tablette, 48px desktop. Grille 12 colonnes,
 * gouttière de 24px.
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
    <Tag className={cn('mx-auto w-full max-w-[84rem] px-5 sm:px-8 lg:px-12', className)}>
      {children}
    </Tag>
  )
}

/**
 * Grille 12 colonnes, gap 24px. Linéarisée sous `lg` : le brief demande de
 * recomposer le mobile, pas de comprimer le desktop, donc chaque bloc décide
 * lui-même de son empilement plutôt que d'hériter d'une grille à 4 colonnes
 * qui ne veut rien dire pour du texte.
 */
export function Grid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('grid gap-x-6 lg:grid-cols-12', className)}>{children}</div>
}

/** Libellé de section : mono Geist, petite capitale. Jamais un niveau de titre. */
export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'font-[family-name:var(--font-geist-mono)] text-label-12 uppercase text-muted-foreground',
        className,
      )}
    >
      {children}
    </p>
  )
}
