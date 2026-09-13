'use client'

import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4'

/**
 * Glass Video Hero background from Rahil Vahora's 21st.dev component.
 *
 * The original demo is a full-screen video hero. Global Comm uses the exact
 * video/background behaviour as the Hero surface while keeping our own
 * approved content, Payload carousel, CTAs and client marquee layered above.
 */
export function HeroSection({
  className,
  children,
  ...props
}: ComponentProps<'section'>) {
  return (
    <section
      className={cn(
        'relative w-full overflow-hidden bg-[#2b2344] transition-all duration-500 ease-in-out',
        className,
      )}
      {...props}
    >
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      />

      {children ? <div className="relative z-10">{children}</div> : null}
    </section>
  )
}
