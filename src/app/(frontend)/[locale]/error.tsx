'use client'

import { useEffect } from 'react'

/** No raw stack traces in production (CLAUDE.md §121). */
export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Page render failed', { digest: error.digest })
  }, [error])

  return (
    <main id="main" className="gc-container gc-page-header">
      <h1>Something went wrong</h1>
      <p className="gc-lead">The page could not be displayed. Please try again.</p>
      <div className="gc-button-row">
        <button type="button" className="gc-button" onClick={reset}>
          Retry
        </button>
      </div>
      {error.digest && <p className="gc-metric__source">Reference: {error.digest}</p>}
    </main>
  )
}
