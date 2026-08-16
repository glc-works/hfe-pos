import React, { useState, useMemo } from 'react'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { TableStatus, MenuItem, OrderTicket, StaffSurfaceMode, CartItem, PosPayMethod, ViewportModeType, PropertyZoneId } from '../types/pos'
import { PROPERTY_ZONES } from '../data/mockData'
import { DirectQtyInputModal } from '../components/pos/DirectQtyInputModal'
import { CashierCameraScannerModal } from '../components/pos/CashierCameraScannerModal'
import { TableOpsModal } from '../components/tables/TableOpsModal'
import { TableDetailDrawer } from '../components/tables/TableDetailDrawer'
import { TableGuestBindingDrawer } from '../components/tables/TableGuestBindingDrawer'
import { RoomChargeModal } from '../components/pos/RoomChargeModal'
import { PosFavoritesBar } from '../components/pos/PosFavoritesBar'
import { PosCatalogGrid } from '../components/pos/PosCatalogGrid'
import { PosCartSection } from '../components/pos/PosCartSection'
import { PosTableFloorPlanSection } from '../components/pos/PosTableFloorPlanSection'
import { PosMobileCartDrawer } from '../components/pos/PosMobileCartDrawer'
import { EditPinnedFavoritesModal } from '../components/pos/EditPinnedFavoritesModal'
import { PosCommandHeader } from '../components/pos/PosCommandHeader'
import { StaffAppDrawerModal } from '../components/common/StaffAppDrawerModal'
import { SpotlightOmniSearchModal } from '../components/common/SpotlightOmniSearchModal'
import { NotificationCenterDrawer } from '../components/notifications/NotificationCenterDrawer'
import { ServiceTicketingDrawer } from '../components/notifications/ServiceTicketingDrawer'
import { EventTicketCheckInModal } from '../components/notifications/EventTicketCheckInModal'
import { useSpotlightShortcuts } from '../hooks/useSpotlightShortcuts'
import { useTranslation } from '../context/LanguageContext'
import { useViewport } from '../context/ViewportContext'

export interface UnifiedPosViewProps {
  activeStaffSurface: StaffSurfaceMode
  tablesGrid: TableStatus[]
  selectedPOSTable: TableStatus | null
  productCatalog: MenuItem[]
  posPayMethod: PosPayMethod
  posCashGiven: string
  cashDrawerFloat: number
  orders: OrderTicket[]
  enableTableFloorPlan?: boolean
  viewportMode?: ViewportModeType
  setActiveStaffSurface?: (surface: StaffSurfaceMode) => void
  setShowTableReassignModal: (show: boolean) => void
  setSelectedPOSTable: (table: TableStatus | null) => void
  setTablesGrid: React.Dispatch<React.SetStateAction<TableStatus[]>>
  setPosPayMethod: (method: PosPayMethod) => void
  setPosCashGiven: (val: string) => void
  handlePOSCheckoutTable: () => void
  handleMoveStatus: (orderId: string, targetStatus: OrderTicket['status']) => void
}

