/**
 * Controlled vocabulary and initial page copy for seeding (CLAUDE.md §126).
 * Only structural vocabulary and Global Comm's own positioning copy live
 * here — never fabricated clients, testimonials, results or awards.
 */

export type Localized = { fr: string; en: string; es: string }

export type ServiceSeed = {
  key: string
  name: Localized
  children?: ServiceSeed[]
}

export const serviceTree: ServiceSeed[] = [
  {
    key: 'strategy',
    name: { fr: 'Stratégie', en: 'Strategy', es: 'Estrategia' },
    children: [
      { key: 'audit-diagnostic', name: { fr: 'Audit & Diagnostic', en: 'Audit & Diagnostic', es: 'Auditoría y Diagnóstico' } },
      { key: 'brand-strategy', name: { fr: 'Stratégie de marque', en: 'Brand Strategy', es: 'Estrategia de marca' } },
      {
        key: 'communication-strategy',
        name: { fr: 'Stratégie de communication', en: 'Communication Strategy', es: 'Estrategia de comunicación' },
      },
      { key: 'marketing-strategy', name: { fr: 'Stratégie marketing', en: 'Marketing Strategy', es: 'Estrategia de marketing' } },
    ],
  },
  {
    key: 'branding',
    name: { fr: 'Branding', en: 'Branding', es: 'Branding' },
    children: [
      { key: 'brand-identity', name: { fr: 'Identité de marque', en: 'Brand Identity', es: 'Identidad de marca' } },
      { key: 'rebranding', name: { fr: 'Refonte de marque', en: 'Rebranding', es: 'Rebranding' } },
      { key: 'visual-identity', name: { fr: 'Identité visuelle', en: 'Visual Identity', es: 'Identidad visual' } },
      { key: 'brand-guidelines', name: { fr: 'Charte de marque', en: 'Brand Guidelines', es: 'Manual de marca' } },
      { key: 'packaging', name: { fr: 'Packaging', en: 'Packaging', es: 'Packaging' } },
    ],
  },
  {
    key: 'creative-content',
    name: { fr: 'Création & Contenu', en: 'Creative & Content', es: 'Creatividad y Contenido' },
    children: [
      { key: 'creative-campaigns', name: { fr: 'Campagnes créatives', en: 'Creative Campaigns', es: 'Campañas creativas' } },
      { key: 'content-creation', name: { fr: 'Création de contenu', en: 'Content Creation', es: 'Creación de contenido' } },
      { key: 'video-production', name: { fr: 'Production vidéo', en: 'Video Production', es: 'Producción de vídeo' } },
      { key: 'photography', name: { fr: 'Photographie', en: 'Photography', es: 'Fotografía' } },
      { key: 'motion-design', name: { fr: 'Motion design', en: 'Motion Design', es: 'Motion design' } },
      { key: 'copywriting', name: { fr: 'Rédaction', en: 'Copywriting', es: 'Redacción' } },
    ],
  },
  {
    key: 'digital-marketing',
    name: { fr: 'Marketing digital', en: 'Digital Marketing', es: 'Marketing digital' },
    children: [
      { key: 'social-media', name: { fr: 'Réseaux sociaux', en: 'Social Media', es: 'Redes sociales' } },
      { key: 'paid-media', name: { fr: 'Médias payants', en: 'Paid Media', es: 'Medios pagados' } },
      { key: 'seo', name: { fr: 'SEO', en: 'SEO', es: 'SEO' } },
      { key: 'content-marketing', name: { fr: 'Marketing de contenu', en: 'Content Marketing', es: 'Marketing de contenidos' } },
      { key: 'lead-generation', name: { fr: 'Génération de leads', en: 'Lead Generation', es: 'Generación de leads' } },
      { key: 'email-marketing', name: { fr: 'Email marketing', en: 'Email Marketing', es: 'Email marketing' } },
      {
        key: 'conversion-optimization',
        name: { fr: 'Optimisation de la conversion', en: 'Conversion Optimization', es: 'Optimización de conversión' },
      },
    ],
  },
  {
    key: 'web-technology',
    name: { fr: 'Web & Technologie', en: 'Web & Technology', es: 'Web y Tecnología' },
    children: [
      { key: 'corporate-websites', name: { fr: "Sites corporate", en: 'Corporate Websites', es: 'Sitios corporativos' } },
      { key: 'landing-pages', name: { fr: "Landing pages", en: 'Landing Pages', es: 'Landing pages' } },
      { key: 'ecommerce', name: { fr: 'E-commerce', en: 'E-commerce', es: 'E-commerce' } },
      { key: 'crm', name: { fr: 'CRM', en: 'CRM', es: 'CRM' } },
      { key: 'marketing-automation', name: { fr: 'Automatisation marketing', en: 'Marketing Automation', es: 'Automatización de marketing' } },
      { key: 'ai-solutions', name: { fr: 'Solutions IA', en: 'AI Solutions', es: 'Soluciones de IA' } },
      { key: 'analytics-reporting', name: { fr: 'Analytics & Reporting', en: 'Analytics & Reporting', es: 'Analítica e informes' } },
    ],
  },
]

