import React, { useState } from 'react'
import { QrCode, Heart, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react'

export interface PayAtTableQrViewProps {
  tableNo?: string
  guestName?: string
  items?: Array<{ name: string; qty: number; price: number }>
}

export const PayAtTableQrView: React.FC<PayAtTableQrViewProps> = ({
  tableNo = 'Meja 04',
  guestName = 'Bapak Aldi',
  items = [
    { name: 'Sirloin Steak AU 200g', qty: 2, price: 145000 },
    { name: 'Iced Aren Latte', qty: 2, price: 28000 }
  ]
}) => {
  const [tipPercentage, setTipPercentage] = useState<number>(10)
  const [isPaid, setIsPaid] = useState(false)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const pb1Tax = Math.round(subtotal * 0.1)
  const tipAmount = Math.round((subtotal * tipPercentage) / 100)
  const grandTotal = subtotal + pb1Tax + tipAmount

  const handlePayClick = () => {
    setIsPaid(true)
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 max-w-md mx-auto w-full">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full flex flex-col gap-5 shadow-2xl">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <QrCode className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-sm font-bold text-white">Pay-at-Table Contactless Folio</h2>
              <p className="text-[10px] text-slate-400">{tableNo} • {guestName}</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            LIVE BILL
          </span>
        </div>

        {isPaid ? (
          <div className="py-8 flex flex-col items-center text-center gap-3 animate-in zoom-in-95">
            <CheckCircle2 className="w-16 h-16 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Pembayaran Pelunasan Sukses!</h3>
            <p className="text-xs text-slate-400">
              Terima kasih telah mengunjungi Hfe Cafe. Struk digital telah dikirimkan ke WhatsApp Anda.
            </p>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5 text-[10px] text-emerald-400 flex items-center gap-1.5 mt-2">
              <ShieldCheck className="w-4 h-4" /> Terverifikasi HCB GL Journal
            </div>
          </div>
        ) : (
          <>
            {/* ITEMIZED ITEMS */}
            <div className="flex flex-col gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800/80 max-h-48 overflow-y-auto">
              {items.map((i, idx) => (
                <div key={idx} className="flex justify-between text-xs py-1 border-b border-slate-800/50">
                  <span className="text-slate-300">{i.name} x{i.qty}</span>
                  <span className="font-mono text-white">Rp {(i.price * i.qty).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>

            {/* TIP SLIDER & PRESETS */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-amber-400" /> Apresiasi Tip Staf:
                </span>
                <strong className="font-mono text-white">{tipPercentage}% (Rp {tipAmount.toLocaleString('id-ID')})</strong>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 5, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setTipPercentage(pct)}
                    className={`py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                      tipPercentage === pct
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {pct === 0 ? 'Tanpa Tip' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* FINANCIAL SUMMARY */}
            <div className="flex flex-col gap-1.5 border-t border-slate-800 pt-3 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal Pesanan</span>
                <span className="font-mono">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Pajak PB1 (10%)</span>
                <span className="font-mono">Rp {pb1Tax.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Apresiasi Tip</span>
                <span className="font-mono text-amber-400">Rp {tipAmount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-white border-t border-slate-800/80 pt-2">
                <span>TOTAL PELUNASAN</span>
                <span className="font-mono text-emerald-400 text-base">Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* PAY BUTTON */}
            <button
              type="button"
              onClick={handlePayClick}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-xl transition-all"
            >
              Bayar Pelunasan via QRIS / E-Wallet <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

      </div>
    </main>
  )
}
