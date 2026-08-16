import React, { useState } from 'react'
import { Sparkles, ShoppingCart, CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react'
import { MenuItem } from '../types/pos'

export interface KioskSelfServiceViewProps {
  productCatalog: MenuItem[]
  onCompleteKioskOrder: (cart: Array<{ name: string; qty: number; price: number }>) => void
}

export const KioskSelfServiceView: React.FC<KioskSelfServiceViewProps> = ({
  productCatalog,
  onCompleteKioskOrder
}) => {
  const [kioskCart, setKioskCart] = useState<Array<{ name: string; qty: number; price: number }>>([])
  const [isOrderFinished, setIsOrderFinished] = useState(false)

  const addItemToKioskCart = (item: MenuItem) => {
    setKioskCart((prev) => {
      const existing = prev.find((i) => i.name === item.name)
      if (existing) {
        return prev.map((i) => (i.name === item.name ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...prev, { name: item.name, qty: 1, price: item.price }]
    })
  }

  const subtotal = kioskCart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const pb1Tax = Math.round(subtotal * 0.1)
  const grandTotal = subtotal + pb1Tax

  const handleKioskCheckout = () => {
    onCompleteKioskOrder(kioskCart)
    setIsOrderFinished(true)
    setTimeout(() => {
      setKioskCart([])
      setIsOrderFinished(false)
    }, 4000)
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col p-4 sm:p-8 max-w-5xl mx-auto w-full select-none">
      {/* KIOSK HEADER BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between shadow-2xl mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">Kios Sentuh Mandiri (Self-Service Kiosk)</h1>
            <p className="text-xs text-slate-400">Silakan sentuh menu di bawah untuk memesan makanan & minuman Anda</p>
          </div>
        </div>
      </div>

      {isOrderFinished ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 text-center animate-in zoom-in-95">
          <CheckCircle2 className="w-20 h-20 text-emerald-400 mb-4 animate-bounce" />
          <h2 className="text-2xl font-black text-white">Pesanan Anda Berhasil Diterima!</h2>
          <p className="text-slate-400 text-sm mt-2 max-w-md">
            Struk & nomor antrean telah dicetak. Silakan ambil pesanan Anda di konter saat nomor Anda dipanggil.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          {/* CATALOG GRID */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto max-h-[70vh] pr-1">
            {productCatalog.map((item) => (
              <div
                key={item.id}
                onClick={() => addItemToKioskCart(item)}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95"
              >
                <div>
                  <h3 className="text-sm font-bold text-white leading-snug">{item.name}</h3>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{item.category}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    Rp {item.price.toLocaleString('id-ID')}
                  </span>
                  <span className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                    +
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* CART SIDEBAR */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-xl">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <ShoppingCart className="w-4 h-4 text-amber-400" /> Ringkasan Pesanan Anda
              </h2>
              <div className="flex flex-col gap-2 my-4 max-h-60 overflow-y-auto">
                {kioskCart.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-8">Keranjang Anda masih kosong</p>
                ) : (
                  kioskCart.map((i, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60">
                      <div>
                        <span className="text-slate-200 font-medium">{i.name}</span>
                        <span className="text-slate-400 block text-[10px]">x{i.qty}</span>
                      </div>
                      <span className="font-mono text-emerald-400 font-bold">
                        Rp {(i.price * i.qty).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 flex flex-col gap-3">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Pajak PB1 (10%)</span>
                <span className="font-mono">Rp {pb1Tax.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white border-t border-slate-800/80 pt-2">
                <span>Total Tagihan</span>
                <span className="font-mono text-amber-400 text-base">Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>

              <button
                type="button"
                disabled={kioskCart.length === 0}
                onClick={handleKioskCheckout}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl"
              >
                <CreditCard className="w-4 h-4" /> Bayar Sekarang (QRIS / EDC) <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
