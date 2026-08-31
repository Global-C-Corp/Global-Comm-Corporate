import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'

const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:3000'

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
    // CI exercises a production build, matching what Vercel serves.
    command: process.env.CI ? 'pnpm start' : 'pnpm dev',
    reuseExistingServer: !process.env.CI,
    url: baseURL,
    timeout: 180_000,
  },
})
