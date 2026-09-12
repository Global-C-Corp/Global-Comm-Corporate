import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import '../(frontend)/styles.css'

/**
 * Racine isolée des maquettes frontend.
 *
 * Groupe de routes distinct de `(frontend)` et `(payload)`, avec son propre
 * html/body : une maquette n'hérite donc ni du header ni du footer pilotés par
 * le CMS, et ne touche aucune route de production. Elle réutilise en revanche
 * la même feuille de styles, donc les mêmes tokens et le même thème shadcn.
 *
 * Geist est chargé ici et nulle part ailleurs. Les variables de police sont
 * posées sur <html>, et la famille est appliquée sur <body> par une utilitaire
 * non calquée, qui l'emporte donc sur la règle `@layer base` réglant le site
 * public sur Inter. Résultat : /fr, /en et /es gardent leur pile de polices
 * inchangée, et aucun octet de Geist n'entre dans leur bundle.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function DesignLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-[family-name:var(--font-geist-sans)] antialiased">
        <a
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-primary focus:px-4 focus:py-2 focus:text-label-14 focus:text-primary-foreground"
          href="#main"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}
