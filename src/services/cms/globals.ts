import { cache } from 'react'
import type {
  CompanyPage,
  ContactPage,
  HomePage,
  Navigation,
  ServicesPage,
  SiteSetting,
  WorkPage,
} from '@/payload-types'
import type { Locale } from '@/i18n/locale'
import { logCmsFailure } from '@/lib/log'
import { isLocalePublic, type PublishableDoc } from '@/lib/publication'
import { baseQueryOptions, getPayloadClient, type QueryContext } from './context'

type PageGlobalSlug = 'home-page' | 'services-page' | 'work-page' | 'company-page' | 'contact-page'

/**
 * Page globals follow the same locale publication invariant as collections
 * (CLAUDE.md §17): an unapproved locale never renders publicly.
 */
async function getPageGlobal<T extends PublishableDoc>(ctx: QueryContext, slug: PageGlobalSlug): Promise<T | null> {
  const payload = await getPayloadClient()
  try {
    const doc = (await payload.findGlobal({
      slug,
      ...baseQueryOptions(ctx),
      depth: 2,
    })) as unknown as T
    if (!doc) return null
    if (!ctx.draft && !isLocalePublic(doc, ctx.locale)) return null
    return doc
  } catch (error) {
    logCmsFailure(`findGlobal(${slug})`, error)
    return null
  }
}

export const getHomePage = (ctx: QueryContext) => getPageGlobal<HomePage>(ctx, 'home-page')
export const getServicesPage = (ctx: QueryContext) => getPageGlobal<ServicesPage>(ctx, 'services-page')
export const getWorkPage = (ctx: QueryContext) => getPageGlobal<WorkPage>(ctx, 'work-page')
export const getCompanyPage = (ctx: QueryContext) => getPageGlobal<CompanyPage>(ctx, 'company-page')
export const getContactPage = (ctx: QueryContext) => getPageGlobal<ContactPage>(ctx, 'contact-page')

export async function getSiteSettings(ctx: QueryContext): Promise<SiteSetting> {
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: 'site-settings',
    ...baseQueryOptions(ctx),
    depth: 1,
  })
}

export async function getNavigation(ctx: QueryContext): Promise<Navigation | null> {
  const payload = await getPayloadClient()
  try {
    return await payload.findGlobal({
      slug: 'navigation',
      ...baseQueryOptions(ctx),
      depth: 0,
    })
  } catch (error) {
    logCmsFailure('findGlobal(navigation)', error)
    return null
  }
}

/**
 * Header and footer need the same two globals on every page; `cache` dedupes
 * them to one fetch per request.
 */
export const getSiteChrome = cache(async (locale: Locale, draft: boolean) => {
  const ctx: QueryContext = { locale, draft }
  const [settings, navigation] = await Promise.all([getSiteSettings(ctx), getNavigation(ctx)])
  return { settings, navigation }
})
