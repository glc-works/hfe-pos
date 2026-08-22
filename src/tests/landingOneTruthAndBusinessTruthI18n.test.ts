import { describe, it, expect } from 'vitest'
import { idTranslations } from '../i18n/id'
import { enTranslations } from '../i18n/en'

describe('Landing "One Transaction, One Truth" Story & Business Truth i18n Suite (Issue #33 Part B & A)', () => {
  it('contains complete 5-step event flow dictionary in Indonesian', () => {
    expect(idTranslations.landing.oneTruthTitle).toBe('Satu Transaksi. Satu Kebenaran Real-Time.')
    expect(idTranslations.landing.oneTruthStep1Title).toBe('1. QR Meja')
    expect(idTranslations.landing.oneTruthStep2Title).toBe('2. Kasir & KDS Dapur')
    expect(idTranslations.landing.oneTruthStep3Title).toBe('3. Multi-Tender Settlement')
    expect(idTranslations.landing.oneTruthStep4Title).toBe('4. Buku Besar Hfe CORE')
    expect(idTranslations.landing.oneTruthStep5Title).toBe('5. Konsolidasi HQ')
  })

  it('contains complete 5-step event flow dictionary in English', () => {
    expect(enTranslations.landing.oneTruthTitle).toBe('One Transaction. One Real-Time Truth.')
    expect(enTranslations.landing.oneTruthStep1Title).toBe('1. QR Table Order')
    expect(enTranslations.landing.oneTruthStep2Title).toBe('2. Cashier & Kitchen KDS')
    expect(enTranslations.landing.oneTruthStep3Title).toBe('3. Multi-Tender Settlement')
    expect(enTranslations.landing.oneTruthStep4Title).toBe('4. Hfe CORE General Ledger')
    expect(enTranslations.landing.oneTruthStep5Title).toBe('5. HQ Consolidation')
  })

  it('contains valid hub business truth keys across both languages', () => {
    expect(idTranslations.hub.businessTruthTitle).toBe('⚡ Realtime Business Truth: Dampak Transaksi Terakhir')
    expect(idTranslations.hub.businessTruthTagline).toBe('1 Transaksi. 1 Kebenaran.')
    expect(enTranslations.hub.businessTruthTitle).toBe('⚡ Realtime Business Truth: Last Transaction Impact')
    expect(enTranslations.hub.businessTruthTagline).toBe('1 Transaction. 1 Truth.')
  })
})
