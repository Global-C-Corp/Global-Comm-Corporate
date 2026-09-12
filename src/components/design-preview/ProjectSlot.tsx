import { cn } from '@/lib/utils'

/**
 * Emplacement d'une étude de cas.
 *
 * Le document source ne nomme aucun projet : ses trois cartes sont des
 * gabarits. Plutôt que d'afficher un titre gris au-dessus d'un cadre vide —
 * ce qui donne deux fois le même message et ressemble à un bug — la carte
 * porte son propre libellé, ce qu'il faut fournir, et l'intitulé de lien
 * prévu par le copywriting, rendu inerte tant qu'il n'y a rien à lier.
 */
export function ProjectSlot({
  slot,
  label,
  ctaLabel,
  className,
}: {
  slot: string
  label: string
  ctaLabel: string
  className?: string
}) {
  return (
    <article
      className={cn(
        'flex flex-col justify-between gap-8 border border-dashed border-foreground/25 bg-background/60 p-6 md:p-8',
        className,
      )}
    >
      <p className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        À fournir
      </p>

      <div>
        <h3 className="text-xl font-semibold tracking-[-0.01em] text-foreground md:text-2xl">{slot}</h3>
        <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-muted-foreground">{label}</p>
        <p aria-hidden className="mt-6 text-sm font-medium text-muted-foreground">
          {ctaLabel} →
        </p>
      </div>
    </article>
  )
}
