import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: [
      'tests/unit/**/*.spec.ts',
      'tests/integration/**/*.int.spec.ts',
      'tests/contract/**/*.contract.spec.ts',
    ],
    testTimeout: 20000,
    /**
     * Integration and contract suites boot Payload in their beforeAll hook,
     * and in dev mode that boot also reconciles the database schema. The
     * homepage sections added 18 tables, which pushed a cold boot past the
     * previous 30s allowance. This is boot cost, not a slow test.
     */
    hookTimeout: 120000,
  },
})
