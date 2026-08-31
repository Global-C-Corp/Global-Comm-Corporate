/**
 * Did this write actually change any content, or is it a resave?
 *
 * CLAUDE.md §16 defines dirtyLocales as the locales *changed* in the current
 * unpublished version. Payload hands `beforeChange` the full merged document
 * rather than only the submitted fields, so presence of a key says nothing —
 * the values have to be compared against what is stored.
 *
 * Ambiguity resolves to "changed". Over-reporting costs an editor one
 * needless approval; under-reporting would let an unreviewed locale reach
 * the public site, which §17 forbids.
 */

/** Relationships arrive as an id on one side and a populated doc on the other. */
function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize)

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    if ('id' in record && Object.keys(record).length > 1) return normalize(record.id)

    return Object.keys(record)
      .sort()
      .reduce<Record<string, unknown>>((accumulator, key) => {
        accumulator[key] = normalize(record[key])
        return accumulator
      }, {})
  }

  // null and '' both mean "empty" across Payload's read and write shapes.
  if (value === null || value === '') return undefined

  return value
}

function isEqual(left: unknown, right: unknown): boolean {
  try {
    return JSON.stringify(normalize(left)) === JSON.stringify(normalize(right))
  } catch {
    return false
  }
}

export function hasContentChange(
  data: Record<string, unknown>,
  originalDoc: Record<string, unknown> | null | undefined,
  ignoredFields: ReadonlySet<string>,
): boolean {
  for (const key of Object.keys(data)) {
    if (ignoredFields.has(key)) continue
    if (!isEqual(data[key], originalDoc?.[key])) return true
  }

  return false
}
