/**
 * Company page copy — source-owned.
 *
 * Migrated from the Payload `company-page` global (French). The three long
 * sections were Lexical rich text there; they are modelled here as explicit
 * blocks and runs rather than as stored Lexical JSON, so the copy stays
 * readable, diffable and translatable. The rendered output is the same
 * headings and paragraphs, with the same words emphasised.
 */
export type TextRun = { text: string; strong?: true }

export type ProseBlock =
  | { kind: 'h2'; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'p'; runs: readonly TextRun[] }

const p = (...runs: TextRun[]): ProseBlock => ({ kind: 'p', runs })
const t = (text: string): TextRun => ({ text })
const b = (text: string): TextRun => ({ text, strong: true })

export const companyContent = {
  eyebrow: 'À propos de Global Communication Corporate ™',
  heading:
    'Une entreprise intégrée de communication et de marketing, construite autour de la stratégie, de la créativité, des médias et de la technologie.',
  intro: [
    'Global Communication Corporate™ accompagne les entreprises et les organisations dans leur manière de comprendre leur marché, de se positionner, de communiquer et de développer leurs capacités marketing.',
    'Notre intervention peut commencer par la recherche et le diagnostic, se poursuivre par le développement de la marque et de la création, puis s’étendre au marketing digital, aux plateformes web, à l’automatisation et à la technologie.',
    'Les disciplines sont différentes. La direction stratégique reste connectée.',
  ],

  whoWeAre: [
    p(t('Global Comm opère à l’intersection du '), b('conseil et de l’exécution'), t('.')),
    p(
      t(
        'Nous pensons que la communication et le marketing fonctionnent mieux lorsque les personnes qui définissent la direction restent connectées à celles qui sont responsables de sa mise en œuvre.',
      ),
    ),
    p(
      t(
        'Plutôt que de traiter la stratégie, le branding, le contenu, les médias et la technologie comme des services indépendants, nous les considérons comme les composantes d’un système marketing plus large.',
      ),
    ),
    p(
      t(
        'L’objectif n’est pas de mobiliser toutes nos expertises sur chaque projet. Il s’agit d’abord de comprendre le problème, puis de déterminer quelles capacités sont réellement pertinentes pour y répondre.',
      ),
    ),
    { kind: 'h2', text: 'Pôles spécialisés' },
    p(t('Global Comm développe ses capacités à travers quatre pôles spécialisés.')),
    { kind: 'h3', text: 'Advisory Bureau' },
    p(
      t(
        'Recherche, audit, compréhension du marché, positionnement, stratégie de communication et orientation marketing.',
      ),
    ),
    { kind: 'h3', text: 'Creative House' },
    p(
      t(
        'Stratégie de marque, systèmes d’identité, rebranding, identité visuelle, direction créative, campagnes et production de contenu.',
      ),
    ),
    { kind: 'h3', text: 'Media Bureau' },
    p(
      t(
        'Réseaux sociaux, média payant, SEO, content marketing, génération de leads, email marketing et optimisation de la conversion.',
      ),
    ),
    { kind: 'h3', text: 'AI Solutions' },
    p(
      t(
        'Sites web, plateformes digitales, CRM, automatisation, solutions d’intelligence artificielle, analytics et reporting.',
      ),
    ),
    p(
      t(
        'Ces pôles peuvent intervenir indépendamment ou collaborer dans le cadre d’un accompagnement plus large.',
      ),
    ),
    p(b('Le principe est simple : la spécialisation sans fragmentation.')),
  ] as readonly ProseBlock[],

  whatWeBelieve: [
    {
      kind: 'h2',
      text: 'Le partenaire marketing stratégique entre l’agence traditionnelle et le cabinet de conseil.',
    },
    p(
      t(
        'Global Comm est conçu pour les entreprises et organisations ambitieuses dont le marketing est devenu trop important pour rester fragmenté, improvisé ou déconnecté des décisions business.',
      ),
    ),
    p(
      t(
        'Nous combinons la réflexion stratégique généralement attendue d’un cabinet de conseil avec les capacités créatives, média et technologiques nécessaires pour transformer cette réflexion en actions concrètes.',
      ),
    ),
    p(
      t('Là où les agences traditionnelles commencent souvent par l’exécution, '),
      b('nous commençons par comprendre.'),
    ),
    p(
      t('Là où le conseil s’arrête souvent aux recommandations, '),
      b('nous restons connectés à leur mise en œuvre.'),
    ),
    p(
      t('Là où des prestataires spécialisés ne résolvent qu’une partie du problème, '),
      b('nous connectons les disciplines autour d’une même direction.'),
    ),
    p(t('Notre position n’est donc pas d’être l’agence qui fait tout.')),
    p(
      t('Elle est d’être le partenaire capable de comprendre '),
      b('ce qui doit réellement être fait, pourquoi cela compte et quels spécialistes doivent intervenir.'),
    ),
    { kind: 'h2', text: 'Notre promesse' },
    p(
      b(
        'Rendre les entreprises ambitieuses plus difficiles à ignorer, plus faciles à choisir et mieux équipées pour grandir.',
      ),
    ),
    p(
      b('Plus difficiles à ignorer'),
      t(' grâce à un positionnement plus fort, des marques distinctives et une communication créative.'),
    ),
    p(
      b('Plus faciles à choisir'),
      t(
        ' grâce à une proposition de valeur plus claire, une confiance renforcée et de meilleures expériences clients.',
      ),
    ),
    p(
      b('Mieux équipées pour grandir'),
      t(
        ' grâce à un marketing, des médias, des technologies et des systèmes mesurables mieux connectés.',
      ),
    ),
  ] as readonly ProseBlock[],

  howWeWork: [
    p(
      t(
        'Notre méthode maintient un lien continu entre la stratégie et l’exécution à travers les différents pôles de Global Comm.',
      ),
    ),
    { kind: 'h2', text: '01 — Comprendre' },
    p(t('Nous commençons par l’entreprise, son marché, ses objectifs et ses contraintes.')),
    { kind: 'h2', text: '02 — Diagnostiquer' },
    p(t('Nous analysons la situation existante avant de recommander une intervention.')),
    { kind: 'h2', text: '03 — Définir la stratégie' },
    p(t('Nous définissons les priorités, les audiences, le positionnement et la direction à suivre.')),
    { kind: 'h2', text: '04 — Créer' },
    p(t('La stratégie est traduite en marque, communication, contenu et expériences digitales.')),
    { kind: 'h2', text: '05 — Exécuter' },
    p(t('Le travail est déployé sur les canaux et systèmes pertinents.')),
  ] as readonly ProseBlock[],

  closingCTA: { label: 'Contacter Global Comm', url: '/contact' },

  meta: {
    title: 'Entreprise — Global Comm',
    description:
      'Global Communication Corporate™ accompagne les entreprises et les organisations dans leur manière de comprendre leur marché, de se positionner, de communiquer et de développer leurs capacités marketing.',
  },
} as const
