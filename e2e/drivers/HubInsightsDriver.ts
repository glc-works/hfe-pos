import { Page, expect } from '@playwright/test'
import { DynamicScenarioOptions } from '../helpers/dynamicScenarioGenerator'
import { formatPrice } from '../helpers/mathAssertions'
import { switchStaffRole } from '../helpers/navigationHelpers'

export class HubInsightsDriver {
  constructor(private page: Page) {}

  async navigateToMerchantHub() {
    await this.page.goto('/?app=cafe&surface=merchant-hub')
    await expect(this.page.locator('body')).toBeVisible()

    // Switch to Executive Insights Tab
    const insightsTabBtn = this.page.locator('button:has-text("Executive Insights"), button:has-text("Kinerja & Laba")').first()
    await expect(insightsTabBtn).toBeVisible()
    await insightsTabBtn.click()
  }

  async verifyRealtimeBusinessTruthCard(scenario: DynamicScenarioOptions) {
    // 1. Verify Lineage & Tagline
    const lineage = this.page.locator('text=1 Transaksi. 1 Kebenaran.').first()
    await expect(lineage).toBeVisible({ timeout: 10000 })

    // 2. Verify Posted to CORE badge
    const coreBadge = this.page.locator('text=Posted to CORE').first()
    await expect(coreBadge).toBeVisible()
  }

  async navigateToBranchManagement() {
    await this.page.goto('/?app=cafe&surface=branch-mgmt')
    await expect(this.page.locator('body')).toBeVisible()
  }

  async verifyHqNetworkImpactModule(scenario: DynamicScenarioOptions) {
    const hqModule = this.page.locator('text=HQ Network Impact').first()
    await expect(hqModule).toBeVisible({ timeout: 10000 })
  }
}
