import { describe, it, expect } from 'vitest'
import { identifyCardBin } from '../utils/cardBinEngine'

describe('Universal Card BIN Engine & Auto-Detection Suite (ISO/IEC 7812)', () => {
  it('correctly identifies BCA Paspor Visa Debit from 8-digit BIN', () => {
    const res = identifyCardBin('45563321')
    expect(res.network).toBe('visa')
    expect(res.bankName).toBe('BCA')
    expect(res.cardType).toBe('debit')
    expect(res.cardTier).toBe('Paspor Platinum')
    expect(res.countryCode).toBe('ID')
  })

  it('correctly identifies BCA Visa Credit Card from 8-digit BIN', () => {
    const res = identifyCardBin('47264700')
    expect(res.network).toBe('visa')
    expect(res.bankName).toBe('BCA')
    expect(res.cardType).toBe('credit')
    expect(res.cardTier).toBe('Visa Platinum CC')
    expect(res.countryCode).toBe('ID')
  })

  it('correctly identifies Mandiri Mastercard Debit vs Credit', () => {
    const debitRes = identifyCardBin('52111400')
    expect(debitRes.network).toBe('mastercard')
    expect(debitRes.bankName).toBe('Mandiri')
    expect(debitRes.cardType).toBe('debit')

    const creditRes = identifyCardBin('51885600')
    expect(creditRes.network).toBe('mastercard')
    expect(creditRes.bankName).toBe('Mandiri')
    expect(creditRes.cardType).toBe('credit')
    expect(creditRes.cardTier).toBe('Mandiri Skyz CC')
  })

  it('correctly identifies BRI BritAma Visa Debit and Touch CC', () => {
    const debitRes = identifyCardBin('46170012')
    expect(debitRes.network).toBe('visa')
    expect(debitRes.bankName).toBe('BRI')
    expect(debitRes.cardType).toBe('debit')

    const creditRes = identifyCardBin('51882800')
    expect(creditRes.network).toBe('mastercard')
    expect(creditRes.bankName).toBe('BRI')
    expect(creditRes.cardType).toBe('credit')
  })

  it('correctly identifies BNI GPN Chip Debit', () => {
    const res = identifyCardBin('19460100')
    expect(res.network).toBe('gpn')
    expect(res.bankName).toBe('BNI')
    expect(res.cardType).toBe('debit')
  })

  it('correctly identifies Singapore DBS & UOB cards', () => {
    const dbsRes = identifyCardBin('45431300')
    expect(dbsRes.network).toBe('visa')
    expect(dbsRes.bankName).toBe('DBS Singapore')
    expect(dbsRes.countryCode).toBe('SG')

    const uobRes = identifyCardBin('54256300')
    expect(uobRes.network).toBe('mastercard')
    expect(uobRes.bankName).toBe('UOB')
    expect(uobRes.cardType).toBe('credit')
  })

  it('correctly identifies US International Cards (Chase, AMEX, Revolut, Wise)', () => {
    const chaseRes = identifyCardBin('40240071')
    expect(chaseRes.network).toBe('visa')
    expect(chaseRes.bankName).toBe('Chase (US)')
    expect(chaseRes.cardType).toBe('credit')

    const amexRes = identifyCardBin('37120000')
    expect(amexRes.network).toBe('amex')
    expect(amexRes.bankName).toBe('American Express')
    expect(amexRes.cardType).toBe('credit')

    const revolutRes = identifyCardBin('53545600')
    expect(revolutRes.network).toBe('mastercard')
    expect(revolutRes.bankName).toBe('Revolut')
    expect(revolutRes.cardType).toBe('debit')
  })

  it('gracefully falls back to global network heuristics for unknown BINs', () => {
    const unknownVisa = identifyCardBin('49999999')
    expect(unknownVisa.network).toBe('visa')
    expect(unknownVisa.countryCode).toBe('GLOBAL')

    const unknownAmex = identifyCardBin('34999999')
    expect(unknownAmex.network).toBe('amex')
    expect(unknownAmex.cardType).toBe('credit')
  })
})
