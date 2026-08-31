import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale, locales } from '@/i18n/locale'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { PreviewBanner } from '@/components/layout/PreviewBanner'
import '../styles.css'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dictionary = getDictionary(locale)
  const { isEnabled: isDraft } = await draftMode()

  return (
    <html lang={locale}>
      <body>
        <a className="gc-skip-link" href="#main">
          {dictionary.a11y.skipToContent}
        </a>
        {isDraft && <PreviewBanner locale={locale} />}
        {children}
        <SiteFooter locale={locale} draft={isDraft} />
      </body>
    </html>
  )
}
