/**
 * Locale-Driven Number & Money Field Formatter (Tier 1 Pure Utility).
 * Complies with Unicode CLDR / ECMA-402 standards:
 * Punctuation (Thousand '.' vs ',' & Decimal ',' vs '.') is 100% DICTATED BY LANGUAGE/LOCALE.
 * Currency is completely decoupled and only dictates prefix symbols and minor unit precision.
 */

/**
 * Formats any numeric value into localized number string based on language.
 * - 'id' (Indonesian): 1000000 -> "1.000.000", 5.38 -> "5,38"
 * - 'en' (English): 1000000 -> "1,000,000", 5.38 -> "5.38"
 */
export function formatLocaleNumber(
  value: number | string,
  language: string = 'id',
  minFraction: number = 0,
  maxFraction: number = 2
): string {
  const num = typeof value === 'string' ? parseFloat(value) || 0 : value
  const locale = language === 'en' ? 'en-US' : 'id-ID'

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: minFraction,
    maximumFractionDigits: maxFraction
  }).format(num)
}

/**
 * Formats a raw numeric string for live display inside an input field.
 * Adds thousand delimiters based on UI language.
 */
export function formatMoneyInputDisplay(
  rawInput: string,
  language: string = 'id'
): string {
  if (!rawInput || rawInput === '0') return ''
  const isEn = language === 'en'
  const thousandDelim = isEn ? ',' : '.'
  const decimalDelim = isEn ? '.' : ','

  // Split integer and decimal parts
  const sanitized = rawInput.replace(/[^0-9.]/g, '')
  const parts = sanitized.split('.')
  const intPart = parts[0]
  const decPart = parts.length > 1 ? parts[1] : undefined

  // Add thousand separators to integer part
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandDelim)

  if (decPart !== undefined) {
    return `${formattedInt}${decimalDelim}${decPart}`
  }
  return formattedInt
}

/**
 * Parses user input string from localized format back to raw numeric string.
 * Converts localized delimiters into standard JavaScript decimal number string.
 */
export function parseMoneyInput(
  formattedInput: string,
  language: string = 'id'
): string {
  if (!formattedInput) return ''
  const isEn = language === 'en'

  if (isEn) {
    // English: Comma is thousand delimiter, dot is decimal
    const cleaned = formattedInput.replace(/,/g, '')
    return cleaned.replace(/[^0-9.]/g, '')
  } else {
    // Indonesian: Dot is thousand delimiter, comma is decimal
    let cleaned = formattedInput.replace(/\./g, '')
    cleaned = cleaned.replace(/,/g, '.')
    return cleaned.replace(/[^0-9.]/g, '')
  }
}
