import { Page, expect } from '@playwright/test'
import type { DynamicScenarioOptions } from '../helpers/dynamicScenarioGenerator'

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
    const payTableBill = this.page.getByRole('button', { name: /Bayar Tagihan Meja/i })
    await expect(payTableBill).toBeVisible()
    await payTableBill.click()
  }

  async processSettlement(scenario: Pick<DynamicScenarioOptions, 'paymentChannel'>) {
    if (scenario.paymentChannel === 'qris') {
      const qrisBtn = this.page.getByRole('button', { name: 'QRIS', exact: true }).last()
      await expect(qrisBtn).toBeVisible()
      await qrisBtn.click()
    } else {
      const cashBtn = this.page.getByRole('button', { name: /^(Tunai|Cash)$/ }).last()
      await expect(cashBtn).toBeVisible()
      await cashBtn.click()
    }

    const reviewBtn = this.page.getByRole('button', { name: /Bayar Sekarang|Tinjau Quote CORE|Review CORE Quote|Pay Now/i }).last()
    await expect(reviewBtn).toBeVisible()
    await reviewBtn.click()

    // Confirm only after the authoritative quote is visibly reviewed.
    const settleConfirmBtn = this.page.getByRole('button', { name: /Konfirmasi Pembayaran|Terima Quote Tertinjau|Accept Reviewed Quote|Confirm Payment/i }).last()
    await expect(settleConfirmBtn).toBeVisible()
    await settleConfirmBtn.click()
  }

  async verifySettlementSuccess(tableNumber: string) {
    // Assert POS surface is active and healthy
    await expect(this.page.locator('[data-financial-status="posted"]')).toBeVisible()
  }
}
