export interface ShiftCashInput {
  initialFloat: number
  cashSales: number
  pettyCashExpenses: number
  cashCounted: number
}

export interface ShiftReconciliationResult {
  initialFloat: number
  cashSales: number
  pettyCashExpenses: number
  expectedCash: number
  cashCounted: number
  variance: number
  status: 'MATCHED' | 'SHORTAGE' | 'OVERAGE'
  requiresManagerApproval: boolean
  journalEntry: {
    debitAccount: string
    creditAccount: string
    amount: number
  }
}

/**
 * Reconciles cashier shift end blind cash count against expected drawer cash.
 * Follows strict double-entry ledger posting rules for Hfe Core.
 */
export function reconcileShiftCash(input: ShiftCashInput): ShiftReconciliationResult {
  const expectedCash = input.initialFloat + input.cashSales - input.pettyCashExpenses
  const variance = input.cashCounted - expectedCash

  let status: 'MATCHED' | 'SHORTAGE' | 'OVERAGE' = 'MATCHED'
  let requiresManagerApproval = false
  let debitAccount = '1101 - Kas Kasir (Cash on Hand)'
  let creditAccount = '4101 - Pendapatan Penjualan F&B'

  if (variance < 0) {
    status = 'SHORTAGE'
    requiresManagerApproval = Math.abs(variance) > 25000
    debitAccount = '5109 - Beban Selisih Kas Shift (Cash Shortage)'
    creditAccount = '1101 - Kas Kasir (Cash on Hand)'
  } else if (variance > 0) {
    status = 'OVERAGE'
    requiresManagerApproval = variance > 50000
    debitAccount = '1101 - Kas Kasir (Cash on Hand)'
    creditAccount = '4109 - Pendapatan Lain-lain (Cash Overage)'
  }

  return {
    initialFloat: input.initialFloat,
    cashSales: input.cashSales,
    pettyCashExpenses: input.pettyCashExpenses,
    expectedCash,
    cashCounted: input.cashCounted,
    variance,
    status,
    requiresManagerApproval,
    journalEntry: {
      debitAccount,
      creditAccount,
      amount: Math.abs(variance)
    }
  }
}

export interface ShiftSoldItemIngredient {
  name: string
  amount: number
  unit: string
  unitCost: number
}

export interface ShiftSoldItem {
  id: string
  name: string
  category: string
  quantity: number
  price: number
  cogsPerUnit: number
  channel?: 'in_store' | 'delivery_ojol' | 'dine_in' | 'takeaway' | string
  bomIngredients?: ShiftSoldItemIngredient[]
}

export interface TheoreticalIngredientUsage {
  name: string
  totalAmount: number
  unit: string
  totalCost: number
}

export interface ShiftBomMarginInput {
  soldItems: ShiftSoldItem[]
  cashVariance?: number
  ojolCommissionRate?: number // e.g. 0.20
}

export interface ShiftBomMarginResult {
  totalOmzet: number
  totalOjolSales: number
  ojolCommission: number
  totalBomCogs: number
  grossProfit: number
  grossMarginPercent: number
  netOperationalMargin: number
  netMarginPercent: number
  cashVariance: number
  finalSettlementProfit: number
  ingredientUsages: TheoreticalIngredientUsage[]
}

