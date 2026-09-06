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
    contact: string
    social: string
  }
  meta: {
    client: string
    location: string
    direct: string
    office: string
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
    /** Visible field labels. The required marker is appended by the form. */
    labels: {
      name: string
      company: string
      email: string
      phone: string
      website: string
      projectType: string
      estimatedBudget: string
      desiredStart: string
      message: string
      /** Contains a {company} placeholder filled from Site Settings. */
      consent: string
    }
  }
  a11y: {
    skipToContent: string
    languageSwitcher: string
    primaryNav: string
    footerNav: string
    legalNav: string
    pagination: string
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
      contact: 'Contact',
      social: 'Réseaux sociaux',
    },
    meta: {
      client: 'Client',
      location: 'Lieu',
      direct: 'Contact direct',
      office: 'Bureau',
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
      labels: {
        name: 'Nom',
        company: 'Société',
        email: 'E-mail',
        phone: 'Téléphone',
        website: 'Site web',
        projectType: 'Type de projet',
        estimatedBudget: 'Budget estimé',
        desiredStart: 'Date de démarrage souhaitée',
        message: 'Message',
        consent: "J'autorise {company} à conserver ces informations afin de répondre à ma demande.",
      },
    },
    a11y: {
      skipToContent: 'Aller au contenu',
      languageSwitcher: 'Changer de langue',
      primaryNav: 'Navigation principale',
      footerNav: 'Navigation de pied de page',
      legalNav: 'Mentions légales',
      pagination: 'Pagination',
    },
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
      contact: 'Contact',
      social: 'Social',
    },
    meta: {
      client: 'Client',
      location: 'Location',
      direct: 'Direct',
      office: 'Office',
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
      labels: {
        name: 'Name',
        company: 'Company',
        email: 'Email',
        phone: 'Phone',
        website: 'Website',
        projectType: 'Project type',
        estimatedBudget: 'Estimated budget',
        desiredStart: 'Desired start',
        message: 'Message',
        consent: 'I consent to {company} storing this information to respond to my enquiry.',
      },
    },
    a11y: {
      skipToContent: 'Skip to content',
      languageSwitcher: 'Switch language',
      primaryNav: 'Primary',
      footerNav: 'Footer',
      legalNav: 'Legal',
      pagination: 'Pagination',
    },
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
      contact: 'Contacto',
      social: 'Redes sociales',
    },
    meta: {
      client: 'Cliente',
      location: 'Ubicación',
      direct: 'Contacto directo',
      office: 'Oficina',
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
      labels: {
        name: 'Nombre',
        company: 'Empresa',
        email: 'Correo electrónico',
        phone: 'Teléfono',
        website: 'Sitio web',
        projectType: 'Tipo de proyecto',
        estimatedBudget: 'Presupuesto estimado',
        desiredStart: 'Fecha de inicio deseada',
        message: 'Mensaje',
        consent: 'Autorizo a {company} a conservar esta información para responder a mi solicitud.',
      },
    },
    a11y: {
      skipToContent: 'Ir al contenido',
      languageSwitcher: 'Cambiar idioma',
      primaryNav: 'Navegación principal',
      footerNav: 'Navegación de pie de página',
      legalNav: 'Avisos legales',
      pagination: 'Paginación',
    },
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
