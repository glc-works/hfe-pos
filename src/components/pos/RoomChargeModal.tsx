import React, { useState, useMemo } from 'react'
import { HotelGuestFolio } from '../../types/pos'
import { MOCK_HOTEL_GUEST_FOLIOS } from '../../data/mockData'
import { useTranslation } from '../../context/LanguageContext'
import { X, Building2, CheckCircle2, AlertTriangle, ShieldCheck, KeyRound, Receipt } from 'lucide-react'

export interface RoomChargeModalProps {
  show: boolean
  onClose: () => void
  totalBill: number
  subtotal?: number
  taxPB1?: number
  tableName?: string
  guestFolios?: HotelGuestFolio[]
  onConfirmRoomCharge: (payload: {
    roomNumber: string
    guestName: string
    folioId: string
    totalCharged: number
    glAccountReceivable: string
    staffPin: string
    notes?: string
  }) => void
}

export const RoomChargeModal: React.FC<RoomChargeModalProps> = ({
  show,
  onClose,
  totalBill,
  subtotal: propSubtotal,
  taxPB1: propTaxPB1,
  tableName = 'Walk-In / Table',
  guestFolios = MOCK_HOTEL_GUEST_FOLIOS,
  onConfirmRoomCharge
}) => {
  const { formatPrice } = useTranslation()
  const [roomNumberInput, setRoomNumberInput] = useState<string>('402')
  const [staffPin, setStaffPin] = useState<string>('8888')
  const [guestNotes, setGuestNotes] = useState<string>('')
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState<boolean>(false)

  const calcSubtotal = propSubtotal || Math.round(totalBill / 1.1)
  const calcTaxPB1 = propTaxPB1 || (totalBill - calcSubtotal)

  // Find matching guest folio
  const matchedFolio = useMemo(() => {
    const query = roomNumberInput.trim().toLowerCase()
    if (!query) return null
    return guestFolios.find(
      (f) => f.roomNumber.toLowerCase() === query || f.roomNumber.toLowerCase().includes(query)
    ) || null
  }, [roomNumberInput, guestFolios])

  if (!show) return null

  const isCheckedIn = matchedFolio?.status === 'checked_in'
  const remainingCredit = matchedFolio ? (matchedFolio.creditLimit - matchedFolio.currentBalance) : 0
  const isCreditSufficient = remainingCredit >= totalBill
  const canSubmit = !!matchedFolio && isCheckedIn && isCreditSufficient && staffPin.length >= 4

  const handleExecuteCharge = () => {
    if (!matchedFolio || !canSubmit) return

    onConfirmRoomCharge({
      roomNumber: matchedFolio.roomNumber,
      guestName: matchedFolio.guestName,
      folioId: matchedFolio.folioId || `FOLIO-${matchedFolio.roomNumber}`,
      totalCharged: totalBill,
      glAccountReceivable: matchedFolio.glAccountReceivable || '1104 - Piutang Tamu Hotel',
      staffPin,
      notes: guestNotes || undefined
    })

    setIsSubmittedSuccess(true)
    setTimeout(() => {
      setIsSubmittedSuccess(false)
      onClose()
    }, 1200)
  }

  return (
    <div className="fixed inset-0 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm sm:max-w-md w-full p-4 sm:p-5 flex flex-col gap-3.5 shadow-2xl relative text-slate-900 dark:text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-500 dark:text-indigo-400 shrink-0">
            <Building2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Charge to Hotel Room Folio</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Posting Tagihan F&B ke Piutang Kamar Tamu (PMS)</p>
          </div>
        </div>

        {isSubmittedSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-center animate-scaleUp">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 dark:text-emerald-400" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Posting Folio Kamar Berhasil!</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
              Kamar {matchedFolio?.roomNumber} • {matchedFolio?.guestName}
            </p>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
              {formatPrice(totalBill)} Terposting ke GL 1104
            </span>
          </div>
        ) : (
          <>
            {/* INPUT NOMOR KAMAR HOTEL */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold flex items-center justify-between">
                <span>Nomor Kamar Tamu:</span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">Contoh: 402, 305, 501</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={roomNumberInput}
                  onChange={(e) => setRoomNumberInput(e.target.value)}
                  placeholder="Ketik Nomor Kamar..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono font-bold text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* GUEST FOLIO VERIFICATION CARD */}
            {matchedFolio ? (
              <div className={`p-3 rounded-2xl border flex flex-col gap-2 transition-all ${
                isCheckedIn && isCreditSufficient
                  ? 'bg-indigo-500/10 border-indigo-500/40'
                  : 'bg-rose-500/10 border-rose-500/40'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <ShieldCheck className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate">{matchedFolio.guestName}</span>
                  </div>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full font-mono shrink-0 ${
                    isCheckedIn ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
                  }`}>
                    {isCheckedIn ? 'CHECKED-IN' : 'CHECKED-OUT'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-700 dark:text-slate-300 pt-1 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Periode Menginap:</span>
                    <span>{matchedFolio.checkInDate} s/d {matchedFolio.checkOutDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Sisa Limit Kredit:</span>
                    <span className={isCreditSufficient ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-rose-600 dark:text-rose-400 font-bold'}>
                      {formatPrice(remainingCredit)}
                    </span>
                  </div>
                </div>

                {!isCreditSufficient && (
                  <div className="flex items-center gap-1 text-[10px] text-rose-700 dark:text-rose-300 bg-rose-500/20 p-1.5 rounded-lg font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Limit kredit kamar tidak mencukupi tagihan ini!</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-center text-slate-500 text-xs">
                Kamar tidak ditemukan di sistem PMS. Pastikan nomor kamar terdaftar.
              </div>
            )}

            {/* BILL & DOUBLE-ENTRY BREAKDOWN */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 flex flex-col gap-1.5 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                <span>Tagihan {tableName}:</span>
                <span>{formatPrice(calcSubtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                <span>Pajak PB1 Restoran (10%):</span>
                <span>{formatPrice(calcTaxPB1)}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
                <span>Total Charge ke Kamar:</span>
                <span className="text-amber-600 dark:text-amber-400">{formatPrice(totalBill)}</span>
              </div>
              <div className="text-[9px] text-slate-500 pt-0.5 leading-tight">
                Posting: [DEBIT] 1104 Piutang Tamu | [KREDIT] 4101 Penjualan + 2105 PB1
              </div>
            </div>

            {/* STAFF PIN AUTHENTICATION */}
            <div className="flex items-center gap-2">
              <div className="flex-1 flex flex-col gap-0.5">
                <label className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                  <span>PIN Staf Otorisasi:</span>
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={staffPin}
                  onChange={(e) => setStaffPin(e.target.value)}
                  placeholder="PIN Staf (e.g. 8888)"
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-center font-bold text-xs rounded-xl p-2 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* CONFIRM BUTTON */}
            <button
              type="button"
              disabled={!canSubmit}
              onClick={handleExecuteCharge}
              className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
                canSubmit
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Charge ke Kamar {matchedFolio ? matchedFolio.roomNumber : ''} ({formatPrice(totalBill)}) ➔</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
export default RoomChargeModal
