import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('redirects root to the default locale', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveURL(/\/fr$/)
  })
})
