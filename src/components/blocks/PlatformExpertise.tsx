'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Container, SectionLabel } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { platforms } = homeV5

/**
 * Expertise plateformes — le premier moment shadcn visible de la page.
 *
 * Tabs en variant `line` du registre officiel : le trait actif est un
 * pseudo-élément piloté par `data-state`, donc l'état est lisible sans
 * remplissage ni ombre. Radix fournit la navigation clavier (flèches,
 * Home/End) et le lien aria entre onglet et panneau.
 *
 * Le contenu ne revendique aucun partenariat ni certification : ce sont des
 * capacités génériques, vraies pour n'importe quelle agence qui opère ces
 * canaux.
 */
export function PlatformExpertise() {
  return (
    <section className="bg-background" aria-labelledby="platforms-heading">
      <Container className="pb-28 md:pb-36">
        <div className="grid gap-x-6 gap-y-4 lg:grid-cols-12">
          <SectionLabel className="lg:col-span-3">{platforms.label}</SectionLabel>
          <h2
            id="platforms-heading"
            className="max-w-[32ch] text-heading-24 text-foreground lg:col-span-8 lg:col-start-5"
          >
            {platforms.support}
          </h2>
        </div>

        <Tabs defaultValue={platforms.items[0].key} className="mt-12 gap-0">
          <TabsList variant="line" className="h-auto w-full justify-start gap-8 border-b border-border p-0 pb-[5px]">
            {platforms.items.map((item) => (
              <TabsTrigger
                key={item.key}
                value={item.key}
                className="h-auto flex-none px-0 py-3 text-label-14 tracking-[0.04em]"
              >
                {item.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {platforms.items.map((item) => (
            <TabsContent
              key={item.key}
              value={item.key}
              className="pt-10 data-[state=active]:animate-none"
            >
              <div className="grid gap-x-6 gap-y-8 lg:grid-cols-12">
                <p className="max-w-[38ch] text-copy-20 text-foreground lg:col-span-5">{item.body}</p>
                <ul className="flex flex-wrap gap-x-8 gap-y-3 lg:col-span-6 lg:col-start-7 lg:justify-end">
                  {item.capabilities.map((capability) => (
                    <li
                      key={capability}
                      className="font-[family-name:var(--font-geist-mono)] text-label-12 uppercase text-muted-foreground"
                    >
                      {capability}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Container>
    </section>
  )
}
