/**
 * Multi-Country Adaptive Cash Banknote Denominations & KISS Multi-Currency Engine.
 * Tier 1: Pure Algorithm & Statutory Currency Denominations (Zero Context Dependencies).
 * Computes realistic, localized physical banknote presets for cashier quick tender.
 */

export interface CashPresetItem {
  value: number
  label: string
}

export interface SupportedTenderCurrency {
  code: string
  name: string
  symbol: string
  flag: string
}

export const ACCEPTED_TENDER_CURRENCIES: SupportedTenderCurrency[] = [
  { code: 'IDR', name: 'Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'SGD', name: 'SG Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'MYR', name: 'Ringgit', symbol: 'RM', flag: '🇲🇾' },
  { code: 'JPY', name: 'Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' }
]

// Standard Benchmark Exchange Rates to IDR (Base)
export const STANDARD_FX_RATES: Record<string, number> = {
  IDR: 1,
  USD: 16000,
  SGD: 12000,
  MYR: 3600,
  EUR: 17500,
  JPY: 105,
  AUD: 10500,
  GBP: 20500
}

/**
 * Returns clean currency symbol prefix.
 */
export function getCurrencySymbol(curr: string = 'IDR'): string {
  const c = curr.toUpperCase()
  switch (c) {
    case 'USD': return '$'
    case 'EUR': return '€'
    case 'SGD': return 'S$'
    case 'MYR': return 'RM'
    case 'JPY': return '¥'
    case 'GBP': return '£'
    case 'AUD': return 'A$'
    case 'IDR':
    default:
      return 'Rp'
  }
}

/**
 * Converts monetary amount between currencies using standard FX rates.
 */
export function convertCurrency(
  amount: number,
  fromCurr: string = 'IDR',
  toCurr: string = 'IDR'
): number {
  if (!amount || amount <= 0) return 0
  const from = fromCurr.toUpperCase()
  const to = toCurr.toUpperCase()
  if (from === to) return amount

  const fromRate = STANDARD_FX_RATES[from] || 1
  const toRate = STANDARD_FX_RATES[to] || 1

  // Amount in IDR = amount * fromRate
  const inIdr = amount * fromRate
  // Amount in Target = inIdr / toRate
  const converted = inIdr / toRate

  // Round decimals: JPY/IDR = 0 decimals, others = 2 decimals
  if (to === 'IDR' || to === 'JPY') {
    return Math.round(converted)
  }
  return Math.round(converted * 100) / 100
}

/**
 * Computes 4 clean, realistic cash banknote presets for any currency and total amount.
 */
