import Link from 'next/link'
import type { Locale } from '@/i18n/locale'
import type { Service } from '@/payload-types'
import { buildPath } from '@/services/seo/urls'

export function ServiceCard({
  service,
  locale,
  children,
}: {
  service: Service
  locale: Locale
  children?: React.ReactNode
}) {
  const href = service.slug ? buildPath(locale, { type: 'service', slug: service.slug }) : undefined

  return (
    <article className="gc-card">
      <p className="gc-card__title">{href ? <Link href={href}>{service.name}</Link> : service.name}</p>
      {service.shortDescription && <p className="gc-card__body">{service.shortDescription}</p>}
      {children}
    </article>
  )
}
