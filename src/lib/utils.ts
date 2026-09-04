import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Class-name merge helper required by the shadcn/ui primitives.
 * Scoped to that layer — Global Comm components use the design-system
 * classes in src/app/(frontend)/styles.css.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
