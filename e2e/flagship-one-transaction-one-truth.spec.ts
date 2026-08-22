import { test, expect } from '@playwright/test'
import { generateDynamicFlagshipScenario } from './helpers/dynamicScenarioGenerator'
import { assertFinancialInvariants } from './helpers/mathAssertions'
import { CustomerOrderDriver } from './drivers/CustomerOrderDriver'
import { KdsStationDriver } from './drivers/KdsStationDriver'
import { PosCashierDriver } from './drivers/PosCashierDriver'
import { HubInsightsDriver } from './drivers/HubInsightsDriver'

test.describe('Flagship Café Journey: "One Transaction, One Truth" (5-Act E2E Suite)', () => {
  test('executes randomized guest-to-ledger journey proving real-time accounting truth', async ({ page }) => {
    // 🎲 Initialize Dynamic Scenario with Seed
    const scenario = generateDynamicFlagshipScenario()
    console.log(`[E2E Flagship] Running with SEED=${scenario.seed} on Table=${scenario.tableNumber}`)
    console.log(`[E2E Flagship] Items:`, scenario.items.map((i) => `${i.quantity}x ${i.name}`))
    console.log(`[E2E Flagship] Subtotal=Rp ${scenario.subtotal.toLocaleString('id-ID')}, GrandTotal=Rp ${scenario.grandTotal.toLocaleString('id-ID')}`)

    // Assert strict accounting mathematical invariants prior to execution
    assertFinancialInvariants(scenario)

    // Instantiate Action Drivers
    const customerDriver = new CustomerOrderDriver(page)
    const kdsDriver = new KdsStationDriver(page)
    const cashierDriver = new PosCashierDriver(page)
    const hubDriver = new HubInsightsDriver(page)

    // ==========================================
    // 🎬 ACT 1: Guest Touchpoint (Mobile ORDER)
    // ==========================================
    await test.step('Act 1: Anonymous Guest QR Order at Table with Value-Led Membership', async () => {
      await customerDriver.navigateToCustomerOrder(scenario.tableNumber)
      await customerDriver.selectItemsAndModifiers(scenario)
      await customerDriver.proceedToCheckout(scenario)
    })

    // ==========================================
    // 🍳 ACT 2: Operations & KDS Station Routing
    // ==========================================
    await test.step('Act 2: KDS Order Ticket Routing & Preparation', async () => {
      await kdsDriver.navigateToKds()
      await kdsDriver.verifyTableOrderTicket(scenario.tableNumber)
      await kdsDriver.markOrderReady(scenario.tableNumber)
    })

    // ==========================================
    // 💻 ACT 3: Cashier Floor Plan, Settlement & WiFi Unlock
    // ==========================================
    await test.step('Act 3: POS Cashier Multi-Tender Settlement & WiFi Unlock', async () => {
      await cashierDriver.navigateToCashierPos()
      await cashierDriver.selectOccupiedTable(scenario.tableNumber)
      await cashierDriver.processSettlement(scenario)
      await cashierDriver.verifySettlementSuccess(scenario.tableNumber)

      // Verify guest screen unlocks WiFi
      await customerDriver.navigateToCustomerOrder(scenario.tableNumber)
      await customerDriver.verifyWifiUnlocked('Kopitiam_Senopati_Guest', 'kopiuenak2026')
    })

    // ==========================================
    // 📊 ACT 4: Realtime Business Truth & Ledger Lineage
    // ==========================================
    await test.step('Act 4: Realtime Business Truth Card in Merchant Hub', async () => {
      await hubDriver.navigateToMerchantHub()
      await hubDriver.verifyRealtimeBusinessTruthCard(scenario)
    })

    // ==========================================
    // 🏢 ACT 5: Franchise / HQ Network Impact Movement
    // ==========================================
    await test.step('Act 5: HQ Multi-Outlet Network Sales Impact', async () => {
      await hubDriver.navigateToBranchManagement()
      await hubDriver.verifyHqNetworkImpactModule(scenario)
    })
  })

  test('executes deep in-flight visual regression across all 5 acts (Deterministic Seed)', async ({ page }) => {
    // Deterministic scenario for pixel-by-pixel visual regression
    const deterministicScenario = generateDynamicFlagshipScenario(20260822)
    const customerDriver = new CustomerOrderDriver(page)
    const kdsDriver = new KdsStationDriver(page)
    const cashierDriver = new PosCashierDriver(page)
    const hubDriver = new HubInsightsDriver(page)

    // ACT 1: Customer Mobile View
    await page.setViewportSize({ width: 390, height: 844 })
    await customerDriver.navigateToCustomerOrder(deterministicScenario.tableNumber)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(300)

    // 📸 Snapshot 1: Customer Initial Catalog
    await expect(page).toHaveScreenshot('in-flight-act1-customer-catalog.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    })

    // Add item to cart
    await customerDriver.selectItemsAndModifiers(deterministicScenario)
    await page.waitForTimeout(300)

    // 📸 Snapshot 2: Active Floating Cart Dock
    await expect(page).toHaveScreenshot('in-flight-act1-floating-cart.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    })

    // Open Checkout
    const floatingCartPill = page.locator('button:has-text("Keranjang"), button:has-text("Lihat Pesanan")').first()
    if (await floatingCartPill.isVisible()) {
      await floatingCartPill.click()
      await page.waitForTimeout(300)
    }

    // 📸 Snapshot 3: Checkout Summary View
    await expect(page).toHaveScreenshot('in-flight-act1-checkout-summary.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    })

    // Submit Order to Kitchen
    const submitBtn = page.locator('button:has-text("Kirim Pesanan ke Dapur"), button:has-text("Pesan Sekarang")').first()
    if (await submitBtn.isVisible()) {
      await submitBtn.click()
      await page.waitForTimeout(400)
    }

    // ACT 2: KDS Kitchen Display
    await page.setViewportSize({ width: 1280, height: 800 })
    await kdsDriver.navigateToKds()
    await page.waitForTimeout(400)

    // 📸 Snapshot 4: KDS Incoming Kitchen Ticket
    await expect(page).toHaveScreenshot('in-flight-act2-kds-incoming-ticket.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    })

    // Mark ready
    await kdsDriver.markOrderReady(deterministicScenario.tableNumber)
    await page.waitForTimeout(300)

    // ACT 3: POS Cashier Workstation
    await cashierDriver.navigateToCashierPos()
    await page.waitForTimeout(400)

    // 📸 Snapshot 5: POS Floor Plan with Occupied Table
    await expect(page).toHaveScreenshot('in-flight-act3-pos-floor-plan.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    })

    // Select table to open Cart & Calculation
    await cashierDriver.selectOccupiedTable(deterministicScenario.tableNumber)
    await page.waitForTimeout(300)

    // 📸 Snapshot 6: POS Cart & Cash Calculation
    await expect(page).toHaveScreenshot('in-flight-act3-pos-cart-calculation.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    })

    // Settle bill
    await cashierDriver.processSettlement(deterministicScenario)
    await page.waitForTimeout(400)

    // ACT 4: Customer Touchpoint WiFi Unlock
    await page.setViewportSize({ width: 390, height: 844 })
    await customerDriver.navigateToCustomerOrder(deterministicScenario.tableNumber)
    await page.waitForTimeout(400)

    // 📸 Snapshot 7: Customer WiFi Unlocked Banner
    await expect(page).toHaveScreenshot('in-flight-act4-customer-wifi-unlocked.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    })

    // ACT 5: Merchant Hub & HQ Insights
    await page.setViewportSize({ width: 1280, height: 800 })
    await hubDriver.navigateToMerchantHub()
    await page.waitForTimeout(400)

    // 📸 Snapshot 8: Hub Realtime Business Truth Card
    await expect(page).toHaveScreenshot('in-flight-act5-hub-business-truth.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    })

    // HQ Network Impact
    await hubDriver.navigateToBranchManagement()
    await page.waitForTimeout(400)

    // 📸 Snapshot 9: HQ Multi-Outlet Network Impact
    await expect(page).toHaveScreenshot('in-flight-act5-hq-network-impact.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    })
  })
})
