/**
 * Contenu de la Home V5.1 — maquette frontend isolée.
 *
 * Copie fournie mot pour mot par le brief. Aucun client, chiffre, partenariat,
 * témoignage ni visuel n'est inventé — et rien n'est signalé comme manquant à
 * l'écran non plus : ce qui n'existe pas est retiré de la composition, pas
 * rendu sous forme de cadre vide.
 *
 * La section Expertises n'est pas ici : elle est figée et lit son propre
 * contenu depuis `homeHalbert.ts`.
 */

export const homeV5 = {
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

  /**
   * Rail de logos retiré, pas masqué par du vide : aucun logo client approuvé
   * n'existe dans le dépôt, et une rangée de cadres vides coûte plus de
   * crédibilité qu'elle n'en apporte. La confiance repose ici sur du contenu
   * vrai — le périmètre d'intervention, énoncé sans chiffre inventé.
   */
  credibility: {
    label: 'HOW WE WORK WITH CLIENTS',
    items: [
      { term: 'ENGAGEMENT', detail: 'Project-based or ongoing, defined before we start.' },
      { term: 'SCOPE', detail: 'Objectives, deliverables and validation points in writing.' },
      { term: 'DISCIPLINES', detail: 'Strategy, brand, digital and technology under one team.' },
    ],
  },

  /**
   * Compétence opérationnelle, jamais un partenariat officiel ni une
   * certification : les capacités listées sont génériques et vraies.
   */
  platforms: {
    label: 'PLATFORM EXPERTISE',
    support: 'Built across the platforms your customers already use',
    items: [
      {
        key: 'google',
        name: 'GOOGLE',
        capabilities: ['SEARCH', 'PAID MEDIA', 'ANALYTICS', 'SEO'],
        body: 'Intent-driven demand: what people already search for, captured and measured.',
      },
      {
        key: 'meta',
        name: 'META',
        capabilities: ['SOCIAL', 'PAID MEDIA', 'RETARGETING', 'CONTENT'],
        body: 'Audience building and creative iteration at the scale the platform rewards.',
      },
      {
        key: 'tiktok',
        name: 'TIKTOK',
        capabilities: ['CONTENT', 'PAID MEDIA', 'CREATIVE TESTING'],
        body: 'Native creative produced to be tested, not adapted from a campaign film.',
      },
      {
        key: 'linkedin',
        name: 'LINKEDIN',
        capabilities: ['B2B CONTENT', 'LEAD GENERATION', 'PAID MEDIA'],
        body: 'Positioning and lead capture for considered, long-cycle purchases.',
      },
    ],
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
    intro:
      'Every engagement starts from a business problem and ends in something a team can run. These are the systems we build.',
    viewAll: { label: 'View all work', href: '/fr/work' },
    /**
     * Disciplines, pas études de cas : aucun projet approuvé n'existe dans le
     * dépôt. Chaque entrée décrit ce que la discipline produit réellement, et
     * ne revendique ni client, ni année, ni résultat.
     */
    disciplines: [
      {
        key: 'brand',
        index: '01',
        name: 'Brand systems',
        disciplines: 'POSITIONING · IDENTITY · PACKAGING',
        body: 'A position, a visual language and the rules that keep it consistent once a dozen people start using it.',
      },
      {
        key: 'campaign',
        index: '02',
        name: 'Digital campaigns',
        disciplines: 'CONTENT · PAID MEDIA · CONVERSION',
        body: 'Channels coordinated around one objective, with creative built to be tested rather than admired.',
      },
      {
        key: 'technology',
        index: '03',
        name: 'Technology platforms',
        disciplines: 'WEB · AUTOMATION · REPORTING',
        body: 'Sites, workflows and reporting that a team can operate without calling an agency every week.',
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
        deliverable: 'Diagnostic & roadmap',
        body: 'Where the business actually loses ground, which levers matter, and the order to pull them in.',
      },
      {
        label: 'BRAND',
        deliverable: 'Identity system',
        body: 'Positioning turned into a visual and verbal language, with the rules that keep it intact.',
      },
      {
        label: 'DIGITAL',
        deliverable: 'Campaign & content system',
        body: 'A production rhythm and a media plan built around one objective, not four disconnected ones.',
      },
      {
        label: 'TECHNOLOGY',
        deliverable: 'Platform & automation',
        body: 'The site, the workflows and the reporting that let the team run the work themselves.',
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
    copyright: '© 2026 Global Communication Corporate™',
    legal: [
      { label: 'Privacy', href: '/fr/contact' },
      { label: 'Legal', href: '/fr/contact' },
    ],
  },
} as const
