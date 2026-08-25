import { expect, test } from '@playwright/test'

test('connected POS starts with ToGrow owner activation and exposes no synthetic PIN path', async ({ page }) => {
  await page.goto('/?app=cafe')

  await expect(page.getByRole('button', { name: 'Owner', exact: true })).toBeVisible()
  await expect(page.getByPlaceholder('owner@cafe.id')).toBeVisible()
  await expect(page.getByRole('button', { name: 'PIN Kasir' })).toHaveCount(0)
  await expect(page.getByText('Masukkan 6 Digit PIN Kasir')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Daftar' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Lanjutkan dengan Google' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Lanjutkan dengan Apple' })).toBeVisible()
})

test('social callback removes the one-time code and state from browser history before exchange', async ({ page }) => {
  await page.goto('/auth/callback?code=one-time-code&state=callback-state')

  await expect(page).toHaveURL('http://localhost:4173/auth/callback')
  await expect(page.getByRole('heading', { name: 'Login sosial gagal' })).toBeVisible()
})
