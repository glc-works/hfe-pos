import React from 'react'
import { HfeCompanyProfile, MenuItem } from '../../types/pos'
import { X, CalendarCheck, Calendar, Clock, MapPin, Users, CreditCard, Coffee } from 'lucide-react'
import { useMerchantConfig } from '../../context/MerchantConfigContext'

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
  const { customerTheme } = useMerchantConfig()
  const isLight = customerTheme.mode === 'light'
  const textColor = customerTheme.textColorHex || (isLight ? '#0f172a' : '#f8fafc')
  const secondaryTextColor = customerTheme.secondaryTextColorHex || (isLight ? '#64748b' : '#94a3b8')
  const modalBg = isLight ? '#ffffff' : '#0f172a'
  const cardBorder = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'
  const subCardBg = isLight ? '#f8fafc' : 'rgba(2,6,23,0.7)'
  const subCardBorder = isLight ? '#e2e8f0' : '#1e293b'
  const inputBg = isLight ? '#ffffff' : '#020617'
  const inputBorder = isLight ? '#cbd5e1' : '#334155'

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="border rounded-3xl max-w-sm sm:max-w-md w-full p-5 flex flex-col gap-4 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-slideUp"
        style={{ backgroundColor: modalBg, borderColor: cardBorder }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-lg bg-slate-100 dark:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b pb-3 pr-6" style={{ borderColor: cardBorder }}>
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-500">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold" style={{ color: textColor }}>Form Reservasi Meja Cafe</h3>
            <p className="text-[11px]" style={{ color: secondaryTextColor }}>{hfeCompanyProfile.brandName}</p>
          </div>
        </div>

        {/* DATE & TIME SLOT PICKER */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold flex items-center gap-1" style={{ color: textColor }}>
              <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Tanggal Kunjungan:
            </label>
            <input
              type="date"
              value={resDate}
              onChange={(e) => setResDate(e.target.value)}
              className="text-xs rounded-xl p-2.5 font-bold focus:outline-none focus:border-indigo-500 border"
              style={{ backgroundColor: inputBg, color: textColor, borderColor: inputBorder }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold flex items-center gap-1" style={{ color: textColor }}>
              <Clock className="w-3.5 h-3.5 text-indigo-500" /> Slot Jam Kunjungan:
            </label>
            <select
              value={resTimeSlot}
              onChange={(e) => setResTimeSlot(e.target.value)}
              className="font-mono font-bold text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500 border text-amber-500"
              style={{ backgroundColor: inputBg, borderColor: inputBorder }}
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
            <label className="text-xs font-semibold flex items-center gap-1" style={{ color: textColor }}>
              <MapPin className="w-3.5 h-3.5 text-indigo-500" /> Area Tempat Duduk:
            </label>
            <select
              value={resArea}
              onChange={(e) => setResArea(e.target.value)}
              className="font-bold text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500 border"
              style={{ backgroundColor: inputBg, color: textColor, borderColor: inputBorder }}
            >
              <option value="Meja Dining Utama">Meja Dining Utama</option>
              <option value="Outdoor Garden (Smoking)">Outdoor Garden</option>
              <option value="VIP Room 1 (AC & Projector)">VIP AC Room 1</option>
              <option value="Bar Stool Lounge">Bar Stool Lounge</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold flex items-center gap-1" style={{ color: textColor }}>
              <Users className="w-3.5 h-3.5 text-indigo-500" /> Jumlah Tamu (Pax):
            </label>
            <select
              value={resPax}
              onChange={(e) => setResPax(Number(e.target.value))}
              className="font-mono font-bold text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500 border text-amber-500"
              style={{ backgroundColor: inputBg, borderColor: inputBorder }}
            >
              {[1, 2, 4, 6, 8, 10, 12].map(p => (
                <option key={p} value={p}>{p} Orang Tamu</option>
              ))}
            </select>
          </div>
        </div>

        {/* CONTACT INFO */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold" style={{ color: textColor }}>Data Diri Pemesan:</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={resCustomerName}
              onChange={(e) => setResCustomerName(e.target.value)}
              placeholder="Nama Pemesan (cth: Aldi)"
              className="text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 font-semibold border"
              style={{ backgroundColor: inputBg, color: textColor, borderColor: inputBorder }}
            />
            <input
              type="tel"
              value={resCustomerPhone}
              onChange={(e) => setResCustomerPhone(e.target.value)}
              placeholder="No WhatsApp"
              className="text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 font-mono border"
              style={{ backgroundColor: inputBg, color: textColor, borderColor: inputBorder }}
            />
          </div>
        </div>

        {/* SPECIAL REQUEST NOTES */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold" style={{ color: textColor }}>Catatan Khusus (Acara/Permintaan Kursi):</label>
          <input
            type="text"
            value={resNotes}
            onChange={(e) => setResNotes(e.target.value)}
            placeholder="cth: Acara Ulang Tahun / Baby Chair / Stop Kontak"
            className="text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 border"
            style={{ backgroundColor: inputBg, color: textColor, borderColor: inputBorder }}
          />
        </div>

        {/* PRE-ORDER MENU SECTION FOR RESERVATION */}
        {reservationOrderMode !== 'table_only' && (
          <div 
            className="border rounded-xl p-3 flex flex-col gap-2.5"
            style={{ backgroundColor: subCardBg, borderColor: subCardBorder }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-amber-500" /> Pre-Order Menu Specialty {reservationOrderMode === 'mandatory_order' ? '(Wajib Minimal 1 Item)' : '(Opsional)'}:
              </span>
              {resPreOrderItems.length > 0 && (
                <span className="text-[10px] font-mono text-emerald-500 font-bold">
                  Subtotal: Rp {resPreOrderItems.reduce((s, i) => s + (i.price * i.qty), 0).toLocaleString('id-ID')}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 max-h-36 overflow-y-auto pr-1">
              {productCatalog.map(item => {
                const existing = resPreOrderItems.find(i => i.itemId === item.id)
                const qty = existing ? existing.qty : 0
                return (
                  <div 
                    key={item.id} 
                    className="p-2 rounded-lg border flex items-center justify-between text-xs"
                    style={{ backgroundColor: modalBg, borderColor: subCardBorder }}
                  >
                    <div>
                      <span className="font-bold text-[11px]" style={{ color: textColor }}>{item.name}</span>
                      {priceVisibilityMode === 'show_prices' && (
                        <p className="text-[10px] text-amber-500 font-mono">Rp {item.price.toLocaleString('id-ID')}</p>
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
                            className="w-5 h-5 rounded border font-bold text-xs flex items-center justify-center"
                            style={{ backgroundColor: subCardBg, color: textColor, borderColor: subCardBorder }}
                          >
                            -
                          </button>
                          <span className="font-mono font-bold text-xs w-4 text-center" style={{ color: textColor }}>{qty}</span>
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
                          className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 border border-amber-500/30 text-[10px] font-bold px-2 py-1 rounded-md"
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
          <div 
            className="border rounded-xl p-3 flex flex-col gap-2"
            style={{ backgroundColor: subCardBg, borderColor: subCardBorder }}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-500 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-amber-500" /> Down Payment (DP Commitment):
              </span>
              <span className="font-mono font-bold text-amber-500">Rp {dpAmountConfig.toLocaleString('id-ID')}</span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs pt-1" style={{ color: textColor }}>
              <input
                type="checkbox"
                checked={resPayDpNow}
                onChange={(e) => setResPayDpNow(e.target.checked)}
                className="rounded text-indigo-500 focus:ring-0"
              />
              <span>Bayar DP Commitment Sekarang via QRIS (Deposit HFE)</span>
            </label>
          </div>
        )}

        {/* APPROVAL POLICY NOTICE */}
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-2.5 text-[11px] text-indigo-500 flex items-center gap-2">
          <span className="text-base">ℹ️</span>
          <span>
            Kebijakan Kafe: <b>{reservationPolicyMode === 'instant' ? '⚡ Instant Reserve (Langsung Disetujui)' : '⏳ Perlu Konfirmasi Admin/Kasir'}</b>.
          </span>
        </div>

        <button
          onClick={onCreateReservation}
          className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs py-3 rounded-xl shadow-lg mt-1 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <CalendarCheck className="w-4 h-4 text-white" /> Kirim Permohonan Reservasi Meja ➔
        </button>
      </div>
    </div>
  )
}
