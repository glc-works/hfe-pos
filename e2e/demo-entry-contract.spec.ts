import { expect, test } from '@playwright/test'
import {
  loginAsCanonicalDemoStaff,
  resetCanonicalDemoSession,
} from './helpers/demoSession'

test('documented synthetic staff can enter and reset the local demo in a clean browser', async ({ page }) => {
  await resetCanonicalDemoSession(page)
  await loginAsCanonicalDemoStaff(page)

  await expect(page.getByText('Kasir POS', { exact: true })).toBeVisible()
  await expect(page.getByText('Masukkan 6 Digit PIN Kasir')).toBeHidden()

  await resetCanonicalDemoSession(page)

  await expect(page.getByText('Masukkan 6 Digit PIN Kasir')).toBeVisible()
})
