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

  it('contains valid hub business truth keys and state machine badges across both languages', () => {
    expect(idTranslations.hub.businessTruthTitle).toBe('⚡ Realtime Business Truth: Dampak Transaksi Terakhir')
    expect(idTranslations.hub.businessTruthTagline).toBe('1 Transaksi. 1 Kebenaran.')
    expect(idTranslations.hub.businessTruthDemoBadge).toBe('Simulasi Proving Ground')
    expect(idTranslations.hub.businessTruthPendingBadge).toBe('Sinkronisasi Tertunda')
    expect(idTranslations.hub.businessTruthPostedBadge).toBe('Terposting ke Buku Besar ✓')
    expect(idTranslations.hub.businessTruthFailedBadge).toBe('Gagal Posting')

    expect(enTranslations.hub.businessTruthTitle).toBe('⚡ Realtime Business Truth: Last Transaction Impact')
    expect(enTranslations.hub.businessTruthTagline).toBe('1 Transaction. 1 Truth.')
    expect(enTranslations.hub.businessTruthDemoBadge).toBe('Proving Ground Demo')
    expect(enTranslations.hub.businessTruthPendingBadge).toBe('Pending Sync')
    expect(enTranslations.hub.businessTruthPostedBadge).toBe('Posted to General Ledger ✓')
    expect(enTranslations.hub.businessTruthFailedBadge).toBe('Posting Failed')
  })

  it('contains full 100% i18n keys for Executive Insights KPI cards, Heatmap, and Z-Report', () => {
    const id = idTranslations.hub
    const en = enTranslations.hub

    // Executive Summary & Range
    expect(id.executiveSummaryTitle).toBeDefined()
    expect(en.executiveSummaryTitle).toBeDefined()
    expect(id.rangeToday).toBeDefined()
    expect(en.rangeToday).toBeDefined()

    // KPI Cards
    expect(id.grossSalesLabel).toBeDefined()
    expect(en.grossSalesLabel).toBeDefined()
    expect(id.cogsBomLabel).toBeDefined()
    expect(en.cogsBomLabel).toBeDefined()
    expect(id.grossProfitLabel).toBeDefined()
    expect(en.grossProfitLabel).toBeDefined()
    expect(id.totalTransactionsLabel).toBeDefined()
    expect(en.totalTransactionsLabel).toBeDefined()

    // Rush Hour Heatmap
    expect(id.rushHourHeatmapTitle).toBeDefined()
    expect(en.rushHourHeatmapTitle).toBeDefined()
    expect(id.peakLabel).toBeDefined()
    expect(en.peakLabel).toBeDefined()

    // Z-Report Closeout
    expect(id.zReportTitle).toBeDefined()
    expect(en.zReportTitle).toBeDefined()
    expect(id.printZReportCta).toBeDefined()
    expect(en.printZReportCta).toBeDefined()
  })
})
