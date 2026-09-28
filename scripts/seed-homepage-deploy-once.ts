/**
 * One-time production-only deployment hook for the approved homepage seed.
 * Preview and local builds are no-ops.
 */
async function run() {
  if (process.env.VERCEL_ENV !== 'production') {
    console.log('homepage seed: preview/non-production environment — skipped')
    return
  }

  process.argv.push('--apply')
  await import('./seed-homepage')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
