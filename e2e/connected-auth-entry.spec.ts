import { expect, test } from '@playwright/test'

test('connected POS starts with ToGrow owner activation and exposes no synthetic PIN path', async ({ page }) => {
  await page.goto('/?app=cafe')

  await expect(page.getByRole('button', { name: /Owner/i }).first()).toBeVisible()
  await expect(page.getByLabel('Email Pemilik Usaha:')).toBeVisible()
  await expect(page.getByLabel('Kata Sandi Akun:')).toBeVisible()
  await expect(page.getByRole('button', { name: 'PIN Kasir' })).toHaveCount(0)
  await expect(page.getByText('Masukkan 6 Digit PIN Kasir')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Daftar' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Lanjutkan dengan Google' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Lanjutkan dengan Apple' })).toBeVisible()
})

test('owner activation enters the POS without reloading the browser document', async ({ page }) => {
  let loginRequests = 0
  let tokenRequests = 0

  await page.addInitScript(() => {
    const loads = Number(window.sessionStorage.getItem('hfe_test_document_loads') || '0')
    window.sessionStorage.setItem('hfe_test_document_loads', String(loads + 1))
  })
  await page.route('**/id/v1/auth/login', async (route) => {
    loginRequests += 1
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        access_token: 'opaque-session-token',
        refresh_token: 'opaque-refresh-token',
        token_type: 'Bearer',
        expires_at: '2099-08-25T02:00:00Z',
        refresh_expires_at: '2099-09-01T02:00:00Z',
        session_id: 'session-demo-1',
        user: {
          id: 'person-demo-1',
          email: 'flagship.cafe@demo.hfeit.test',
          display_name: 'Flagship Cafe Demo',
        },
      }),
    })
  })
  await page.route('**/id/v1/auth/hcb-token', async (route) => {
    tokenRequests += 1
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        access_token: 'signed-hcb-jwt',
        token_type: 'Bearer',
        expires_in: 900,
      }),
    })
  })

  await page.goto('/?app=cafe')
  await page.getByPlaceholder('owner@cafe.id').fill('flagship.cafe@demo.hfeit.test')
  await page.getByPlaceholder('••••••••').fill('synthetic-password')
  await page.getByRole('button', { name: 'Masuk sebagai Owner ➔' }).click()

  await expect(page.getByText('Kasir POS', { exact: true })).toBeVisible()
  expect(loginRequests).toBe(1)
  expect(tokenRequests).toBe(1)
  await expect.poll(() => page.evaluate(() => (
    window.sessionStorage.getItem('hfe_test_document_loads')
  ))).toBe('1')
})

test('social callback removes the one-time code and state from browser history before exchange', async ({ page }) => {
  await page.goto('/auth/callback?code=one-time-code&state=callback-state')

  await expect(page).toHaveURL('http://localhost:4173/auth/callback')
  await expect(page.getByRole('heading', { name: 'Login sosial gagal' })).toBeVisible()
})
