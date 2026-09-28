import { Footer } from './Footer'

/**
 * Kept as a thin seam so the layout carries on importing `SiteFooter`. Every
 * value it needs is now a site constant rather than a Payload global.
 */
export function SiteFooter() {
  return <Footer />
}
