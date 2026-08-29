import React, { useState } from 'react'
import { Button, Badge } from '../../ui'
import { 
  Bell, X, Sun, Moon, Globe, AlertTriangle, CheckCircle2, 
  ArrowRight, Sparkles, ChefHat, Store, ShieldCheck, Clock
} from 'lucide-react'
import { useMerchantConfig } from '@/context/MerchantConfigContext'
import { useTranslation } from '@/context/LanguageContext'

export interface AttentionNotificationItem {
  id: string
  title: string
  subtitle: string
  timestamp: string
  severity: 'action_required' | 'info' | 'system'
  source: 'kds' | 'financial' | 'inventory' | 'core'
  actionLabel?: string
  onAction?: () => void
}

interface UnifiedAttentionCenterPopOverProps {
  isOpen: boolean
  onClose: () => void
  onNavigateToHub?: () => void
}

export const UnifiedAttentionCenterPopOver: React.FC<UnifiedAttentionCenterPopOverProps> = ({
  isOpen,
  onClose,
  onNavigateToHub
}) => {
  const { themeMode, toggleThemeMode } = useMerchantConfig()
  const { language, setLanguage, t } = useTranslation()
  const [activeFilter, setActiveFilter] = useState<'all' | 'action_required' | 'info' | 'system'>('all')

  if (!isOpen) return null

  const notifications: AttentionNotificationItem[] = [
    {
      id: 'notif-01',
      title: '🍳 Meja OUT-04 Siap Diantar',
      subtitle: '2x Espresso Aren Latte siap di pickup bar barista.',
      timestamp: '1m yang lalu',
      severity: 'action_required',
      source: 'kds',
      actionLabel: 'Tandai Selesai'
    },
    {
      id: 'notif-02',
      title: '⚠️ 3 Mutasi QRIS Butuh Pencocokan',
      subtitle: 'Mutasi BCA Merchant perlu Find & Match ke Buku Besar Hfe CORE.',
      timestamp: '5m yang lalu',
      severity: 'action_required',
      source: 'financial',
      actionLabel: 'Buka Rekonsiliasi'
    },
    {
      id: 'notif-03',
      title: '📦 Stok Biji Kopi Gayo Menipis',
      subtitle: 'Sisa stok gudang 850 gram (di bawah ambang batas 1.000g).',
      timestamp: '12m yang lalu',
      severity: 'action_required',
      source: 'inventory',
      actionLabel: 'Buat PO Gudang'
    },
    {
      id: 'notif-04',
      title: '✅ Shift Kasir #12 Berjalan Normal',
      subtitle: 'Kas awal Rp 500.000 tercatat di GL 1101 Kasir.',
      timestamp: '45m yang lalu',
      severity: 'info',
      source: 'core'
    },
    {
      id: 'notif-05',
      title: '🔗 TigerBeetle GL Live Sync Terhubung',
      subtitle: 'Posting mutasi realtime ke glc-works/headless-company-books aktif.',
      timestamp: '1j yang lalu',
      severity: 'system',
      source: 'core'
    }
  ]

  const filteredNotifs = notifications.filter((n) => {
    if (activeFilter === 'all') return true
    return n.severity === activeFilter
  })

  return (
    <div className="fixed sm:absolute inset-x-3 bottom-3 sm:inset-auto sm:top-full sm:right-0 sm:mt-2 w-auto sm:w-96 bg-card rounded-3xl sm:rounded-2xl border border-border shadow-2xl overflow-hidden z-50 animate-fadeIn font-sans flex flex-col max-h-[85dvh]">
      {/* 1. HEADER: 2-TIER SYSTEM CONTROLS & ATTENTION BADGE (Plan #825c) */}
      <div className="h-14 px-4 border-b border-border bg-muted/40 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-xs shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span>Attention Center</span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            </h4>
            <p className="text-[10px] text-muted-foreground leading-tight">
              3 Perlu Tindakan Segera
            </p>
          </div>
        </div>

        {/* System Quick Toggles (Theme & Language) */}
        <div className="flex items-center gap-1.5">
          {/* Day / Night 1-Tap Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleThemeMode}
            className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-xl text-muted-foreground hover:text-foreground"
            title="Ganti Mode Terang / Gelap"
          >
            {themeMode === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
          </Button>

          {/* ID / EN Language Toggle */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
            className="h-8 px-2 text-[11px] font-mono font-bold rounded-xl"
            title="Switch Language"
          >
            {language.toUpperCase()}
          </Button>

          {/* Close Button on Mobile */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="sm:hidden w-8 h-8 min-w-[32px] min-h-[32px] rounded-xl text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 2. FILTER STRIP (4 Standard Categories) */}
      <div className="px-3 py-2 border-b border-border/60 bg-muted/20 flex items-center gap-1 overflow-x-auto shrink-0">
        {[
          { key: 'all', label: 'Semua (5)' },
          { key: 'action_required', label: '🛑 Aksi (3)' },
          { key: 'info', label: 'ℹ️ Info' },
          { key: 'system', label: '⚙️ Sistem' }
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveFilter(tab.key as any)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 cursor-pointer ${
              activeFilter === tab.key
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. NOTIFICATION LIST BODY */}
      <div className="p-3 space-y-2 overflow-y-auto flex-1 text-xs">
        {filteredNotifs.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-2xl border transition-all ${
              item.severity === 'action_required'
                ? 'bg-amber-500/5 border-amber-500/30'
                : 'bg-background border-border/80'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <h5 className="font-bold text-foreground text-xs leading-snug">{item.title}</h5>
              <span className="text-[10px] text-muted-foreground font-mono shrink-0 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" /> {item.timestamp}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 leading-normal">
              {item.subtitle}
            </p>

            {item.actionLabel && (
              <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-end">
                <Button
                  variant={item.severity === 'action_required' ? 'amber' : 'outline'}
                  size="sm"
                  onClick={() => {
                    if (onNavigateToHub) onNavigateToHub()
                    onClose()
                  }}
                  className="h-7 px-3 text-[11px] rounded-lg font-bold"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 4. FOOTER LINK TO FULL ATTENTION HUB */}
      <div className="p-2.5 border-t border-border bg-muted/30 shrink-0">
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={() => {
            if (onNavigateToHub) onNavigateToHub()
            onClose()
          }}
          className="h-9 text-xs justify-center font-bold text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 border-amber-500/20"
        >
          <span>🔍 Buka Attention Center Lengkap ➔</span>
        </Button>
      </div>
    </div>
  )
}
