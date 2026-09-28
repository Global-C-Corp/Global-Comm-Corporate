/**
 * Contact page copy — source-owned.
 *
 * The form itself still writes to the Payload `inquiries` collection; only the
 * surrounding copy moved into code. Migrated verbatim from the `contact-page`
 * global (French).
 */
export const contactContent = {
  eyebrow: 'Contact',
  heading: 'Démarrer un projet',
  intro:
    'Décrivez votre besoin. Nous revenons vers vous avec une première lecture stratégique.',
  formIntro: 'Les champs marqués d’un astérisque sont obligatoires.',
  meta: {
    title: 'Contact — Global Comm',
    description:
      'Décrivez votre besoin. Nous revenons vers vous avec une première lecture stratégique.',
  },
} as const
