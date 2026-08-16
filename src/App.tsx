import React, { useState, useEffect } from 'react'
import { LanguageProvider } from './context/LanguageContext'
import { MerchantConfigProvider, useMerchantConfig } from './context/MerchantConfigContext'
import { ViewportProvider } from './context/ViewportContext'
import { FloatKit } from './components/dev/FloatKit'
import { StaffSubNavigator } from './components/common/StaffSubNavigator'
import { GlobalModals } from './components/modals/GlobalModals'
import { useHfeSync } from './hooks/useHfeSync'
import { useTableState } from './hooks/useTableState'
import { useCart } from './hooks/useCart'
import { LandingView } from './views/LandingView'
import { CustomerMobileView } from './views/CustomerMobileView'
import { UnifiedPosView } from './views/UnifiedPosView'
import { StaffWorkstationView } from './views/StaffWorkstationView'
import { UnifiedKdsView } from './views/UnifiedKdsView'
import { CustomerFacingDisplayView } from './views/CustomerFacingDisplayView'
import { CafeSettingsView } from './views/CafeSettingsView'
import { WarehouseManagementView } from './views/WarehouseManagementView'
import { BranchManagementView } from './views/BranchManagementView'
import { ScanAndGoView } from './views/ScanAndGoView'
import { SommelierView } from './views/SommelierView'
import { MaitreDView } from './views/MaitreDView'
import { CustomerContactsView } from './views/CustomerContactsView'
import { ComponentShowcaseView } from './views/ComponentShowcaseView'
import { HfeInsightsView } from './views/HfeInsightsView'

import { BUILTIN_THEMES, PRODUCT_CATALOG, INITIAL_ORDERS, INITIAL_CUSTOMER_PROFILES, STATIONS } from './data/mockData'
import { StaffSurfaceMode, KdsViewModeType, MenuItem, OrderTicket } from './types/pos'

