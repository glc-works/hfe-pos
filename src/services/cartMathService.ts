import { PB1TaxMode } from '../types/pos'

export interface CartItemMath {
  price: number
  quantity: number
  milkOption?: string
}

export interface CartTotals {
  rawSubtotal: number
  totalDiscount: number
  discountedSubtotal: number
  calculatedServiceFee: number
  calculatedPB1Tax: number
  grandTotalBill: number
  totalCartCount: number
}

export function calculateCartTotals(
  cart: CartItemMath[],
  taxPB1Mode: PB1TaxMode = 1,
  serviceFeeRate: number = 5,
  selectedTipAmount: number = 0,
  promoDiscount: number = 0,
  voucherDiscount: number = 0
): CartTotals {
  const rawSubtotal = cart.reduce((sum, item) => {
    let itemPrice = item.price
    if (item.milkOption?.includes('Oat Milk') || item.milkOption?.includes('Almond Milk')) {
      itemPrice += 5000
    }
    return sum + itemPrice * item.quantity
  }, 0)

  const totalDiscount = promoDiscount + voucherDiscount
  const discountedSubtotal = Math.max(0, rawSubtotal - totalDiscount)

  const calculatedServiceFee = Math.round(discountedSubtotal * (serviceFeeRate / 100))

  let calculatedPB1Tax = 0
  if (taxPB1Mode === 1) {
    calculatedPB1Tax = Math.round(discountedSubtotal * 0.10)
  } else if (taxPB1Mode === 2) {
    calculatedPB1Tax = Math.round(discountedSubtotal - discountedSubtotal / 1.10)
  }

  const grandTotalBill =
    taxPB1Mode === 1
      ? discountedSubtotal + calculatedServiceFee + calculatedPB1Tax + selectedTipAmount
      : discountedSubtotal + calculatedServiceFee + selectedTipAmount

  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0)

  return {
    rawSubtotal,
    totalDiscount,
    discountedSubtotal,
    calculatedServiceFee,
    calculatedPB1Tax,
    grandTotalBill,
    totalCartCount,
  }
}
