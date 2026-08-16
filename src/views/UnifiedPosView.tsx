import React, { useState, useMemo } from 'react'
import {
  Users,
  ShoppingBag,
  Camera,
  ArrowRight,
  Grid,
  ArrowRightLeft
} from 'lucide-react'
import { TableStatus, MenuItem, OrderTicket, StaffSurfaceMode, CartItem, PosPayMethod, ViewportModeType } from '../types/pos'
import { DirectQtyInputModal } from '../components/pos/DirectQtyInputModal'
import { CashierCameraScannerModal } from '../components/pos/CashierCameraScannerModal'
import { TableOperationsModal } from '../components/tables/TableOperationsModal'
import { TableDetailDrawer } from '../components/tables/TableDetailDrawer'
import { TableGuestBindingDrawer } from '../components/tables/TableGuestBindingDrawer'
import { PosFavoritesBar } from '../components/pos/PosFavoritesBar'
import { PosCatalogGrid } from '../components/pos/PosCatalogGrid'
import { PosCartSection } from '../components/pos/PosCartSection'
import { PosTableFloorPlanSection } from '../components/pos/PosTableFloorPlanSection'
import { PosMobileCartDrawer } from '../components/pos/PosMobileCartDrawer'
import { EditPinnedFavoritesModal } from '../components/pos/EditPinnedFavoritesModal'
import { PosCommandHeader } from '../components/pos/PosCommandHeader'
import { StaffAppDrawerModal } from '../components/common/StaffAppDrawerModal'
import { useTranslation } from '../context/LanguageContext'

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
  setPosPayMethod,
  setPosCashGiven,
  handlePOSCheckoutTable
}) => {
  const isMobile = viewportMode === 'mobile'
  const { t, formatPrice } = useTranslation()
  const [posModeTab, setPosModeTab] = useState<'tables' | 'catalog'>(
    enableTableFloorPlan ? 'tables' : 'catalog'
  )
  const [tableStatusFilter, setTableStatusFilter] = useState<'all' | 'unpaid' | 'paid' | 'available'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  
  const [isAppDrawerOpen, setIsAppDrawerOpen] = useState<boolean>(false)
  const [showCameraScanner, setShowCameraScanner] = useState<boolean>(false)
  const [directQtyItem, setDirectQtyItem] = useState<{ item: CartItem; index: number } | null>(null)
  const [showTableOpsModal, setShowTableOpsModal] = useState<boolean>(false)
  const [showTableDetailDrawer, setShowTableDetailDrawer] = useState<boolean>(false)
  const [showTableGuestBindingDrawer, setShowTableGuestBindingDrawer] = useState<boolean>(false)
  const [showEditPinnedModal, setShowEditPinnedModal] = useState<boolean>(false)
  const [showMobileCartDrawer, setShowMobileCartDrawer] = useState<boolean>(false)

  // Table ops modal states
  const [reassignFromTable, setReassignFromTable] = useState<string>('MEJA-04')
  const [reassignTargetTable, setReassignTargetTable] = useState<string>('MEJA-08')

  const [pinnedItemIds, setPinnedItemIds] = useState<string[]>(() =>
    productCatalog.slice(0, 12).map((i) => i.id)
  )

  const pinnedFavorites = useMemo(() => {
    return productCatalog.filter((item) => pinnedItemIds.includes(item.id))
  }, [productCatalog, pinnedItemIds])

  const handleTableClick = (table: TableStatus) => {
    setSelectedPOSTable(table)
    if (table.status === 'occupied' || table.status === 'open-tab') {
      setShowTableDetailDrawer(true)
    } else {
      setShowTableGuestBindingDrawer(true)
    }
  }

  const categories = useMemo(() => {
    const set = new Set(productCatalog.map((i) => i.category))
    return ['all', ...Array.from(set)]
  }, [productCatalog])

  const filteredCatalog = useMemo(() => {
    return productCatalog.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCat && matchSearch
    })
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
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((_, i) => i !== index))
    } else {
      setCartItems((prev) => prev.map((item, i) => (i === index ? { ...item, quantity: newQty } : item)))
    }
  }

  const handleScanSuccess = (barcode: string) => {
    const matched = productCatalog.find((p) => p.id === barcode || p.hfeCategoryCode === barcode)
    handleAddToCart(matched || productCatalog[0])
  }

  // RESOLVE ACTIVE TABLE BILL ITEMS (HYDRATES FROM TABLE ORDERS WHEN AD-HOC CART IS EMPTY)
  const activeTableCartItems = useMemo<CartItem[]>(() => {
    if (cartItems.length > 0) {
      return cartItems
    }
    if (selectedPOSTable && (selectedPOSTable.status === 'occupied' || selectedPOSTable.status === 'open-tab')) {
      const tableOrders = orders.filter(
        (o) => o.table === selectedPOSTable.name || o.table === selectedPOSTable.id || o.table?.includes(selectedPOSTable.name)
      )
      const extracted: CartItem[] = []
      tableOrders.forEach((ord) => {
        if (ord.items && ord.items.length > 0) {
          extracted.push(...ord.items)
        }
      })
      if (extracted.length > 0) {
        return extracted
      }
      if (selectedPOSTable.totalBill > 0) {
        return [
          {
            ...productCatalog[0],
            name: `${productCatalog[0].name} (${selectedPOSTable.name})`,
            price: 28000,
            quantity: 1
          },
          {
            ...productCatalog[5],
            name: `${productCatalog[5].name} (${selectedPOSTable.name})`,
            price: selectedPOSTable.totalBill >= 86000 ? 58000 : 38000,
            quantity: 1
          }
        ]
      }
    }
    return []
  }, [cartItems, selectedPOSTable, orders, productCatalog])

  const subtotal = useMemo(() => {
    return activeTableCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  }, [activeTableCartItems])

  const pb1Tax = useMemo(() => Math.round(subtotal * 0.1), [subtotal])
  const grandTotal = useMemo(() => {
    if (cartItems.length > 0) {
      return subtotal + pb1Tax
    }
    if (selectedPOSTable && selectedPOSTable.totalBill > 0) {
      return selectedPOSTable.totalBill
    }
    if (activeTableCartItems.length > 0) {
      return subtotal + pb1Tax
    }
    return 0
  }, [cartItems, activeTableCartItems, subtotal, pb1Tax, selectedPOSTable])

  const totalCartItemsCount = useMemo(() => {
    return activeTableCartItems.reduce((acc, item) => acc + item.quantity, 0)
  }, [activeTableCartItems])

  // TABLE STATUS COUNTS & FILTERING
  const unpaidCount = useMemo(() => {
    return tablesGrid.filter((t) => (t.status === 'open-tab' || t.status === 'occupied') && t.totalBill > 0).length
  }, [tablesGrid])

  const paidCount = useMemo(() => {
    return tablesGrid.filter((t) => t.customerName?.includes('(Lunas)') || (t.status === 'occupied' && t.totalBill === 0)).length
  }, [tablesGrid])

  const availableCount = useMemo(() => {
    return tablesGrid.filter((t) => t.status === 'free').length
  }, [tablesGrid])

  const filteredTablesGrid = useMemo(() => {
    return tablesGrid.filter((table) => {
      const isUnpaid = (table.status === 'open-tab' || table.status === 'occupied') && table.totalBill > 0
      const isPaid = table.customerName?.includes('(Lunas)') || (table.status === 'occupied' && table.totalBill === 0)
      const isAvailable = table.status === 'free'

      if (tableStatusFilter === 'unpaid') return isUnpaid
      if (tableStatusFilter === 'paid') return isPaid
      if (tableStatusFilter === 'available') return isAvailable
      return true
    })
  }, [tablesGrid, tableStatusFilter])

  const handleCheckoutAction = () => {
    if (activeTableCartItems.length === 0 && (!selectedPOSTable || selectedPOSTable.totalBill === 0)) {
      alert('Keranjang masih kosong! Silakan pilih menu atau meja terlebih dahulu.')
      return
    }

    const tenderMethod = posPayMethod.toUpperCase()
    const finalAmount = grandTotal > 0 ? grandTotal : (selectedPOSTable?.totalBill || 0)
    const tableName = selectedPOSTable ? selectedPOSTable.name : 'Walk-In Customer'

    if (selectedPOSTable) {
      handlePOSCheckoutTable()
    }

    setCartItems([])
    setPosCashGiven('')
    setShowMobileCartDrawer(false)

    alert(`🎉 Pembayaran ${tableName} Sebesar ${formatPrice(finalAmount)} LUNAS via ${tenderMethod}!\nStruk Digital Tercetak & Terposting ke Ledger Akuntansi HFE.`)
  }

  const isImageUrl = (url?: string) => {
    if (!url) return false
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/') || url.includes('unsplash.com')
  }

  return (
    <div className="relative flex-1 min-h-0 flex flex-col h-full overflow-hidden w-full bg-slate-950">
      <main className={`flex-1 overflow-y-auto overscroll-contain p-2.5 sm:p-6 gap-3 sm:gap-6 max-w-7xl mx-auto w-full pb-36 lg:pb-6 ${
        isMobile ? 'flex flex-col' : 'grid grid-cols-1 lg:grid-cols-12'
      }`}>
        {/* LEFT AREA: WORKSTATION CATALOG / FLOOR PLAN */}
        <div className={isMobile ? 'w-full flex flex-col gap-3' : 'lg:col-span-8 flex flex-col gap-3 sm:gap-4'}>

          {/* UNIFIED COMMAND HEADER (SEGMENTED CONTROL + QUICK ACTIONS) */}
          <PosCommandHeader
            posModeTab={posModeTab}
            enableTableFloorPlan={enableTableFloorPlan}
            setPosModeTab={setPosModeTab}
            onOpenAppDrawer={() => setIsAppDrawerOpen(true)}
            onOpenGuestBinding={() => setShowTableGuestBindingDrawer(true)}
            onOpenScanner={() => setShowCameraScanner(true)}
            onOpenTableOps={() => setShowTableOpsModal(true)}
          />

          {/* TAB 1: PETA MEJA RESTO */}
          {posModeTab === 'tables' && enableTableFloorPlan && (
            <PosTableFloorPlanSection
              tablesGrid={tablesGrid}
              filteredTablesGrid={filteredTablesGrid}
              selectedPOSTable={selectedPOSTable}
              tableStatusFilter={tableStatusFilter}
              unpaidCount={unpaidCount}
              paidCount={paidCount}
              availableCount={availableCount}
              isMobile={isMobile}
              setTableStatusFilter={setTableStatusFilter}
              handleTableClick={handleTableClick}
              onOpenTableOpsModal={() => setShowTableOpsModal(true)}
            />
          )}

          {/* TAB 2: KATALOG PRODUK SKU */}
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
              onAddToCart={handleAddToCart}
            />
          )}

          {/* WIDGET PERMANEN POS: QUICKACTION SPEED KEYS (SELALU TERLIHAT) */}
          <PosFavoritesBar
            pinnedFavorites={pinnedFavorites}
            isImageUrl={isImageUrl}
            isMobile={isMobile}
            onAddToCart={handleAddToCart}
            onEditPinnedMenu={() => setShowEditPinnedModal(true)}
          />
        </div>

        {/* RIGHT AREA: MODULAR ORDER CART SIDEBAR (DESKTOP & TABLET LANDSCAPE) */}
        {!isMobile && (
          <div className="hidden lg:block lg:col-span-4">
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
            />
          </div>
        )}
      </main>

      {/* MOBILE FLOATING BOTTOM CART BAR (SMARTPHONE 390PX VIEW DOCK - ABSOLUTELY PINNED TO MOBILE FRAME) */}
      {isMobile && ((activeTableCartItems.length > 0 && grandTotal > 0) || (selectedPOSTable && selectedPOSTable.totalBill > 0)) && (
        <div 
          className="absolute bottom-0 inset-x-0 z-40 px-3.5 pt-4 pb-[max(env(safe-area-inset-bottom,16px),16px)] flex justify-center pointer-events-none animate-slideUp"
          style={{
            background: 'linear-gradient(to top, rgba(2, 6, 23, 0.98) 70%, rgba(2, 6, 23, 0.85) 85%, transparent 100%)'
          }}
        >
          <button
            type="button"
            onClick={() => setShowMobileCartDrawer(true)}
            className="w-full max-w-md bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center justify-between font-bold text-xs border border-emerald-400/60 transition-all touch-manipulation pointer-events-auto backdrop-blur-md active:scale-[0.98]"
          >
            {/* LEFT: 2-LINE COMPACT QTY, PRICE & TABLE */}
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

            {/* RIGHT: COMPACT HIGH-CONTRAST ACTION PILL */}
            <div className="flex items-center gap-1.5 bg-slate-950 text-white hover:bg-slate-900 px-3.5 py-2 rounded-xl text-xs font-black shrink-0 shadow-md">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bayar</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </button>
        </div>
      )}

      {/* MOBILE CART BOTTOM SHEET DRAWER */}
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

      {/* CAMERA SCANNER MODAL */}
      <CashierCameraScannerModal
        show={showCameraScanner}
        onClose={() => setShowCameraScanner(false)}
        onScanSuccess={handleScanSuccess}
      />

      {/* DIRECT NUMERIC QTY INPUT MODAL */}
      <DirectQtyInputModal
        show={!!directQtyItem}
        itemName={directQtyItem?.item.name}
        currentQty={directQtyItem?.item.quantity || 1}
        onClose={() => setDirectQtyItem(null)}
        onConfirmQty={(newQty: number) => {
          if (directQtyItem) {
            handleUpdateQty(directQtyItem.index, newQty)
            setDirectQtyItem(null)
          }
        }}
      />

      {/* TABLE OPERATIONS MODAL (SPLIT / JOIN / REASSIGN) */}
      <TableOperationsModal
        show={showTableOpsModal}
        tablesGrid={tablesGrid}
        reassignFromTable={reassignFromTable}
        setReassignFromTable={setReassignFromTable}
        reassignTargetTable={reassignTargetTable}
        setReassignTargetTable={setReassignTargetTable}
        onClose={() => setShowTableOpsModal(false)}
        onConfirmReassign={() => setShowTableOpsModal(false)}
        onConfirmSplit={() => setShowTableOpsModal(false)}
        onConfirmJoin={() => setShowTableOpsModal(false)}
      />

      {/* TABLE DETAIL & LIVE ORDERS DRAWER */}
      <TableDetailDrawer
        show={showTableDetailDrawer}
        table={selectedPOSTable}
        onClose={() => setShowTableDetailDrawer(false)}
        onAddItemsToTable={() => {
          setShowTableDetailDrawer(false)
          setPosModeTab('catalog')
        }}
        onCheckoutTable={() => {
          setShowTableDetailDrawer(false)
          setShowMobileCartDrawer(true)
        }}
        onUnjoinTable={() => setShowTableDetailDrawer(false)}
        onPartialSeatCheckout={() => {
          setShowTableDetailDrawer(false)
          setShowMobileCartDrawer(true)
        }}
      />

      {/* TABLE GUEST BINDING DRAWER */}
      <TableGuestBindingDrawer
        show={showTableGuestBindingDrawer}
        table={selectedPOSTable}
        onClose={() => setShowTableGuestBindingDrawer(false)}
        onBindGuest={(guestData) => {
          if (selectedPOSTable) {
            setSelectedPOSTable({
              ...selectedPOSTable,
              status: 'occupied',
              customerName: guestData.name,
              totalBill: 0,
              orderCount: 0
            })
          }
          setShowTableGuestBindingDrawer(false)
        }}
      />

      {/* EDIT PINNED FAVORITES SPEED KEYS MODAL */}
      <EditPinnedFavoritesModal
        show={showEditPinnedModal}
        productCatalog={productCatalog}
        currentPinnedIds={pinnedItemIds}
        onClose={() => setShowEditPinnedModal(false)}
        onSavePinnedFavorites={(newIds: string[]) => setPinnedItemIds(newIds)}
      />

      {/* 5 CORE APP SUITES DRAWER MODAL */}
      <StaffAppDrawerModal
        isOpen={isAppDrawerOpen}
        onClose={() => setIsAppDrawerOpen(false)}
        activeStaffSurface={activeStaffSurface}
        onSelectSurface={(surface) => {
          setIsAppDrawerOpen(false)
          setActiveStaffSurface?.(surface)
        }}
      />
    </div>
  )
}
