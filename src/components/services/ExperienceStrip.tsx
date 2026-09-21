import type { Client } from '@/payload-types'
import { mediaURL } from '@/lib/media'

/**
 * Experience band — a restrained horizontal rule of approved organisations.
 *
 * No logo cards, no grey containers, no counts. Organisations come from the
 * `clients` collection; nothing is invented here, so the band disappears
 * entirely when no approved client record exists (CLAUDE.md §105, §139).
 */
export function ExperienceStrip({
  label,
  clients,
  andMoreLabel,
  limit = 6,
}: {
  label?: string | null
  clients: Client[]
  andMoreLabel: string
  limit?: number
}) {
  if (clients.length === 0) return null

  const shown = clients.slice(0, limit)
  const hasMore = clients.length > shown.length

  return (
    <section className="border-y border-border bg-background" aria-label={label ?? undefined}>
      <div className="mx-auto w-full max-w-[90rem] px-5 py-10 sm:px-6 md:px-8 lg:px-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          {label ? (
            <p className="max-w-[22ch] shrink-0 text-[0.7rem] font-medium uppercase leading-[1.5] tracking-[0.14em] text-muted-foreground">
              {label}
            </p>
          ) : null}

          <ul className="flex flex-wrap items-center gap-x-10 gap-y-5 lg:justify-end">
            {shown.map((client) => {
              const logo = mediaURL(client.logo, 'logo')

              return (
                <li key={client.id} translate="no">
                  {logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logo}
                      alt={client.name}
                      loading="lazy"
                      decoding="async"
                      className="max-h-7 max-w-28 object-contain opacity-70"
                    />
                  ) : (
                    <span className="text-sm font-medium text-foreground/70">{client.name}</span>
                  )}
                </li>
              )
            })}

            {hasMore ? (
              <li className="flex items-center gap-10">
                <span aria-hidden className="block h-6 w-px bg-border" />
                <span className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {andMoreLabel}
                </span>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </section>
  )
}
