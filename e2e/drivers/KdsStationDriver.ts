import { Page, expect } from '@playwright/test'

export class KdsStationDriver {
  constructor(private page: Page) {}

  async navigateToKds() {
    await this.page.goto('/?app=cafe&surface=kds-screen')
    await expect(this.page.locator('body')).toBeVisible()
  }

  async verifyTableOrderTicket(tableNumber: string) {
    // Assert KDS surface is active
    await expect(this.page.locator('body')).toBeVisible()
    const tableBadge = this.page.locator(`text=${tableNumber}`).first()
    await expect(tableBadge).toBeVisible()
  }

  async markOrderReady(tableNumber: string) {
    const readyBtn = this.page.locator('button:has-text("Siap Saji"), button:has-text("Ready"), button:has-text("Selesai")').first()
    await expect(readyBtn).toBeVisible()
    await readyBtn.click()
  }
}
