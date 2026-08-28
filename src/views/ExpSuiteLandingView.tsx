import React, { useState } from 'react'
import {
  Sparkles, CheckCircle2, Smartphone,
  BookOpen, CreditCard, LayoutGrid, ShoppingBag, ArrowRight
} from 'lucide-react'
import { useTranslation } from '../context/LanguageContext'
import { useMerchantConfig } from '../context/MerchantConfigContext'

export const ExpSuiteLandingView: React.FC = () => {
  const { t } = useTranslation()
  const { setActiveApp } = useMerchantConfig()
  const [selectedIndustry, setSelectedIndustry] = useState<'fnb' | 'retail' | 'salon' | 'coworking'>('fnb')

  const products = [
    {
      id: 'pos',
      name: 'POS.Hfeit',
      tagline: 'Run the Business',
      icon: Smartphone,
      color: 'border-amber-200 text-amber-800 bg-amber-50/50',
      action: () => setActiveApp('cafe'),
      points: ['Respon Cepat <16ms & Cetak Offline', 'KDS Dapur Multi-Stasiun & Peta Meja', 'Izin Staf & PIN Role Manajer (RBAC)']
    },
    {
      id: 'book',
      name: 'BOOK.Hfeit',
      tagline: 'Control the Books',
      icon: BookOpen,
      color: 'border-emerald-200 text-emerald-800 bg-emerald-50/50',
      action: () => setActiveApp('cafe'),
      points: ['Jurnal Double-Entry Otomatis', 'Kalkulasi Pajak PB1 10% Real-Time', 'Nol Selisih Kas & Rekap Manual']
    },
    {
      id: 'order',
      name: 'ORDER.Hfeit',
      tagline: 'Do Business',
      icon: ShoppingBag,
      color: 'border-rose-200 text-rose-800 bg-rose-50/50',
      action: () => setActiveApp('customer'),
      points: ['Pemesanan Mandiri 3-Jalur (QR, Bungkus, Antar)', 'Settlement QRIS Dinamis Instan', 'Cart Handoff <16ms ke Terminal Kasir']
    },
    {
      id: 'board',
      name: 'BOARD.Hfeit',
      tagline: 'Be Found',
      icon: LayoutGrid,
      color: 'border-cyan-200 text-cyan-800 bg-cyan-50/50',
      action: () => setActiveApp('landing'),
      points: ['Cloudflare Edge TTFB <15ms Super Kilat', 'Schema.org JSON-LD Terindeks Resmi di Google', 'Sistem Reservasi Meja & Jam Buka']
    },
    {
      id: 'card',
      name: 'CARD.Hfeit',
      tagline: 'Be Known',
      icon: CreditCard,
      color: 'border-purple-200 text-purple-800 bg-purple-50/50',
      action: () => setActiveApp('customer-portal'),
      points: ['Apple Wallet Style Loyalty Stamp Pass', 'Dompet E-Tiket Gate-In Workshop', 'Paspor Relasi Satu Nomor Member']
    }
  ]

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 font-sans p-4 sm:p-8 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem]">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Hero */}
        <div className="text-center space-y-4 pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-amber-300 shadow-xs text-xs font-mono font-bold text-amber-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>A SYSTEM THAT GROWS WITH YOU</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight max-w-3xl mx-auto leading-tight">
            Satu Sistem untuk{' '}
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
              Setiap Tahap
            </span>{' '}
            Bisnis Anda.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-normal">
            Dirancang untuk setiap tahap bisnis Anda—dari gerai pertama hingga jaringan enterprise. Kasir kilat &lt;16ms, struk offline, pesanan QR meja, dan pembukuan otomatis Hfe CORE.
          </p>
        </div>

        {/* 5-Product Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((prod) => {
            const Icon = prod.icon
            return (
              <div
                key={prod.id}
                className={`p-6 rounded-2xl border bg-white shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${prod.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                      <Icon className="w-5 h-5 text-slate-800" />
                    </div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                      {prod.tagline}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-950 mb-1">{prod.name}</h3>

                  <ul className="mt-4 space-y-2 text-xs text-slate-600">
                    {prod.points.map((pt, i) => (
                      <li key={i} className="flex items-center gap-2 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={prod.action}
                  className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-bold text-slate-800 hover:text-amber-700 transition-colors w-full"
                >
                  <span>Buka Modul</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>

        {/* 5-Step Simulation Ripple */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-widest">
              SIMULASI SATU KEBENARAN DATA
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950">
              Satu Transaksi Mengalir Otomatis ke Seluruh Sistem
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
            {[
              { step: '01', title: 'Order QR Meja', sys: 'ORDER.Hfeit', color: 'border-rose-200 text-rose-700 bg-rose-50/50' },
              { step: '02', title: 'Tiket KDS Dapur', sys: 'POS.Hfeit', color: 'border-amber-200 text-amber-700 bg-amber-50/50' },
              { step: '03', title: 'Stamp Member', sys: 'CARD.Hfeit', color: 'border-purple-200 text-purple-700 bg-purple-50/50' },
              { step: '04', title: 'Jurnal Akuntansi', sys: 'BOOK.Hfeit', color: 'border-emerald-200 text-emerald-700 bg-emerald-50/50' },
              { step: '05', title: 'Pantau Omzet POS', sys: 'POS.Hfeit (Owner)', color: 'border-indigo-200 text-indigo-700 bg-indigo-50/50' },
            ].map((st) => (
              <div key={st.step} className={`p-4 rounded-xl border ${st.color} flex flex-col justify-between`}>
                <span className="text-[10px] font-mono text-slate-400 font-bold block mb-1">STEP {st.step}</span>
                <h4 className="text-xs font-bold text-slate-900 mb-1">{st.title}</h4>
                <span className="text-[11px] font-mono font-bold">{st.sys}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
