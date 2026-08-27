import React, { useState, useMemo } from 'react'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { TableStatus, MenuItem, OrderTicket, StaffSurfaceMode, CartItem, PosPayMethod, ViewportModeType, PropertyZoneId, OrderFulfillmentMode, ParkedOperationTab } from '../types/pos'
import { PROPERTY_ZONES } from '../data/mockData'
import { PosFavoritesBar } from '../components/pos/PosFavoritesBar'
import { PosCatalogGrid } from '../components/pos/PosCatalogGrid'
import { PosCartSection } from '../components/pos/PosCartSection'
import { PosTableFloorPlanSection } from '../components/pos/PosTableFloorPlanSection'
import { PosMobileCartDrawer } from '../components/pos/PosMobileCartDrawer'
import { PosCommandHeader } from '../components/pos/PosCommandHeader'
import { PosBookingReservationsSection } from '../components/pos/PosBookingReservationsSection'
import { UnifiedPosModalsCluster } from '../components/pos/UnifiedPosModalsCluster'
import { FinancialStatusBanner } from '../components/pos/FinancialStatusBanner'
import { ActiveOperationsTrayDock } from '../components/pos/ActiveOperationsTrayDock'
import { useSpotlightShortcuts } from '../hooks/useSpotlightShortcuts'
import { useOperationsTray } from '../hooks/useOperationsTray'
import { useTranslation } from '../context/LanguageContext'
import { useViewport } from '../context/ViewportContext'
import { useMerchantConfig } from '../context/MerchantConfigContext'
import { smartSearchFilter } from '../utils/searchThesaurus'
import type { HfePosFinancialPort } from '../services/financial'
import { useCafeSettlement } from '../hooks/useCafeSettlement'

export interface UnifiedPosViewProps {
  activeStaffSurface: StaffSurfaceMode; tablesGrid: TableStatus[]; selectedPOSTable: TableStatus | null
  productCatalog: MenuItem[]; posPayMethod: PosPayMethod; posCashGiven: string; cashDrawerFloat: number
  orders: OrderTicket[]; enableTableFloorPlan?: boolean; viewportMode?: ViewportModeType
  setActiveStaffSurface?: (surface: StaffSurfaceMode) => void; setShowTableReassignModal: (show: boolean) => void
  setSelectedPOSTable: (table: TableStatus | null) => void; setTablesGrid: React.Dispatch<React.SetStateAction<TableStatus[]>>
  setPosPayMethod: (method: PosPayMethod) => void; setPosCashGiven: (val: string) => void
  handlePOSCheckoutTable: () => void; handleMoveStatus: (orderId: string, targetStatus: OrderTicket['status']) => void
  financialPort: HfePosFinancialPort; organizationId: string; companyBookId: string; authorityContext: string; cashierId: string
}

