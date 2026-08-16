import React, { useState } from 'react'
import {
  FileText, TrendingUp, DollarSign, Leaf, Users, ShieldCheck,
  Download, Printer, ChevronRight, Calendar, ArrowUpRight, BarChart3,
  CheckCircle2, Sparkles
} from 'lucide-react'
import { useTranslation } from '../../context/LanguageContext'
import { EsgReportModal } from './EsgReportModal'
import { HfeCompanyProfile } from '../../types/pos'

export interface OwnerReportCenterSectionProps {
  companyProfile?: HfeCompanyProfile
  onOpenEsgReport?: () => void
}

export const OwnerReportCenterSection: React.FC<OwnerReportCenterSectionProps> = ({
  companyProfile = {
    brandName: 'Kopitiam Senopati',
    ptLegalName: 'PT Kopi Nusantara Abadi',
    taxIdNpwp: '01.2026.889.2.100.000'
  } as any
}) => {
  const { formatPrice } = useTranslation()
  const [showEsgModal, setShowEsgModal] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'this_month' | 'this_year'>('this_month')

  const reportCategories = [
    {
      id: 'pnl',
      title: 'Laporan Laba Rugi (P&L)',
      desc: 'Pendapatan kotor, HPP bahan baku, beban operasional, dan laba bersih.',
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
      tag: 'Finansial',
      color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
    },
    {
      id: 'tax_pb1',
      title: 'Laporan Pajak Daerah PB1 (10%)',
      desc: 'Rekapitulasi penjualan kena pajak dan saldo utang PB1 siap setor Bapenda.',
      icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
      tag: 'Kepatuhan Pajak',
      color: 'border-purple-500/30 bg-purple-500/10 text-purple-300'
    },
    {
      id: 'esg',
      title: 'Laporan Keberlanjutan ESG',
      desc: 'Metrik paperless receipts, CO2e dicegah, BYOC, dan distribusi tip karyawan.',
      icon: <Leaf className="w-5 h-5 text-teal-400" />,
      tag: 'ESG & Green',
      color: 'border-teal-500/30 bg-teal-500/10 text-teal-300',
      action: () => setShowEsgModal(true)
    },
    {
      id: 'inventory_audit',
      title: 'Audit Stok & Spoilage Kerusakan',
      desc: 'Selisih stok opname fisik, pencatatan bahan rusak, dan beban GL 5104.',
      icon: <FileText className="w-5 h-5 text-amber-400" />,
      tag: 'Inventori',
      color: 'border-amber-500/30 bg-amber-500/10 text-amber-300'
    },
    {
      id: 'staff_tips',
      title: 'Distribusi Tip & Performa Staf',
      desc: 'Rincian penerimaan tip elektronik QRIS dan pembagian adil ke tim shift.',
      icon: <Users className="w-5 h-5 text-blue-400" />,
      tag: 'SDM & Tim',
      color: 'border-blue-500/30 bg-blue-500/10 text-blue-300'
    }
  ]

  const handleExportCsv = (title: string) => {
    alert(`📥 Mengunduh data ${title} periode ${selectedPeriod.toUpperCase()} dalam format CSV / Excel.`)
  }

  const handlePrint = (title: string) => {
    window.print()
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col gap-5 shadow-2xl">
      {/* 1. SECTION HEADER WITH PERIOD SELECTOR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
              👑 Owner Report & Intelligence Center
            </h3>
            <p className="text-xs text-slate-400">
              Pusat ekspor laporan resmi, kepatuhan pajak daerah, laba rugi, dan audit keberlanjutan.
            </p>
          </div>
        </div>

        {/* Period Selector Pills */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs self-stretch sm:self-auto justify-between">
          {[
            { id: 'today', label: 'Hari Ini' },
            { id: 'this_month', label: 'Bulan Ini' },
            { id: 'this_year', label: 'Tahun 2026' }
          ].map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPeriod(p.id as any)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedPeriod === p.id
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. EXECUTIVE HIGHLIGHT CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Pendapatan Bersih</span>
          <span className="text-sm sm:text-base font-mono font-black text-emerald-400">
            {selectedPeriod === 'today' ? 'Rp 14.850.000' : 'Rp 482.000.000'}
          </span>
          <span className="text-[9px] text-emerald-500 font-bold flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-3 h-3" /> +14.2% vs periode lalu
          </span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Gross Profit Margin</span>
          <span className="text-sm sm:text-base font-mono font-black text-white">68.4%</span>
          <span className="text-[9px] text-slate-400">HPP Terkendali 31.6%</span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Pajak PB1 (10%)</span>
          <span className="text-sm sm:text-base font-mono font-black text-purple-400">
            {selectedPeriod === 'today' ? 'Rp 1.485.000' : 'Rp 48.200.000'}
          </span>
          <span className="text-[9px] text-purple-400">Siap Lapor Bapenda</span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Integritas Kas Shift</span>
          <span className="text-sm sm:text-base font-mono font-black text-teal-400">99.4% Match</span>
          <span className="text-[9px] text-teal-500 font-bold flex items-center gap-0.5">
            <CheckCircle2 className="w-3 h-3" /> Blind Count Tertib
          </span>
        </div>
      </div>

      {/* 3. REPORT LIST & EXPORT ACTIONS */}
      <div className="flex flex-col gap-2.5">
        <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
          Katalog Laporan Resmi & Ekspor Data
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {reportCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      {cat.icon}
                    </div>
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${cat.color}`}>
                      {cat.tag}
                    </span>
                  </div>
                </div>
                <h5 className="font-extrabold text-sm text-white mt-2.5">{cat.title}</h5>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{cat.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                {cat.action ? (
                  <button
                    type="button"
                    onClick={cat.action}
                    className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Leaf className="w-3.5 h-3.5" /> Buka Laporan Keberlanjutan ➔
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleExportCsv(cat.title)}
                      className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Unduh CSV</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePrint(cat.title)}
                      className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Cetak PDF</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ESG Report Modal Attachment */}
      <EsgReportModal
        show={showEsgModal}
        companyProfile={companyProfile}
        onClose={() => setShowEsgModal(false)}
      />
    </div>
  )
}
