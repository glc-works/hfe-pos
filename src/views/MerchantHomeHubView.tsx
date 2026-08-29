import React, { useState, Suspense, lazy } from 'react'
import { Card, Button, Badge, TextInput } from '../ui'
import { 
  Building2, Landmark, TrendingUp, QrCode, Globe, Users, 
  Calendar, ShieldAlert, KeyRound, AlertTriangle, ArrowLeft,
  CheckCircle2, Bell, Sparkles, ExternalLink, Loader2,
  ShoppingBag, Ticket
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
  const [activeTab, setActiveTab] = useState<HubTabKey>(initialTab)
  const [isPinAuthenticated, setIsPinAuthenticated] = useState<boolean>(bypassPinForTesting)
  const [showGoLiveModal, setShowGoLiveModal] = useState<boolean>(false)
  const [pinInput, setPinInput] = useState<string>('')
  const [pinError, setPinError] = useState<string | null>(null)

  // Attention Center Alerts
  const attentionAlerts = [
    { id: 'ALT-01', type: 'warning', text: 'Stok Biji Kopi Gayo Arabica menipis (sisa 1.8 kg, di bawah batas minimum 3.0 kg).' },
    { id: 'ALT-02', type: 'info', text: 'Domain kopinusantara.id terverifikasi DNS CNAME dan aktif melayani pesanan online.' },
    { id: 'ALT-03', type: 'reminder', text: 'Jatuh tempo pelaporan Pajak Restoran PB1 10% ke Bapenda dalam 6 hari.' },
  ]

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock valid owner PINs: 8888 or 1234
    if (pinInput === '8888' || pinInput === '1234') {
      setIsPinAuthenticated(true)
      setPinError(null)
      setPinInput('')
    } else {
      setPinError('PIN Salah. Masukkan PIN Owner / Manager (contoh: 8888).')
      setPinInput('')
    }
  }

  // 1. PIN Gate Modal (If not authenticated)
  if (!isPinAuthenticated) {
    return (
      <div className="h-full min-h-0 w-full flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-sm p-6 bg-card border-border shadow-2xl space-y-5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 mx-auto flex items-center justify-center border border-purple-500/20">
            <KeyRound className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">Merchant Home / Hub</h3>
            <p className="text-xs text-muted-foreground">
              Pusat Bisnis Owner dilindungi PIN. Masukkan 4-digit PIN Owner / Manager.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <TextInput
                type="password"
                maxLength={4}
                autoFocus
                placeholder="••••"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value.replace(/\D/g, ''))
                  if (pinError) setPinError(null)
                }}
                className="font-mono text-center text-2xl tracking-[0.4em] font-bold h-12"
              />
              {pinError && (
                <div className="text-[11px] text-rose-400 mt-2 flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> {pinError}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              {onBackToPos && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onBackToPos}
                  className="flex-1 text-xs"
                >
                  Batal
                </Button>
              )}
              <Button 
                type="submit" 
                className="flex-1 text-xs bg-purple-600 hover:bg-purple-500 text-white font-bold"
              >
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

  const tabs: { key: HubTabKey; label: string; icon: React.ReactNode; glyph: string }[] = [
    { key: 'payouts', label: 'Payouts & Kas', icon: <Landmark className="w-4 h-4" />, glyph: '💰' },
    { key: 'insights', label: 'Executive Insights', icon: <TrendingUp className="w-4 h-4" />, glyph: '📊' },
    { key: 'products', label: 'Produk & Layanan', icon: <ShoppingBag className="w-4 h-4" />, glyph: '🛍️' },
    { key: 'promotions', label: 'Promo & Diskon', icon: <Ticket className="w-4 h-4" />, glyph: '🏷️' },
    { key: 'events', label: 'Event & Tiket', icon: <Calendar className="w-4 h-4" />, glyph: '🎟️' },
    { key: 'holding_entities', label: 'Holding & Multi-Entitas', icon: <Building2 className="w-4 h-4" />, glyph: '🏢' },
    { key: 'print_qr', label: 'Print & QR Studio', icon: <QrCode className="w-4 h-4" />, glyph: '🖨️' },
    { key: 'domains', label: 'Storefront & Domain', icon: <Globe className="w-4 h-4" />, glyph: '🌐' },
    { key: 'team_pin', label: 'Tim & PIN Akses', icon: <Users className="w-4 h-4" />, glyph: '👥' },
    { key: 'tax_pb1', label: 'Pajak PB1 & Bapenda', icon: <Calendar className="w-4 h-4" />, glyph: '📅' },
  ]

  return (
    <div className="h-full min-h-0 flex flex-col bg-background text-foreground overflow-hidden">
      {/* Top Fixed Header Strip */}
      <header className="shrink-0 z-20 border-b border-border bg-card/80 backdrop-blur px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBackToPos && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onBackToPos}
              className="text-xs font-semibold shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Kembali ke Kasir
            </Button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-primary" /> {config.storeName || 'Kopi Nusantara'} — Merchant Hub
              </h2>
              <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[10px]">
                👑 Owner Mode
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              Ruang kendali terpadu bisnis, katalog produk, promosi, arus kas, domain, dan kepatuhan pajak daerah
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setShowGoLiveModal(true)}
            className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kesiapan Buka Toko</span>
          </Button>

          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setIsPinAuthenticated(false)}
            className="text-xs font-mono"
            title="Kunci Sesi Hub"
          >
            <KeyRound className="w-3.5 h-3.5 mr-1 text-muted-foreground" /> Kunci Sesi
          </Button>
        </div>
      </header>

      {/* Attention Center Top Alert Bar */}
      <div className="shrink-0 bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2 text-amber-300 font-semibold shrink-0">
          <Bell className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] uppercase tracking-wider">🚨 Attention Center:</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground overflow-x-auto">
          {attentionAlerts.map((alt) => (
            <div key={alt.id} className="flex items-center gap-1.5 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <span className="text-foreground/90">{alt.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="shrink-0 border-b border-border bg-muted/30 px-4 pt-2 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all select-none cursor-pointer ${
                  isActive
                    ? 'bg-card text-primary shadow-sm border border-border font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <span>{tab.glyph}</span>
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Content Canvas (Single Scroll Owner) */}
      <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y p-4 sm:p-6 pb-24">
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
