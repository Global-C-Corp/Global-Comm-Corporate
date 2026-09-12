/**
 * Contenu de la Home V4 — maquette frontend isolée.
 *
 * Copie fournie mot pour mot par le brief. Aucun client, chiffre, partenariat,
 * témoignage ni visuel n'est inventé : tout ce que le dépôt ne contient pas
 * réellement apparaît comme un emplacement explicite.
 *
 * La section Expertises n'est pas ici : elle est figée et lit son propre
 * contenu depuis `homeHalbert.ts`.
 */

export type Pending = { readonly pending: string }

export const homeV4 = {
  header: {
    wordmark: 'GLOBAL COMMUNICATION CORPORATE™',
    nav: [
      { label: 'Work', href: '/fr/work' },
      { label: 'Services', href: '/fr/services' },
      { label: 'Company', href: '/fr/company' },
      { label: 'Contact', href: '/fr/contact' },
    ],
  },

  hero: {
    eyebrow: 'STRATEGY · BRANDING · DIGITAL MARKETING · GROWTH',
    heading: 'A strategic marketing partner for brands ready to grow.',
    support:
      'We help companies build stronger brands, create better content and turn digital marketing into measurable business growth.',
    primaryCTA: { label: 'Start a project', href: '/fr/contact' },
    secondaryCTA: { label: 'View our work', href: '/fr/work' },
    closing:
      'From strategy to execution, one partner connecting brand, marketing and digital growth.',
  },

  trust: {
    label: 'TRUSTED BY',
    support: 'Selected companies, institutions and brands we’ve worked with',
    /**
     * Cinq emplacements. Le dépôt ne contient aucun logo client : ni fichier
     * dans public/, ni média en base. Rien n'est fabriqué à la place.
     */
    logos: [
      { pending: 'Client logo 01' },
      { pending: 'Client logo 02' },
      { pending: 'Client logo 03' },
      { pending: 'Client logo 04' },
      { pending: 'Client logo 05' },
    ] as readonly Pending[],
  },

  platforms: {
    label: 'PLATFORM EXPERTISE',
    support: 'Built across the platforms your customers already use',
    /** Compétence opérationnelle, pas un partenariat officiel ni une certification. */
    items: ['GOOGLE', 'META', 'TIKTOK', 'LINKEDIN'],
  },

  pointOfView: {
    label: '02 / OUR POINT OF VIEW',
    statement: [
      "Better marketing doesn't begin with more execution.",
      'It begins with better understanding.',
    ],
    left: "Most companies don't need more scattered marketing.",
    right: 'We start by understanding the business, audience, market and objective.',
  },

  work: {
    label: '04 / SELECTED WORK',
    heading: 'Work built around real business problems.',
    viewLabel: 'VIEW PROJECT',
    /**
     * Aucun projet approuvé n'existe dans le dépôt — 0 média, aucune fiche
     * Pikota en base. Les trois entrées sont donc des emplacements, et le
     * brief est clair : mieux vaut deux projets réels que trois inventés.
     */
    projects: [
      {
        slot: 'Project 01',
        pending: 'Flagship project — name, disciplines, context and large visual to be supplied',
      },
      {
        slot: 'Project 02',
        pending: 'Second project — name, disciplines, context and visual to be supplied',
      },
      {
        slot: 'Project 03',
        pending: 'Third project — only if approved material exists',
      },
    ],
  },

  method: {
    label: '05 / HOW WE WORK',
    heading: ['A structured process.', 'Not a preset package.'],
    steps: [
      {
        number: '01',
        name: ['RESEARCH', '& BRIEFING'],
        body: 'Understand the context, objectives and indicators.',
      },
      {
        number: '02',
        name: ['DESIGN', '& VALIDATION'],
        body: 'Build the strategy, direction and system.',
      },
      {
        number: '03',
        name: ['EXECUTION'],
        body: 'Deploy, measure, improve.',
      },
    ],
  },

  evidence: {
    label: '06 / SELECTED EVIDENCE',
    heading: 'What strategy becomes when it reaches execution.',
    /**
     * Preuve qualitative uniquement. Le dépôt ne contient aucun résultat
     * chiffré vérifié, et un chiffre inventé vaut moins que rien.
     */
    categories: [
      {
        label: 'STRATEGY',
        body: 'Positioning, objectives and the indicators a team can actually follow.',
        pending: 'Approved strategic deliverable to be supplied',
      },
      {
        label: 'BRAND',
        body: 'Identity systems, messaging and the supports that carry them.',
        pending: 'Approved brand system or packaging artifact to be supplied',
      },
      {
        label: 'DIGITAL',
        body: 'Content, campaigns and channels coordinated around one objective.',
        pending: 'Approved campaign or content system to be supplied',
      },
      {
        label: 'TECHNOLOGY',
        body: 'Websites, automation and reporting built to be used, not admired.',
        pending: 'Approved website or automation artifact to be supplied',
      },
    ],
  },

  faq: {
    label: '07 / COMMON QUESTIONS',
    support: 'A few things clients usually want to know.',
    items: [
      {
        question: 'What kind of companies do you work with?',
        answer:
          'Companies with something real to grow — established brands, institutions and businesses building their market position. The engagement is shaped by the problem, not by a fixed package.',
      },
      {
        question: 'Do you work on strategy only?',
        answer:
          'Yes. A diagnostic, a positioning or a roadmap can be the whole engagement. Strategy that never reaches execution is still worth having when it clarifies where to act.',
      },
      {
        question: 'Can Global Comm handle execution as well?',
        answer:
          'Yes. Branding, content, digital marketing, web and automation can all be delivered by the same team that set the direction, which is what keeps the work coherent.',
      },
      {
        question: 'How does a project usually start?',
        answer:
          'With a conversation about the situation, not a brief. The first exchange establishes the context, the objective and whether we are the right partner for it.',
      },
      {
        question: 'Do you offer ongoing engagements?',
        answer:
          'Yes. Recurring engagements suit teams who need continuity across brand, content and campaigns. Scope, deliverables and reporting rhythm are defined at the start.',
      },
    ],
  },

  finalCTA: {
    heading: ['READY TO BUILD', 'WHAT COMES NEXT?'],
    action: { label: 'Tell us about your project', href: '/fr/contact' },
    support: 'Tell us where you are and what you want to improve. We will tell you what we would do first.',
  },

  footer: {
    wordmark: 'GLOBAL COMMUNICATION CORPORATE™',
    location: 'Rabat, Morocco',
    links: [
      { label: 'Work', href: '/fr/work' },
      { label: 'Services', href: '/fr/services' },
      { label: 'Company', href: '/fr/company' },
      { label: 'Contact', href: '/fr/contact' },
    ],
    locales: [
      { label: 'FR', href: '/fr' },
      { label: 'EN', href: '/en' },
      { label: 'ES', href: '/es' },
    ],
    external: { label: 'LinkedIn', pending: 'Official LinkedIn URL to be supplied' },
    copyright: '© 2026 Global Communication Corporate™',
    legal: [
      { label: 'Privacy', href: '/fr/contact' },
      { label: 'Legal', href: '/fr/contact' },
    ],
  },
} as const
