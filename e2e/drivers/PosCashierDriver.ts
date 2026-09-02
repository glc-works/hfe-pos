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
      const qrisBtn = this.page.getByRole('button', { name: /QRIS/i }).last()
      await expect(qrisBtn).toBeVisible()
      await qrisBtn.click()
    } else {
      const cashBtn = this.page.getByRole('button', { name: /Tunai|Cash/i }).last()
      await expect(cashBtn).toBeVisible()
      await cashBtn.click()
    }

    const settleBtn = this.page.getByRole('button', { name: /Selesaikan & Cetak Struk|Selesaikan Transaksi|Konfirmasi Pembayaran/i }).last()
    await expect(settleBtn).toBeVisible()
    await settleBtn.click()
  }

  async verifySettlementSuccess(tableNumber: string) {
    // Assert POS surface is active and healthy
    await expect(this.page.locator('[data-financial-status="posted"]')).toBeVisible()
  }
}
