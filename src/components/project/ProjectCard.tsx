import Link from 'next/link'
import type { Locale } from '@/i18n/locale'
import { mediaURL } from '@/lib/media'
import type { Project } from '@/payload-types'
import { buildPath } from '@/services/seo/urls'

/** CLAUDE.md §139 — no image means intentional typography, not a placeholder. */
export function ProjectCard({ project, locale }: { project: Project; locale: Locale }) {
  const image = mediaURL(project.featuredMedia ?? project.heroMedia, 'projectCard')
  const clientName = typeof project.client === 'object' && project.client ? project.client.name : undefined
  const href = project.slug ? buildPath(locale, { type: 'project', slug: project.slug }) : undefined

  const body = (
    <>
      <div className="gc-project-card__media">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={project.title ?? ''} loading="lazy" />
        ) : (
          <p className="gc-project-card__fallback">{project.title}</p>
        )}
      </div>
      <p className="gc-card__meta">
        {[clientName, project.year].filter(Boolean).join(' · ')}
      </p>
      <p className="gc-card__title">{project.title}</p>
      {project.shortStatement && <p className="gc-card__body">{project.shortStatement}</p>}
    </>
  )

  if (!href) return <article className="gc-card">{body}</article>

  return (
    <article className="gc-card">
      <Link href={href}>{body}</Link>
    </article>
  )
}
