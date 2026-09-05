import type { Locale } from '@/i18n/locale'

/**
 * The four public service pillars (CLAUDE.md §29-§30).
 *
 * Keyed by the pillar's ORIGINAL fr slug, which is a stable identifier across
 * environments in a way numeric ids are not. Each entry carries the approved
 * names and the target slugs.
 *
 * This is the seed for the grouping, not its runtime source of truth. Once
 * applied, the grouping lives in Payload on `isPillar` / `foldedInto`, where
 * an authorized human can correct a bucket without a deploy (§109).
 */

export type PillarConfig = {
  names: Record<Locale, string>
  /** Target slugs. Renaming a published slug requires a redirect (§70). */
  slugs: Record<Locale, string>
  /**
   * The slugs these pages were published at before the consolidation. Recorded
   * rather than read from the database so the rename redirects stay
   * reproducible after the rename has been applied — otherwise regenerating on
   * a migrated database would silently emit nine fewer 301s.
   */
  previousSlugs: Record<Locale, string>
}

export const PILLARS: Record<string, PillarConfig> = {
  strategie: {
    names: {
      fr: 'Recherche, audit et stratégie',
      en: 'Research, Audit & Strategy',
      es: 'Investigación, auditoría y estrategia',
    },
    slugs: {
      fr: 'recherche-audit-strategie',
      en: 'research-audit-strategy',
      es: 'investigacion-auditoria-estrategia',
    },
    previousSlugs: { fr: 'strategie', en: 'strategy', es: 'estrategia' },
  },
  branding: {
    names: {
      fr: 'Branding et communication',
      en: 'Branding & Communication',
      es: 'Branding y comunicación',
    },
    slugs: {
      fr: 'branding-communication',
      en: 'branding-communication',
      es: 'branding-comunicacion',
    },
    previousSlugs: { fr: 'branding', en: 'branding', es: 'branding' },
  },
  'marketing-digital': {
    names: {
      fr: 'Marketing digital',
      en: 'Digital Marketing',
      es: 'Marketing digital',
    },
    // Unchanged: this pillar keeps its name, so its URLs stay put.
    slugs: {
      fr: 'marketing-digital',
      en: 'digital-marketing',
      es: 'marketing-digital',
    },
    previousSlugs: { fr: 'marketing-digital', en: 'digital-marketing', es: 'marketing-digital' },
  },
  'web-technologie': {
    names: {
      fr: 'Automatisation et IA',
      en: 'Automation & AI',
      es: 'Automatización e IA',
    },
    slugs: {
      fr: 'automatisation-ia',
      en: 'automation-ai',
      es: 'automatizacion-ia',
    },
    previousSlugs: { fr: 'web-technologie', en: 'web-technology', es: 'web-y-tecnologia' },
  },
}

export const PILLAR_SLUGS = Object.keys(PILLARS)

/**
 * A root has no parent, so its bucket cannot be derived from the hierarchy.
 * "Création & Contenu" is the one root that stops being public.
 */
export const ROOT_MERGES: Record<string, string> = {
  'creation-contenu': 'branding',
}

/**
 * Maps a pillar's current fr slug back to its config key, accepting both the
 * original slug and the renamed one. Without this, every script that keys off
 * the fr slug would stop recognising its own pillars the second time it ran.
 */
export function pillarKeyForFrSlug(frSlug: string): string | undefined {
  if (PILLARS[frSlug]) return frSlug
  return PILLAR_SLUGS.find(
    (key) => PILLARS[key].slugs.fr === frSlug || PILLARS[key].previousSlugs.fr === frSlug,
  )
}

/**
 * Restates the configuration in terms of the fr slugs currently in the
 * database, so the resolver works both before and after the rename. Passing
 * the config keys directly would make every script fail on its second run,
 * once "strategie" no longer exists.
 */
export function currentPillarConfig(frSlugs: string[]): {
  pillarSlugs: string[]
  rootMerges: Record<string, string>
} {
  const slugByKey = new Map<string, string>()
  for (const slug of frSlugs) {
    const key = pillarKeyForFrSlug(slug)
    if (key) slugByKey.set(key, slug)
  }

  return {
    pillarSlugs: [...slugByKey.values()],
    rootMerges: Object.fromEntries(
      Object.entries(ROOT_MERGES).map(([from, key]) => [from, slugByKey.get(key) ?? key]),
    ),
  }
}
