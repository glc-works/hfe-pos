import { describe, it, expect } from 'vitest'
import {
  convertCurrency,
  getCurrencySymbol,
  getCountryCashPresets,
  ACCEPTED_TENDER_CURRENCIES
} from '../utils/countryCashDenominations'

describe('KISS Multi-Currency Cashier Tender & Language Decoupling Suite (L2-POS-82 & L2-POS-83)', () => {
  it('correctly converts amounts between supported currencies', () => {
    // IDR to USD: 160,000 / 16,000 = $10.00
    expect(convertCurrency(160000, 'IDR', 'USD')).toBe(10)
    // IDR to USD: 86,000 / 16,000 = $5.38
    expect(convertCurrency(86000, 'IDR', 'USD')).toBe(5.38)
    // IDR to SGD: 120,000 / 12,000 = S$10.00
    expect(convertCurrency(120000, 'IDR', 'SGD')).toBe(10)
    // USD to IDR: $10 * 16,000 = Rp 160,000
    expect(convertCurrency(10, 'USD', 'IDR')).toBe(160000)
    // Same currency conversion is identity
    expect(convertCurrency(86000, 'IDR', 'IDR')).toBe(86000)
  })

  it('guarantees that UI language is 100% decoupled from Store Base Currency', () => {
    const totalBill = 86000
    const storeBaseCurrency = 'IDR'

    // When UI language is English ('en'), store in Indonesia MUST still produce clean IDR banknotes
    const presetsEn = getCountryCashPresets(totalBill, storeBaseCurrency, 'en')
    expect(presetsEn).toHaveLength(4)
    expect(presetsEn.map(p => p.value)).toEqual([100000, 200000, 500000, 1000000])
    expect(presetsEn.map(p => p.label)).toEqual(['100k', '200k', '500k', '1M'])

    // When UI language is Indonesian ('id'), store produces IDR banknotes with 'rb' / 'Jt'
    const presetsId = getCountryCashPresets(totalBill, storeBaseCurrency, 'id')
    expect(presetsId).toHaveLength(4)
    expect(presetsId.map(p => p.value)).toEqual([100000, 200000, 500000, 1000000])
    expect(presetsId.map(p => p.label)).toEqual(['100rb', '200rb', '500rb', '1 Jt'])
  })

  it('computes accurate foreign tender presets and dual-currency change returns', () => {
    const totalBillIdr = 86000
    const tenderCurrency = 'USD'
    
    // Convert bill to USD: $5.38
    const convertedTotal = convertCurrency(totalBillIdr, 'IDR', tenderCurrency)
    expect(convertedTotal).toBe(5.38)

    // Presets for $5.38
    const usdPresets = getCountryCashPresets(convertedTotal, tenderCurrency, 'en')
    expect(usdPresets).toHaveLength(4)
    expect(usdPresets.map(p => p.value)).toEqual([6, 10, 15, 20])
    expect(usdPresets.map(p => p.label)).toEqual(['$6', '$10', '$15', '$20'])

    // If customer tenders $20 USD banknote
    const tenderedUsd = 20
    const changeUsd = Math.round((tenderedUsd - convertedTotal) * 100) / 100
    expect(changeUsd).toBe(14.62)

    // Equivalent change in base store currency (IDR)
    const changeIdr = convertCurrency(changeUsd, 'USD', 'IDR')
    expect(changeIdr).toBe(233920)
  })

  it('provides all standard accepted tender currencies', () => {
    expect(ACCEPTED_TENDER_CURRENCIES.map(c => c.code)).toEqual([
      'IDR', 'USD', 'SGD', 'MYR', 'JPY', 'EUR'
    ])
    expect(getCurrencySymbol('USD')).toBe('$')
    expect(getCurrencySymbol('SGD')).toBe('S$')
    expect(getCurrencySymbol('IDR')).toBe('Rp')
  })
})
