import { ArrowRight } from 'lucide-react'
import { Container, SectionLabel } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { method } = homeV5

export function Method() {
  return (
    <section className="bg-background" aria-labelledby="method-heading">
      <Container className="py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-3">
            <SectionLabel>{method.label}</SectionLabel>
            <h2 id="method-heading" className="mt-4 text-heading-40 text-foreground">How we work</h2>
            <p className="mt-3 text-copy-14 text-muted-foreground">A structured process. Not a preset package.</p>
          </div>

          <div className="grid gap-px bg-border sm:grid-cols-3 lg:col-span-9">
            {method.steps.map((step) => (
              <article key={step.number} className="group bg-background p-6 transition-colors hover:bg-[#FAFAF8]">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-heading-32 text-foreground">{step.number}</span>
                  <span className="grid size-8 place-items-center rounded-full border border-border transition-colors group-hover:bg-foreground group-hover:text-background">
                    <ArrowRight aria-hidden className="size-3.5" />
                  </span>
                </div>
                <h3 className="mt-8 text-heading-16 text-foreground">{step.shortName}</h3>
                <p className="mt-2 text-copy-13 text-muted-foreground">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
