/**
 * One-time deployment hook for the approved homepage content.
 *
 * Preview deployments are a no-op. Production runs the existing idempotent
 * homepage seed with --apply. Remove this hook immediately after the content
 * has been verified in production.
 */
if (process.env.VERCEL_ENV !== 'production') {
  console.log('homepage seed: preview/non-Vercel environment — skipped')
  process.exit(0)
}

process.argv.push('--apply')
await import('./seed-homepage')
