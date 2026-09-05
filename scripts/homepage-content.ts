import type { Locale } from '../src/i18n/locale'

/**
 * Approved homepage copy (PAGE_D_ACCUEIL — GLOBAL COMM).
 *
 * French is the document verbatim; it is the source of record. English and
 * Spanish are translations of that same copy — no claim, metric, service or
 * proof point is added, removed or embellished in either (§65).
 *
 * Nothing here asserts a result, a client name or a testimonial. Those live in
 * their own collections and the page renders only what is actually published
 * (§105, §139).
 */

export type Localized = Record<Locale, string>
export type LocalizedList = Record<Locale, string[]>

const l = (fr: string, en: string, es: string): Localized => ({ fr, en, es })
const ll = (fr: string[], en: string[], es: string[]): LocalizedList => ({ fr, en, es })

export const heroCopy = {
  eyebrow: l('RÉFÉRENCES SÉLECTIONNÉES', 'SELECTED REFERENCES', 'REFERENCIAS SELECCIONADAS'),
  heading: l(
    "Votre communication n'a pas besoin de plus d'actions. Elle a besoin d'une direction.",
    'Your communication does not need more activity. It needs a direction.',
    'Su comunicación no necesita más acciones. Necesita una dirección.',
  ),
  body: l(
    "Global Comm aide les PME et les marques de produits de grande consommation au Maroc à clarifier leurs priorités, structurer leur marque et coordonner leur communication.\n\nVous savez quoi faire, pourquoi le faire et dans quel ordre avancer.",
    'Global Comm helps SMEs and consumer goods brands in Morocco clarify their priorities, structure their brand and coordinate their communication.\n\nYou know what to do, why to do it and in what order to move.',
    'Global Comm ayuda a las pymes y a las marcas de gran consumo en Marruecos a clarificar sus prioridades, estructurar su marca y coordinar su comunicación.\n\nUsted sabe qué hacer, por qué hacerlo y en qué orden avanzar.',
  ),
  primaryCTA: l('Parlons de votre projet', "Let's talk about your project", 'Hablemos de su proyecto'),
  secondaryCTA: l('Voir nos réalisations', 'See our work', 'Ver nuestros proyectos'),
  overlayLabel: l('UNE DIRECTION CLAIRE', 'A CLEAR DIRECTION', 'UNA DIRECCIÓN CLARA'),
  overlayItems: ll(
    ['Diagnostic', 'Priorités', "Plan d'action"],
    ['Diagnosis', 'Priorities', 'Action plan'],
    ['Diagnóstico', 'Prioridades', 'Plan de acción'],
  ),
}

export const positioningCopy = {
  kicker: l('COMMENCER AU BON ENDROIT', 'STARTING IN THE RIGHT PLACE', 'EMPEZAR EN EL LUGAR CORRECTO'),
  heading: l(
    'Produire plus ne corrige pas une mauvaise direction.',
    'Producing more does not correct a wrong direction.',
    'Producir más no corrige una dirección equivocada.',
  ),
  body: l(
    "Vous pouvez publier plus de contenus. Lancer plus de campagnes. Créer un nouveau site.\n\nMais si chaque action avance dans une direction différente, vos efforts se dispersent.\n\nVoilà pourquoi Global Comm commence par comprendre votre entreprise, votre marché et vos objectifs. Ensuite seulement, nous recommandons ce qui mérite votre temps et votre budget.",
    'You can publish more content. Launch more campaigns. Build a new website.\n\nBut if every action moves in a different direction, your efforts scatter.\n\nThat is why Global Comm starts by understanding your business, your market and your objectives. Only then do we recommend what deserves your time and your budget.',
    'Puede publicar más contenidos. Lanzar más campañas. Crear un nuevo sitio web.\n\nPero si cada acción avanza en una dirección distinta, sus esfuerzos se dispersan.\n\nPor eso Global Comm empieza por entender su empresa, su mercado y sus objetivos. Solo entonces recomendamos lo que merece su tiempo y su presupuesto.',
  ),
  pillars: [
    {
      title: l("Voir clair avant d'agir", 'See clearly before acting', 'Ver claro antes de actuar'),
      body: l(
        'Nous analysons votre situation pour faire ressortir les vrais enjeux.',
        'We analyse your situation to bring the real issues to the surface.',
        'Analizamos su situación para hacer emerger los verdaderos retos.',
      ),
    },
    {
      title: l('Choisir ce qui compte', 'Choose what matters', 'Elegir lo que importa'),
      body: l(
        'Nous classons les priorités pour concentrer les efforts sur les actions les plus pertinentes.',
        'We rank priorities so effort concentrates on the actions that matter most.',
        'Clasificamos las prioridades para concentrar los esfuerzos en las acciones más pertinentes.',
      ),
    },
    {
      title: l('Relier chaque action', 'Connect every action', 'Conectar cada acción'),
      body: l(
        'Votre marque, vos contenus, vos campagnes et vos outils suivent la même direction.',
        'Your brand, your content, your campaigns and your tools follow the same direction.',
        'Su marca, sus contenidos, sus campañas y sus herramientas siguen la misma dirección.',
      ),
    },
    {
      title: l("Suivre l'avancement", 'Track progress', 'Seguir el avance'),
      body: l(
        'Vous savez ce qui est prévu, ce qui est en cours et ce qui doit être ajusté.',
        'You know what is planned, what is under way and what needs adjusting.',
        'Usted sabe qué está previsto, qué está en curso y qué debe ajustarse.',
      ),
    },
  ],
}

