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
      <div className="mx-auto w-full max-w-[80rem] px-5 py-24 sm:px-6 md:px-8 md:py-32 lg:px-12">
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
                className="mt-6 max-w-[14ch] text-balance font-sans text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground md:text-5xl"
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

        <ol className="mt-16 grid grid-cols-1 border-t border-border sm:grid-cols-2 lg:grid-cols-6">
          {steps.map((step, index) => (
            <li
              key={step.id ?? step.title ?? index}
              className="border-b border-border px-0 py-7 sm:border-b-0 sm:px-6 sm:py-8 sm:first:pl-0 lg:border-l lg:first:border-l-0 lg:first:pl-0"
            >
              <span className="text-xs font-medium tabular-nums tracking-[0.08em] text-primary">
                {String(index + 1).padStart(2, '0')}
              </span>
              {step.title ? (
                <h3 className="mt-4 text-base font-semibold tracking-[-0.01em] text-foreground">
                  {step.title}
                </h3>
              ) : null}
              {step.body ? (
                <p className="mt-2 max-w-[24ch] text-pretty text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
