import React from 'react'
import { Store, QrCode, Sparkles, CheckCircle, ShoppingBag } from 'lucide-react'
import { CartItem, HfeCompanyProfile } from '../types/pos'

export interface CustomerFacingDisplayViewProps {
  hfeCompanyProfile: HfeCompanyProfile
  cart?: CartItem[]
  rawSubtotal?: number
  calculatedPB1Tax?: number
  calculatedServiceFee?: number
  discountAmount?: number
  grandTotalBill?: number
  isPaid?: boolean
}

export const CustomerFacingDisplayView: React.FC<CustomerFacingDisplayViewProps> = ({
  hfeCompanyProfile,
  cart = [],
  rawSubtotal = 0,
  calculatedPB1Tax = 0,
  calculatedServiceFee = 0,
  discountAmount = 0,
  grandTotalBill = 0,
  isPaid = false,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between shadow-xl mb-6">
        <div className="flex items-center gap-4">
          <img
            src={hfeCompanyProfile.logoUrl || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100&h=100'}
            alt="Logo"
            className="w-14 h-14 rounded-2xl object-cover border border-amber-500/30"
          />
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{hfeCompanyProfile.brandName || 'Artisan Coffee & Resto'}</h1>
            <p className="text-xs text-amber-400 font-semibold">{hfeCompanyProfile.storefrontInfo?.tagline || 'Specialty Coffee & Kitchen'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-2xl text-xs font-bold text-amber-400">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Customer Facing Display (CFD Screen)</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Cart Items List (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col overflow-hidden">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <span>Rincian Pesanan Anda ({cart.reduce((s, i) => s + i.quantity, 0)} Item)</span>
          </h2>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
                <p className="text-sm font-medium">Kasir sedang menginput pesanan Anda...</p>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                      <p className="text-xs text-slate-400">Qty: {item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-amber-400">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Total & QRIS (1 Col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6">
          {isPaid ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl flex items-center justify-center text-emerald-400">
                <CheckCircle className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Pembayaran Sukses!</h3>
              <p className="text-xs text-slate-400 max-w-xs">Terima kasih atas kunjungan Anda di {hfeCompanyProfile.brandName}. Selamat menikmati!</p>
            </div>
          ) : (
            <>
              {/* Summary Calculations */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white mb-2">Ringkasan Pembayaran</h3>

                <div className="flex justify-between text-xs text-slate-400">
                  <span>Subtotal</span>
                  <span>Rp {rawSubtotal.toLocaleString('id-ID')}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-400 font-semibold">
                    <span>Diskon Promo</span>
                    <span>- Rp {discountAmount.toLocaleString('id-ID')}</span>
                  </div>
                )}

                {calculatedServiceFee > 0 && (
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Service Charge</span>
                    <span>Rp {calculatedServiceFee.toLocaleString('id-ID')}</span>
                  </div>
                )}

                {calculatedPB1Tax > 0 && (
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Pajak PB1 (10%)</span>
                    <span>Rp {calculatedPB1Tax.toLocaleString('id-ID')}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-base font-extrabold text-white">
                  <span>Grand Total</span>
                  <span className="text-amber-400 text-xl">Rp {grandTotalBill.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* QRIS Display Block */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-amber-500/30 text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-400">
                  <QrCode className="w-4 h-4" />
                  <span>Scan QRIS Untuk Bayar</span>
                </div>
                <div className="bg-white p-3 rounded-xl inline-block shadow-inner">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=00020101021226670016ID.CO.QRIS.HFE.POS`}
                    alt="QRIS Code"
                    className="w-36 h-36 mx-auto"
                  />
                </div>
                <p className="text-[10px] text-slate-400">Mendukung GoPay, OVO, Dana, ShopeePay, BCA, Mandiri & QRIS Bank</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
