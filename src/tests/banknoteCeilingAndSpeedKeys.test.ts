import { describe, it, expect } from 'vitest'
import { getCountryCashPresets, convertCurrency } from '../utils/countryCashDenominations'

describe('L2-POS-83: Banknote Ceiling Dynamic Presets & Speed Keys 000 Numpad Engine', () => {
  it('calculates exact 100k banknote ceiling for Rp 86,000 bill (86k -> 100k, 200k, 500k, 1M)', () => {
    const presetsId = getCountryCashPresets(86000, 'IDR', 'id')
    expect(presetsId.map(p => p.value)).toEqual([100000, 200000, 500000, 1000000])
    expect(presetsId[0].label).toBe('100rb')
    expect(presetsId[1].label).toBe('200rb')
    expect(presetsId[2].label).toBe('500rb')
    expect(presetsId[3].label).toBe('1 Jt')

    // In English UI
    const presetsEn = getCountryCashPresets(86000, 'IDR', 'en')
    expect(presetsEn.map(p => p.value)).toEqual([100000, 200000, 500000, 1000000])
    expect(presetsEn[0].label).toBe('100k')
    expect(presetsEn[3].label).toBe('1M')
  })

  it('calculates exact 100k banknote ceiling for Rp 760,000 bill (760k -> 800k, 900k, 1M, 1.5M)', () => {
    const presets = getCountryCashPresets(760000, 'IDR', 'id')
    expect(presets[0].value).toBe(800000)
    expect(presets[0].label).toBe('800rb')
    expect(presets[1].value).toBe(900000)
    expect(presets[1].label).toBe('900rb')
    expect(presets[2].value).toBe(1000000)
    expect(presets[2].label).toBe('1 Jt')
  })

  it('calculates exact 100k banknote ceiling for Rp 860,000 bill (860k -> 900k, 1M, 1.5M, 2M)', () => {
    const presets = getCountryCashPresets(860000, 'IDR', 'id')
    expect(presets[0].value).toBe(900000)
    expect(presets[0].label).toBe('900rb')
    expect(presets[1].value).toBe(1000000)
    expect(presets[1].label).toBe('1 Jt')
    expect(presets[2].value).toBe(1500000)
    expect(presets[2].label).toBe('1.5 Jt')
  })

  it('calculates exact small banknote ceiling for Rp 14,000 and Rp 35,000 bills', () => {
    // 14k bill -> 20k, 50k, 100k, 200k
    const smallPresets = getCountryCashPresets(14000, 'IDR', 'id')
    expect(smallPresets.map(p => p.value)).toEqual([20000, 50000, 100000, 200000])
    expect(smallPresets[0].label).toBe('20rb')

    // 35k bill -> 50k, 100k, 200k, 500k
    const midPresets = getCountryCashPresets(35000, 'IDR', 'id')
    expect(midPresets.map(p => p.value)).toEqual([50000, 100000, 200000, 500000])
    expect(midPresets[0].label).toBe('50rb')
  })

  it('calculates million banknote ceiling for large bills (e.g. Rp 1,530,000 party bill)', () => {
    const presets = getCountryCashPresets(1530000, 'IDR', 'id')
    expect(presets[0].value).toBe(1600000)
    expect(presets[0].label).toBe('1.6 Jt')
    expect(presets[1].value).toBe(2000000)
    expect(presets[1].label).toBe('2 Jt')
  })
})
