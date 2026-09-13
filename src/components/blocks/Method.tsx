import { ArrowRight } from 'lucide-react'
import { Container, SectionLabel } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { method } = homeV5

export function Method() {
  return (
    <section
      id="method"
      className="scroll-mt-20 border-b border-border bg-background"
      aria-labelledby="method-heading"
    >
      <Container className="py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-3">
            <SectionLabel>{method.label}</SectionLabel>
            <h2 id="method-heading" className="mt-4 max-w-[10ch] text-heading-40 text-foreground [text-wrap:balance]">
              How we work
            </h2>
            <p className="mt-4 max-w-[28ch] text-copy-14 text-muted-foreground">
              A structured process. Not a preset package.
            </p>
          </div>

          <div className="grid overflow-hidden border border-border bg-border shadow-[0_1px_2px_rgba(0,0,0,0.04),0_14px_36px_rgba(0,0,0,0.03)] sm:grid-cols-3 lg:col-span-9">
            {method.steps.map((step, index) => (
              <article key={step.number} className="relative min-h-64 bg-background p-6 md:p-7">
                <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-primary" />
                <div className="flex items-center justify-between gap-4">
                  <span className="font-[family-name:var(--font-geist-mono)] text-heading-24 tabular-nums text-foreground">
                    {step.number}
                  </span>
                  {index < method.steps.length - 1 ? (
                    <ArrowRight aria-hidden className="size-4 text-muted-foreground" />
                  ) : null}
                </div>
                <h3 className="mt-14 text-heading-16 text-foreground">{step.shortName}</h3>
                <p className="mt-3 max-w-[30ch] text-copy-13 text-muted-foreground [text-wrap:pretty]">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
