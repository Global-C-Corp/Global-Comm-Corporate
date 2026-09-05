import type { Service } from '@/payload-types'

/**
 * A capability a pillar absorbed, rendered as a section rather than a link.
 *
 * These terms keep their place in the taxonomy — they still classify projects
 * — but they no longer have a public page, so linking to them would produce a
 * dead end or a redirect hop. The name and description are presented inline
 * instead (CLAUDE.md §29-§30, §76).
 */
export function AbsorbedCapability({ service }: { service: Service }) {
  return (
    <article className="gc-card">
      <p className="gc-card__title">{service.name}</p>
      {service.shortDescription && <p className="gc-card__body">{service.shortDescription}</p>}
    </article>
  )
}
