import { describe, it, expect } from 'vitest'
import {
  formatLocaleNumber,
  formatMoneyInputDisplay,
  parseMoneyInput
} from '../utils/localeNumberFormat'

describe('L2-POS-84: Locale-Driven Number & Money Field Formatter Suite', () => {
  it('formats thousands and decimals strictly according to language rules (Unicode CLDR / ECMA-402)', () => {
    // 1. Indonesian ('id'): Dot '.' for thousands, Comma ',' for decimals
    expect(formatLocaleNumber(1000000, 'id')).toBe('1.000.000')
    expect(formatLocaleNumber(86000, 'id')).toBe('86.000')
    expect(formatLocaleNumber(5.38, 'id', 2, 2)).toBe('5,38')
    expect(formatLocaleNumber(1250000.5, 'id', 2, 2)).toBe('1.250.000,50')

    // 2. English ('en'): Comma ',' for thousands, Dot '.' for decimals
    expect(formatLocaleNumber(1000000, 'en')).toBe('1,000,000')
    expect(formatLocaleNumber(86000, 'en')).toBe('86,000')
    expect(formatLocaleNumber(5.38, 'en', 2, 2)).toBe('5.38')
    expect(formatLocaleNumber(1250000.5, 'en', 2, 2)).toBe('1,250,000.50')
  })

  it('formats live money input display with correct thousand delimiters', () => {
    // Indonesian Locale
    expect(formatMoneyInputDisplay('100000', 'id')).toBe('100.000')
    expect(formatMoneyInputDisplay('1000000', 'id')).toBe('1.000.000')
    expect(formatMoneyInputDisplay('870000', 'id')).toBe('870.000')
    expect(formatMoneyInputDisplay('5.38', 'id')).toBe('5,38')

    // English Locale
    expect(formatMoneyInputDisplay('100000', 'en')).toBe('100,000')
    expect(formatMoneyInputDisplay('1000000', 'en')).toBe('1,000,000')
    expect(formatMoneyInputDisplay('870000', 'en')).toBe('870,000')
    expect(formatMoneyInputDisplay('5.38', 'en')).toBe('5.38')
  })

  it('correctly parses user input back to raw numeric string across locales', () => {
    // Indonesian formatted inputs
    expect(parseMoneyInput('1.000.000', 'id')).toBe('1000000')
    expect(parseMoneyInput('100.000', 'id')).toBe('100000')
    expect(parseMoneyInput('5,38', 'id')).toBe('5.38')

    // English formatted inputs
    expect(parseMoneyInput('1,000,000', 'en')).toBe('1000000')
    expect(parseMoneyInput('100,000', 'en')).toBe('100000')
    expect(parseMoneyInput('5.38', 'en')).toBe('5.38')
  })
})
