import type { Locale } from '@/i18n/locale'

/**
 * The four public service pillars and the roots that fold into them
 * (CLAUDE.md §29-§30). Keyed by current FR slug because slugs are stable
 * across environments while numeric ids are not.
 *
 * This is the seed for the grouping, not its runtime source of truth. Once
 * applied, the grouping lives in Payload on `isPillar` / `foldedInto`, where
 * an authorized human can correct a bucket without a deploy (§109). Names are
 * the ones approved by the project owner.
 */

export const PILLAR_NAMES: Record<string, Record<Locale, string>> = {
  strategie: {
    fr: 'Recherche, audit et stratégie',
    en: 'Research, Audit & Strategy',
    es: 'Investigación, auditoría y estrategia',
  },
  branding: {
    fr: 'Branding et communication',
    en: 'Branding & Communication',
    es: 'Branding y comunicación',
  },
  'marketing-digital': {
    fr: 'Marketing digital',
    en: 'Digital Marketing',
    es: 'Marketing digital',
  },
  'web-technologie': {
    fr: 'Automatisation et IA',
    en: 'Automation & AI',
    es: 'Automatización e IA',
  },
}

export const PILLAR_SLUGS = Object.keys(PILLAR_NAMES)

/**
 * A root has no parent, so its bucket cannot be derived from the hierarchy.
 * "Création & Contenu" is the one root that stops being public.
 */
export const ROOT_MERGES: Record<string, string> = {
  'creation-contenu': 'branding',
}
