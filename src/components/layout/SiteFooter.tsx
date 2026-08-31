import type { Locale } from '@/i18n/locale'
import { toNavLinks } from '@/lib/nav'
import { getSiteChrome } from '@/services/cms/globals'
import { Footer } from './Footer'

export async function SiteFooter({ locale, draft = false }: { locale: Locale; draft?: boolean }) {
  const { settings, navigation } = await getSiteChrome(locale, draft)

  return (
    <Footer
      locale={locale}
      footerLinks={toNavLinks(locale, navigation?.footerNavigation)}
      legalLinks={toNavLinks(locale, navigation?.legalNavigation)}
      companyName={settings?.companyName ?? 'Global Communication Corporate'}
      copyrightText={settings?.copyrightText}
      primaryEmail={settings?.primaryEmail}
      primaryPhone={settings?.primaryPhone}
      address={settings?.address}
      socialLinks={settings?.socialLinks}
    />
  )
}
