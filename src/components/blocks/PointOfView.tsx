'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Container, SectionLabel } from '@/components/blocks/Layout'

const STATEMENT = 'We make your brand impossible to ignore, easy to trust, and built to grow.'

export function PointOfView() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const words = useMemo(() => STATEMENT.split(' '), [])

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setVisible(true)
        observer.disconnect()
      },
      { threshold: 0.35 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      id="point-of-view"
      className="relative flex min-h-[92vh] scroll-mt-20 items-center overflow-hidden border-b border-white/10 bg-[#0A0A0A] text-white"
      aria-labelledby="brand-statement-heading"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,255,0.34),transparent_34%),linear-gradient(180deg,#0A0A0A_0%,#111111_100%)]" />

      <Container className="relative z-10 py-24 md:py-32">
        <div className="mx-auto max-w-[72rem] text-center">
          <SectionLabel className="text-white/50">OUR POINT OF VIEW</SectionLabel>

          <h2
            id="brand-statement-heading"
            className="mx-auto mt-8 max-w-[18ch] text-heading-40 leading-[1.08] tracking-[-0.035em] text-white [text-wrap:balance] md:text-heading-56 lg:text-heading-64"
          >
            {words.map((word, index) => (
              <span
                key={`${word}-${index}`}
                className={`inline-block transition-[opacity,transform,filter] duration-500 ease-out motion-reduce:transition-none ${visible ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-3 opacity-0 blur-[8px]'}`}
                style={{ transitionDelay: `${index * 55}ms` } as CSSProperties}
              >
                {word}&nbsp;
              </span>
            ))}
          </h2>
        </div>
      </Container>
    </section>
  )
}
