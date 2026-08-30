import React, { useState } from 'react'
import {
  X, Leaf, Users, ShieldCheck, Download, Printer,
  Sparkles, CheckCircle2, TrendingUp, HeartHandshake, FileText
} from 'lucide-react'
import { generateEsgReport, EsgReportRawData } from '../../utils/esgReportEngine'
import { useTranslation } from '../../context/LanguageContext'
import { HfeCompanyProfile } from '../../types/pos'

export interface EsgReportModalProps {
  show: boolean
  companyProfile: HfeCompanyProfile
  onClose: () => void
}

export const EsgReportModal: React.FC<EsgReportModalProps> = ({
  show,
  companyProfile,
  onClose
}) => {
  const { formatPrice } = useTranslation()
  const [copied, setCopied] = useState<boolean>(false)

  if (!show) return null

  // Default aggregate mock data for current operating year
  const rawData: EsgReportRawData = {
    companyName: companyProfile.brandName || 'Artisan Cafe & Roastery HQ',
    legalPtName: companyProfile.ptLegalName || 'PT Artisan Kuliner Nusantara',
    taxIdNpwp: companyProfile.taxIdNpwp || '01.2026.889.2.100.000',
    periodStart: '01 Jan 2026',
    periodEnd: '16 Agu 2026',
    totalTransactions: 5240,
    paperlessTransactions: 4830,
    byocTransactions: 1240,
    surplusFoodPortionsRescued: 380,
    totalTipsCollectedRp: 18450000,
    activeStaffCount: 12,
    dietaryAllergenFlagsHandled: 420,
    allergenIncidentsCount: 0,
    guestFeedbackRatings: [5, 5, 5, 4, 5, 5, 4, 5, 5, 5, 4, 5],
    totalRevenueBeforeTaxRp: 482000000,
    pb1TaxRemittedRp: 48200000,
    shiftReconciliationsCount: 180,
    matchedShiftCount: 179
  }

  const report = generateEsgReport(rawData)

  const handlePrint = () => {
    window.print()
  }

  const handleCopySummary = () => {
    const text = `🌿 *LAPORAN KEBERLANJUTAN ESG RESMI*\n` +
      `Entitas: ${report.metadata.legalPtName} (${report.metadata.companyName})\n` +
      `Periode: ${report.metadata.reportPeriod}\n\n` +
      `[E - Lingkungan]\n` +
      `• Paperless Rate: ${report.environmental.paperlessAdoptionRatePercent}%\n` +
      `• Kertas Termal Dihemat: ${report.environmental.thermalPaperSheetsSaved} Lembar\n` +
      `• CO2e Dicegah: ${report.environmental.carbonCo2SavedKg} kg CO2\n` +
      `• Gelas Plastik Dicegah (BYOC): ${report.environmental.byocSingleUseCupsSaved} Cups\n\n` +
      `[S - Sosial & Karyawan]\n` +
      `• Tip Karyawan Terdistribusi: ${formatPrice(report.social.totalEmployeeTipsDistributedRp)}\n` +
      `• Rata-rata Tip/Staf: ${formatPrice(report.social.averageTipPerStaffRp)}\n` +
      `• Insiden Alergi: 0% (${report.social.allergenSafeOrdersHandled} pesanan aman)\n\n` +
      `[G - Tata Kelola & Pajak]\n` +
      `• Pajak Restoran PB1 10%: ${formatPrice(report.governance.pb1TaxComplianceRp)}\n` +
      `• Akurasi Kas Shift (Blind Count): ${report.governance.shiftBlindCountAccuracyPercent}%\n` +
      `• Status Audit: ${report.governance.auditTrailIntegrityStatus}`

    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">

        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-sm sm:text-base text-white truncate">
                Laporan Keberlanjutan ESG (Sustainability Report)
              </h3>
              <p className="text-[10px] text-slate-400 font-mono truncate">
                {report.metadata.legalPtName} • Periode {report.metadata.reportPeriod}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 no-scrollbar">

          {/* 🌿 PILAR ENVIRONMENTAL (E) */}
          <div className="bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Leaf className="w-4 h-4" /> 1. Environmental Metrics (Lingkungan & Nol Sampah)
              </h4>
              <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                {report.environmental.paperlessAdoptionRatePercent}% Paperless
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-center">
                <span className="text-[10px] text-slate-400 block">Kertas Dihemat</span>
                <span className="font-mono font-black text-xs sm:text-sm text-white">{report.environmental.thermalPaperSheetsSaved} Lembar</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-center">
                <span className="text-[10px] text-slate-400 block">CO2e Dicegah</span>
                <span className="font-mono font-black text-xs sm:text-sm text-emerald-400">{report.environmental.carbonCo2SavedKg} kg</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-center">
                <span className="text-[10px] text-slate-400 block">Gelas BYOC</span>
                <span className="font-mono font-black text-xs sm:text-sm text-amber-400">{report.environmental.byocSingleUseCupsSaved} Gelas</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-center">
                <span className="text-[10px] text-slate-400 block">Surplus Food</span>
                <span className="font-mono font-black text-xs sm:text-sm text-purple-400">{report.environmental.surplusFoodRescuedPortions} Porsi</span>
              </div>
            </div>
          </div>

          {/* 👥 PILAR SOCIAL (S) */}
          <div className="bg-slate-950/90 border border-blue-500/30 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs text-blue-400 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4" /> 2. Social & Workforce Metrics (Sosial & Karyawan)
              </h4>
              <span className="text-[10px] font-mono font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full">
                Kepuasan {report.social.guestSatisfactionScore}/5.0
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5">
                <span className="text-[10px] text-slate-400 block">Total Tip Terdistribusi</span>
                <span className="font-mono font-black text-xs text-blue-300">{formatPrice(report.social.totalEmployeeTipsDistributedRp)}</span>
                <span className="text-[9px] text-slate-500 block mt-0.5">Rata-rata {formatPrice(report.social.averageTipPerStaffRp)} / staf</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5">
                <span className="text-[10px] text-slate-400 block">Allergen Safety Guard</span>
                <span className="font-mono font-black text-xs text-emerald-400">100% Aman (0 Insiden)</span>
                <span className="text-[9px] text-slate-500 block mt-0.5">{report.social.allergenSafeOrdersHandled} pesanan terproteksi</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5">
                <span className="text-[10px] text-slate-400 block">Ulasan Pelanggan</span>
                <span className="font-mono font-black text-xs text-amber-400">★ {report.social.guestSatisfactionScore}</span>
                <span className="text-[9px] text-slate-500 block mt-0.5">dari {report.social.totalFeedbacksCount} review</span>
              </div>
            </div>
          </div>

          {/* 🛡️ PILAR GOVERNANCE (G) */}
          <div className="bg-slate-950/90 border border-purple-500/30 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> 3. Governance & Tax Integrity (Tata Kelola & Pajak)
              </h4>
              <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full">
                {report.governance.auditTrailIntegrityStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Pajak Restoran PB1 10% Tersetor</span>
                  <span className="font-mono font-black text-xs text-purple-300">{formatPrice(report.governance.pb1TaxComplianceRp)}</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Akurasi Rekonsiliasi Kas Shift</span>
                  <span className="font-mono font-black text-xs text-emerald-400">{report.governance.shiftBlindCountAccuracyPercent}% Match</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
            </div>
          </div>

        </div>

        {/* MODAL FOOTER & ACTIONS */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/80">
          <button
            type="button"
            onClick={handleCopySummary}
            className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{copied ? 'Ringkasan Tersalin!' : 'Salin Ringkasan'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="text-xs font-bold text-slate-200 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Laporan</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow flex items-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Selesai</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
