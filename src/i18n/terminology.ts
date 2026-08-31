import type { Locale } from './locale'

/**
 * Approved multilingual terminology glossary (CLAUDE.md §63).
 * AI translation must consult this before drafting so that recurring
 * industry/service terms stay consistent across locales.
 *
 * Governance follows CLAUDE.md §109: only authorized humans may add,
 * rename, or remove terms. AI reads this glossary; it never writes to it.
 */
export type TerminologyEntry = {
  key: string
  fr: string
  en: string
  es: string
}

export const terminologyGlossary: TerminologyEntry[] = [
  { key: 'lead-generation', fr: 'Génération de leads', en: 'Lead Generation', es: 'Generación de leads' },
  { key: 'brand-strategy', fr: 'Stratégie de marque', en: 'Brand Strategy', es: 'Estrategia de marca' },
  { key: 'content-marketing', fr: 'Marketing de contenu', en: 'Content Marketing', es: 'Marketing de contenidos' },
  { key: 'paid-media', fr: 'Médias payants', en: 'Paid Media', es: 'Medios pagados' },
  { key: 'social-media', fr: 'Réseaux sociaux', en: 'Social Media', es: 'Redes sociales' },
  { key: 'conversion-optimization', fr: 'Optimisation de la conversion', en: 'Conversion Optimization', es: 'Optimización de conversión' },
  { key: 'marketing-automation', fr: 'Automatisation marketing', en: 'Marketing Automation', es: 'Automatización de marketing' },
]

export function findTerm(key: string): TerminologyEntry | undefined {
  return terminologyGlossary.find((entry) => entry.key === key)
}

export function translateApprovedTerm(text: string, sourceLocale: Locale, targetLocale: Locale): string {
  let result = text
  for (const entry of terminologyGlossary) {
    const sourceValue = entry[sourceLocale]
    const targetValue = entry[targetLocale]
    if (sourceValue && targetValue && sourceValue !== targetValue) {
      result = result.split(sourceValue).join(targetValue)
    }
  }
  return result
}
