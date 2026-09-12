'use client'

import { Search, BarChart3, LineChart, Settings2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Container, SectionLabel } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { platforms } = homeV5
const ICONS = [Search, BarChart3, LineChart, Settings2]

export function PlatformExpertise() {
  return (
    <section className="bg-background">
      <Container className="py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel>{platforms.label}</SectionLabel>
            <h2 className="mt-4 text-heading-40 text-foreground">{platforms.heading}</h2>
            <p className="mt-3 max-w-[34ch] text-copy-16 text-muted-foreground">{platforms.support}</p>
          </div>

          <div className="lg:col-span-8">
            <Tabs defaultValue={platforms.items[0].key}>
              <TabsList variant="line" className="h-auto w-full justify-start gap-8 overflow-x-auto border-b border-border p-0 pb-[5px]">
                {platforms.items.map((item) => (
                  <TabsTrigger key={item.key} value={item.key} className="h-auto flex-none px-0 py-3 text-label-13">
                    {item.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {platforms.items.map((item) => (
                <TabsContent key={item.key} value={item.key} className="pt-5">
                  <div className="grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-4">
                    {item.capabilities.map((capability, index) => {
                      const Icon = ICONS[index % ICONS.length]
                      return (
                        <div key={capability} className="bg-background p-5">
                          <Icon aria-hidden className="size-4 text-foreground" />
                          <p className="mt-5 text-label-13 font-semibold text-foreground">{capability}</p>
                          <p className="mt-2 text-copy-13 text-muted-foreground">{item.notes[index]}</p>
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
