import { describe, expect, it } from 'vitest'
import { tileImage } from '@/lib/media'
import { isMediaLed, projectTiles } from '@/services/cms/projectTiles'
import type { Project } from '@/payload-types'

const media = (url: string, alt?: string) => ({
  url,
  alt,
  sizes: { projectCard: { url: `${url}-800x600.webp` } },
})

const project = (overrides: Partial<Project> = {}): Project =>
  ({
    id: 1,
    title: 'AMREC — 55 ans',
    slug: 'amrec-55-ans',
    ...overrides,
  }) as Project

describe('tileImage', () => {
  it('prefers the projectCard size over the original file', () => {
    expect(tileImage([media('/api/media/file/a.jpg')], 'fallback')?.url).toBe(
      '/api/media/file/a.jpg-800x600.webp',
    )
  })

  it('takes the first candidate that actually resolves', () => {
    const result = tileImage([null, undefined, media('/b.jpg', 'Poster wall')], 'fallback')
    expect(result).toEqual({ url: '/b.jpg-800x600.webp', alt: 'Poster wall' })
  })

  it("uses the media's own alt text when it has one", () => {
    expect(tileImage([media('/c.jpg', 'Campaign key visual')], 'Project title')?.alt).toBe(
      'Campaign key visual',
    )
  })

  it('falls back to the supplied alt when the media has none or only whitespace', () => {
    expect(tileImage([media('/d.jpg')], 'Project title')?.alt).toBe('Project title')
    expect(tileImage([media('/e.jpg', '   ')], 'Project title')?.alt).toBe('Project title')
  })

  // The whole point of ISSUE D: a project with no media of its own gets no
  // image, rather than borrowing one that belongs to something else.
  it('returns undefined rather than substituting anything', () => {
    expect(tileImage([null, undefined, 3], 'Project title')).toBeUndefined()
  })
})

describe('projectTiles', () => {
  it('builds the localized href from the localized slug', () => {
    const [tile] = projectTiles([project({ slug: 'brand-strategy' })], 'en')
    expect(tile.href).toBe('/en/work/brand-strategy')
  })

  it('omits the href when the locale has no approved slug', () => {
    const [tile] = projectTiles([project({ slug: null })], 'fr')
    expect(tile.href).toBeNull()
  })

  it('joins client and year into the metadata line, skipping what is missing', () => {
    const withBoth = projectTiles(
      [project({ client: { id: 2, name: 'AMREC' } as Project['client'], year: 2024 })],
      'fr',
    )
    expect(withBoth[0].meta).toBe('AMREC · 2024')

    const yearOnly = projectTiles([project({ year: 2024 })], 'fr')
    expect(yearOnly[0].meta).toBe('2024')

    const neither = projectTiles([project()], 'fr')
    expect(neither[0].meta).toBe('')
  })

  it('prefers featuredMedia over heroMedia for the card', () => {
    const [tile] = projectTiles(
      [
        project({
          featuredMedia: media('/featured.jpg') as unknown as Project['featuredMedia'],
          heroMedia: media('/hero.jpg') as unknown as Project['heroMedia'],
        }),
      ],
      'fr',
    )
    expect(tile.image?.url).toBe('/featured.jpg-800x600.webp')
  })
})

describe('isMediaLed', () => {
  it('is false when no project in the grid has media', () => {
    expect(isMediaLed(projectTiles([project(), project({ id: 2 })], 'fr'))).toBe(false)
  })

  // One real image is enough to flip the grid — no code change needed when
  // authentic media finally arrives.
  it('is true as soon as one project has media', () => {
    const tiles = projectTiles(
      [
        project(),
        project({ id: 2, featuredMedia: media('/real.jpg') as unknown as Project['featuredMedia'] }),
      ],
      'fr',
    )
    expect(isMediaLed(tiles)).toBe(true)
  })
})
