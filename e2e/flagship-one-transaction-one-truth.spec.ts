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
})
