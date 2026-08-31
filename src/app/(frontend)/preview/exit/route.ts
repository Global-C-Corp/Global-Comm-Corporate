import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { defaultLocale, isLocale } from '@/i18n/locale'

export async function GET(request: NextRequest) {
  const draft = await draftMode()
  draft.disable()

  const localeParam = request.nextUrl.searchParams.get('locale') ?? defaultLocale
  const locale = isLocale(localeParam) ? localeParam : defaultLocale

  redirect(`/${locale}`)
}
