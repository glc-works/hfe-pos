import React, { useState } from 'react'
import { Wifi, Copy, Check } from 'lucide-react'

export interface WifiAccessCelebrationBannerProps {
  wifiAccessPolicy: string
  hasPaidOrder: boolean
  wifiSsid: string
  wifiPassword: string
  isLight: boolean
  textColor: string
}

export const WifiAccessCelebrationBanner: React.FC<WifiAccessCelebrationBannerProps> = ({
  wifiAccessPolicy,
  hasPaidOrder,
  wifiSsid,
  wifiPassword,
  isLight,
  textColor,
}) => {
  const [copiedWifi, setCopiedWifi] = useState(false)

  if (wifiAccessPolicy === 'disabled' || (wifiAccessPolicy !== 'always_visible' && !hasPaidOrder)) {
    return null
  }

  const handleCopyWifi = (pass: string) => {
    navigator.clipboard?.writeText(pass)
    setCopiedWifi(true)
    setTimeout(() => setCopiedWifi(false), 2500)
  }

  return (
    <div 
      className="border rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-sm animate-fadeIn"
      style={{
        backgroundColor: isLight ? '#f0fdf4' : 'rgba(16, 185, 129, 0.08)',
        borderColor: isLight ? '#86efac' : 'rgba(16, 185, 129, 0.3)'
      }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0">
          <Wifi className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-emerald-600 dark:text-emerald-400">
            📶 Akses WiFi Kafe Terbuka
          </span>
          <p className="text-xs font-semibold truncate" style={{ color: textColor }}>
            SSID: <strong className="font-mono">{wifiSsid}</strong> • Password: <strong className="font-mono text-amber-500">{wifiPassword}</strong>
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => handleCopyWifi(wifiPassword)}
        className="text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all active:scale-95 shrink-0 self-end sm:self-auto shadow-sm"
        style={{
          backgroundColor: copiedWifi ? '#10b981' : (isLight ? '#ffffff' : '#0f172a'),
          borderColor: isLight ? '#86efac' : 'rgba(16, 185, 129, 0.4)',
          color: copiedWifi ? '#ffffff' : (isLight ? '#15803d' : '#34d399')
        }}
      >
        {copiedWifi ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Tersalin!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>Salin Password</span>
          </>
        )}
      </button>
    </div>
  )
}
