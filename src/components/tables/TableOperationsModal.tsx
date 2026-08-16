import React, { useState } from 'react'
import { TableInfo } from '../../types/pos'
import { X, Armchair, ArrowRightLeft, Check, Layers } from 'lucide-react'

export interface TableOperationsModalProps {
  show: boolean
  onClose: () => void
  tablesGrid: TableInfo[]
  reassignFromTable: string
  setReassignFromTable: (v: string) => void
  reassignTargetTable: string
  setReassignTargetTable: (v: string) => void
  onConfirmReassign: () => void
  onConfirmSplit: (seatNumber: string) => void
  onConfirmJoin: (tableA: string, tableB: string, extraTables?: string[]) => void
}

export const TableOperationsModal: React.FC<TableOperationsModalProps> = ({
  show,
  onClose,
  tablesGrid,
  reassignFromTable,
  setReassignFromTable,
  reassignTargetTable,
  setReassignTargetTable,
  onConfirmReassign,
  onConfirmSplit,
  onConfirmJoin
}) => {
  const [tableOpMode, setTableOpMode] = useState<'move' | 'split' | 'join'>('move')
  const [splitSeatNumber, setSplitSeatNumber] = useState<string>('Seat 1')
  const [joinPrimaryTable, setJoinPrimaryTable] = useState<string>('MEJA-01')
  const [selectedTablesToJoin, setSelectedTablesToJoin] = useState<string[]>([])

  if (!show) return null

  const handleToggleTableJoinSelect = (tableName: string) => {
    if (tableName === joinPrimaryTable) return
    setSelectedTablesToJoin(prev =>
      prev.includes(tableName) ? prev.filter(t => t !== tableName) : [...prev, tableName]
    )
  }

  const handleExecuteMultiJoin = () => {
    if (selectedTablesToJoin.length === 0) return
    const tableB = selectedTablesToJoin[0]
    const extraTables = selectedTablesToJoin.slice(1)
    onConfirmJoin(joinPrimaryTable, tableB, extraTables)
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm sm:max-w-md w-full p-5 flex flex-col gap-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Armchair className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Operasi Meja F&B Kasir & Admin</h3>
            <p className="text-[11px] text-slate-400">Pindah Meja, Split Bill N-Way, & Multi-Table Join</p>
          </div>
        </div>

        {/* 3 OPERATION TABS SWITCHER */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setTableOpMode('move')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              tableOpMode === 'move' ? 'bg-indigo-500 text-white shadow' : 'text-slate-400'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" /> Pindah
          </button>
          <button
            onClick={() => setTableOpMode('split')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              tableOpMode === 'split' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400'
            }`}
          >
            ✂️ N-Way Split
          </button>
          <button
            onClick={() => setTableOpMode('join')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              tableOpMode === 'join' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400'
            }`}
          >
            🔗 Multi-Join
          </button>
        </div>

        {/* TAB 1: PINDAH MEJA */}
        {tableOpMode === 'move' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-semibold">Pilih Meja Asal (Yang Ingin Dipindah):</label>
              <select
                value={reassignFromTable}
                onChange={(e) => setReassignFromTable(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-amber-400 font-mono font-bold text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
              >
                {tablesGrid.filter(t => t.totalBill > 0 || t.status !== 'free').map(t => (
                  <option key={t.id} value={t.name}>{t.name} ({t.customerName || 'Aktif'} - Rp {t.totalBill.toLocaleString('id-ID')})</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-semibold">Pilih Meja Tujuan Baru:</label>
              <select
                value={reassignTargetTable}
                onChange={(e) => setReassignTargetTable(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
              >
                {tablesGrid.map(t => (
                  <option key={t.id} value={t.name}>{t.name} ({t.status === 'free' ? 'Kosong' : 'Ada Tamu'})</option>
                ))}
              </select>
            </div>

            <button
              onClick={onConfirmReassign}
              className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs py-3 rounded-xl shadow-lg mt-2 flex items-center justify-center gap-2"
            >
              <ArrowRightLeft className="w-4 h-4" /> Eksekusi Pindah Meja ➔
            </button>
          </div>
        )}

        {/* TAB 2: N-WAY SPLIT BILL */}
        {tableOpMode === 'split' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-semibold">Pilih Meja Utama (Induk):</label>
              <select
                value={reassignFromTable}
                onChange={(e) => setReassignFromTable(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-amber-400 font-mono font-bold text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
              >
                {tablesGrid.filter(t => t.totalBill > 0 || t.status !== 'free').map(t => (
                  <option key={t.id} value={t.name}>{t.name} ({t.customerName || 'Aktif'} - Rp {t.totalBill.toLocaleString('id-ID')})</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-semibold">Pilih Sub-Tab Seat yang Ingin Dipisah (N-Way Split):</label>
              <div className="grid grid-cols-4 gap-1.5">
                {['Seat 1', 'Seat 2', 'Seat 3', 'Seat 4', 'Seat 5', 'Seat 6', 'Seat 7', 'Seat 8'].map((seat) => (
                  <button
                    key={seat}
                    type="button"
                    onClick={() => setSplitSeatNumber(seat)}
                    className={`py-2 text-xs font-mono font-bold rounded-xl border transition-all ${
                      splitSeatNumber === seat
                        ? 'bg-amber-500 border-amber-400 text-slate-950 shadow'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {seat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-semibold">Meja Tujuan Pecahan Baru:</label>
              <select
                value={reassignTargetTable}
                onChange={(e) => setReassignTargetTable(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
              >
                {tablesGrid.map(t => (
                  <option key={t.id} value={t.name}>{t.name} ({t.status === 'free' ? 'Kosong' : 'Ada Tamu'})</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => onConfirmSplit(splitSeatNumber)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-lg mt-2 flex items-center justify-center gap-2"
            >
              ✂️ Eksekusi Split N-Way ({splitSeatNumber}) ➔
            </button>
          </div>
        )}

        {/* TAB 3: MULTI-TABLE JOIN (GABUNG 3, 4, atau 5 MEJA SEKALIGUS) */}
        {tableOpMode === 'join' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-semibold">Pilih Meja Utama (Tempat Gabung Induk):</label>
              <select
                value={joinPrimaryTable}
                onChange={(e) => {
                  setJoinPrimaryTable(e.target.value)
                  setSelectedTablesToJoin(prev => prev.filter(t => t !== e.target.value))
                }}
                className="bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
              >
                {tablesGrid.map(t => (
                  <option key={t.id} value={t.name}>{t.name} ({t.customerName || 'Aktif'})</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-semibold">
                Pilih Meja-Meja Yang Digabung (Bisa Select Multi 3, 4, 5 Meja):
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1 bg-slate-950 rounded-xl border border-slate-800">
                {tablesGrid
                  .filter(t => t.name !== joinPrimaryTable)
                  .map(t => {
                    const isSelected = selectedTablesToJoin.includes(t.name)
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleToggleTableJoinSelect(t.name)}
                        className={`p-2 rounded-xl text-left border text-xs font-mono font-bold flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="truncate">{t.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                      </button>
                    )
                  })}
              </div>
            </div>

            {selectedTablesToJoin.length > 0 && (
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Menggabungkan {selectedTablesToJoin.length + 1} meja: {joinPrimaryTable} + {selectedTablesToJoin.join(' + ')}
              </div>
            )}

            <button
              onClick={handleExecuteMultiJoin}
              disabled={selectedTablesToJoin.length === 0}
              className={`w-full font-bold text-xs py-3 rounded-xl shadow-lg mt-1 flex items-center justify-center gap-2 ${
                selectedTablesToJoin.length > 0
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              🔗 Eksekusi Multi-Join ({selectedTablesToJoin.length + 1} Meja) ➔
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