export const servicesCopy = {
  kicker: l('UNE ÉQUIPE. QUATRE EXPERTISES.', 'ONE TEAM. FOUR AREAS OF EXPERTISE.', 'UN EQUIPO. CUATRO ESPECIALIDADES.'),
  heading: l(
    'Passez de la question à la solution sans perdre le fil.',
    'Move from question to solution without losing the thread.',
    'Pase de la pregunta a la solución sin perder el hilo.',
  ),
  intro: l(
    "Vous n'avez pas besoin de coordonner plusieurs prestataires qui travaillent chacun de leur côté.\n\nGlobal Comm réunit la recherche, la stratégie, la création, le digital et la technologie autour d'un même projet.",
    'You do not need to coordinate several suppliers each working on their own side.\n\nGlobal Comm brings research, strategy, creative, digital and technology together around a single project.',
    'No necesita coordinar a varios proveedores que trabajan cada uno por su lado.\n\nGlobal Comm reúne la investigación, la estrategia, la creación, lo digital y la tecnología en torno a un mismo proyecto.',
  ),
  ctaLabel: l('Découvrir cette expertise', 'Explore this expertise', 'Descubrir esta especialidad'),
  sectionCTA: l('Explorer toutes nos expertises', 'Explore all our expertise', 'Explorar todas nuestras especialidades'),
  /** Keyed by the pillar's config key so the card links to the right page. */
  items: [
    {
      number: '01',
      pillarKey: 'strategie',
      title: l('Recherche, audit et stratégie', 'Research, Audit & Strategy', 'Investigación, auditoría y estrategia'),
      tagline: l('Sachez où agir en premier.', 'Know where to act first.', 'Sepa dónde actuar primero.'),
      body: l(
        'Nous étudions votre situation, votre marché et vos objectifs pour identifier les priorités qui guideront le projet.',
        'We study your situation, your market and your objectives to identify the priorities that will guide the project.',
        'Estudiamos su situación, su mercado y sus objetivos para identificar las prioridades que guiarán el proyecto.',
      ),
      offerings: ll(
        ['Recherche et découverte', 'Audit de communication', 'Étude de marché', 'Positionnement', "Stratégie et plan d'action"],
        ['Research and discovery', 'Communication audit', 'Market research', 'Positioning', 'Strategy and action plan'],
        ['Investigación y descubrimiento', 'Auditoría de comunicación', 'Estudio de mercado', 'Posicionamiento', 'Estrategia y plan de acción'],
      ),
    },
    {
      number: '02',
      pillarKey: 'branding',
      title: l('Branding et communication', 'Branding & Communication', 'Branding y comunicación'),
      tagline: l(
        'Construisez une marque claire et cohérente.',
        'Build a clear and consistent brand.',
        'Construya una marca clara y coherente.',
      ),
      body: l(
        'Nous transformons votre positionnement en une identité que vos clients peuvent comprendre, reconnaître et retrouver sur chaque support.',
        'We turn your positioning into an identity your customers can understand, recognise and find again on every medium.',
        'Transformamos su posicionamiento en una identidad que sus clientes pueden entender, reconocer y reencontrar en cada soporte.',
      ),
      offerings: ll(
        ['Stratégie de marque', 'Identité visuelle', 'Direction artistique', 'Communication corporate', 'Production publicitaire'],
        ['Brand strategy', 'Visual identity', 'Art direction', 'Corporate communication', 'Advertising production'],
        ['Estrategia de marca', 'Identidad visual', 'Dirección artística', 'Comunicación corporativa', 'Producción publicitaria'],
      ),
    },
    {
      number: '03',
      pillarKey: 'marketing-digital',
      title: l('Marketing digital', 'Digital Marketing', 'Marketing digital'),
      tagline: l(
        'Transformez votre stratégie en actions visibles.',
        'Turn your strategy into visible action.',
        'Transforme su estrategia en acciones visibles.',
      ),
      body: l(
        'Nous coordonnons vos contenus, vos campagnes et vos plateformes digitales pour faire avancer un même objectif.',
        'We coordinate your content, your campaigns and your digital platforms so they advance a single objective.',
        'Coordinamos sus contenidos, sus campañas y sus plataformas digitales para avanzar hacia un mismo objetivo.',
      ),
      offerings: ll(
        ['Stratégie de contenu', 'Réseaux sociaux', 'Campagnes digitales', 'Sites web et landing pages', 'Analyse des performances'],
        ['Content strategy', 'Social media', 'Digital campaigns', 'Websites and landing pages', 'Performance analysis'],
        ['Estrategia de contenido', 'Redes sociales', 'Campañas digitales', 'Sitios web y landing pages', 'Análisis del rendimiento'],
      ),
    },
    {
      number: '04',
      pillarKey: 'web-technologie',
      title: l('Automatisation et IA', 'Automation & AI', 'Automatización e IA'),
      tagline: l(
        'Libérez vos équipes des tâches répétitives.',
        'Free your teams from repetitive tasks.',
        'Libere a sus equipos de las tareas repetitivas.',
      ),
      body: l(
        'Nous identifions les processus qui ralentissent votre travail puis nous concevons les outils et automatisations adaptés.',
        'We identify the processes slowing your work down, then design the tools and automations that fit.',
        'Identificamos los procesos que ralentizan su trabajo y después diseñamos las herramientas y automatizaciones adecuadas.',
      ),
      offerings: ll(
        ['Audit des processus', 'Automatisation des tâches', 'Intégration de solutions', 'Assistants IA', 'Reporting automatisé'],
        ['Process audit', 'Task automation', 'Solution integration', 'AI assistants', 'Automated reporting'],
        ['Auditoría de procesos', 'Automatización de tareas', 'Integración de soluciones', 'Asistentes de IA', 'Informes automatizados'],
      ),
    },
  ],
}

