import React, { useState, useMemo } from 'react'
import { Card, Button, Badge, TextInput } from '@/ui'
import { 
  Landmark, CheckCircle2, AlertCircle, ArrowRight, Search, 
  Sparkles, RefreshCw, Download, Filter, HelpCircle, X, ShieldCheck
} from 'lucide-react'
import { BankStatementLine, ReconciliationCandidate } from '../../types/pos'

export interface FindAndMatchReconciliationModalProps {
  isOpen: boolean
  onClose: () => void
  onReconcileSuccess?: (reconciledCount: number) => void
}

const INITIAL_STATEMENT_LINES: BankStatementLine[] = [
  {
    id: 'STMT-BCA-001',
    date: '2026-08-25 14:32',
    description: 'QRIS SETTLEMENT - BCA MERCHANT',
    amount: 57500,
    type: 'credit',
    sourceBank: 'BCA QRIS',
    status: 'unmatched',
    suggestedTransactionId: 'ORD-8801',
    confidenceScore: 100,
    notes: 'Nominal & timestamp 100% cocok dengan ORD-8801'
  },
  {
    id: 'STMT-BCA-002',
    date: '2026-08-25 15:10',
    description: 'QRIS SETTLEMENT - BCA MERCHANT',
    amount: 119160, // 120.000 - 0.7% MDR (840)
    type: 'credit',
    sourceBank: 'BCA QRIS',
    status: 'unmatched',
    suggestedTransactionId: 'ORD-8802',
    confidenceScore: 98,
    notes: 'Selisih Rp 840 terdeteksi sebagai potongan MDR 0.7%'
  },
  {
    id: 'STMT-TRF-003',
    date: '2026-08-25 16:45',
    description: 'TRANSFER E-BANKING CR - BPK ALEXANDER',
    amount: 2500000,
    type: 'credit',
    sourceBank: 'BCA Transfer',
    status: 'unmatched',
    suggestedTransactionId: 'ORD-VIP-01',
    confidenceScore: 95,
    notes: 'Deposit VIP Room Reservation'
  },
  {
    id: 'STMT-BCA-004',
    date: '2026-08-24 18:20',
    description: 'QRIS SETTLEMENT - BCA MERCHANT',
    amount: 86000,
    type: 'credit',
    sourceBank: 'BCA QRIS',
    status: 'reconciled',
    matchedTransactionId: 'ORD-8799',
    confidenceScore: 100
  }
]

const INITIAL_POS_CANDIDATES: ReconciliationCandidate[] = [
  {
    id: 'CAND-01',
    documentRef: 'ORD-8801',
    date: '2026-08-25 14:30',
    amount: 57500,
    tenderType: 'QRIS BCA',
    customerName: 'Aldi (QR)',
    tableName: 'OUT-04',
    glJournalId: 'GL-JRN-9921',
    status: 'unmatched'
  },
  {
    id: 'CAND-02',
    documentRef: 'ORD-8802',
    date: '2026-08-25 15:08',
    amount: 120000,
    tenderType: 'QRIS BCA',
    customerName: 'Chef Mike',
    tableName: 'IND-02',
    glJournalId: 'GL-JRN-9922',
    status: 'unmatched'
  },
  {
    id: 'CAND-03',
    documentRef: 'ORD-VIP-01',
    date: '2026-08-25 16:40',
    amount: 2500000,
    tenderType: 'Bank Transfer',
    customerName: 'Alexander',
    tableName: 'VIP-01',
    glJournalId: 'GL-JRN-9925',
    status: 'unmatched'
  },
  {
    id: 'CAND-04',
    documentRef: 'ORD-8805',
    date: '2026-08-25 17:15',
    amount: 72000,
    tenderType: 'QRIS Mandiri',
    customerName: 'Siti Barista',
    tableName: 'Takeaway',
    glJournalId: 'GL-JRN-9928',
    status: 'unmatched'
  }
]

