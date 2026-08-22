export interface DynamicOrderItem {
  id: string
  name: string
  basePrice: number
  quantity: number
  modifierExtra: number
  temperature?: 'Iced' | 'Hot'
  milkOption?: string
  sugarLevel?: string
}

export interface DynamicScenarioOptions {
  seed: number
  tableNumber: string
  zoneName: string
  items: DynamicOrderItem[]
  fulfillmentMode: 'dine_in' | 'takeaway'
  packagingFee: number
  joinMembership: boolean
  customerPhone?: string
  tipAmount: number
  paymentChannel: 'qris' | 'cash_exact' | 'cash_overpay'
  cashPaidAmount?: number
  // Computed invariants
  subtotal: number
  pb1Tax: number
  grandTotal: number
  cogsBomEstimate: number
  netGrossProfit: number
  expectedChange: number
}

const AVAILABLE_TABLES = [
  { table: 'OUT-04', zone: 'Outdoor Garden' },
  { table: 'OUT-02', zone: 'Outdoor Garden' },
  { table: 'IND-01', zone: 'Indoor AC' },
  { table: 'IND-03', zone: 'Indoor AC' },
  { table: 'ROOF-02', zone: 'Rooftop Skybar' },
]

const SAMPLE_MENU_POOL = [
  { id: 'MN-001', name: 'Espresso Aren Latte', basePrice: 28000, isBeverage: true },
  { id: 'MN-002', name: 'Japanese Iced Drip', basePrice: 32000, isBeverage: true },
  { id: 'MN-003', name: 'Kyoto Matcha Latte', basePrice: 30000, isBeverage: true },
  { id: 'MN-004', name: 'Croissant Mentega Prancis', basePrice: 22000, isBeverage: false },
]

export function generateDynamicFlagshipScenario(customSeed?: number): DynamicScenarioOptions {
  const seed = customSeed ?? Date.now()
  // Pseudo-random helper from seed
  let state = seed
  const nextRandom = () => {
    state = (state * 9301 + 49297) % 233280
    return state / 233280
  }

  // 1. Random Table
  const tableObj = AVAILABLE_TABLES[Math.floor(nextRandom() * AVAILABLE_TABLES.length)]

  // 2. Random Items (1 to 2 items)
  const numItems = 1 + Math.floor(nextRandom() * 2)
  const shuffledMenu = [...SAMPLE_MENU_POOL].sort(() => nextRandom() - 0.5)
  const selectedItems: DynamicOrderItem[] = shuffledMenu.slice(0, numItems).map((m, idx) => {
    const qty = 1 + Math.floor(nextRandom() * 2)
    const hasOatMilk = m.isBeverage && nextRandom() > 0.6
    const modifierExtra = hasOatMilk ? 6000 : 0
    return {
      id: m.id,
      name: m.name,
      basePrice: m.basePrice,
      quantity: qty,
      modifierExtra,
      temperature: m.isBeverage ? (nextRandom() > 0.3 ? 'Iced' : 'Hot') : undefined,
      milkOption: hasOatMilk ? 'Oat Milk (+Rp 6.000)' : 'Fresh Milk',
      sugarLevel: m.isBeverage ? '100%' : undefined,
    }
  })

  // 3. Random Fulfillment & Membership
  const fulfillmentMode = nextRandom() > 0.5 ? 'dine_in' : 'takeaway'
  const packagingFee = fulfillmentMode === 'takeaway' ? 2000 : 0
  const joinMembership = nextRandom() > 0.4
  const customerPhone = joinMembership
    ? `0812${Math.floor(10000000 + nextRandom() * 90000000)}`
    : undefined

  // 4. Mathematical Derivations
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + (item.basePrice + item.modifierExtra) * item.quantity,
    0
  )
  const pb1Tax = Math.floor(subtotal * 0.1) // 10% PB1
  const tipAmount = nextRandom() > 0.7 ? 5000 : 0
  const grandTotal = subtotal + pb1Tax + packagingFee + tipAmount

  // 5. Payment Channel & Cash
  const paymentChannelRoll = nextRandom()
  let paymentChannel: 'qris' | 'cash_exact' | 'cash_overpay' = 'qris'
  let cashPaidAmount: number | undefined
  let expectedChange = 0

  if (paymentChannelRoll < 0.4) {
    paymentChannel = 'qris'
  } else if (paymentChannelRoll < 0.7) {
    paymentChannel = 'cash_exact'
    cashPaidAmount = grandTotal
    expectedChange = 0
  } else {
    paymentChannel = 'cash_overpay'
    // Round up to nearest 50.000 or 100.000
    cashPaidAmount = Math.ceil(grandTotal / 50000) * 50000
    if (cashPaidAmount === grandTotal) cashPaidAmount += 50000
    expectedChange = cashPaidAmount - grandTotal
  }

  // BOM COGS estimation (28% of subtotal)
  const cogsBomEstimate = Math.round(subtotal * 0.28)
  const netGrossProfit = subtotal - cogsBomEstimate

  return {
    seed,
    tableNumber: tableObj.table,
    zoneName: tableObj.zone,
    items: selectedItems,
    fulfillmentMode,
    packagingFee,
    joinMembership,
    customerPhone,
    tipAmount,
    paymentChannel,
    cashPaidAmount,
    subtotal,
    pb1Tax,
    grandTotal,
    cogsBomEstimate,
    netGrossProfit,
    expectedChange,
  }
}
