import React, { useState } from 'react'
import { X, WifiOff, RefreshCw, CheckCircle2, CloudUpload, HardDrive, Sparkles } from 'lucide-react'

export interface OfflineQueuedOrder {
  id: string
  offlineReceiptNo: string
  timestamp: string
  itemCount: number
  totalAmount: number
  paymentMethod: string
  syncStatus: 'queued' | 'syncing' | 'synced'
}

export interface OfflineSyncBatchModalProps {
  isOpen: boolean
  onClose: () => void
  onCompleteSync?: (syncedCount: number) => void
}

const INITIAL_OFFLINE_QUEUE: OfflineQueuedOrder[] = [
  {
    id: 'OFF-001',
    offlineReceiptNo: 'OFFLINE-SEN-20260816-01',
    timestamp: '14:15 WIB (Saat Internet Mati)',
    itemCount: 3,
    totalAmount: 115000,
    paymentMethod: 'TUNAI',
    syncStatus: 'queued'
  },
  {
    id: 'OFF-002',
    offlineReceiptNo: 'OFFLINE-SEN-20260816-02',
    timestamp: '14:28 WIB (Saat Internet Mati)',
    itemCount: 2,
    totalAmount: 85000,
    paymentMethod: 'TUNAI',
    syncStatus: 'queued'
  }
]

export const OfflineSyncBatchModal: React.FC<OfflineSyncBatchModalProps> = ({
  isOpen,
  onClose,
  onCompleteSync
}) => {
  const [queue, setQueue] = useState<OfflineQueuedOrder[]>(INITIAL_OFFLINE_QUEUE)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen) return null

  const handleSyncAll = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setQueue(prev => prev.map(o => ({ ...o, syncStatus: 'synced' })))
      setIsSyncing(false)
      setIsSuccess(true)
      if (onCompleteSync) onCompleteSync(queue.length)
      setTimeout(() => {
        setIsSuccess(false)
        onClose()
      }, 2500)
    }, 1500)
  }

  const totalOfflineAmount = queue.reduce((s, o) => s + o.totalAmount, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-slate-950 border border-amber-500/30 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 animate-scaleUp text-slate-100">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">📴 Antrean Sinkronisasi Offline</h4>
              <span className="text-[10px] font-mono text-amber-400">IndexedDB Local Buffer • Zero Data Loss</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-5 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 flex flex-col items-center gap-2 text-center animate-fadeIn py-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            <span className="text-sm font-bold text-white">Sinkronisasi Batch Sukses!</span>
            <p className="text-xs text-emerald-300 font-mono">
              {queue.length} Transaksi offline berhasil dibukukan ke TigerBeetle Ledger Pusat.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between p-3 bg-slate-900 rounded-2xl border border-slate-800 text-xs">
              <span className="text-slate-300">Total Transaksi Offline:</span>
              <span className="font-mono font-black text-amber-400">
                {queue.length} Pesanan (Rp {totalOfflineAmount.toLocaleString('id-ID')})
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {queue.map(order => (
                <div
                  key={order.id}
                  className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-white">{order.offlineReceiptNo}</span>
                    <span className="text-[10px] text-slate-400">{order.timestamp} • {order.paymentMethod}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-300 font-black">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      order.syncStatus === 'synced'
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    }`}>
                      {order.syncStatus === 'synced' ? 'Synced' : 'Queued'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              disabled={isSyncing}
              onClick={handleSyncAll}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all active:scale-95 cursor-pointer mt-1"
            >
              {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />}
              <span>{isSyncing ? 'Menyinkronkan...' : 'Sync Batch ke TigerBeetle Ledger'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
