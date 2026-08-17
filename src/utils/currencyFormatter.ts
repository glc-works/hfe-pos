/**
 * Tabular Currency Formatting Utilities (Zero-Jitter & Locale-Aware).
 * Tier 1: Pure Utility Function (No Context or Higher-Tier Dependencies).
 */

export function formatPrice(amount: number, locale: 'id' | 'en' = 'id'): string {
  if (locale === 'en') {
    return `IDR ${amount.toLocaleString('en-US')}`
  }
  return `Rp ${amount.toLocaleString('id-ID')}`
}

export function formatCompactPrice(amount: number, locale: 'id' | 'en' = 'id'): string {
  const abs = Math.abs(amount)
  const sign = amount < 0 ? '-' : ''

  if (locale === 'en') {
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
