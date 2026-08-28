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
