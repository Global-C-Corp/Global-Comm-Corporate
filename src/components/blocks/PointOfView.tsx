import { Container, SectionLabel } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { pointOfView } = homeV5

/**
 * Our Point of View — approved reference (04 §12.4).
 *
 * A single centred brand statement on the off-white surface, with the middle
 * clause set in the serif accent in brand blue. No card, no illustration, no
 * supporting copy: the whitespace is the composition.
 *
 * This is a server component. The section carries no state and the reference
 * shows no entrance behaviour, so there is nothing here to ship to the client.
 */
export function PointOfView() {
  return (
    <section
      id="point-of-view"
      className="scroll-mt-24 bg-[#FAFAF8]"
      aria-labelledby="point-of-view-heading"
    >
      <Container className="py-24 md:py-32">
        <div className="mx-auto max-w-[72rem] text-center">
          <SectionLabel>{pointOfView.label}</SectionLabel>

          <h2
            id="point-of-view-heading"
            className="mx-auto mt-8 max-w-[40ch] text-heading-32 leading-[1.14] tracking-[-0.03em] text-foreground [text-wrap:balance] md:text-heading-40"
          >
            {/* The reference breaks the statement after the first clause.
                Below `md` it wraps naturally rather than forcing a short
                second line on a narrow screen. */}
            <span className="md:block">{pointOfView.statement.lead}</span>{' '}
            <span className="md:block">
              <em className="font-serif italic text-primary">{pointOfView.statement.accent}</em>{' '}
              {pointOfView.statement.tail}
            </span>
          </h2>
        </div>
      </Container>
    </section>
  )
}
