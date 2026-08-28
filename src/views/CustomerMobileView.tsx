import React, { useState, useRef, useEffect, useMemo } from 'react'
import { ArrowRight, ShoppingCart, Receipt, QrCode, Sparkles, ChevronRight, Clock } from 'lucide-react'
import {
  MenuItem,
  CartItem,
  OrderTicket,
  CustomerLoginType,
  PaymentPolicy,
  PB1TaxMode,
  HfeCompanyProfile,
  CafeThemeConfig,
  TableStatus
} from '../types/pos'
import { CustomerHeader } from '../components/customer/CustomerHeader'
import { CustomerCatalogView } from '../components/customer/CustomerCatalogView'
import { CustomerCheckoutView } from '../components/customer/CustomerCheckoutView'
import { ItemModifierModal } from '../components/customer/ItemModifierModal'
import { ActiveOpenBillDrawer } from '../components/customer/ActiveOpenBillDrawer'
import { OpenTabSettlementModal } from '../components/customer/OpenTabSettlementModal'

export interface CustomerMobileViewProps {
  hfeCompanyProfile: HfeCompanyProfile
  activeTheme: CafeThemeConfig
  selectedTable: string
  scannedSeat: string
  isCustomerSessionActive: boolean
  loginType: CustomerLoginType
  customerPhone: string
  guestName: string
  customerAvatar?: string
  setCustomerAvatar?: (v: string) => void
  loyaltyPoints: number
  productCatalog: MenuItem[]
  reservationPolicyMode: 'instant' | 'manual_review'
  priceVisibilityMode: 'show_prices' | 'hide_prices'
  customerAppDisplayMode: 'full_ordering' | 'catalog_only'
  cart: CartItem[]
  totalCartCount: number
  grandTotalBill: number
  previousOrders?: OrderTicket[]
  tablesGrid?: TableStatus[]
  qrStepView: 'catalog' | 'checkout'
  promoCodeInput: string
  appliedPromo: { code: string; discount: number } | null
  redeemedVoucher: any
  serviceFeeRate: number
  calculatedServiceFee: number
  taxPB1Mode: PB1TaxMode
  calculatedPB1Tax: number
  selectedTipAmount: number
  paymentPolicy: PaymentPolicy
  rawSubtotal: number
  setShowReservationModal: (show: boolean) => void
  setShowLoginModal: (show: boolean) => void
  setQrStepView: (step: 'catalog' | 'checkout') => void
  setPromoCodeInput: (code: string) => void
  setSelectedTipAmount: (tip: number) => void
  setPaymentPolicy: (policy: PaymentPolicy) => void
  handleReorderSameItem: (item: MenuItem) => void
  handleAddToCart: (item: MenuItem) => void
  handleUpdateQty: (index: number, delta: number) => void
  handleApplyPromo: (codeToApply?: string) => void
  handleSubmitOrder: () => void
  onSettleOpenTab?: (tableName: string, details: any) => void
  onSwitchToLandingPage?: () => void
  onJoinMembership?: (phone: string) => void
  onResetGuestSession?: () => void
  onSwitchToPos?: () => void
}

