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

// `export {}` makes this a module. Without it TypeScript rejects the
// top-level `await` below (TS1375), which fails `next build` and so fails
// every production deploy and the CI typecheck gate.
export {}

process.argv.push('--apply')
await import('./seed-homepage')
