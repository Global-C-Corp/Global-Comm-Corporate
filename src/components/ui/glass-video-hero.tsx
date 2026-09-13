'use client'

import { useEffect, useRef, useState, type ComponentProps } from 'react'
import { Pause, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4'

/**
 * Glass Video Hero from the selected component reference.
 *
 * The source component is kept as a full-bleed, autoplaying, muted, looping
 * video surface. Global Comm layers its own content above it.
 *
 * Refinements follow the website interface guidelines:
 * - explicit pause/play control for persistent autoplay
 * - reduced-motion users receive a paused frame
 * - 44px mobile-safe hit target
 * - explicit transitions instead of transition-all
 * - visible focus treatment
 */
export function HeroSection({
  className,
  children,
  ...props
}: ComponentProps<'section'>) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')

    const syncPreference = () => {
      const video = videoRef.current
      if (!video) return

      if (media.matches) {
        video.pause()
        setPaused(true)
      } else if (!paused) {
        void video.play().catch(() => undefined)
      }
    }

    syncPreference()
    media.addEventListener('change', syncPreference)

    return () => media.removeEventListener('change', syncPreference)
  }, [paused])

  const togglePlayback = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      void video.play().then(() => setPaused(false)).catch(() => undefined)
    } else {
      video.pause()
      setPaused(true)
    }
  }

  return (
    <section
      className={cn('relative w-full overflow-hidden bg-[#171525]', className)}
      {...props}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      />

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(5,5,10,0.78)_0%,rgba(5,5,10,0.54)_48%,rgba(5,5,10,0.28)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_82%_18%,rgba(0,0,255,0.30),transparent_30%)]"
        aria-hidden
      />

      <button
        type="button"
        onClick={togglePlayback}
        className="absolute right-5 top-5 z-20 grid size-11 place-items-center rounded-[4px] border border-white/25 bg-black/35 text-white shadow-[0_1px_2px_rgba(0,0,0,0.45),0_8px_24px_rgba(0,0,0,0.20)] backdrop-blur-xl transition-colors duration-150 hover:border-white/45 hover:bg-black/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label={paused ? 'Play hero background video' : 'Pause hero background video'}
        aria-pressed={paused}
      >
        {paused ? <Play aria-hidden className="size-4" /> : <Pause aria-hidden className="size-4" />}
      </button>

      {children ? <div className="relative z-10">{children}</div> : null}
    </section>
  )
}
