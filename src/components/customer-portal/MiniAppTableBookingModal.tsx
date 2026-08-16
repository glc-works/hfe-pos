import React, { useState } from 'react'
import { X, Calendar, Clock, Users, Sparkles, Check, Crown, MapPin } from 'lucide-react'

export interface MiniAppTableBookingModalProps {
  isOpen: boolean
  onClose: () => void
}

export const MiniAppTableBookingModal: React.FC<MiniAppTableBookingModalProps> = ({ isOpen, onClose }) => {
  const [date, setDate] = useState('2026-08-20')
  const [time, setTime] = useState('19:00')
  const [pax, setPax] = useState<number>(4)
  const [zone, setZone] = useState<'indoor' | 'outdoor' | 'vip'>('vip')
  const [specialRequest, setSpecialRequest] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen) return null

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      onClose()
    }, 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-slate-950 border border-amber-500/30 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 animate-scaleUp text-slate-100">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">📅 Reservasi Meja & Ruang VIP</h4>
              <span className="text-[10px] font-mono text-amber-400">Kopitiam Senopati • Instant Booking Pass</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 flex flex-col items-center gap-2 text-center animate-fadeIn py-6">
            <Check className="w-8 h-8 text-emerald-400" />
            <span className="text-sm font-bold text-white">Reservasi Berhasil Dikonfirmasi!</span>
            <p className="text-xs text-emerald-300 font-mono">
              Meja {zone === 'vip' ? 'VIP Room' : zone === 'outdoor' ? 'Outdoor Garden' : 'Indoor AC'} untuk {pax} Orang pada {date} ({time} WIB) telah siap.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-300 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" /> Tanggal:
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-300 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Waktu:
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-300 font-medium flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-400" /> Jumlah Tamu:
                </label>
                <select
                  value={pax}
                  onChange={(e) => setPax(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value={2}>2 Orang (Couple)</option>
                  <option value={4}>4 Orang (Family)</option>
                  <option value={8}>8 Orang (Group)</option>
                  <option value={12}>12+ Orang (VIP Party)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-300 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" /> Area Pilihan:
                </label>
                <select
                  value={zone}
                  onChange={(e) => setZone(e.target.value as any)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="indoor">❄️ Indoor AC</option>
                  <option value="outdoor">🌿 Outdoor Garden</option>
                  <option value="vip">👑 VIP Room (Min. Spend)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-300 font-medium">Catatan Khusus (Acara / Request):</label>
              <textarea
                rows={2}
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                placeholder="Contoh: Ulang tahun, butuh baby chair, area tenang..."
                className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none resize-none"
              />
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-300">Uang Muka (Deposit DP):</span>
              <span className="font-mono font-black text-amber-300">
                Rp {zone === 'vip' ? '500.000' : '100.000'}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all active:scale-95 cursor-pointer mt-1"
            >
              <Sparkles className="w-4 h-4" />
              <span>Konfirmasi Reservasi & Bayar DP</span>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
