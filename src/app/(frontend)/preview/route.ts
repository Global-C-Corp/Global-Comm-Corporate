import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { getRole } from '@/access/predicates'
import { defaultLocale, isLocale } from '@/i18n/locale'
import { previewPathFor } from '@/lib/preview'
import { getPayloadClient } from '@/services/cms/context'

/**
 * Entering preview requires BOTH the shared secret and an authenticated
 * Payload user with an internal role — a leaked link alone never exposes
 * drafts (CLAUDE.md §87).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const secret = searchParams.get('secret')
  const collection = searchParams.get('collection')
  const slug = searchParams.get('slug')
  const localeParam = searchParams.get('locale') ?? defaultLocale

  const expectedSecret = process.env.PREVIEW_SECRET
  if (!expectedSecret || secret !== expectedSecret) {
    return new Response('Invalid preview secret', { status: 401 })
  }

  if (!collection) {
    return new Response('Missing collection', { status: 400 })
  }

  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: request.headers })
  const role = getRole({ user } as Parameters<typeof getRole>[0])
  if (!role) {
    return new Response('Authentication required', { status: 403 })
  }

  const locale = isLocale(localeParam) ? localeParam : defaultLocale
  const path = previewPathFor({ collection, slug }, locale)
  if (!path) {
    return new Response('Preview is not available for this document', { status: 400 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(path)
}
