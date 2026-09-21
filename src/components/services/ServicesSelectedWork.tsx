import Link from 'next/link'
import type { Project } from '@/payload-types'
import { mediaURL } from '@/lib/media'
import { Container } from '@/components/ui/Layout'

/**
 * Selected Work — project imagery is the strongest element in the section.
 *
 * A narrow editorial column on the left, three project previews on the right,
 * no card chrome. Everything shown comes from the Payload project records the
 * page selects; nothing about a project is composed here.
 *
 * This is a page-specific presentation rather than the shared `ProjectTile`,
 * which carries its own bordered treatment and is used by other routes.
 *
 * Geometry is measured from the approved reference at 1440: media plates are
 * 302x161 inside a 946px-wide field with a 20px gutter, which is 15/8, and the
 * excerpt occupies a single line so the three links settle on one baseline.
 * `mt-auto` rather than a grown excerpt keeps that baseline when a client name
 * wraps, since the names in Payload are full legal names.
 */
export function ServicesSelectedWork({
  label,
  heading,
  projects,
  hrefFor,
  seeAllHref,
  seeAllLabel,
  viewLabel,
}: {
  label?: string | null
  heading?: string | null
  projects: Project[]
  hrefFor: (project: Project) => string | null
  seeAllHref: string
  seeAllLabel: string
  viewLabel: string
}) {
  if (projects.length === 0) return null

  return (
    <section className="bg-background" aria-labelledby="services-work-heading">
      <Container className="py-10 md:py-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-3">
            {label ? (
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {label}
              </p>
            ) : null}
            {heading ? (
              <h2
                id="services-work-heading"
                className="mt-4 max-w-[16ch] text-balance font-sans text-3xl font-semibold leading-[1.14] tracking-[-0.035em] text-foreground md:text-[2.375rem]"
              >
                {heading}
              </h2>
            ) : null}
          </div>

          <div className="lg:col-span-9">
            <div className="flex justify-end">
              <Link
                href={seeAllHref}
                className="inline-flex items-center py-3 -my-3 text-sm font-medium text-primary transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {seeAllLabel} →
              </Link>
            </div>

            <ul className="mt-3 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => {
                const href = hrefFor(project)
                const image =
                  mediaURL(project.featuredMedia, 'projectCard') ||
                  mediaURL(project.heroMedia, 'projectCard') ||
                  mediaURL(project.heroMedia, 'projectFeature')
                const client = typeof project.client === 'object' ? project.client?.name : undefined

                return (
                  <li key={project.id} className="flex min-w-0 flex-col">
                    <div className="relative aspect-[15/8] w-full overflow-hidden bg-muted">
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : null}
                    </div>

                    <h3 translate="no" className="mt-3 text-base font-semibold tracking-[-0.015em] text-foreground">
                      {client ?? project.title}
                    </h3>

                    {project.excerpt ? (
                      <p className="mt-2 line-clamp-1 text-pretty text-sm leading-normal text-muted-foreground">
                        {project.excerpt}
                      </p>
                    ) : null}

                    {href ? (
                      <p className="mt-auto pt-3">
                        <Link
                          href={href}
                          className="inline-flex items-center py-3 -my-3 text-sm font-medium text-primary transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                          {viewLabel} →
                        </Link>
                      </p>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}
