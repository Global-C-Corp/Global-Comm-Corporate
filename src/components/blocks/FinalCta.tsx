import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/blocks/Layout'
import { homeV5 } from '@/content/homeV5'

const { finalCTA } = homeV5

export function FinalCta() {
  return (
    <section className="bg-primary text-primary-foreground">
      <Container className="py-10 md:py-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-8">
            <p className="font-[family-name:var(--font-geist-mono)] text-label-12 uppercase tracking-[0.16em] text-primary-foreground/70">LET&apos;S TALK</p>
            <h2 className="mt-3 text-heading-40 md:text-heading-48">{finalCTA.heading}</h2>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <p className="text-copy-13 text-primary-foreground/75">{finalCTA.support}</p>
            <Button asChild variant="secondary" className="mt-5 bg-background text-foreground hover:bg-foreground hover:text-background">
              <Link href={finalCTA.action.href}>
                {finalCTA.action.label}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
