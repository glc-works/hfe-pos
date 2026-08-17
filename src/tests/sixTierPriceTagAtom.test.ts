import { describe, it, expect } from 'vitest'
import { formatCompactPriceHelper } from './barOperationsAndBillionStressTest.test'

export const getAdaptivePriceString = (
  amount: number,
  mode: 'full' | 'compact' | 'adaptive',
  isVipSpan: boolean = false,
  language: 'id' | 'en' = 'en'
): string => {
  if (mode === 'compact') {
    return formatCompactPriceHelper(amount, language)
  }
  if (mode === 'adaptive') {
    if (!isVipSpan && amount >= 1_000_000) {
      return formatCompactPriceHelper(amount, language)
    }
    return language === 'en' ? `IDR ${amount.toLocaleString('en-US')}` : `Rp ${amount.toLocaleString('id-ID')}`
  }
  return language === 'en' ? `IDR ${amount.toLocaleString('en-US')}` : `Rp ${amount.toLocaleString('id-ID')}`
}

describe('Tier 2 PriceTag Atom & 6-Tier Layer Isolation Suite (L2-POS-75)', () => {
  it('correctly formats full mode across all monetary values', () => {
    expect(getAdaptivePriceString(86000, 'full', false, 'en')).toBe('IDR 86,000')
    expect(getAdaptivePriceString(24500000, 'full', false, 'en')).toBe('IDR 24,500,000')
    expect(getAdaptivePriceString(1850000000, 'full', true, 'en')).toBe('IDR 1,850,000,000')
  })

  it('correctly resolves adaptive mode in narrow 1-slot compact cards without clipping', () => {
    // Small amount -> Full string (comfortable fit in 110px)
    expect(getAdaptivePriceString(86000, 'adaptive', false, 'en')).toBe('IDR 86,000')
    expect(getAdaptivePriceString(120000, 'adaptive', false, 'en')).toBe('IDR 120,000')

    // Large amount (>= 1M) on 1-slot -> Auto-compacts to prevent overflow
    expect(getAdaptivePriceString(24500000, 'adaptive', false, 'en')).toBe('IDR 24.5M')
    expect(getAdaptivePriceString(48000000, 'adaptive', false, 'en')).toBe('IDR 48M')
    expect(getAdaptivePriceString(24500000, 'adaptive', false, 'id')).toBe('Rp 24,5 Jt')
    expect(getAdaptivePriceString(48000000, 'adaptive', false, 'id')).toBe('Rp 48 Jt')
  })

  it('preserves full integer precision for VIP 2-slot cards in adaptive mode', () => {
    // VIP card has ample horizontal space (240px+) -> Always preserves full numbers
    expect(getAdaptivePriceString(1850000000, 'adaptive', true, 'en')).toBe('IDR 1,850,000,000')
    expect(getAdaptivePriceString(1850000000, 'adaptive', true, 'id')).toBe('Rp 1.850.000.000')
  })
})
