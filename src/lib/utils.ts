import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * Échelle typographique Geist déclarée dans styles.css.
 *
 * tailwind-merge doit la connaître, sinon il classe `text-heading-24` parmi
 * les couleurs de texte et supprime le `text-foreground` qui l'accompagne —
 * ce qui a produit un bouton primaire en noir sur bleu, à 2,4:1. Les
 * enregistrer comme tailles de police rend les deux classes compatibles.
 */
const GEIST_TEXT_SIZES = [
  'heading-72',
  'heading-64',
  'heading-56',
  'heading-48',
  'heading-40',
  'heading-32',
  'heading-24',
  'copy-20',
  'copy-18',
  'copy-16',
  'copy-14',
  'label-14',
  'label-12',
  'button-16',
  'button-14',
]

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: GEIST_TEXT_SIZES }],
    },
  },
})

/**
 * Class-name merge helper required by the shadcn/ui primitives.
 * Scoped to that layer — Global Comm components use the design-system
 * classes in src/app/(frontend)/styles.css.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
