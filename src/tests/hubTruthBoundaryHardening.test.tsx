import { afterAll, beforeAll, describe, it, expect, vi } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { DataTruthProvider } from '../context/DataTruthContext'
import { MerchantConfigProvider } from '../context/MerchantConfigContext'
import { LanguageProvider } from '../context/LanguageContext'
import { ViewportProvider } from '../context/ViewportContext'
import { ExecutiveInsightsTab } from '../components/hub/ExecutiveInsightsTab'
import { UniversalFinancialHealthGauge } from '../components/hub/UniversalFinancialHealthGauge'
import { MultiEntityHoldingTab } from '../components/hub/MultiEntityHoldingTab'
import { FindAndMatchReconciliationModal } from '../components/hub/FindAndMatchReconciliationModal'
import { CafeGoLiveReadinessModal } from '../components/hub/CafeGoLiveReadinessModal'
import type { FinancialHealthSnapshot } from '../types/financialHealth'

const AUTHORITATIVE_FINANCIAL_HEALTH: FinancialHealthSnapshot = {
  cashRunwayDays: 77,
  cashRunwayStatus: 'warning',
  quickRatio: 1.4,
  grossMarginPercent: 61.2,
  operatingMarginPercent: 28.4,
  netMarginPercent: 19.7,
  workingCapitalMinor: 21000000000,
  inventoryTurnoverDays: 24,
  taxReserveFundMinor: 3100000000,
  taxObligationMinor: 3000000000,
  taxReserveFundStatus: 'sufficient',
  assetCategory: 'retail_merchandise',
  assetValuationMinor: 12000000000,
  assetTurnoverVelocityScore: 81,
  dailyBurnRateMinor: 280000000,
  liquidCashMinor: 21560000000,
}
const EXPECTED_BOOK = 'BOOK-NCG-HOLDING'
const TRUSTED_SOURCE = 'GET /v1/company-books/BOOK-NCG-HOLDING/reports/financial-health'
const TEST_NOW = new Date('2026-08-28T12:00:00Z')

function renderWithProviders(ui: React.ReactElement): string {
  return renderToString(
    <LanguageProvider>
      <ViewportProvider viewportMode="responsive">
        <MerchantConfigProvider>
          <DataTruthProvider>
            {ui}
          </DataTruthProvider>
        </MerchantConfigProvider>
      </ViewportProvider>
    </LanguageProvider>
  )
}

