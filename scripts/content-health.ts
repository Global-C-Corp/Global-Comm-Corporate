import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { locales, translationStatusKey } from '../src/i18n/locale'

/**
 * Content completeness report (CLAUDE.md §110). Read-only: it reports gaps
 * so a human can decide, and never writes anything to close them.
 */
const COLLECTIONS = ['services', 'industries', 'clients', 'projects', 'testimonials'] as const

type Doc = {
  id: number
  title?: string | null
  name?: string | null
  internalTitle?: string | null
  _status?: string | null
  reviewStatus?: string | null
  translationStatus?: Record<string, string | null | undefined> | null
  meta?: { title?: string | null; description?: string | null } | null
}

async function main() {
  const payload = await getPayload({ config })

  for (const collection of COLLECTIONS) {
    const result = await payload.find({
      collection,
      locale: 'fr',
      fallbackLocale: false,
      draft: true,
      depth: 0,
      limit: 500,
      overrideAccess: true,
    })

    console.log(`\n${collection.toUpperCase()} — ${result.totalDocs} document(s)`)

    for (const raw of result.docs as Doc[]) {
      const label = raw.title ?? raw.name ?? raw.internalTitle ?? `#${raw.id}`
      const translations = locales
        .map((locale) => `${locale}:${raw.translationStatus?.[translationStatusKey(locale)] ?? 'missing'}`)
        .join('  ')

      const gaps: string[] = []
      if (!raw.meta?.title) gaps.push('seo.title')
      if (!raw.meta?.description) gaps.push('seo.description')

      console.log(
        `  ${label}\n    status=${raw._status ?? 'draft'}  review=${raw.reviewStatus ?? 'unknown'}\n    ${translations}${
          gaps.length > 0 ? `\n    missing: ${gaps.join(', ')}` : ''
        }`,
      )
    }
  }

  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