export const industrySeeds: { key: string; name: Localized }[] = [
  { key: 'fmcg', name: { fr: 'Grande consommation', en: 'FMCG', es: 'Gran consumo' } },
  { key: 'food-beverage', name: { fr: 'Agroalimentaire', en: 'Food & Beverage', es: 'Alimentación y bebidas' } },
  { key: 'retail', name: { fr: 'Retail', en: 'Retail', es: 'Retail' } },
  { key: 'public-sector', name: { fr: 'Secteur public', en: 'Public Sector', es: 'Sector público' } },
  { key: 'institutional', name: { fr: 'Institutionnel', en: 'Institutional', es: 'Institucional' } },
  { key: 'ngo-nonprofit', name: { fr: 'ONG & Associations', en: 'NGO & Nonprofit', es: 'ONG y sin ánimo de lucro' } },
  {
    key: 'culture-creative',
    name: { fr: 'Culture & Industries créatives', en: 'Culture & Creative Industries', es: 'Cultura e industrias creativas' },
  },
  { key: 'human-development', name: { fr: 'Développement humain', en: 'Human Development', es: 'Desarrollo humano' } },
  { key: 'healthcare', name: { fr: 'Santé', en: 'Healthcare', es: 'Salud' } },
  { key: 'education', name: { fr: 'Éducation', en: 'Education', es: 'Educación' } },
  { key: 'hospitality', name: { fr: 'Hôtellerie', en: 'Hospitality', es: 'Hostelería' } },
  { key: 'real-estate', name: { fr: 'Immobilier', en: 'Real Estate', es: 'Inmobiliario' } },
  {
    key: 'professional-services',
    name: { fr: 'Services professionnels', en: 'Professional Services', es: 'Servicios profesionales' },
  },
]

export const projectTypeSeeds: { key: string; name: Localized }[] = [
  { key: 'brand-system', name: { fr: 'Système de marque', en: 'Brand System', es: 'Sistema de marca' } },
  { key: 'integrated-campaign', name: { fr: 'Campagne intégrée', en: 'Integrated Campaign', es: 'Campaña integrada' } },
  { key: 'content-production', name: { fr: 'Production de contenu', en: 'Content Production', es: 'Producción de contenido' } },
  { key: 'digital-experience', name: { fr: 'Expérience digitale', en: 'Digital Experience', es: 'Experiencia digital' } },
  { key: 'social-media-program', name: { fr: 'Programme social media', en: 'Social Media Program', es: 'Programa de redes sociales' } },
  {
    key: 'growth-performance-program',
    name: { fr: 'Programme growth / performance', en: 'Growth / Performance Program', es: 'Programa de growth / performance' },
  },
  {
    key: 'institutional-communication-program',
    name: {
      fr: 'Programme de communication institutionnelle',
      en: 'Institutional Communication Program',
      es: 'Programa de comunicación institucional',
    },
  },
  { key: 'website-platform', name: { fr: 'Site / Plateforme', en: 'Website / Platform', es: 'Sitio / Plataforma' } },
  { key: 'ecommerce-experience', name: { fr: 'Expérience e-commerce', en: 'E-commerce Experience', es: 'Experiencia e-commerce' } },
  {
    key: 'automation-implementation',
    name: { fr: "Implémentation d'automatisation", en: 'Automation Implementation', es: 'Implementación de automatización' },
  },
]

