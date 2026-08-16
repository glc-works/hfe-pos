import React, { useState } from 'react'
import { X, DollarSign, ArrowUpRight, Calculator, Printer, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react'
import { reconcileShift, ReconcileShiftResponse } from '../../services/hfeWorkflowsApi'

interface ShiftDrawerModalProps {
  isOpen: boolean
  onClose: () => void
  openingFloat?: number
  totalCashSales?: number
  bookId?: string
  onReconciled?: (result: ReconcileShiftResponse) => void
}

export const ShiftDrawerModal: React.FC<ShiftDrawerModalProps> = ({
  isOpen,
  onClose,
  openingFloat = 500000,
  totalCashSales = 1250000,
  bookId = 'BOOK-CAFE-HQ-88',
  onReconciled,
}) => {
  const [activeTab, setActiveTab] = useState<'float' | 'cash_out' | 'reconcile'>('reconcile')
  const [currentFloat, setCurrentFloat] = useState<number>(openingFloat)
  const [cashOutAmount, setCashOutAmount] = useState<number | ''>('')
  const [cashOutReason, setCashOutReason] = useState<string>('')
  const [cashOutList, setCashOutList] = useState<Array<{ id: string; amount: number; reason: string; time: string }>>([
    { id: 'CO-01', amount: 50000, reason: 'Beli Galon Aqua Dapur', time: '11:30' },
  ])
  const [physicalCashCount, setPhysicalCashCount] = useState<number | ''>('')
  const [notes, setNotes] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [reconcileResult, setReconcileResult] = useState<ReconcileShiftResponse | null>(null)

  if (!isOpen) return null

  const totalCashOut = cashOutList.reduce((sum, item) => sum + item.amount, 0)
  const expectedCash = currentFloat + totalCashSales - totalCashOut
  const numericPhysicalCount = typeof physicalCashCount === 'number' ? physicalCashCount : 0
  const variance = numericPhysicalCount - expectedCash

  const handleAddCashOut = () => {
    if (!cashOutAmount || cashOutAmount <= 0) return
    const newItem = {
      id: `CO-${Date.now().toString().slice(-4)}`,
      amount: Number(cashOutAmount),
      reason: cashOutReason || 'Pengeluaran Kasir',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    }
    setCashOutList((prev) => [...prev, newItem])
    setCashOutAmount('')
    setCashOutReason('')
  }

  const handleReconcileShift = async () => {
    setIsSubmitting(true)
    try {
      const res = await reconcileShift(
        {
          openingFloat: currentFloat,
          totalCashSales,
          cashOutTotal: totalCashOut,
          physicalCashCount: numericPhysicalCount,
          variance,
          notes,
        },
        bookId
      )
      setReconcileResult(res)
      if (onReconciled) onReconciled(res)
    } catch (err) {
      console.error('Shift reconciliation error:', err)
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
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Shift Cash Drawer & Rekonsiliasi Kas</h3>
            <p className="text-xs text-slate-400">Pengelolaan float awal, cash out, dan hitung selisih fisik kasir</p>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="grid grid-cols-3 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('float')}
            className={`py-1.5 rounded-lg transition-all ${
              activeTab === 'float' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Float Shift
          </button>
          <button
            onClick={() => setActiveTab('cash_out')}
            className={`py-1.5 rounded-lg transition-all ${
              activeTab === 'cash_out' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cash Out ({cashOutList.length})
          </button>
          <button
            onClick={() => setActiveTab('reconcile')}
            className={`py-1.5 rounded-lg transition-all ${
              activeTab === 'reconcile' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Rekonsiliasi
          </button>
        </div>

        {/* TAB 1: FLOAT AWAL */}
        {activeTab === 'float' && (
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Kas Modal Awal Shift (Opening Float)
            </label>
            <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl flex flex-col gap-2">
              <span className="text-xs text-slate-400">Nominal Float Kasir:</span>
              <input
                type="number"
                value={currentFloat}
                onChange={(e) => setCurrentFloat(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-base focus:border-amber-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-500">Standar modal kasir Hfe POS: Rp 500.000 (Pecahan 10k, 20k, 50k)</p>
            </div>
          </div>
        )}

        {/* TAB 2: CASH OUT */}
        {activeTab === 'cash_out' && (
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
              <ArrowUpRight className="w-4 h-4" /> Form Cash Out Kasir (Mid-Shift Expense)
            </label>
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Nominal Rp"
                  value={cashOutAmount}
                  onChange={(e) => setCashOutAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono font-bold focus:border-amber-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Keterangan (cth: beli es batu)"
                  value={cashOutReason}
                  onChange={(e) => setCashOutReason(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <button
                onClick={handleAddCashOut}
                className="w-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs py-1.5 rounded-xl transition-all"
              >
                + Tambah Cash Out
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex flex-col gap-2 max-h-36 overflow-y-auto">
              {cashOutList.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-slate-900 p-2 rounded-xl text-xs">
                  <div>
                    <span className="text-white font-medium">{item.reason}</span>
                    <span className="text-[10px] text-slate-500 block">{item.time}</span>
                  </div>
                  <span className="font-mono font-bold text-rose-400">
                    -Rp {item.amount.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REKONSILIASI PENUTUPAN */}
        {activeTab === 'reconcile' && (
          <div className="flex flex-col gap-3">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Opening Float</span>
                <span className="font-mono font-bold text-slate-200">Rp {currentFloat.toLocaleString('id-ID')}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Penjualan Tunai</span>
                <span className="font-mono font-bold text-emerald-400">+Rp {totalCashSales.toLocaleString('id-ID')}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Total Cash Out</span>
                <span className="font-mono font-bold text-rose-400">-Rp {totalCashOut.toLocaleString('id-ID')}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Total Expekasi Kas</span>
                <span className="font-mono font-bold text-amber-400">Rp {expectedCash.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                <span>Hitung Kas Fisik di Drawer:</span>
                <span className="text-[10px] text-slate-400 font-mono">COUNT PHYSICAL</span>
              </label>
              <input
                type="number"
                placeholder="Masukkan hasil hitung fisik Laci Kas..."
                value={physicalCashCount}
                onChange={(e) => setPhysicalCashCount(e.target.value === '' ? '' : Number(e.target.value))}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-base focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* VARIANCE BADGE */}
            {physicalCashCount !== '' && (
              <div
                className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                  variance === 0
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : variance > 0
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {variance === 0 ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5" />}
                  <div>
                    <span className="font-bold block">
                      Status Kas: {variance === 0 ? 'Balanced (Sesuai)' : variance > 0 ? 'Over (Kelebihan Kas)' : 'Short (Kurang Kas)'}
                    </span>
                    <span className="text-[10px] opacity-80">Selisih Kas vs Sistem</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-sm">
                  {variance >= 0 ? `+Rp ${variance.toLocaleString('id-ID')}` : `-Rp ${Math.abs(variance).toLocaleString('id-ID')}`}
                </span>
              </div>
            )}

            <textarea
              placeholder="Catatan penutupan shift kasir..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 h-16 focus:outline-none focus:border-amber-500"
            />
          </div>
        )}

        {reconcileResult && (
          <div className="bg-emerald-950/50 border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-between text-xs text-emerald-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Rekonsiliasi Shift #{reconcileResult.reconcileId} Berhasil!
            </span>
            <span className="font-mono font-bold uppercase">{reconcileResult.status}</span>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleReconcileShift}
            disabled={isSubmitting}
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
          >
            <Calculator className="w-4 h-4" /> {isSubmitting ? 'Memproses...' : 'Submit Rekonsiliasi Shift'}
          </button>
          <button
            onClick={() => window.print()}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2.5 rounded-xl border border-slate-700"
            title="Cetak Laporan Shift"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