export const UnifiedPosView: React.FC<UnifiedPosViewProps> = ({
  activeStaffSurface = 'barista-pos', setActiveStaffSurface, tablesGrid, selectedPOSTable, productCatalog,
  posPayMethod, posCashGiven, orders, enableTableFloorPlan = true, viewportMode = 'responsive',
  setSelectedPOSTable, setTablesGrid, setPosPayMethod, setPosCashGiven, handlePOSCheckoutTable,
  financialPort, organizationId, companyBookId, authorityContext, cashierId,
}) => {
  const { isMobile: isContextMobile } = useViewport()
  const isMobile = viewportMode === 'mobile' || isContextMobile
  const { t, formatPrice } = useTranslation()
  const { workflowToggles, pb1TaxMode, takeawaySurcharge } = useMerchantConfig()
  const initialMode = workflowToggles?.defaultPosMode || (enableTableFloorPlan ? 'tables' : 'catalog')
  const [posModeTab, setPosModeTab] = useState<'tables' | 'catalog' | 'booking'>(initialMode)
  const [fulfillmentMode, setFulfillmentMode] = useState<OrderFulfillmentMode>('dine_in')
  const [tableStatusFilter, setTableStatusFilter] = useState<'all' | 'unpaid' | 'paid' | 'available'>('all')
  const [selectedZoneId, setSelectedZoneId] = useState<PropertyZoneId>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false)
  const [showCameraScanner, setShowCameraScanner] = useState(false)
  const [directQtyItem, setDirectQtyItem] = useState<{ item: CartItem; index: number } | null>(null)
  const [showTableOpsModal, setShowTableOpsModal] = useState(false)
  const [showRoomChargeModal, setShowRoomChargeModal] = useState(false)
  const [showTableDetailDrawer, setShowTableDetailDrawer] = useState(false)
  const [showTableGuestBindingDrawer, setShowTableGuestBindingDrawer] = useState(false)
  const [showEditPinnedModal, setShowEditPinnedModal] = useState(false)
  const [showMobileCartDrawer, setShowMobileCartDrawer] = useState(false)
  const [showNotificationCenter, setShowNotificationCenter] = useState(false)
  const [showServiceTickets, setShowServiceTickets] = useState(false)
  const [showEventTicketCheckIn, setShowEventTicketCheckIn] = useState(false)
  const [showSpotlightModal, setShowSpotlightModal] = useState(false)

  const [reassignFromTable, setReassignFromTable] = useState('OUT-04')
  const [reassignTargetTable, setReassignTargetTable] = useState('IND-01')
  const [viewMode, setViewMode] = useState<'grid' | 'compact' | 'list'>('grid')
  const [pinnedItemIds, setPinnedItemIds] = useState<string[]>(() => productCatalog.slice(0, 12).map((i) => i.id))
  const pinnedFavorites = useMemo(() => productCatalog.filter((item) => pinnedItemIds.includes(item.id)), [productCatalog, pinnedItemIds])

  const handleTableClick = (table: TableStatus) => {
    setSelectedPOSTable(table)
    if (table.status === 'occupied' || table.status === 'open-tab') {
      setShowTableDetailDrawer(true)
    } else {
      // 1-Tap Fast Checkout: Empty table immediately routes to Product Catalog
      setPosModeTab('catalog')
    }
  }

  const categories = useMemo(() => ['all', ...Array.from(new Set(productCatalog.map((i) => i.category)))], [productCatalog])

  const filteredCatalog = useMemo(() => {
    return smartSearchFilter(productCatalog, searchQuery, selectedCategory)
  }, [productCatalog, selectedCategory, searchQuery])

  const handleAddToCart = (menuItem: MenuItem) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((c) => c.id === menuItem.id)
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx].quantity += 1
        return copy
      }
      return [...prev, { ...menuItem, quantity: 1 }]
    })
  }

  const handleUpdateQty = (index: number, newQty: number) => {
    if (newQty <= 0) setCartItems((prev) => prev.filter((_, i) => i !== index))
    else setCartItems((prev) => prev.map((item, i) => (i === index ? { ...item, quantity: newQty } : item)))
  }

  const handleScanSuccess = (barcode: string) => {
    const matched = productCatalog.find((p) => p.id === barcode || p.hfeCategoryCode === barcode)
    handleAddToCart(matched || productCatalog[0])
  }

  const activeTableCartItems = useMemo<CartItem[]>(() => {
    if (cartItems.length > 0) return cartItems
    if (selectedPOSTable && (selectedPOSTable.status === 'occupied' || selectedPOSTable.status === 'open-tab')) {
      const tableOrders = orders.filter((o) =>
        selectedPOSTable.orderIds?.includes(o.id) ||
        o.table === selectedPOSTable.name ||
        o.table === selectedPOSTable.id ||
        o.table?.includes(selectedPOSTable.name)
      )
      const extracted: CartItem[] = []
      tableOrders.forEach((ord) => { if (ord.items) extracted.push(...ord.items) })
      if (extracted.length > 0) return extracted
    }
    return []
  }, [cartItems, selectedPOSTable, orders, productCatalog])

  const packagingFee = fulfillmentMode === 'takeaway' ? takeawaySurcharge : 0
  const subtotal = useMemo(() => activeTableCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0), [activeTableCartItems])
  const pb1Tax = useMemo(() => pb1TaxMode === 0 ? 0 : Math.round(subtotal * 0.1), [pb1TaxMode, subtotal])
  const grandTotal = useMemo(() => (cartItems.length > 0 || !selectedPOSTable ? subtotal + pb1Tax + packagingFee : selectedPOSTable.totalBill || (subtotal + pb1Tax + packagingFee)), [cartItems, selectedPOSTable, subtotal, pb1Tax, packagingFee])
  const totalCartItemsCount = useMemo(() => activeTableCartItems.reduce((acc, item) => acc + item.quantity, 0), [activeTableCartItems])
  const unpaidCount = useMemo(() => tablesGrid.filter((t) => (t.status === 'open-tab' || t.status === 'occupied') && t.totalBill > 0).length, [tablesGrid])
  const paidCount = useMemo(() => tablesGrid.filter((t) => t.customerName?.includes('(Lunas)') || (t.status === 'occupied' && t.totalBill === 0)).length, [tablesGrid])
  const availableCount = useMemo(() => tablesGrid.filter((t) => t.status === 'free').length, [tablesGrid])

  const { financialStatus, financialNotice, financialFailureCode, postingTruthHref, handleCheckout: handleCheckoutAction, resumeCheckout } = useCafeSettlement({
    financialPort, organizationId, companyBookId, authorityContext, cashierId,
    selectedTable: selectedPOSTable, orders, items: activeTableCartItems,
    fulfillmentMode, paymentMethod: posPayMethod,
    formatPrice,
    commitPaidState: () => { if (selectedPOSTable) handlePOSCheckoutTable() },
    clearCart: () => { setCartItems([]); setPosCashGiven(''); setShowMobileCartDrawer(false) },
  })

  const handleCloseAllModals = () => {
    setShowSpotlightModal(false); setShowCameraScanner(false); setShowTableOpsModal(false); setShowRoomChargeModal(false)
    setShowTableDetailDrawer(false); setShowTableGuestBindingDrawer(false); setShowEditPinnedModal(false); setShowMobileCartDrawer(false)
    setIsAppDrawerOpen(false); setShowNotificationCenter(false); setShowServiceTickets(false); setShowEventTicketCheckIn(false); setDirectQtyItem(null)
  }

  useSpotlightShortcuts({
    onOpenSpotlight: () => setShowSpotlightModal(true),
    onCloseModals: handleCloseAllModals,
    onFocusCatalog: () => setPosModeTab('catalog'),
    onToggleFloorPlan: () => { if (enableTableFloorPlan) setPosModeTab((p) => (p === 'tables' ? 'catalog' : 'tables')) },
    onQuickPayCash: () => { setPosPayMethod('cash'); handleCheckoutAction() },
    onQuickPayQris: () => { setPosPayMethod('qris'); handleCheckoutAction() },
    onSplitBill: () => setShowTableOpsModal(true),
    onPrintReceipt: () => { if (activeTableCartItems.length > 0 || (selectedPOSTable && selectedPOSTable.totalBill > 0)) handleCheckoutAction() }
  })

  const handleConfirmReassignWithReason = (_reason?: string) => {
    const src = tablesGrid.find((t) => t.name === reassignFromTable)
    if (!src) return
    setTablesGrid((prev) => prev.map((t) => {
      if (t.name === reassignFromTable) return { ...t, status: 'free', totalBill: 0, orderCount: 0, customerName: undefined }
      if (t.name === reassignTargetTable) return { ...t, status: 'occupied', totalBill: src.totalBill, orderCount: src.orderCount, customerName: src.customerName }
      return t
    }))
    if (selectedPOSTable?.name === reassignFromTable) {
      const tgt = tablesGrid.find((t) => t.name === reassignTargetTable)
      if (tgt) setSelectedPOSTable({ ...tgt, status: 'occupied', totalBill: src.totalBill, orderCount: src.orderCount, customerName: src.customerName })
    }
    setShowTableOpsModal(false)
  }

  const handleConfirmRoomCharge = (payload: { roomNumber: string; guestName: string; totalCharged: number }) => {
    setShowRoomChargeModal(false); setCartItems([]); setPosCashGiven(''); setShowMobileCartDrawer(false)
    alert(`🏨 Room Folio Charge Berhasil!\nKamar: ${payload.roomNumber} (${payload.guestName})\nTotal: ${formatPrice(payload.totalCharged)}\nTerposting ke GL 1104 Piutang Tamu Hotel.`)
  }

  const operationsTray = useOperationsTray()

  const handleParkCurrentCart = () => {
    if (activeTableCartItems.length === 0) return
    operationsTray.parkCurrentCart({
      items: activeTableCartItems,
      fulfillmentMode,
      tableName: selectedPOSTable?.name,
      rawSubtotal: subtotal,
      packagingFee
    })
    setCartItems([])
    setPosCashGiven('')
    setShowMobileCartDrawer(false)
  }

  const handleRestoreParkedTab = (tab: ParkedOperationTab) => {
    setCartItems(tab.items)
    setFulfillmentMode(tab.fulfillmentMode)
    if (tab.tableName) {
      const matched = tablesGrid.find((t) => t.name === tab.tableName)
      if (matched) setSelectedPOSTable(matched)
    }
    operationsTray.discardParkedTab(tab.id)
    setPosModeTab('catalog')
  }

  const isImageUrl = (url?: string) => Boolean(url && (url.startsWith('http') || url.startsWith('/') || url.includes('unsplash.com')))

  return (
    <div
      data-financial-status={financialStatus}
      data-financial-failure-code={financialFailureCode || undefined}
      className="relative flex-1 min-h-0 flex flex-col h-full overflow-hidden w-full bg-slate-100 dark:bg-slate-950"
    >
      <FinancialStatusBanner status={financialStatus} notice={financialNotice} failureCode={financialFailureCode} onResume={resumeCheckout} postingTruthHref={postingTruthHref} />
      <main className={`flex-1 min-h-0 w-full max-w-7xl mx-auto p-2.5 sm:p-4 gap-2 sm:gap-4 ${
        isMobile
          ? 'flex flex-col overflow-hidden'
          : 'grid grid-cols-12 overflow-hidden'
      }`}>
        <div className={isMobile ? 'w-full h-full min-h-0 flex flex-col gap-2 overflow-hidden' : 'md:col-span-7 lg:col-span-8 flex flex-col h-full min-h-0 gap-2 overflow-hidden'}>
          <div className="shrink-0 z-20">
            <PosCommandHeader
              posModeTab={posModeTab}
              enableTableFloorPlan={enableTableFloorPlan}
              setPosModeTab={setPosModeTab}
              onOpenAppDrawer={() => setIsAppDrawerOpen(true)}
              onOpenGuestBinding={() => setShowTableGuestBindingDrawer(true)}
              onOpenScanner={() => setShowCameraScanner(true)}
              onOpenTableOps={() => setShowTableOpsModal(true)}
              onOpenNotifications={() => setShowNotificationCenter(true)}
              onOpenSpotlight={() => setShowSpotlightModal(true)}
              propertyZones={PROPERTY_ZONES}
              activeZoneId={selectedZoneId}
              onSelectZone={setSelectedZoneId}
              tableStatusFilter={tableStatusFilter}
              setTableStatusFilter={setTableStatusFilter}
              unpaidCount={unpaidCount}
              availableCount={availableCount}
              tablesGrid={tablesGrid}
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              catalogSkuCount={filteredCatalog.length}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y pr-1 custom-scrollbar pb-36">
            {posModeTab === 'booking' && (
              <PosBookingReservationsSection
                onCheckInReservation={(rsv) => {
                  const target = tablesGrid.find(t => t.name === 'VIP-01' || t.name === 'OUT-03' || t.name === 'IND-01')
                  if (target) {
                    setSelectedPOSTable({
                      ...target,
                      status: 'occupied',
                      customerName: rsv.customerName,
                      totalBill: 0,
                      orderCount: 0
                    })
                    setPosModeTab('catalog')
                  }
                }}
              />
            )}

            {posModeTab === 'tables' && (
              <PosTableFloorPlanSection
                tablesGrid={tablesGrid}
                selectedPOSTable={selectedPOSTable}
                tableStatusFilter={tableStatusFilter}
                selectedZoneId={selectedZoneId}
                setSelectedZoneId={setSelectedZoneId}
                propertyZones={PROPERTY_ZONES}
                unpaidCount={unpaidCount}
                paidCount={paidCount}
                availableCount={availableCount}
                isMobile={isMobile}
                viewMode={viewMode}
                setTableStatusFilter={setTableStatusFilter}
                handleTableClick={handleTableClick}
                onOpenTableOpsModal={() => setShowTableOpsModal(true)}
              />
            )}

            {posModeTab === 'catalog' && (
              <PosCatalogGrid
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                filteredCatalog={filteredCatalog}
                isImageUrl={isImageUrl}
                isMobile={isMobile}
                viewMode={viewMode}
                onAddToCart={handleAddToCart}
                cartItems={activeTableCartItems}
                onUpdateQty={handleUpdateQty}
              />
            )}
          </div>

          {/* 3. QUICK ACTION / SPEED KEYS: ONLY ON WIDE VIEW (TABLET & DESKTOP) */}
          {!isMobile && (
            <div className="shrink-0 hidden md:block">
              <PosFavoritesBar
                pinnedFavorites={pinnedFavorites}
                isImageUrl={isImageUrl}
                isMobile={isMobile}
                onAddToCart={handleAddToCart}
                onEditPinnedMenu={() => setShowEditPinnedModal(true)}
              />
            </div>
          )}
        </div>

        {!isMobile && (
          <div className="hidden md:flex md:col-span-5 lg:col-span-4 h-full min-h-0 flex-col overflow-hidden">
            <PosCartSection
              cartItems={activeTableCartItems}
              selectedPOSTable={selectedPOSTable}
              posPayMethod={posPayMethod}
              posCashGiven={posCashGiven}
              subtotal={subtotal}
              pb1Tax={pb1Tax}
              grandTotal={grandTotal}
              packagingFee={packagingFee}
              fulfillmentMode={fulfillmentMode}
              setPosPayMethod={setPosPayMethod}
              setPosCashGiven={setPosCashGiven}
              setFulfillmentMode={setFulfillmentMode}
              onUpdateQty={handleUpdateQty}
              onOpenDirectQtyModal={(item, index) => setDirectQtyItem({ item, index })}
              onCheckout={handleCheckoutAction}
              onOpenSplitPayment={() => setShowTableOpsModal(true)}
              onSwitchToCatalog={() => setPosModeTab('catalog')}
            />
          </div>
        )}
      </main>

      {/* MOBILE & TABLET PORTRAIT PERSISTENT SMART BOTTOM DOCK */}
      {isMobile && (
        <div
          className="absolute bottom-0 inset-x-0 z-40 px-3.5 pt-4 pb-[max(env(safe-area-inset-bottom,16px),16px)] flex justify-center pointer-events-none animate-slideUp lg:hidden"
          style={{ background: 'linear-gradient(to top, rgba(2, 6, 23, 0.98) 70%, rgba(2, 6, 23, 0.85) 85%, transparent 100%)' }}
        >
          {((activeTableCartItems.length > 0 && grandTotal > 0) || (selectedPOSTable && selectedPOSTable.totalBill > 0)) ? (
            <button
              type="button"
              onClick={() => setShowMobileCartDrawer(true)}
              className="w-full max-w-md bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center justify-between font-bold text-xs border border-emerald-400/60 transition-all touch-manipulation pointer-events-auto backdrop-blur-md active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="bg-slate-950 text-emerald-400 px-2.5 py-1 rounded-xl text-xs font-mono font-black shrink-0 shadow-sm">
                  {totalCartItemsCount > 0 ? `${totalCartItemsCount}x` : `${selectedPOSTable?.orderCount || 1}x`}
                </div>
                <div className="flex flex-col text-left leading-tight min-w-0">
                  <span className="font-black text-sm font-mono whitespace-nowrap text-slate-950">
                    {formatPrice(grandTotal > 0 ? grandTotal : (selectedPOSTable?.totalBill || 0))}
                  </span>
                  {selectedPOSTable && (
                    <span className="text-[10px] text-slate-900/80 font-bold font-mono truncate max-w-[150px]">
                      {selectedPOSTable.name} {selectedPOSTable.customerName ? `• ${selectedPOSTable.customerName}` : ''}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-950 text-white hover:bg-slate-900 px-3.5 py-2 rounded-xl text-xs font-black shrink-0 shadow-md">
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                <span>{fulfillmentMode === 'takeaway' ? `${t.cart.takeawayModeLabel} • ${t.cart.payAction} ➔` : t.cart.payAction}</span>
                {fulfillmentMode !== 'takeaway' && <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
            </button>
          ) : posModeTab === 'tables' ? (
            <button
              type="button"
              onClick={() => {
                setSelectedPOSTable(null)
                setPosModeTab('catalog')
              }}
              className="w-full max-w-md bg-slate-900/90 hover:bg-slate-800 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center justify-between font-bold text-xs border border-slate-700/60 transition-all touch-manipulation pointer-events-auto backdrop-blur-md active:scale-[0.98] cursor-pointer group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-lg text-xs font-bold shrink-0">
                  🛍️ {t.cart.takeawayLabel}
                </div>
                <span className="text-xs text-slate-300 truncate">
                  {t.cart.quickOrderLabel}
                </span>
              </div>
              <div className="flex items-center gap-1 text-amber-400 text-xs font-black shrink-0 group-hover:translate-x-0.5 transition-transform">
                <span>{t.cart.openMenuAction}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowMobileCartDrawer(true)}
              className="w-full max-w-md bg-slate-900/90 hover:bg-slate-800 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center justify-between font-bold text-xs border border-slate-700/60 transition-all touch-manipulation pointer-events-auto backdrop-blur-md active:scale-[0.98] cursor-pointer group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded-lg text-xs font-mono font-bold shrink-0">
                  0x
                </div>
                <span className="text-xs text-slate-300 truncate">
                  {selectedPOSTable ? `${t.customer.tableNo} ${selectedPOSTable.name}` : t.cart.emptyCartLabel}
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-400 text-xs font-bold shrink-0">
                <span>{t.cart.viewCartAction}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          )}
        </div>
      )}

      {/* 3. ACTIVE OPERATIONS TRAY (CLICKUP TASK TRAY PATTERN) */}
      <ActiveOperationsTrayDock
        parkedTabs={operationsTray.parkedTabs}
        onRestoreTab={handleRestoreParkedTab}
        onDiscardTab={operationsTray.discardParkedTab}
        onClearAllTabs={operationsTray.clearAllParkedTabs}
        onParkCurrentCart={handleParkCurrentCart}
        hasActiveCartItems={activeTableCartItems.length > 0}
      />


      <PosMobileCartDrawer
        show={showMobileCartDrawer} cartItems={activeTableCartItems} selectedPOSTable={selectedPOSTable}
        posPayMethod={posPayMethod} posCashGiven={posCashGiven} subtotal={subtotal} pb1Tax={pb1Tax} grandTotal={grandTotal}
        packagingFee={packagingFee} fulfillmentMode={fulfillmentMode} onClose={() => setShowMobileCartDrawer(false)}
        setPosPayMethod={setPosPayMethod} setPosCashGiven={setPosCashGiven} setFulfillmentMode={setFulfillmentMode}
        onUpdateQty={handleUpdateQty} onOpenDirectQtyModal={(item, index) => setDirectQtyItem({ item, index })}
        onCheckout={handleCheckoutAction} onOpenSplitPayment={() => setShowTableOpsModal(true)}
        onToggleOrderMode={() => {
          if (selectedPOSTable) setSelectedPOSTable(null)
          else { setShowMobileCartDrawer(false); setPosModeTab('tables') }
        }}
        onSwitchToCatalog={() => { setShowMobileCartDrawer(false); setPosModeTab('catalog') }}
      />

      <UnifiedPosModalsCluster
        showCameraScanner={showCameraScanner} setShowCameraScanner={setShowCameraScanner}
        handleScanSuccess={handleScanSuccess} directQtyItem={directQtyItem} setDirectQtyItem={setDirectQtyItem}
        handleUpdateQty={handleUpdateQty} showTableOpsModal={showTableOpsModal} setShowTableOpsModal={setShowTableOpsModal}
        tablesGrid={tablesGrid} reassignFromTable={reassignFromTable} setReassignFromTable={setReassignFromTable}
        reassignTargetTable={reassignTargetTable} setReassignTargetTable={setReassignTargetTable}
        handleConfirmReassignWithReason={handleConfirmReassignWithReason}
        showRoomChargeModal={showRoomChargeModal} setShowRoomChargeModal={setShowRoomChargeModal}
        grandTotal={grandTotal} subtotal={subtotal} pb1Tax={pb1Tax} selectedPOSTable={selectedPOSTable}
        handleConfirmRoomCharge={handleConfirmRoomCharge}
        showTableDetailDrawer={showTableDetailDrawer} setShowTableDetailDrawer={setShowTableDetailDrawer}
        setPosModeTab={setPosModeTab} setShowMobileCartDrawer={setShowMobileCartDrawer}
        showTableGuestBindingDrawer={showTableGuestBindingDrawer} setShowTableGuestBindingDrawer={setShowTableGuestBindingDrawer}
        setSelectedPOSTable={setSelectedPOSTable}
        showEditPinnedModal={showEditPinnedModal} setShowEditPinnedModal={setShowEditPinnedModal}
        productCatalog={productCatalog} pinnedItemIds={pinnedItemIds} setPinnedItemIds={setPinnedItemIds}
        isAppDrawerOpen={isAppDrawerOpen} setIsAppDrawerOpen={setIsAppDrawerOpen}
        activeStaffSurface={activeStaffSurface} setActiveStaffSurface={setActiveStaffSurface}
        showNotificationCenter={showNotificationCenter} setShowNotificationCenter={setShowNotificationCenter}
        showServiceTickets={showServiceTickets} setShowServiceTickets={setShowServiceTickets}
        showEventTicketCheckIn={showEventTicketCheckIn} setShowEventTicketCheckIn={setShowEventTicketCheckIn}
        showSpotlightModal={showSpotlightModal} setShowSpotlightModal={setShowSpotlightModal}
        handleAddToCart={handleAddToCart} handleTableClick={handleTableClick}
      />
    </div>
  )
}
export default UnifiedPosView
