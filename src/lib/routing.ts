import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { findRedirect } from '@/services/cms/redirects'

/**
 * A missing document is a 404 only when no Payload redirect record covers the
 * path. Redirect records are still stored per locale; the public site only
 * ever asks about the French row.
 */
export async function redirectOrNotFound(path: string): Promise<never> {
  const record = await findRedirect(path, 'fr')

  if (record) {
    if (record.permanent) permanentRedirect(record.destination)
    redirect(record.destination)
  }

  notFound()
}
