import React, { useEffect, useState } from 'react'
import { flushManager, FlushStatusState } from '../../services/flushManager'
import { Wifi, WifiOff, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react'

export interface OfflineStatusBannerProps {
  className?: string
}

export const OfflineStatusBanner: React.FC<OfflineStatusBannerProps> = ({ className = '' }) => {
  const [status, setStatus] = useState<FlushStatusState>(flushManager.getStatus())

  useEffect(() => {
    const unsubscribe = flushManager.subscribe(setStatus)
    return () => unsubscribe()
  }, [])

  const handleManualFlush = async () => {
    await flushManager.flushPendingQueue()
  }

  // Do not render banner if online and no pending transactions
  if (status.isOnline && status.pendingCount === 0 && !status.isFlushing) {
    return null
  }

  return (
    <div
      aria-live="polite"
      className={`w-full py-2.5 px-4 text-xs md:text-sm font-medium transition-colors duration-200 shadow-sm border-b flex flex-wrap items-center justify-between gap-2 ${
        !status.isOnline
          ? 'bg-amber-500/15 border-amber-500/30 text-amber-900 dark:text-amber-200'
          : status.pendingCount > 0
          ? 'bg-sky-500/15 border-sky-500/30 text-sky-900 dark:text-sky-200'
          : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
      } ${className}`}
    >
      <div className="flex items-center gap-2 font-medium">
        {!status.isOnline ? (
          <>
            <WifiOff className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse shrink-0" />
            <span>Mode Offline Active — Transaksi tersimpan lokal di IndexedDB</span>
          </>
        ) : status.isFlushing ? (
          <>
            <RefreshCw className="w-4 h-4 text-sky-600 dark:text-sky-400 animate-spin shrink-0" />
            <span>Menyingkronkan transaksi offline ke server...</span>
          </>
        ) : status.pendingCount > 0 ? (
          <>
            <AlertTriangle className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <span>
              Koneksi terhubung. Tersisa <strong>{status.pendingCount}</strong> transaksi offline belum tersinkron.
            </span>
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Semua transaksi offline berhasil tersinkronisasi.</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {status.pendingCount > 0 && (
          <button
            type="button"
            onClick={handleManualFlush}
            disabled={status.isFlushing || !status.isOnline}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded font-medium text-xs transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${status.isFlushing ? 'animate-spin' : ''}`} />
            <span>{status.isFlushing ? 'Syncing...' : 'Flush Sekarang'}</span>
          </button>
        )}

        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-black/10 dark:bg-white/10">
          {status.isOnline ? (
            <>
              <Wifi className="w-3 h-3 text-emerald-500" /> ONLINE
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-amber-500" /> OFFLINE
            </>
          )}
        </span>
      </div>
    </div>
  )
}
