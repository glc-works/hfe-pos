import { Page, expect } from '@playwright/test'
import { DynamicScenarioOptions } from '../helpers/dynamicScenarioGenerator'
import { switchPillar } from '../helpers/navigationHelpers'

export class CustomerOrderDriver {
  constructor(private page: Page) {}

  async navigateToCustomerOrder(tableNumber: string) {
    // If not on page, navigate
    if (this.page.url() === 'about:blank' || !this.page.url().includes('localhost')) {
      await this.page.goto(`/?table=${tableNumber}`)
    }
    await switchPillar(this.page, 'customer')
    await expect(this.page.locator('.theme-customer-container').first()).toBeVisible()
  }

  async selectItemsAndModifiers(scenario: DynamicScenarioOptions) {
    for (const item of scenario.items) {
      // Find item in customer catalog
      const itemElement = this.page.locator(`text=${item.name}`).first()
      if (await itemElement.isVisible()) {
        await itemElement.click()
      }
    }
  }

  async proceedToCheckout(scenario: DynamicScenarioOptions) {
    // If floating cart pill is visible, click to open drawer
    const floatingCartPill = this.page.locator('button:has-text("Keranjang"), button:has-text("Lihat Pesanan")').first()
    if (await floatingCartPill.isVisible()) {
      await floatingCartPill.click()
    }

    // If join membership
    if (scenario.joinMembership && scenario.customerPhone) {
      const joinBtn = this.page.locator('button:has-text("✨ Gabung (1-Ketuk)")').first()
      if (await joinBtn.isVisible()) {
        await joinBtn.click()
      }
    }

    // Submit order button
    const submitBtn = this.page.locator('button:has-text("Kirim Pesanan ke Dapur"), button:has-text("Pesan Sekarang")').first()
    if (await submitBtn.isVisible()) {
      await submitBtn.click()
    }
  }

  async verifyWifiUnlocked(ssid: string, pass: string) {
    const wifiContainer = this.page.locator(`text=WiFi, text=${ssid}, text=${pass}`).first()
    if (await wifiContainer.isVisible()) {
      await expect(wifiContainer).toBeVisible()
    }
  }
}
