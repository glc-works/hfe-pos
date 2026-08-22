import React, { useState } from 'react'
import {
  Sparkles, CheckCircle2, Store, Smartphone,
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
      id: 'admin',
      name: 'ADMIN.Hfeit',
      tagline: 'Manage the Business',
      icon: Store,
      color: 'border-indigo-500/30 text-indigo-400 bg-indigo-950/40',
      action: () => setActiveApp('hfeit-corporate'),
      points: ['Multi-Cabang & Hierarki Outlet', 'Izin Staf & PIN Kasir (RBAC)', 'Kontrol Langganan & Aktivasi Produk']
    },
    {
      id: 'pos',
      name: 'POS.Hfeit',
      tagline: 'Run the Business',
      icon: Smartphone,
      color: 'border-amber-500/30 text-amber-400 bg-amber-950/40',
      action: () => setActiveApp('cafe'),
      points: ['Respon Cepat <16ms', 'KDS Dapur Multi-Stasiun', 'Tahan Banting Offline']
    },
    {
      id: 'book',
      name: 'BOOK.Hfeit',
      tagline: 'Control the Books',
      icon: BookOpen,
      color: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/40',
      action: () => setActiveApp('cafe'),
      points: ['Jurnal Double-Entry Otomatis', 'Pajak PB1 10% Real-Time', 'Nol Selisih Kas & Rekap Manual']
    },
    {
      id: 'card',
      name: 'CARD.Hfeit',
      tagline: 'Be Known',
      icon: CreditCard,
      color: 'border-purple-500/30 text-purple-400 bg-purple-950/40',
      action: () => setActiveApp('customer-portal'),
      points: ['Apple Wallet Style Loyalty Stamp', 'Dompet E-Tiket Workshop', 'Paspor Relasi Satu Pelanggan']
    },
    {
      id: 'board',
      name: 'BOARD.Hfeit',
      tagline: 'Be Found',
      icon: LayoutGrid,
      color: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/40',
      action: () => setActiveApp('landing'),
      points: ['Cloudflare Edge TTFB <20ms', 'Schema.org JSON-LD Terindeks Google', 'Sistem Reservasi Meja']
    },
    {
      id: 'order',
      name: 'ORDER.Hfeit',
      tagline: 'Do Business',
      icon: ShoppingBag,
      color: 'border-rose-500/30 text-rose-400 bg-rose-950/40',
      action: () => setActiveApp('customer'),
      points: ['Dine-In QR Meja, Takeaway & Delivery', 'Settlement QRIS Dinamis Instan', 'Cart Handoff <16ms ke Kasir']
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-24">
      {/* Hero Header */}
      <section className="pt-12 pb-16 px-4 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>EXP.HFEIT ECOSYSTEM SUITE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
          Satu Sistem Cerdas untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">Semua Urusan Bisnis</span> Anda.
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mb-8">
          Jalankan kasir cepat, terima pesanan QR meja, bangun member, dan dapatkan pembukuan otomatis tanpa bikin pusing.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setActiveApp('cafe')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
          >
            🚀 Daftarkan Usaha Anda Gratis (60 Detik) ➔
          </button>
          <button
            onClick={() => setActiveApp('cafe')}
            className="px-5 py-3 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-white font-medium text-sm transition-all"
          >
            📱 Coba Demo Kasir POS
          </button>
        </div>
      </section>

      {/* 6 Products Bento Grid */}
      <section className="px-4 max-w-6xl mx-auto w-full mb-16">
        <div className="text-center mb-8">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">6 Pilar Pengalaman Bisnis</span>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Satu Rangkaian Lengkap untuk Menjalankan Usaha</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((prod) => {
            const Icon = prod.icon
            return (
              <div
                key={prod.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-xl border ${prod.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded-full bg-slate-800">
                      {prod.tagline}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{prod.name}</h3>
                  <ul className="space-y-1.5 mb-4">
                    {prod.points.map((pt, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={prod.action}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 mt-auto pt-3 border-t border-white/5"
                >
                  Buka {prod.name} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
