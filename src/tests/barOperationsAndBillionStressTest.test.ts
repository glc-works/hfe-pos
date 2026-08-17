import { describe, it, expect } from 'vitest'

export const formatCompactPriceHelper = (amount: number, language: 'id' | 'en'): string => {
  const abs = Math.abs(amount)
  const sign = amount < 0 ? '-' : ''

  if (language === 'en') {
    if (abs >= 1e12) return `${sign}IDR ${(abs / 1e12).toFixed(1).replace(/\.0$/, '')}T`
    if (abs >= 1e9) return `${sign}IDR ${(abs / 1e9).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')}B`
    if (abs >= 1e6) return `${sign}IDR ${(abs / 1e6).toFixed(1).replace(/\.0$/, '')}M`
    if (abs >= 1e3) return `${sign}IDR ${(abs / 1e3).toFixed(0)}K`
    return `IDR ${abs}`
  }

  // Indonesian (Zero-Ambiguity: rb, Jt, Bio, T)
  if (abs >= 1e12) return `${sign}Rp ${(abs / 1e12).toFixed(1).replace(/\.0$/, '').replace('.', ',')} T`
  if (abs >= 1e9) return `${sign}Rp ${(abs / 1e9).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1').replace('.', ',')} Bio`
  if (abs >= 1e6) return `${sign}Rp ${(abs / 1e6).toFixed(1).replace(/\.0$/, '').replace('.', ',')} Jt`
  if (abs >= 1e3) return `${sign}Rp ${(abs / 1e3).toFixed(0)} rb`
  return `Rp ${abs}`
}

describe('Bar Operations, Billion Stress-Test, and Zero-Ambiguity Currency Suite (L2-POS-74)', () => {
  it('correctly formats compact currency in Indonesian with zero Miliar/Million ambiguity', () => {
    expect(formatCompactPriceHelper(86000, 'id')).toBe('Rp 86 rb')
    expect(formatCompactPriceHelper(48000000, 'id')).toBe('Rp 48 Jt')
    expect(formatCompactPriceHelper(1850000000, 'id')).toBe('Rp 1,85 Bio')
    expect(formatCompactPriceHelper(2500000000000, 'id')).toBe('Rp 2,5 T')
  })

  it('correctly formats compact currency in English following global financial standard', () => {
    expect(formatCompactPriceHelper(86000, 'en')).toBe('IDR 86K')
    expect(formatCompactPriceHelper(48000000, 'en')).toBe('IDR 48M')
    expect(formatCompactPriceHelper(1850000000, 'en')).toBe('IDR 1.85B')
    expect(formatCompactPriceHelper(2500000000000, 'en')).toBe('IDR 2.5T')
  })

  it('maintains 100% integer arithmetic precision for billion-scale bar tabs and PB1 tax', () => {
    const subtotal = 1850000000 // Rp 1.850.000.000
    const pb1Tax = Math.round(subtotal * 0.10) // 10% PB1
    const serviceCharge = Math.round(subtotal * 0.05) // 5% Service
    const grandTotal = subtotal + pb1Tax + serviceCharge

    expect(pb1Tax).toBe(185000000)
    expect(serviceCharge).toBe(92500000)
    expect(grandTotal).toBe(2127500000)

    const minSpend = 2500000000
    const shortfall = Math.max(0, minSpend - subtotal)
    const progress = Math.min(100, Math.round((subtotal / minSpend) * 100))

    expect(shortfall).toBe(650000000)
    expect(progress).toBe(74)
  })
})
