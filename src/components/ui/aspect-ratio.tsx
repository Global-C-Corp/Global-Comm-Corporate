'use client'

import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio'

/**
 * shadcn/ui AspectRatio, new-york-v4. Identique au registre officiel, seul
 * l'import diffère (paquet Radix individuel plutôt que `radix-ui`).
 *
 * Réserve la boîte avant le rendu du contenu, donc aucun décalage de mise en
 * page sur les plaques de réalisations.
 */
function AspectRatio({ ...props }: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />
}

export { AspectRatio }