function AppMain() {
  const config = useMerchantConfig()
  const [activeStaffSurface, setActiveStaffSurface] = useState<StaffSurfaceMode>('barista-pos')
  const [qrStepView, setQrStepView] = useState<'catalog' | 'checkout'>('catalog')
  const [isCustomerSessionActive] = useState<boolean>(true)
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false)
  const [aiStylesheetInput, setAiStylesheetInput] = useState<string>('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2500)
  }

  // State hooks
  const sync = useHfeSync()
  const [orders, setOrders] = useState<OrderTicket[]>(INITIAL_ORDERS)
  const table = useTableState({ orders, setOrders, hfeCompanyProfile: sync.hfeCompanyProfile })

  const handleSettleOpenTab = (tableName: string, details: any) => {
    table.setTablesGrid((prev) => prev.map(t => {
      if (t.name === tableName) {
        return {
          ...t,
          status: 'occupied',
          totalBill: 0,
          orderCount: 0,
          customerName: `${(t.customerName || 'Tamu').replace(' (Lunas)', '')} (Lunas)`
        }
      }
      return t
    }))
    setOrders((prev) => prev.map(o => o.table === tableName ? { ...o, status: 'served' as const } : o))
    cart.setLoyaltyPoints((prev) => prev + (details?.pointsEarned || Math.floor((details?.paidAmount || 50000) / 1000)))
    showToast(`🎉 Pembayaran Meja ${tableName} Lunas (Rp ${(details?.paidAmount || 0).toLocaleString('id-ID')})!`)
  }

  const cart = useCart({
    productCatalog: PRODUCT_CATALOG,
    hfeCompanyProfile: sync.hfeCompanyProfile,
    onOrderSubmitted: (newOrder) => {
      setOrders((prev) => [newOrder, ...prev])
      table.setTablesGrid((prev) => prev.map(t => {
        if (t.name === newOrder.table) {
          return {
            ...t,
            status: newOrder.policy === 'open-tab' ? 'open-tab' : 'occupied',
            customerName: newOrder.customerName || t.customerName || 'Tamu',
            totalBill: (t.totalBill || 0) + newOrder.total,
            orderCount: (t.orderCount || 0) + newOrder.items.length
          }
        }
        return t
      }))
      showToast(`🛎️ Pesanan ${newOrder.table} terkirim ke KDS Dapur!`)
    }
  })

  // App-level state
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
      setOrders(INITIAL_ORDERS)
      showToast('🔄 Status meja dan pesanan berhasil di-reset!')
    })
  }, [])

  // Synchronize cart paymentPolicy with single door
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
      } catch (err) {
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
    } catch (err) {
      showToast('❌ Format JSON tidak valid.')
    }
  }

  const effectiveTheme = config.customerTheme

  return (
    <div className="h-[100dvh] w-full bg-slate-950 text-slate-100 flex flex-col font-sans select-none relative overflow-hidden">
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
        .theme-customer-container { background-color: var(--brand-bg) !important; color: var(--brand-text) !important; font-family: var(--brand-font) !important; }
        .theme-customer-header { background-color: var(--brand-header-bg) !important; border-radius: 0 !important; }
        .theme-customer-card { background-color: var(--brand-card-bg) !important; border-radius: var(--brand-radius) !important; }
        .theme-customer-btn-primary { background-color: var(--brand-primary) !important; color: ${effectiveTheme.mode === 'light' ? '#ffffff' : '#020617'} !important; border-radius: calc(var(--brand-radius) * 0.75) !important; }
        .theme-customer-btn-primary:hover { background-color: var(--brand-primary-hover) !important; }
        .theme-customer-badge { background-color: var(--brand-badge-bg) !important; color: var(--brand-badge-text) !important; }
        ${effectiveTheme.customCssOverrides || ''}
      `}</style>

      {/* PURE NATIVE VIEWPORT APPLICATION CONTAINER */}
      <div className="flex-1 min-h-0 flex flex-col h-full overflow-hidden w-full relative">
        {config.activeApp === 'landing' && (
          <LandingView
            hfeCompanyProfile={sync.hfeCompanyProfile}
            productCatalog={PRODUCT_CATALOG}
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
            loginType={cart.loginType}
            customerPhone={cart.customerPhone}
            guestName={cart.guestName}
            customerAvatar={cart.customerAvatar}
            setCustomerAvatar={cart.setCustomerAvatar}
            loyaltyPoints={cart.loyaltyPoints}
            productCatalog={PRODUCT_CATALOG}
            reservationPolicyMode={table.reservationPolicyMode}
            priceVisibilityMode={table.priceVisibilityMode}
            customerAppDisplayMode={table.customerAppDisplayMode}
            cart={cart.cart}
            totalCartCount={cart.totalCartCount}
            grandTotalBill={cart.grandTotalBill}
            previousOrders={orders}
            tablesGrid={table.tablesGrid}
            qrStepView={qrStepView}
            promoCodeInput={cart.promoCodeInput}
            appliedPromo={cart.appliedPromo}
            redeemedVoucher={cart.redeemedVoucher}
            serviceFeeRate={cart.serviceFeeRate}
            calculatedServiceFee={cart.calculatedServiceFee}
            taxPB1Mode={cart.taxPB1Mode}
            calculatedPB1Tax={cart.calculatedPB1Tax}
            selectedTipAmount={cart.selectedTipAmount}
            paymentPolicy={config.paymentPolicy}
            rawSubtotal={cart.rawSubtotal}
            setShowReservationModal={table.setShowReservationModal}
            setShowLoginModal={setShowLoginModal}
            setQrStepView={setQrStepView}
            setPromoCodeInput={cart.setPromoCodeInput}
            setSelectedTipAmount={cart.setSelectedTipAmount}
            setPaymentPolicy={config.setPaymentPolicy}
            handleReorderSameItem={cart.handleAddToCart}
            handleAddToCart={cart.handleAddToCart}
            handleUpdateQty={cart.handleUpdateQty}
            handleApplyPromo={cart.handleApplyPromo}
            handleSubmitOrder={() => cart.handleSubmitOrder(table.selectedTable, setQrStepView)}
            onSettleOpenTab={handleSettleOpenTab}
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

        {config.activeApp === 'cafe' && (
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
                productCatalog={PRODUCT_CATALOG}
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

            {activeStaffSurface === 'hfe-insights' && (
              <HfeInsightsView
                productCatalog={PRODUCT_CATALOG}
                orders={orders}
                tablesGrid={table.tablesGrid}
                cashDrawerFloat={cashDrawerFloat}
              />
            )}

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
                productCatalog={PRODUCT_CATALOG}
                viewportMode={config.viewportMode}
              />
            )}

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
          </div>
        )}

        {config.activeApp === 'design-system' && <ComponentShowcaseView />}
      </div>

      {/* DEV-ONLY FLOATING QUICK SETTINGS (AUTOMATICALLY STRIPPED IN PROD) */}
      <FloatKit
        activeStaffSurface={activeStaffSurface}
        setActiveStaffSurface={setActiveStaffSurface}
      />

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

export default function App() {
  return (
    <LanguageProvider>
      <MerchantConfigProvider>
        <ViewportProvider viewportMode="responsive">
          <AppMain />
        </ViewportProvider>
      </MerchantConfigProvider>
    </LanguageProvider>
  )
}
