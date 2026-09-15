import { Container, SectionLabel } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { pointOfView } = homeV5

export function PointOfView() {
  return (
    <section
      id="point-of-view"
      className="scroll-mt-20 border-b border-white/10 bg-[#0A0A0A] text-white"
      aria-labelledby="point-of-view-heading"
    >
      <Container className="flex min-h-[72vh] items-center py-24 md:py-32">
        <div className="w-full">
          <div className="flex items-center gap-4">
            <SectionLabel className="text-white/52">{pointOfView.label}</SectionLabel>
            <span aria-hidden className="h-px flex-1 bg-white/12" />
          </div>

          <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-end">
            <h2
              id="point-of-view-heading"
              className="max-w-[16ch] text-heading-40 text-white [text-wrap:balance] md:text-heading-56 lg:col-span-8"
            >
              Better marketing doesn&apos;t begin with more execution. It begins with{' '}
              <span className="text-primary">better understanding.</span>
            </h2>

            <div className="grid gap-8 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
              <p className="max-w-[36ch] text-copy-16 text-white/62 [text-wrap:pretty]">{pointOfView.left}</p>

              <div className="border-t border-white/14 pt-6">
                <p className="max-w-[36ch] text-copy-16 text-white/62 [text-wrap:pretty]">{pointOfView.right}</p>
                <p className="mt-6 font-[family-name:var(--font-geist-mono)] text-label-12 uppercase tracking-[0.14em] text-white">
                  Insight drives impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
