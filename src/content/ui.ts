/**
 * Small UI strings — labels, actions, accessibility text, the 404 page.
 *
 * These replace the per-locale dictionary the frontend used to look up with
 * `getDictionary(locale)`. The site is single-language French for now, so the
 * French values are simply the values.
 *
 * Editorial copy does not belong here — it lives beside its page in
 * src/content/.
 */
export const ui = {
  "nav": {
    "menu": "Menu",
    "close": "Fermer"
  },
  "sections": {
    "selectedClients": "Clients sélectionnés",
    "whatWeDo": "Ce que nous faisons",
    "selectedWork": "Réalisations sélectionnées",
    "industries": "Secteurs",
    "testimonials": "Témoignages",
    "capabilities": "Expertises",
    "relatedServices": "Services associés",
    "challenge": "Enjeu",
    "approach": "Approche",
    "deliverables": "Livrables",
    "outcome": "Résultat",
    "metrics": "Indicateurs vérifiés",
    "metricsMixed": "Indicateurs",
    "metricEstimate": "Estimation",
    "metricTarget": "Objectif",
    "relatedWork": "Projets associés",
    "clientProblem": "Problématique client",
    "method": "Méthode"
  },
  "actions": {
    "next": "Suivant",
    "previous": "Précédent",
    "viewProject": "Voir le projet",
    "submit": "Envoyer",
    "filters": "Filtres",
    "all": "Tous",
    "readMore": "En savoir plus",
    "startProject": "Démarrer un projet",
    "viewOurWork": "Voir nos réalisations",
    "explore": "Découvrir",
    "viewCaseStudy": "Voir l’étude de cas",
    "seeAllWork": "Voir toutes les réalisations",
    "andMore": "et plus encore"
  },
  "form": {
    "required": "Ce champ est requis",
    "invalidEmail": "Adresse e-mail invalide",
    "genericError": "Une erreur est survenue. Veuillez réessayer.",
    "success": "Merci, votre message a bien été envoyé."
  },
  "a11y": {
    "skipToContent": "Aller au contenu",
    "languageSwitcher": "Changer de langue",
    "primaryNavigation": "Navigation principale"
  },
  "notFound": {
    "title": "Page introuvable",
    "body": "La page que vous recherchez n'existe pas ou a été déplacée.",
    "backHome": "Retour à l'accueil"
  }
} as const

export type UI = typeof ui
