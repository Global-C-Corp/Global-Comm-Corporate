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
    <article className="bg-background p-8">
      <p className="text-base font-semibold text-foreground">{service.name}</p>
      {service.shortDescription && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.shortDescription}</p>
      )}
    </article>
  )
}
