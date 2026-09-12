import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '../(frontend)/styles.css'

/**
 * Racine isolée des maquettes frontend.
 *
 * Groupe de routes distinct de `(frontend)` et `(payload)`, avec son propre
 * html/body : une maquette n'hérite donc ni du header ni du footer pilotés par
 * le CMS, et ne touche aucune route de production. Elle réutilise en revanche
 * la même feuille de styles, donc les mêmes tokens et le même thème shadcn.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function DesignLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <a
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
          href="#main"
        >
          Aller au contenu
        </a>
        {children}
      </body>
    </html>
  )
}
