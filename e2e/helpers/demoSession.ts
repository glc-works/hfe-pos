import { expect, type Page } from '@playwright/test'
import demoAccess from '../../fixtures/demo/access.json' with { type: 'json' }

export { demoAccess }

export async function loginAsCanonicalDemoStaff(page: Page): Promise<void> {
  await page.goto('/?app=cafe')
  await expect(page.getByText('Masukkan 6 Digit PIN Kasir')).toBeVisible()
  await page.locator('select').selectOption(demoAccess.branchId)

  for (const digit of demoAccess.staff.pin) {
    await page.getByRole('button', { name: digit, exact: true }).click()
  }

  await page.getByRole('button', { name: 'Masuk ke Kasir POS ➔' }).click()
  await expect(page.getByText(`Selamat datang, ${demoAccess.staff.name}!`)).toBeVisible()
}

export async function resetCanonicalDemoSession(page: Page): Promise<void> {
  await page.goto('/?app=cafe')
  await page.evaluate(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
  })
  await page.context().clearCookies()
  await page.reload()
  await expect(page.getByText('Masukkan 6 Digit PIN Kasir')).toBeVisible()
}
