'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search, BarChart3, LineChart, Settings2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Container, SectionLabel } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { platforms } = homeV5
const ICONS = [Search, BarChart3, LineChart, Settings2]

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
      className="scroll-mt-20 border-b border-border bg-background"
      aria-labelledby="platform-heading"
    >
      <Container className="py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-4 lg:pr-8">
            <SectionLabel>{platforms.label}</SectionLabel>
            <h2
              id="platform-heading"
              className="mt-4 max-w-[12ch] text-heading-32 text-foreground [text-wrap:balance] md:text-heading-40"
            >
              {platforms.heading}
            </h2>
            <p className="mt-4 max-w-[34ch] text-copy-16 text-muted-foreground [text-wrap:pretty]">
              {platforms.support}
            </p>
          </div>

          <div className="min-w-0 lg:col-span-8">
            <Tabs value={active} onValueChange={setPlatform}>
              <TabsList className="grid h-auto w-full grid-cols-2 gap-1 border border-border bg-[#F5F5F2] p-1 sm:grid-cols-4">
                {platforms.items.map((item) => (
                  <TabsTrigger
                    key={item.key}
                    value={item.key}
                    translate="no"
                    className="min-h-11 min-w-0 whitespace-normal rounded-[3px] px-3 py-2 text-center text-label-13 data-[state=active]:border-black/8 data-[state=active]:bg-background data-[state=active]:shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)]"
                  >
                    {item.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {platforms.items.map((item) => (
                <TabsContent key={item.key} value={item.key} className="mt-5">
                  <div className="grid overflow-hidden border border-border bg-border sm:grid-cols-2 xl:grid-cols-4">
                    {item.capabilities.map((capability, index) => {
                      const Icon = ICONS[index % ICONS.length]
                      return (
                        <div
                          key={capability}
                          className="min-h-44 bg-background p-5 sm:border-r sm:border-b sm:border-border xl:border-b-0"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <Icon aria-hidden className="size-4 text-primary" />
                            <span className="font-[family-name:var(--font-geist-mono)] text-label-12 tabular-nums text-muted-foreground">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                          </div>
                          <p className="mt-8 text-label-13 font-semibold text-foreground">{capability}</p>
                          <p className="mt-2 text-copy-13 text-muted-foreground [text-wrap:pretty]">{item.notes[index]}</p>
                        </div>
                      )
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </Container>
    </section>
  )
}
