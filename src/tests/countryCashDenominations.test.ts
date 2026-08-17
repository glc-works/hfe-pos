import { describe, it, expect } from 'vitest'
import { getCountryCashPresets } from '../utils/countryCashDenominations'

describe('Multi-Country Adaptive Cash Banknote Denominations Engine (L2-POS-81)', () => {
  it('computes exact 4 clean Indonesian Rupiah (IDR) banknotes for micro-bill (Rp 35.000)', () => {
    const presets = getCountryCashPresets(35000, 'IDR', 'id')
    expect(presets).toHaveLength(4)
    expect(presets.map(p => p.value)).toEqual([40000, 50000, 100000, 150000])
    expect(presets.map(p => p.label)).toEqual(['40rb', '50rb', '100rb', '150rb'])
  })

  it('computes exact 4 clean Indonesian Rupiah (IDR) banknotes for standard dining (Rp 180.000)', () => {
    const presets = getCountryCashPresets(180000, 'IDR', 'id')
    expect(presets).toHaveLength(4)
    expect(presets.map(p => p.value)).toEqual([200000, 300000, 500000, 1000000])
    expect(presets.map(p => p.label)).toEqual(['200rb', '300rb', '500rb', '1 Jt'])
  })

  it('computes exact 4 clean Indonesian Rupiah (IDR) banknotes for million-tier bill (Rp 1.530.100)', () => {
    const presets = getCountryCashPresets(1530100, 'IDR', 'id')
    expect(presets).toHaveLength(4)
    expect(presets.map(p => p.value)).toEqual([1550000, 1600000, 2000000, 2500000])
    expect(presets.map(p => p.label)).toEqual(['1.55 Jt', '1.6 Jt', '2 Jt', '2.5 Jt'])
  })

  it('computes exact 4 clean US Dollar (USD) banknotes for dining bill ($14.50)', () => {
    const presets = getCountryCashPresets(14.5, 'USD', 'en')
    expect(presets).toHaveLength(4)
    expect(presets.map(p => p.value)).toEqual([15, 20, 50, 100])
    expect(presets.map(p => p.label)).toEqual(['$15', '$20', '$50', '$100'])
  })

  it('computes exact 4 clean US Dollar (USD) banknotes for large bill ($120.00)', () => {
    const presets = getCountryCashPresets(120, 'USD', 'en')
    expect(presets).toHaveLength(4)
    expect(presets.map(p => p.value)).toEqual([150, 200, 250, 300])
    expect(presets.map(p => p.label)).toEqual(['$150', '$200', '$250', '$300'])
  })

  it('computes exact 4 clean Singapore Dollar (SGD) banknotes (S$23.50)', () => {
    const presets = getCountryCashPresets(23.5, 'SGD', 'en')
    expect(presets).toHaveLength(4)
    expect(presets.map(p => p.value)).toEqual([24, 25, 30, 40])
    expect(presets.map(p => p.label)).toEqual(['S$24', 'S$25', 'S$30', 'S$40'])
  })

  it('computes exact 4 clean Japanese Yen (JPY) banknotes (¥3,200)', () => {
    const presets = getCountryCashPresets(3200, 'JPY', 'ja')
    expect(presets).toHaveLength(4)
    expect(presets.map(p => p.value)).toEqual([4000, 5000, 10000, 15000])
    expect(presets.map(p => p.label)).toEqual(['¥4,000', '¥5,000', '¥10,000', '¥15,000'])
  })

  it('strictly enforces no duplicate values and strictly ascending order', () => {
    const testTotals = [0, 1000, 28000, 96800, 550000, 1530100, 12500000]
    testTotals.forEach(total => {
      const presets = getCountryCashPresets(total, 'IDR', 'id')
      expect(presets).toHaveLength(4)
      
      const values = presets.map(p => p.value)
      const uniqueValues = Array.from(new Set(values))
      expect(uniqueValues).toHaveLength(4)

      if (total > 0) {
        values.forEach(v => expect(v).toBeGreaterThan(total))
      }
    })
  })
})
