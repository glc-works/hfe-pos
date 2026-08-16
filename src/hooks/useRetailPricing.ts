import { useState, useCallback } from 'react'

export type UomUnit = 'Pcs' | 'Pack' | 'Karton' | 'Dus'

export interface RetailProductPriceInfo {
  id: string
  name: string
  barcode: string
  retailPrice: number
  wholesalePrice: number
  wholesaleMinQty: number
  uom: UomUnit
}

export interface RetailCartItem extends RetailProductPriceInfo {
  quantity: number
  effectiveUnitPrice: number
  isWholesaleApplied: boolean
  subtotalAmount: number
}

export const UOM_MULTIPLIERS: Record<string, number> = {
  Pcs: 1,
  Pack: 10,
  Dus: 40,
  Karton: 40,
}

/**
 * Converts quantity between UOM units (e.g. Karton ➔ Pcs, Pack ➔ Pcs)
 */
export function convertUomQty(qty: number, fromUom: UomUnit, toUom: UomUnit): number {
  const fromMult = UOM_MULTIPLIERS[fromUom] || 1
  const toMult = UOM_MULTIPLIERS[toUom] || 1
  const pcsCount = qty * fromMult
  return pcsCount / toMult
}

/**
 * Evaluates unit price based on quantity threshold vs wholesale tier
 */
export function evaluateItemPrice(
  qtyInPcs: number,
  retailPrice: number,
  wholesalePrice: number,
  wholesaleMinQty: number = 40
): { effectiveUnitPrice: number; isWholesaleApplied: boolean; totalItemAmount: number } {
  const isWholesaleApplied = qtyInPcs >= wholesaleMinQty
  const effectiveUnitPrice = isWholesaleApplied ? wholesalePrice : retailPrice
  const totalItemAmount = Math.round(qtyInPcs * effectiveUnitPrice)
  return { effectiveUnitPrice, isWholesaleApplied, totalItemAmount }
}

/**
 * Rapid Barcode multiplier parser (e.g. "10*8999901" or "5x8999902" -> qty 10, barcode "8999901")
 */
export function parseBarcodeSyntax(input: string): { qty: number; barcode: string } {
  const trimmed = input.trim()
  if (!trimmed) return { qty: 1, barcode: '' }

  const multiplierMatch = trimmed.match(/^(\d+)[*xX](\S+)$/)
  if (multiplierMatch) {
    const qty = parseInt(multiplierMatch[1], 10)
    const barcode = multiplierMatch[2]
    return { qty: isNaN(qty) || qty <= 0 ? 1 : qty, barcode }
  }

  return { qty: 1, barcode: trimmed }
}

export function useRetailPricing() {
  const [retailCart, setRetailCart] = useState<RetailCartItem[]>([])

  const addItemByBarcode = useCallback((item: RetailProductPriceInfo, qty: number = 1) => {
    setRetailCart((prevCart) => {
      const existingIndex = prevCart.findIndex((i) => i.barcode === item.barcode)
      let updatedCart = [...prevCart]

      if (existingIndex >= 0) {
        const currentItem = updatedCart[existingIndex]
        const newQty = currentItem.quantity + qty
        const evalResult = evaluateItemPrice(newQty, item.retailPrice, item.wholesalePrice, item.wholesaleMinQty)
        updatedCart[existingIndex] = {
          ...currentItem,
          quantity: newQty,
          effectiveUnitPrice: evalResult.effectiveUnitPrice,
          isWholesaleApplied: evalResult.isWholesaleApplied,
          subtotalAmount: evalResult.totalItemAmount,
        }
      } else {
        const evalResult = evaluateItemPrice(qty, item.retailPrice, item.wholesalePrice, item.wholesaleMinQty)
        updatedCart.push({
          ...item,
          quantity: qty,
          effectiveUnitPrice: evalResult.effectiveUnitPrice,
          isWholesaleApplied: evalResult.isWholesaleApplied,
          subtotalAmount: evalResult.totalItemAmount,
        })
      }
      return updatedCart
    })
  }, [])

  const updateItemQty = useCallback((barcode: string, newQty: number) => {
    setRetailCart((prevCart) => {
      if (newQty <= 0) {
        return prevCart.filter((i) => i.barcode !== barcode)
      }
      return prevCart.map((i) => {
        if (i.barcode === barcode) {
          const evalResult = evaluateItemPrice(newQty, i.retailPrice, i.wholesalePrice, i.wholesaleMinQty)
          return {
            ...i,
            quantity: newQty,
            effectiveUnitPrice: evalResult.effectiveUnitPrice,
            isWholesaleApplied: evalResult.isWholesaleApplied,
            subtotalAmount: evalResult.totalItemAmount,
          }
        }
        return i
      })
    })
  }, [])

  const clearCart = useCallback(() => {
    setRetailCart([])
  }, [])

  const totalCartAmount = retailCart.reduce((sum, item) => sum + item.subtotalAmount, 0)
  const totalItemCount = retailCart.reduce((sum, item) => sum + item.quantity, 0)

  return {
    retailCart,
    addItemByBarcode,
    updateItemQty,
    clearCart,
    totalCartAmount,
    totalItemCount,
    evaluateItemPrice,
    convertUomQty,
    parseBarcodeSyntax,
  }
}
