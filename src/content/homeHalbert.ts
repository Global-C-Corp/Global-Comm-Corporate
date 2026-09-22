/**
 * Contenu éditorial Halbert V1 de la page d'accueil — maquette frontend.
 *
 * Objet local dédié à la prévisualisation `/design/home`. Il ne remplace
 * aucune connexion Payload : la Home de production continue de lire ses
 * globals. Rien ici n'est destiné au CMS en l'état.
 *
 * Le texte est repris mot pour mot du document source. Les seules entrées qui
 * ne sont pas du copywriting sont les marqueurs `pending`, qui signalent à
 * l'écran un élément que Global Comm doit fournir ou valider avant
 * publication. Aucun client, chiffre, témoignage ni visuel n'est inventé.
 *
 * L'orientation interne du document source reste interne : elle n'apparaît
 * nulle part dans le rendu.
 */

/**
 * Le document source porte la mention « Décision à valider » sur le tarif de
 * 10 000 MAD par mois, et la règle de publication demande de confirmer son
 * affichage public. Il reste donc masqué : le texte exact est conservé
 * ci-dessous et s'affiche dès que ce drapeau passe à `true`.
 */
export const PRICING_PUBLICLY_VALIDATED = false

/** Élément absent du document : rendu comme emplacement visible, jamais inventé. */
export type Pending = { readonly pending: string }

export type NavItem = { readonly label: string; readonly href: string }

