import React, { useState } from 'react'
import {
  ChevronDown, MapPin, Wifi, Lock, Copy, Check, Instagram, MessageCircle, Share2
} from 'lucide-react'
import { CafeThemeConfig } from '../../types/pos'

export interface MerchantSocialAndHoursSectionProps {
  modalBg: string
  subCardBorder: string
  secondaryTextColor: string
  textColor: string
  customerTheme: CafeThemeConfig
  isLight: boolean
  wifiAccessPolicy?: string
  wifiSsid: string
  wifiPassword: string
  hasPaidOrder: boolean
  weeklySchedule: { day: string; hours: string; isToday: boolean }[]
  onShareLandingPage: () => void
  copiedShareLink: boolean
}

export const MerchantSocialAndHoursSection: React.FC<MerchantSocialAndHoursSectionProps> = ({
  modalBg,
  subCardBorder,
  secondaryTextColor,
  textColor,
  customerTheme,
  isLight,
  wifiAccessPolicy,
  wifiSsid,
  wifiPassword,
  hasPaidOrder,
  weeklySchedule,
  onShareLandingPage,
  copiedShareLink
}) => {
  const [showHoursSchedule, setShowHoursSchedule] = useState(false)
  const [copiedWifi, setCopiedWifi] = useState(false)

  const handleCopyWifi = (pass: string) => {
    navigator.clipboard?.writeText(pass)
    setCopiedWifi(true)
    setTimeout(() => setCopiedWifi(false), 2000)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* OPENING STATUS BADGE */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold" style={{ color: textColor }}>
          Jam Operasional:
        </span>
        <button
          type="button"
          onClick={() => setShowHoursSchedule(!showHoursSchedule)}
          className="text-[10px] text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 active:bg-emerald-500/30 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 transition-all touch-manipulation cursor-pointer"
          title="Sentuh untuk lihat jadwal buka 7 hari"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Buka • 07:00 - 23:30</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${showHoursSchedule ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* EXPANDABLE 7-DAY SCHEDULE ACCORDION */}
      {showHoursSchedule && (
        <div
          className="border rounded-xl p-2.5 flex flex-col gap-1 text-[11px] font-mono animate-fadeIn"
          style={{ backgroundColor: modalBg, borderColor: subCardBorder }}
        >
          <span className="text-[10px] uppercase tracking-wider font-sans font-bold mb-0.5" style={{ color: secondaryTextColor }}>
            Jadwal Jam Operasional Outlet:
          </span>
          {weeklySchedule.map((schedule, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between px-2 py-1 rounded-lg ${
                schedule.isToday
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold border border-amber-500/30'
                  : ''
              }`}
              style={!schedule.isToday ? { color: secondaryTextColor } : undefined}
            >
              <span>{schedule.day} {schedule.isToday && '👈 (Hari Ini)'}</span>
              <span>{schedule.hours}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-1.5 text-xs" style={{ color: secondaryTextColor }}>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span style={{ color: textColor }}>Jl. Senopati Raya No. 42, Kebayoran Baru, Jakarta Selatan</span>
        </div>

        {wifiAccessPolicy !== 'disabled' && (
          (wifiAccessPolicy === 'always_visible' || hasPaidOrder) ? (
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl border" style={{ backgroundColor: modalBg, borderColor: subCardBorder }}>
              <div className="flex items-center gap-2 min-w-0">
                <Wifi className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="truncate">WiFi: <strong className="font-mono" style={{ color: textColor }}>{wifiSsid}</strong> (Pass: <strong className="text-amber-500 font-mono">{wifiPassword}</strong>)</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyWifi(wifiPassword)}
                className="text-[10px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1 transition-all active:scale-95 shrink-0 shadow-sm cursor-pointer"
                style={{
                  backgroundColor: copiedWifi ? '#10b981' : customerTheme.primaryAccentHex,
                  color: isLight ? '#ffffff' : '#020617',
                  borderColor: copiedWifi ? '#10b981' : customerTheme.primaryAccentHex
                }}
                title="Salin Password WiFi"
              >
                {copiedWifi ? <><Check className="w-3 h-3" /><span>Tersalin!</span></> : <><Copy className="w-3 h-3" /><span>Salin</span></>}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-2 rounded-xl border opacity-90" style={{ backgroundColor: modalBg, borderColor: subCardBorder }}>
              <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>🔒 WiFi: <strong className="font-mono" style={{ color: textColor }}>{wifiSsid}</strong> (Password terbuka setelah pesanan lunas)</span>
            </div>
          )
        )}
      </div>

      {/* UNIFIED 1-ROW SOCIAL MEDIA & SHARE BAR */}
      <div className="pt-2.5 border-t grid grid-cols-4 gap-1.5" style={{ borderColor: subCardBorder }}>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="border text-[11px] font-bold py-2 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all touch-manipulation active:scale-95 cursor-pointer"
          style={{ backgroundColor: modalBg, borderColor: subCardBorder, color: textColor }}
          title="Kunjungi Instagram"
        >
          <Instagram className="w-4 h-4 text-rose-500 shrink-0" />
          <span className="text-[10px]">Instagram</span>
        </a>

        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noreferrer"
          className="border text-[11px] font-bold py-2 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all touch-manipulation active:scale-95 cursor-pointer"
          style={{ backgroundColor: modalBg, borderColor: subCardBorder, color: textColor }}
          title="Chat WhatsApp Cafe"
        >
          <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-[10px]">WhatsApp</span>
        </a>

        <button
          type="button"
          onClick={() => alert('Membuka Google Maps lokasi Kopitiam Senopati...')}
          className="border text-[11px] font-bold py-2 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all touch-manipulation active:scale-95 cursor-pointer"
          style={{ backgroundColor: modalBg, borderColor: subCardBorder, color: textColor }}
          title="Pin Lokasi Google Maps"
        >
          <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="text-[10px]">Lokasi</span>
        </button>

        <button
          type="button"
          onClick={onShareLandingPage}
          className="border text-[11px] font-bold py-2 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all touch-manipulation active:scale-95 shadow cursor-pointer"
          style={{
            backgroundColor: copiedShareLink ? '#10b981' : customerTheme.primaryAccentHex,
            color: isLight ? '#ffffff' : '#020617',
            borderColor: customerTheme.primaryAccentHex
          }}
          title="Bagikan Landing Page Merchant"
        >
          {copiedShareLink ? (
            <>
              <Check className="w-4 h-4 shrink-0" />
              <span className="text-[10px]">Tersalin!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 shrink-0" />
              <span className="text-[10px]">Bagikan</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
