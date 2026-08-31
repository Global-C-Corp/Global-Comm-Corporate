import { expect, test } from '@playwright/test'

const BASE = 'http://localhost:3000'
const locales = ['fr', 'en', 'es'] as const

/** CLAUDE.md §131-§133 — public site, canonical, hreflang and 404 behaviour. */
test.describe('public site', () => {
  test('redirects the root to the default locale', async ({ page }) => {
    await page.goto(BASE)
    await expect(page).toHaveURL(`${BASE}/fr`)
  })

  for (const locale of locales) {
    test(`renders the ${locale.toUpperCase()} home page`, async ({ page }) => {
      await page.goto(`${BASE}/${locale}`)
      await expect(page.locator('html')).toHaveAttribute('lang', locale)
      await expect(page.locator('h1')).toBeVisible()
    })

    test(`renders the ${locale.toUpperCase()} services page and a service detail page`, async ({ page }) => {
      await page.goto(`${BASE}/${locale}/services`)
      await expect(page.locator('h1')).toBeVisible()

      const firstService = page.locator(`a[href^="/${locale}/services/"]`).first()
      await expect(firstService).toBeVisible()
      await firstService.click()
      await expect(page.locator('h1')).toBeVisible()
    })

    test(`renders the ${locale.toUpperCase()} work, company and contact pages`, async ({ page }) => {
      for (const path of ['work', 'company', 'contact']) {
        const response = await page.goto(`${BASE}/${locale}/${path}`)
        expect(response?.status()).toBe(200)
        await expect(page.locator('h1')).toBeVisible()
      }
    })
  }

  test('self-canonicalizes each locale on the production host', async ({ page }) => {
    for (const locale of locales) {
      await page.goto(`${BASE}/${locale}`)
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
      expect(canonical).toBe(`https://globalcomm.ma/${locale}`)
    }
  })

  test('strips tracking parameters from the canonical URL', async ({ page }) => {
    await page.goto(`${BASE}/en?utm_source=linkedin&utm_campaign=launch`)
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toBe('https://globalcomm.ma/en')
  })

  test('emits reciprocal hreflang alternates including x-default', async ({ page }) => {
    await page.goto(`${BASE}/fr`)
    const hrefs = await page.locator('link[rel="alternate"]').evaluateAll((links) =>
      links.map((link) => [link.getAttribute('hreflang'), link.getAttribute('href')]),
    )
    const map = Object.fromEntries(hrefs)

    expect(map.fr).toBe('https://globalcomm.ma/fr')
    expect(map.en).toBe('https://globalcomm.ma/en')
    expect(map.es).toBe('https://globalcomm.ma/es')
    expect(map['x-default']).toBe('https://globalcomm.ma/fr')
  })

  test('sets og:url equal to the canonical URL', async ({ page }) => {
    await page.goto(`${BASE}/en/services`)
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content')
    expect(ogUrl).toBe(canonical)
  })

  test('uses the localized slug when switching language', async ({ page }) => {
    await page.goto(`${BASE}/fr/services/strategie`)
    const enLink = page.locator('.gc-lang a[hreflang="en"]')
    await expect(enLink).toHaveAttribute('href', '/en/services/strategy')
    await enLink.click()
    await expect(page).toHaveURL(`${BASE}/en/services/strategy`)
  })

  test('marks the work archive noindex when filters are applied', async ({ page }) => {
    await page.goto(`${BASE}/fr/work?service=strategie`)
    const robots = await page.locator('meta[name="robots"]').getAttribute('content')
    expect(robots).toContain('noindex')
  })

  test('returns 404 for an unknown slug', async ({ page }) => {
    const response = await page.goto(`${BASE}/fr/services/ceci-nexiste-pas`)
    expect(response?.status()).toBe(404)
  })

  test('does not expose drafts to anonymous visitors', async ({ request }) => {
    const response = await request.get(`${BASE}/api/projects?draft=true`)
    const body = await response.json()
    const statuses = (body.docs ?? []).map((doc: { _status?: string }) => doc._status)
    expect(statuses.every((status: string | undefined) => status === 'published')).toBe(true)
  })

  test('requires a secret to enter preview mode', async ({ request }) => {
    const response = await request.get(`${BASE}/preview?collection=home-page&locale=fr`, {
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
    await page.goto(`${BASE}/fr`)

    const toggle = page.locator('.gc-menu-toggle')
    await expect(toggle).toBeVisible()
    await toggle.click()
    await expect(page.locator('.gc-nav--open')).toBeVisible()
  })

  test('exposes a keyboard skip link', async ({ page }) => {
    await page.goto(`${BASE}/fr`)
    await page.keyboard.press('Tab')
    await expect(page.locator('.gc-skip-link')).toBeFocused()
  })
})
