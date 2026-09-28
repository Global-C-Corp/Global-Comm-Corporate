import { primaryNavigation } from '@/config/navigation'
import { ui } from '@/content/ui'
import { buildPath, type Route } from '@/services/seo/urls'
import { HeaderBar } from './HeaderBar'

/**
 * Server half of the site header. Navigation is source-owned, so this only
 * resolves the current path and hands the rest to the client bar, which owns
 * the condensing behaviour and the mobile sheet.
 *
 * The site is single-language, so no language switcher is offered.
 */
export function Header({ route, overDark = false }: { route: Route; overDark?: boolean }) {
  return (
    <HeaderBar
      overDark={overDark}
      homeHref={buildPath({ type: 'home' })}
      links={[...primaryNavigation]}
      currentUrl={buildPath(route)}
      locales={[]}
      labels={{
        menu: ui.nav.menu,
        close: ui.nav.close,
        primary: ui.a11y.primaryNavigation,
        languages: ui.a11y.languageSwitcher,
      }}
    />
  )
}
