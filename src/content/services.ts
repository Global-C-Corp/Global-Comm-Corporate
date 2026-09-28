/**
 * The four public services — source-owned.
 *
 * This is the single source of truth for the public service pages: the index,
 * `/services/[slug]`, the header submenu, service cards and
 * `generateStaticParams()` all derive from the array below. Do not restate a
 * name or a slug anywhere else.
 *
 * Values migrated from the approved French entries in
 * `src/services/cms/pillarConfig.ts`, which remains in place for a different
 * job: mapping these four buckets onto the Payload `services` taxonomy that
 * classifies projects. `tests/unit/serviceContent.spec.ts` asserts the two stay
 * in agreement, so neither can drift without a failing test.
 *
 * Only the fields that genuinely exist are here. The longer per-service
 * sections the old CMS template could render — client problem, approach,
 * deliverables, outcomes — have never been written in any environment, so the
 * detail page shows what we have rather than inventing the rest.
 */
export type ServiceDefinition = {
  slug: string
  name: string
  /** Short uppercase line shown under the name. */
  positioningLine: string
  /** One paragraph describing what the service is for. */
  summary: string
}

export const services: readonly ServiceDefinition[] = [
  {
    slug: 'recherche-audit-strategie',
    name: 'Recherche, audit et stratégie',
    positioningLine: 'La clarté avant l’engagement',
    summary:
      'Comprendre où vous en êtes, ce qui vous freine et où se trouvent les opportunités les plus fortes, avant d’engager davantage de budget dans l’exécution.',
  },
  {
    slug: 'branding-communication',
    name: 'Branding et communication',
    positioningLine: 'Une marque que l’on comprend et retient',
    summary:
      'Transformer une stratégie d’entreprise en une marque que l’on reconnaît, en qui l’on a confiance et que l’on choisit.',
  },
  {
    slug: 'marketing-digital',
    name: 'Marketing digital',
    positioningLine: 'Plus de ce qui fonctionne',
    summary:
      'Planifier, acheter et optimiser des médias qui amènent les bonnes personnes vers votre marque et produisent des résultats mesurables.',
  },
  {
    slug: 'automatisation-ia',
    name: 'Automatisation et IA',
    positioningLine: 'Un marketing prêt pour la suite',
    summary:
      'Construire des systèmes intelligents qui rendent votre marketing plus rapide, plus pertinent et plus efficace.',
  },
] as const

export function findService(slug: string): ServiceDefinition | undefined {
  return services.find((service) => service.slug === slug)
}

/**
 * Services index copy.
 *
 * The heading previously read "Cinq domaines d’expertise" because the live
 * database still carried five unconsolidated root services. The approved
 * architecture has four, so the number is corrected here rather than shipped
 * contradicting the four cards beneath it.
 */
export const servicesContent = {
  eyebrow: 'Services',
  heading: 'Quatre domaines d’expertise, un système intégré',
  intro:
    'De la stratégie à l’exécution, nos expertises s’articulent autour des besoins réels de nos clients.',
  experienceLabel: 'La confiance d’organisations au Maroc et au-delà',
  meta: {
    title: 'Services — Global Comm',
    description:
      'De la stratégie à l’exécution, nos expertises s’articulent autour des besoins réels de nos clients.',
  },
} as const