export const workCopy = {
  kicker: l('NOS RÉALISATIONS', 'OUR WORK', 'NUESTROS PROYECTOS'),
  heading: l(
    'Ne regardez pas seulement le résultat. Regardez la décision derrière.',
    'Do not look only at the result. Look at the decision behind it.',
    'No mire solo el resultado. Mire la decisión que hay detrás.',
  ),
  body: l(
    "Une belle image montre ce qui a été produit. Elle ne montre pas toujours le problème rencontré, les choix effectués ou le rôle exact de l'agence.\n\nNos études de cas vous donnent cette information. Vous pouvez ainsi évaluer notre manière de réfléchir autant que notre manière de produire.",
    'A striking image shows what was produced. It does not always show the problem faced, the choices made or the agency’s exact role.\n\nOur case studies give you that information, so you can judge how we think as much as how we produce.',
    'Una buena imagen muestra lo que se ha producido. No siempre muestra el problema encontrado, las decisiones tomadas o el papel exacto de la agencia.\n\nNuestros casos de estudio le dan esa información, para que pueda valorar nuestra manera de pensar tanto como nuestra manera de producir.',
  ),
  itemCTALabel: l('Découvrir le projet', 'View the project', 'Descubrir el proyecto'),
  sectionCTA: l('Voir toutes les réalisations', 'See all work', 'Ver todos los proyectos'),
}

