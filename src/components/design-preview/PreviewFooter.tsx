import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { Pending } from '@/components/design-preview/Pending'
import { homeHalbert } from '@/content/homeHalbert'

/**
 * Pied de page de la maquette : hiérarchie simple, navigation et coordonnées.
 *
 * Les coordonnées et les réseaux restent des emplacements : le document
 * source demande des « coordonnées professionnelles validées » sans les
 * fournir, et une adresse inventée serait publiée telle quelle.
 */
export function PreviewFooter() {
  const { footer, meta } = homeHalbert

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-[80rem] px-5 py-16 sm:px-8 md:py-20 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-sm font-bold tracking-[-0.01em] text-foreground">
              GLOBAL COMM<span className="text-primary">.</span>
            </p>
            <p className="mt-5 max-w-[48ch] text-sm leading-relaxed text-muted-foreground">
              {footer.description}
            </p>
          </div>

          <nav className="lg:col-span-3" aria-label="Navigation de pied de page">
            <h2 className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-muted-foreground">
              {footer.navLabel}
            </h2>
            <ul className="mt-5 space-y-3">
              {meta.nav.map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h2 className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-muted-foreground">
              {footer.infoLabel}
            </h2>
            <div className="mt-5 space-y-3">
              {footer.info.map((entry) => (
                <Pending key={entry.pending} label={entry.pending} className="gap-2 p-4" />
              ))}
            </div>
          </div>
        </div>

        <Separator className="mt-16" />

        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 pt-8">
          <p className="text-sm font-medium text-foreground">{footer.signature}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footer.legal.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="text-sm text-muted-foreground">Français / English / Español</li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
