import React, { useState } from 'react'
import { TableStatus } from '../../types/pos'
import { X, Armchair, ArrowRightLeft, Check, Layers, CloudRain, Users, Scissors, Sparkles } from 'lucide-react'
import { useTranslation } from '../../context/LanguageContext'

export type TableRelocationReason =
  | 'guest_request'
  | 'weather_rain'
  | 'larger_capacity'
  | 'vip_upgrade'
  | 'outlet_window'
  | 'table_maintenance'
  | 'other'

export interface TableOpsModalProps {
  show: boolean
  onClose: () => void
  tablesGrid: TableStatus[]
  reassignFromTable: string
  setReassignFromTable: (v: string) => void
  reassignTargetTable: string
  setReassignTargetTable: (v: string) => void
  onConfirmReassign: (reason?: string) => void
  onConfirmSplit: (seatNumber: string) => void
  onConfirmJoin: (tableA: string, tableB: string, extraTables?: string[]) => void
  onEmergencyWeatherRelocate?: (fromZone?: string, toZone?: string) => void
}

const RELOCATION_REASONS: { id: TableRelocationReason; label: string; icon: string }[] = [
  { id: 'guest_request', label: 'Permintaan Tamu', icon: '👤' },
  { id: 'weather_rain', label: 'Cuaca / Hujan', icon: '🌧️' },
  { id: 'larger_capacity', label: 'Kapasitas Lebih Besar', icon: '👥' },
  { id: 'vip_upgrade', label: 'Upgrade VIP Room', icon: '👑' },
  { id: 'outlet_window', label: 'Dekat Colokan / Jendela', icon: '🔌' },
  { id: 'table_maintenance', label: 'Perbaikan / Maintenance', icon: '🛠️' },
  { id: 'other', label: 'Lainnya', icon: '📝' }
]

