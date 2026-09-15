import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ExpertiseList } from '@/components/design-preview/ExpertiseList'
import { homeHalbert } from '@/content/homeHalbert'
import { cn } from '@/lib/utils'

const { expertise } = homeHalbert

function Kicker({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={'text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-muted-foreground ' + (className ?? '')}>
      {children}
    </p>
  )
}

export function FrozenExpertise({
  className,
  images = [],
}: {
  className?: string
  images?: Array<string | undefined>
}) {
  return (
    <div
      className={cn(
        'font-[family-name:var(--gc-font-sans)] [--font-geist-sans:var(--gc-font-sans)] [--font-geist-mono:var(--gc-font-mono)]',
        className,
      )}
    >
      <section className="border-b border-border bg-background" aria-labelledby="expertises">
        <div className="mx-auto w-full max-w-[80rem] px-5 py-20 sm:px-8 md:py-28 lg:px-12">
          <div className="max-w-[52ch]">
            <Kicker>{expertise.kicker}</Kicker>
            <h2 id="expertises" className="mt-6 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-foreground md:text-[2.75rem]">
              {expertise.title}
            </h2>
            <div className="mt-8 space-y-4">
              {expertise.body.map((paragraph) => (
                <p key={paragraph} className="text-base leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <ExpertiseList
            items={expertise.items}
            images={images}
            outcomeLabel={expertise.outcomeLabel}
          />

          <div className="mt-14">
            <Button asChild variant="outline">
              <Link href={expertise.sectionCTA.href}>{expertise.sectionCTA.label}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
