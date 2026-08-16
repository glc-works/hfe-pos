import React, { useState } from 'react'
import { X, Navigation, Phone, Camera, CheckCircle2, MapPin, PackageCheck, AlertCircle, Sparkles } from 'lucide-react'
import { DeliveryTask } from '../../types/pos'

export interface MiniAppCourierRunnerModalProps {
  isOpen: boolean
  onClose: () => void
}

const INITIAL_DELIVERY_TASKS: DeliveryTask[] = [
  {
    id: 'TSK-DELIV-01',
    orderId: 'ORD-8821',
    customerName: 'Dian Permata',
    customerPhone: '081298765432',
    deliveryAddress: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan',
    itemsSummary: '2x Espresso Aren Latte (Oat Milk), 1x Truffle Fries',
    totalAmount: 98900,
    paymentStatus: 'PAID',
    status: 'in_transit',
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
    assignedCourierName: 'Budi Santoso',
    estimatedArrivalMinutes: 25
  }
]

export const MiniAppCourierRunnerModal: React.FC<MiniAppCourierRunnerModalProps> = ({ isOpen, onClose }) => {
  const [tasks, setTasks] = useState<DeliveryTask[]>(INITIAL_DELIVERY_TASKS)
  const [podPhotoUploaded, setPodPhotoUploaded] = useState<Record<string, boolean>>({})
  const [completedSuccessMsg, setCompletedSuccessMsg] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSimulatePhotoPOD = (taskId: string) => {
    setPodPhotoUploaded(prev => ({ ...prev, [taskId]: true }))
  }

  const handleCompleteDelivery = (taskId: string, orderId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'delivered' } : t))
    setCompletedSuccessMsg(`Pesanan ${orderId} berhasil diserahkan ke pelanggan! Laporan POD tersimpan di sistem.`)
    setTimeout(() => setCompletedSuccessMsg(null), 3500)
  }

  const openGoogleMaps = (address: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank')
  }

  const openWhatsApp = (phone: string, orderId: string) => {
    const cleanPhone = phone.replace(/^0/, '62')
    const msg = encodeURIComponent(`Halo Kak! Saya kurir dari Kopitiam Senopati sedang mengantar pesanan ${orderId}.`)
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-950 border border-amber-500/30 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto animate-scaleUp text-slate-100">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">🛵 Kurir Delivery Runner Companion</h4>
              <span className="text-[10px] font-mono text-amber-400">Kopitiam Senopati • Self-Delivery Dispatch</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
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
            const isDelivered = task.status === 'delivered'
            const hasPhoto = podPhotoUploaded[task.id]

            return (
              <div
                key={task.id}
                className={`rounded-2xl p-4 border flex flex-col gap-3 transition-all ${
                  isDelivered
                    ? 'bg-slate-900/40 border-slate-800 opacity-60'
                    : 'bg-slate-900/90 border-slate-700 shadow-lg'
                }`}
              >
                {/* TOP BAR */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                      {task.orderId}
                    </span>
                    <span className="text-xs font-bold text-white">{task.customerName}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                    isDelivered
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
                  }`}>
                    {isDelivered ? '✅ Selesai Diantar' : `🛵 Sedang Diantar (~${task.estimatedArrivalMinutes}m)`}
                  </span>
                </div>

                {/* ADDRESS & ITEMS */}
                <div className="flex flex-col gap-1.5 text-xs">
                  <div className="flex items-start gap-1.5 text-slate-300">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{task.deliveryAddress}</span>
                  </div>
                  <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                    <strong className="text-slate-300">Item: </strong>{task.itemsSummary}
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono pt-1">
                    <span className="text-slate-400">Tagihan:</span>
                    <span className="font-black text-amber-300">
                      Rp {task.totalAmount.toLocaleString('id-ID')} ({task.paymentStatus === 'PAID' ? '💳 Lunas QRIS' : '💵 Tagih Tunai COD'})
                    </span>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                {!isDelivered && (
                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => openGoogleMaps(task.deliveryAddress)}
                        className="py-2 px-3 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Buka GMaps</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openWhatsApp(task.customerPhone, task.orderId)}
                        className="py-2 px-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Chat WhatsApp</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSimulatePhotoPOD(task.id)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          hasPhoto
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                            : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 cursor-pointer'
                        }`}
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{hasPhoto ? '📸 Foto POD Terlampir' : 'Ambil Foto POD'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCompleteDelivery(task.id, task.orderId)}
                        className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all active:scale-95 cursor-pointer"
                      >
                        <PackageCheck className="w-4 h-4" />
                        <span>Selesai Antar</span>
                      </button>
                    </div>
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