export const approachCopy = {
  kicker: l('TROIS ÉTAPES. AUCUNE ZONE FLOUE.', 'THREE STEPS. NO GREY AREAS.', 'TRES ETAPAS. NINGUNA ZONA GRIS.'),
  heading: l(
    'Vous savez ce qui se passe à chaque étape.',
    'You know what happens at every step.',
    'Usted sabe qué ocurre en cada etapa.',
  ),
  body: l(
    "Une collaboration fonctionne mieux lorsque chacun connaît le point de départ, la prochaine décision et le résultat attendu.\n\nNotre méthode organise le projet en trois étapes simples.",
    'A collaboration works better when everyone knows the starting point, the next decision and the expected result.\n\nOur method organises the project into three simple steps.',
    'Una colaboración funciona mejor cuando cada uno conoce el punto de partida, la próxima decisión y el resultado esperado.\n\nNuestro método organiza el proyecto en tres etapas simples.',
  ),
  resultLabel: l('Résultat', 'Result', 'Resultado'),
  steps: [
    {
      number: '01',
      title: l(
        'Recherche, découverte et briefing',
        'Research, discovery and briefing',
        'Investigación, descubrimiento y briefing',
      ),
      tagline: l('Mettre le vrai problème au clair.', 'Get the real problem clear.', 'Aclarar el verdadero problema.'),
      body: l(
        "Nous commençons par comprendre votre entreprise, votre marché, vos clients et vos contraintes. Cette session nous aide à sortir des suppositions.\n\nNous pouvons alors définir :",
        'We start by understanding your business, your market, your customers and your constraints. This session helps us move past assumptions.\n\nWe can then define:',
        'Empezamos por entender su empresa, su mercado, sus clientes y sus limitaciones. Esta sesión nos ayuda a salir de las suposiciones.\n\nEntonces podemos definir:',
      ),
      bullets: ll(
        ["Les axes d'amélioration", 'Les besoins prioritaires', 'Les objectifs du projet', 'Les indicateurs de performance', 'Le cadre de collaboration'],
        ['Areas for improvement', 'Priority needs', 'Project objectives', 'Performance indicators', 'The framework for working together'],
        ['Los ejes de mejora', 'Las necesidades prioritarias', 'Los objetivos del proyecto', 'Los indicadores de rendimiento', 'El marco de colaboración'],
      ),
      result: l(
        'Un diagnostic clair et un brief partagé.',
        'A clear diagnosis and a shared brief.',
        'Un diagnóstico claro y un brief compartido.',
      ),
    },
    {
      number: '02',
      title: l(
        'Conception, validation et préparation du déploiement',
        'Design, validation and deployment preparation',
        'Diseño, validación y preparación del despliegue',
      ),
      tagline: l(
        'Choisir la bonne réponse avant de la produire.',
        'Choose the right answer before producing it.',
        'Elegir la respuesta correcta antes de producirla.',
      ),
      body: l(
        'Nous transformons les informations recueillies en stratégie et en solutions concrètes.\n\nNous présentons les orientations recommandées. Vous partagez vos retours. Puis nous validons ensemble la direction, les livrables et le plan de déploiement.',
        'We turn the information gathered into strategy and concrete solutions.\n\nWe present the recommended directions. You share your feedback. Then together we validate the direction, the deliverables and the deployment plan.',
        'Transformamos la información recogida en estrategia y en soluciones concretas.\n\nPresentamos las orientaciones recomendadas. Usted comparte sus comentarios. Después validamos juntos la dirección, los entregables y el plan de despliegue.',
      ),
      bullets: ll([], [], []),
      result: l(
        "Une stratégie validée et un plan d'action prêt à exécuter.",
        'A validated strategy and an action plan ready to execute.',
        'Una estrategia validada y un plan de acción listo para ejecutar.',
      ),
    },
    {
      number: '03',
      title: l('Exécution', 'Execution', 'Ejecución'),
      tagline: l(
        'Faire vivre la stratégie partout où vos clients rencontrent votre marque.',
        'Bring the strategy to life everywhere your customers meet your brand.',
        'Hacer vivir la estrategia allí donde sus clientes encuentran su marca.',
      ),
      body: l(
        "Nous transformons la direction validée en actions, contenus, supports et expériences concrètes.\n\nSelon votre projet, cette étape peut comprendre :",
        'We turn the validated direction into concrete actions, content, materials and experiences.\n\nDepending on your project, this step can include:',
        'Transformamos la dirección validada en acciones, contenidos, soportes y experiencias concretas.\n\nSegún su proyecto, esta etapa puede incluir:',
      ),
      bullets: ll(
        ["L'identité et le développement de marque", 'La stratégie de communication', 'La digitalisation et le site web', 'Les réseaux sociaux et campagnes digitales', "La conception et l'impression des supports"],
        ['Brand identity and development', 'Communication strategy', 'Digitalisation and the website', 'Social media and digital campaigns', 'Design and printing of materials'],
        ['La identidad y el desarrollo de marca', 'La estrategia de comunicación', 'La digitalización y el sitio web', 'Las redes sociales y las campañas digitales', 'El diseño y la impresión de los soportes'],
      ),
      result: l(
        'Une stratégie appliquée de manière cohérente sur les canaux retenus.',
        'A strategy applied consistently across the chosen channels.',
        'Una estrategia aplicada de manera coherente en los canales elegidos.',
      ),
    },
  ],
}