export const DEFAULT_SHIFT_SOLD_ITEMS: ShiftSoldItem[] = [
  {
    id: 'ITEM-01',
    name: 'Espresso Aren Latte',
    category: 'Coffee',
    quantity: 24,
    price: 28000,
    cogsPerUnit: 9200,
    channel: 'in_store',
    bomIngredients: [
      { name: 'Biji Kopi Gayo House Blend', amount: 18, unit: 'g', unitCost: 250 },
      { name: 'Fresh Milk Pasteurisasi', amount: 150, unit: 'ml', unitCost: 23.333 },
      { name: 'Sirup Gula Aren Organik', amount: 20, unit: 'ml', unitCost: 60 },
      { name: 'Paper Cup & Lid 12oz', amount: 1, unit: 'pcs', unitCost: 800 }
    ]
  },
  {
    id: 'ITEM-02',
    name: 'Iced Americano Single Origin',
    category: 'Coffee',
    quantity: 18,
    price: 22000,
    cogsPerUnit: 4800,
    channel: 'delivery_ojol',
    bomIngredients: [
      { name: 'Biji Kopi Gayo House Blend', amount: 18, unit: 'g', unitCost: 250 },
      { name: 'Cup Dingin & Straw Biodegradable', amount: 1, unit: 'pcs', unitCost: 300 }
    ]
  },
  {
    id: 'ITEM-03',
    name: 'French Butter Croissant',
    category: 'Pastry',
    quantity: 12,
    price: 25000,
    cogsPerUnit: 8500,
    channel: 'in_store',
    bomIngredients: [
      { name: 'Adonan Pastry Elle & Vire', amount: 80, unit: 'g', unitCost: 100 },
      { name: 'Packaging Paper Bag Foodgrade', amount: 1, unit: 'pcs', unitCost: 500 }
    ]
  },
  {
    id: 'ITEM-04',
    name: 'Truffle Parmesan Fries',
    category: 'Snack',
    quantity: 8,
    price: 35000,
    cogsPerUnit: 12000,
    channel: 'delivery_ojol',
    bomIngredients: [
      { name: 'Kentang Beku Shoestring', amount: 150, unit: 'g', unitCost: 40 },
      { name: 'Minyak Truffle & Keju Parmesan', amount: 15, unit: 'g', unitCost: 400 }
    ]
  }
]

/**
 * Calculates theoretical BoM ingredient consumption and real-time operational margin for a shift.
 * Accounts for 20% online delivery commission and cash drawer variance.
 */
export function calculateShiftBomMargin(input: ShiftBomMarginInput): ShiftBomMarginResult {
  const ojolRate = input.ojolCommissionRate ?? 0.20
  const cashVariance = input.cashVariance ?? 0

  let totalOmzet = 0
  let totalOjolSales = 0
  let totalBomCogs = 0
  const ingredientMap: Record<string, { totalAmount: number; unit: string; totalCost: number }> = {}

  for (const item of input.soldItems) {
    const itemTotal = item.price * item.quantity
    totalOmzet += itemTotal

    const isOjol = item.channel === 'delivery_ojol' || item.channel === 'delivery' || item.channel === 'ojol'
    if (isOjol) {
      totalOjolSales += itemTotal
    }

    const itemCogs = item.cogsPerUnit * item.quantity
    totalBomCogs += itemCogs

    if (item.bomIngredients && item.bomIngredients.length > 0) {
      for (const ing of item.bomIngredients) {
        const usageAmount = ing.amount * item.quantity
        const usageCost = ing.unitCost > 0
          ? Math.round(ing.amount * ing.unitCost * item.quantity)
          : Math.round((item.cogsPerUnit / item.bomIngredients.length) * item.quantity)

        if (!ingredientMap[ing.name]) {
          ingredientMap[ing.name] = {
            totalAmount: 0,
            unit: ing.unit,
            totalCost: 0
          }
        }
        ingredientMap[ing.name].totalAmount += usageAmount
        ingredientMap[ing.name].totalCost += usageCost
      }
    }
  }

  const ojolCommission = Math.round(totalOjolSales * ojolRate)
  const grossProfit = totalOmzet - totalBomCogs
  const grossMarginPercent = totalOmzet > 0 ? (grossProfit / totalOmzet) * 100 : 0
  const netOperationalMargin = totalOmzet - ojolCommission - totalBomCogs
  const netMarginPercent = totalOmzet > 0 ? (netOperationalMargin / totalOmzet) * 100 : 0
  const finalSettlementProfit = netOperationalMargin + (cashVariance < 0 ? cashVariance : 0)

  const ingredientUsages: TheoreticalIngredientUsage[] = Object.entries(ingredientMap).map(([name, data]) => ({
    name,
    totalAmount: data.totalAmount,
    unit: data.unit,
    totalCost: data.totalCost
  }))

  return {
    totalOmzet,
    totalOjolSales,
    ojolCommission,
    totalBomCogs,
    grossProfit,
    grossMarginPercent,
    netOperationalMargin,
    netMarginPercent,
    cashVariance,
    finalSettlementProfit,
    ingredientUsages
  }
}
