import { notFound, permanentRedirect, redirect } from 'next/navigation'
import type { Locale } from '@/i18n/locale'
import { findRedirect } from '@/services/cms/redirects'

/**
 * A missing document is a 404 only when no Payload redirect record covers
 * the path (CLAUDE.md §70).
 */
export async function redirectOrNotFound(path: string, locale: Locale): Promise<never> {
  const record = await findRedirect(path, locale)

  if (record) {
    if (record.permanent) permanentRedirect(record.destination)
    redirect(record.destination)
  }

  notFound()
}
