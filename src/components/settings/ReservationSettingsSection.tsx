import React from 'react'
import { CalendarCheck, Sliders, Check, Smartphone, Tag } from 'lucide-react'
import { TableReservation } from '../../types/pos'

export interface ReservationSettingsSectionProps {
  reservationPolicyMode: 'instant' | 'manual_review'
  setReservationPolicyMode: (mode: 'instant' | 'manual_review') => void
  dpRequiredMode: boolean
  setDpRequiredMode: (req: boolean) => void
  dpAmountConfig: number
  setDpAmountConfig: (amt: number) => void
  reservations: TableReservation[]
  handleApproveReservation: (id: string) => void
  handleRejectReservation: (id: string) => void
  reservationOrderMode: 'table_only' | 'optional_order' | 'mandatory_order'
  setReservationOrderMode: (mode: 'table_only' | 'optional_order' | 'mandatory_order') => void
  customerAppDisplayMode: 'full_ordering' | 'catalog_only'
  setCustomerAppDisplayMode: (mode: 'full_ordering' | 'catalog_only') => void
  priceVisibilityMode: 'show_prices' | 'hide_prices'
  setPriceVisibilityMode: (mode: 'show_prices' | 'hide_prices') => void
}

export const ReservationSettingsSection: React.FC<ReservationSettingsSectionProps> = ({
  reservationPolicyMode,
  setReservationPolicyMode,
  dpRequiredMode,
  setDpRequiredMode,
  dpAmountConfig,
  setDpAmountConfig,
  reservations,
  handleApproveReservation,
  handleRejectReservation,
  reservationOrderMode,
  setReservationOrderMode,
  customerAppDisplayMode,
  setCustomerAppDisplayMode,
  priceVisibilityMode,
  setPriceVisibilityMode
}) => {
  return (
    <>
      {/* CARD 1.7: TABLE RESERVATION ENGINE POLICY & DP SETTINGS */}
      <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-indigo-400" /> Kebijakan Reservasi Meja & Down Payment (DP Commitment)
              </h3>
              <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30 uppercase">
                {reservationPolicyMode === 'instant' ? '⚡ INSTANT' : '⏳ MANUAL REVIEW'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Atur persetujuan reservasi meja (Otomatis vs Manual Review) dan nominal DP jaminan tempat.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Kebijakan Persetujuan Reservasi:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setReservationPolicyMode('manual_review')}
                className={`p-2.5 rounded-xl text-xs font-bold border text-left flex flex-col gap-0.5 transition-all ${
                  reservationPolicyMode === 'manual_review'
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <span>⏳ Perlu Konfirmasi Admin</span>
                <span className="text-[9px] font-normal text-slate-400 font-sans">Kasir/Admin harus klik Approve dulu</span>
              </button>

              <button
                onClick={() => setReservationPolicyMode('instant')}
                className={`p-2.5 rounded-xl text-xs font-bold border text-left flex flex-col gap-0.5 transition-all ${
                  reservationPolicyMode === 'instant'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <span>⚡ Instant Reserve</span>
                <span className="text-[9px] font-normal text-slate-400 font-sans">Langsung auto-confirm slot meja</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Nominal Down Payment (DP Commitment Opsional):</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDpRequiredMode(!dpRequiredMode)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  dpRequiredMode ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                {dpRequiredMode ? '✓ Wajib DP' : 'Tanpa DP'}
              </button>

              {dpRequiredMode && (
                <select
                  value={dpAmountConfig}
                  onChange={(e) => setDpAmountConfig(Number(e.target.value))}
                  className="flex-1 bg-slate-950 border border-slate-800 text-amber-400 font-mono font-bold text-xs rounded-xl p-2 focus:outline-none focus:border-indigo-500"
                >
                  <option value={25000}>Rp 25.000 / Reservasi</option>
                  <option value={50000}>Rp 50.000 / Reservasi</option>
                  <option value={100000}>Rp 100.000 / Reservasi</option>
                </select>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <CalendarCheck className="w-4 h-4 text-indigo-400" /> Daftar Permohonan Reservasi Meja ({reservations.length})
            </span>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
              {reservations.filter(r => r.status === 'pending').length} Pending
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {reservations.map(res => (
              <div key={res.id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400">{res.id}</span>
                    <h4 className="font-bold text-white text-sm">{res.customerName} ({res.phone})</h4>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                      res.status === 'confirmed'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : res.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}>
                      {res.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span>📅 {res.reservationDate} @ {res.timeSlot}</span>
                    <span>📍 {res.tableArea} ({res.paxCount} Pax)</span>
                    {res.dpAmount > 0 && (
                      <span className="text-emerald-400 font-mono font-bold">DP: Rp {res.dpAmount.toLocaleString('id-ID')} (QRIS Paid)</span>
                    )}
                  </div>

                  {res.specialNotes && (
                    <p className="text-[10px] text-slate-400 italic mt-0.5">Catatan: "{res.specialNotes}"</p>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {res.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApproveReservation(res.id)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg shadow"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleRejectReservation(res.id)}
                        className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 font-bold text-xs px-3 py-1.5 rounded-lg"
                      >
                        ❌ Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CARD 1.8: OPERATIONAL FLOWS, RESERVATION ORDER MODE & PRICE VISIBILITY CONFIG */}
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" /> Mode Operasional Aplikasi Pelanggan, Order Reservasi & Visibilitas Harga
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Konfigurasi alur pemesanan reservasi, apakah pelanggan bisa pesan langsung / hanya lihat katalog, dan sembunyikan harga.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <CalendarCheck className="w-3.5 h-3.5 text-indigo-400" /> Flow Order Reservasi Meja:
            </label>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setReservationOrderMode('table_only')}
                className={`px-3 py-2 rounded-lg text-xs font-bold border text-left flex items-center justify-between transition-all ${
                  reservationOrderMode === 'table_only' ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <span>🪑 Reservasi Meja Saja</span>
                {reservationOrderMode === 'table_only' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
              </button>

              <button
                onClick={() => setReservationOrderMode('optional_order')}
                className={`px-3 py-2 rounded-lg text-xs font-bold border text-left flex items-center justify-between transition-all ${
                  reservationOrderMode === 'optional_order' ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <span>☕ Meja + Pre-Order (Opsional)</span>
                {reservationOrderMode === 'optional_order' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
              </button>

              <button
                onClick={() => setReservationOrderMode('mandatory_order')}
                className={`px-3 py-2 rounded-lg text-xs font-bold border text-left flex items-center justify-between transition-all ${
                  reservationOrderMode === 'mandatory_order' ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <span>⚠️ Wajib Pre-Order Menu</span>
                {reservationOrderMode === 'mandatory_order' && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> Mode Aplikasi Pelanggan:
            </label>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setCustomerAppDisplayMode('full_ordering')}
                className={`px-3 py-2 rounded-lg text-xs font-bold border text-left flex items-center justify-between transition-all ${
                  customerAppDisplayMode === 'full_ordering' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <span>🛍️ Full Ordering (Order Active)</span>
                {customerAppDisplayMode === 'full_ordering' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>

              <button
                onClick={() => setCustomerAppDisplayMode('catalog_only')}
                className={`px-3 py-2 rounded-lg text-xs font-bold border text-left flex items-center justify-between transition-all ${
                  customerAppDisplayMode === 'catalog_only' ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <span>📖 Katalog Digital (View Only)</span>
                {customerAppDisplayMode === 'catalog_only' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
              </button>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400" /> Visibilitas Harga Menu (Rp):
            </label>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setPriceVisibilityMode('show_prices')}
                className={`px-3 py-2 rounded-lg text-xs font-bold border text-left flex items-center justify-between transition-all ${
                  priceVisibilityMode === 'show_prices' ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <span>🏷️ Tampilkan Harga (Rp)</span>
                {priceVisibilityMode === 'show_prices' && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>

              <button
                onClick={() => setPriceVisibilityMode('hide_prices')}
                className={`px-3 py-2 rounded-lg text-xs font-bold border text-left flex flex-col transition-all ${
                  priceVisibilityMode === 'hide_prices' ? 'bg-rose-500/20 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>🙈 Sembunyikan Harga</span>
                  {priceVisibilityMode === 'hide_prices' && <Check className="w-3.5 h-3.5 text-rose-400" />}
                </div>
                <span className="text-[9px] text-slate-400 font-normal mt-0.5 font-sans">Cocok untuk Buku Menu Eksklusif / Fine Dining</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
