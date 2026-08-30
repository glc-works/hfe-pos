import { useState, useEffect, useMemo } from 'react'
import { useMerchantConfig } from './context/MerchantConfigContext'
import { StaffSubNavigator } from './components/common/StaffSubNavigator'
import { GlobalModals } from './components/modals/GlobalModals'
import { useHfeSync } from './hooks/useHfeSync'
import { useTableState } from './hooks/useTableState'
import { useCart } from './hooks/useCart'
import { useDynamicFavicon } from './hooks/useDynamicFavicon'
import { LandingView } from './views/LandingView'
import { CustomerMobileView } from './views/CustomerMobileView'
import { lazy, Suspense } from 'react'
import { UnifiedPosView } from './views/UnifiedPosView'
import { StaffWorkstationView } from './views/StaffWorkstationView'
import { UnifiedKdsView } from './views/UnifiedKdsView'
import { CustomerFacingDisplayView } from './views/CustomerFacingDisplayView'
import { CafeSettingsView } from './views/CafeSettingsView'
import { CustomerPortalView } from './views/CustomerPortalView'
import { PosAuthLoginView } from './views/PosAuthLoginView'

const WarehouseManagementView = lazy(() => import('./views/WarehouseManagementView').then(m => ({ default: m.WarehouseManagementView })))
const BranchManagementView = lazy(() => import('./views/BranchManagementView').then(m => ({ default: m.BranchManagementView })))
const ScanAndGoView = lazy(() => import('./views/ScanAndGoView').then(m => ({ default: m.ScanAndGoView })))
const SommelierView = lazy(() => import('./views/SommelierView').then(m => ({ default: m.SommelierView })))
const MaitreDView = lazy(() => import('./views/MaitreDView').then(m => ({ default: m.MaitreDView })))
const CustomerContactsView = lazy(() => import('./views/CustomerContactsView').then(m => ({ default: m.CustomerContactsView })))
const NativeComponentGalleryView = lazy(() => import('./views/NativeComponentGalleryView').then(m => ({ default: m.NativeComponentGalleryView })))
const AdminMerchantUserView = lazy(() => import('./views/admin/AdminMerchantUserView').then(m => ({ default: m.AdminMerchantUserView })))
const MerchantHomeHubView = lazy(() => import('./views/MerchantHomeHubView').then(m => ({ default: m.MerchantHomeHubView })))
const HfeitCorporateView = lazy(() => import('./views/HfeitCorporateView').then(m => ({ default: m.HfeitCorporateView })))
const HfeInsightsView = lazy(() => import('./views/HfeInsightsView').then(m => ({ default: m.HfeInsightsView })))
const ConnectHubAdminView = lazy(() => import('./views/ConnectHubAdminView').then(m => ({ default: m.ConnectHubAdminView })))
const CompanyBookView = lazy(() => import('./views/CompanyBookView').then(m => ({ default: m.CompanyBookView })))
import { BUILTIN_THEMES, createRuntimeProductCatalog, INITIAL_CUSTOMER_PROFILES, STATIONS } from './data/mockData'
import { createRuntimeInitialOrders } from './data/runtimeDemoData'
import { StaffSurfaceMode, KdsViewModeType, MenuItem, OrderTicket } from './types/pos'
import { usePosAuth } from './hooks/usePosAuth'
import { normalizeSurfaceHost } from './utils/surfaceHost'
import { useHfeFinancialPort } from './hooks/useHfeFinancialPort'
import { AppProviders } from './components/app/AppProviders'
import { ToGrowSocialCallbackView } from './components/auth/ToGrowSocialCallbackView'
import { resolveHfeitOrganizationId } from './config/firstPartyRuntime'

