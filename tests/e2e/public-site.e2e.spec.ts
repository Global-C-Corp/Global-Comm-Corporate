import { expect, test } from '@playwright/test'
import { services } from '../../src/content/services'

const BASE = 'http://localhost:3000'

/**
 * CLAUDE.md §131-§133 — public site, canonical and 404 behaviour.
 *
 * The site is single-language French and unprefixed, so there is one URL per
 * page and no hreflang cluster. Payload still stores three locales; nothing
 * public routes on them.
 */
test.describe('public site', () => {
  test('redirects the root to /home', async ({ page }) => {
    await page.goto(BASE)
    await expect(page).toHaveURL(`${BASE}/home`)
  })

  test('renders the home page in French', async ({ page }) => {
    await page.goto(`${BASE}/home`)
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('renders the services page and every service detail page', async ({ page }) => {
    await page.goto(`${BASE}/services`)
    await expect(page.locator('h1')).toBeVisible()

    for (const service of services) {
      const response = await page.goto(`${BASE}/services/${service.slug}`)
      expect(response?.status(), `/services/${service.slug}`).toBe(200)
      await expect(page.locator('h1')).toBeVisible()
    }
  })

  test('renders the work, company and contact pages', async ({ page }) => {
    for (const path of ['work', 'company', 'contact']) {
      const response = await page.goto(`${BASE}/${path}`)
      expect(response?.status(), `/${path}`).toBe(200)
      await expect(page.locator('h1')).toBeVisible()
    }
  })

  test('self-canonicalizes on the production host', async ({ page }) => {
    for (const path of ['home', 'services', 'work', 'company', 'contact']) {
      await page.goto(`${BASE}/${path}`)
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
      expect(canonical).toBe(`https://globalcomm.ma/${path}`)
    }
  })

  test('strips tracking parameters from the canonical URL', async ({ page }) => {
    await page.goto(`${BASE}/home?utm_source=linkedin&utm_campaign=launch`)
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toBe('https://globalcomm.ma/home')
  })

  test('emits no hreflang alternates', async ({ page }) => {
    await page.goto(`${BASE}/home`)
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0)
  })

  test('sets og:url equal to the canonical URL', async ({ page }) => {
    await page.goto(`${BASE}/services`)
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content')
    expect(ogUrl).toBe(canonical)
  })

  test('marks the work archive noindex when filters are applied', async ({ page }) => {
    await page.goto(`${BASE}/work?service=strategie`)
    const robots = await page.locator('meta[name="robots"]').getAttribute('content')
    expect(robots).toContain('noindex')
  })

  test('returns 404 for an unknown slug', async ({ page }) => {
    const response = await page.goto(`${BASE}/services/ceci-nexiste-pas`)
    expect(response?.status()).toBe(404)
  })

  test('does not expose drafts to anonymous visitors', async ({ request }) => {
    const response = await request.get(`${BASE}/api/projects?draft=true`)
    const body = await response.json()
    const statuses = (body.docs ?? []).map((doc: { _status?: string }) => doc._status)
    expect(statuses.every((status: string | undefined) => status === 'published')).toBe(true)
  })

  test('requires a secret to enter preview mode', async ({ request }) => {
    const response = await request.get(`${BASE}/preview?collection=projects`, {
      maxRedirects: 0,
    })
    expect(response.status()).toBe(401)
  })

  test('serves robots.txt and a sitemap', async ({ request }) => {
    const robots = await request.get(`${BASE}/robots.txt`)
    expect(robots.status()).toBe(200)
    expect(await robots.text()).toContain('User-Agent')

    const sitemap = await request.get(`${BASE}/sitemap.xml`)
    expect(sitemap.status()).toBe(200)
  })

  test('supports mobile navigation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`${BASE}/home`)

    // Role and ARIA state, not class names — this asserts the behaviour a
    // keyboard or screen-reader user actually depends on.
    // Identified by its ARIA wiring rather than a role filter on `expanded`:
    // that state flips on click, so filtering by it loses the element.
    // Scoped to the global header: the homepage FAQ accordion exposes the
    // same aria-expanded/aria-controls pairing on each of its triggers, and
    // this test is about the navigation sheet, not about them.
    const toggle = page.locator('header button[aria-expanded][aria-controls]')
    await expect(toggle).toBeVisible()
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')

    const panelId = await toggle.getAttribute('aria-controls')
    expect(panelId).toBeTruthy()
    await expect(page.locator(`#${panelId}`)).toBeVisible()
  })

  test('exposes a keyboard skip link', async ({ page }) => {
    await page.goto(`${BASE}/home`)
    await page.keyboard.press('Tab')
    const skipLink = page.locator('a[href="#main"]')
    await expect(skipLink).toBeFocused()
    // It must also become visible on focus, or it helps nobody.
    await expect(skipLink).toBeVisible()
  })
})
