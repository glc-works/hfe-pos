import { Page, expect } from '@playwright/test'
import { DynamicScenarioOptions } from '../helpers/dynamicScenarioGenerator'

export class CustomerOrderDriver {
  constructor(private page: Page) {}

  async navigateToCustomerOrder(tableNumber: string) {
    await this.page.goto(`/?app=customer&table=${tableNumber}`)
    await expect(this.page.locator('.theme-customer-container').first()).toBeVisible()
  }

  async selectItemsAndModifiers(scenario: DynamicScenarioOptions) {
    for (const item of scenario.items) {
      // Find item in customer catalog
      const itemElement = this.page.locator(`text=${item.name}`).first()
      await expect(itemElement).toBeVisible()
      await itemElement.click()
    }
  }

  async proceedToCheckout(scenario: DynamicScenarioOptions) {
    // If floating cart pill is visible, click to open drawer
    const floatingCartPill = this.page.getByText(/^(Keranjang|Lihat Pesanan|Checkout)$/).first()
    await expect(floatingCartPill).toBeVisible()
    await floatingCartPill.click()

    // If join membership
    if (scenario.joinMembership && scenario.customerPhone) {
      const joinBtn = this.page.locator('button:has-text("✨ Gabung (1-Ketuk)")').first()
      await expect(joinBtn).toBeVisible()
      await joinBtn.click()
    }

    // Submit order button
    const submitBtn = this.page.locator('button:has-text("Kirim Pesanan ke Dapur"), button:has-text("Bayar Pesanan Sekarang"), button:has-text("Pesan Sekarang")').first()
    await expect(submitBtn).toBeVisible()
    await submitBtn.click()
  }

  async verifyWifiUnlocked(ssid: string, pass: string) {
    const wifiContainer = this.page.locator(`text=WiFi, text=${ssid}, text=${pass}`).first()
    await expect(wifiContainer).toBeVisible()
  }
}
