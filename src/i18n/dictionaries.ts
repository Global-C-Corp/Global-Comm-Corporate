import type { Locale } from './locale'

/**
 * Small application/UI strings (CLAUDE.md §62).
 * Business and editorial copy belongs in Payload, never here.
 */
export type Dictionary = {
  nav: {
    menu: string
    close: string
  }
  sections: {
    selectedClients: string
    whatWeDo: string
    selectedWork: string
    industries: string
    testimonials: string
    capabilities: string
    relatedServices: string
    challenge: string
    approach: string
    deliverables: string
    outcome: string
    metrics: string
    relatedWork: string
    clientProblem: string
    method: string
    faq: string
    positioning: string
  }
  actions: {
    next: string
    previous: string
    viewProject: string
    submit: string
    filters: string
    all: string
    readMore: string
    startProject: string
    viewOurWork: string
  }
  form: {
    required: string
    invalidEmail: string
    genericError: string
    success: string
  }
  a11y: {
    skipToContent: string
    languageSwitcher: string
  }
  notFound: {
    title: string
    body: string
    backHome: string
  }
}

const dictionaries: Record<Locale, Dictionary> = {
  fr: {
    nav: { menu: 'Menu', close: 'Fermer' },
    sections: {
      selectedClients: 'Clients sélectionnés',
      whatWeDo: 'Ce que nous faisons',
      selectedWork: 'Réalisations sélectionnées',
      industries: 'Secteurs',
      testimonials: 'Témoignages',
      capabilities: 'Expertises',
      relatedServices: 'Services associés',
      challenge: 'Enjeu',
      approach: 'Approche',
      deliverables: 'Livrables',
      outcome: 'Résultat',
      metrics: 'Indicateurs vérifiés',
      relatedWork: 'Projets associés',
      clientProblem: 'Problématique client',
      method: 'Méthode',
      faq: 'Questions fréquentes',
      positioning: 'Notre positionnement',
    },
    actions: {
      next: 'Suivant',
      previous: 'Précédent',
      viewProject: 'Voir le projet',
      submit: 'Envoyer',
      filters: 'Filtres',
      all: 'Tous',
      readMore: 'En savoir plus',
      startProject: 'Démarrer un projet',
      viewOurWork: 'Voir nos réalisations',
    },
    form: {
      required: 'Ce champ est requis',
      invalidEmail: 'Adresse e-mail invalide',
      genericError: "Une erreur est survenue. Veuillez réessayer.",
      success: 'Merci, votre message a bien été envoyé.',
    },
    a11y: { skipToContent: 'Aller au contenu', languageSwitcher: 'Changer de langue' },
    notFound: {
      title: 'Page introuvable',
      body: "La page que vous recherchez n'existe pas ou a été déplacée.",
      backHome: "Retour à l'accueil",
    },
  },
  en: {
    nav: { menu: 'Menu', close: 'Close' },
    sections: {
      selectedClients: 'Selected clients',
      whatWeDo: 'What we do',
      selectedWork: 'Selected work',
      industries: 'Industries',
      testimonials: 'Testimonials',
      capabilities: 'Capabilities',
      relatedServices: 'Related services',
      challenge: 'Challenge',
      approach: 'Approach',
      deliverables: 'Deliverables',
      outcome: 'Outcome',
      metrics: 'Verified metrics',
      relatedWork: 'Related work',
      clientProblem: 'Client problem',
      method: 'Method',
      faq: 'Frequently asked questions',
      positioning: 'Our positioning',
    },
    actions: {
      next: 'Next',
      previous: 'Previous',
      viewProject: 'View project',
      submit: 'Submit',
      filters: 'Filters',
      all: 'All',
      readMore: 'Read more',
      startProject: 'Start a project',
      viewOurWork: 'View our work',
    },
    form: {
      required: 'This field is required',
      invalidEmail: 'Invalid email address',
      genericError: 'Something went wrong. Please try again.',
      success: 'Thank you, your message has been sent.',
    },
    a11y: { skipToContent: 'Skip to content', languageSwitcher: 'Switch language' },
    notFound: {
      title: 'Page not found',
      body: "The page you are looking for doesn't exist or has moved.",
      backHome: 'Back to home',
    },
  },
  es: {
    nav: { menu: 'Menú', close: 'Cerrar' },
    sections: {
      selectedClients: 'Clientes seleccionados',
      whatWeDo: 'Lo que hacemos',
      selectedWork: 'Trabajos seleccionados',
      industries: 'Sectores',
      testimonials: 'Testimonios',
      capabilities: 'Capacidades',
      relatedServices: 'Servicios relacionados',
      challenge: 'Desafío',
      approach: 'Enfoque',
      deliverables: 'Entregables',
      outcome: 'Resultado',
      metrics: 'Métricas verificadas',
      relatedWork: 'Proyectos relacionados',
      clientProblem: 'Problema del cliente',
      method: 'Método',
      faq: 'Preguntas frecuentes',
      positioning: 'Nuestro posicionamiento',
    },
    actions: {
      next: 'Siguiente',
      previous: 'Anterior',
      viewProject: 'Ver proyecto',
      submit: 'Enviar',
      filters: 'Filtros',
      all: 'Todos',
      readMore: 'Saber más',
      startProject: 'Iniciar un proyecto',
      viewOurWork: 'Ver nuestro trabajo',
    },
    form: {
      required: 'Este campo es obligatorio',
      invalidEmail: 'Correo electrónico no válido',
      genericError: 'Ha ocurrido un error. Inténtalo de nuevo.',
      success: 'Gracias, tu mensaje ha sido enviado.',
    },
    a11y: { skipToContent: 'Ir al contenido', languageSwitcher: 'Cambiar idioma' },
    notFound: {
      title: 'Página no encontrada',
      body: 'La página que buscas no existe o ha sido movida.',
      backHome: 'Volver al inicio',
    },
  },
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
