import Link from 'next/link'
import { getDictionary } from '@/i18n/dictionaries'
import { defaultLocale } from '@/i18n/locale'

/**
 * Locale-scoped 404. `params` is not available in a not-found boundary, so
 * this renders in the default locale — the localized alternative would be a
 * fabricated guess (CLAUDE.md §139).
 */
export default function LocaleNotFound() {
  const t = getDictionary(defaultLocale)

  return (
    <main id="main" className="gc-container gc-page-header">
      <h1>{t.notFound.title}</h1>
      <p className="gc-lead">{t.notFound.body}</p>
      <div className="gc-button-row">
        <Link className="gc-button" href={`/${defaultLocale}`}>
          {t.notFound.backHome}
        </Link>
      </div>
    </main>
  )
}
