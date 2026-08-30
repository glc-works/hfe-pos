import { expect, type Page } from '@playwright/test'
import demoAccess from '../../fixtures/demo/access.json' with { type: 'json' }

export { demoAccess }

export async function loginAsCanonicalDemoStaff(page: Page): Promise<void> {
  await page.goto('/?app=cafe')
  const staffCard = page.locator('button:has-text("Siti")').first()
  if (await staffCard.isVisible()) {
    await staffCard.click()
  }
  await expect(page.getByText('Masukkan 6 Digit PIN Kasir')).toBeVisible()
  await page.locator('select').selectOption(demoAccess.branchId)

  for (const digit of demoAccess.staff.pin) {
    await page.getByRole('button', { name: digit, exact: true }).click()
  }

  await page.getByRole('button', { name: 'Masuk ke Kasir POS ➔' }).click()
  await expect(page.getByText('Kasir POS', { exact: true })).toBeVisible()
  const storedUser = await page.evaluate(() => {
    const raw = window.sessionStorage.getItem('hfe_pos_auth_user')
    return raw ? JSON.parse(raw) : null
  })
  expect(storedUser).toMatchObject({
    user_id: demoAccess.staff.id,
    name: demoAccess.staff.name,
    role: demoAccess.staff.role,
    branch_id: demoAccess.branchId,
    authority_context_id: demoAccess.authorityContextId,
  })
}

export async function resetCanonicalDemoSession(page: Page): Promise<void> {
  await page.goto('/?app=cafe')
  await page.evaluate(() => {
    window.localStorage.clear()
    window.localStorage.setItem('hfe_pb1_tax_mode', '0')
    window.sessionStorage.clear()
  })
  await page.context().clearCookies()
  await page.reload()
  const staffPrompt = page.getByText('Pilih Profil Staf yang Bertugas')
  const pinPrompt = page.getByText('Masukkan 6 Digit PIN Kasir')
  await expect(staffPrompt.or(pinPrompt)).toBeVisible()
}
