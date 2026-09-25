import { Container } from '@/components/ui/Layout'

/**
 * Our Method — six steps carried by typography and alignment alone.
 *
 * Thin vertical dividers between columns, no timeline circles, no icons, no
 * connecting arrows, no cards. The DOM order is 01 → 06 at every width, so
 * the sequence survives the mobile transformation.
 */
export function MethodSection({
  label,
  heading,
  intro,
  steps,
}: {
  label?: string | null
  heading?: string | null
  intro?: string | null
  steps: Array<{ id?: string | null; title?: string | null; body?: string | null }>
}) {
  if (steps.length === 0) return null

  return (
    <section className="bg-secondary" aria-labelledby="method-heading">
      <Container className="py-14 md:py-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            {label ? (
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {label}
              </p>
            ) : null}
            {heading ? (
              <h2
                id="method-heading"
                className="mt-5 max-w-[14ch] text-balance font-sans text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground md:mt-2 md:text-[3.875rem] md:leading-[1.05]"
              >
                {heading}
              </h2>
            ) : null}
          </div>

          {intro ? (
            <p className="max-w-[40ch] text-pretty text-base leading-relaxed text-muted-foreground lg:col-span-5">
              {intro}
            </p>
          ) : null}
        </div>

        <ol className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:mt-10 lg:grid-cols-6">
          {steps.map((step, index) => (
            <li
              key={step.id ?? step.title ?? index}
              className="border-b border-border py-7 sm:border-b-0 sm:border-l sm:px-6 sm:py-0 lg:px-5 [&:nth-child(-n+2)]:sm:border-l-0 lg:[&:nth-child(2)]:border-l lg:[&:first-child]:border-l-0 sm:[&:nth-child(-n+2)]:pl-0 lg:[&:nth-child(2)]:pl-5 lg:[&:first-child]:pl-0"
            >
              <span className="text-xs font-medium tabular-nums tracking-[0.08em] text-muted-foreground">
                {String(index + 1).padStart(2, '0')}
              </span>
              {step.title ? (
                <h3 className="mt-4 text-base font-semibold tracking-[-0.01em] text-foreground lg:mt-3">
                  {step.title}
                </h3>
              ) : null}
              {step.body ? (
                <p className="mt-2 max-w-[24ch] text-pretty text-sm leading-relaxed text-muted-foreground lg:leading-[1.45]">
                  {step.body}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