export const UnifiedPosView: React.FC<UnifiedPosViewProps> = ({
  activeStaffSurface = 'barista-pos',
  setActiveStaffSurface,
  tablesGrid,
  selectedPOSTable,
  productCatalog,
  posPayMethod,
  posCashGiven,
  orders,
  enableTableFloorPlan = true,
  viewportMode = 'responsive',
  setSelectedPOSTable,
  setTablesGrid,
  setPosPayMethod,
  setPosCashGiven,
  handlePOSCheckoutTable
}) => {
  const { isMobile: isContextMobile } = useViewport()
  const isMobile = viewportMode === 'mobile' || isContextMobile
  const { formatPrice } = useTranslation()
  const [posModeTab, setPosModeTab] = useState<'tables' | 'catalog'>(enableTableFloorPlan ? 'tables' : 'catalog')
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
    }
  }

  const categories = useMemo(() => ['all', ...Array.from(new Set(productCatalog.map((i) => i.category)))], [productCatalog])

  const filteredCatalog = useMemo(() => productCatalog.filter((item) => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  }), [productCatalog, selectedCategory, searchQuery])

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
      const tableOrders = orders.filter((o) => o.table === selectedPOSTable.name || o.table === selectedPOSTable.id || o.table?.includes(selectedPOSTable.name))
      const extracted: CartItem[] = []
      tableOrders.forEach((ord) => { if (ord.items) extracted.push(...ord.items) })
      if (extracted.length > 0) return extracted
      if (selectedPOSTable.totalBill > 0) {
        return [
          { ...productCatalog[0], name: `${productCatalog[0].name} (${selectedPOSTable.name})`, price: 28000, quantity: 1 },
          { ...productCatalog[1], name: `${productCatalog[1].name} (${selectedPOSTable.name})`, price: 32000, quantity: 1 }
        ]
      }
    }
    return []
  }, [cartItems, selectedPOSTable, orders, productCatalog])

  const subtotal = useMemo(() => activeTableCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0), [activeTableCartItems])
  const pb1Tax = useMemo(() => Math.round(subtotal * 0.1), [subtotal])
  const grandTotal = useMemo(() => (cartItems.length > 0 || !selectedPOSTable ? subtotal + pb1Tax : selectedPOSTable.totalBill || subtotal + pb1Tax), [cartItems, selectedPOSTable, subtotal, pb1Tax])
  const totalCartItemsCount = useMemo(() => activeTableCartItems.reduce((acc, item) => acc + item.quantity, 0), [activeTableCartItems])
  const unpaidCount = useMemo(() => tablesGrid.filter((t) => (t.status === 'open-tab' || t.status === 'occupied') && t.totalBill > 0).length, [tablesGrid])
  const paidCount = useMemo(() => tablesGrid.filter((t) => t.customerName?.includes('(Lunas)') || (t.status === 'occupied' && t.totalBill === 0)).length, [tablesGrid])
  const availableCount = useMemo(() => tablesGrid.filter((t) => t.status === 'free').length, [tablesGrid])

  const handleCheckoutAction = () => {
    if (activeTableCartItems.length === 0 && (!selectedPOSTable || selectedPOSTable.totalBill === 0)) {
      alert('Keranjang masih kosong! Silakan pilih menu atau meja terlebih dahulu.')
      return
    }
    if (selectedPOSTable) handlePOSCheckoutTable()
    setCartItems([])
    setPosCashGiven('')
    setShowMobileCartDrawer(false)
    alert(`🎉 Pembayaran ${selectedPOSTable?.name || 'Walk-In'} Sebesar ${formatPrice(grandTotal > 0 ? grandTotal : (selectedPOSTable?.totalBill || 0))} LUNAS via ${posPayMethod.toUpperCase()}!`)
  }

  useSpotlightShortcuts({
    onOpenSpotlight: () => setShowSpotlightModal(true),
    onCloseModals: () => {
      setShowSpotlightModal(false)
      setShowCameraScanner(false)
      setShowTableOpsModal(false)
      setShowRoomChargeModal(false)
      setShowTableDetailDrawer(false)
      setShowTableGuestBindingDrawer(false)
      setShowEditPinnedModal(false)
      setShowMobileCartDrawer(false)
      setIsAppDrawerOpen(false)
      setShowNotificationCenter(false)
      setShowServiceTickets(false)
      setShowEventTicketCheckIn(false)
      setDirectQtyItem(null)
    },
    onFocusCatalog: () => setPosModeTab('catalog'),
    onToggleFloorPlan: () => {
      if (enableTableFloorPlan) setPosModeTab((prev) => (prev === 'tables' ? 'catalog' : 'tables'))
    },
    onQuickPayCash: () => {
      setPosPayMethod('cash')
      handleCheckoutAction()
    },
    onQuickPayQris: () => {
      setPosPayMethod('qris')
      handleCheckoutAction()
    },
    onSplitBill: () => setShowTableOpsModal(true),
    onPrintReceipt: () => {
      if (activeTableCartItems.length > 0 || (selectedPOSTable && selectedPOSTable.totalBill > 0)) {
        handleCheckoutAction()
      }
    }
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
    setShowRoomChargeModal(false)
    setCartItems([])
    setPosCashGiven('')
    setShowMobileCartDrawer(false)
    alert(`🏨 Room Folio Charge Berhasil!\nKamar: ${payload.roomNumber} (${payload.guestName})\nTotal: ${formatPrice(payload.totalCharged)}\nTerposting ke GL 1104 Piutang Tamu Hotel.`)
  }

  const isImageUrl = (url?: string) => Boolean(url && (url.startsWith('http') || url.startsWith('/') || url.includes('unsplash.com')))

  return (
    <div className="relative flex-1 min-h-0 flex flex-col h-full overflow-hidden w-full bg-slate-950">
      <main className={`flex-1 min-h-0 w-full h-full max-w-7xl mx-auto p-2.5 sm:p-4 gap-3 sm:gap-4 ${
        isMobile
          ? 'flex flex-col overflow-y-auto overscroll-contain pb-36'
          : 'grid grid-cols-12 overflow-hidden'
      }`}>
        <div className={isMobile ? 'w-full flex flex-col gap-3' : 'md:col-span-7 lg:col-span-8 flex flex-col h-full min-h-0 gap-2 overflow-hidden'}>
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

          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y pr-1 custom-scrollbar">
            {posModeTab === 'tables' && enableTableFloorPlan && (
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

          {/* 3. SPEED KEYS FAVORITES BAR: ALWAYS DOCKED ON DESKTOP DUAL-PANE FOR 1-TAP SPEED ORDERING ACROSS TABLES & CATALOG */}
          {(!isMobile || posModeTab === 'catalog') && (
            <div className="shrink-0">
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
              setPosPayMethod={setPosPayMethod}
              setPosCashGiven={setPosCashGiven}
              onUpdateQty={handleUpdateQty}
              onOpenDirectQtyModal={(item, index) => setDirectQtyItem({ item, index })}
              onCheckout={handleCheckoutAction}
              onOpenSplitPayment={() => setShowTableOpsModal(true)}
              onSwitchToCatalog={() => setPosModeTab('catalog')}
            />
          </div>
        )}
      </main>

      {/* MOBILE FLOATING CART DOCK */}
      {isMobile && ((activeTableCartItems.length > 0 && grandTotal > 0) || (selectedPOSTable && selectedPOSTable.totalBill > 0)) && (
        <div className="absolute bottom-0 inset-x-0 z-40 px-3.5 pt-4 pb-[max(env(safe-area-inset-bottom,16px),16px)] flex justify-center pointer-events-none animate-slideUp" style={{ background: 'linear-gradient(to top, rgba(2, 6, 23, 0.98) 70%, rgba(2, 6, 23, 0.85) 85%, transparent 100%)' }}>
          <button type="button" onClick={() => setShowMobileCartDrawer(true)} className="w-full max-w-md bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center justify-between font-bold text-xs border border-emerald-400/60 transition-all touch-manipulation pointer-events-auto backdrop-blur-md active:scale-[0.98]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="bg-slate-950 text-emerald-400 px-2.5 py-1 rounded-xl text-xs font-mono font-black shrink-0 shadow-sm">{totalCartItemsCount > 0 ? `${totalCartItemsCount}x` : `${selectedPOSTable?.orderCount || 1}x`}</div>
              <div className="flex flex-col text-left leading-tight min-w-0">
                <span className="font-black text-sm font-mono whitespace-nowrap text-slate-950">{formatPrice(grandTotal > 0 ? grandTotal : (selectedPOSTable?.totalBill || 0))}</span>
                {selectedPOSTable && <span className="text-[10px] text-slate-900/80 font-bold font-mono truncate max-w-[150px]">{selectedPOSTable.name} {selectedPOSTable.customerName ? `• ${selectedPOSTable.customerName}` : ''}</span>}
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950 text-white hover:bg-slate-900 px-3.5 py-2 rounded-xl text-xs font-black shrink-0 shadow-md">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bayar</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </button>
        </div>
      )}

      <PosMobileCartDrawer
        show={showMobileCartDrawer}
        cartItems={activeTableCartItems}
        selectedPOSTable={selectedPOSTable}
        posPayMethod={posPayMethod}
        posCashGiven={posCashGiven}
        subtotal={subtotal}
        pb1Tax={pb1Tax}
        grandTotal={grandTotal}
        onClose={() => setShowMobileCartDrawer(false)}
        setPosPayMethod={setPosPayMethod}
        setPosCashGiven={setPosCashGiven}
        onUpdateQty={handleUpdateQty}
        onOpenDirectQtyModal={(item, index) => setDirectQtyItem({ item, index })}
        onCheckout={handleCheckoutAction}
        onOpenSplitPayment={() => setShowTableOpsModal(true)}
      />

      <CashierCameraScannerModal show={showCameraScanner} onClose={() => setShowCameraScanner(false)} onScanSuccess={handleScanSuccess} />

      <DirectQtyInputModal
        show={Boolean(directQtyItem)}
        itemName={directQtyItem?.item.name}
        currentQty={directQtyItem?.item.quantity || 1}
        onClose={() => setDirectQtyItem(null)}
        onConfirmQty={(newQty) => { if (directQtyItem) { handleUpdateQty(directQtyItem.index, newQty); setDirectQtyItem(null) } }}
      />

      <TableOpsModal
        show={showTableOpsModal}
        tablesGrid={tablesGrid}
        reassignFromTable={reassignFromTable}
        setReassignFromTable={setReassignFromTable}
        reassignTargetTable={reassignTargetTable}
        setReassignTargetTable={setReassignTargetTable}
        onClose={() => setShowTableOpsModal(false)}
        onConfirmReassign={handleConfirmReassignWithReason}
        onConfirmSplit={() => setShowTableOpsModal(false)}
        onConfirmJoin={() => setShowTableOpsModal(false)}
      />

      <RoomChargeModal
        show={showRoomChargeModal}
        onClose={() => setShowRoomChargeModal(false)}
        totalBill={grandTotal > 0 ? grandTotal : (selectedPOSTable?.totalBill || 0)}
        subtotal={subtotal}
        taxPB1={pb1Tax}
        tableName={selectedPOSTable?.name || 'Walk-In'}
        onConfirmRoomCharge={handleConfirmRoomCharge}
      />

      <TableDetailDrawer
        show={showTableDetailDrawer}
        table={selectedPOSTable}
        onClose={() => setShowTableDetailDrawer(false)}
        onAddItemsToTable={() => { setShowTableDetailDrawer(false); setPosModeTab('catalog') }}
        onCheckoutTable={() => { setShowTableDetailDrawer(false); setShowMobileCartDrawer(true) }}
        onUnjoinTable={() => setShowTableDetailDrawer(false)}
        onPartialSeatCheckout={() => { setShowTableDetailDrawer(false); setShowMobileCartDrawer(true) }}
      />

      <TableGuestBindingDrawer
        show={showTableGuestBindingDrawer}
        table={selectedPOSTable}
        onClose={() => setShowTableGuestBindingDrawer(false)}
        onBindGuest={(guestData) => {
          if (selectedPOSTable) {
            setSelectedPOSTable({ ...selectedPOSTable, status: 'occupied', customerName: guestData.name, totalBill: 0, orderCount: 0 })
          }
          setShowTableGuestBindingDrawer(false)
        }}
      />

      <EditPinnedFavoritesModal
        show={showEditPinnedModal}
        productCatalog={productCatalog}
        currentPinnedIds={pinnedItemIds}
        onClose={() => setShowEditPinnedModal(false)}
        onSavePinnedFavorites={(newIds) => setPinnedItemIds(newIds)}
      />

      <StaffAppDrawerModal
        isOpen={isAppDrawerOpen}
        onClose={() => setIsAppDrawerOpen(false)}
        activeStaffSurface={activeStaffSurface}
        onSelectSurface={(surface) => { setIsAppDrawerOpen(false); setActiveStaffSurface?.(surface) }}
      />

      <NotificationCenterDrawer
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
        onOpenServiceTickets={() => setShowServiceTickets(true)}
        onOpenTicketValidator={() => setShowEventTicketCheckIn(true)}
      />

      <ServiceTicketingDrawer
        isOpen={showServiceTickets}
        onClose={() => setShowServiceTickets(false)}
      />

      <EventTicketCheckInModal
        isOpen={showEventTicketCheckIn}
        onClose={() => setShowEventTicketCheckIn(false)}
      />

      <SpotlightOmniSearchModal
        isOpen={showSpotlightModal}
        onClose={() => setShowSpotlightModal(false)}
        onSelectProduct={(item) => {
          handleAddToCart(item)
          setPosModeTab('catalog')
        }}
        onSelectTable={(tableId) => {
          const found = tablesGrid.find((t) => t.id === tableId || t.name === tableId)
          if (found) handleTableClick(found)
        }}
        onOpenStorefrontStudio={() => {
          if (setActiveStaffSurface) setActiveStaffSurface('cafe-config')
        }}
        onOpenScanner={() => setShowCameraScanner(true)}
        onOpenTableOps={() => setShowTableOpsModal(true)}
        onOpenGuestBinding={() => setShowTableGuestBindingDrawer(true)}
        onOpenNotifications={() => setShowNotificationCenter(true)}
        onNavigateApp={(appId) => {
          if (appId === 'kds') setActiveStaffSurface?.('kds-screen')
          else if (appId === 'insights') setActiveStaffSurface?.('barista-pos')
          else if (appId === 'customer-portal') setActiveStaffSurface?.('barista-pos')
          else if (setActiveStaffSurface) setActiveStaffSurface(appId as StaffSurfaceMode)
        }}
      />
    </div>
  )
}
export default UnifiedPosView