export const CustomerMobileView: React.FC<CustomerMobileViewProps> = ({
  hfeCompanyProfile,
  activeTheme,
  selectedTable,
  scannedSeat,
  isCustomerSessionActive,
  loginType,
  customerPhone,
  guestName,
  customerAvatar = '☕',
  setCustomerAvatar,
  loyaltyPoints,
  productCatalog,
  reservationPolicyMode,
  priceVisibilityMode,
  customerAppDisplayMode,
  cart,
  totalCartCount,
  grandTotalBill,
  previousOrders = [],
  tablesGrid = [],
  qrStepView,
  promoCodeInput,
  appliedPromo,
  redeemedVoucher,
  serviceFeeRate,
  calculatedServiceFee,
  taxPB1Mode,
  calculatedPB1Tax,
  selectedTipAmount,
  paymentPolicy,
  rawSubtotal,
  setShowReservationModal,
  setShowLoginModal,
  setQrStepView,
  setPromoCodeInput,
  setSelectedTipAmount,
  setPaymentPolicy,
  handleReorderSameItem,
  handleAddToCart,
  handleUpdateQty,
  handleApplyPromo,
  handleSubmitOrder,
  onSettleOpenTab,
  onSwitchToLandingPage,
  onJoinMembership,
  onResetGuestSession,
  onSwitchToPos
}) => {
  const categoryRefsMap = useRef<Record<string, HTMLDivElement | null>>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isManualScrollingRef = useRef<boolean>(false)
  const manualScrollTimeoutRef = useRef<any>(null)

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [activeCategory, setActiveCategory] = useState<string>('Coffee')
  const [selectedModifierItem, setSelectedModifierItem] = useState<MenuItem | null>(null)
  const [showActiveOpenBillDrawer, setShowActiveOpenBillDrawer] = useState<boolean>(false)
  const [showOpenTabSettlementModal, setShowOpenTabSettlementModal] = useState<boolean>(false)

  // Current Table Status & Running Orders (Only for valid in-store tables)
  const currentTableData = selectedTable ? tablesGrid.find(t => t.name === selectedTable) : null
  const relevantTableOrders = selectedTable ? previousOrders.filter(o => o.table === selectedTable && o.status !== 'cancelled') : []
  
  const hasActiveOpenBill = Boolean(selectedTable) && (relevantTableOrders.length > 0 || (currentTableData?.totalBill || 0) > 0)
  const runningTableSubtotal = relevantTableOrders.reduce((sum, ord) => {
    return sum + ord.items.reduce((s, i) => s + (i.price * i.quantity), 0)
  }, currentTableData?.totalBill || 0)

  // Dynamic Category Extraction from actual product catalog
  const categories = useMemo(() => {
    const unique = Array.from(new Set(productCatalog.map((p) => p.category || 'General')))
    return unique.length > 0 ? unique : ['Coffee', 'Non-Coffee', 'Pastry', 'Snack']
  }, [productCatalog])

  // Initialize activeCategory to first available category
  useEffect(() => {
    if (categories.length > 0 && !categories.includes(activeCategory)) {
      setActiveCategory(categories[0])
    }
  }, [categories, activeCategory])

  // Dynamic ScrollSpy observer with bottom-edge detection and manual lock
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || qrStepView !== 'catalog') return

    const handleScroll = () => {
      if (isManualScrollingRef.current) return

      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 40) {
        if (categories.length > 0) {
          setActiveCategory(categories[categories.length - 1])
        }
        return
      }

      const scrollPos = container.scrollTop + 140

      for (let i = categories.length - 1; i >= 0; i--) {
        const cat = categories[i]
        const el = categoryRefsMap.current[cat]
        if (el && el.offsetTop <= scrollPos) {
          setActiveCategory(cat)
          break
        }
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [qrStepView, categories])

  // Reset scroll position to top when switching between catalog and checkout
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [qrStepView])

  const scrollToCategorySection = (category: string) => {
    setActiveCategory(category)
    isManualScrollingRef.current = true
    if (manualScrollTimeoutRef.current) clearTimeout(manualScrollTimeoutRef.current)
    manualScrollTimeoutRef.current = setTimeout(() => {
      isManualScrollingRef.current = false
    }, 600)

    const targetEl = categoryRefsMap.current[category]
    if (targetEl && scrollContainerRef.current) {
      const topOffset = targetEl.offsetTop - 110
      scrollContainerRef.current.scrollTo({
        top: Math.max(0, topOffset),
        behavior: 'smooth'
      })
    }
  }

  const isLight = activeTheme.mode === 'light'
  const containerBg = isLight ? '#f1f5f9' : '#020617'
  const cardBorderColor = isLight ? '#e2e8f0' : '#1e293b'

  const handleOuterWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop += e.deltaY
    }
  }

  return (
    <div
      onWheel={handleOuterWheel}
      className="w-full flex-1 min-h-0 h-full flex justify-center items-stretch overflow-hidden transition-colors"
      style={{ backgroundColor: containerBg }}
    >
      {/* DESKTOP-SAFE SMARTPHONE CONTAINMENT FRAME */}
      <div
        className="w-full max-w-md flex flex-col h-full min-h-0 relative shadow-2xl border-x transition-colors theme-customer-container"
        style={{
          backgroundColor: activeTheme.pageBgHex,
          color: activeTheme.textColorHex,
          fontFamily: activeTheme.fontFamily,
          borderColor: cardBorderColor
        }}
      >
        {/* 1. TOP HEADER (SHRINK-0 PERSISTENT ON TOP) */}
        <CustomerHeader
          hfeCompanyProfile={hfeCompanyProfile}
          selectedTable={selectedTable}
          scannedSeat={scannedSeat}
          hasPaidOrder={hasActiveOpenBill || relevantTableOrders.length > 0}
          activeTheme={activeTheme}
          isCustomerSessionActive={isCustomerSessionActive}
          loginType={loginType}
          customerPhone={customerPhone}
          guestName={guestName}
          customerAvatar={customerAvatar}
          setCustomerAvatar={setCustomerAvatar}
          loyaltyPoints={loyaltyPoints}
          qrStepView={qrStepView}
          activeCategory={activeCategory}
          categories={categories}
          onBackToCatalog={() => setQrStepView('catalog')}
          setShowReservationModal={setShowReservationModal}
          setShowLoginModal={setShowLoginModal}
          scrollToCategorySection={scrollToCategorySection}
          onSwitchToLandingPage={onSwitchToLandingPage}
          onSwitchToPos={onSwitchToPos}
        />

        {/* 1B. ACTIVE OPEN BILL STICKY RUNNING BANNER */}
        {hasActiveOpenBill && qrStepView === 'catalog' && (
          <div 
            className="shrink-0 px-3.5 pt-2 pb-1 border-b animate-fadeIn"
            style={{
              backgroundColor: `${activeTheme.primaryAccentHex}10`,
              borderColor: `${activeTheme.primaryAccentHex}25`
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <div 
                onClick={() => setShowActiveOpenBillDrawer(true)}
                className="flex items-center gap-2 min-w-0 cursor-pointer group"
              >
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-sm"
                  style={{ backgroundColor: activeTheme.primaryAccentHex, color: '#020617' }}
                >
                  <Receipt className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span
                      className="text-[10px] uppercase font-bold tracking-wider font-mono"
                      style={{ color: isLight ? '#92400e' : '#fcd34d' }}
                    >
                      Open Bill Aktif
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <h5 className="text-xs font-black font-mono leading-tight truncate" style={{ color: activeTheme.textColorHex }}>
                    Rp {runningTableSubtotal.toLocaleString('id-ID')}
                  </h5>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowActiveOpenBillDrawer(true)}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all active:scale-95"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : '#0f172a',
                    borderColor: `${activeTheme.primaryAccentHex}40`,
                    color: activeTheme.textColorHex
                  }}
                >
                  Rincian
                </button>
                <button
                  type="button"
                  onClick={() => setShowOpenTabSettlementModal(true)}
                  className="text-[11px] font-black px-3 py-1 rounded-lg shadow transition-all active:scale-95 flex items-center gap-1"
                  style={{
                    backgroundColor: activeTheme.primaryAccentHex,
                    color: isLight ? '#020617' : '#020617'
                  }}
                >
                  <QrCode className="w-3 h-3" />
                  <span>Bayar QRIS</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. SCROLLABLE MENU CONTENT (FLEX-1 OVERFLOW-Y-AUTO) */}
        <main 
          ref={scrollContainerRef}
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3.5 sm:p-4 flex flex-col gap-4 pb-36"
          style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'thin' }}
        >
          {qrStepView === 'catalog' && (
            <div className="flex-1 flex flex-col animate-fadeIn">
              <CustomerCatalogView
                productCatalog={productCatalog}
                activeTheme={activeTheme}
                hfeCompanyProfile={hfeCompanyProfile}
                reservationPolicyMode={reservationPolicyMode}
                priceVisibilityMode={priceVisibilityMode}
                customerAppDisplayMode={customerAppDisplayMode}
                cart={cart}
                totalCartCount={totalCartCount}
                grandTotalBill={grandTotalBill}
                previousOrders={previousOrders}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setShowReservationModal={setShowReservationModal}
                handleReorderSameItem={handleReorderSameItem}
                handleAddToCart={handleAddToCart}
                handleUpdateQty={handleUpdateQty}
                onOpenModifierSheet={(item) => setSelectedModifierItem(item)}
                setQrStepView={setQrStepView}
                categoryRefs={categoryRefsMap}
              />
            </div>
          )}

          {qrStepView === 'checkout' && (
            <div className="flex-1 flex flex-col animate-slideInRight">
              <CustomerCheckoutView
                selectedTable={selectedTable}
                scannedSeat={scannedSeat}
                cart={cart}
                hfeCompanyProfile={hfeCompanyProfile}
                hasPaidOrder={hasActiveOpenBill || relevantTableOrders.length > 0}
                activeTheme={activeTheme}
                promoCodeInput={promoCodeInput}
                setPromoCodeInput={setPromoCodeInput}
                appliedPromo={appliedPromo}
                redeemedVoucher={redeemedVoucher}
                serviceFeeRate={serviceFeeRate}
                calculatedServiceFee={calculatedServiceFee}
                taxPB1Mode={taxPB1Mode}
                calculatedPB1Tax={calculatedPB1Tax}
                selectedTipAmount={selectedTipAmount}
                setSelectedTipAmount={setSelectedTipAmount}
                paymentPolicy={paymentPolicy}
                setPaymentPolicy={setPaymentPolicy}
                rawSubtotal={rawSubtotal}
                grandTotalBill={grandTotalBill}
                isCustomerSessionActive={isCustomerSessionActive}
                onJoinMembership={onJoinMembership}
                onResetGuestSession={onResetGuestSession}
                setQrStepView={setQrStepView}
                handleUpdateQty={handleUpdateQty}
                handleApplyPromo={handleApplyPromo}
                handleSubmitOrder={handleSubmitOrder}
              />
            </div>
          )}
        </main>

        {/* 3. PERSISTENT FLOATING BOTTOM CART DOCK (SHRINK-0 ALWAYS VISIBLE WHEN CART HAS ITEMS) */}
        {cart.length > 0 && customerAppDisplayMode === 'full_ordering' && qrStepView === 'catalog' && (
          <div 
            className="shrink-0 z-40 px-3.5 pt-6 pb-[max(env(safe-area-inset-bottom,16px),16px)] flex justify-center animate-slideUp absolute bottom-0 inset-x-0 pointer-events-none"
            style={{
              background: `linear-gradient(to top, ${activeTheme.pageBgHex} 60%, ${activeTheme.pageBgHex}D9 80%, transparent 100%)`
            }}
          >
            <div 
              onClick={() => setQrStepView('checkout')}
              className="w-full max-w-md backdrop-blur-xl border rounded-2xl px-4 py-3 shadow-2xl flex items-center justify-between font-bold cursor-pointer active:scale-[0.98] transition-all ring-1 ring-black/5 touch-manipulation min-h-[64px] pointer-events-auto"
              style={{
                backgroundColor: isLight ? 'rgba(255, 255, 255, 0.96)' : 'rgba(15, 23, 42, 0.96)',
                borderColor: `${activeTheme.primaryAccentHex}50`,
                color: activeTheme.textColorHex
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-xs relative shrink-0 shadow"
                  style={{ backgroundColor: activeTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617' }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                    {totalCartCount}
                  </span>
                </div>
                <div className="flex flex-col text-left leading-tight min-w-0">
                  <span 
                    className="text-[10px] uppercase font-bold tracking-wider truncate"
                    style={{ color: activeTheme.secondaryTextColorHex }}
                  >
                    Keranjang ({totalCartCount} menu)
                  </span>
                  <h4 
                    className="text-sm font-black font-mono whitespace-nowrap mt-0.5"
                    style={{ color: activeTheme.primaryAccentHex }}
                  >
                    Rp {grandTotalBill.toLocaleString('id-ID')}
                  </h4>
                </div>
              </div>

              <div 
                className="flex items-center gap-1.5 text-xs font-black px-4 py-2.5 rounded-xl shadow transition-all shrink-0 hover:opacity-90 active:scale-95"
                style={{ backgroundColor: activeTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617' }}
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        )}

        {/* 4. ACTIVE OPEN BILL DRAWER */}
        <ActiveOpenBillDrawer
          isOpen={showActiveOpenBillDrawer}
          onClose={() => setShowActiveOpenBillDrawer(false)}
          selectedTable={selectedTable}
          scannedSeat={scannedSeat}
          tableStatus={currentTableData}
          tableOrders={relevantTableOrders}
          hfeCompanyProfile={hfeCompanyProfile}
          onAddMoreItems={() => {
            setShowActiveOpenBillDrawer(false)
            setQrStepView('catalog')
          }}
          onOpenSettlementQRIS={() => {
            setShowActiveOpenBillDrawer(false)
            setShowOpenTabSettlementModal(true)
          }}
        />

        {/* 5. OPEN TAB SETTLEMENT QRIS MODAL */}
        <OpenTabSettlementModal
          isOpen={showOpenTabSettlementModal}
          onClose={() => setShowOpenTabSettlementModal(false)}
          selectedTable={selectedTable}
          scannedSeat={scannedSeat}
          totalBill={runningTableSubtotal}
          tableOrders={relevantTableOrders}
          onSettlementSuccess={(details) => {
            onSettleOpenTab?.(selectedTable, details)
          }}
        />

        {/* UBEREATS-BENCHMARK ITEM MODIFIER BOTTOM SHEET */}
        <ItemModifierModal
          show={!!selectedModifierItem}
          item={selectedModifierItem}
          onClose={() => setSelectedModifierItem(null)}
          onAddToCart={(modifiedItem) => {
            handleAddToCart(modifiedItem)
            setSelectedModifierItem(null)
          }}
        />
      </div>
    </div>
  )
}
