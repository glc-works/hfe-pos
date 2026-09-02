import React, { useState } from 'react'
import {
  X, Ticket, Calendar, Clock, MapPin, User, Phone, Mail,
  QrCode, CheckCircle2, Copy, Share2, Sparkles, AlertCircle
} from 'lucide-react'
import { EventTicketItem, PurchasedEventTicket } from '../../types/pos'
import { useTranslation } from '../../context/LanguageContext'

export interface EventTicketPurchaseModalProps {
  show: boolean
  event: EventTicketItem | null
  onClose: () => void
  onPurchaseSuccess?: (ticket: PurchasedEventTicket) => void
}

export const EventTicketPurchaseModal: React.FC<EventTicketPurchaseModalProps> = ({
  show,
  event,
  onClose,
  onPurchaseSuccess
}) => {
  const { formatPrice } = useTranslation()
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details')
  const [quantity, setQuantity] = useState<number>(1)
  const [participantName, setParticipantName] = useState<string>('')
  const [participantPhone, setParticipantPhone] = useState<string>('')
  const [participantEmail, setParticipantEmail] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'gopay' | 'bca_va'>('qris')
  const [issuedTicket, setIssuedTicket] = useState<PurchasedEventTicket | null>(null)
  const [copiedCode, setCopiedCode] = useState<boolean>(false)

  if (!show || !event) return null

  const totalPrice = event.price * quantity

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!participantName.trim() || !participantPhone.trim()) {
      alert('Mohon lengkapi nama dan nomor WhatsApp peserta.')
      return
    }
    setStep('payment')
  }

  const handleConfirmPayment = () => {
    const ticketCode = `TKT-${event.id}-${Math.floor(1000 + Math.random() * 9000)}`
    const newTicket: PurchasedEventTicket = {
      ticketCode,
      eventId: event.id,
      eventTitle: event.title,
      participantName: participantName.trim(),
      participantPhone: participantPhone.trim(),
      participantEmail: participantEmail.trim() || undefined,
      quantity,
      totalAmountPaid: totalPrice,
      paymentMethod: paymentMethod.toUpperCase(),
      purchasedAt: new Date().toISOString(),
      qrBarcodeData: `HFE-TKT:${ticketCode}:${event.id}`,
      status: 'valid'
    }

    setIssuedTicket(newTicket)
    onPurchaseSuccess?.(newTicket)
    setStep('success')
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2500)
  }

  const handleShareWhatsApp = (ticket: PurchasedEventTicket) => {
    const message = `🎟️ *E-TICKET RESMI: ${ticket.eventTitle}*\n\n` +
      `Kode Tiket: *${ticket.ticketCode}*\n` +
      `Nama: ${ticket.participantName}\n` +
      `Jumlah: ${ticket.quantity} Pax\n` +
      `Waktu: ${event.date} (${event.time})\n` +
      `Lokasi: ${event.location}\n` +
      `Total Bayar: ${formatPrice(ticket.totalAmountPaid)} (LUNAS via ${ticket.paymentMethod})\n\n` +
      `Tunjukkan pesan / QR ini saat registrasi masuk. Terima kasih!`

    const url = `https://wa.me/${ticket.participantPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const handleResetAndClose = () => {
    setStep('details')
    setQuantity(1)
    setParticipantName('')
    setParticipantPhone('')
    setParticipantEmail('')
    setIssuedTicket(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                {step === 'success' ? 'E-Ticket Berhasil Diterbitkan' : event.title}
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5 truncate">
                <span>{event.date}</span> • <span>{event.time}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 no-scrollbar">

          {/* STEP 1: PARTICIPANT DETAILS & QUANTITY */}
          {step === 'details' && (
            <form onSubmit={handleProceedToPayment} className="flex flex-col gap-4">
              {/* Event Summary Card */}
              <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 font-mono">
                    {event.category.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                    {event.price === 0 ? 'GRATIS / FREE' : `${formatPrice(event.price)} / Pax`}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{event.description}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800/80">
                  <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Jumlah Tiket / Peserta:</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-30 font-bold text-slate-900 dark:text-white flex items-center justify-center text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono font-black text-sm text-slate-900 dark:text-white w-6 text-center">{quantity}</span>
                  <button
                    type="button"
                    disabled={quantity >= event.quotaRemaining}
                    onClick={() => setQuantity(prev => Math.min(event.quotaRemaining, prev + 1))}
                    className="w-8 h-8 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white flex items-center justify-center text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Participant Form */}
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Nama Lengkap Peserta *
                  </label>
                  <input
                    type="text"
                    required
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    placeholder="Contoh: Michael Chandra"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-purple-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> No. WhatsApp Aktif (Untuk E-Ticket) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={participantPhone}
                    onChange={(e) => setParticipantPhone(e.target.value)}
                    placeholder="081234567890"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-purple-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" /> Email (Opsional)
                  </label>
                  <input
                    type="email"
                    value={participantEmail}
                    onChange={(e) => setParticipantEmail(e.target.value)}
                    placeholder="michael@gmail.com"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-purple-500 font-medium"
                  />
                </div>
              </div>

              {/* Total & Submit Button */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase">Total Pembayaran</span>
                  <p className="font-mono font-black text-base text-amber-600 dark:text-amber-400">{formatPrice(totalPrice)}</p>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white shadow-lg flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <span>Lanjut Pembayaran ➔</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: INSTANT PAYMENT METHOD */}
          {step === 'payment' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="bg-slate-50 dark:bg-slate-950 border border-purple-500/30 rounded-2xl p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Ringkasan Tiket:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{event.title} ({quantity} Pax)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Nama Peserta:</span>
                  <span className="font-bold text-purple-700 dark:text-purple-300">{participantName}</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white">Total Tagihan:</span>
                  <span className="font-mono font-black text-sm text-amber-600 dark:text-amber-400">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Pilih Metode Pembayaran Instan:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'qris', label: 'QRIS Instan', badge: '⚡ Realtime' },
                    { id: 'gopay', label: 'GoPay / OVO', badge: '📱 E-Wallet' },
                    { id: 'bca_va', label: 'BCA Virtual', badge: '🏦 Transfer' }
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer ${
                        paymentMethod === pm.id
                          ? 'bg-purple-600/15 border-purple-500 text-purple-700 dark:text-purple-300 shadow-xs font-bold'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold">{pm.label}</span>
                      <span className="text-[9px] text-slate-500 font-mono">{pm.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* QRIS Code Simulation */}
              <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-inner">
                <div className="w-36 h-36 bg-slate-100 rounded-xl border-2 border-slate-900 flex items-center justify-center p-2">
                  <QrCode className="w-28 h-28 text-slate-900" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-800 dark:text-slate-800 uppercase tracking-wider">
                  NMID: ID102026889210 • {paymentMethod.toUpperCase()}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  ← Kembali
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Konfirmasi Pembayaran Lunas</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: E-TICKET SUCCESS & SHARE */}
          {step === 'success' && issuedTicket && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="bg-gradient-to-br from-purple-900/90 via-slate-900 to-slate-950 border-2 border-purple-500/50 rounded-3xl p-5 flex flex-col gap-3.5 shadow-2xl relative overflow-hidden text-white">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono text-purple-300 bg-purple-500/20 px-2.5 py-1 rounded-full border border-purple-500/30">
                    VALID E-TICKET
                  </span>
                  <span className="text-xs font-mono font-black text-amber-400">{issuedTicket.ticketCode}</span>
                </div>

                <div>
                  <h4 className="font-black text-base text-white">{issuedTicket.eventTitle}</h4>
                  <p className="text-xs text-purple-200 mt-0.5">Peserta: <strong className="text-white">{issuedTicket.participantName}</strong> ({issuedTicket.quantity} Pax)</p>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" /> {event.location}
                  </p>
                  <p className="text-[11px] text-amber-400 font-mono mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {event.date} • {event.time}
                  </p>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-2xl border border-purple-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono">Kode Tiket:</span>
                    <p className="font-mono font-black text-sm text-purple-300">{issuedTicket.ticketCode}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(issuedTicket.ticketCode)}
                    className="px-2.5 py-1.5 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              {/* Share via WhatsApp CTA */}
              <button
                type="button"
                onClick={() => handleShareWhatsApp(issuedTicket)}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                <span>Kirim Tiket ke WhatsApp Peserta</span>
              </button>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
