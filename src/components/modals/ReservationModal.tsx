import React from 'react'
import { HfeCompanyProfile, MenuItem } from '../../types/pos'
import { X, CalendarCheck, Calendar, Clock, MapPin, Users, CreditCard, Coffee } from 'lucide-react'

interface ReservationModalProps {
  show: boolean
  onClose: () => void
  hfeCompanyProfile: HfeCompanyProfile
  productCatalog: MenuItem[]
  resDate: string
  setResDate: (v: string) => void
  resTimeSlot: string
  setResTimeSlot: (v: string) => void
  resArea: string
  setResArea: (v: string) => void
  resPax: number
  setResPax: (v: number) => void
  resCustomerName: string
  setResCustomerName: (v: string) => void
  resCustomerPhone: string
  setResCustomerPhone: (v: string) => void
  resNotes: string
  setResNotes: (v: string) => void
  resPayDpNow: boolean
  setResPayDpNow: (v: boolean) => void
  dpRequiredMode: boolean
  dpAmountConfig: number
  reservationPolicyMode: 'instant' | 'manual_review'
  reservationOrderMode: 'table_only' | 'optional_order' | 'mandatory_order'
  priceVisibilityMode: 'show_prices' | 'hide_prices'
  resPreOrderItems: { itemId: string; name: string; price: number; qty: number }[]
  setResPreOrderItems: React.Dispatch<React.SetStateAction<{ itemId: string; name: string; price: number; qty: number }[]>>
  onCreateReservation: () => void
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  show,
  onClose,
  hfeCompanyProfile,
  productCatalog,
  resDate,
  setResDate,
  resTimeSlot,
  setResTimeSlot,
  resArea,
  setResArea,
  resPax,
  setResPax,
  resCustomerName,
  setResCustomerName,
  resCustomerPhone,
  setResCustomerPhone,
  resNotes,
  setResNotes,
  resPayDpNow,
  setResPayDpNow,
  dpRequiredMode,
  dpAmountConfig,
  reservationPolicyMode,
  reservationOrderMode,
  priceVisibilityMode,
  resPreOrderItems,
  setResPreOrderItems,
  onCreateReservation
}) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm sm:max-w-md w-full p-5 flex flex-col gap-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3 pr-6">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <CalendarCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Form Reservasi Meja Cafe</h3>
            <p className="text-[11px] text-slate-400">{hfeCompanyProfile.brandName}</p>
          </div>
        </div>

        {/* DATE & TIME SLOT PICKER */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Tanggal Kunjungan:
            </label>
            <input
              type="date"
              value={resDate}
              onChange={(e) => setResDate(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 font-bold focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> Slot Jam Kunjungan:
            </label>
            <select
              value={resTimeSlot}
              onChange={(e) => setResTimeSlot(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-amber-400 font-mono font-bold text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="11:00 WIB">11:00 WIB (Lunch)</option>
              <option value="13:00 WIB">13:00 WIB (Afternoon)</option>
              <option value="17:00 WIB">17:00 WIB (Sunset Coffee)</option>
              <option value="19:00 WIB">19:00 WIB (Dinner)</option>
              <option value="21:00 WIB">21:00 WIB (Night Lounge)</option>
            </select>
          </div>
        </div>

        {/* TABLE AREA & PAX COUNT */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Area Tempat Duduk:
            </label>
            <select
              value={resArea}
              onChange={(e) => setResArea(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 font-bold text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="Meja Dining Utama">Meja Dining Utama</option>
              <option value="Outdoor Garden (Smoking)">Outdoor Garden</option>
              <option value="VIP Room 1 (AC & Projector)">VIP AC Room 1</option>
              <option value="Bar Stool Lounge">Bar Stool Lounge</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-indigo-400" /> Jumlah Tamu (Pax):
            </label>
            <select
              value={resPax}
              onChange={(e) => setResPax(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 text-amber-400 font-mono font-bold text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
            >
              {[1, 2, 4, 6, 8, 10, 12].map(p => (
                <option key={p} value={p}>{p} Orang Tamu</option>
              ))}
            </select>
          </div>
        </div>

        {/* CONTACT INFO */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-300">Data Diri Pemesan:</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={resCustomerName}
              onChange={(e) => setResCustomerName(e.target.value)}
              placeholder="Nama Pemesan (cth: Aldi)"
              className="bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 font-semibold"
            />
            <input
              type="tel"
              value={resCustomerPhone}
              onChange={(e) => setResCustomerPhone(e.target.value)}
              placeholder="No WhatsApp"
              className="bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        {/* SPECIAL REQUEST NOTES */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">Catatan Khusus (Acara/Permintaan Kursi):</label>
          <input
            type="text"
            value={resNotes}
            onChange={(e) => setResNotes(e.target.value)}
            placeholder="cth: Acara Ulang Tahun / Baby Chair / Stop Kontak"
            className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* PRE-ORDER MENU SECTION FOR RESERVATION */}
        {reservationOrderMode !== 'table_only' && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-amber-500" /> Pre-Order Menu Specialty {reservationOrderMode === 'mandatory_order' ? '(Wajib Minimal 1 Item)' : '(Opsional)'}:
              </span>
              {resPreOrderItems.length > 0 && (
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  Subtotal: Rp {resPreOrderItems.reduce((s, i) => s + (i.price * i.qty), 0).toLocaleString('id-ID')}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 max-h-36 overflow-y-auto pr-1">
              {productCatalog.map(item => {
                const existing = resPreOrderItems.find(i => i.itemId === item.id)
                const qty = existing ? existing.qty : 0
                return (
                  <div key={item.id} className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white text-[11px]">{item.name}</span>
                      {priceVisibilityMode === 'show_prices' && (
                        <p className="text-[10px] text-amber-400 font-mono">Rp {item.price.toLocaleString('id-ID')}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {qty > 0 ? (
                        <>
                          <button
                            onClick={() => {
                              if (qty === 1) {
                                setResPreOrderItems(prev => prev.filter(i => i.itemId !== item.id))
                              } else {
                                setResPreOrderItems(prev => prev.map(i => i.itemId === item.id ? { ...i, qty: i.qty - 1 } : i))
                              }
                            }}
                            className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="font-mono font-bold text-xs text-white w-4 text-center">{qty}</span>
                          <button
                            onClick={() => setResPreOrderItems(prev => prev.map(i => i.itemId === item.id ? { ...i, qty: i.qty + 1 } : i))}
                            className="w-5 h-5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center"
                          >
                            +
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setResPreOrderItems(prev => [...prev, { itemId: item.id, name: item.name, price: item.price, qty: 1 }])}
                          className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-1 rounded-md"
                        >
                          + Tambah
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* DOWN PAYMENT COMMITMENT SECTION */}
        {dpRequiredMode && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-400 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-amber-500" /> Down Payment (DP Commitment):
              </span>
              <span className="font-mono font-bold text-amber-300">Rp {dpAmountConfig.toLocaleString('id-ID')}</span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 pt-1">
              <input
                type="checkbox"
                checked={resPayDpNow}
                onChange={(e) => setResPayDpNow(e.target.checked)}
                className="rounded bg-slate-900 border-slate-800 text-indigo-500 focus:ring-0"
              />
              <span>Bayar DP Commitment Sekarang via QRIS (Deposit HFE)</span>
            </label>
          </div>
        )}

        {/* APPROVAL POLICY NOTICE */}
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-2.5 text-[11px] text-indigo-300 flex items-center gap-2">
          <span className="text-base">ℹ️</span>
          <span>
            Kebijakan Kafe: <b>{reservationPolicyMode === 'instant' ? '⚡ Instant Reserve (Langsung Disetujui)' : '⏳ Perlu Konfirmasi Admin/Kasir'}</b>.
          </span>
        </div>

        <button
          onClick={onCreateReservation}
          className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs py-3 rounded-xl shadow-lg mt-1 flex items-center justify-center gap-2"
        >
          <CalendarCheck className="w-4 h-4 text-white" /> Kirim Permohonan Reservasi Meja ➔
        </button>
      </div>
    </div>
  )
}