export const proofCopy = {
  kicker: l('DES PREUVES QUE VOUS POUVEZ VÉRIFIER', 'EVIDENCE YOU CAN CHECK', 'PRUEBAS QUE PUEDE VERIFICAR'),
  heading: l(
    'Vous ne devriez pas avoir à nous croire sur parole.',
    'You should not have to take our word for it.',
    'No debería tener que creernos sin más.',
  ),
  body: l(
    "Une promesse commerciale est facile à écrire. Une réalisation expliquée, un témoignage signé ou un résultat documenté vous donne quelque chose de plus utile : une base pour juger.\n\nCette section présente uniquement des références dont l'utilisation a été validée.",
    'A sales promise is easy to write. An explained project, a signed testimonial or a documented result gives you something more useful: a basis for judgement.\n\nThis section shows only references whose use has been approved.',
    'Una promesa comercial es fácil de escribir. Un proyecto explicado, un testimonio firmado o un resultado documentado le da algo más útil: una base para juzgar.\n\nEsta sección presenta únicamente referencias cuyo uso ha sido validado.',
  ),
}

export const faqCopy = {
  kicker: l('AVANT DE NOUS CONTACTER', 'BEFORE YOU GET IN TOUCH', 'ANTES DE CONTACTARNOS'),
  heading: l(
    'Les réponses aux questions que vous vous posez peut-être déjà.',
    'Answers to the questions you may already be asking.',
    'Las respuestas a las preguntas que quizá ya se está haciendo.',
  ),
  items: [
    {
      question: l(
        'Travaillez-vous avec une équipe marketing interne ?',
        'Do you work with an in-house marketing team?',
        '¿Trabajan con un equipo de marketing interno?',
      ),
      answer: l(
        "Oui. Global Comm peut compléter votre équipe, prendre en charge une mission précise ou coordonner plusieurs intervenants autour d'une même direction.",
        'Yes. Global Comm can complement your team, take on a specific assignment, or coordinate several contributors around a single direction.',
        'Sí. Global Comm puede complementar a su equipo, encargarse de una misión concreta o coordinar a varios intervinientes en torno a una misma dirección.',
      ),
    },
    {
      question: l(
        'Faut-il préparer un brief complet ?',
        'Do I need to prepare a complete brief?',
        '¿Hay que preparar un brief completo?',
      ),
      answer: l(
        'Non. Vous pouvez venir avec un besoin clair, une difficulté ou simplement une situation à améliorer. La session de découverte sert justement à clarifier le point de départ.',
        'No. You can come with a clear need, a difficulty, or simply a situation to improve. The discovery session exists precisely to clarify the starting point.',
        'No. Puede venir con una necesidad clara, una dificultad o simplemente una situación que mejorar. La sesión de descubrimiento sirve precisamente para clarificar el punto de partida.',
      ),
    },
    {
      question: l(
        'Global Comm est-elle uniquement une agence de réseaux sociaux ?',
        'Is Global Comm only a social media agency?',
        '¿Global Comm es únicamente una agencia de redes sociales?',
      ),
      answer: l(
        "Non. Les réseaux sociaux représentent un point de contact parmi d'autres. Notre travail peut couvrir la recherche, la stratégie, le branding, la communication, le marketing digital, le développement web et l'automatisation.",
        'No. Social media is one touchpoint among others. Our work can cover research, strategy, branding, communication, digital marketing, web development and automation.',
        'No. Las redes sociales son un punto de contacto entre otros. Nuestro trabajo puede abarcar la investigación, la estrategia, el branding, la comunicación, el marketing digital, el desarrollo web y la automatización.',
      ),
    },
    {
      question: l(
        'Comment commence une collaboration ?',
        'How does a collaboration begin?',
        '¿Cómo empieza una colaboración?',
      ),
      answer: l(
        'Nous commençons par un échange consacré à votre entreprise, vos objectifs et vos contraintes. Cet échange nous permet de déterminer la prochaine étape et de définir un périmètre adapté.',
        'We start with a conversation about your business, your objectives and your constraints. That conversation lets us determine the next step and define a suitable scope.',
        'Empezamos con una conversación dedicada a su empresa, sus objetivos y sus limitaciones. Esa conversación nos permite determinar el siguiente paso y definir un alcance adecuado.',
      ),
    },
    {
      question: l(
        'Comment suivons-nous le projet ?',
        'How do we follow the project?',
        '¿Cómo seguimos el proyecto?',
      ),
      answer: l(
        'Le mode de suivi est défini au démarrage. Vous connaissez les responsabilités, les étapes, les livrables, les validations attendues et les prochains points d’avancement.',
        'The way we track progress is agreed at the start. You know the responsibilities, the stages, the deliverables, the approvals expected and the next progress reviews.',
        'El modo de seguimiento se define al inicio. Usted conoce las responsabilidades, las etapas, los entregables, las validaciones esperadas y los próximos puntos de avance.',
      ),
    },
  ],
}

