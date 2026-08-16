import React, { useState } from 'react'
import {
  X,
  CreditCard,
  QrCode,
  Banknote,
  Building2,
  Wallet,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Receipt,
  DollarSign
} from 'lucide-react'

export type PaymentTenderType = 'cash' | 'qris' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'e_wallet'

export interface PaymentTender {
  id: string
  type: PaymentTenderType
  amount: number
  referenceNo?: string
  notes?: string
}

export interface MultiTenderPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  totalAmount: number
  onCompletePayment: (tenders: PaymentTender[], changeAmount: number) => void
  orderId?: string
  tableName?: string
}

const TENDER_TYPE_CONFIG: Record<PaymentTenderType, { label: string; icon: React.ReactNode; color: string }> = {
  cash: { label: 'Tunai (Cash)', icon: <Banknote className="w-4 h-4" />, color: 'emerald' },
  qris: { label: 'QRIS Instant', icon: <QrCode className="w-4 h-4" />, color: 'indigo' },
  credit_card: { label: 'Kartu Kredit', icon: <CreditCard className="w-4 h-4" />, color: 'sky' },
  debit_card: { label: 'Kartu Debit', icon: <CreditCard className="w-4 h-4" />, color: 'blue' },
  bank_transfer: { label: 'Transfer Bank', icon: <Building2 className="w-4 h-4" />, color: 'purple' },
  e_wallet: { label: 'E-Wallet (GoPay/OVO)', icon: <Wallet className="w-4 h-4" />, color: 'amber' }
}

export const MultiTenderPaymentModal: React.FC<MultiTenderPaymentModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  onCompletePayment,
  orderId = 'ORD-SPLIT-99',
  tableName = 'Meja 01'
}) => {
  const [tenders, setTenders] = useState<PaymentTender[]>([])
  const [selectedType, setSelectedType] = useState<PaymentTenderType>('cash')
  const [inputAmount, setInputAmount] = useState<string>('')
  const [referenceNo, setReferenceNo] = useState<string>('')

  if (!isOpen) return null

  const formatIdr = (val: number) => `Rp ${Math.round(val).toLocaleString('id-ID')}`

  const totalPaid = tenders.reduce((acc, t) => acc + t.amount, 0)
  const remainingBalance = Math.max(0, totalAmount - totalPaid)
  const isFullyPaid = totalPaid >= totalAmount
  const changeAmount = Math.max(0, totalPaid - totalAmount)

  const handleAddTender = () => {
    const parsedAmount = parseFloat(inputAmount.replace(/[^0-9]/g, '')) || remainingBalance
    if (parsedAmount <= 0) return

    const newTender: PaymentTender = {
      id: `TND-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: selectedType,
      amount: parsedAmount,
      referenceNo: referenceNo.trim() || undefined
    }

    setTenders(prev => [...prev, newTender])
    setInputAmount('')
    setReferenceNo('')
  }

  const handleRemoveTender = (id: string) => {
    setTenders(prev => prev.filter(t => t.id !== id))
  }

  const handleQuickAddRemaining = (type: PaymentTenderType) => {
    if (remainingBalance <= 0) return
    const newTender: PaymentTender = {
      id: `TND-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      amount: remainingBalance
    }
    setTenders(prev => [...prev, newTender])
  }

  const handleSplitFiftyFifty = () => {
    setTenders([])
    const half = Math.round(totalAmount / 2)
    const secondHalf = totalAmount - half

    setTenders([
      { id: `TND-1-${Date.now()}`, type: 'cash', amount: half },
      { id: `TND-2-${Date.now()}`, type: 'qris', amount: secondHalf }
    ])
  }

  const handleFinalSubmit = () => {
    if (!isFullyPaid) return
    onCompletePayment(tenders, changeAmount)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Multi-Tender Split Payment</h2>
              <p className="text-xs text-slate-400">Kombinasi Tunai + QRIS / Card per Tagihan • {tableName} ({orderId})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Bill Summary Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Tagihan (Grand Total):</span>
              <span className="font-mono font-black text-sm text-white">{formatIdr(totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Terbayar:</span>
              <span className="font-mono font-bold text-emerald-400">{formatIdr(totalPaid)}</span>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-300">Sisa Tagihan:</span>
              <span className={`font-mono font-black text-base ${remainingBalance > 0 ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
                {formatIdr(remainingBalance)}
              </span>
            </div>
            {changeAmount > 0 && (
              <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-xs bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                <span className="font-bold text-emerald-300">Kembalian Tunai:</span>
                <span className="font-mono font-extrabold text-sm text-emerald-400">{formatIdr(changeAmount)}</span>
              </div>
            )}
          </div>

          {/* Quick Split Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSplitFiftyFifty}
              className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              ⚡ Split 50/50 (Cash + QRIS)
            </button>
            <button
              type="button"
              onClick={() => handleQuickAddRemaining('cash')}
              disabled={remainingBalance <= 0}
              className="flex-1 py-2 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold disabled:opacity-40 transition-all"
            >
              💵 Lunas sisa dengan Cash
            </button>
          </div>

          {/* Add New Tender Section */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Tambah Pembayaran Tender</h3>

            {/* Tender Type Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(TENDER_TYPE_CONFIG) as PaymentTenderType[]).map(type => {
                const conf = TENDER_TYPE_CONFIG[type]
                const isSelected = selectedType === type
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                      isSelected
                        ? 'bg-indigo-500 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {conf.icon}
                    <span className="truncate">{conf.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Amount Input */}
            <div className="space-y-2 pt-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    value={inputAmount}
                    onChange={(e) => setInputAmount(e.target.value)}
                    placeholder={remainingBalance > 0 ? remainingBalance.toString() : 'Nominal bayar'}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                {selectedType !== 'cash' && (
                  <input
                    type="text"
                    value={referenceNo}
                    onChange={(e) => setReferenceNo(e.target.value)}
                    placeholder="No. Ref / Approval Code"
                    className="w-44 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                  />
                )}
                <button
                  type="button"
                  onClick={handleAddTender}
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-all shadow"
                >
                  <Plus className="w-4 h-4" /> Tambah
                </button>
              </div>

              {/* Amount Quick Presets */}
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {[50000, 100000, 200000, 500000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setInputAmount(preset.toString())}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-[10px] font-mono font-bold whitespace-nowrap"
                  >
                    +{formatIdr(preset)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Added Tenders Breakdown List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rincian Tender Terpasang ({tenders.length})</h3>
            {tenders.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">Belum ada pembayaran ditambahkan.</p>
            ) : (
              <div className="space-y-2">
                {tenders.map((tender) => {
                  const conf = TENDER_TYPE_CONFIG[tender.type]
                  return (
                    <div
                      key={tender.id}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-slate-900 text-indigo-400 border border-slate-800">
                          {conf.icon}
                        </div>
                        <div>
                          <p className="font-bold text-white">{conf.label}</p>
                          {tender.referenceNo && (
                            <p className="text-[10px] font-mono text-slate-400">Ref: {tender.referenceNo}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-emerald-400">{formatIdr(tender.amount)}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTender(tender.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-all"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleFinalSubmit}
            disabled={!isFullyPaid}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4" /> Selesaikan Pembayaran Multi-Tender
          </button>
        </div>
      </div>
    </div>
  )
}
