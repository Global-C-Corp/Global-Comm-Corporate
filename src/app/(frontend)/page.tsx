import { redirect } from 'next/navigation'

/**
 * `/home` is the canonical homepage. The root redirects to it rather than
 * serving the same page at two addresses.
 */
export default function RootRoute() {
  redirect('/home')
}
