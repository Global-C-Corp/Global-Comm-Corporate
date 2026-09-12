import { cn } from '@/lib/utils'

/**
 * Emplacement d'un élément que Global Comm doit fournir ou valider.
 *
 * Volontairement reconnaissable — trait discontinu, fond neutre, mention « À
 * fournir » — pour qu'aucune relecture ne puisse le confondre avec un contenu
 * réel. Rien n'est inventé à la place : ni logo, ni chiffre, ni photographie.
 * Ces blocs n'existent que dans la maquette.
 */
export function Pending({
  label,
  className,
  tone = 'default',
  children,
}: {
  label: string
  className?: string
  tone?: 'default' | 'inverted'
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'flex flex-col justify-center gap-3 border border-dashed p-6',
        tone === 'inverted'
          ? 'border-background/40 bg-background/5 text-background'
          : 'border-foreground/25 bg-muted text-muted-foreground',
        className,
      )}
    >
      {children}
      <p
        className={cn(
          'text-[0.6875rem] font-medium uppercase tracking-[0.08em]',
          tone === 'inverted' ? 'text-background/70' : 'text-muted-foreground',
        )}
      >
        À fournir
      </p>
      <p className="max-w-[42ch] text-sm leading-relaxed">{label}</p>
    </div>
  )
}
