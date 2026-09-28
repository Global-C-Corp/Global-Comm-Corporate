'use client'

import { useEffect } from 'react'

/** No raw stack traces in production (CLAUDE.md §121). */
export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Page render failed', { digest: error.digest })
  }, [error])

  return (
    <main id="main" className="gc-tw mx-auto w-full max-w-[76rem] px-6 py-24 md:px-10 md:py-32">
      <h1>Something went wrong</h1>
      <p className="mt-6 max-w-[62ch] text-lg text-foreground">The page could not be displayed. Please try again.</p>
      <div className="mt-10 flex flex-wrap gap-4">
        <button type="button" className="rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" onClick={reset}>
          Retry
        </button>
      </div>
      {error.digest && <p className="mt-8 font-mono text-xs text-muted-foreground">Reference: {error.digest}</p>}
    </main>
  )
}
