'use client'

import Link from 'next/link'
import { homeHalbert } from '@/content/homeHalbert'
import { cn } from '@/lib/utils'

type Expertise = (typeof homeHalbert.expertise.items)[number]

export function ExpertiseList({
  items,
  images = [],
  outcomeLabel,
}: {
  items: readonly Expertise[]
  images?: Array<string | undefined>
  outcomeLabel: string
}) {
  return (
    <ul className="mt-16 flex flex-col">
      {items.map((item, index) => {
        const reversed = index % 2 === 1

        return (
          <li key={item.number} className="border-t border-border py-10 first:border-t-0 first:pt-0 md:py-14">
            <article className="grid gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-12">
              <div className={cn('relative min-h-72 overflow-hidden border border-border bg-[#F5F5F2] lg:col-span-6 lg:min-h-[30rem]', reversed && 'lg:order-2 lg:col-start-7')}>
                {images[index] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={images[index]} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,#f5f5f2_0%,#ededf8_58%,#dcdcff_100%)]">
                    <span className="absolute bottom-7 left-7 text-[4rem] font-semibold leading-none tracking-[-0.04em] text-primary/22">
                      {item.number}
                    </span>
                  </div>
                )}
              </div>

              <div className={cn('flex flex-col justify-center lg:col-span-5', reversed ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-8')}>
                <div className="flex items-baseline gap-4">
                  <span aria-hidden className="text-sm font-medium tabular-nums text-primary">
                    {item.number}
                  </span>
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-foreground md:text-2xl">
                    {item.name}
                  </h3>
                </div>

                <p className="mt-5 max-w-[26ch] font-serif text-2xl leading-[1.2] tracking-[-0.01em] text-foreground md:text-[1.75rem]">
                  {item.promise}
                </p>

                <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-muted-foreground">{item.body}</p>

                <ul className="mt-7 grid gap-x-10 gap-y-2 sm:grid-cols-2">
                  {item.scope.map((entry) => (
                    <li key={entry} className="flex gap-3 text-sm text-foreground">
                      <span aria-hidden className="text-primary">—</span>
                      <span>{entry}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 border-t border-foreground pt-5">
                  <p className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                    {outcomeLabel}
                  </p>
                  <p className="mt-3 max-w-[52ch] text-base font-medium leading-relaxed text-foreground">
                    {item.outcome}
                  </p>
                </div>

                <p className="mt-6">
                  <Link
                    href={item.cta.href}
                    className="inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {item.cta.label}
                  </Link>
                </p>
              </div>
            </article>
          </li>
        )
      })}
    </ul>
  )
}
