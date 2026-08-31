import { test, expect } from '@playwright/test'
import { login } from '../helpers/login'
import { seedTestUser, cleanupTestUser, testUser } from '../helpers/seedUser'

/**
 * Each test gets its own page and its own login. Sharing one page across the
 * describe block (and logging in once in beforeAll) made these tests depend
 * on each other's order and on a session that outlived a cold first render,
 * which showed up as a different test failing on each run.
 */
test.describe('Admin Panel', () => {
  test.beforeAll(async () => {
    await seedTestUser()
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test.beforeEach(async ({ page }) => {
    await login({ page, user: testUser })
  })

  test('can navigate to dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000/admin')
    await expect(page).toHaveURL(/\/admin\/?(\?.*)?$/)
    await expect(page.locator('span[title="Dashboard"]').first()).toBeVisible()
  })

  test('can navigate to list view', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/collections/users')
    // Payload appends its own list query (?depth=1&limit=10) once loaded, so
    // match the route rather than racing the exact URL.
    await expect(page).toHaveURL(/\/admin\/collections\/users(\?.*)?$/)
    await expect(page.locator('h1', { hasText: 'Users' }).first()).toBeVisible()
  })

  test('can navigate to edit view', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/collections/users/create')
    await expect(page).toHaveURL(/\/admin\/collections\/users\/[a-zA-Z0-9-_]+/)
    await expect(page.locator('input[name="email"]')).toBeVisible()
  })
})
