import React, { useState } from 'react'
import { X, Building2, FileText, CheckCircle2, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react'
import { PriceTag } from '../../ui/PriceTag'

export interface CorporateAccount {
  id: string
  companyName: string
  npwp: string
  creditLimit: number
  outstandingBalance: number
  paymentTermDays: number
  contactPerson: string
}

export interface CorporateInvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  totalAmount: number
  onConfirmCorporateCharge?: (invoiceData: { corporateId: string; poNumber: string; approverName: string }) => void
}

const REGISTERED_CORPORATES: CorporateAccount[] = [
  {
    id: 'CORP-001',
    companyName: 'PT Astra International Tbk',
    npwp: '01.234.567.8-012.000',
    creditLimit: 25000000,
    outstandingBalance: 4200000,
    paymentTermDays: 30,
    contactPerson: 'Bambang Sudiro'
  },
  {
    id: 'CORP-002',
    companyName: 'PT Telkom Indonesia',
    npwp: '02.345.678.9-023.000',
    creditLimit: 15000000,
    outstandingBalance: 1250000,
    paymentTermDays: 30,
    contactPerson: 'Siti Nurhaliza'
  }
]

export const CorporateInvoiceModal: React.FC<CorporateInvoiceModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  onConfirmCorporateCharge
}) => {
  const [selectedCorpId, setSelectedCorpId] = useState(REGISTERED_CORPORATES[0].id)
  const [poNumber, setPoNumber] = useState('PO-202608-099')
  const [approverName, setApproverName] = useState('Bambang Sudiro')
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen) return null

  const selectedCorp = REGISTERED_CORPORATES.find(c => c.id === selectedCorpId) || REGISTERED_CORPORATES[0]
  const availableCredit = selectedCorp.creditLimit - selectedCorp.outstandingBalance

  const handleChargeCorporate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSuccess(true)
    if (onConfirmCorporateCharge) {
      onConfirmCorporateCharge({
        corporateId: selectedCorp.id,
        poNumber,
        approverName
      })
    }
    setTimeout(() => {
      setIsSuccess(false)
      onClose()
    }, 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-slate-950 border border-indigo-500/30 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 animate-scaleUp text-slate-100">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">🏢 Tagihan Korporat (B2B Invoicing)</h4>
              <span className="text-[10px] font-mono text-indigo-400">Term of Payment 30 Hari • Piutang AR</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-5 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 flex flex-col items-center gap-2 text-center animate-fadeIn py-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            <span className="text-sm font-bold text-white">Faktur B2B Berhasil Diterbitkan!</span>
            <p className="text-xs text-emerald-300 font-mono">
              Tagihan Rp {totalAmount.toLocaleString('id-ID')} masuk ke subledger Piutang {selectedCorp.companyName}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleChargeCorporate} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-300 font-medium">Pilih Akun Perusahaan Terdaftar:</label>
              <select
                value={selectedCorpId}
                onChange={(e) => setSelectedCorpId(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                {REGISTERED_CORPORATES.map(c => (
                  <option key={c.id} value={c.id}>{c.companyName} (Sisa Limit: Rp {(c.creditLimit - c.outstandingBalance).toLocaleString('id-ID')})</option>
                ))}
              </select>
            </div>

            <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800 flex flex-col gap-2 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>NPWP:</span>
                <span className="text-white">{selectedCorp.npwp}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Term of Payment:</span>
                <span className="text-indigo-300 font-bold">{selectedCorp.paymentTermDays} Hari (Net 30)</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 pt-1 border-t border-slate-800">
                <span>Total Tagihan Hari Ini:</span>
                <PriceTag amount={totalAmount} variant="accent" size="sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-300 font-medium">Nomor PO / Referensi:</label>
                <input
                  type="text"
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  placeholder="PO-2026-001"
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-300 font-medium">Nama Pejabat PIC:</label>
                <input
                  type="text"
                  value={approverName}
                  onChange={(e) => setApproverName(e.target.value)}
                  placeholder="Nama Penandatangan"
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all active:scale-95 cursor-pointer mt-1"
            >
              <Sparkles className="w-4 h-4" />
              <span>Terbitkan Faktur B2B & Catat Piutang AR</span>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
