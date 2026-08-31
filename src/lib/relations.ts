/**
 * Payload relationship fields are `id | Doc` depending on query depth.
 * These helpers narrow to the populated documents without repeating the
 * type guard in every component.
 */
export function isPopulated<T extends object>(value: T | number | string | null | undefined): value is T {
  return typeof value === 'object' && value !== null
}

export function populated<T extends object>(
  values: (T | number | string | null | undefined)[] | null | undefined,
): T[] {
  return (values ?? []).filter((value): value is T => isPopulated(value))
}
