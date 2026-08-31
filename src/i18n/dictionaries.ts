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
