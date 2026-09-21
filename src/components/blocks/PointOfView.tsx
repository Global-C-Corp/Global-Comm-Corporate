import { Container, SectionLabel } from '@/components/ui/Layout'

/**
 * Our Point of View — approved reference (04 §12.4).
 *
 * A single centred brand statement on the off-white surface. No card, no
 * illustration, no supporting copy: the whitespace is the composition.
 *
 * `accent` is the one clause the reference sets in the serif italic in brand
 * blue. It is optional because it is a composition detail rather than a
 * separate idea: when the CMS carries no accent phrase the statement renders
 * whole, which is the correct fallback — never an invented emphasis.
 *
 * This is a server component. The section carries no state and the reference
 * shows no entrance behaviour, so there is nothing here to ship to the client.
 */
export function PointOfView({
  label,
  heading,
  accent,
}: {
  label?: string | null
  heading?: string | null
  accent?: string | null
}) {
  if (!heading) return null

  /**
   * The accent is emphasised in place rather than recomposed, so the sentence
   * a translator wrote stays exactly as written even when the phrase is absent
   * from that locale.
   */
  const index = accent ? heading.indexOf(accent) : -1
  const before = index >= 0 ? heading.slice(0, index) : heading
  const after = index >= 0 && accent ? heading.slice(index + accent.length) : ''

  return (
    <section
      id="point-of-view"
      className="scroll-mt-24 bg-[#FAFAF8]"
      aria-labelledby="point-of-view-heading"
    >
      <Container className="py-24 md:py-32">
        <div className="mx-auto max-w-[72rem] text-center">
          {label ? <SectionLabel>{label}</SectionLabel> : null}

          <h2
            id="point-of-view-heading"
            className="mx-auto mt-8 max-w-[40ch] text-heading-32 leading-[1.14] tracking-[-0.03em] text-foreground [text-wrap:balance] md:text-heading-40"
          >
            {before}
            {index >= 0 && accent ? (
              <em className="font-serif italic text-primary">{accent}</em>
            ) : null}
            {after}
          </h2>
        </div>
      </Container>
    </section>
  )
}
