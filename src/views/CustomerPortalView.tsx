import React, { useState } from 'react'
import { 
  CreditCard, Receipt, Ticket, Tag, Sliders, ChevronLeft, Coffee,
  Sparkles, LogOut
} from 'lucide-react'
import { HfeCompanyProfile, CustomerPreferences } from '../types/pos'
import { HfeCardIdentityPassbook } from '../components/customer-portal/HfeCardIdentityPassbook'
import { CustomerOrdersHistoryTab } from '../components/customer-portal/CustomerOrdersHistoryTab'
import { CustomerTicketsWalletTab } from '../components/customer-portal/CustomerTicketsWalletTab'
import { CustomerVouchersTab } from '../components/customer-portal/CustomerVouchersTab'
import { CustomerPreferencesTab } from '../components/customer-portal/CustomerPreferencesTab'
import { CustomerAuthGate } from '../components/customer-portal/CustomerAuthGate'

export interface CustomerPortalViewProps {
  hfeCompanyProfile: HfeCompanyProfile
  isCustomerSessionActive?: boolean
  onLoginSuccess?: (phone: string, name?: string) => void
  onLogout?: () => void
  onBackToMenu?: () => void
  onBackToLanding?: () => void
}

type PortalTab = 'card' | 'orders' | 'tickets' | 'vouchers' | 'preferences'

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({
  hfeCompanyProfile,
  isCustomerSessionActive = false,
  onLoginSuccess,
  onLogout,
  onBackToMenu,
  onBackToLanding
}) => {
  const [activeTab, setActiveTab] = useState<PortalTab>('card')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [localLoggedIn, setLocalLoggedIn] = useState(isCustomerSessionActive)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2500)
  }

  const [customerPrefs, setCustomerPrefs] = useState<CustomerPreferences>({
    favoriteDrink: 'Espresso Aren Latte',
    preferredMilk: 'Oat Milk (+Rp 5.000)',
    preferredSugar: '50%',
    dietaryNotes: 'Less ice',
    vehiclePlateNumber: 'B 1234 XYZ',
    deliveryAddress: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan',
    allergens: ['lactose'],
    paperlessReceipts: true,
    ecoPointsEarned: 30
  })

  const handleSavePreferences = (newPrefs: CustomerPreferences) => {
    setCustomerPrefs(newPrefs)
    showToast('🎉 Preferensi & data akun berhasil diperbarui!')
  }

  const handleAuthSuccess = (phone: string, name?: string) => {
    setLocalLoggedIn(true)
    if (onLoginSuccess) {
      onLoginSuccess(phone, name)
    }
    showToast(`🎉 Selamat Datang${name ? `, ${name}` : ''}! Member Aktif.`)
  }

  const handleLogout = () => {
    setLocalLoggedIn(false)
    if (onLogout) {
      onLogout()
    }
    showToast('🚪 Berhasil keluar dari sesi member.')
  }

  // If user is not authenticated, render authentic Member Login/Register Gate
  if (!isCustomerSessionActive && !localLoggedIn) {
    return (
      <div className="h-[100dvh] w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans select-none relative overflow-hidden">
        {/* TOP HEADER */}
        <header className="shrink-0 z-30 border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl px-4 pt-[max(env(safe-area-inset-top,12px),12px)] pb-3 flex items-center justify-between gap-3 shadow-xs">
          <button
            type="button"
            onClick={onBackToLanding || onBackToMenu}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all active:scale-95 cursor-pointer"
            title="Kembali"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-400">
            {hfeCompanyProfile.brandName}
          </span>
          <div className="w-8" />
        </header>

        <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain flex items-center justify-center p-4">
          <CustomerAuthGate
            brandName={hfeCompanyProfile.brandName}
            onLoginSuccess={handleAuthSuccess}
            onBackToLanding={onBackToLanding}
            onBackToMenu={onBackToMenu}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="h-[100dvh] w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans select-none relative overflow-hidden">
      {/* FLOATING TOAST */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-slate-900 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/50 px-4 py-2 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP STICKY APP HEADER */}
      <header className="shrink-0 z-30 border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl px-4 pt-[max(env(safe-area-inset-top,12px),12px)] pb-3 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onBackToMenu || onBackToLanding}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-all active:scale-95 shrink-0 cursor-pointer"
            title="Kembali ke Menu / Landing"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <h1 className="font-black text-sm text-slate-900 dark:text-white tracking-tight leading-tight truncate">
              HfeCard Passbook & Hub
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
              {hfeCompanyProfile.brandName} • Multi-Identity Wallet
            </p>
          </div>
        </div>

        {/* QUICK NAVIGATION & LOGOUT BUTTONS */}
        <div className="flex items-center gap-2 shrink-0">
          {onBackToMenu && (
            <button
              type="button"
              onClick={onBackToMenu}
              className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.97]"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Buka Menu</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-500/15 dark:bg-slate-800 dark:hover:bg-rose-500/20 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
            title="Keluar / Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* HORIZONTAL TAB NAVIGATION BAR */}
      <div className="shrink-0 bg-white/70 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800/80 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-pan-x">
        {[
          { id: 'card', label: '🪪 HfeCard Hub', icon: CreditCard },
          { id: 'orders', label: 'Riwayat Pesanan', icon: Receipt },
          { id: 'tickets', label: 'E-Ticket', icon: Ticket },
          { id: 'vouchers', label: 'Voucher Saya', icon: Tag },
          { id: 'preferences', label: 'Preferensi', icon: Sliders }
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as PortalTab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border cursor-pointer active:scale-[0.97] ${
                isActive
                  ? 'bg-amber-100 dark:bg-amber-500/20 border-amber-300 dark:border-amber-500/60 text-amber-900 dark:text-amber-300 shadow-xs font-black'
                  : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* SINGLE SCROLL OWNER VIEWPORT BODY */}
      <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 pb-[max(env(safe-area-inset-bottom,24px),24px)] flex flex-col items-center gap-6">
        <div className="w-full max-w-lg flex flex-col gap-4">
          {/* TAB 1: HFE CARD MULTI-IDENTITY PASSBOOK & MINI APPS */}
          {activeTab === 'card' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <HfeCardIdentityPassbook
                onOpenMenu={onBackToMenu}
                onOpenTickets={() => setActiveTab('tickets')}
                onOpenVouchers={() => setActiveTab('vouchers')}
              />
            </div>
          )}

          {/* TAB 2: PAST ORDERS HISTORY & E-RECEIPTS */}
          {activeTab === 'orders' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <CustomerOrdersHistoryTab
                onReorder={(ord) => {
                  showToast(`Pesanan ${ord.orderId} disiapkan untuk reorder!`)
                  if (onBackToMenu) onBackToMenu()
                }}
              />
            </div>
          )}

          {/* TAB 3: E-TICKETS & EVENT GATE PASS */}
          {activeTab === 'tickets' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <CustomerTicketsWalletTab />
            </div>
          )}

          {/* TAB 4: ACTIVE VOUCHERS WALLET */}
          {activeTab === 'vouchers' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <CustomerVouchersTab
                onApplyVoucherToCart={(v) => {
                  showToast(`Kupon ${v.code} diterapkan!`)
                }}
              />
            </div>
          )}

          {/* TAB 5: PREFERENCES & DIETARY */}
          {activeTab === 'preferences' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <CustomerPreferencesTab
                initialPreferences={customerPrefs}
                onSavePreferences={handleSavePreferences}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
