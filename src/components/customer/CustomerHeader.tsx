import React, { useState, useRef, useEffect } from 'react'
import { Coffee, Lock as LockIcon, ChevronRight } from 'lucide-react'
import { HfeCompanyProfile, CafeThemeConfig } from '../../types/pos'
import { CustomerProfileDrawer } from './CustomerProfileDrawer'
import { MerchantDetailDrawer } from './MerchantDetailDrawer'

export interface CustomerHeaderProps {
  hfeCompanyProfile: HfeCompanyProfile
  selectedTable: string
  scannedSeat: string
  hasPaidOrder?: boolean
  activeTheme: CafeThemeConfig
  isCustomerSessionActive: boolean
  loginType: 'phone' | 'guest-name'
  customerPhone: string
  guestName: string
  customerAvatar?: string
  setCustomerAvatar?: (v: string) => void
  loyaltyPoints: number
  qrStepView?: 'catalog' | 'checkout'
  activeCategory?: string
  categories?: string[]
  onBackToCatalog?: () => void
  setShowReservationModal: (show: boolean) => void
  setShowLoginModal: (show: boolean) => void
  scrollToCategorySection: (category: string) => void
  onSwitchToLandingPage?: () => void
  onSwitchToPos?: () => void
}

export const getCategoryIcon = (category: string): string => {
  const lower = category.toLowerCase()
  if (lower.includes('coffee') && !lower.includes('non')) return '☕'
  if (lower.includes('non-coffee') || lower.includes('tea') || lower.includes('matcha')) return '🍵'
  if (lower.includes('pastry') || lower.includes('bakery') || lower.includes('bread') || lower.includes('croissant')) return '🥐'
  if (lower.includes('snack') || lower.includes('finger') || lower.includes('fries') || lower.includes('chips')) return '🍟'
  if (lower.includes('main') || lower.includes('food') || lower.includes('rice') || lower.includes('nasi') || lower.includes('pasta')) return '🍛'
  if (lower.includes('dessert') || lower.includes('cake') || lower.includes('sweet') || lower.includes('ice')) return '🍰'
  if (lower.includes('mocktail') || lower.includes('cocktail') || lower.includes('drink') || lower.includes('fizz')) return '🍹'
  if (lower.includes('retail') || lower.includes('merch') || lower.includes('bean') || lower.includes('tumbler')) return '🛍️'
  return '🍽️'
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({
  hfeCompanyProfile,
  selectedTable,
  scannedSeat,
  hasPaidOrder = false,
  activeTheme,
  isCustomerSessionActive,
  loginType,
  customerPhone,
  guestName,
  customerAvatar = '☕',
  setCustomerAvatar,
  loyaltyPoints,
  qrStepView = 'catalog',
  activeCategory = 'Coffee',
  categories = ['Coffee', 'Non-Coffee', 'Pastry', 'Snack'],
  setShowReservationModal,
  setShowLoginModal,
  scrollToCategorySection,
  onSwitchToLandingPage
}) => {
  const [showProfileDrawer, setShowProfileDrawer] = useState<boolean>(false)
  const [showMerchantDrawer, setShowMerchantDrawer] = useState<boolean>(false)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const isCustomUploadedPhoto = customerAvatar?.startsWith('data:image') || customerAvatar?.startsWith('http')
  const isLight = activeTheme.mode === 'light'
  const textColor = activeTheme.textColorHex || (isLight ? '#1e293b' : '#f8fafc')
  const headerBg = activeTheme.headerBgHex || activeTheme.cardBgHex || (isLight ? '#ffffff' : '#0f172a')
  const borderColor = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)'

  // Dynamic Horizontal Tab Centering on ScrollSpy change
  useEffect(() => {
    if (activeCategory && tabRefs.current[activeCategory]) {
      tabRefs.current[activeCategory]?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      })
    }
  }, [activeCategory])

  return (
    <>
      <header 
        className="shrink-0 z-30 border-b backdrop-blur-xl px-3.5 pt-[max(env(safe-area-inset-top,8px),8px)] pb-2.5 flex flex-col gap-2.5 transition-all theme-customer-header"
        style={{ 
          backgroundColor: `${headerBg}`, 
          borderColor,
          boxShadow: isLight ? '0 4px 16px -2px rgba(0,0,0,0.05)' : '0 4px 20px -2px rgba(0,0,0,0.4)'
        }}
      >
        {/* ROW 1: 3-TOUCH-ZONE CLEAN ARCHITECTURE */}
        <div className="flex items-center justify-between gap-2.5 min-w-0">
          
          {/* TOUCH ZONE 1: MERCHANT & TABLE UNIFIED HUB (ENTIRE LEFT BLOCK) */}
          <button
            type="button"
            onClick={() => setShowMerchantDrawer(true)}
            className="flex items-center gap-2.5 min-w-0 flex-1 text-left p-1 -ml-1 rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all touch-manipulation group"
            title="Sentuh untuk Info Resto, Sesi Meja & Tagihan"
          >
            {hfeCompanyProfile.logoUrl ? (
              <img 
                src={hfeCompanyProfile.logoUrl} 
                alt={hfeCompanyProfile.brandName} 
                className="w-10 h-10 rounded-2xl object-cover border shadow-sm shrink-0"
                style={{ borderColor: activeTheme.primaryAccentHex }}
              />
            ) : (
              <div 
                className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs shadow-sm shrink-0"
                style={{ backgroundColor: activeTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617' }}
              >
                <Coffee className="w-5 h-5" />
              </div>
            )}
            
            <div className="min-w-0 flex flex-col flex-1 justify-center">
              <div className="flex items-center gap-1 min-w-0">
                <h1 
                  className="font-extrabold text-xs sm:text-sm tracking-tight leading-tight truncate"
                  style={{ color: textColor }}
                >
                  {hfeCompanyProfile.brandName}
                </h1>
                <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" style={{ color: textColor }} />
              </div>

              {/* TABLE & SEAT STATUS SUBTITLE PILL */}
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold mt-0.5" style={{ color: activeTheme.primaryAccentHex }}>
                <LockIcon className="w-2.5 h-2.5 shrink-0" />
                <span className="truncate">{selectedTable} • {scannedSeat}</span>
                <span 
                  className="text-[9px] font-sans font-bold px-1.5 py-0.2 rounded shrink-0 border"
                  style={{ 
                    backgroundColor: `${activeTheme.primaryAccentHex}15`, 
                    color: activeTheme.primaryAccentHex,
                    borderColor: `${activeTheme.primaryAccentHex}30`
                  }}
                >
                  Bill & Info
                </span>
              </div>
            </div>
          </button>

          {/* TOUCH ZONE 2: CUSTOMER PROFILE & LOYALTY (RIGHT BUTTON) */}
          <div className="flex items-center shrink-0">
            {isCustomerSessionActive ? (
              <button
                type="button"
                onClick={() => setShowProfileDrawer(true)}
                className="w-10 h-10 rounded-2xl border active:scale-95 flex items-center justify-center shadow-sm transition-all relative overflow-hidden shrink-0 touch-manipulation"
                style={{ 
                  backgroundColor: isLight ? '#ffffff' : activeTheme.cardBgHex, 
                  borderColor 
                }}
                title="Buka Profil & Saldo Poin"
              >
                {isCustomUploadedPhoto ? (
                  <img src={customerAvatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-base">{customerAvatar || '☕'}</span>
                )}
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowLoginModal(true)}
                className="font-black text-xs px-3.5 py-2 rounded-xl shadow transition-all touch-manipulation"
                style={{ backgroundColor: activeTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617' }}
              >
                Masuk
              </button>
            )}
          </div>
        </div>

        {/* TOUCH ZONE 3: DYNAMIC ETALASE / CATEGORY SCROLLSPY TABS WITH AUTO-SCROLL */}
        {qrStepView === 'catalog' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-0.5 pb-0.5 no-scrollbar touch-pan-x overscroll-x-contain">
            {categories.map(catName => {
              const isCatActive = activeCategory === catName
              return (
                <button
                  key={catName}
                  ref={el => { tabRefs.current[catName] = el }}
                  type="button"
                  onClick={() => scrollToCategorySection(catName)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 touch-manipulation border ${
                    isCatActive
                      ? 'shadow font-black'
                      : 'hover:opacity-85'
                  }`}
                  style={{
                    backgroundColor: isCatActive 
                      ? activeTheme.primaryAccentHex 
                      : (isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)'),
                    color: isCatActive 
                      ? (isLight ? '#ffffff' : '#020617') 
                      : textColor,
                    borderColor: isCatActive 
                      ? activeTheme.primaryAccentHex 
                      : (isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)')
                  }}
                >
                  <span className="text-xs">{getCategoryIcon(catName)}</span>
                  <span>{catName}</span>
                </button>
              )
            })}
          </div>
        )}
      </header>

      {/* CUSTOMER PROFILE & LOYALTY MODAL DRAWER */}
      <CustomerProfileDrawer
        isOpen={showProfileDrawer}
        onClose={() => setShowProfileDrawer(false)}
        customerPhone={customerPhone}
        guestName={guestName}
        customerAvatar={customerAvatar}
        setCustomerAvatar={setCustomerAvatar}
        loginType={loginType}
        loyaltyPoints={loyaltyPoints}
        onLogout={() => {
          setShowProfileDrawer(false)
          setShowLoginModal(true)
        }}
      />

      {/* MERCHANT DETAILS & BILL MODAL DRAWER */}
      <MerchantDetailDrawer
        isOpen={showMerchantDrawer}
        onClose={() => setShowMerchantDrawer(false)}
        hfeCompanyProfile={hfeCompanyProfile}
        selectedTable={selectedTable}
        scannedSeat={scannedSeat}
        hasPaidOrder={hasPaidOrder}
        onAddMoreItems={() => setShowMerchantDrawer(false)}
        onOpenReservationModal={() => {
          setShowMerchantDrawer(false)
          setShowReservationModal(true)
        }}
        onSwitchToLandingPage={onSwitchToLandingPage}
      />
    </>
  )
}