export const contextTagSeeds: { key: string; name: Localized }[] = [
  { key: 'b2b', name: { fr: 'B2B', en: 'B2B', es: 'B2B' } },
  { key: 'b2c', name: { fr: 'B2C', en: 'B2C', es: 'B2C' } },
  { key: 'b2b2c', name: { fr: 'B2B2C', en: 'B2B2C', es: 'B2B2C' } },
  { key: 'launch', name: { fr: 'Lancement', en: 'Launch', es: 'Lanzamiento' } },
  { key: 'awareness', name: { fr: 'Notoriété', en: 'Awareness', es: 'Notoriedad' } },
  { key: 'growth', name: { fr: 'Croissance', en: 'Growth', es: 'Crecimiento' } },
  { key: 'conversion', name: { fr: 'Conversion', en: 'Conversion', es: 'Conversión' } },
  { key: 'engagement', name: { fr: 'Engagement', en: 'Engagement', es: 'Engagement' } },
  { key: 'acquisition', name: { fr: 'Acquisition', en: 'Acquisition', es: 'Adquisición' } },
  { key: 'retention', name: { fr: 'Fidélisation', en: 'Retention', es: 'Retención' } },
  { key: 'corporate', name: { fr: 'Corporate', en: 'Corporate', es: 'Corporate' } },
  { key: 'always-on', name: { fr: 'Always-on', en: 'Always-on', es: 'Always-on' } },
  { key: 'transformation', name: { fr: 'Transformation', en: 'Transformation', es: 'Transformación' } },
  { key: 'market-entry', name: { fr: 'Entrée sur le marché', en: 'Market Entry', es: 'Entrada al mercado' } },
  { key: 'product-launch', name: { fr: 'Lancement produit', en: 'Product Launch', es: 'Lanzamiento de producto' } },
  { key: 'repositioning', name: { fr: 'Repositionnement', en: 'Repositioning', es: 'Reposicionamiento' } },
]

/** CLAUDE.md §74 — initial hero direction, refined later by editors in Payload. */
export const homeCopy = {
  heroEyebrow: {
    fr: 'GLOBAL COMMUNICATION CORPORATE™',
    en: 'GLOBAL COMMUNICATION CORPORATE™',
    es: 'GLOBAL COMMUNICATION CORPORATE™',
  },
  heroHeading: {
    fr: 'Stratégie. Création. Croissance.',
    en: 'Strategy. Creative. Growth.',
    es: 'Estrategia. Creatividad. Crecimiento.',
  },
  heroBody: {
    fr: "Communication et marketing intégrés pour les organisations qui ont besoin de marques, de campagnes et de systèmes de croissance digitale plus solides.",
    en: 'Integrated communication and marketing for organizations that need stronger brands, campaigns and digital growth systems.',
    es: 'Comunicación y marketing integrados para organizaciones que necesitan marcas, campañas y sistemas de crecimiento digital más sólidos.',
  },
  primaryCTA: {
    label: { fr: 'Voir nos réalisations', en: 'View our work', es: 'Ver nuestro trabajo' },
    url: '/work',
  },
  secondaryCTA: {
    label: { fr: 'Démarrer un projet', en: 'Start a project', es: 'Iniciar un proyecto' },
    url: '/contact',
  },
  methodHeading: { fr: 'Notre méthode', en: 'Our method', es: 'Nuestro método' },
  methodIntro: {
    fr: 'Comprendre → Diagnostiquer → Élaborer la stratégie → Créer → Exécuter → Mesurer → Optimiser.',
    en: 'Understand → Diagnose → Strategize → Create → Execute → Measure → Optimize.',
    es: 'Comprender → Diagnosticar → Definir la estrategia → Crear → Ejecutar → Medir → Optimizar.',
  },
  closingCTA: {
    label: { fr: 'Parlons de votre projet', en: "Let's talk about your project", es: 'Hablemos de su proyecto' },
    url: '/contact',
  },
}

