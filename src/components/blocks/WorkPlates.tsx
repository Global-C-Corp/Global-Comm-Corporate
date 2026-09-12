import { AspectRatio } from '@/components/ui/aspect-ratio'

/**
 * Plaques de réalisations.
 *
 * Le dépôt ne contient aucun projet approuvé : ni média, ni fiche client, ni
 * visuel. Plutôt que des cadres vides, ces plaques sont des compositions
 * finies qui représentent les disciplines réellement pratiquées — système de
 * marque, campagne digitale, plateforme technologique.
 *
 * Ce sont des abstractions visuelles, pas des captures client. Aucune ne porte
 * de nom de client, d'année ni de résultat. Quand de vrais visuels arriveront,
 * ils prendront leur place sans toucher à la composition de la section.
 *
 * Construites en div et bordures, sans image ni SVG : rien à charger, rien à
 * décaler, rendu identique partout.
 *
 * Les ratios sont volontairement larges. Une plaque en pleine mesure à 16:10
 * dépasse 800px de haut et la composition s'y noie — c'est ce qui rendait la
 * version précédente vide.
 */

/** Plaque 01 — système de marque : planche de spécimen, palette, déclinaisons. */
export function BrandSystemPlate() {
  return (
    <AspectRatio ratio={2 / 1}>
      <div className="grid h-full w-full grid-cols-12 overflow-hidden bg-[#F5F5F2]">
        {/* Bloc de marque. */}
        <div className="col-span-3 flex flex-col justify-between border-r border-foreground/10 p-6">
          <span className="font-[family-name:var(--font-geist-mono)] text-[0.5625rem] uppercase tracking-[0.18em] text-muted-foreground">
            Identity
          </span>
          <div>
            <span className="block h-10 w-10 bg-primary" />
            <span className="mt-3 block h-1.5 w-20 bg-foreground" />
            <span className="mt-1.5 block h-1.5 w-14 bg-foreground/30" />
          </div>
          <div className="flex gap-1.5">
            <span className="h-7 flex-1 bg-foreground" />
            <span className="h-7 flex-1 bg-primary" />
            <span className="h-7 flex-1 border border-foreground/20 bg-background" />
          </div>
        </div>

        {/* Spécimen typographique. */}
        <div className="relative col-span-5 border-r border-foreground/10">
          <span
            aria-hidden
            className="absolute left-5 top-1/2 -translate-y-[56%] text-[clamp(6rem,11vw,10rem)] font-semibold leading-none tracking-[-0.05em] text-foreground"
          >
            Aa
          </span>
          <div className="absolute inset-x-5 top-1/2 h-px bg-primary" />
          <div className="absolute inset-x-5 bottom-5 space-y-1.5">
            <span className="block h-1 w-full bg-foreground/15" />
            <span className="block h-1 w-5/6 bg-foreground/15" />
            <span className="block h-1 w-2/3 bg-foreground/15" />
          </div>
          <span className="absolute left-5 top-5 font-[family-name:var(--font-geist-mono)] text-[0.5625rem] uppercase tracking-[0.18em] text-muted-foreground">
            Typeface
          </span>
        </div>

        {/* Déclinaisons packaging et grille. */}
        <div className="col-span-4 flex flex-col justify-between p-6">
          <span className="font-[family-name:var(--font-geist-mono)] text-[0.5625rem] uppercase tracking-[0.18em] text-muted-foreground">
            Applications
          </span>

          <div className="flex items-end gap-2">
            <span className="h-16 w-1/5 border border-foreground/20 bg-background" />
            <span className="h-24 w-1/5 bg-foreground" />
            <span className="h-20 w-1/5 border border-foreground/20 bg-background" />
            <span className="h-28 w-1/5 bg-primary" />
            <span className="h-14 w-1/5 border border-foreground/20 bg-background" />
          </div>

          <div className="grid grid-cols-6 gap-px bg-foreground/10">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className={i === 4 ? 'aspect-square bg-foreground/70' : 'aspect-square bg-[#F5F5F2]'} />
            ))}
          </div>
        </div>
      </div>
    </AspectRatio>
  )
}

