import React, { useState } from 'react'
import { X, Navigation, UserCheck, Send, ExternalLink, CheckCircle2, Clock, Phone, MapPin } from 'lucide-react'
import { DeliveryQueueItem, dispatchRunner, completeDelivery } from '../../services/hfeWorkflowsApi'

interface DeliveryDispatchModalProps {
  isOpen: boolean
  onClose: () => void
  deliveries?: DeliveryQueueItem[]
  bookId?: string
  onDeliveryUpdated?: () => void
}

const MOCK_DELIVERIES: DeliveryQueueItem[] = [
  {
    id: 'DEL-001',
    orderId: 'ORD-8801',
    customerName: 'Bambang Tri',
    phone: '6281299887766',
    address: 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan',
    unitNotes: 'Lantai 3, Unit 302',
    distanceKm: 1.2,
    deliveryFee: 5000,
    status: 'pending',
    provider: 'internal_runner',
    resiCode: 'RESI-SENOPATI-20260815-0042',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'DEL-002',
    orderId: 'ORD-8805',
    customerName: 'Dewi Lestari',
    phone: '6281355443322',
    address: 'Jl. Gunawarman No. 18, Jakarta Selatan',
    distanceKm: 2.1,
    deliveryFee: 5000,
    status: 'in_transit',
    runnerId: 'MEM-RUNNER-01',
    runnerName: 'Budi Santoso (Staff Runner)',
    provider: 'internal_runner',
    resiCode: 'RESI-SENOPATI-20260815-0043',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
]

export const DeliveryDispatchModal: React.FC<DeliveryDispatchModalProps> = ({
  isOpen,
  onClose,
  deliveries = MOCK_DELIVERIES,
  bookId = 'BOOK-CAFE-HQ-88',
  onDeliveryUpdated,
}) => {
  const [deliveryList, setDeliveryList] = useState<DeliveryQueueItem[]>(deliveries)
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string>(deliveries[0]?.id || '')
  const [selectedRunnerId, setSelectedRunnerId] = useState<string>('MEM-RUNNER-01')
  const [selectedRunnerName, setSelectedRunnerName] = useState<string>('Budi Santoso (Staff Runner)')
  const [selectedProvider, setSelectedProvider] = useState<DeliveryQueueItem['provider']>('internal_runner')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  if (!isOpen) return null

  const activeDelivery = deliveryList.find((d) => d.id === selectedDeliveryId) || deliveryList[0]

  const handleDispatch = async () => {
    if (!activeDelivery) return
    setIsSubmitting(true)
    try {
      await dispatchRunner(activeDelivery.id, selectedRunnerId, selectedRunnerName, bookId)
      setDeliveryList((prev) =>
        prev.map((d) =>
          d.id === activeDelivery.id
            ? { ...d, status: 'in_transit', runnerId: selectedRunnerId, runnerName: selectedRunnerName, provider: selectedProvider }
            : d
        )
      )
      if (onDeliveryUpdated) onDeliveryUpdated()
    } catch (err) {
      console.error('Dispatch error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleComplete = async () => {
    if (!activeDelivery) return
    setIsSubmitting(true)
    try {
      await completeDelivery(activeDelivery.id, 'paid', bookId)
      setDeliveryList((prev) =>
        prev.map((d) => (d.id === activeDelivery.id ? { ...d, status: 'delivered' } : d))
      )
      if (onDeliveryUpdated) onDeliveryUpdated()
    } catch (err) {
      console.error('Complete delivery error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendWaTracking = () => {
    if (!activeDelivery) return
    const trackingUrl = `https://hfe.togrow.id/resi/${activeDelivery.resiCode || 'RESI-SENOPATI-20260815-0042'}`
    const text = encodeURIComponent(
      `Halo Bpk/Ibu ${activeDelivery.customerName}, pesanan Hfe POS #${activeDelivery.orderId} sedang dikirim oleh kurir ${selectedRunnerName}. Lacak pengiriman secara live: ${trackingUrl}`
    )
    window.open(`https://wa.me/${activeDelivery.phone}?text=${text}`, '_blank')
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-5 sm:p-6 flex flex-col gap-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3 pr-8">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Store Dispatcher & Kurir Toko Roster</h3>
            <p className="text-xs text-slate-400">Penugasan kurir toko (Budi) / 3PL adapter & notifikasi WA tracking</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* QUEUE LIST */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-300">Antrean Order Delivery ({deliveryList.length}):</span>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-2 max-h-64 overflow-y-auto flex flex-col gap-2">
              {deliveryList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedDeliveryId(item.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col gap-1 text-xs ${
                    selectedDeliveryId === item.id
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-amber-400">{item.orderId}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        item.status === 'delivered'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : item.status === 'in_transit'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-200">{item.customerName}</span>
                  <span className="text-[10px] text-slate-400 line-clamp-1">{item.address}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DISPATCH ACTION CARD */}
          {activeDelivery && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
              <div className="border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-indigo-400 block">{activeDelivery.orderId}</span>
                <h4 className="text-sm font-bold text-white">{activeDelivery.customerName}</h4>
                <p className="text-xs text-slate-400 flex items-start gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  {activeDelivery.address}
                </p>
              </div>

              <div className="flex flex-col gap-1.5 text-xs">
                <label className="font-bold text-slate-300">Provider & Runner Roster:</label>
                <select
                  value={selectedRunnerId}
                  onChange={(e) => {
                    setSelectedRunnerId(e.target.value)
                    const runnerNames: Record<string, string> = {
                      'MEM-RUNNER-01': 'Budi Santoso (Staff Runner Toko)',
                      '3PL-GOSEND': 'GoSend Instant 3PL',
                      '3PL-GRAB': 'GrabExpress SameDay 3PL',
                    }
                    setSelectedRunnerName(runnerNames[e.target.value] || 'Staff Runner')
                  }}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="MEM-RUNNER-01">Budi Santoso (Staff Runner Toko 0-3 KM)</option>
                  <option value="3PL-GOSEND">GoSend Instant (Adapter 3PL API)</option>
                  <option value="3PL-GRAB">GrabExpress SameDay (Adapter 3PL API)</option>
                </select>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleDispatch}
                  disabled={isSubmitting || activeDelivery.status === 'in_transit' || activeDelivery.status === 'delivered'}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" /> 1-Tap Assign & Dispatch Kurir
                </button>

                <button
                  onClick={handleSendWaTracking}
                  className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-400" /> Kirim Link Live Tracking WA
                </button>

                {activeDelivery.status === 'in_transit' && (
                  <button
                    onClick={handleComplete}
                    disabled={isSubmitting}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Tandai Paket Telah Diterima (Selesai)
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
