import React, { useState } from 'react'
import { Camera, QrCode, ShoppingBag, ArrowRight, CheckCircle2, ShieldCheck, X, Sparkles } from 'lucide-react'
import { lookupBarcode, generateQris, submitTransaction } from '../services/hfeApi'
import { RetailProductPriceInfo, evaluateItemPrice } from '../hooks/useRetailPricing'

export interface ScanAndGoItem extends RetailProductPriceInfo {
  quantity: number
  subtotal: number
}

export const ScanAndGoView: React.FC = () => {
  const [cart, setCart] = useState<ScanAndGoItem[]>([])
  const [scanning, setScanning] = useState<boolean>(false)
  const [manualBarcode, setManualBarcode] = useState<string>('8999901')
  const [checkoutStep, setCheckoutStep] = useState<'scan' | 'cart' | 'qris' | 'exit-pass'>('scan')
  const [exitPassCode, setExitPassCode] = useState<string>('')
  const [qrisData, setQrisData] = useState<{ qris_string: string; qr_image_url: string } | null>(null)

  const handleSimulatedScan = async (barcodeToScan: string) => {
    const item = await lookupBarcode(barcodeToScan)
    if (item) {
      setCart(prev => {
        const existingIdx = prev.findIndex(i => i.barcode === item.barcode)
        if (existingIdx >= 0) {
          const updated = [...prev]
          const newQty = updated[existingIdx].quantity + 1
          const ev = evaluateItemPrice(newQty, item.retailPrice, item.wholesalePrice, item.wholesaleMinQty)
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: newQty,
            subtotal: ev.totalItemAmount
          }
          return updated
        }
        const ev = evaluateItemPrice(1, item.retailPrice, item.wholesalePrice, item.wholesaleMinQty)
        return [...prev, {
          id: item.productId,
          barcode: item.barcode,
          name: item.name,
          retailPrice: item.retailPrice,
          wholesalePrice: item.wholesalePrice,
          wholesaleMinQty: item.wholesaleMinQty,
          uom: item.uom,
          quantity: 1,
          subtotal: ev.totalItemAmount
        }]
      })
    } else {
      alert(`Barcode ${barcodeToScan} tidak ditemukan!`)
    }
  }

  const grandTotal = cart.reduce((sum, i) => sum + i.subtotal, 0)
  const totalItemCount = cart.reduce((sum, i) => sum + i.quantity, 0)

  const handleProceedCheckout = async () => {
    if (cart.length === 0) return
    const payload = {
      table_id: 'SCAN-GO-MOBILE-01',
      contact_id: 'CUST-MOBILE-USER',
      policy: 'pay-first' as const,
      items: cart.map(i => ({
        product_id: i.id,
        hfe_gl_account: '4-1000-SCAN-GO-SALES',
        qty: i.quantity,
        price: i.subtotal / i.quantity
      })),
      subtotal: grandTotal,
      tax_pb1_amount: 0,
      service_fee_amount: 0,
      discount_amount: 0,
      grand_total: grandTotal
    }

    const txRes = await submitTransaction(payload)
    const qrisRes = await generateQris(txRes.tx_id, grandTotal)
    setQrisData(qrisRes)
    setCheckoutStep('qris')
  }

  const handleConfirmQrisPayment = () => {
    const generatedPasskey = `EXIT-PASS-${Math.floor(100000 + Math.random() * 900000)}`
    setExitPassCode(generatedPasskey)
    setCheckoutStep('exit-pass')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-4 font-sans">
      {/* Mobile Ergonomics Container (360px-430px max-w) */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col min-h-[640px]">
        {/* Header */}
        <div className="bg-slate-800/90 px-4 py-3 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xs font-bold text-white">Scan & Go Self Checkout</h1>
              <p className="text-[10px] text-slate-400">Retail Fast-Pass Experience</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            {totalItemCount} Items
          </span>
        </div>

        {/* Camera Scanner Surface / Viewport */}
        {checkoutStep === 'scan' && (
          <div className="flex-1 p-4 flex flex-col justify-between space-y-4">
            <div className="relative aspect-square w-full bg-black/60 rounded-2xl border-2 border-dashed border-amber-500/60 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-rose-500 animate-pulse shadow-[0_0_8px_#f43f5e]" />
              <Camera className="w-12 h-12 text-slate-500 mb-2 animate-bounce" />
              <p className="text-xs text-slate-300 font-semibold">Arahkan Kamera HP ke Barcode Produk</p>
              <p className="text-[10px] text-slate-500">Scan otomatis terdeteksi realtime</p>

              <button
                onClick={() => handleSimulatedScan('8999901')}
                className="mt-4 px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" /> Simulasi Scan Minyak Rose Brand
              </button>
            </div>

            {/* Manual Barcode Input Fallback */}
            <div className="space-y-2">
              <label className="text-[11px] text-slate-400">Atau Masukkan Barcode Secara Manual:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={() => handleSimulatedScan(manualBarcode)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
                >
                  Tambah
                </button>
              </div>
            </div>

            {/* Cart Drawer Button */}
            {cart.length > 0 && (
              <button
                onClick={() => setCheckoutStep('cart')}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-2xl text-xs flex items-center justify-between px-4 transition-all shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Lihat Keranjang Belanja ({totalItemCount})</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            )}
          </div>
        )}

        {/* Cart Review Step */}
        {checkoutStep === 'cart' && (
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">Ringkasan Keranjang Scan & Go</h2>
                <button onClick={() => setCheckoutStep('scan')} className="text-xs text-amber-400 hover:underline">
                  + Scan Barang Lagi
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.barcode} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-white">{item.name}</h3>
                      <p className="text-[10px] text-slate-400">Qty: {item.quantity} x Rp {item.retailPrice.toLocaleString('id-ID')}</p>
                    </div>
                    <span className="text-xs font-bold text-amber-400 font-mono">Rp {item.subtotal.toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-3">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Total Belanja:</span>
                <span className="font-bold text-amber-400 font-mono text-sm">Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>
              <button
                onClick={handleProceedCheckout}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" /> Bayar QRIS Instant
              </button>
            </div>
          </div>
        )}

        {/* QRIS Step */}
        {checkoutStep === 'qris' && qrisData && (
          <div className="flex-1 p-6 flex flex-col items-center justify-between text-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-white">Pembayaran QRIS Scan & Go</h2>
              <p className="text-xs text-slate-400">Scan QR Code dengan GoPay, OVO, Dana, atau BCA</p>
            </div>

            <div className="p-4 bg-white rounded-2xl shadow-xl flex flex-col items-center">
              <QrCode className="w-36 h-36 text-slate-900" />
              <span className="text-[10px] font-mono text-slate-600 mt-2">NMID: ID10203040506</span>
            </div>

            <div className="text-xs font-mono font-bold text-amber-400">
              Total: Rp {grandTotal.toLocaleString('id-ID')}
            </div>

            <button
              onClick={handleConfirmQrisPayment}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Konfirmasi Bayar & Ambil Exit Pass
            </button>
          </div>
        )}

        {/* Exit Pass Step */}
        {checkoutStep === 'exit-pass' && (
          <div className="flex-1 p-6 flex flex-col items-center justify-between text-center space-y-4">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-sm font-bold text-white">Pembayaran Berhasil!</h2>
              <p className="text-xs text-slate-400">Tunjukkan Pass Tiket ini ke Petugas Kasir / Auto Gate Exit</p>
            </div>

            <div className="w-full p-4 bg-slate-950 border border-emerald-500/40 rounded-2xl space-y-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Digital Exit Pass Passkey</span>
              <p className="text-lg font-mono font-bold text-emerald-400 tracking-wider">{exitPassCode}</p>
              <div className="pt-2 border-t border-slate-800 flex justify-center">
                <QrCode className="w-20 h-20 text-slate-300" />
              </div>
            </div>

            <button
              onClick={() => {
                setCart([])
                setCheckoutStep('scan')
              }}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-xs"
            >
              Belanja Lagi
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
