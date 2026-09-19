'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Container, SectionLabel } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { platforms } = homeV5

/** Platform marks carry their own casing; title-casing them misspells two. */
const PLATFORM_NAMES: Record<string, string> = {
  google: 'Google',
  meta: 'Meta',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
}

const PLATFORM_LOGOS: Record<string, string> = {
  google: 'https://cdn.simpleicons.org/google',
  meta: 'https://cdn.simpleicons.org/meta/0866FF',
  tiktok: 'https://cdn.simpleicons.org/tiktok',
  linkedin: 'https://cdn.simpleicons.org/linkedin/0A66C2',
}

/**
 * Platform Expertise — approved reference (04 §12.3).
 *
 * Editorial heading on the left, a platform tab row on the right sitting on a
 * single hairline with a brand-blue indicator under the active mark, and the
 * active platform's capabilities as a plain 2 × 2 text grid.
 *
 * The capabilities are deliberately not cards: the reference presents them as
 * typography on the page, and 03 §6 keeps cards for real semantic grouping.
 */
export function PlatformExpertise() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const validKeys = new Set(platforms.items.map((item) => item.key as string))
  const requested = searchParams.get('platform')
  const active = requested && validKeys.has(requested) ? requested : platforms.items[0].key

  const setPlatform = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('platform', value)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <section
      id="platform-expertise"
      className="scroll-mt-24 bg-background"
      aria-labelledby="platform-heading"
    >
      <Container className="py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionLabel>{platforms.label}</SectionLabel>
            <h2
              id="platform-heading"
              className="mt-6 max-w-[19ch] text-heading-32 leading-[1.14] tracking-[-0.03em] text-foreground"
            >
              {platforms.support}
            </h2>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <Tabs value={active} onValueChange={setPlatform}>
              <TabsList className="h-auto w-full flex-wrap justify-start gap-x-6 gap-y-0 rounded-none border-b border-border bg-transparent p-0 sm:flex-nowrap sm:gap-8">
                {platforms.items.map((item) => (
                  <TabsTrigger
                    key={item.key}
                    value={item.key}
                    translate="no"
                    className="group/tab relative min-h-14 flex-none justify-start gap-2.5 rounded-none border-0 bg-transparent px-0 pb-4 text-copy-14 data-[state=active]:bg-transparent data-[state=active]:text-foreground"
                  >
                    {/* The official marks are served by an icon CDN. If it is
                        unreachable the tab keeps working and simply shows the
                        platform name — a broken-image glyph would be worse
                        than no mark at all. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={PLATFORM_LOGOS[item.key]}
                      alt=""
                      aria-hidden
                      onError={(event) => {
                        event.currentTarget.style.display = 'none'
                      }}
                      className="size-[1.125rem] shrink-0 object-contain opacity-80 transition-opacity duration-150 group-data-[state=active]/tab:opacity-100"
                    />
                    {PLATFORM_NAMES[item.key] ?? item.name}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 -bottom-px h-[2px] origin-left scale-x-0 bg-primary transition-transform duration-200 ease-out group-data-[state=active]/tab:scale-x-100"
                    />
                  </TabsTrigger>
                ))}
              </TabsList>

              {platforms.items.map((item) => (
                <TabsContent
                  key={item.key}
                  value={item.key}
                  className="mt-10"
                >
                  <dl className="grid gap-x-12 gap-y-9 sm:grid-cols-2">
                    {item.capabilities.map((capability, index) => (
                      <div key={capability}>
                        <dt className="text-label-12 font-semibold uppercase tracking-[0.06em] text-foreground">
                          {capability}
                        </dt>
                        <dd className="mt-2.5 max-w-[30ch] text-copy-14 leading-[1.55] text-muted-foreground [text-wrap:pretty]">
                          {item.notes[index]}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </Container>
    </section>
  )
}
