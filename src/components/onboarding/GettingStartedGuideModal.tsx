import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/ui'
import { BookOpen, X, Sparkles, Coffee, Flame, Sprout, Ship, ShoppingCart, Sliders, ArrowRightLeft, ShieldCheck, CheckCircle2, ChevronRight, Layers, FileSpreadsheet } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onOpenWizard?: () => void
}

export const GettingStartedGuideModal: React.FC<Props> = ({ isOpen, onClose, onOpenWizard }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'clusters' | 'flow' | 'migration' | 'accounting'>('overview')

  if (!isOpen) return null

  const tabs = [
    { id: 'overview' as const, label: 'Arsitektur Tenancy' },
    { id: 'clusters' as const, label: '5 Specialist Clusters' },
    { id: 'flow' as const, label: '3+1 Onboarding Flow' },
    { id: 'migration' as const, label: '1-Click Migration' },
    { id: 'accounting' as const, label: 'CoA & Saldo Awal' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-amber-50 dark:bg-amber-950/95 rounded-2xl shadow-2xl border border-amber-900/20 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-amber-900/10 bg-amber-500/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-600 text-white shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-amber-950 dark:text-amber-100">
                  Panduan Lengkap Setup & Onboarding HFE
                </h2>
                <Badge variant="default" className="text-[10px] py-0">
                  Dokumentasi Resmi
                </Badge>
              </div>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                Memahami topologi multi-tenancy, 5 klaster bisnis, & migrasi saldo awal
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-amber-800 dark:text-amber-200 hover:bg-amber-500/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2 bg-amber-500/5 border-b border-amber-900/10 flex items-center gap-1.5 overflow-x-auto shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-amber-900/70 dark:text-amber-100/70 hover:bg-amber-500/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-amber-950 dark:text-amber-100 leading-relaxed">
          {activeTab === 'overview' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-900/15">
                <h4 className="font-bold text-sm text-amber-950 dark:text-amber-100 mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  Struktur Multi-Tier Corporate & Multi-Tenancy
                </h4>
                <p className="text-[11px] text-amber-900/80 dark:text-amber-200/80">
                  HFE beroperasi dengan pemisahan yuridis dan isolasi data per tenant:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <Card className="border-amber-900/15 bg-amber-500/5 p-3">
                  <span className="text-[10px] font-bold text-amber-600 block">👑 BLOK 01 - 09</span>
                  <h5 className="font-bold text-xs mt-0.5">Global HoldCo & IP</h5>
                  <p className="text-[10px] text-amber-800/70 dark:text-amber-300/70 mt-1">
                    HFE IT Global Holdings Pte. Ltd. (Singapore) mengelola master IP & Connect Hub.
                  </p>
                </Card>
                <Card className="border-amber-900/15 bg-amber-500/5 p-3">
                  <span className="text-[10px] font-bold text-emerald-600 block">🌏 BLOK 10 - 49</span>
                  <h5 className="font-bold text-xs mt-0.5">Regional OpCos</h5>
                  <p className="text-[10px] text-amber-800/70 dark:text-amber-300/70 mt-1">
                    PT HFE Teknologi Indo (Tenant 10), HFE Malaysia (Tenant 12), HFE HK (Tenant 30).
                  </p>
                </Card>
                <Card className="border-amber-900/15 bg-amber-500/5 p-3">
                  <span className="text-[10px] font-bold text-blue-600 block">🛒 BLOK 100+</span>
                  <h5 className="font-bold text-xs mt-0.5">Commercial Merchants</h5>
                  <p className="text-[10px] text-amber-800/70 dark:text-amber-300/70 mt-1">
                    Outlet Kafe, Resto, Roastery, dan Perkebunan Anda beroperasi di blok tenant terisolasi.
                  </p>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'clusters' && (
            <div className="space-y-2.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-200">
                5 Specialist Business Clusters & Kustom:
              </h4>
              <div className="space-y-2">
                {[
                  { icon: Coffee, title: '1. Kafe & Resto F&B (CLUSTER_FNB)', desc: 'Fitur: Table Floor Plan (👥 3/4 Kursi), Drink Modifiers, KDS Kanban, Recipe BOM & QR Table Self-Order.' },
                  { icon: Flame, title: '2. Roasting & Manufaktur (CLUSTER_ROASTERY)', desc: 'Fitur: Bill of Materials (BOM) Green Bean ke Roasted, Penyusutan Sangrai, & Invoice Grosir B2B.' },
                  { icon: Sprout, title: '3. Perkebunan Agrikultur (CLUSTER_PLANTATION)', desc: 'Fitur: Akuntansi Aset Biologis PSAK 69, Nilai Wajar Hasil Panen, Manajemen Plot Kebun.' },
                  { icon: Ship, title: '4. Ekspor & Cross-Border (CLUSTER_TRADING)', desc: 'Fitur: Multi-Currency (IDR, SGD, MYR, HKD), Kontainer Trading, Eliminasi Antar-Entitas.' },
                  { icon: ShoppingCart, title: '5. Retail & Minimarket (CLUSTER_RETAIL)', desc: 'Fitur: Barcode Scanner, Multi-UOM Satuan Grosir, Buku Kasbon Pelanggan, Scan & Go Mobile.' },
                  { icon: Sliders, title: '6. Kustom & Usaha Lainnya (CLUSTER_OTHER)', desc: 'Fitur: Template bagan akun (CoA) komersial umum yang fleksibel untuk kustomisasi.' },
                ].map((c, i) => {
                  const Icon = c.icon
                  return (
                    <div key={i} className="p-2.5 rounded-xl border border-amber-900/15 bg-amber-500/5 flex items-start gap-2.5">
                      <div className="p-1.5 rounded-lg bg-amber-600/15 text-amber-700 dark:text-amber-300 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-amber-950 dark:text-amber-100">{c.title}</h5>
                        <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5">{c.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'flow' && (
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-200">
                Alur Onboarding 3 Langkah + 1 Pratinjau Sistem:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl border border-amber-900/15 bg-amber-500/5">
                  <Badge variant="default" className="text-[10px] mb-1">Langkah 1</Badge>
                  <h5 className="font-bold text-xs">Identitas & Jalur Migrasi</h5>
                  <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                    Pilih Fresh Start vs 1-Click Migration Bridge, Klaster Spesialis, dan Negara/Mata Uang.
                  </p>
                </div>
                <div className="p-3 rounded-xl border border-amber-900/15 bg-amber-500/5">
                  <Badge variant="default" className="text-[10px] mb-1">Langkah 2</Badge>
                  <h5 className="font-bold text-xs">Brand & Skala Kapasitas</h5>
                  <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                    Nama Outlet, Kontak Sosmed, WiFi, dan Kapasitas (20 Meja 👥 3/4, 20kg Batch Oven, 50 Ha Lahan).
                  </p>
                </div>
                <div className="p-3 rounded-xl border border-amber-900/15 bg-amber-500/5">
                  <Badge variant="default" className="text-[10px] mb-1">Langkah 3</Badge>
                  <h5 className="font-bold text-xs">Pajak PB1 & Kas Float</h5>
                  <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                    Mode Pajak PB1 (0, 1 Exclude, 2 Include), Uang Kembalian Kas Float, & File CSV Migrasi.
                  </p>
                </div>
                <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                  <Badge variant="emerald" className="text-[10px] mb-1">Langkah 4 (PREVIEW)</Badge>
                  <h5 className="font-bold text-xs text-emerald-950 dark:text-emerald-100">Pratinjau Sistem & CoA</h5>
                  <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">
                    Verifikasi Tenancy UUID, Bagan Akun (18 CoA), Jurnal Saldo Awal Seimbang, dan Status Ready.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'migration' && (
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-200">
                1-Click Migration Bridge Connector:
              </h4>
              <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                Impor data master produk, pelanggan, kontak supplier, bagan akun, dan saldo buku awal secara otomatis dari platform sebelumnya:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { name: 'Xero Accounting', icon: '🟢', type: 'API & Bank Feeds' },
                  { name: 'Moka POS', icon: '🟣', type: 'Katalog & Riwayat' },
                  { name: 'Mekari Jurnal', icon: '🔵', type: 'CoA & Saldo Buku' },
                  { name: 'Accurate Online', icon: '🔴', type: 'Master Stok & AP/AR' },
                  { name: 'CSV / Excel', icon: '📄', type: 'Template Tabular' },
                  { name: 'Fresh Setup', icon: '✨', type: 'Tanpa Data Lama' },
                ].map((m, i) => (
                  <div key={i} className="p-2.5 rounded-xl border border-amber-900/15 bg-amber-500/5">
                    <span className="text-sm">{m.icon}</span>
                    <h5 className="font-bold text-xs mt-1 text-amber-950 dark:text-amber-100">{m.name}</h5>
                    <span className="text-[10px] text-amber-800/70 dark:text-amber-300/70">{m.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'accounting' && (
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-950 dark:text-amber-100">
                Prinsip Akuntansi & Bagan Akun Standar (18 CoA):
              </h4>
              <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                Setiap mutasi finansial disinkronkan ke Posting Kernel HCB dengan prinsip Double-Entry:
              </p>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 font-mono text-[11px]">
                <div className="flex justify-between font-bold text-emerald-950 dark:text-emerald-100 border-b border-emerald-500/30 pb-1 mb-1">
                  <span>Persamaan Dasar Akuntansi:</span>
                  <span>ASET = LIABILITAS + EKUITAS</span>
                </div>
                <div className="text-[10px] text-emerald-800 dark:text-emerald-300">
                  Total Debits = Total Credits (Variance: 0.00)
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-amber-900/10 bg-amber-500/10 flex items-center justify-between shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs"
          >
            Tutup Panduan
          </Button>

          {onOpenWizard && (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => {
                onClose()
                onOpenWizard()
              }}
              className="text-xs font-bold"
            >
              <Sparkles className="w-4 h-4 mr-1.5 animate-pulse" />
              Mulai Setup Wizard Sekarang
            </Button>
          )}
        </div>

      </div>
    </div>
  )
}