export const pageCopy = {
  services: {
    eyebrow: { fr: 'Services', en: 'Services', es: 'Servicios' },
    heading: {
      fr: 'Cinq domaines d\u2019expertise, un système intégré',
      en: 'Five capability areas, one integrated system',
      es: 'Cinco áreas de especialidad, un sistema integrado',
    },
    intro: {
      fr: 'De la stratégie à l\u2019exécution, nos expertises s\u2019articulent autour des besoins réels de nos clients.',
      en: 'From strategy to execution, our capabilities are organized around real client needs.',
      es: 'De la estrategia a la ejecución, nuestras capacidades se organizan en torno a necesidades reales de los clientes.',
    },
  },
  work: {
    eyebrow: { fr: 'Réalisations', en: 'Work', es: 'Trabajo' },
    heading: { fr: 'Des projets, des preuves', en: 'Projects and proof', es: 'Proyectos y evidencias' },
    intro: {
      fr: 'Une sélection de projets menés pour des organisations de secteurs variés.',
      en: 'A selection of projects delivered for organizations across sectors.',
      es: 'Una selección de proyectos realizados para organizaciones de distintos sectores.',
    },
  },
  company: {
    eyebrow: { fr: 'Entreprise', en: 'Company', es: 'Empresa' },
    heading: {
      fr: 'Agence de communication et de marketing intégrés',
      en: 'Integrated communication and marketing agency',
      es: 'Agencia de comunicación y marketing integrados',
    },
    intro: {
      fr: 'Nous accompagnons les organisations dans la construction de marques et de systèmes de croissance durables.',
      en: 'We help organizations build brands and growth systems that last.',
      es: 'Ayudamos a las organizaciones a construir marcas y sistemas de crecimiento duraderos.',
    },
  },
  contact: {
    eyebrow: { fr: 'Contact', en: 'Contact', es: 'Contacto' },
    heading: { fr: 'Démarrer un projet', en: 'Start a project', es: 'Iniciar un proyecto' },
    intro: {
      fr: 'Décrivez votre besoin. Nous revenons vers vous avec une première lecture stratégique.',
      en: 'Tell us what you need. We come back with a first strategic read.',
      es: 'Cuéntenos qué necesita. Volvemos con una primera lectura estratégica.',
    },
    formIntro: {
      fr: 'Les champs marqués d\u2019un astérisque sont obligatoires.',
      en: 'Fields marked with an asterisk are required.',
      es: 'Los campos marcados con asterisco son obligatorios.',
    },
  },
}

export const navigationSeed = {
  primary: [
    { label: { fr: 'Services', en: 'Services', es: 'Servicios' }, url: '/services' },
    { label: { fr: 'Réalisations', en: 'Work', es: 'Trabajo' }, url: '/work' },
    { label: { fr: 'Entreprise', en: 'Company', es: 'Empresa' }, url: '/company' },
    { label: { fr: 'Contact', en: 'Contact', es: 'Contacto' }, url: '/contact' },
  ],
  footer: [
    { label: { fr: 'Services', en: 'Services', es: 'Servicios' }, url: '/services' },
    { label: { fr: 'Réalisations', en: 'Work', es: 'Trabajo' }, url: '/work' },
    { label: { fr: 'Entreprise', en: 'Company', es: 'Empresa' }, url: '/company' },
    { label: { fr: 'Contact', en: 'Contact', es: 'Contacto' }, url: '/contact' },
  ],
  legal: [],
}
