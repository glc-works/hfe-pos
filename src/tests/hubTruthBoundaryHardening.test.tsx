import { describe, it, expect } from 'vitest'
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
        authoritativeSnapshot={{
          metrics: AUTHORITATIVE_FINANCIAL_HEALTH,
          bookId: 'BOOK-NCG-HOLDING',
          periodStart: '2026-08-01',
          periodEnd: '2026-08-28',
          asOf: '2026-08-28T06:00:00Z',
          source: 'GET /v1/company-books/BOOK-NCG-HOLDING/reports/financial-health',
        }}
      />
    )
    expect(html).toContain('LIVE • Terverifikasi CORE')
    expect(html).toContain('77')
    expect(html).toContain('2026-08-28T06:00:00Z')
    expect(html).not.toContain('Sample Snapshot: 2026-08-25')
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
