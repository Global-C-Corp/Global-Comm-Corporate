import type { Page } from '@playwright/test'

/**
 * Deterministic readiness for a full-page screenshot.
 *
 * `networkidle` was the wrong signal here, and raising its timeout would only
 * have made the same hang take longer. Two things kept the homepage from ever
 * settling while the other 39 baseline cases passed:
 *
 *   - the App Router prefetches every `<Link>` entering the viewport, and the
 *     homepage carries the most links of any template, so requests keep
 *     trickling and the 500ms silence window never opens;
 *   - the hero and Selected Work carousels render every slide, but the slides
 *     outside the visible track never intersect the viewport, so their
 *     `loading="lazy"` images are never requested at all. Twelve of the
 *     homepage's twenty-five images stayed `complete === false` for good.
 *
 * Readiness is defined instead by what the screenshot actually depends on:
 *
 *   1. the shell is present,
 *   2. every image is eligible to load, including the ones lazy loading will
 *      never reach,
 *   3. below-the-fold media has been given the chance to start,
 *   4. every image has finished loading,
 *   5. web fonts are ready and every image has decoded.
 *
 * Nothing here sleeps for a fixed period; each step waits on a condition the
 * page reports itself, so two independent Playwright invocations settle on the
 * same pixels.
 */
export async function settleForScreenshot(page: Page): Promise<void> {
  await page.locator('main').first().waitFor({ state: 'visible' })

  /**
   * A carousel slide sitting outside the visible track is clipped, not
   * scrolled to, so its lazy image is never fetched and the wait below would
   * never resolve. Promoting every image to eager costs nothing visually —
   * the clipped slides stay clipped — and makes the wait finite.
   */
  await page.evaluate(() => {
    for (const image of Array.from(document.images)) {
      image.loading = 'eager'
      if (!image.complete && image.getAttribute('src')) {
        // Re-assigning src restarts a fetch that lazy loading deferred.
        image.src = image.src
      }
    }
  })

  /**
   * A full-page screenshot captures below the fold, where project and client
   * media is lazy. Scrolling once starts those requests, so the wait below
   * settles on real images rather than recording empty boxes in the baseline.
   */
  await page.evaluate(async () => {
    const frame = () => new Promise((resolve) => requestAnimationFrame(resolve))
    const step = Math.max(window.innerHeight, 400)

    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await frame()
      await frame()
    }

    window.scrollTo(0, 0)
    await frame()
  })

  try {
    await page.waitForFunction(
      () => Array.from(document.images).every((image) => image.complete),
      undefined,
      { timeout: 30_000 },
    )
  } catch (error) {
    // A stuck image is a real defect in the page, not a slow test. Name it,
    // so the failure points at the asset instead of at a timeout.
    const pending = await page.evaluate(() =>
      Array.from(document.images)
        .filter((image) => !image.complete)
        .map((image) => image.currentSrc || image.src || '(no src)'),
    )
    throw new Error(
      `Images never finished loading, so the screenshot would be non-deterministic:\n  ${pending.join('\n  ')}\n\nOriginal error: ${String(error)}`,
    )
  }

  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all(
      Array.from(document.images).map(async (image) => {
        try {
          await image.decode()
        } catch {
          // Broken or optional media is already represented by its rendered
          // fallback; decoding must not block the baseline.
        }
      }),
    )
  })
}
