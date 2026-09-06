import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'

const localBaseURL = process.env.CI ? 'http://127.0.0.1:3000' : 'http://localhost:3000'
const baseURL = process.env.E2E_BASE_URL ?? localBaseURL
const healthURL = new URL('/fr', baseURL).toString()

/**
 * `PLAYWRIGHT_CHROMIUM_PATH` lets a sandbox with a pre-installed browser
 * point at it instead of downloading a pinned build; CI uses the standard
 * `playwright install` path and leaves it unset.
 */
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH

export default defineConfig({
  testDir: './tests/e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  // The admin specs share a seeded user and a single page, so specs run
  // one at a time rather than racing each other.
  fullyParallel: false,
  workers: 1,
  // A cold dev server compiles routes on first hit (the admin panel
  // especially); CI runs against a production build and is much faster.
  timeout: process.env.CI ? 60_000 : 120_000,
  expect: { timeout: 15_000 },
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(executablePath ? { launchOptions: { executablePath } } : { channel: 'chromium' }),
      },
    },
  ],
  webServer: {
    // CI exercises the production build on an explicit IPv4 loopback address.
    // Probe a real localized page rather than relying on the root redirect as
    // the readiness signal. Pipe both streams so a future startup failure is
    // visible in Actions instead of surfacing only as a three-minute timeout.
    command: process.env.CI
      ? 'pnpm exec next start --hostname 127.0.0.1 --port 3000'
      : 'pnpm dev',
    reuseExistingServer: !process.env.CI,
    url: healthURL,
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 180_000,
  },
})
