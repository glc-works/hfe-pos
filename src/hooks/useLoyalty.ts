import { useState, useMemo, useCallback } from 'react'
import { MenuItem } from '../types/pos'

export type LoyaltyTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
export type AllergenFlag = 'lactose' | 'nuts' | 'gluten' | 'seafood'
export type AllergenDisplayMode = 'grey-out' | 'hide'

export interface Voucher {
  code: string
  title: string
  description: string
  discountType: 'fixed' | 'percentage' | 'upgrade'
  discountValue: number
  minSpend: number
  expiresAt: string
  isClaimed?: boolean
}

export interface AllergenFilterOptions {
  allergens: AllergenFlag[]
  displayMode: AllergenDisplayMode
}

export const TIER_THRESHOLDS = {
  Bronze: { minSpend: 0, maxSpend: 499999, multiplier: 1.0, nextTier: 'Silver' as LoyaltyTier | null },
  Silver: { minSpend: 500000, maxSpend: 1999999, multiplier: 1.25, nextTier: 'Gold' as LoyaltyTier | null },
  Gold: { minSpend: 2000000, maxSpend: 4999999, multiplier: 1.5, nextTier: 'Platinum' as LoyaltyTier | null },
  Platinum: { minSpend: 5000000, maxSpend: Infinity, multiplier: 2.0, nextTier: null },
}

export const INITIAL_VOUCHERS: Voucher[] = [
  {
    code: 'VOUCHER-BIRTHDAY',
    title: 'Voucher Ulang Tahun',
    description: 'Diskon Spesial Rp 25.000 untuk perayaan ulang tahun Anda',
    discountType: 'fixed',
    discountValue: 25000,
    minSpend: 50000,
    expiresAt: '2026-12-31',
    isClaimed: true,
  },
  {
    code: 'VOUCHER-DISC10PCT',
    title: 'Diskon 10% Member',
    description: 'Potongan 10% untuk seluruh varian minuman & makanan',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 30000,
    expiresAt: '2026-09-30',
    isClaimed: true,
  },
  {
    code: 'VOUCHER-FREEUPGRADE',
    title: 'Gratis Upgrade Ukuran',
    description: 'Gratis upgrade dari Regular ke Large size (Hemat Rp 5.000)',
    discountType: 'upgrade',
    discountValue: 5000,
    minSpend: 20000,
    expiresAt: '2026-08-31',
    isClaimed: true,
  },
]

export function getTierMultiplier(tier: LoyaltyTier): number {
  return TIER_THRESHOLDS[tier]?.multiplier || 1.0
}

export function getTierForLifetimeSpend(spendIdr: number): LoyaltyTier {
  if (spendIdr >= 5000000) return 'Platinum'
  if (spendIdr >= 2000000) return 'Gold'
  if (spendIdr >= 500000) return 'Silver'
  return 'Bronze'
}

export function calculateVoucherDiscount(voucher: Voucher | null, subtotal: number): number {
  if (!voucher) return 0
  if (subtotal < voucher.minSpend) return 0

  if (voucher.discountType === 'percentage') {
    return Math.round(subtotal * (voucher.discountValue / 100))
  }
  if (voucher.discountType === 'fixed' || voucher.discountType === 'upgrade') {
    return Math.min(subtotal, voucher.discountValue)
  }
  return 0
}

const ALLERGEN_KEYWORDS: Record<AllergenFlag, string[]> = {
  lactose: ['lactose', 'milk', 'susu', 'cheese', 'keju', 'cream', 'krim', 'butter', 'mentega'],
  nuts: ['nuts', 'nut', 'peanut', 'almond', 'hazelnut', 'kacang', 'walnut', 'cashew', 'mete'],
  gluten: ['gluten', 'wheat', 'terigu', 'roti', 'bread', 'pastry', 'croissant', 'cake', 'biscuit'],
  seafood: ['seafood', 'shrimp', 'udang', 'fish', 'ikan', 'crab', 'kepiting', 'squid', 'cumi'],
}

export function isItemContainsAllergen(item: MenuItem & { allergens?: AllergenFlag[] }, allergens: AllergenFlag[]): boolean {
  if (!allergens || allergens.length === 0) return false

  if (item.allergens && Array.isArray(item.allergens)) {
    return allergens.some(allergen => item.allergens!.includes(allergen))
  }

  const nameAndCategory = `${item.name} ${item.category || ''} ${item.milkOption || ''}`.toLowerCase()
  let description = (item.description || '').toLowerCase()

  // Remove negative phrases to avoid false positives (e.g., "tanpa campuran susu", "dairy-free")
  description = description
    .replace(/tanpa\s+[a-z\s]+/g, '')
    .replace(/free\s+from\s+[a-z\s]+/g, '')
    .replace(/dairy\s*free/g, '')
    .replace(/non\s*lactose/g, '')

  const textToSearch = `${nameAndCategory} ${description}`

  return allergens.some(allergen => {
    const keywords = ALLERGEN_KEYWORDS[allergen] || [allergen]
    return keywords.some(kw => textToSearch.includes(kw))
  })
}

