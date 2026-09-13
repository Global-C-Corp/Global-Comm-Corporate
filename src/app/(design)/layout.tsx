import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import '../(frontend)/styles.css'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#FAFAF8',
  colorScheme: 'light',
}

export default function DesignLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://d8j0ntlcm91z4.cloudfront.net" crossOrigin="" />
      </head>
      <body className="font-[family-name:var(--font-geist-sans)] antialiased">
        <a
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:flex focus-visible:min-h-11 focus-visible:items-center focus-visible:rounded-[4px] focus-visible:bg-primary focus-visible:px-4 focus-visible:text-label-14 focus-visible:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          href="#main"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}
