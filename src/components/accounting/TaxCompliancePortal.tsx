import React, { useState } from 'react'
import {
  FileCheck2,
  Receipt,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  CreditCard,
  Building,
  ArrowDownToLine
} from 'lucide-react'
import { TaxObligation } from '../../types/accounting'
import { PriceTag } from '../../ui/PriceTag'

export interface TaxCompliancePortalProps {
  obligations: TaxObligation[]
  onGenerateBilling?: (taxId: string) => void
}

export const TaxCompliancePortal: React.FC<TaxCompliancePortalProps> = ({
  obligations,
  onGenerateBilling
}) => {
  const [selectedTax, setSelectedTax] = useState<TaxObligation | null>(obligations[0] || null)

  const totalTaxAmount = obligations.reduce((sum, o) => sum + o.taxAmount, 0)
  const settledCount = obligations.filter((o) => o.status === 'settled').length

  return (
    <div className="flex flex-col gap-5">
      {/* Top Tax Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Total Kewajiban Pajak</span>
            <Receipt className="w-4 h-4 text-amber-400" />
          </div>
          <PriceTag amount={totalTaxAmount} size="lg" variant="accent" />
          <p className="text-[10px] text-slate-400 mt-1 font-mono">Periode Masa Agustus 2026</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Status Kepatuhan SPT</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-black text-white">
            {settledCount} dari {obligations.length} Lunas
          </div>
          <p className="text-[10px] text-emerald-400 mt-1 font-mono">100% On-Time SPT Filing</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Tarif Pajak Resto PB1</span>
            <Building className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-lg font-black text-sky-400 font-mono">
            10.0% (Bapenda DKI)
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">Terintegrasi SPTPD Online</p>
        </div>
      </div>

      {/* Main Tax Cards & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Tax Obligations Cards List (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-amber-400" /> Daftar Kewajiban Pajak Daerah &amp; Nasional
          </h4>

          {obligations.map((item) => {
            const isSelected = selectedTax?.id === item.id

            return (
              <div
                key={item.id}
                onClick={() => setSelectedTax(item)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/60 ring-2 ring-amber-500/20 shadow-md'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white">{item.taxName}</span>
                      <span className="text-[10px] font-mono font-bold bg-slate-800 text-amber-300 border border-slate-700 px-2 py-0.5 rounded-md">
                        {item.taxType}
                      </span>
                      {item.status === 'settled' && (
                        <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Disetor (Lunas)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400 mt-1 font-mono">
                      <span>DPP: Rp {item.taxableBase.toLocaleString('id-ID')}</span>
                      <span>Tarif: {item.ratePercent}%</span>
                      <span>Jatuh Tempo: {item.dueDate}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <span className="text-[10px] text-slate-400">Nilai Pajak</span>
                    <PriceTag amount={item.taxAmount} size="md" variant={item.status === 'settled' ? 'emerald' : 'accent'} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tax Settlement & e-Billing Slip Panel (1 col) */}
        {selectedTax && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Slip e-Billing Pajak</h4>
                  <span className="text-xs font-mono font-bold text-white">{selectedTax.id}</span>
                </div>
                <div className="p-2 bg-slate-800 text-amber-400 rounded-xl">
                  <QrCode className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-2.5 text-xs font-mono bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Jenis Pajak:</span>
                  <span className="text-slate-200 font-bold">{selectedTax.taxName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Masa Pajak:</span>
                  <span className="text-slate-200">{selectedTax.period}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Dasar Pengenaan (DPP):</span>
                  <span className="text-slate-200">Rp {selectedTax.taxableBase.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Kode Billing:</span>
                  <span className="text-amber-400 font-bold">{selectedTax.billingCode || '990182736451'}</span>
                </div>
                {selectedTax.ntpnCode && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Nomor NTPN:</span>
                    <span className="text-emerald-400 font-bold">{selectedTax.ntpnCode}</span>
                  </div>
                )}
                {selectedTax.sptpdNumber && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">No. SPTPD:</span>
                    <span className="text-sky-400">{selectedTax.sptpdNumber}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center font-bold">
                  <span className="text-slate-400 font-sans">Total Setoran:</span>
                  <PriceTag amount={selectedTax.taxAmount} size="sm" variant="accent" />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onGenerateBilling?.(selectedTax.id)}
              className="mt-4 w-full py-2.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <CreditCard className="w-4 h-4" />
              <span>Bayar via SNAP BI / Bank Transfer</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