export const TableOpsModal: React.FC<TableOpsModalProps> = ({
  show,
  onClose,
  tablesGrid,
  reassignFromTable,
  setReassignFromTable,
  reassignTargetTable,
  setReassignTargetTable,
  onConfirmReassign,
  onConfirmSplit,
  onConfirmJoin,
  onEmergencyWeatherRelocate
}) => {
  const { formatPrice } = useTranslation()
  const [tableOpMode, setTableOpMode] = useState<'move' | 'split' | 'join'>('move')
  const [selectedReason, setSelectedReason] = useState<TableRelocationReason>('guest_request')
  const [customReasonNote, setCustomReasonNote] = useState<string>('')
  const [splitSeatNumber, setSplitSeatNumber] = useState<string>('Seat 1')
  const [joinPrimaryTable, setJoinPrimaryTable] = useState<string>('OUT-04')
  const [selectedTablesToJoin, setSelectedTablesToJoin] = useState<string[]>([])
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null)

  if (!show) return null

  const handleToggleTableJoinSelect = (tableName: string) => {
    if (tableName === joinPrimaryTable) return
    setSelectedTablesToJoin((prev) =>
      prev.includes(tableName) ? prev.filter((t) => t !== tableName) : [...prev, tableName]
    )
  }

  const handleExecuteMultiJoin = () => {
    if (selectedTablesToJoin.length === 0) return
    const tableB = selectedTablesToJoin[0]
    const extraTables = selectedTablesToJoin.slice(1)
    onConfirmJoin(joinPrimaryTable, tableB, extraTables)
  }

  const handleExecuteReassign = () => {
    const reasonLabel = RELOCATION_REASONS.find((r) => r.id === selectedReason)?.label || 'Permintaan Tamu'
    const fullReason = customReasonNote ? `${reasonLabel} (${customReasonNote})` : reasonLabel
    onConfirmReassign(fullReason)
    setActionSuccessNotice(`Pindah Meja Berhasil: ${reassignFromTable} ➔ ${reassignTargetTable}`)
    setTimeout(() => {
      setActionSuccessNotice(null)
    }, 1500)
  }

  const handleWeatherRelocateShortcut = () => {
    setSelectedReason('weather_rain')
    if (onEmergencyWeatherRelocate) {
      onEmergencyWeatherRelocate('outdoor-garden', 'indoor-ac')
    } else {
      const outdoorTable = tablesGrid.find((t) => (t.zoneId === 'outdoor-garden' || t.name.startsWith('OUT')) && (t.totalBill > 0 || t.status !== 'free'))
      const indoorFree = tablesGrid.find((t) => (t.zoneId === 'indoor-ac' || t.name.startsWith('IND')) && t.status === 'free')
      if (outdoorTable && indoorFree) {
        setReassignFromTable(outdoorTable.name)
        setReassignTargetTable(indoorFree.name)
      }
    }
    setActionSuccessNotice('Relokasi Cuaca Hujan Siap Dieksekusi')
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm sm:max-w-md w-full p-4 sm:p-5 flex flex-col gap-3.5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Armchair className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Operasi Meja Hotel & Resto</h3>
            <p className="text-[11px] text-slate-400">Pindah Relokasi Universal, Merge Tagihan, & Split Bill</p>
          </div>
        </div>

        {actionSuccessNotice && (
          <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-xl px-3 py-2 text-xs text-emerald-300 font-semibold flex items-center gap-1.5 animate-fadeIn">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{actionSuccessNotice}</span>
          </div>
        )}

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
            onClick={() => setTableOpMode('join')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              tableOpMode === 'join' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Gabung
          </button>
          <button
            onClick={() => setTableOpMode('split')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              tableOpMode === 'split' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" /> Split Bill
          </button>
        </div>

        {/* TAB 1: PINDAH MEJA / RELOKASI UNIVERSAL */}
        {tableOpMode === 'move' && (
          <div className="flex flex-col gap-2.5">
            {/* QUICK PRESET WEATHER RELOCATE BANNER */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <CloudRain className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[11px] font-bold text-amber-300 truncate">Preset Hujan: Outdoor ➔ Indoor</span>
              </div>
              <button
                type="button"
                onClick={handleWeatherRelocateShortcut}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-lg shrink-0 shadow transition-all active:scale-95"
              >
                Pilih Preset ➔
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-400 font-semibold">Meja Asal:</label>
                <select
                  value={reassignFromTable}
                  onChange={(e) => setReassignFromTable(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-amber-400 font-mono font-bold text-xs rounded-xl p-2 focus:outline-none focus:border-indigo-500 truncate"
                >
                  {tablesGrid.filter((t) => t.totalBill > 0 || t.status !== 'free').map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name} ({formatPrice(t.totalBill)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-400 font-semibold">Meja Tujuan:</label>
                <select
                  value={reassignTargetTable}
                  onChange={(e) => setReassignTargetTable(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold text-xs rounded-xl p-2 focus:outline-none focus:border-indigo-500 truncate"
                >
                  {tablesGrid.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name} ({t.status === 'free' ? '🟢 Free' : '🔴 Ada Tamu'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* UNIVERSAL RELOCATION REASON PILLS */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400 font-semibold">Alasan Perpindahan:</label>
              <div className="flex flex-wrap gap-1">
                {RELOCATION_REASONS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedReason(r.id)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1 ${
                      selectedReason === r.id
                        ? 'bg-indigo-500 border-indigo-400 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{r.icon}</span>
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleExecuteReassign}
              className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg mt-1 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <ArrowRightLeft className="w-4 h-4" /> Eksekusi Pindah Meja ➔
            </button>
          </div>
        )}

        {/* TAB 2: GABUNG TAGIHAN MEJA (MERGE TABS) */}
        {tableOpMode === 'join' && (
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400 font-semibold">Pilih Meja Induk (Tujuan Gabung):</label>
              <select
                value={joinPrimaryTable}
                onChange={(e) => {
                  setJoinPrimaryTable(e.target.value)
                  setSelectedTablesToJoin((prev) => prev.filter((t) => t !== e.target.value))
                }}
                className="bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold text-xs rounded-xl p-2 focus:outline-none focus:border-indigo-500"
              >
                {tablesGrid.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name} ({t.customerName || 'Aktif'} - {formatPrice(t.totalBill)})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400 font-semibold">
                Pilih Meja-Meja Yang Digabung:
              </label>
              <div className="grid grid-cols-2 gap-1.5 max-h-28 overflow-y-auto p-1 bg-slate-950 rounded-xl border border-slate-800">
                {tablesGrid
                  .filter((t) => t.name !== joinPrimaryTable)
                  .map((t) => {
                    const isSelected = selectedTablesToJoin.includes(t.name)
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleToggleTableJoinSelect(t.name)}
                        className={`p-1.5 rounded-xl text-left border text-xs font-mono font-bold flex items-center justify-between transition-all ${
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
              <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span>{joinPrimaryTable} + {selectedTablesToJoin.join(' + ')}</span>
              </div>
            )}

            <button
              onClick={handleExecuteMultiJoin}
              disabled={selectedTablesToJoin.length === 0}
              className={`w-full font-bold text-xs py-2.5 rounded-xl shadow-lg mt-1 flex items-center justify-center gap-2 transition-all ${
                selectedTablesToJoin.length > 0
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              👥 Eksekusi Gabung Tagihan ({selectedTablesToJoin.length + 1} Meja) ➔
            </button>
          </div>
        )}

        {/* TAB 3: SPLIT BILL PER SEAT */}
        {tableOpMode === 'split' && (
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400 font-semibold">Pilih Meja Asal:</label>
              <select
                value={reassignFromTable}
                onChange={(e) => setReassignFromTable(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-amber-400 font-mono font-bold text-xs rounded-xl p-2 focus:outline-none focus:border-indigo-500"
              >
                {tablesGrid.filter((t) => t.totalBill > 0 || t.status !== 'free').map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name} ({t.customerName || 'Aktif'} - {formatPrice(t.totalBill)})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400 font-semibold">Pilih Kursi / Sub-Seat Dipisah:</label>
              <div className="grid grid-cols-4 gap-1.5">
                {['Seat 1', 'Seat 2', 'Seat 3', 'Seat 4', 'Seat 5', 'Seat 6', 'Seat 7', 'Seat 8'].map((seat) => (
                  <button
                    key={seat}
                    type="button"
                    onClick={() => setSplitSeatNumber(seat)}
                    className={`py-1.5 text-xs font-mono font-bold rounded-xl border transition-all ${
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

            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400 font-semibold">Pilih Meja Tujuan Pecahan:</label>
              <select
                value={reassignTargetTable}
                onChange={(e) => setReassignTargetTable(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold text-xs rounded-xl p-2 focus:outline-none focus:border-indigo-500"
              >
                {tablesGrid.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name} ({t.status === 'free' ? '🟢 Kosong' : '🔴 Ada Tamu'})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => onConfirmSplit(splitSeatNumber)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-lg mt-1 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              ✂️ Eksekusi Split Bill ({splitSeatNumber}) ➔
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
export default TableOpsModal
