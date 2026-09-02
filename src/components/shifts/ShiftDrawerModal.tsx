import React, { useState, useMemo } from 'react'
import { X, DollarSign, ArrowUpRight, Calculator, Printer, CheckCircle2, AlertTriangle, ShieldCheck, Lock, Banknote, Coins, FlaskConical } from 'lucide-react'
import { reconcileShift, ReconcileShiftResponse } from '../../services/hfeWorkflowsApi'
import { ShiftClosingBomSummary } from './ShiftClosingBomSummary'

interface ShiftDrawerModalProps {
  isOpen: boolean
  onClose: () => void
  openingFloat?: number
  totalCashSales?: number
  bookId?: string
  operationalMode?: 'solo' | 'team'
  userRole?: 'owner' | 'manager' | 'cashier' | 'barista'
  onReconciled?: (result: ReconcileShiftResponse) => void
}

const DENOMINATIONS = [
  { val: 100000, label: 'Rp 100.000', color: 'text-rose-500' }, { val: 50000, label: 'Rp 50.000', color: 'text-blue-500' },
  { val: 20000, label: 'Rp 20.000', color: 'text-emerald-500' }, { val: 10000, label: 'Rp 10.000', color: 'text-purple-500' },
  { val: 5000, label: 'Rp 5.000', color: 'text-amber-500' }, { val: 2000, label: 'Rp 2.000', color: 'text-slate-500' },
  { val: 1000, label: 'Rp 1.000', color: 'text-cyan-500' },
]