export function filterMenuItemsByAllergen<T extends MenuItem>(
  items: T[],
  allergens: AllergenFlag[],
  displayMode: AllergenDisplayMode
): { items: (T & { isDisabledAllergen?: boolean })[]; hiddenCount: number } {
  if (!allergens || allergens.length === 0) {
    return { items, hiddenCount: 0 }
  }

  if (displayMode === 'hide') {
    const filtered = items.filter(item => !isItemContainsAllergen(item, allergens))
    return {
      items: filtered,
      hiddenCount: items.length - filtered.length,
    }
  }

  const mapped = items.map(item => {
    const hasAllergen = isItemContainsAllergen(item, allergens)
    return {
      ...item,
      isDisabledAllergen: hasAllergen,
    }
  })

  return {
    items: mapped,
    hiddenCount: 0,
  }
}

export function useLoyalty(initialContactId?: string) {
  const [lifetimeSpend, setLifetimeSpend] = useState<number>(2750000)
  const [points, setPoints] = useState<number>(450)
  const [vouchers, setVouchers] = useState<Voucher[]>(INITIAL_VOUCHERS)
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null)
  const [allergenFlags, setAllergenFlags] = useState<AllergenFlag[]>(['lactose', 'nuts'])
  const [allergenDisplayMode, setAllergenDisplayMode] = useState<AllergenDisplayMode>('grey-out')

  const customerTier = useMemo(() => getTierForLifetimeSpend(lifetimeSpend), [lifetimeSpend])
  const tierMultiplier = useMemo(() => getTierMultiplier(customerTier), [customerTier])

  const applyVoucher = useCallback((code: string, subtotal: number) => {
    const found = vouchers.find(v => v.code.toUpperCase() === code.trim().toUpperCase())
    if (!found) {
      return { success: false, message: `Kode voucher "${code}" tidak ditemukan atau tidak valid`, discountAmount: 0 }
    }

    if (subtotal < found.minSpend) {
      return {
        success: false,
        message: `Minimal transaksi Rp ${found.minSpend.toLocaleString('id-ID')} untuk menggunakan voucher ini`,
        discountAmount: 0,
      }
    }

    const discount = calculateVoucherDiscount(found, subtotal)
    setAppliedVoucher(found)
    return {
      success: true,
      message: `Voucher ${found.title} berhasil dipasang! Potongan Rp ${discount.toLocaleString('id-ID')}`,
      discountAmount: discount,
    }
  }, [vouchers])

  const removeVoucher = useCallback(() => {
    setAppliedVoucher(null)
  }, [])

  const calculateAccruedPoints = useCallback((subtotal: number): number => {
    if (subtotal <= 0) return 0
    return Math.floor((subtotal / 1000) * tierMultiplier)
  }, [tierMultiplier])

  const redeemPointsForVoucher = useCallback(async (voucherCode: string): Promise<{ success: boolean; message: string }> => {
    const requiredPoints = 200
    if (points < requiredPoints) {
      return { success: false, message: `Poin tidak mencukupi (Butuh ${requiredPoints} poin, Anda punya ${points} poin)` }
    }

    const newVoucher: Voucher = {
      code: voucherCode || `VOUCHER-REDEEM-${Date.now().toString().slice(-4)}`,
      title: 'Voucher Penukaran Poin',
      description: 'Potongan Rp 15.000 hasil penukaran 200 poin loyalty',
      discountType: 'fixed',
      discountValue: 15000,
      minSpend: 30000,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isClaimed: true,
    }

    setPoints(prev => prev - requiredPoints)
    setVouchers(prev => [...prev, newVoucher])

    return { success: true, message: `Berhasil menukarkan ${requiredPoints} poin dengan Voucher Rp 15.000!` }
  }, [points])

  return {
    customerTier,
    points,
    lifetimeSpend,
    tierMultiplier,
    vouchers,
    appliedVoucher,
    allergenFlags,
    allergenDisplayMode,
    setAllergenFlags,
    setAllergenDisplayMode,
    applyVoucher,
    removeVoucher,
    calculateAccruedPoints,
    redeemPointsForVoucher,
    setLifetimeSpend,
    setPoints,
  }
}
