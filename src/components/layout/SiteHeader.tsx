import type { Route } from '@/services/seo/urls'
import { Header } from './Header'

/**
 * Kept as a thin seam so pages carry on importing `SiteHeader`. It no longer
 * reaches for Payload: navigation is code-owned.
 */
export function SiteHeader({ route, overDark = false }: { route: Route; overDark?: boolean }) {
  return <Header route={route} overDark={overDark} />
}