export const FindAndMatchReconciliationModal: React.FC<FindAndMatchReconciliationModalProps> = ({
  isOpen,
  onClose,
  onReconcileSuccess
}) => {
  const [statements, setStatements] = useState<BankStatementLine[]>(INITIAL_STATEMENT_LINES)
  const [candidates, setCandidates] = useState<ReconciliationCandidate[]>(INITIAL_POS_CANDIDATES)
  const [selectedStatementId, setSelectedStatementId] = useState<string>(INITIAL_STATEMENT_LINES[0]?.id || '')
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>(['CAND-01'])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMode, setFilterMode] = useState<'all' | 'unmatched' | 'suggested'>('unmatched')
  const [autoMdrAdjustment, setAutoMdrAdjustment] = useState<boolean>(true)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const activeStatement = useMemo(() => {
    return statements.find(s => s.id === selectedStatementId) || statements[0]
  }, [statements, selectedStatementId])

  const filteredStatements = useMemo(() => {
    return statements.filter(s => {
      if (filterMode === 'unmatched' && s.status !== 'unmatched') return false
      if (filterMode === 'suggested' && (!s.confidenceScore || s.confidenceScore < 90 || s.status !== 'unmatched')) return false
      return true
    })
  }, [statements, filterMode])

  const totalCandidateSelectedAmount = useMemo(() => {
    return candidates
      .filter(c => selectedCandidateIds.includes(c.id))
      .reduce((sum, c) => sum + c.amount, 0)
  }, [candidates, selectedCandidateIds])

  const differenceAmount = activeStatement ? activeStatement.amount - totalCandidateSelectedAmount : 0
  const isExactMatch = activeStatement && activeStatement.amount === totalCandidateSelectedAmount
  const isMdrLikelyMatch = activeStatement && Math.abs(differenceAmount) > 0 && Math.abs(differenceAmount) <= Math.round(totalCandidateSelectedAmount * 0.015)

  const handleSelectStatement = (stmt: BankStatementLine) => {
    setSelectedStatementId(stmt.id)
    if (stmt.suggestedTransactionId) {
      const match = candidates.find(c => c.documentRef === stmt.suggestedTransactionId)
      if (match) setSelectedCandidateIds([match.id])
      else setSelectedCandidateIds([])
    } else {
      setSelectedCandidateIds([])
    }
  }

  const toggleCandidate = (id: string) => {
    setSelectedCandidateIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleMatchAndReconcile = () => {
    if (!activeStatement || selectedCandidateIds.length === 0) return

    setStatements(prev => prev.map(s => {
      if (s.id === activeStatement.id) {
        return { ...s, status: 'reconciled', matchedTransactionId: selectedCandidateIds.join(',') }
      }
      return s
    }))

    setCandidates(prev => prev.map(c => {
      if (selectedCandidateIds.includes(c.id)) {
        return { ...c, status: 'matched' }
      }
      return c
    }))

    const msg = `🧪 Rekonsiliasi Lokal: [${activeStatement.sourceBank}] Rp ${activeStatement.amount.toLocaleString('id-ID')} dicocokkan di memori browser (Draft).`
    setToastMessage(msg)
    if (onReconcileSuccess) onReconcileSuccess(1)

    // Select next unmatched statement
    const nextUnmatched = statements.find(s => s.id !== activeStatement.id && s.status === 'unmatched')
    if (nextUnmatched) {
      handleSelectStatement(nextUnmatched)
    }
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleAutoMatchBatch = () => {
    let count = 0
    statements.forEach(s => {
      if (s.status === 'unmatched' && s.confidenceScore && s.confidenceScore >= 95 && s.suggestedTransactionId) {
        count++
      }
    })

    setStatements(prev => prev.map(s => {
      if (s.status === 'unmatched' && s.confidenceScore && s.confidenceScore >= 95) {
        return { ...s, status: 'reconciled', matchedTransactionId: s.suggestedTransactionId }
      }
      return s
    }))

    setToastMessage(`🧪 Auto-Match Simulasi: ${count} transaksi dicocokkan di memori browser (Draft).`)
    if (onReconcileSuccess) onReconcileSuccess(count)
    setTimeout(() => setToastMessage(null), 3500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-6xl h-[92vh] max-h-[840px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-slate-100 font-sans">
        
        {/* TOP COMMAND HEADER */}
        <header className="px-5 py-3.5 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-slate-900 dark:text-white tracking-wide">Rekonsiliasi Bank & QRIS</h3>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-mono">
                  🧪 Simulasi Lokal (Demo Data)
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pencocokan 2 arah: Rekening Koran ⇄ Transaksi Kasir POS (Memori Browser).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAutoMatchBatch}
              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-bold flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-Match (95%+)</span>
            </Button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* TOAST ALERT */}
        {toastMessage && (
          <div className="px-4 py-2 bg-emerald-500/20 border-b border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 shrink-0 animate-slideDown">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* SPLIT SCREEN BODY */}
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
          
          {/* LEFT PANE: BANK STATEMENT FEED (5 Cols) */}
          <div className="md:col-span-5 flex flex-col h-full min-h-0 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0 bg-slate-100/80 dark:bg-slate-900/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Landmark className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Mutasi Bank Masuk</span>
                <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono">
                  {filteredStatements.length}
                </span>
              </div>
              <div className="flex gap-1">
                {(['unmatched', 'suggested', 'all'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setFilterMode(mode)}
                    className={`px-2 py-0.5 text-[10px] rounded-lg font-bold transition-all ${
                      filterMode === mode 
                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/40' 
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {mode === 'unmatched' ? 'Belum Cocok' : mode === 'suggested' ? 'Saran AI' : 'Semua'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-2.5 space-y-2 custom-scrollbar">
              {filteredStatements.map(stmt => {
                const isSelected = stmt.id === activeStatement?.id
                return (
                  <div
                    key={stmt.id}
                    onClick={() => handleSelectStatement(stmt)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer select-none text-left ${
                      isSelected 
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 shadow-md ring-1 ring-emerald-500/30' 
                        : stmt.status === 'reconciled'
                          ? 'bg-slate-100/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/40 opacity-60'
                          : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold">{stmt.date}</span>
                      {stmt.status === 'reconciled' ? (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[9px]">
                          ✓ Cocok
                        </Badge>
                      ) : stmt.confidenceScore && stmt.confidenceScore >= 95 ? (
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[9px] flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> {stmt.confidenceScore}% Cocok
                        </Badge>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{stmt.description}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{stmt.sourceBank}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400 tabular-nums">
                          +Rp {stmt.amount.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    {stmt.notes && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 pt-1.5 border-t border-slate-200 dark:border-slate-800/60 italic">
                        💡 {stmt.notes}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* RIGHT PANE: POS TRANSACTIONS & MATCH EXPLORER (7 Cols) */}
          <div className="md:col-span-7 flex flex-col h-full min-h-0 bg-white dark:bg-slate-900/30">
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Search className="w-3.5 h-3.5 text-amber-500" />
                <span>Cari Transaksi Kasir & Jurnal GL</span>
              </div>
              <div className="w-48">
                <TextInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ketik No. Order / Meja..."
                  className="text-xs h-7 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {/* CANDIDATE TRANSACTION CARDS */}
            <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              {candidates
                .filter(c => !searchQuery || c.documentRef.toLowerCase().includes(searchQuery.toLowerCase()) || (c.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()))
                .map(cand => {
                  const isChecked = selectedCandidateIds.includes(cand.id)
                  return (
                    <div
                      key={cand.id}
                      onClick={() => toggleCandidate(cand.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isChecked
                          ? 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-500 shadow-md ring-1 ring-amber-500/30'
                          : cand.status === 'matched'
                            ? 'bg-slate-100/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/40 opacity-50'
                            : 'bg-slate-50 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">{cand.documentRef}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">({cand.date})</span>
                            <Badge variant="outline" className="text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700">
                              {cand.tenderType}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {cand.tableName ? `Meja: ${cand.tableName} • ` : ''}{cand.customerName || 'Tamu Anonim'} • GL: <span className="font-mono text-slate-700 dark:text-slate-300">{cand.glJournalId}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-sm text-slate-900 dark:text-white tabular-nums">
                          Rp {cand.amount.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  )
                })}
            </div>

            {/* SPLIT MATCH COMPARISON DOCK */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center p-2.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5">Mutasi Bank</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    Rp {activeStatement ? activeStatement.amount.toLocaleString('id-ID') : 0}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5">Total POS Dipilih</span>
                  <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                    Rp {totalCandidateSelectedAmount.toLocaleString('id-ID')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5">Selisih (Difference)</span>
                  <span className={`font-bold tabular-nums ${isExactMatch ? 'text-emerald-600 dark:text-emerald-400' : isMdrLikelyMatch ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {differenceAmount >= 0 ? '+' : ''}Rp {differenceAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {isMdrLikelyMatch && (
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-800 dark:text-amber-300 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Selisih Rp {Math.abs(differenceAmount).toLocaleString('id-ID')} akan otomatis diposting sebagai <strong>Beban MDR QRIS (GL 5101)</strong></span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoMdrAdjustment}
                    onChange={(e) => setAutoMdrAdjustment(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 cursor-pointer"
                  />
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {selectedCandidateIds.length} transaksi terpilih
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onClose}
                    className="text-xs"
                  >
                    Tutup
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleMatchAndReconcile}
                    disabled={!activeStatement || selectedCandidateIds.length === 0}
                    className={`font-bold text-xs flex items-center gap-1.5 ${
                      isExactMatch || isMdrLikelyMatch 
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                        : 'bg-amber-600 hover:bg-amber-500 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isExactMatch ? 'Cocokkan Transaksi (Match)' : 'Cocokkan & Rekonsiliasi'}</span>
                  </Button>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
export default FindAndMatchReconciliationModal
