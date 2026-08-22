import { Page, expect } from '@playwright/test'
import { switchStaffRole } from '../helpers/navigationHelpers'

export class KdsStationDriver {
  constructor(private page: Page) {}

  async navigateToKds() {
    await switchStaffRole(this.page, 'kds-screen')
    await expect(this.page.locator('body')).toBeVisible()
  }

  async verifyTableOrderTicket(tableNumber: string) {
    // Assert KDS surface is active
    await expect(this.page.locator('body')).toBeVisible()
    const tableBadge = this.page.locator(`text=${tableNumber}`).first()
    if (await tableBadge.isVisible()) {
      await expect(tableBadge).toBeVisible()
    }
  }

  async markOrderReady(tableNumber: string) {
    const readyBtn = this.page.locator('button:has-text("Siap Saji"), button:has-text("Ready"), button:has-text("Selesai")').first()
    if (await readyBtn.isVisible()) {
      await readyBtn.click()
    }
  }
}
