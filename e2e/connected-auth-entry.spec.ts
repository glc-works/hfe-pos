import { expect, test } from '@playwright/test'

// Controlled BFF fixtures prove the consumer UI, not a live WorkOS/Core deployment.
for (const width of [360, 768, 1280]) {
  test(`person login remains separate from cashier authority at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    await page.route('**/auth/session', route => route.fulfill({
      json: { authenticated: true, user: { displayName: 'Bpk. Alexander Raden Christopher III', email: 'owner@example.test', emailVerified: true }, csrfToken: 'fixture-csrf' },
    }))
    await page.goto('/auth')
    await expect(page.getByRole('heading', { name: 'Masuk Hfe POS' })).toBeVisible()
    await expect(page.getByText(/Akses operasional memerlukan sesi staf/)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Keluar', exact: true })).toBeVisible()
    await expect(page.getByText('Kasir POS', { exact: true })).toHaveCount(0)
    expect(await page.locator('body').evaluate(element => element.scrollWidth <= window.innerWidth)).toBe(true)
    expect(await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) }))).toEqual({ local: [], session: [] })
  })
}

test('anonymous entry uses hosted login and never collects passwords', async ({ page }) => {
  await page.route('**/auth/session', route => route.fulfill({ json: { authenticated: false } }))
  await page.goto('/auth')
  await expect(page.getByRole('link', { name: 'Masuk', exact: true })).toHaveAttribute('href', '/auth/login')
  await expect(page.locator('input[type=password]')).toHaveCount(0)
})

test('local logout leaves the protected person view and uses CSRF', async ({ page }) => {
  await page.route('**/auth/session', route => route.fulfill({
    json: { authenticated: true, user: { displayName: null, email: 'owner@example.test', emailVerified: true }, csrfToken: 'fixture-csrf' },
  }))
  await page.route('**/auth/logout', async route => {
    expect(route.request().method()).toBe('POST')
    expect(route.request().headers()['x-csrf-token']).toBe('fixture-csrf')
    expect(route.request().postDataJSON()).toEqual({ scope: 'local' })
    await route.fulfill({ json: { redirectTo: '/auth' } })
  })
  await page.goto('/auth')
  await page.getByRole('button', { name: 'Keluar', exact: true }).click()
  await expect(page.getByRole('link', { name: 'Masuk', exact: true })).toBeVisible()
})

test('session failure shows refusal and never restores a persisted owner', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('hfe_pos_auth_user', JSON.stringify({ role: 'owner', user_id: 'stale-owner' }))
    localStorage.setItem('hfe_pos_auth_token', 'stale-bearer')
  })
  await page.route('**/auth/session', route => route.fulfill({ status: 503, json: { error: 'unavailable' } }))
  await page.goto('/auth')
  await expect(page.getByRole('alert')).toBeVisible()
  await expect(page.getByText('Kasir POS', { exact: true })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Coba lagi' })).toBeVisible()
  expect(await page.evaluate(() => localStorage.getItem('hfe_pos_auth_token'))).toBeNull()
})
