import React, { useState } from 'react'
import { Ticket, Calendar, Clock, MapPin, QrCode, CheckCircle2, X, Sparkles, ShieldCheck } from 'lucide-react'
import { PurchasedEventTicket } from '../../types/pos'

export interface CustomerTicketsWalletTabProps {
  tickets?: PurchasedEventTicket[]
}

const DEFAULT_PURCHASED_TICKETS: PurchasedEventTicket[] = [
  {
    ticketCode: 'TKT-EVT-WORKSHOP-02-8812',
    eventId: 'EVT-WORKSHOP-02',
    eventTitle: '☕ Barista Cupping & Manual Brew Masterclass',
    participantName: 'Aldi Pratama',
    participantPhone: '081298765432',
    participantEmail: 'aldi@togrow.id',
    quantity: 1,
    totalAmountPaid: 250000,
    paymentMethod: 'QRIS BCA',
    purchasedAt: '2026-08-14T10:30:00Z',
    qrBarcodeData: 'HFE-TKT:EVT-WORKSHOP-02:8812:ALDI',
    status: 'valid'
  },
  {
    ticketCode: 'TKT-EVT-JAZZ-01-7740',
    eventId: 'EVT-JAZZ-01',
    eventTitle: '🎷 Friday Night Live Acoustic Jazz',
    participantName: 'Aldi Pratama & Guest',
    participantPhone: '081298765432',
    quantity: 2,
    totalAmountPaid: 300000,
    paymentMethod: 'Kartu Kredit Mandiri',
    purchasedAt: '2026-08-08T15:20:00Z',
    qrBarcodeData: 'HFE-TKT:EVT-JAZZ-01:7740:ALDI',
    status: 'used'
  }
]

export const CustomerTicketsWalletTab: React.FC<CustomerTicketsWalletTabProps> = ({
  tickets = DEFAULT_PURCHASED_TICKETS
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'valid' | 'used'>('all')
  const [selectedTicketForQR, setSelectedTicketForQR] = useState<PurchasedEventTicket | null>(null)

  const filteredTickets = tickets.filter(t => {
    if (filterMode === 'valid') return t.status === 'valid'
    if (filterMode === 'used') return t.status === 'used'
    return true
  })

  return (
    <div className="flex flex-col gap-3.5 w-full">
      {/* HEADER WITH FILTER CHIPS */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-white flex items-center gap-1.5">
            <Ticket className="w-4 h-4 text-purple-400" /> Dompet E-Ticket & Workshop
          </h3>
          <p className="text-[11px] text-slate-400 font-mono">Tiket acara, reservasi kelas kopi & gate pass</p>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {(['all', 'valid', 'used'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setFilterMode(mode)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono uppercase transition-all ${
                filterMode === mode
                  ? 'bg-purple-600 text-white shadow font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode === 'all' ? 'Semua' : mode === 'valid' ? 'Aktif' : 'Riwayat'}
            </button>
          ))}
        </div>
      </div>

      {/* TICKETS LIST */}
      <div className="flex flex-col gap-3">
        {filteredTickets.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <Ticket className="w-8 h-8 text-slate-600" />
            <span>Tidak ada e-ticket dalam kategori ini.</span>
          </div>
        ) : (
          filteredTickets.map((tkt) => {
            const isValid = tkt.status === 'valid'
            return (
              <div
                key={tkt.ticketCode}
                className={`rounded-2xl p-4 border flex flex-col justify-between gap-3 shadow-xl transition-all relative overflow-hidden ${
                  isValid
                    ? 'bg-gradient-to-br from-slate-900 via-purple-950/30 to-slate-900 border-purple-500/40 shadow-purple-950/30'
                    : 'bg-slate-900/60 border-slate-800 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                      {tkt.ticketCode}
                    </span>
                    <h4 className="font-bold text-sm text-white mt-1.5 truncate">{tkt.eventTitle}</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Peserta: <strong className="text-white">{tkt.participantName}</strong> ({tkt.quantity} Pax)
                    </p>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 flex items-center gap-1 ${
                    isValid
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {isValid ? <ShieldCheck className="w-3 h-3 text-emerald-400" /> : <CheckCircle2 className="w-3 h-3" />}
                    <span>{isValid ? 'Siap Digunakan' : 'Sudah Digunakan'}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <div className="flex flex-col text-[11px] font-mono text-slate-400">
                    <span>Total Bayar: <strong className="text-amber-400 font-mono">Rp {tkt.totalAmountPaid.toLocaleString('id-ID')}</strong></span>
                    <span className="text-[10px] text-slate-500">{tkt.paymentMethod}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedTicketForQR(tkt)}
                    className="text-xs font-bold px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Lihat QR Masuk</span>
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* GATE-IN QR PASS MODAL */}
      {selectedTicketForQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xs bg-slate-900 border border-purple-500/40 rounded-3xl p-5 shadow-2xl flex flex-col items-center gap-4 text-white text-center animate-scaleUp">
            <div className="w-full flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1">
                <Ticket className="w-4 h-4 text-purple-400" /> Pass QR Masuk
              </span>
              <button 
                type="button" 
                onClick={() => setSelectedTicketForQR(null)}
                className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-1">
              <h4 className="font-bold text-sm text-white">{selectedTicketForQR.eventTitle}</h4>
              <p className="text-xs text-slate-400">{selectedTicketForQR.participantName} • {selectedTicketForQR.quantity} Pax</p>
            </div>

            <div className="p-4 bg-white rounded-2xl flex flex-col items-center gap-2 shadow-inner">
              <QrCode className="w-40 h-40 text-slate-950" />
              <span className="text-xs font-mono font-black text-slate-900 tracking-wider">
                {selectedTicketForQR.ticketCode}
              </span>
            </div>

            <p className="text-[10px] text-slate-400 font-mono">
              Tunjukkan QR code ini ke petugas pintu masuk / resepsionis saat kedatangan.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
