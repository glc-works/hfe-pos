import React, { useState } from 'react'
import { 
  X, Navigation, Phone, Camera, CheckCircle2, MapPin, PackageCheck, 
  AlertCircle, Sparkles, MessageSquare, ArrowRight, Upload, Check 
} from 'lucide-react'
import { DeliveryTask } from '../../types/pos'

export interface MiniAppCourierRunnerModalProps {
  isOpen: boolean
  onClose: () => void
}

export type CourierMilestone = 'assigned' | 'picked_up' | 'arrived' | 'delivered'

export interface EnhancedDeliveryTask extends DeliveryTask {
  milestone: CourierMilestone
  podPhotoUrl?: string
}

const INITIAL_DELIVERY_TASKS: EnhancedDeliveryTask[] = [
  {
    id: 'TSK-DELIV-01',
    orderId: 'ORD-8821',
    customerName: 'Dian Permata',
    customerPhone: '081298765432',
    deliveryAddress: 'Jl. Melati No. 45, Kebayoran, Jakarta',
    itemsSummary: '2x Espresso Aren Latte (Oat Milk), 1x Truffle Fries',
    totalAmount: 98900,
    paymentStatus: 'PAID',
    status: 'in_transit',
    milestone: 'picked_up',
    assignedCourierName: 'Budi Santoso',
    estimatedArrivalMinutes: 8
  },
  {
    id: 'TSK-DELIV-02',
    orderId: 'ORD-8824',
    customerName: 'Hendro Wijaya',
    customerPhone: '081377889900',
    deliveryAddress: 'Graha CIMB Niaga Lt. 12, SCBD Jakarta',
    itemsSummary: '4x Cold Brew Botol 1 Liter',
    totalAmount: 280000,
    paymentStatus: 'COD_UNPAID',
    status: 'assigned',
    milestone: 'assigned',
    assignedCourierName: 'Budi Santoso',
    estimatedArrivalMinutes: 25
  }
]

export const MiniAppCourierRunnerModal: React.FC<MiniAppCourierRunnerModalProps> = ({ isOpen, onClose }) => {
  const [tasks, setTasks] = useState<EnhancedDeliveryTask[]>(INITIAL_DELIVERY_TASKS)
  const [completedSuccessMsg, setCompletedSuccessMsg] = useState<string | null>(null)

  if (!isOpen) return null

  const handleUpdateMilestone = (taskId: string, newMilestone: CourierMilestone) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updated = { ...t, milestone: newMilestone }
          if (newMilestone === 'delivered') {
            updated.status = 'delivered'
            updated.podPhotoUrl = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300'
          } else if (newMilestone === 'picked_up') {
            updated.status = 'in_transit'
          }
          return updated
        }
        return t
      })
    )

    if (newMilestone === 'picked_up') {
      setCompletedSuccessMsg('📦 Milestone 1: Pesanan berhasil diambil dari barista!')
    } else if (newMilestone === 'arrived') {
      setCompletedSuccessMsg('📍 Milestone 2: Status tiba di lokasi tercatat!')
    } else if (newMilestone === 'delivered') {
      setCompletedSuccessMsg('🎉 Milestone 3: Pesanan selesai diantar & Bukti POD terunggah!')
    }
    setTimeout(() => setCompletedSuccessMsg(null), 3000)
  }

  const openGoogleMapsDirection = (address: string) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`, '_blank')
  }

  const openWhatsAppCustomer = (phone: string, orderId: string, customerName: string) => {
    const cleanPhone = phone.replace(/^0/, '62')
    const msg = encodeURIComponent(
      `Halo Kak ${customerName}! Saya kurir toko sedang mengantar pesanan ${orderId}. Mohon ditunggu ya kak!`
    )
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto text-slate-100 animate-scaleUp">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <span>🛵 Kurir Toko & Bukti Antaran (POD)</span>
              </h4>
              <span className="text-[10px] font-mono text-indigo-300">
                In-House Fleet • Simple Milestone Dispatch
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {completedSuccessMsg && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{completedSuccessMsg}</span>
          </div>
        )}

        {/* TASK LIST */}
        <div className="flex flex-col gap-3.5">
          {tasks.map((task) => {
            const isDelivered = task.milestone === 'delivered'
            const isArrived = task.milestone === 'arrived'
            const isPickedUp = task.milestone === 'picked_up'

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col gap-3 ${
                  isDelivered
                    ? 'bg-slate-900/40 border-slate-800/80 opacity-75'
                    : 'bg-slate-900 border-indigo-500/40 shadow-lg'
                }`}
              >
                {/* TASK HEADER */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs text-indigo-300">{task.orderId}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isDelivered
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : isArrived
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      }`}>
                        {isDelivered ? '✅ SELESAI' : isArrived ? '📍 TIBA DI LOKASI' : isPickedUp ? '📦 SEDANG DIANTAR' : '⏳ MENUNGGU PICKUP'}
                      </span>
                    </div>
                    <h5 className="text-sm font-black text-white mt-1">{task.customerName}</h5>
                    <p className="text-xs text-slate-400 flex items-start gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span>{task.deliveryAddress}</span>
                    </p>
                  </div>
                </div>

                {/* ITEMS & PAYMENT */}
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex flex-col gap-1">
                  <span className="text-slate-300 font-medium">{task.itemsSummary}</span>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
                    <span>Tagihan: <strong className="text-white">Rp {task.totalAmount.toLocaleString('id-ID')}</strong></span>
                    <span className={`font-bold ${task.paymentStatus === 'PAID' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {task.paymentStatus === 'PAID' ? 'LUNAS (QRIS)' : 'BAYAR DITEMPAT (COD)'}
                    </span>
                  </div>
                </div>

                {/* QUICK ACTIONS: MAP DIRECTION & WHATSAPP */}
                {!isDelivered && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => openGoogleMapsDirection(task.deliveryAddress)}
                      className="py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow active:scale-[0.98] cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Buka Arah Maps ➔</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openWhatsAppCustomer(task.customerPhone, task.orderId, task.customerName)}
                      className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow active:scale-[0.98] cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat WhatsApp</span>
                    </button>
                  </div>
                )}

                {/* 3 LINEAR MILESTONE BUTTONS */}
                {!isDelivered ? (
                  <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                      Update Milestone Pengiriman:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleUpdateMilestone(task.id, 'picked_up')}
                        className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                          isPickedUp || isArrived
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        1. Ambil Barang
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateMilestone(task.id, 'arrived')}
                        className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                          isArrived
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        2. Tiba Lokasi
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateMilestone(task.id, 'delivered')}
                        className="py-2 px-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-bold border border-emerald-400 shadow flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
                      >
                        <Camera className="w-3 h-3" />
                        <span>3. Foto POD</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Pengiriman Selesai (POD Verified)</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">100% Complete</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
