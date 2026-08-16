import React, { useState } from 'react'
import { X, Clock, LogIn, LogOut, CheckCircle2, KeyRound } from 'lucide-react'

export interface StaffTimeclockModalProps {
  show: boolean
  onClose: () => void
  onClockEvent: (staffName: string, eventType: 'clock-in' | 'clock-out') => void
}

export const StaffTimeclockModal: React.FC<StaffTimeclockModalProps> = ({
  show,
  onClose,
  onClockEvent
}) => {
  const [pinInput, setPinInput] = useState('')
  const [staffName, setStaffName] = useState('Siti Nurhaliza (Barista)')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  if (!show) return null

  const handleAction = (eventType: 'clock-in' | 'clock-out') => {
    if (pinInput.length < 4) {
      alert('PIN Staf minimal 4 digit!')
      return
    }
    onClockEvent(staffName, eventType)
    setStatusMessage(`Berhasil ${eventType === 'clock-in' ? 'CLOCK IN (Masuk Shift)' : 'CLOCK OUT (Selesai Shift)'} untuk ${staffName}!`)
    setTimeout(() => {
      setStatusMessage(null)
      setPinInput('')
      onClose()
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-4 sm:p-6 flex flex-col gap-4 shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Staff Timeclock Attendance</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded-xl">
            <X className="w-4 h-4" />
          </button>
        </div>

        {statusMessage ? (
          <div className="py-6 flex flex-col items-center text-center gap-2 text-emerald-400 animate-in zoom-in-95">
            <CheckCircle2 className="w-12 h-12" />
            <p className="text-xs font-bold">{statusMessage}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Pilih Staf / Pegawai</label>
              <select
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Siti Nurhaliza (Barista)">Siti Nurhaliza (Barista)</option>
                <option value="Budi Pratama (Head Chef)">Budi Pratama (Head Chef)</option>
                <option value="Rina Astuti (Cashier)">Rina Astuti (Cashier)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Ketik 4-Digit PIN Absensi Staf</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500 tracking-widest text-center text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleAction('clock-in')}
                className="py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg transition-all"
              >
                <LogIn className="w-4 h-4" /> Clock In (Masuk Shift)
              </button>
              <button
                type="button"
                onClick={() => handleAction('clock-out')}
                className="py-3 bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg transition-all"
              >
                <LogOut className="w-4 h-4" /> Clock Out (Selesai Shift)
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
