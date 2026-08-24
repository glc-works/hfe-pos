import { Page, expect } from '@playwright/test'
import { DynamicScenarioOptions } from '../helpers/dynamicScenarioGenerator'
import { formatPrice } from '../helpers/mathAssertions'

export class PosCashierDriver {
  constructor(private page: Page) {}

  async navigateToCashierPos() {
    await this.page.goto('/?app=cafe&surface=barista-pos')
    await expect(this.page.locator('body')).toBeVisible()
  }

  async selectOccupiedTable(tableNumber: string) {
    const tableCard = this.page.locator(`text=${tableNumber}`).first()
    await expect(tableCard).toBeVisible()
    await tableCard.click()
  }

  async processSettlement(scenario: DynamicScenarioOptions) {
    if (scenario.paymentChannel === 'qris') {
      const qrisBtn = this.page.locator('button:has-text("QRIS"), button:has-text("F8")').first()
      await expect(qrisBtn).toBeVisible()
      await qrisBtn.click()
    } else {
      const cashBtn = this.page.locator('button:has-text("Tunai"), button:has-text("Cash")').first()
      await expect(cashBtn).toBeVisible()
      await cashBtn.click()
    }

    // Confirm Settlement
    const settleConfirmBtn = this.page.locator('button:has-text("Bayar"), button:has-text("Selesaikan"), button:has-text("Konfirmasi"), button:has-text("Lunas")').first()
    await expect(settleConfirmBtn).toBeVisible()
    await settleConfirmBtn.click()
  }

  async verifySettlementSuccess(tableNumber: string) {
    // Assert POS surface is active and healthy
    await expect(this.page.locator('[data-financial-status="posted"]')).toBeVisible()
  }
}
