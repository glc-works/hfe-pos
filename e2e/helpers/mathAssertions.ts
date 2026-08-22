import { expect } from '@playwright/test'
import { DynamicScenarioOptions } from './dynamicScenarioGenerator'

export function formatPrice(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`
}

export function assertFinancialInvariants(scenario: DynamicScenarioOptions) {
  // Invariant 1: Subtotal calculation
  const calculatedSubtotal = scenario.items.reduce(
    (acc, item) => acc + (item.basePrice + item.modifierExtra) * item.quantity,
    0
  )
  expect(calculatedSubtotal).toBe(scenario.subtotal)

  // Invariant 2: PB1 Tax 10%
  const expectedTax = Math.floor(scenario.subtotal * 0.1)
  expect(scenario.pb1Tax).toBe(expectedTax)

  // Invariant 3: Grand Total equation
  const expectedGrandTotal =
    scenario.subtotal + scenario.pb1Tax + scenario.packagingFee + scenario.tipAmount
  expect(scenario.grandTotal).toBe(expectedGrandTotal)

  // Invariant 4: Cashier change equation
  if (scenario.cashPaidAmount) {
    expect(scenario.cashPaidAmount - scenario.expectedChange).toBe(scenario.grandTotal)
  }

  // Invariant 5: Net Gross Profit
  expect(scenario.netGrossProfit).toBe(scenario.subtotal - scenario.cogsBomEstimate)
}
