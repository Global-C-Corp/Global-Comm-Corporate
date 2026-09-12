import { Container, SectionLabel } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { pointOfView } = homeV5

export function PointOfView() {
  return (
    <section className="bg-background">
      <Container className="py-16 md:py-20">
        <SectionLabel>{pointOfView.label}</SectionLabel>
        <span aria-hidden className="mt-3 block h-0.5 w-10 bg-primary" />

        <div className="mt-7 grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2 className="text-heading-32 text-foreground md:text-heading-48 lg:col-span-6">
            Better marketing doesn&apos;t begin with more execution. It begins with{' '}
            <span className="text-primary">better understanding.</span>
          </h2>

          <p className="text-copy-16 text-muted-foreground lg:col-span-3 lg:col-start-7">{pointOfView.left}</p>

          <div className="lg:col-span-3">
            <p className="text-copy-16 text-muted-foreground">{pointOfView.right}</p>
            <p className="mt-5 font-[family-name:var(--font-geist-mono)] text-label-12 uppercase tracking-[0.14em] text-foreground">
              Insight drives impact.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
