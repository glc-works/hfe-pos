import React, { useState, Suspense, lazy } from 'react'
import { Card, Button, Badge, TextInput } from '../ui'
import { 
  Building2, Landmark, TrendingUp, QrCode, Globe, Users, 
  Calendar, ShieldAlert, KeyRound, AlertTriangle, ArrowLeft,
  CheckCircle2, Bell, Sparkles, ExternalLink, Loader2,
  ShoppingBag, Ticket, ChevronRight, ArrowRight
} from 'lucide-react'
import { useMerchantConfig } from '../context/MerchantConfigContext'
import { CafeGoLiveReadinessModal } from '../components/hub/CafeGoLiveReadinessModal'

const PayoutsSettlementTab = lazy(() => import('../components/hub/PayoutsSettlementTab').then(m => ({ default: m.PayoutsSettlementTab })))
const ExecutiveInsightsTab = lazy(() => import('../components/hub/ExecutiveInsightsTab').then(m => ({ default: m.ExecutiveInsightsTab })))
const ProductCatalogManagementTab = lazy(() => import('../components/hub/ProductCatalogManagementTab').then(m => ({ default: m.ProductCatalogManagementTab })))
const PromotionsAndDiscountsTab = lazy(() => import('../components/hub/PromotionsAndDiscountsTab').then(m => ({ default: m.PromotionsAndDiscountsTab })))
const EventManagementTab = lazy(() => import('../components/hub/EventManagementTab').then(m => ({ default: m.EventManagementTab })))
const MultiEntityHoldingTab = lazy(() => import('../components/hub/MultiEntityHoldingTab').then(m => ({ default: m.MultiEntityHoldingTab })))
const PrintQrStudioTab = lazy(() => import('../components/hub/PrintQrStudioTab').then(m => ({ default: m.PrintQrStudioTab })))
const DomainManagerTab = lazy(() => import('../components/hub/DomainManagerTab').then(m => ({ default: m.DomainManagerTab })))
const TeamPinAccessTab = lazy(() => import('../components/hub/TeamPinAccessTab').then(m => ({ default: m.TeamPinAccessTab })))
const TaxComplianceTab = lazy(() => import('../components/hub/TaxComplianceTab').then(m => ({ default: m.TaxComplianceTab })))

export type HubTabKey = 'payouts' | 'insights' | 'products' | 'promotions' | 'events' | 'holding_entities' | 'print_qr' | 'domains' | 'team_pin' | 'tax_pb1'

interface MerchantHomeHubViewProps {
  onBackToPos?: () => void
  initialTab?: HubTabKey
  bypassPinForTesting?: boolean
}

