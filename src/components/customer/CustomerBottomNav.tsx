import React from 'react'
import { Utensils, ReceiptText } from 'lucide-react'
import { CafeThemeConfig } from '../../types/pos'

export interface CustomerBottomNavProps {
  activeTab: 'menu' | 'orders'
  onSelectTab: (tab: 'menu' | 'orders') => void
  activeOrderCount?: number
  activeTheme: CafeThemeConfig
}

export const CustomerBottomNav: React.FC<CustomerBottomNavProps> = ({
  activeTab,
  onSelectTab,
  activeOrderCount = 0,
  activeTheme
}) => {
  const isLight = activeTheme.mode === 'light'
  const navBg = isLight ? '#ffffff' : '#0f172a'
  const navBorder = isLight ? '#e2e8f0' : '#1e293b'
  const activeColor = activeTheme.primaryAccentHex || '#d97706'
  const inactiveColor = isLight ? '#94a3b8' : '#64748b'

  return (
    <nav
      className="shrink-0 z-40 border-t flex items-center justify-around h-16 px-4 bg-background select-none"
      style={{
        backgroundColor: navBg,
        borderColor: navBorder
      }}
      aria-label="Navigasi Menu Pelanggan"
    >
      {/* 1. TAB MENU */}
      <button
        type="button"
        onClick={() => onSelectTab('menu')}
        className={`flex-1 flex flex-col items-center justify-center gap-1 h-full transition-all active:scale-95 cursor-pointer ${
          activeTab === 'menu' ? 'font-bold' : 'font-medium'
        }`}
        style={{ color: activeTab === 'menu' ? activeColor : inactiveColor }}
      >
        <div className="relative">
          <Utensils className="w-5 h-5" />
        </div>
        <span className="text-[11px] tracking-tight leading-none">Menu</span>
      </button>

      {/* 2. TAB ORDER LIST */}
      <button
        type="button"
        onClick={() => onSelectTab('orders')}
        className={`flex-1 flex flex-col items-center justify-center gap-1 h-full transition-all active:scale-95 cursor-pointer ${
          activeTab === 'orders' ? 'font-bold' : 'font-medium'
        }`}
        style={{ color: activeTab === 'orders' ? activeColor : inactiveColor }}
      >
        <div className="relative">
          <ReceiptText className="w-5 h-5" />
          {activeOrderCount > 0 && (
            <span
              className="absolute -top-1 -right-2 text-[9px] font-mono font-bold text-white px-1.5 py-0.2 rounded-full shadow-xs"
              style={{ backgroundColor: activeColor }}
            >
              {activeOrderCount}
            </span>
          )}
        </div>
        <span className="text-[11px] tracking-tight leading-none">Order List</span>
      </button>
    </nav>
  )
}