export const homeHalbert = {
  meta: {
    /** Destinations réelles du site. « Notre approche » est une section de la Home. */
    nav: [
      { label: 'Expertises', href: '/fr/services' },
      { label: 'Réalisations', href: '/fr/work' },
      { label: 'Notre approche', href: '#approche' },
      { label: "L'agence", href: '/fr/company' },
      { label: 'Contact', href: '/fr/contact' },
    ] as readonly NavItem[],
    locales: ['FR', 'EN', 'ES'] as const,
    headerCTA: { label: 'Parlons de votre projet', href: '/fr/contact' },
  },

  hero: {
    kicker: 'AGENCE DE COMMUNICATION ET MARKETING — MAROC',
    title: "Votre communication n'a pas besoin de plus d'actions. Elle a besoin d'une direction.",
    body: [
      'Global Comm aide les PME et les marques de grande consommation à clarifier leurs priorités, renforcer leur marque et coordonner leur marketing.',
      'Recherche, stratégie, création, digital et automatisation avancent dans un même plan. Vous savez ce qui sera fait, dans quel ordre et comment le travail sera suivi.',
    ],
    primaryCTA: { label: 'Parlons de votre projet', href: '/fr/contact' },
    secondaryCTA: { label: 'Voir nos réalisations', href: '/fr/work' },
    reassurance: "Premier échange de 20 minutes. Aucun brief finalisé n'est nécessaire.",
    proofLabel: 'RÉFÉRENCES SÉLECTIONNÉES',
    logos: {
      pending: 'Logos clients — à fournir avec autorisation de publication',
    } satisfies Pending,
    visual: {
      pending:
        "Photographie réelle — session de découverte, atelier stratégique ou présentation client",
    } satisfies Pending,
    overlay: {
      label: 'UN CAP PARTAGE',
      items: ['Objectifs clarifiés', 'Priorités définies', 'Plan validé'],
    },
  },

  positioning: {
    kicker: 'AVANT DE PRODUIRE',
    title: "Une campagne, un site et des contenus ne forment pas une stratégie à eux seuls.",
    body: [
      'Vous pouvez avoir des idées, des outils et plusieurs prestataires.',
      "Si chaque action avance seule, votre équipe consomme du temps sans toujours savoir ce qui sert vraiment l'objectif.",
      "Global Comm commence donc par votre situation. Nous clarifions l'enjeu, choisissons les leviers utiles puis coordonnons leur mise en œuvre.",
    ],
    principles: [
      {
        title: "Voir clair avant d'agir",
        body: 'Nous examinons le marché, les actions déjà menées, les ressources disponibles et les objectifs à atteindre.',
      },
      {
        title: 'Choisir ce qui compte',
        body: 'Nous transformons les constats en priorités pour concentrer le budget sur les actions les plus utiles.',
      },
      {
        title: 'Garder le même cap',
        body: 'Votre marque, vos contenus, vos campagnes et vos outils servent une direction commune.',
      },
      {
        title: 'Suivre ce qui avance',
        body: 'Vous connaissez les livrables, les validations attendues et les indicateurs retenus pour la mission.',
      },
    ],
  },

  expertise: {
    kicker: 'QUATRE EXPERTISES. UN PROJET COORDONNÉ.',
    title: 'Mobilisez les compétences utiles sans multiplier les interlocuteurs.',
    body: [
      "Global Comm n'impose pas les quatre expertises à chaque client.",
      "Le périmètre dépend du problème, des priorités et des ressources déjà présentes dans votre entreprise.",
    ],
    scopeLabel: 'Le périmètre peut inclure',
    outcomeLabel: 'Ce que vous recevez',
    items: [
      {
        number: '01',
        name: 'Recherche, audit et stratégie',
        promise: "Sachez où agir avant d'engager vos ressources.",
        body: 'Nous étudions votre situation, votre marché et vos objectifs pour faire ressortir les décisions prioritaires.',
        scope: [
          'recherche et session de découverte',
          'audit de communication et de marketing',
          'analyse du marché et de la concurrence',
          'positionnement, objectifs et indicateurs',
          'feuille de route stratégique',
        ],
        outcome: 'Une lecture claire de la situation, des priorités et un plan pour avancer.',
        cta: { label: 'Découvrir Recherche et stratégie', href: '/fr/services' },
      },
      {
        number: '02',
        name: 'Branding et communication',
        promise: 'Faites reconnaître votre marque à chaque point de contact.',
        body: 'Nous déclinons le positionnement retenu en messages, en identité et en supports cohérents.',
        scope: [
          'stratégie et plateforme de marque',
          'identité visuelle et système graphique',
          'messages et direction artistique',
          'communication corporate et campagnes',
          'supports digitaux, imprimés ou packaging',
        ],
        outcome: 'Une marque claire, reconnaissable et plus simple à déployer.',
        cta: { label: 'Découvrir Branding et communication', href: '/fr/services' },
      },
      {
        number: '03',
        name: 'Marketing digital',
        promise: 'Transformez la stratégie en actions que votre équipe peut suivre.',
        body: 'Nous coordonnons les canaux digitaux autour d’objectifs définis avec votre équipe.',
        scope: [
          'contenus et réseaux sociaux',
          'publicité sur les plateformes adaptées',
          'SEO, landing pages et email marketing',
          'mesure, tests et optimisation',
          'tableau de bord et reporting',
        ],
        outcome: 'Des campagnes coordonnées, des responsabilités claires et un suivi régulier.',
        cta: { label: 'Découvrir Marketing digital', href: '/fr/services' },
      },
      {
        number: '04',
        name: 'Automatisation et IA',
        promise: 'Réduisez les tâches manuelles qui ralentissent votre équipe.',
        body: 'Nous repérons les étapes répétitives puis concevons les outils et les flux adaptés à votre fonctionnement.',
        scope: [
          'sites web et CMS',
          'automatisation marketing et CRM',
          'intégration de vos outils',
          'assistants et fonctions basées sur l’IA',
          'reporting automatisé',
        ],
        outcome: 'Un système plus fluide, documenté et utilisable par votre équipe.',
        cta: { label: 'Découvrir Automatisation et IA', href: '/fr/services' },
      },
    ],
    sectionCTA: { label: 'Explorer toutes nos expertises', href: '/fr/services' },
  },

  work: {
    kicker: 'NOS RÉALISATIONS',
    title: "Jugez notre travail sur le problème traité, pas seulement sur l'image finale.",
    body: [
      'Une belle exécution montre ce qui a été produit.',
      "Une étude de cas utile montre aussi le point de départ, les décisions prises, le rôle exact de Global Comm et les résultats disponibles.",
      'Vous pouvez ainsi évaluer notre façon de réfléchir autant que notre façon de produire.',
    ],
    /**
     * Le document source ne nomme aucun projet : ses trois cartes sont des
     * gabarits entre crochets. Elles restent donc des emplacements.
     */
    projects: [
      { pending: 'Projet 01 — nom, secteur, expertise, année, contribution et visuel à fournir' },
      { pending: 'Projet 02 — nom, secteur, expertise, année, contribution et visuel à fournir' },
      { pending: 'Projet 03 — nom, secteur, expertise, année, contribution et visuel à fournir' },
    ] as readonly Pending[],
    itemCTALabel: "Voir l'étude de cas",
    sectionCTA: { label: 'Voir toutes nos réalisations', href: '/fr/work' },
  },

  approach: {
    kicker: 'TROIS ÉTAPES. UN CADRE LISIBLE.',
    title: "Du premier briefing à la mise en œuvre.",
    body: ['Vous connaissez le point de départ, la prochaine validation et le résultat attendu à chaque étape.'],
    resultLabel: "Résultat de l'étape",
    steps: [
      {
        number: '01',
        name: 'Session de recherche, de découverte et briefing',
        promise: 'Mettre le vrai enjeu au clair.',
        body: [
          "Nous échangeons avec votre équipe pour comprendre l'entreprise, le marché, les clients, les contraintes et les actions déjà tentées.",
          "Cette étape permet de définir les axes d'amélioration, de prioriser les objectifs et de choisir les indicateurs utiles.",
        ],
        result: 'Un brief partagé, des priorités claires et des critères de suivi.',
      },
      {
        number: '02',
        name: 'Conception des solutions, validation et plan de déploiement',
        promise: 'Choisir la bonne réponse avant de la produire.',
        body: [
          'À partir des constats, nous concevons la stratégie et les solutions concrètes.',
          'Votre équipe examine les orientations, partage ses retours puis valide le périmètre, les livrables et le plan de déploiement.',
        ],
        result: "Une stratégie validée et un plan d'action prêt à exécuter.",
      },
      {
        number: '03',
        name: 'Exécution',
        promise: 'Appliquer la stratégie partout où vos clients rencontrent votre marque.',
        body: [
          'Nous donnons forme à la direction retenue avec des contenus, des campagnes, des outils et des supports concrets.',
          "Selon le projet, l'exécution peut couvrir l'identité de marque, la communication, le digital, le site web, les réseaux sociaux et les supports imprimés.",
        ],
        result: 'Des actions déployées selon le périmètre validé et reliées au même objectif.',
      },
    ],
  },

  proof: {
    kicker: 'UN PÉRIMÈTRE QUE VOUS POUVEZ ÉVALUER',
    title: 'Vous savez ce que vous achetez avant le démarrage.',
    body: [
      "Une collaboration devient difficile lorsque le client ignore ce qui est inclus, qui décide et quand valider.",
      'Chaque proposition Global Comm doit donc préciser :',
    ],
    commitments: [
      'les objectifs et le périmètre',
      'les livrables et les responsabilités',
      'le calendrier et les points de validation',
      'les indicateurs adaptés à la mission',
      'le rythme de suivi et de reporting',
    ],
    evidence: {
      title: 'Des preuves, avec leur contexte',
      body: [
        "Nous ne publions pas un chiffre sans expliquer ce qu'il mesure.",
        'Nous ne présentons pas un projet sans préciser notre rôle.',
        'Les logos autorisés, les témoignages signés et les résultats documentés servent à vous donner une base concrète pour juger.',
      ],
      module: {
        pending: 'Témoignage approuvé ou résultat vérifié — citation, nom, fonction, entreprise et lien à fournir',
      } satisfies Pending,
    },
    pricing: {
      title: 'Cadre commercial recommandé',
      recurring: {
        label: 'Accompagnements récurrents',
        /** Affiché seulement si PRICING_PUBLICLY_VALIDATED est vrai. */
        text: 'À partir de 10 000 MAD par mois, avec un engagement initial de trois mois.',
        pending: "Tarif des accompagnements récurrents — affichage public à valider",
      },
      oneOff: {
        label: 'Missions ponctuelles',
        text: 'Un devis est établi après clarification du besoin, du périmètre et des livrables.',
      },
    },
  },

  faq: {
    kicker: 'AVANT DE NOUS CONTACTER',
    title: 'Les réponses qui vous aident à décider.',
    items: [
      {
        question: 'Global Comm travaille-t-elle avec une équipe marketing interne ?',
        lead: 'Oui.',
        answer: [
          "Global Comm peut compléter votre équipe, prendre en charge un périmètre précis ou coordonner plusieurs intervenants autour d'un même projet. Les responsabilités sont définies au démarrage.",
        ],
      },
      {
        question: 'Faut-il déjà avoir un brief complet ?',
        lead: 'Non.',
        answer: [
          "Vous pouvez commencer avec un objectif, une difficulté ou une situation à améliorer. Le premier échange sert à clarifier le point de départ.",
        ],
      },
      {
        question: 'Global Comm est-elle uniquement une agence de réseaux sociaux ?',
        lead: 'Non.',
        answer: [
          "Les réseaux sociaux sont un canal parmi d'autres. L'accompagnement peut couvrir la recherche, la stratégie, la marque, la communication, le marketing digital, le web et l'automatisation.",
        ],
      },
      {
        question: 'Quel budget faut-il prévoir ?',
        lead: null,
        /** La première phrase porte le tarif non validé : elle est filtrée à l'affichage. */
        answer: [
          'Les accompagnements récurrents commencent à 10 000 MAD par mois avec un engagement initial de trois mois.',
          'Les projets ponctuels font l’objet d’un devis adapté au périmètre validé.',
        ],
        pricedAnswerIndex: 0,
        pendingWithoutPrice: 'Montant de départ — affichage public à valider',
      },
      {
        question: 'Garantissez-vous un retour sur investissement ?',
        lead: 'Non.',
        answer: [
          "Aucune agence ne contrôle seule vos ventes, vos prix, votre distribution ou l'évolution de votre marché. Global Comm s'engage sur un périmètre, des livrables, des validations et un suivi définis avec votre équipe.",
          "Lorsque des résultats peuvent être mesurés, ils sont présentés avec leur contexte et sans exagération.",
        ],
      },
    ],
  },

  closing: {
    kicker: 'VOTRE PROCHAINE DÉCISION',
    title: 'Avant de lancer une nouvelle action, clarifions celle qui mérite votre budget.',
    body: [
      'Expliquez-nous où vous en êtes, ce qui bloque et ce que vous souhaitez améliorer.',
      "Le premier échange sert à comprendre votre situation, vérifier si Global Comm correspond à votre besoin et définir la prochaine étape utile.",
    ],
    primaryCTA: { label: 'Planifier un échange de 20 minutes', href: '/fr/contact' },
    secondaryCTA: { label: 'Envoyer votre brief', href: '/fr/contact' },
    reassurance: 'Aucun pitch à préparer. Votre contexte, votre objectif et votre échéance suffisent pour commencer.',
  },

  footer: {
    brand: 'Global Comm',
    description:
      'Une agence intégrée de communication et marketing qui relie recherche, stratégie, création, digital et automatisation autour d’objectifs clairs.',
    navLabel: 'Navigation',
    infoLabel: 'Informations',
    info: [
      { pending: 'Coordonnées professionnelles validées' },
      { pending: 'LinkedIn et Instagram officiels' },
    ] as readonly Pending[],
    legal: [
      { label: 'Mentions légales', href: '/fr/contact' },
      { label: 'Politique de confidentialité', href: '/fr/contact' },
    ] as readonly NavItem[],
    signature: 'Global Communication Corporate™',
  },
} as const