export function MerchantHomeHubView({ 
  onBackToPos,
  initialTab = 'payouts',
  bypassPinForTesting = false
}: MerchantHomeHubViewProps) {
  const config = useMerchantConfig()
  const [activeTab, setActiveTab] = useState<HubTabKey | null>(initialTab)
  const [isMobileDirectory, setIsMobileDirectory] = useState(false)
  const [isPinAuthenticated, setIsPinAuthenticated] = useState<boolean>(() => bypassPinForTesting)
  const [ownerPinInput, setOwnerPinInput] = useState('')
  const [pinError, setPinError] = useState<string | null>(null)
  const [showGoLiveModal, setShowGoLiveModal] = useState(false)

  const handleVerifyOwnerPin = (e: React.FormEvent) => {
    e.preventDefault()
    if (ownerPinInput === '8888' || ownerPinInput === '1234') {
      setIsPinAuthenticated(true)
      setPinError(null)
    } else {
      setPinError('PIN Owner salah. Gunakan PIN 8888 untuk simulasi.')
    }
  }

  if (!isPinAuthenticated) {
    return (
      <div className="h-full min-h-0 flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-sm p-6 space-y-4 border-border bg-card shadow-2xl text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto text-xl font-bold">
            👑
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Merchant Hub (Owner Mode)</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Masukkan PIN Owner 4-digit untuk mengakses ruang kendali bisnis dan keuangan.
            </p>
          </div>

          <form onSubmit={handleVerifyOwnerPin} className="space-y-3">
            <TextInput
              type="password"
              maxLength={6}
              value={ownerPinInput}
              onChange={(e) => setOwnerPinInput(e.target.value)}
              placeholder="••••"
              className="text-center font-mono text-lg tracking-widest bg-background border-border"
              autoFocus
            />
            {pinError && (
              <p className="text-[11px] font-semibold text-rose-400">{pinError}</p>
            )}
            <div className="flex gap-2">
              {onBackToPos && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onBackToPos} 
                  className="flex-1 text-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Kasir
                </Button>
              )}
              <Button type="submit" className="flex-1 text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold">
                Buka Sesi
              </Button>
            </div>
          </form>

          <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
            <span className="font-mono">Default Demo PIN: 8888 atau 1234</span>
          </div>
        </Card>
      </div>
    )
  }

  const tabs: { key: HubTabKey; label: string; group: string; desc: string; icon: React.ReactNode; glyph: string }[] = [
    { key: 'payouts', label: 'Payouts & Kas', group: 'Finansial & Kas', desc: 'Pencairan dana QRIS & rekonsiliasi bank', icon: <Landmark className="w-4 h-4" />, glyph: '💰' },
    { key: 'insights', label: 'Executive Insights', group: 'Finansial & Kas', desc: 'Omzet hari ini, margin laba & P&L', icon: <TrendingUp className="w-4 h-4" />, glyph: '📊' },
    { key: 'tax_pb1', label: 'Pajak PB1 & Bapenda', group: 'Finansial & Kas', desc: 'Kepatuhan pajak restoran 10%', icon: <Calendar className="w-4 h-4" />, glyph: '📅' },
    { key: 'products', label: 'Produk & Layanan', group: 'Katalog & Promosi', desc: 'Kelola SKU, harga, HPP & resep BOM', icon: <ShoppingBag className="w-4 h-4" />, glyph: '🛍️' },
    { key: 'promotions', label: 'Promo & Diskon', group: 'Katalog & Promosi', desc: 'Kode kupon voucher & happy hour', icon: <Ticket className="w-4 h-4" />, glyph: '🏷️' },
    { key: 'events', label: 'Event & Tiket', group: 'Katalog & Promosi', desc: 'Live music, nobar & tiket FDC', icon: <Calendar className="w-4 h-4" />, glyph: '🎟️' },
    { key: 'holding_entities', label: 'Holding & Multi-Entitas', group: 'Toko & Multi-Cabang', desc: 'Konsolidasi omzet & cabang outlet', icon: <Building2 className="w-4 h-4" />, glyph: '🏢' },
    { key: 'print_qr', label: 'Print & QR Studio', group: 'Toko & Multi-Cabang', desc: 'Cetak QR meja & format struk kasir', icon: <QrCode className="w-4 h-4" />, glyph: '🖨️' },
    { key: 'domains', label: 'Storefront & Domain', group: 'Toko & Multi-Cabang', desc: 'Domain kustom QR & DNS CNAME', icon: <Globe className="w-4 h-4" />, glyph: '🌐' },
    { key: 'team_pin', label: 'Tim & PIN Akses', group: 'Toko & Multi-Cabang', desc: 'Hak akses kasir, barista & owner', icon: <Users className="w-4 h-4" />, glyph: '👥' },
  ]

  const activeTabObj = tabs.find((t) => t.key === activeTab) || tabs[0]

  return (
    <div className="h-full min-h-0 flex flex-col bg-background text-foreground overflow-hidden">
      {/* DESKTOP LAYER 2: CONTEXTUAL SUB-NAV STRIP (>= md) */}
      <div className="hidden md:flex shrink-0 border-b border-border bg-card/60 backdrop-blur-xs px-4 py-2 items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center gap-2 overflow-x-auto py-0.5 min-w-max">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all select-none cursor-pointer min-h-[36px] ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <span>{tab.glyph}</span>
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={() => setShowGoLiveModal(true)}
            className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kesiapan Toko</span>
          </Button>

          <button
            type="button"
            onClick={() => setIsPinAuthenticated(false)}
            className="p-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl border border-border cursor-pointer"
            title="Kunci Sesi Hub"
          >
            <KeyRound className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {/* ACTIVE CONTENT CANVAS (Single Scroll Owner) */}
      <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y p-3 sm:p-6 pb-24">
          <div className="max-w-6xl mx-auto">
            <Suspense fallback={
              <div className="flex items-center justify-center py-20 text-xs text-muted-foreground gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Memuat modul hub...</span>
              </div>
            }>
              {activeTab === 'payouts' && <PayoutsSettlementTab />}
              {activeTab === 'insights' && <ExecutiveInsightsTab />}
              {activeTab === 'products' && <ProductCatalogManagementTab />}
              {activeTab === 'promotions' && <PromotionsAndDiscountsTab />}
              {activeTab === 'events' && <EventManagementTab />}
              {activeTab === 'holding_entities' && <MultiEntityHoldingTab />}
              {activeTab === 'print_qr' && <PrintQrStudioTab />}
              {activeTab === 'domains' && <DomainManagerTab />}
              {activeTab === 'team_pin' && <TeamPinAccessTab />}
              {activeTab === 'tax_pb1' && <TaxComplianceTab />}
            </Suspense>
          </div>
        </main>

      {/* Cafe Go-Live Readiness Modal */}
      <CafeGoLiveReadinessModal
        isOpen={showGoLiveModal}
        onClose={() => setShowGoLiveModal(false)}
      />
    </div>
  )
}
