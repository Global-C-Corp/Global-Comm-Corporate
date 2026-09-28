import type { ReactNode } from 'react'
import { draftMode } from 'next/headers'
import { Geist, Source_Serif_4 } from 'next/font/google'
import { PreviewBanner } from '@/components/layout/PreviewBanner'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ui } from '@/content/ui'
import './styles.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' })

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
})

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const { isEnabled: isDraft } = await draftMode()

  return (
    <html lang="fr" className={`${geist.variable} ${sourceSerif.variable}`}>
      <body>
        <a
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
          href="#main"
        >
          {ui.a11y.skipToContent}
        </a>
        {isDraft && <PreviewBanner />}
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