describe('Merchant Hub Truth Boundary Hardening (Issues #44, #85-#88)', () => {
  beforeAll(() => {
    vi.useFakeTimers()
    vi.setSystemTime(TEST_NOW)
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it('renders Executive Insights with TruthChannelBadge and tabular figures (#44)', () => {
    const html = renderWithProviders(<ExecutiveInsightsTab />)
    expect(html).toContain('Realtime Business Truth')
    expect(html).toContain('Data Demo')
  })

  it('renders Universal Financial Health Gauge with explicit sample snapshot timestamp (#87)', () => {
    const html = renderWithProviders(<UniversalFinancialHealthGauge />)
    expect(html).toContain('Sample Snapshot: 2026-08-25')
    expect(html).toContain('Ketahanan Kas')
  })

  it('keeps sample financial metrics in demo mode when only a CORE connection flag exists (#87)', () => {
    const html = renderWithProviders(<UniversalFinancialHealthGauge isCoreConnected />)
    expect(html).toContain('Data Demo')
    expect(html).toContain('Sample Snapshot: 2026-08-25')
    expect(html).not.toContain('LIVE • Terverifikasi CORE')
    expect(html).not.toContain('Siklus: Real-time Hfe CORE')
  })

  it('shows live CORE financial health only with a complete book-scoped report receipt (#87)', () => {
    const html = renderWithProviders(
      <UniversalFinancialHealthGauge
        isCoreConnected
        expectedBookId={EXPECTED_BOOK}
        trustedSource={TRUSTED_SOURCE}
        authoritativeSnapshot={{
          metrics: AUTHORITATIVE_FINANCIAL_HEALTH,
          bookId: EXPECTED_BOOK,
          periodStart: '2026-08-01',
          periodEnd: '2026-08-28',
          asOf: '2026-08-28T06:00:00Z',
          source: TRUSTED_SOURCE,
        }}
      />
    )
    expect(html).toContain('LIVE • Terverifikasi CORE')
    expect(html).toContain('77')
    expect(html).toContain('Perlu Perhatian')
    expect(html).toContain('from-amber-500')
    expect(html).toContain('2026-08-28T06:00:00Z')
    expect(html).toContain('Stok Ritel &amp; Merchandise')
    expect(html).toContain('disabled=""')
    expect(html).not.toContain('Sample Snapshot: 2026-08-25')
  })

  it('renders a critical authoritative cash runway without a safe label (#87)', () => {
    const html = renderWithProviders(
      <UniversalFinancialHealthGauge
        isCoreConnected
        expectedBookId={EXPECTED_BOOK}
        trustedSource={TRUSTED_SOURCE}
        authoritativeSnapshot={{
          metrics: {
            ...AUTHORITATIVE_FINANCIAL_HEALTH,
            cashRunwayDays: 12,
            cashRunwayStatus: 'critical',
          },
          bookId: EXPECTED_BOOK,
          periodStart: '2026-08-01',
          periodEnd: '2026-08-28',
          asOf: '2026-08-28T06:00:00Z',
          source: TRUSTED_SOURCE,
        }}
      />
    )
    expect(html).toContain('LIVE • Terverifikasi CORE')
    expect(html).toContain('Kritis')
    expect(html).toContain('from-rose-600')
    expect(html).not.toContain('Sehat')
  })

  it('renders an authoritative tax-reserve deficit without a fully funded claim (#87)', () => {
    const html = renderWithProviders(
      <UniversalFinancialHealthGauge
        isCoreConnected
        expectedBookId={EXPECTED_BOOK}
        trustedSource={TRUSTED_SOURCE}
        authoritativeSnapshot={{
          metrics: {
            ...AUTHORITATIVE_FINANCIAL_HEALTH,
            taxReserveFundMinor: 1000000000,
            taxObligationMinor: 4000000000,
            taxReserveFundStatus: 'deficit',
          },
          bookId: EXPECTED_BOOK,
          periodStart: '2026-08-01',
          periodEnd: '2026-08-28',
          asOf: '2026-08-28T06:00:00Z',
          source: TRUSTED_SOURCE,
        }}
      />
    )
    expect(html).toContain('25% Tersedia')
    expect(html).toContain('Defisit Rp')
    expect(html).toContain('30.000.000')
    expect(html).toContain('width:25%')
    expect(html).not.toContain('100% Siap')
    expect(html).not.toContain('Terproteksi 100%')
  })

  it.each([
    ['foreign book', { bookId: 'BOOK-FOREIGN' }],
    ['stale receipt', { asOf: '2026-08-20T06:00:00Z' }],
    ['future receipt', { asOf: '2026-08-29T06:00:00Z' }],
    ['malformed date', { asOf: 'not-a-date' }],
    ['calendar-invalid period date', { periodStart: '2026-02-30' }],
    ['calendar-invalid as-of date', { asOf: '2026-02-30T06:00:00Z' }],
    ['out-of-range hour', { asOf: '2026-02-28T24:00:00Z' }],
    ['out-of-range minute', { asOf: '2026-02-28T23:60:00Z' }],
    ['out-of-range second', { asOf: '2026-02-28T23:59:60Z' }],
    ['out-of-range offset hour', { asOf: '2026-02-28T23:59:59+24:00' }],
    ['out-of-range offset minute', { asOf: '2026-02-28T23:59:59+07:60' }],
    ['inverted period', { periodStart: '2026-08-29', periodEnd: '2026-08-28' }],
    ['untrusted source', { source: 'GET /untrusted/report' }],
  ])('keeps %s authoritative receipt in demo mode (#87)', (_case, override) => {
    const html = renderWithProviders(
      <UniversalFinancialHealthGauge
        isCoreConnected
        expectedBookId={EXPECTED_BOOK}
        trustedSource={TRUSTED_SOURCE}
        authoritativeSnapshot={{
          metrics: AUTHORITATIVE_FINANCIAL_HEALTH,
          bookId: EXPECTED_BOOK,
          periodStart: '2026-08-01',
          periodEnd: '2026-08-28',
          asOf: '2026-08-28T06:00:00Z',
          source: TRUSTED_SOURCE,
          ...override,
        }}
      />
    )
    expect(html).toContain('Data Demo')
    expect(html).toContain('Sample Snapshot: 2026-08-25')
  })

  it.each([
    ['negative', -1],
    ['not-a-number', Number.NaN],
    ['infinite', Number.POSITIVE_INFINITY],
  ])('rejects a %s receipt age limit (#87)', (_case, maxReceiptAgeMs) => {
    const html = renderWithProviders(
      <UniversalFinancialHealthGauge
        isCoreConnected
        expectedBookId={EXPECTED_BOOK}
        trustedSource={TRUSTED_SOURCE}
        maxReceiptAgeMs={maxReceiptAgeMs}
        authoritativeSnapshot={{
          metrics: AUTHORITATIVE_FINANCIAL_HEALTH,
          bookId: EXPECTED_BOOK,
          periodStart: '2026-08-01',
          periodEnd: '2026-08-28',
          asOf: '2026-08-28T06:00:00Z',
          source: TRUSTED_SOURCE,
        }}
      />
    )
    expect(html).toContain('Data Demo')
    expect(html).not.toContain('LIVE • Terverifikasi CORE')
  })

  it.each([
    ['partial metrics', { cashRunwayDays: 77 }],
    ['non-finite metrics', { ...AUTHORITATIVE_FINANCIAL_HEALTH, quickRatio: Number.NaN }],
    ['contradictory reserve status', { ...AUTHORITATIVE_FINANCIAL_HEALTH, taxReserveFundStatus: 'deficit' }],
    ['negative tax reserve', { ...AUTHORITATIVE_FINANCIAL_HEALTH, taxReserveFundMinor: -1 }],
    ['negative tax obligation', { ...AUTHORITATIVE_FINANCIAL_HEALTH, taxObligationMinor: -1 }],
    ['negative cash runway', { ...AUTHORITATIVE_FINANCIAL_HEALTH, cashRunwayDays: -1 }],
    ['negative quick ratio', { ...AUTHORITATIVE_FINANCIAL_HEALTH, quickRatio: -1 }],
    ['negative inventory days', { ...AUTHORITATIVE_FINANCIAL_HEALTH, inventoryTurnoverDays: -1 }],
    ['negative asset valuation', { ...AUTHORITATIVE_FINANCIAL_HEALTH, assetValuationMinor: -1 }],
    ['negative daily burn', { ...AUTHORITATIVE_FINANCIAL_HEALTH, dailyBurnRateMinor: -1 }],
    ['negative liquid cash', { ...AUTHORITATIVE_FINANCIAL_HEALTH, liquidCashMinor: -1 }],
    ['velocity below range', { ...AUTHORITATIVE_FINANCIAL_HEALTH, assetTurnoverVelocityScore: -1 }],
    ['velocity above range', { ...AUTHORITATIVE_FINANCIAL_HEALTH, assetTurnoverVelocityScore: 101 }],
    ['invalid cash status', { ...AUTHORITATIVE_FINANCIAL_HEALTH, cashRunwayStatus: 'unknown' }],
    ['invalid tax status', { ...AUTHORITATIVE_FINANCIAL_HEALTH, taxReserveFundStatus: 'unknown' }],
    ['invalid asset category', { ...AUTHORITATIVE_FINANCIAL_HEALTH, assetCategory: 'unknown' }],
  ])('keeps %s in demo mode (#87)', (_case, metrics) => {
    const html = renderWithProviders(
      <UniversalFinancialHealthGauge
        isCoreConnected
        expectedBookId={EXPECTED_BOOK}
        trustedSource={TRUSTED_SOURCE}
        authoritativeSnapshot={{
          metrics: metrics as FinancialHealthSnapshot,
          bookId: EXPECTED_BOOK,
          periodStart: '2026-08-01',
          periodEnd: '2026-08-28',
          asOf: '2026-08-28T06:00:00Z',
          source: TRUSTED_SOURCE,
        }}
      />
    )
    expect(html).toContain('Data Demo')
  })

  it('renders signed authoritative margins without inventing accounting validity or negative CSS widths (#87)', () => {
    const html = renderWithProviders(
      <UniversalFinancialHealthGauge
        isCoreConnected
        expectedBookId={EXPECTED_BOOK}
        trustedSource={TRUSTED_SOURCE}
        authoritativeSnapshot={{
          metrics: {
            ...AUTHORITATIVE_FINANCIAL_HEALTH,
            grossMarginPercent: -12.5,
            operatingMarginPercent: -18.2,
            netMarginPercent: 4.3,
          },
          bookId: EXPECTED_BOOK,
          periodStart: '2026-08-01',
          periodEnd: '2026-08-28',
          asOf: '2026-08-28T06:00:00Z',
          source: TRUSTED_SOURCE,
        }}
      />
    )
    expect(html).toContain('LIVE • Terverifikasi CORE')
    expect(html).toContain('Gross:')
    expect(html).toContain('-12.5')
    expect(html).toContain('4.3')
    expect(html).not.toMatch(/width:-/)
  })

  it.each([
    ['missing expected book', { expectedBookId: undefined, trustedSource: TRUSTED_SOURCE }],
    ['missing trusted source', { expectedBookId: EXPECTED_BOOK, trustedSource: undefined }],
  ])('requires the %s trust anchor before showing live CORE data (#87)', (_case, anchors) => {
    const html = renderWithProviders(
      <UniversalFinancialHealthGauge
        isCoreConnected
        {...anchors}
        authoritativeSnapshot={{
          metrics: AUTHORITATIVE_FINANCIAL_HEALTH,
          bookId: EXPECTED_BOOK,
          periodStart: '2026-08-01',
          periodEnd: '2026-08-28',
          asOf: '2026-08-28T06:00:00Z',
          source: TRUSTED_SOURCE,
        }}
      />
    )
    expect(html).toContain('Data Demo')
    expect(html).not.toContain('LIVE • Terverifikasi CORE')
  })

  it('renders Multi-Entity Holding Tab with simulation indicator in demo mode (#86)', () => {
    const html = renderWithProviders(<MultiEntityHoldingTab />)
    expect(html).toContain('Daftar Entitas Legal Perusahaan')
    expect(html).toContain('Simulasikan Jurnal Eliminasi Konsolidasi')
  })

  it('renders Bank Reconciliation Modal with draft match feedback in demo mode (#85)', () => {
    const html = renderWithProviders(<FindAndMatchReconciliationModal isOpen={true} onClose={() => {}} />)
    expect(html).toContain('Rekonsiliasi Bank')
    expect(html).toContain('Mutasi Bank Masuk')
  })

  it('renders Cafe Go-Live Readiness Modal distinguishing virtual simulation from physical hardware (#88)', () => {
    const html = renderWithProviders(<CafeGoLiveReadinessModal isOpen={true} onClose={() => {}} />)
    expect(html).toContain('Pusat Kesiapan Operasional Toko')
    expect(html).toContain('Buka Toko (Mode Simulasi Virtual)')
  })
})
