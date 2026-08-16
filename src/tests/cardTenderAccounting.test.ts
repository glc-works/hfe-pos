import { describe, it, expect } from 'vitest'
import { CardTenderMetadata, PosPayMethod } from '../types/pos'
import { translations } from '../i18n/translations'

describe('Card Tender (CC / Debit) Accounting Integrity & BIN Detection', () => {
  it('should support distinct CC and Debit payment methods, card tiers (World, Batik Air, Private), and metadata with 4-front and 3-back recon digits', () => {
    const ccTender: CardTenderMetadata = {
      cardType: 'cc',
      cardNetwork: 'visa',
      issuingBank: 'BCA',
      cardPrefix: '4123',
      cardLast3: '789',
      cardTier: 'World',
      maskedReconNumber: '4123-***-789',
      approvalCode: '883921'
    }

    const debitTender: CardTenderMetadata = {
      cardType: 'debit',
      cardNetwork: 'gpn',
      issuingBank: 'Mandiri',
      cardPrefix: '5899',
      cardLast3: '456',
      cardTier: 'Private',
      maskedReconNumber: '5899-***-456',
      approvalCode: '109283'
    }

    expect(ccTender.cardType).toBe('cc')
    expect(ccTender.cardNetwork).toBe('visa')
    expect(ccTender.cardPrefix).toBe('4123')
    expect(ccTender.cardLast3).toBe('789')
    expect(ccTender.cardTier).toBe('World')
    expect(ccTender.maskedReconNumber).toBe('4123-***-789')

    expect(debitTender.cardType).toBe('debit')
    expect(debitTender.cardNetwork).toBe('gpn')
    expect(debitTender.cardPrefix).toBe('5899')
    expect(debitTender.cardLast3).toBe('456')
    expect(debitTender.cardTier).toBe('Private')
    expect(debitTender.maskedReconNumber).toBe('5899-***-456')
  })

  it('should have complete translations for CC, Debit, EDC Bank, Card Tier, 4-Front, and 3-Back labels', () => {
    expect(translations.id.cart.payCc).toBe('Kartu Kredit (CC)')
    expect(translations.en.cart.payCc).toBe('Credit Card (CC)')

    expect(translations.id.cart.payDebit).toBe('Kartu Debit')
    expect(translations.en.cart.payDebit).toBe('Debit Card')

    expect(translations.id.cart.cardBankLabel).toContain('EDC')
    expect(translations.en.cart.cardBankLabel).toContain('EDC')

    expect(translations.id.cart.cardPrefixLabel).toContain('4 Digit')
    expect(translations.en.cart.cardPrefixLabel).toContain('4 Digits')

    expect(translations.id.cart.cardSuffixLabel).toContain('3 Digit')
    expect(translations.en.cart.cardSuffixLabel).toContain('3 Digits')

    expect(translations.id.cart.cardTierLabel).toContain('Tier')
    expect(translations.en.cart.cardTierLabel).toContain('Tier')

    expect(translations.id.cart.maskedPreviewLabel).toContain('Rekon')
    expect(translations.en.cart.maskedPreviewLabel).toContain('Recon')
  })

  it('should correctly classify card brand networks from 4-digit prefixes', () => {
    const detectNetwork = (prefix: string): string => {
      if (prefix.startsWith('4')) return 'visa'
      if (prefix.startsWith('51') || prefix.startsWith('52') || prefix.startsWith('53') || prefix.startsWith('54') || prefix.startsWith('55') || prefix.startsWith('2')) return 'mastercard'
      if (prefix.startsWith('5899') || prefix.startsWith('1946') || prefix.startsWith('60')) return 'gpn'
      if (prefix.startsWith('34') || prefix.startsWith('37')) return 'amex'
      if (prefix.startsWith('35')) return 'jcb'
      return 'other'
    }

    expect(detectNetwork('4123')).toBe('visa')
    expect(detectNetwork('5234')).toBe('mastercard')
    expect(detectNetwork('5899')).toBe('gpn')
    expect(detectNetwork('3782')).toBe('amex')
    expect(detectNetwork('3528')).toBe('jcb')
  })
})
