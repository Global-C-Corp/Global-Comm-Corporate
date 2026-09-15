'use client'

import { useEffect, useRef, useState } from 'react'
import { Container, SectionLabel } from '@/components/blocks/Layout'

export type ClientLogoItem = {
  id: string
  name: string
  logo: string
  href?: string
}

export function ClientLogoCloud({
  logos,
  kicker,
  heading,
  body,
}: {
  logos: ClientLogoItem[]
  kicker?: string
  heading?: string
  body?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setVisible(true)
        observer.disconnect()
      },
      { threshold: 0.16 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  if (logos.length === 0) return null

  return (
    <section ref={ref} id="clients" className="scroll-mt-20 border-b border-white/12 bg-[#0A0A0A] text-white" aria-labelledby="clients-heading">
      <Container className="py-20 md:py-28">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel className="text-white/54">{kicker || 'OUR CLIENTS'}</SectionLabel>
            <h2 id="clients-heading" className="mt-4 max-w-[15ch] text-heading-40 text-white [text-wrap:balance] md:text-heading-48">
              {heading || 'Trusted by brands, institutions & ambitious teams.'}
            </h2>
          </div>
          {body ? <p className="max-w-[40ch] text-copy-16 text-white/58 [text-wrap:pretty] lg:col-span-4 lg:col-start-9">{body}</p> : null}
        </div>

        <div className="mt-14 grid grid-cols-2 border-l border-t border-white/12 sm:grid-cols-3 lg:grid-cols-4">
          {logos.map((logo, index) => {
            const className = `flex min-h-32 items-center justify-center border-b border-r border-white/12 p-7 transition-[opacity,transform,filter,background-color] duration-500 ease-out hover:bg-white/[0.04] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white ${visible ? 'translate-y-0 opacity-100 blur-0' : '-translate-y-2.5 opacity-0 blur-[10px]'}`
            const style = { transitionDelay: `${Math.min(index, 12) * 100}ms` }

            const image = (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo.logo}
                alt={logo.name}
                loading="lazy"
                decoding="async"
                className="max-h-10 max-w-32 object-contain brightness-0 invert opacity-78 transition-opacity duration-150 hover:opacity-100"
              />
            )

            return logo.href ? (
              <a
                key={logo.id}
                href={logo.href}
                target="_blank"
                rel="noreferrer"
                translate="no"
                className={className}
                style={style}
              >
                {image}
              </a>
            ) : (
              <div key={logo.id} translate="no" className={className} style={style}>
                {image}
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
