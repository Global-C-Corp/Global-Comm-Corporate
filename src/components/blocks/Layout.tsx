import { cn } from '@/lib/utils'

/**
 * Conteneur et grille de la maquette V4.
 *
 * La largeur maximale est 80rem, pas les 1344px du brief. C'est la largeur du
 * conteneur de la section Expertises figée, dont le design interne est
 * verrouillé : l'élargir décalerait ses colonnes. Le brief tranche lui-même le
 * conflit — « the rest of the page must adapt around it » — donc c'est la
 * section figée qui fixe la mesure et le reste de la page s'y aligne.
 *
 * Les gouttières reprennent les paliers du brief : 20px mobile, 32px tablette,
 * 48px desktop. Les proportions de colonnes (12 / 24px de gap) sont
 * conservées ; seules les largeurs absolues sont réduites d'environ 12 %.
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
    <Tag className={cn('mx-auto w-full max-w-[80rem] px-5 sm:px-8 lg:px-12', className)}>
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

/**
 * Emplacement d'un élément que Global Comm doit fournir.
 *
 * Volontairement reconnaissable — trait discontinu, mention « TO BE SUPPLIED ».
 * Aucun logo, chiffre ou visuel n'est fabriqué à la place, et ces blocs
 * n'existent que dans la maquette.
 */
export function Slot({
  label,
  className,
  tone = 'default',
  title,
}: {
  label: string
  className?: string
  tone?: 'default' | 'inverted'
  title?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between gap-6 border border-dashed p-5',
        tone === 'inverted'
          ? 'border-background/40 text-background'
          : 'border-foreground/20 bg-[#FAFAF8] text-muted-foreground',
        className,
      )}
    >
      <p
        className={cn(
          'font-[family-name:var(--font-geist-mono)] text-label-12 uppercase',
          tone === 'inverted' ? 'text-background/70' : 'text-muted-foreground',
        )}
      >
        To be supplied
      </p>
      <div>
        {title && (
          <p className={cn('text-heading-24', tone === 'inverted' ? 'text-background' : 'text-foreground')}>
            {title}
          </p>
        )}
        <p className={cn('max-w-[38ch] text-copy-14', title && 'mt-2')}>{label}</p>
      </div>
    </div>
  )
}
