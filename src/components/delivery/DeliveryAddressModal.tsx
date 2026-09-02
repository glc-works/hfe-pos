import React, { useState } from 'react'
import { X, Truck, MapPin, User, Phone, CheckCircle2, ShieldCheck } from 'lucide-react'

export interface DeliveryDetails {
  fulfillmentMode: 'dine_in' | 'takeaway' | 'self_delivery'
  recipientName: string
  phone: string
  address: string
  unitNotes?: string
  distanceKm: number
  deliveryFee: number
  isFreeDelivery: boolean
}

interface DeliveryAddressModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (details: DeliveryDetails) => void
  orderSubtotal?: number
}

export const DeliveryAddressModal: React.FC<DeliveryAddressModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  orderSubtotal = 75000,
}) => {
  const [fulfillmentMode, setFulfillmentMode] = useState<'dine_in' | 'takeaway' | 'self_delivery'>('self_delivery')
  const [recipientName, setRecipientName] = useState<string>('')
  const [phone, setPhone] = useState<string>('6281299887766')
  const [address, setAddress] = useState<string>('')
  const [unitNotes, setUnitNotes] = useState<string>('')
  const [distanceKm, setDistanceKm] = useState<number>(1.5)

  if (!isOpen) return null

  const FREE_DELIVERY_THRESHOLD = 100000
  const isFreeDelivery = orderSubtotal >= FREE_DELIVERY_THRESHOLD
  const deliveryFee = fulfillmentMode === 'self_delivery' ? (isFreeDelivery ? 0 : 5000) : 0

  const handleConfirm = () => {
    onConfirm({
      fulfillmentMode,
      recipientName: recipientName || 'Pelanggan Delivery',
      phone,
      address: address || 'Alamat Toko Sekitar (Radius < 3 KM)',
      unitNotes,
      distanceKm,
      deliveryFee,
      isFreeDelivery,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 flex flex-col gap-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3 pr-8">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Metode Pesanan & Delivery Kurir Toko</h3>
            <p className="text-xs text-slate-400">Pengantaran mandiri radius 0-3 KM & integrasi WhatsApp</p>
          </div>
        </div>

        {/* FULFILLMENT MODE SWITCHER */}
        <div className="grid grid-cols-3 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setFulfillmentMode('dine_in')}
            className={`py-2 rounded-lg transition-all ${
              fulfillmentMode === 'dine_in' ? 'bg-indigo-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dine-In
          </button>
          <button
            onClick={() => setFulfillmentMode('takeaway')}
            className={`py-2 rounded-lg transition-all ${
              fulfillmentMode === 'takeaway' ? 'bg-indigo-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Takeaway
          </button>
          <button
            onClick={() => setFulfillmentMode('self_delivery')}
            className={`py-2 rounded-lg transition-all ${
              fulfillmentMode === 'self_delivery' ? 'bg-indigo-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Kurir Toko (0-3 KM)
          </button>
        </div>

        {/* ADDRESS FORM FOR SELF DELIVERY */}
        {fulfillmentMode === 'self_delivery' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" /> Nama Penerima Paket:
              </label>
              <input
                type="text"
                placeholder="Contoh: Bpk. Bambang Tri"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> Nomor WhatsApp Aktif:
              </label>
              <input
                type="text"
                placeholder="62812xxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> Alamat Lengkap Pengantaran:
              </label>
              <textarea
                placeholder="Jl. Melati No. 42, Kelurahan, Kecamatan, Kota..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white h-20 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Patokan / No. Unit (cth: Lantai 3)"
                value={unitNotes}
                onChange={(e) => setUnitNotes(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs">
                <span className="text-slate-400 text-[10px]">Radius:</span>
                <span className="font-mono font-bold text-amber-400">{distanceKm} KM</span>
              </div>
            </div>

            {/* DELIVERY FEE BADGE */}
            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-3 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-300 font-bold block">Ongkos Kirim Kurir Toko:</span>
                <span className="text-[10px] text-slate-400">
                  {isFreeDelivery
                    ? 'Promo Bebas Ongkir (Order > Rp 100k)'
                    : 'Flat Fee Pengantaran Radius 0-3 KM'}
                </span>
              </div>
              <span className={`font-mono font-bold text-base ${isFreeDelivery ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isFreeDelivery ? 'GRATIS!' : `Rp ${deliveryFee.toLocaleString('id-ID')}`}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleConfirm}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
        >
          <ShieldCheck className="w-4 h-4" /> Simpan Details Delivery & Lanjutkan
        </button>
      </div>
    </div>
  )
}
