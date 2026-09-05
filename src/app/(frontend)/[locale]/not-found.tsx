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
    <main id="main" className="gc-tw mx-auto w-full max-w-[76rem] px-6 py-24 md:px-10 md:py-32">
      <h1>{t.notFound.title}</h1>
      <p className="mt-6 max-w-[62ch] text-lg text-foreground">{t.notFound.body}</p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link className="rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href={`/${defaultLocale}`}>
          {t.notFound.backHome}
        </Link>
      </div>
    </main>
  )
}