export function getCountryCashPresets(
  grandTotal: number,
  currency: string = 'IDR',
  language: string = 'id'
): CashPresetItem[] {
  const total = Math.max(0, grandTotal || 0)
  const isEn = language === 'en'
  const cleanCurr = currency.toUpperCase()

  // 1. INDONESIAN RUPIAH (IDR)
  if (cleanCurr === 'IDR') {
    if (total <= 0) {
      return [
        { value: 20000, label: isEn ? '20k' : '20rb' },
        { value: 50000, label: isEn ? '50k' : '50rb' },
        { value: 100000, label: isEn ? '100k' : '100rb' },
        { value: 200000, label: isEn ? '200k' : '200rb' }
      ]
    }

    const set = new Set<number>()

    if (total < 100000) {
      // Small bill (< 100k): Suggest round 10k, 20k, 50k, 100k
      const next10k = Math.ceil(total / 10000) * 10000
      if (next10k > total) set.add(next10k)
      if (total < 20000) set.add(20000)
      if (total < 50000) set.add(50000)
      if (total < 100000) set.add(100000)
      if (total < 150000) set.add(150000)
      if (total < 200000) set.add(200000)
    } else if (total < 1000000) {
      // Medium bill (100k - 1M): Suggest round 50k, 100k, 200k, 500k, 1M
      const next50k = Math.ceil(total / 50000) * 50000
      if (next50k > total) set.add(next50k)
      const next100k = Math.ceil(total / 100000) * 100000
      if (next100k > total) set.add(next100k)
      if (total < 200000) set.add(200000)
      if (total < 300000) set.add(300000)
      if (total < 500000) set.add(500000)
      if (total < 1000000) set.add(1000000)
    } else {
      // Large bill (>= 1M): Suggest round 50k, 100k, 500k, 1M multiples
      const next50k = Math.ceil(total / 50000) * 50000
      if (next50k > total) set.add(next50k)
      const next100k = Math.ceil(total / 100000) * 100000
      if (next100k > total) set.add(next100k)
      const next500k = Math.ceil(total / 500000) * 500000
      if (next500k > total) set.add(next500k)
      const next1M = Math.ceil(total / 1000000) * 1000000
      if (next1M > total) set.add(next1M)
      set.add(next1M + 500000)
      set.add(next1M + 1000000)
    }

    const sorted = Array.from(set).filter(n => n > total).sort((a, b) => a - b)
    while (sorted.length < 4) {
      const last = sorted[sorted.length - 1] || total
      sorted.push(last + (total >= 1000000 ? 500000 : 50000))
    }

    return sorted.slice(0, 4).map(val => {
      let label: string
      if (val >= 1000000) {
        const millions = val / 1000000
        const formatted = millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(2).replace(/\.?0+$/, '')
        label = isEn ? `${formatted}M` : `${formatted} Jt`
      } else {
        label = isEn ? `${val / 1000}k` : `${val / 1000}rb`
      }
      return { value: val, label }
    })
  }

  // 2. US DOLLAR (USD) & EURO (EUR) & SGD & MYR (Standard Decimal Currencies)
  const isUsd = cleanCurr === 'USD'
  const isEur = cleanCurr === 'EUR'
  const isSgd = cleanCurr === 'SGD'
  const isMyr = cleanCurr === 'MYR'
  const prefix = isUsd ? '$' : isEur ? '€' : isSgd ? 'S$' : isMyr ? 'RM' : ''

  if (isUsd || isEur || isSgd || isMyr) {
    if (total <= 0) {
      return [
        { value: 10, label: `${prefix}10` },
        { value: 20, label: `${prefix}20` },
        { value: 50, label: `${prefix}50` },
        { value: 100, label: `${prefix}100` }
      ]
    }

    const set = new Set<number>()
    const nextWhole = Math.ceil(total)
    if (nextWhole > total) set.add(nextWhole)

    if (total < 20) {
      if (total < 5) set.add(5)
      if (total < 10) set.add(10)
      if (total < 15) set.add(15)
      if (total < 20) set.add(20)
      if (total < 50) set.add(50)
      if (total < 100) set.add(100)
    } else if (total < 100) {
      const next5 = Math.ceil(total / 5) * 5
      if (next5 > total) set.add(next5)
      const next10 = Math.ceil(total / 10) * 10
      if (next10 > total) set.add(next10)
      const next20 = Math.ceil(total / 20) * 20
      if (next20 > total) set.add(next20)
      if (total < 50) set.add(50)
      if (total < 100) set.add(100)
    } else {
      const next20 = Math.ceil(total / 20) * 20
      if (next20 > total) set.add(next20)
      const next50 = Math.ceil(total / 50) * 50
      if (next50 > total) set.add(next50)
      const next100 = Math.ceil(total / 100) * 100
      if (next100 > total) set.add(next100)
      set.add(next100 + 50)
      set.add(next100 + 100)
    }

    const sorted = Array.from(set).filter(n => n > total).sort((a, b) => a - b)
    while (sorted.length < 4) {
      const last = sorted[sorted.length - 1] || total
      sorted.push(last + (total >= 100 ? 50 : 10))
    }

    return sorted.slice(0, 4).map(val => ({
      value: val,
      label: `${prefix}${val}`
    }))
  }

  // 3. JAPANESE YEN (JPY)
  if (cleanCurr === 'JPY') {
    if (total <= 0) {
      return [
        { value: 1000, label: '¥1,000' },
        { value: 2000, label: '¥2,000' },
        { value: 5000, label: '¥5,000' },
        { value: 10000, label: '¥10,000' }
      ]
    }

    const set = new Set<number>()
    const next1k = Math.ceil(total / 1000) * 1000
    if (next1k > total) set.add(next1k)
    const next5k = Math.ceil(total / 5000) * 5000
    if (next5k > total) set.add(next5k)
    const next10k = Math.ceil(total / 10000) * 10000
    if (next10k > total) set.add(next10k)
    set.add(next10k + 5000)
    set.add(next10k + 10000)

    const sorted = Array.from(set).filter(n => n > total).sort((a, b) => a - b)
    while (sorted.length < 4) {
      const last = sorted[sorted.length - 1] || total
      sorted.push(last + 5000)
    }

    return sorted.slice(0, 4).map(val => ({
      value: val,
      label: `¥${val.toLocaleString('ja-JP')}`
    }))
  }

  // DEFAULT / FALLBACK
  const nextWhole = Math.ceil(total)
  return [
    { value: nextWhole + 10, label: `${nextWhole + 10}` },
    { value: nextWhole + 20, label: `${nextWhole + 20}` },
    { value: nextWhole + 50, label: `${nextWhole + 50}` },
    { value: nextWhole + 100, label: `${nextWhole + 100}` }
  ]
}
