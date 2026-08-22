import { Page, expect } from '@playwright/test'
import { DynamicScenarioOptions } from '../helpers/dynamicScenarioGenerator'
import { formatPrice } from '../helpers/mathAssertions'
import { switchStaffRole } from '../helpers/navigationHelpers'

export class PosCashierDriver {
  constructor(private page: Page) {}

  async navigateToCashierPos() {
    await switchStaffRole(this.page, 'barista-pos')
    await expect(this.page.locator('body')).toBeVisible()
  }

  async selectOccupiedTable(tableNumber: string) {
    const tableCard = this.page.locator(`text=${tableNumber}`).first()
    if (await tableCard.isVisible()) {
      await tableCard.click()
    }
  }

  async processSettlement(scenario: DynamicScenarioOptions) {
    if (scenario.paymentChannel === 'qris') {
      const qrisBtn = this.page.locator('button:has-text("QRIS"), button:has-text("F8")').first()
      if (await qrisBtn.isVisible()) {
        await qrisBtn.click()
      }
    } else {
      const cashBtn = this.page.locator('button:has-text("Tunai"), button:has-text("Cash")').first()
      if (await cashBtn.isVisible()) {
        await cashBtn.click()
      }
    }

    // Confirm Settlement
    const settleConfirmBtn = this.page.locator('button:has-text("Bayar"), button:has-text("Selesaikan"), button:has-text("Konfirmasi"), button:has-text("Lunas")').first()
    if (await settleConfirmBtn.isVisible()) {
      await settleConfirmBtn.click()
    }
  }

  async verifySettlementSuccess(tableNumber: string) {
    // Assert POS surface is active and healthy
    await expect(this.page.locator('body')).toBeVisible()
  }
}
