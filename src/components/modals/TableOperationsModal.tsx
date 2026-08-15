import React, { useState } from 'react'
import { TableInfo } from '../../types/pos'
import { X, Armchair, ArrowRightLeft } from 'lucide-react'

interface TableOperationsModalProps {
  show: boolean
  onClose: () => void
  tablesGrid: TableInfo[]
  reassignFromTable: string
  setReassignFromTable: (v: string) => void
  reassignTargetTable: string
  setReassignTargetTable: (v: string) => void
  onConfirmReassign: () => void
  onConfirmSplit: (seatNumber: string) => void
  onConfirmJoin: (tableA: string, tableB: string) => void
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
  const [joinTableA, setJoinTableA] = useState<string>('MEJA-04')
  const [joinTableB, setJoinTableB] = useState<string>('MEJA-08')

  if (!show) return null

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
            <p className="text-[11px] text-slate-400">Pindah Meja, Split Bill/Seat, & Gabung Tagihan Meja</p>
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
            ✂️ Split Meja
          </button>
          <button
            onClick={() => setTableOpMode('join')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              tableOpMode === 'join' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400'
            }`}
          >
            🔗 Join Meja
          </button>
        </div>

        {/* TAB 1: PINDAH MEJA (MOVE TABLE) */}
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

        {/* TAB 2: SPLIT MEJA (SPLIT BILL PER SEAT) */}
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
              <label className="text-xs text-slate-400 font-semibold">Pilih Kursi / Seat yang Ingin Dipisah (Split):</label>
              <select
                value={splitSeatNumber}
                onChange={(e) => setSplitSeatNumber(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-indigo-400 font-mono font-bold text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
              >
                <option value="Seat 1">Seat 1 (Tamu Utama)</option>
                <option value="Seat 2">Seat 2</option>
                <option value="Seat 3">Seat 3</option>
                <option value="Seat 4">Seat 4</option>
              </select>
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
              ✂️ Eksekusi Split Meja ({splitSeatNumber}) ➔
            </button>
          </div>
        )}

        {/* TAB 3: JOIN MEJA (MERGE TABLES) */}
        {tableOpMode === 'join' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-semibold">Pilih Meja A (Gabung Ke):</label>
              <select
                value={joinTableA}
                onChange={(e) => setJoinTableA(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
              >
                {tablesGrid.map(t => (
                  <option key={t.id} value={t.name}>{t.name} ({t.customerName || 'Aktif'})</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-semibold">Pilih Meja B (Yang Digabung):</label>
              <select
                value={joinTableB}
                onChange={(e) => setJoinTableB(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-amber-400 font-mono font-bold text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
              >
                {tablesGrid.filter(t => t.name !== joinTableA).map(t => (
                  <option key={t.id} value={t.name}>{t.name} ({t.customerName || 'Aktif'})</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => onConfirmJoin(joinTableA, joinTableB)}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-lg mt-2 flex items-center justify-center gap-2"
            >
              🔗 Eksekusi Join Meja ({joinTableA} + {joinTableB}) ➔
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