export const ShiftDrawerModal: React.FC<ShiftDrawerModalProps> = ({
  isOpen,
  onClose,
  openingFloat = 500000,
  totalCashSales = 1250000,
  bookId = 'BOOK-CAFE-HQ-88',
  operationalMode = 'solo',
  userRole = 'owner',
  onReconciled,
}) => {
  const [activeTab, setActiveTab] = useState<'float' | 'cash_out' | 'reconcile' | 'bom_margin'>('reconcile')
  const [currentMode, setCurrentMode] = useState<'solo' | 'team'>(
    userRole === 'cashier' || userRole === 'barista' ? 'team' : operationalMode
  )
  const [currentFloat, setCurrentFloat] = useState<number>(openingFloat)
  const [cashOutAmount, setCashOutAmount] = useState<number | ''>('')
  const [cashOutReason, setCashOutReason] = useState<string>('')
  const [cashOutList, setCashOutList] = useState<Array<{ id: string; amount: number; reason: string; time: string }>>([
    { id: 'CO-01', amount: 50000, reason: 'Beli Galon Aqua Dapur', time: '11:30' },
  ])
  
  // Denomination counter state
  const [counts, setCounts] = useState<Record<number, number>>({
    100000: 0, 50000: 0, 20000: 0, 10000: 0, 5000: 0, 2000: 0, 1000: 0
  })
  const [coinTotal, setCoinTotal] = useState<number>(0)
  const [manualOverride, setManualOverride] = useState<boolean>(false)
  const [manualCountInput, setManualCountInput] = useState<number | ''>('')
  
  const [managerPin, setManagerPin] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [reconcileResult, setReconcileResult] = useState<ReconcileShiftResponse | null>(null)
  const [teamSubmitPending, setTeamSubmitPending] = useState<boolean>(false)

  const isSoloMode = currentMode === 'solo'

  const calculatedDenomTotal = useMemo(() => {
    const paperSum = Object.entries(counts).reduce((sum, [val, qty]) => sum + (Number(val) * qty), 0)
    return paperSum + (coinTotal || 0)
  }, [counts, coinTotal])

  if (!isOpen) return null

  const totalCashOut = cashOutList.reduce((sum, item) => sum + item.amount, 0)
  const expectedCash = currentFloat + totalCashSales - totalCashOut
  const numericPhysicalCount = manualOverride
    ? (typeof manualCountInput === 'number' ? manualCountInput : 0)
    : calculatedDenomTotal
  const variance = numericPhysicalCount - expectedCash
  const isHighVariance = Math.abs(variance) > 50000
  const isManagerPinValid = managerPin === '123456' || managerPin.length === 6

  const handleUpdateCount = (val: number, delta: number) => {
    setCounts(prev => ({
      ...prev,
      [val]: Math.max(0, (prev[val] || 0) + delta)
    }))
  }

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
    if (!isSoloMode && isHighVariance && !isManagerPinValid) {
      alert('⚠️ Selisih kas melebihi Rp 50.000. Wajib memasukkan 6-digit PIN Otorisasi Manajer.')
      return
    }
    setIsSubmitting(true)
    try {
      const res = await reconcileShift(
        {
          openingFloat: currentFloat,
          totalCashSales,
          cashOutTotal: totalCashOut,
          physicalCashCount: numericPhysicalCount,
          variance,
          notes: `${notes} ${isSoloMode ? '[Solo Operator Auto-Settled]' : isHighVariance ? `[SPV Approved: ${managerPin}]` : '[Team Shift Submission]'}`.trim(),
        },
        bookId
      )
      setReconcileResult(res)
      if (!isSoloMode) {
        setTeamSubmitPending(true)
      }
      if (onReconciled) onReconciled(res)
    } catch (err) {
      console.error('Shift reconciliation error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card text-foreground border border-border rounded-3xl max-w-xl w-full p-5 sm:p-6 flex flex-col gap-4 shadow-2xl relative max-h-[92vh] overflow-y-auto custom-scrollbar">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-lg bg-muted/60 hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-between border-b border-border pb-3 pr-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-500">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Shift Cash Drawer & Rekonsiliasi Kas</h3>
              <p className="text-xs text-muted-foreground">Hitung denominasi fisik laci, otorisasi selisih & posting jurnal CORE</p>
            </div>
          </div>

          {/* Operational Scale Mode Pill */}
          {/* Operational Scale Mode Pill */}
          <div className="hidden sm:flex bg-muted/80 p-0.5 rounded-xl border border-border text-[11px] font-bold">
            <button type="button" onClick={() => setCurrentMode('solo')} className={`px-2 py-1 rounded-lg transition-all ${isSoloMode ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'text-muted-foreground hover:text-foreground'}`} title="Mode 1 Orang: Langsung Selesai & Posting Jurnal Instan">👤 Solo</button>
            <button type="button" onClick={() => setCurrentMode('team')} className={`px-2 py-1 rounded-lg transition-all ${!isSoloMode ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'text-muted-foreground hover:text-foreground'}`} title="Mode Tim: Kasir Submit & SPV Review di Backoffice">👥 Tim</button>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="grid grid-cols-4 bg-muted p-1 rounded-xl border border-border text-[11px] font-semibold">
          <button type="button" onClick={() => setActiveTab('float')} className={`py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === 'float' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Float</button>
          <button type="button" onClick={() => setActiveTab('cash_out')} className={`py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === 'cash_out' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Kas Kecil ({cashOutList.length})</button>
          <button type="button" onClick={() => setActiveTab('reconcile')} className={`py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === 'reconcile' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Z-Report</button>
          <button type="button" onClick={() => setActiveTab('bom_margin')} className={`py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === 'bom_margin' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}><FlaskConical className="w-3 h-3" /> BoM &amp; Margin</button>
        </div>

        {/* TAB 1: FLOAT AWAL */}
        {activeTab === 'float' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-mono text-[10px] font-bold">
                FORM-OPS-01
              </span>
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-500" /> Modal Awal Shift (Opening Float)
              </label>
            </div>
            <div className="bg-background border border-border p-3.5 rounded-2xl flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">Nominal Float Kasir:</span>
              <input
                type="number"
                min={0}
                step={50000}
                value={currentFloat}
                onChange={(e) => setCurrentFloat(Number(e.target.value))}
                className="bg-muted border border-border rounded-xl px-3 py-2 text-sm font-mono font-bold text-foreground focus:border-amber-500 focus:outline-none"
              />
              <span className="text-[10px] text-muted-foreground">Saldo kas fisik di laci saat kasir memulai shift kerja.</span>
            </div>
          </div>
        )}

        {/* TAB 2: CASH OUT / KAS KECIL */}
        {activeTab === 'cash_out' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20 font-mono text-[10px] font-bold">
                FORM-OPS-02
              </span>
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4 text-rose-500" /> Pengeluaran Kas Kecil (Paid-Out)
              </label>
            </div>
            <div className="bg-background border border-border p-3 rounded-2xl flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Nominal Rp"
                  value={cashOutAmount}
                  onChange={(e) => setCashOutAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="bg-muted border border-border rounded-xl px-3 py-1.5 text-xs text-foreground font-mono font-bold focus:border-amber-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Keterangan (cth: beli es batu)"
                  value={cashOutReason}
                  onChange={(e) => setCashOutReason(e.target.value)}
                  className="bg-muted border border-border rounded-xl px-3 py-1.5 text-xs text-foreground focus:border-amber-500 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleAddCashOut}
                className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 font-bold text-xs py-2 rounded-xl transition-all cursor-pointer"
              >
                + Tambah Pengeluaran Kas
              </button>
            </div>

            <div className="bg-background border border-border rounded-2xl p-3 flex flex-col gap-2 max-h-36 overflow-y-auto custom-scrollbar">
              {cashOutList.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-muted/60 p-2 rounded-xl text-xs">
                  <div>
                    <span className="text-foreground font-medium">{item.reason}</span>
                    <span className="text-[10px] text-muted-foreground block">{item.time}</span>
                  </div>
                  <span className="font-mono font-bold text-rose-500">-Rp {item.amount.toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REKONSILIASI PENUTUPAN */}
        {activeTab === 'reconcile' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-mono text-[10px] font-bold">
                FORM-OPS-03
              </span>
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-amber-500" /> Rekonsiliasi Kasir &amp; Z-Report Penutupan
              </label>
            </div>
            {/* Shift Summary Box */}
            <div className="bg-background border border-border rounded-2xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px]">Opening Float</span>
                <span className="font-mono font-bold text-foreground">Rp {currentFloat.toLocaleString('id-ID')}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Penjualan Tunai</span>
                <span className="font-mono font-bold text-emerald-500">+Rp {totalCashSales.toLocaleString('id-ID')}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Total Cash Out</span>
                <span className="font-mono font-bold text-rose-500">-Rp {totalCashOut.toLocaleString('id-ID')}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Ekspektasi Kas Laci</span>
                <span className="font-mono font-bold text-amber-500">Rp {expectedCash.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* DENOMINATION COUNTER GRID */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Banknote className="w-4 h-4 text-amber-500" /> Hitung Lembaran Pecahan Uang Fisik:
                </label>
                <button
                  type="button"
                  onClick={() => setManualOverride(!manualOverride)}
                  className="text-[10px] font-bold text-amber-500 hover:underline cursor-pointer"
                >
                  {manualOverride ? 'Gunakan Hitung Pecahan' : 'Input Total Langsung'}
                </button>
              </div>

              {!manualOverride ? (
                <div className="bg-background border border-border rounded-2xl p-2.5 flex flex-col gap-1.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                    {DENOMINATIONS.map((d) => {
                      const qty = counts[d.val] || 0
                      const sub = d.val * qty
                      return (
                        <div key={d.val} className="flex items-center justify-between p-1.5 bg-muted/40 rounded-xl border border-border/80 text-xs">
                          <span className={`font-mono font-bold text-[11px] ${d.color}`}>{d.label}</span>
                          <div className="flex items-center gap-1">
                            <button type="button" onClick={() => handleUpdateCount(d.val, -1)} className="w-6 h-6 rounded-lg bg-background border border-border text-foreground hover:bg-muted flex items-center justify-center font-bold">-</button>
                            <input type="number" min={0} value={qty || ''} placeholder="0" onChange={(e) => setCounts(prev => ({ ...prev, [d.val]: Math.max(0, Number(e.target.value)) }))} className="w-10 text-center font-mono font-bold text-xs bg-background border border-border rounded-lg py-0.5" />
                            <button type="button" onClick={() => handleUpdateCount(d.val, 1)} className="w-6 h-6 rounded-lg bg-background border border-border text-foreground hover:bg-muted flex items-center justify-center font-bold">+</button>
                            <button type="button" onClick={() => handleUpdateCount(d.val, 5)} className="text-[9px] px-1 py-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold">+5</button>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-border text-xs">
                    <div className="flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-[11px] text-muted-foreground">Koin/Receh:</span>
                      <input
                        type="number"
                        min={0}
                        value={coinTotal || ''}
                        placeholder="Rp 0"
                        onChange={(e) => setCoinTotal(Number(e.target.value) || 0)}
                        className="w-24 px-2 py-0.5 text-xs font-mono font-bold bg-background border border-border rounded-lg"
                      />
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground block">Total Hitung Fisik:</span>
                      <span className="font-mono font-black text-sm text-foreground">Rp {calculatedDenomTotal.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <input
                  type="number"
                  placeholder="Masukkan total hitung fisik kasir..."
                  value={manualCountInput}
                  onChange={(e) => setManualCountInput(e.target.value === '' ? '' : Number(e.target.value))}
                  className="bg-background border border-border rounded-xl px-3 py-2 text-foreground font-mono font-bold text-base focus:border-amber-500 focus:outline-none"
                />
              )}
            </div>

            {/* VARIANCE BADGE */}
            {numericPhysicalCount > 0 && (
              <div
                className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                  variance === 0
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : variance > 0
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  {variance === 0 ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertTriangle className="w-5 h-5" />}
                  <div>
                    <span className="font-bold block">
                      Status: {variance === 0 ? 'Balanced (Sesuai)' : variance > 0 ? 'Cash Overage (Lebih Setor)' : 'Cash Shortage (Kurang Setor)'}
                    </span>
                    <span className="text-[10px] opacity-80">Selisih Fisik vs Ekspektasi Sistem</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-sm">
                  {variance >= 0 ? `+Rp ${variance.toLocaleString('id-ID')}` : `-Rp ${Math.abs(variance).toLocaleString('id-ID')}`}
                </span>
              </div>
            )}

            {/* MANAGER OVERRIDE PIN GATE IF HIGH VARIANCE */}
            {isHighVariance && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <Lock className="w-4 h-4" />
                  <span>[FORM-FIN-01] Wajib Otorisasi PIN Manajer (Selisih &gt; Rp 50.000)</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="PIN Manajer (6-digit)"
                    value={managerPin}
                    onChange={(e) => setManagerPin(e.target.value)}
                    className="bg-background border border-border rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-foreground focus:border-amber-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Alasan selisih kas..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-background border border-border rounded-xl px-3 py-1.5 text-xs text-foreground focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Selisih Kembalian', 'Uang Rusak / Lusuh', 'Salah Hitung Kasir', 'Pembulatan Kasir'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setNotes(tag)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer active:scale-95 ${
                        notes === tag ? 'bg-amber-500 text-slate-950 border-amber-500 font-extrabold' : 'bg-background border-border text-muted-foreground hover:border-amber-500'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Realtime BoM Preview Quick Link */}
            <button
              type="button"
              onClick={() => setActiveTab('bom_margin')}
              className="p-2 bg-muted/40 hover:bg-muted/70 border border-border/80 rounded-2xl flex items-center justify-between text-xs transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <span className="font-bold text-[11px] text-foreground block">🧪 Cek Estimasi HPP BoM &amp; Margin Laba</span>
                  <span className="text-[10px] text-muted-foreground">Hitung konsumsi bahan baku teoritis &amp; komisi ojol 20%</span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-amber-500 shrink-0">Buka ➔</span>
            </button>
          </div>
        )}

        {/* TAB 4: BOM & MARGIN SUMMARY */}
        {activeTab === 'bom_margin' && (
          <ShiftClosingBomSummary
            cashVariance={numericPhysicalCount > 0 ? variance : 0}
            totalGrossSales={totalCashSales + 398000}
            cashSales={totalCashSales}
          />
        )}

        {reconcileResult && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {isSoloMode
                ? `Rekonsiliasi Shift #${reconcileResult.reconcileId} Berhasil Ditutup & Jurnal Terbit!`
                : `Laporan Shift #${reconcileResult.reconcileId} Terkirim ke Antrean Review SPV!`}
            </span>
            <span className="font-mono font-bold uppercase">{reconcileResult.status}</span>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={handleReconcileShift}
            disabled={isSubmitting || (!isSoloMode && isHighVariance && !isManagerPinValid)}
            className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            {isSubmitting
              ? 'Memproses...'
              : isSoloMode
              ? 'Tutup Shift & Posting Jurnal (Solo)'
              : 'Submit Laporan ke SPV (Review)'}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-muted hover:bg-muted/80 text-foreground p-2.5 rounded-xl border border-border cursor-pointer"
            title={isSoloMode ? 'Cetak Struk Z-Report Thermal' : 'Cetak Slip Amplop Setoran Kasir'}
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
