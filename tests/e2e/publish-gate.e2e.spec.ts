import { expect, test } from '@playwright/test'
import { login } from '../helpers/login'
import { cleanupTestUser, seedBlockedClient, seedTestUser, testUser } from '../helpers/seedUser'

/**
 * CLAUDE.md §18, §27 — the gate states its conditions before the click, and
 * the compound action satisfies them in one step. The server guard is tested
 * separately; this covers the affordance.
 */
test.describe('publish gate', () => {
  let clientId: number

  test.beforeAll(async () => {
    await seedTestUser()
    clientId = await seedBlockedClient()
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test.beforeEach(async ({ page }) => {
    await login({ page, user: testUser })
  })

  test('names the unmet conditions and disables publish', async ({ page }) => {
    await page.goto(`http://localhost:3000/admin/collections/clients/${clientId}`)

    const gate = page.locator('.gc-publish-gate')
    await expect(gate).toBeVisible()
    await expect(gate.locator('button[disabled]').first()).toBeVisible()

    const reasons = gate.locator('.gc-publish-gate__reasons li')
    await expect(reasons.filter({ hasText: 'Editorial stage' })).toBeVisible()
    await expect(reasons.filter({ hasText: 'translation' })).toBeVisible()
  })

  test('publishes in one confirmed action, then clears', async ({ page }) => {
    await page.goto(`http://localhost:3000/admin/collections/clients/${clientId}`)

    await page.locator('.gc-publish-gate__action').click()

    const confirm = page.locator('.gc-publish-gate__confirm')
    await expect(confirm).toBeVisible()
    await expect(confirm.locator('li').filter({ hasText: 'publish the document' })).toBeVisible()

    await confirm.locator('.btn--style-primary').click()

    // The gate clears once nothing is blocking, and the document reads published.
    await expect(page.locator('.gc-publish-gate')).toBeHidden({ timeout: 20000 })
    await expect(page.locator('.status').first()).toContainText('Published')
  })
})