function AppMain() {
  const config = useMerchantConfig()
  const auth = usePosAuth()
  const financialPort = useHfeFinancialPort(auth.authToken)
  const productCatalog = useMemo(createRuntimeProductCatalog, [])
  const runtimeInitialOrders = useMemo(createRuntimeInitialOrders, [])
  const [activeStaffSurface, setActiveStaffSurface] = useState<StaffSurfaceMode>(() => {
    if (typeof window !== 'undefined') {
      const surfaceParam = new URLSearchParams(window.location.search).get('surface') as StaffSurfaceMode
      if (surfaceParam) return surfaceParam
      const host = normalizeSurfaceHost(window.location.hostname)
      if (host.startsWith('gallery.') || host.startsWith('design.')) return 'gallery'
      if (host.startsWith('admin.') || host.startsWith('hub.')) return 'admin-hub'
      if (host.startsWith('book.') || host.startsWith('ledger.')) return 'hfe-company-book'
      if (host.startsWith('kds.') || host.startsWith('kitchen.')) return 'kds-screen'
    }
    return 'barista-pos'
  })
  const [qrStepView, setQrStepView] = useState<'catalog' | 'checkout'>('catalog')
  const [isCustomerSessionActive, setIsCustomerSessionActive] = useState<boolean>(false)
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false)
  const [aiStylesheetInput, setAiStylesheetInput] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const resetCanonicalGuestSession = () => {
    cart.clearCart()
    cart.setGuestName('Tamu Meja')
    cart.setCustomerPhone('')
    cart.setLoginType('guest-name')
    cart.setLoyaltyPoints(0)
    setIsCustomerSessionActive(false)
    setQrStepView('catalog')
  }

  const handleJoinMembershipAtCheckout = (phone: string) => {
    setIsCustomerSessionActive(true)
    cart.setLoginType('phone')
    cart.setCustomerPhone(phone)
    cart.setGuestName('Member HP')
    cart.setLoyaltyPoints(100)
    showToast('🎉 Selamat Datang! Keanggotaan Aktif & Poin Tersimpan')
  }

  const sync = useHfeSync()

  // Dynamically synchronize browser tab favicon with merchant logo (fallback to POS favicon)
  useDynamicFavicon(sync.hfeCompanyProfile?.logoUrl, sync.hfeCompanyProfile?.brandName)

  const [orders, setOrders] = useState<OrderTicket[]>(runtimeInitialOrders)
  const table = useTableState({ orders, setOrders, hfeCompanyProfile: sync.hfeCompanyProfile })

  const handleSettleOpenTab = (tableName: string, details: any) => {
    table.setTablesGrid((prev) => prev.map(t => t.name === tableName ? { ...t, status: 'occupied', totalBill: 0, orderCount: 0, customerName: `${(t.customerName || 'Tamu').replace(' (Lunas)', '')} (Lunas)` } : t))
    setOrders((prev) => prev.map(o => o.table === tableName ? { ...o, status: 'served' as const } : o))
    cart.setLoyaltyPoints((prev) => prev + (details?.pointsEarned || Math.floor((details?.paidAmount || 50000) / 1000)))
    showToast(`🎉 Pembayaran Meja ${tableName} Lunas (Rp ${(details?.paidAmount || 0).toLocaleString('id-ID')})!`)
  }

  const cart = useCart({
    productCatalog,
    hfeCompanyProfile: sync.hfeCompanyProfile,
    onOrderSubmitted: (newOrder) => {
      setOrders((prev) => [newOrder, ...prev])
      table.setTablesGrid((prev) => prev.map(t => t.name === newOrder.table ? { ...t, status: newOrder.policy === 'open-tab' ? 'open-tab' : 'occupied', customerName: newOrder.customerName || t.customerName || 'Tamu', totalBill: (t.totalBill || 0) + newOrder.total, orderCount: (t.orderCount || 0) + newOrder.items.length } : t))
      showToast(`🛎️ Pesanan ${newOrder.table} terkirim ke KDS Dapur!`)
    }
  })

  const [kdsFilterStation, setKdsFilterStation] = useState<string>('all')
  const [kdsViewMode, setKdsViewMode] = useState<KdsViewModeType>('kanban')
  const [cashDrawerFloat] = useState<number>(500000)
  const [selectedRecipeBOM, setSelectedRecipeBOM] = useState<MenuItem | null>(null)
  const [customerProfiles, setCustomerProfiles] = useState(INITIAL_CUSTOMER_PROFILES)

  // Wire mock reset trigger into single-door config with sleek Toast
  useEffect(() => {
    config.setOnResetMockState(() => {
      table.setTablesGrid((prev) => prev.map((t, idx) => ({
        ...t,
        status: idx === 3 ? 'occupied' : 'free',
        customerName: idx === 3 ? 'Aldi Pratama' : undefined,
        totalBill: idx === 3 ? 58300 : 0,
        orderCount: idx === 3 ? 2 : 0,
        orderIds: idx === 3 ? ['ORD-8801'] : []
      })))
      setOrders(runtimeInitialOrders)
      showToast('🔄 Status meja dan pesanan berhasil di-reset!')
    })
  }, [])

  useEffect(() => {
    if (cart.paymentPolicy !== config.paymentPolicy) {
      cart.setPaymentPolicy(config.paymentPolicy)
    }
  }, [config.paymentPolicy])

  const handleMoveStatus = (orderId: string, targetStatus: any) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: targetStatus } : o))
    )
  }

  const handleExportThemeFile = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config.customerTheme, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `${config.customerTheme.themeName.toLowerCase().replace(/\s+/g, '-')}-theme.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    showToast(`📤 Tema ${config.customerTheme.themeName} berhasil diekspor!`)
  }

  const handleImportThemeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string)
        if (parsed.themeName && parsed.primaryAccentHex) {
          config.setCustomerTheme(parsed)
          showToast(`🎉 Tema "${parsed.themeName}" berhasil dipasang!`)
        } else {
          showToast('❌ Format file tema tidak valid.')
        }
      } catch {
        showToast('❌ Gagal membaca file JSON tema.')
      }
    }
    reader.readAsText(file)
  }

  const handleApplyAIThemeString = () => {
    try {
      const parsed = JSON.parse(aiStylesheetInput)
      if (parsed.themeName && parsed.primaryAccentHex) {
        config.setCustomerTheme(parsed)
        showToast(`🎉 Tema AI "${parsed.themeName}" diterapkan!`)
      } else {
        showToast('❌ Format JSON tema tidak valid.')
      }
    } catch {
      showToast('❌ Format JSON tidak valid.')
    }
  }

  const effectiveTheme = config.customerTheme

  return (
    <div className="h-[100dvh] w-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans select-none relative overflow-hidden">
      {/* FLOATING TOAST NOTIFICATION PILL */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white border border-amber-500/60 px-4 py-2 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-bold animate-fadeIn ring-1 ring-amber-500/30">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* INJECT DYNAMIC THEME TOKENS */}
      <style>{`
        :root {
          --brand-primary: ${effectiveTheme.primaryAccentHex};
          --brand-primary-hover: ${effectiveTheme.primaryAccentHoverHex || effectiveTheme.primaryAccentHex};
          --brand-bg: ${effectiveTheme.pageBgHex};
          --brand-card-bg: ${effectiveTheme.cardBgHex};
          --brand-header-bg: ${effectiveTheme.headerBgHex || effectiveTheme.cardBgHex};
          --brand-text: ${effectiveTheme.textColorHex};
          --brand-secondary-text: ${effectiveTheme.secondaryTextColorHex || effectiveTheme.textColorHex};
          --brand-badge-bg: ${effectiveTheme.highlightBadgeBgHex || effectiveTheme.primaryAccentHex};
          --brand-badge-text: ${effectiveTheme.highlightBadgeTextHex || '#000000'};
          --brand-radius: ${effectiveTheme.borderRadiusPx || 16}px;
          --brand-font: ${effectiveTheme.fontFamily};
        }
        .theme-customer-container { font-family: var(--brand-font) !important; }
        .light .theme-customer-container { background-color: var(--brand-bg, #faf8f5) !important; color: var(--brand-text, #0f172a) !important; }
        .dark .theme-customer-container { background-color: #020617 !important; color: #f8fafc !important; }
        .theme-customer-header { border-radius: 0 !important; }
        .light .theme-customer-header { background-color: var(--brand-header-bg, #ffffffea) !important; }
        .dark .theme-customer-header { background-color: #0f172af0 !important; }
        .theme-customer-card { border-radius: var(--brand-radius) !important; }
        .light .theme-customer-card { background-color: var(--brand-card-bg, #ffffff) !important; }
        .dark .theme-customer-card { background-color: #0f172a !important; }
        .theme-customer-btn-primary { background-color: var(--brand-primary) !important; color: #ffffff !important; border-radius: calc(var(--brand-radius) * 0.75) !important; }
        .theme-customer-btn-primary:hover { background-color: var(--brand-primary-hover) !important; }
        .theme-customer-badge { background-color: var(--brand-badge-bg) !important; color: var(--brand-badge-text) !important; }
        ${effectiveTheme.customCssOverrides || ''}
      `}</style>

      {/* PURE NATIVE VIEWPORT APPLICATION CONTAINER */}
      <div className="flex-1 min-h-0 flex flex-col h-full overflow-hidden w-full relative">
        {config.activeApp === 'landing' && (
          <LandingView
            hfeCompanyProfile={sync.hfeCompanyProfile}
            productCatalog={productCatalog}
            viewportMode={config.viewportMode}
            onOpenReservationModal={() => table.setShowReservationModal(true)}
            onSwitchToCustomerApp={() => config.setActiveApp('customer')}
          />
        )}

        {config.activeApp === 'customer' && (
          <CustomerMobileView
            hfeCompanyProfile={sync.hfeCompanyProfile}
            selectedTable={table.selectedTable}
            scannedSeat={table.scannedSeat}
            activeTheme={config.customerTheme}
            isCustomerSessionActive={isCustomerSessionActive}
            loginType={cart.loginType} customerPhone={cart.customerPhone} guestName={cart.guestName}
            customerAvatar={cart.customerAvatar} setCustomerAvatar={cart.setCustomerAvatar}
            loyaltyPoints={cart.loyaltyPoints} productCatalog={productCatalog}
            reservationPolicyMode={table.reservationPolicyMode} priceVisibilityMode={table.priceVisibilityMode}
            customerAppDisplayMode={table.customerAppDisplayMode} cart={cart.cart}
            totalCartCount={cart.totalCartCount} grandTotalBill={cart.grandTotalBill}
            previousOrders={orders} tablesGrid={table.tablesGrid} qrStepView={qrStepView}
            promoCodeInput={cart.promoCodeInput} appliedPromo={cart.appliedPromo}
            redeemedVoucher={cart.redeemedVoucher} serviceFeeRate={cart.serviceFeeRate}
            calculatedServiceFee={cart.calculatedServiceFee} taxPB1Mode={cart.taxPB1Mode}
            calculatedPB1Tax={cart.calculatedPB1Tax} selectedTipAmount={cart.selectedTipAmount}
            paymentPolicy={config.paymentPolicy} rawSubtotal={cart.rawSubtotal}
            setShowReservationModal={table.setShowReservationModal} setShowLoginModal={setShowLoginModal}
            setQrStepView={setQrStepView} setPromoCodeInput={cart.setPromoCodeInput}
            setSelectedTipAmount={cart.setSelectedTipAmount} setPaymentPolicy={config.setPaymentPolicy}
            handleReorderSameItem={cart.handleAddToCart} handleAddToCart={cart.handleAddToCart}
            handleUpdateQty={cart.handleUpdateQty} handleApplyPromo={cart.handleApplyPromo}
            handleSubmitOrder={() => cart.handleSubmitOrder(table.selectedTable, setQrStepView)}
            onSettleOpenTab={handleSettleOpenTab}
            onJoinMembership={handleJoinMembershipAtCheckout}
            onResetGuestSession={resetCanonicalGuestSession}
            onSwitchToLandingPage={() => config.setActiveApp('landing')}
            onSwitchToPos={() => config.setActiveApp('cafe')}
          />
        )}

        {config.activeApp === 'cfd' && (
          <CustomerFacingDisplayView
            hfeCompanyProfile={sync.hfeCompanyProfile}
            cart={cart.cart}
            rawSubtotal={cart.rawSubtotal}
            calculatedServiceFee={cart.calculatedServiceFee}
            calculatedPB1Tax={cart.calculatedPB1Tax}
            grandTotalBill={cart.grandTotalBill}
          />
        )}

        {config.activeApp === 'cafe' && !auth.currentStaffUser && (
          <PosAuthLoginView auth={auth} />
        )}

        {config.activeApp === 'cafe' && !!auth.currentStaffUser && (
          <div className="flex-1 min-h-0 flex flex-col h-full overflow-hidden">
            {activeStaffSurface !== 'barista-pos' && activeStaffSurface !== 'retail-pos' && (
              <StaffSubNavigator
                activeStaffSurface={activeStaffSurface}
                setActiveStaffSurface={setActiveStaffSurface}
              />
            )}

            {(activeStaffSurface === 'barista-pos' ||
              activeStaffSurface === 'retail-pos') && (
              <UnifiedPosView
                activeStaffSurface={activeStaffSurface}
                setActiveStaffSurface={setActiveStaffSurface}
                tablesGrid={table.tablesGrid}
                selectedPOSTable={table.selectedPOSTable}
                productCatalog={productCatalog}
                posPayMethod={table.posPayMethod}
                posCashGiven={table.posCashGiven}
                cashDrawerFloat={cashDrawerFloat}
                orders={orders}
                viewportMode={config.viewportMode}
                setShowTableReassignModal={table.setShowTableReassignModal}
                setSelectedPOSTable={table.setSelectedPOSTable}
                setTablesGrid={table.setTablesGrid}
                setPosPayMethod={table.setPosPayMethod}
                setPosCashGiven={table.setPosCashGiven}
                handlePOSCheckoutTable={table.handlePOSCheckoutTable}
                financialPort={financialPort}
                organizationId={resolveHfeitOrganizationId()}
                companyBookId={sync.hfeCompanyProfile.companyBookId}
                authorityContext={auth.currentStaffUser.authority_context_id || ''}
                cashierId={auth.currentStaffUser.user_id}
                handleMoveStatus={handleMoveStatus}
              />
            )}

            {activeStaffSurface === 'kds-screen' && (
              <UnifiedKdsView
                orders={orders}
                activeStationId={kdsFilterStation}
                setActiveStationId={setKdsFilterStation}
                kdsViewMode={kdsViewMode}
                setKdsViewMode={setKdsViewMode}
                handleMoveStatus={handleMoveStatus}
                stations={STATIONS}
              />
            )}

            {activeStaffSurface === 'checker-qc' && (
              <StaffWorkstationView
                activeSubRole="checker"
                orders={orders}
                handleMoveStatus={handleMoveStatus}
              />
            )}

            {activeStaffSurface === 'server-waiter' && (
              <StaffWorkstationView
                activeSubRole="server"
                orders={orders}
                handleMoveStatus={handleMoveStatus}
              />
            )}

            <Suspense fallback={null}>
              {activeStaffSurface === 'hfe-insights' && (
                <HfeInsightsView
                  productCatalog={productCatalog}
                  orders={orders}
                  tablesGrid={table.tablesGrid}
                  cashDrawerFloat={cashDrawerFloat}
                />
              )}

              {activeStaffSurface === 'hfe-connect-hub' && <ConnectHubAdminView />}

              {activeStaffSurface === 'hfe-company-book' && (
                <CompanyBookView bookId={sync.hfeCompanyProfile.companyBookId} />
              )}
            </Suspense>

            {activeStaffSurface === 'cafe-config' && (
              <CafeSettingsView
                hfeCompanyProfile={sync.hfeCompanyProfile}
                setHfeCompanyProfile={sync.setHfeCompanyProfile}
                hfeBranchMode={sync.hfeBranchMode}
                setHfeBranchMode={sync.setHfeBranchMode}
                activeBranchId={sync.activeBranchId}
                setActiveBranchId={sync.setActiveBranchId}
                outletBranches={sync.outletBranches}
                handleFetchHfeCompanyProfile={sync.handleFetchHfeCompanyProfile}
                handlePushHfeCompanyProfile={sync.handlePushHfeCompanyProfile}
                reservationPolicyMode={table.reservationPolicyMode}
                setReservationPolicyMode={table.setReservationPolicyMode}
                dpRequiredMode={table.dpRequiredMode}
                setDpRequiredMode={table.setDpRequiredMode}
                dpAmountConfig={table.dpAmountConfig}
                setDpAmountConfig={table.setDpAmountConfig}
                reservations={table.reservations}
                handleApproveReservation={table.handleApproveReservation}
                handleRejectReservation={table.handleRejectReservation}
                reservationOrderMode={table.reservationOrderMode}
                setReservationOrderMode={table.setReservationOrderMode}
                customerAppDisplayMode={table.customerAppDisplayMode}
                setCustomerAppDisplayMode={table.setCustomerAppDisplayMode}
                priceVisibilityMode={table.priceVisibilityMode}
                setPriceVisibilityMode={table.setPriceVisibilityMode}
                builtinThemes={BUILTIN_THEMES}
                activeTheme={config.customerTheme}
                setActiveTheme={config.setCustomerTheme}
                merchantTheme={config.merchantTheme}
                setMerchantTheme={config.setMerchantTheme}
                aiStylesheetInput={aiStylesheetInput}
                setAiStylesheetInput={setAiStylesheetInput}
                handleExportThemeFile={handleExportThemeFile}
                handleImportThemeFile={handleImportThemeFile}
                handleApplyAIThemeString={handleApplyAIThemeString}
                customerProfiles={customerProfiles}
                productCatalog={productCatalog}
                viewportMode={config.viewportMode}
              />
            )}

            <Suspense fallback={null}>
              {activeStaffSurface === 'warehouse-mgmt' && (
                <WarehouseManagementView bookId={sync.hfeCompanyProfile.companyBookId} />
              )}
              {activeStaffSurface === 'branch-mgmt' && (
                <BranchManagementView bookId={sync.hfeCompanyProfile.companyBookId} />
              )}
              {activeStaffSurface === 'scan-go' && <ScanAndGoView />}
              {activeStaffSurface === 'sommelier' && <SommelierView />}
              {activeStaffSurface === 'maitre-d' && <MaitreDView />}
              {activeStaffSurface === 'customer-crm' && <CustomerContactsView />}
              {activeStaffSurface === 'admin-hub' && (
                <AdminMerchantUserView onBackToPos={() => setActiveStaffSurface('barista-pos')} />
              )}
              {activeStaffSurface === 'merchant-hub' && (
                <MerchantHomeHubView onBackToPos={() => setActiveStaffSurface('barista-pos')} />
              )}
            </Suspense>
          </div>
        )}

        {config.activeApp === 'customer-portal' && (
          <CustomerPortalView
            hfeCompanyProfile={sync.hfeCompanyProfile}
            onBackToMenu={() => config.setActiveApp('customer')}
            onBackToLanding={() => config.setActiveApp('landing')}
          />
        )}

        <Suspense fallback={null}>
          {(config.activeApp === 'gallery' || activeStaffSurface === 'gallery' || config.activeApp === 'design-system') && (
            <NativeComponentGalleryView />
          )}

          {config.activeApp === 'hfeit-corporate' && (
            <HfeitCorporateView onNavigateToApp={(app: any) => config.setActiveApp(app)} />
          )}
        </Suspense>
      </div>

      {/* DEV-ONLY FLOATING QUICK SETTINGS (AUTOMATICALLY STRIPPED IN PROD) */}
      <GlobalModals
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        isCustomerSessionActive={isCustomerSessionActive}
        sync={sync}
        table={table}
        cart={cart}
        selectedRecipeBOM={selectedRecipeBOM}
        setSelectedRecipeBOM={setSelectedRecipeBOM}
        customerProfiles={customerProfiles}
        setCustomerProfiles={setCustomerProfiles}
        setQrStepView={setQrStepView}
      />
    </div>
  )
}

function SocialCallbackApp() {
  const auth = usePosAuth()
  return <ToGrowSocialCallbackView complete={auth.completeSocialLogin} />
}

export default function App() {
  if (typeof window !== 'undefined' && window.location.pathname === '/auth/callback') {
    return <AppProviders><SocialCallbackApp /></AppProviders>
  }
  return <AppProviders><AppMain /></AppProviders>
}
