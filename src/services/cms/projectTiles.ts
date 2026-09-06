import type { Locale } from '@/i18n/locale'
import { tileImage, type TileImage } from '@/lib/media'
import type { Project } from '@/payload-types'
import { buildPath } from '@/services/seo/urls'

export type ProjectTileModel = {
  project: Project
  href: string | null
  meta: string
  image?: TileImage
}

/**
 * Shapes a set of projects for the shared ProjectTile, so the homepage, the
 * services pages, the work archive and related-work all derive the link, the
 * metadata line and the card image the same way (CLAUDE.md §84).
 *
 * `featuredMedia` wins over `heroMedia`: the hero is composed for a full-width
 * banner, the featured image for a card.
 */
export function projectTiles(projects: Project[], locale: Locale): ProjectTileModel[] {
  return projects.map((project) => ({
    project,
    href: project.slug ? buildPath(locale, { type: 'project', slug: project.slug }) : null,
    meta: [
      typeof project.client === 'object' ? project.client?.name : undefined,
      project.year ? String(project.year) : undefined,
    ]
      .filter(Boolean)
      .join(' · '),
    image: tileImage([project.featuredMedia, project.heroMedia], project.title),
  }))
}

/**
 * A grid goes image-led as soon as one of its projects has authentic media.
 * Deciding this per grid rather than per tile keeps a row regular when only
 * some projects carry media, and keeps the site text-led — rather than full of
 * placeholder fields — while none of them do.
 */
export function isMediaLed(tiles: ProjectTileModel[]): boolean {
  return tiles.some((tile) => Boolean(tile.image))
}