export const closingCopy = {
  kicker: l('COMMENÇONS PAR VOTRE PRIORITÉ', 'LET US START WITH YOUR PRIORITY', 'EMPECEMOS POR SU PRIORIDAD'),
  heading: l(
    "Vous n'avez peut-être pas besoin d'en faire plus. Vous avez besoin de savoir quoi faire ensuite.",
    'You may not need to do more. You need to know what to do next.',
    'Quizá no necesite hacer más. Necesita saber qué hacer a continuación.',
  ),
  body: l(
    "Expliquez-nous où vous en êtes, ce qui bloque et ce que vous souhaitez améliorer.\n\nLe premier échange sert à clarifier votre situation et à déterminer si Global Comm peut vous accompagner.",
    'Tell us where you are, what is blocking you and what you want to improve.\n\nThe first conversation is there to clarify your situation and determine whether Global Comm can help.',
    'Explíquenos dónde se encuentra, qué le bloquea y qué desea mejorar.\n\nLa primera conversación sirve para clarificar su situación y determinar si Global Comm puede acompañarle.',
  ),
  cta: l('Parlons de votre projet', "Let's talk about your project", 'Hablemos de su proyecto'),
  reassurance: l(
    'Aucun brief parfait n’est nécessaire pour commencer.',
    'No perfect brief is needed to begin.',
    'No hace falta un brief perfecto para empezar.',
  ),
}
