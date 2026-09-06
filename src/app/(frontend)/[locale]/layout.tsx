import type { ReactNode } from 'react'
import { draftMode } from 'next/headers'
import { Geist, Source_Serif_4 } from 'next/font/google'
import { notFound } from 'next/navigation'
import { PreviewBanner } from '@/components/layout/PreviewBanner'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale, locales } from '@/i18n/locale'
import '../styles.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
})

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
    <html lang={locale} className={`${geist.variable} ${sourceSerif.variable}`}>
      <body>
        <a
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
          href="#main"
        >
          {dictionary.a11y.skipToContent}
        </a>
        {isDraft && <PreviewBanner locale={locale} />}
        {children}
        <SiteFooter locale={locale} draft={isDraft} />
      </body>
    </html>
  )
}
