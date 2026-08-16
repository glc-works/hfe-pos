import React, { useState } from 'react'
import { X, ShieldAlert, KeyRound, RefreshCw, AlertCircle, CheckCircle2, Layers } from 'lucide-react'
import { OrderTicket } from '../../types/pos'
import { refundTransaction, RefundTransactionResponse } from '../../services/hfeWorkflowsApi'

interface ManagerVoidModalProps {
  isOpen: boolean
  onClose: () => void
  order?: OrderTicket | null
  bookId?: string
  onRefundSuccess?: (result: RefundTransactionResponse) => void
}

export const ManagerVoidModal: React.FC<ManagerVoidModalProps> = ({
  isOpen,
  onClose,
  order,
  bookId = 'BOOK-CAFE-HQ-88',
  onRefundSuccess,
}) => {
  const [managerPin, setManagerPin] = useState<string>('')
  const [refundReason, setRefundReason] = useState<string>('Pesanan Salah')
  const [refundType, setRefundType] = useState<'full' | 'partial'>('full')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [restoreBomStock, setRestoreBomStock] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [refundResult, setRefundResult] = useState<RefundTransactionResponse | null>(null)

  if (!isOpen) return null

  const handlePinKeyPress = (digit: string) => {
    if (managerPin.length < 6) {
      setManagerPin((prev) => prev + digit)
    }
  }

  const handlePinClear = () => {
    setManagerPin('')
  }

  const handleToggleItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    )
  }

  const handleSubmitRefund = async () => {
    setError('')
    if (managerPin.length < 4) {
      setError('PIN Manager minimal 4-6 digit angka.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await refundTransaction(
        order?.id || 'ORD-UNKNOWN',
        managerPin,
        refundReason,
        refundType === 'partial',
        bookId
      )
      setRefundResult(res)
      if (onRefundSuccess) onRefundSuccess(res)
    } catch (err) {
      setError('Gagal memproses void/refund. Verifikasi PIN Manager.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 flex flex-col gap-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3 pr-8">
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Manager Otorisasi Void & Refund</h3>
            <p className="text-xs text-slate-400">Pembatalan transaksi & pemulihan stok resep BOM</p>
          </div>
        </div>

        {order && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex justify-between items-center text-xs">
            <div>
              <span className="font-mono text-amber-400 font-bold block">{order.id}</span>
              <span className="text-slate-400">Meja: {order.table} ({order.customerName})</span>
            </div>
            <span className="font-mono font-bold text-white text-sm">
              Rp {order.total?.toLocaleString('id-ID') || '0'}
            </span>
          </div>
        )}

        {/* REFUND TYPE TOGGLE */}
        <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setRefundType('full')}
            className={`py-1.5 rounded-lg transition-all ${
              refundType === 'full' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Full Refund / Void Total
          </button>
          <button
            onClick={() => setRefundType('partial')}
            className={`py-1.5 rounded-lg transition-all ${
              refundType === 'partial' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Partial Refund (Item tertentu)
          </button>
        </div>

        {/* PARTIAL ITEM SELECTOR */}
        {refundType === 'partial' && order && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex flex-col gap-2 max-h-36 overflow-y-auto">
            <span className="text-[11px] font-bold text-slate-400">Pilih Item Yang Di-Refund:</span>
            {order.items?.map((item) => (
              <label
                key={item.id}
                className="flex items-center justify-between text-xs text-slate-300 p-2 bg-slate-900 rounded-xl cursor-pointer hover:bg-slate-850"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleToggleItem(item.id)}
                    className="rounded bg-slate-800 border-slate-700 text-rose-500 focus:ring-0"
                  />
                  <span>{item.name} (x{item.quantity})</span>
                </div>
                <span className="font-mono text-amber-400 font-bold">
                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                </span>
              </label>
            ))}
          </div>
        )}

        {/* REASON SELECTOR */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-300">Alasan Void / Refund:</label>
          <select
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
          >
            <option value="Pesanan Salah">Pesanan Salah / Multi-Input</option>
            <option value="Pelanggan Batal">Pelanggan Batal Transaksi</option>
            <option value="Kualitas Tidak Sesuai">Kualitas Produk / Rasa Tidak Sesuai</option>
            <option value="Lainnya">Lainnya (Catatan Internal)</option>
          </select>
        </div>

        {/* BOM RESTORATION CHECKBOX */}
        <label className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl cursor-pointer text-xs text-emerald-300">
          <input
            type="checkbox"
            checked={restoreBomStock}
            onChange={(e) => setRestoreBomStock(e.target.checked)}
            className="rounded bg-slate-800 border-emerald-500/30 text-emerald-400 focus:ring-0"
          />
          <span className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-400" /> Pulihkan stok bahan resep BOM ke inventori
          </span>
        </label>

        {/* MANAGER PIN KEYPAD */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-amber-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-amber-500" /> Keypad Otorisasi PIN Manager:
            </span>
            <span className="font-mono text-slate-400">
              {managerPin ? '•'.repeat(managerPin.length) : 'Kosong'}
            </span>
          </label>
          <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '←'].map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  if (key === 'C') handlePinClear()
                  else if (key === '←') setManagerPin((prev) => prev.slice(0, -1))
                  else handlePinKeyPress(key)
                }}
                className="bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-white font-mono font-bold text-base py-2.5 rounded-xl border border-slate-800 transition-colors"
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-xl flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400" /> {error}
          </div>
        )}

        {refundResult && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Void #{refundResult.refundId} Berhasil!
            </span>
            <span className="font-mono text-emerald-400 font-bold uppercase">{refundResult.status}</span>
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleSubmitRefund}
          disabled={isSubmitting || managerPin.length < 4}
          className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
        >
          <RefreshCw className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
          {isSubmitting ? 'Memproses Void...' : 'Konfirmasi Otorisasi & Submit Void'}
        </button>
      </div>
    </div>
  )
}