/** Plaque 02 — campagne digitale : cadre navigateur et crop social adjacent. */
export function DigitalCampaignPlate() {
  return (
    <AspectRatio ratio={4 / 3}>
      <div className="flex h-full w-full gap-3 overflow-hidden bg-[#F5F5F2] p-5">
        {/* Cadre navigateur. */}
        <div className="flex flex-[3] flex-col border border-foreground/15 bg-background">
          <div className="flex items-center gap-1.5 border-b border-foreground/10 px-3 py-2">
            <span className="size-1 rounded-full bg-foreground/25" />
            <span className="size-1 rounded-full bg-foreground/25" />
            <span className="size-1 rounded-full bg-foreground/25" />
            <span className="ml-2 h-1.5 w-1/3 rounded-full bg-foreground/10" />
          </div>
          <div className="flex flex-1 flex-col p-3">
            <div className="h-[22%] bg-primary" />
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              <span className="h-7 bg-foreground/10" />
              <span className="h-7 bg-foreground/10" />
              <span className="h-7 bg-foreground/10" />
            </div>
            <div className="mt-2 space-y-1">
              <span className="block h-1 w-5/6 bg-foreground/12" />
              <span className="block h-1 w-2/3 bg-foreground/12" />
              <span className="block h-1 w-3/4 bg-foreground/12" />
            </div>
            <div className="mt-auto grid grid-cols-2 gap-1.5">
              <span className="h-10 bg-foreground/8" />
              <span className="h-10 bg-foreground/8" />
            </div>
          </div>
        </div>

        {/* Crops sociaux, côte à côte plutôt qu'en superposition bancale. */}
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex-1 border border-foreground/15 bg-foreground p-2">
            <span className="block h-1 w-2/3 bg-primary" />
            <span className="mt-1.5 block h-1 w-1/2 bg-background/30" />
          </div>
          <div className="flex-1 border border-foreground/15 bg-background p-2">
            <span className="block h-1 w-3/4 bg-foreground/20" />
            <span className="mt-1.5 block h-1 w-1/2 bg-foreground/15" />
            <span className="mt-3 block h-6 w-full bg-primary/15" />
          </div>
          <div className="flex-1 border border-foreground/15 bg-background p-2">
            <span className="block h-full w-full bg-foreground/8" />
          </div>
        </div>
      </div>
    </AspectRatio>
  )
}

/** Plaque 03 — plateforme technologique. Le seul moment sombre de la page. */
export function TechnologyPlate() {
  return (
    <AspectRatio ratio={4 / 3}>
      <div className="flex h-full w-full gap-4 overflow-hidden bg-[#0A0A0A] p-5">
        {/* Rail latéral. */}
        <div className="w-[18%] space-y-2 border-r border-background/10 pr-3">
          <span className="block h-1.5 w-full bg-primary" />
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="block h-1.5 w-4/5 bg-background/15" />
          ))}
          <span className="mt-6 block h-px w-full bg-background/10" />
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className="block h-1.5 w-3/5 bg-background/10" />
          ))}
        </div>

        <div className="flex flex-1 flex-col gap-4">
          {/* Diagramme d'automatisation. */}
          <div className="flex flex-[3] items-center justify-between">
            <span className="size-9 border border-background/25" />
            <span className="h-px flex-1 bg-background/20" />
            <span className="size-9 border border-primary bg-primary/20" />
            <span className="h-px flex-1 bg-background/20" />
            <span className="size-9 border border-background/25" />
            <span className="h-px flex-1 bg-background/20" />
            <span className="size-9 border border-background/25" />
          </div>

          {/* Module analytique, ramené à un tiers de la plaque. */}
          <div className="flex flex-[2] items-end gap-1.5 border-t border-background/10 pt-4">
            {[38, 56, 44, 68, 50, 84, 60, 46].map((h, i) => (
              <span
                key={i}
                className={i === 5 ? 'flex-1 bg-primary' : 'flex-1 bg-background/18'}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </AspectRatio>
  )
}
