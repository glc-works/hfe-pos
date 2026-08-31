import React, { useState } from 'react'
import { TableStatus, MenuItem, StaffSurfaceMode, CartItem, OrderFulfillmentMode, PosPayMethod } from '../../types/pos'
import { CashierCameraScannerModal } from './CashierCameraScannerModal'
import { DirectQtyInputModal } from './DirectQtyInputModal'
import { TableOpsModal } from '../tables/TableOpsModal'
import { RoomChargeModal } from './RoomChargeModal'
import { TableDetailDrawer } from '../tables/TableDetailDrawer'
import { TableGuestBindingDrawer } from '../tables/TableGuestBindingDrawer'
import { EditPinnedFavoritesModal } from './EditPinnedFavoritesModal'
import { StaffAppDrawerModal } from '../common/StaffAppDrawerModal'
import { NotificationCenterDrawer } from '../notifications/NotificationCenterDrawer'
import { ServiceTicketingDrawer } from '../notifications/ServiceTicketingDrawer'
import { EventTicketCheckInModal } from '../notifications/EventTicketCheckInModal'
import { SpotlightOmniSearchModal } from '../common/SpotlightOmniSearchModal'
import { SupportFeedbackModal } from '../support/SupportFeedbackModal'
import { PosPaymentSettlementModal } from './PosPaymentSettlementModal'
import type { ReviewedPosQuote } from '../../services/financial'
import type { GovernedCheckoutPhase } from '../../hooks/useCafeSettlement'

export interface UnifiedPosModalsClusterProps {
  showCameraScanner: boolean
  setShowCameraScanner: (show: boolean) => void
  handleScanSuccess: (barcode: string) => void

  directQtyItem: { item: CartItem; index: number } | null
  setDirectQtyItem: (item: { item: CartItem; index: number } | null) => void
  handleUpdateQty: (index: number, qty: number) => void

  showTableOpsModal: boolean
  setShowTableOpsModal: (show: boolean) => void
  tablesGrid: TableStatus[]
  reassignFromTable: string
  setReassignFromTable: (tbl: string) => void
  reassignTargetTable: string
  setReassignTargetTable: (tbl: string) => void
  handleConfirmReassignWithReason: (reason?: string) => void

  showRoomChargeModal: boolean
  setShowRoomChargeModal: (show: boolean) => void
  grandTotal: number
  subtotal: number
  pb1Tax: number
  selectedPOSTable: TableStatus | null
  handleConfirmRoomCharge: (payload: { roomNumber: string; guestName: string; totalCharged: number }) => void

  showTableDetailDrawer: boolean
  setShowTableDetailDrawer: (show: boolean) => void
  setPosModeTab: (tab: 'tables' | 'catalog') => void
  setShowMobileCartDrawer: (show: boolean) => void

  showTableGuestBindingDrawer: boolean
  setShowTableGuestBindingDrawer: (show: boolean) => void
  setSelectedPOSTable: (table: TableStatus | null) => void

  showEditPinnedModal: boolean
  setShowEditPinnedModal: (show: boolean) => void
  productCatalog: MenuItem[]
  pinnedItemIds: string[]
  setPinnedItemIds: (ids: string[]) => void

  isAppDrawerOpen: boolean
  setIsAppDrawerOpen: (open: boolean) => void
  activeStaffSurface: StaffSurfaceMode
  setActiveStaffSurface?: (surface: StaffSurfaceMode) => void

  showNotificationCenter: boolean
  setShowNotificationCenter: (show: boolean) => void
  showServiceTickets: boolean
  setShowServiceTickets: (show: boolean) => void
  showEventTicketCheckIn: boolean
  setShowEventTicketCheckIn: (show: boolean) => void

  showSpotlightModal: boolean
  setShowSpotlightModal: (show: boolean) => void
  handleAddToCart: (item: MenuItem) => void
  handleTableClick: (table: TableStatus) => void
  staffRole?: string
  showPaymentSettlementModal?: boolean
  setShowPaymentSettlementModal?: (show: boolean) => void
  cartItems?: CartItem[]
  fulfillmentMode?: OrderFulfillmentMode
  posPayMethod?: PosPayMethod
  setPosPayMethod?: (method: PosPayMethod) => void
  posCashGiven?: string
  setPosCashGiven?: (val: string) => void
  packagingFee?: number
  authoritativeQuote?: ReviewedPosQuote | null
  checkoutPhase?: GovernedCheckoutPhase
  onConfirmSettlement?: () => Promise<void> | void
}

export const UnifiedPosModalsCluster: React.FC<UnifiedPosModalsClusterProps> = ({
  showCameraScanner,
  setShowCameraScanner,
  handleScanSuccess,
  directQtyItem,
  setDirectQtyItem,
  handleUpdateQty,
  showTableOpsModal,
  setShowTableOpsModal,
  tablesGrid,
  reassignFromTable,
  setReassignFromTable,
  reassignTargetTable,
  setReassignTargetTable,
  handleConfirmReassignWithReason,
  showRoomChargeModal,
  setShowRoomChargeModal,
  grandTotal,
  subtotal,
  pb1Tax,
  selectedPOSTable,
  handleConfirmRoomCharge,
  showTableDetailDrawer,
  setShowTableDetailDrawer,
  setPosModeTab,
  setShowMobileCartDrawer,
  showTableGuestBindingDrawer,
  setShowTableGuestBindingDrawer,
  setSelectedPOSTable,
  showEditPinnedModal,
  setShowEditPinnedModal,
  productCatalog,
  pinnedItemIds,
  setPinnedItemIds,
  isAppDrawerOpen,
  setIsAppDrawerOpen,
  activeStaffSurface,
  setActiveStaffSurface,
  showNotificationCenter,
  setShowNotificationCenter,
  showServiceTickets,
  setShowServiceTickets,
  showEventTicketCheckIn,
  setShowEventTicketCheckIn,
  showSpotlightModal,
  setShowSpotlightModal,
  handleAddToCart,
  handleTableClick,
  staffRole,
  showPaymentSettlementModal = false,
  setShowPaymentSettlementModal,
  cartItems = [],
  fulfillmentMode = 'dine_in',
  posPayMethod = 'cash',
  setPosPayMethod = () => {},
  posCashGiven = '',
  setPosCashGiven = () => {},
  packagingFee = 0,
  authoritativeQuote,
  checkoutPhase,
  onConfirmSettlement = () => {}
}) => {
  const [showSupportModal, setShowSupportModal] = useState(false)

  return (
    <>
      <CashierCameraScannerModal
        show={showCameraScanner}
        onClose={() => setShowCameraScanner(false)}
        onScanSuccess={handleScanSuccess}
      />

      <DirectQtyInputModal
        show={Boolean(directQtyItem)}
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

      <TableOpsModal
        show={showTableOpsModal}
        tablesGrid={tablesGrid}
        reassignFromTable={reassignFromTable}
        setReassignFromTable={setReassignFromTable}
        reassignTargetTable={reassignTargetTable}
        setReassignTargetTable={setReassignTargetTable}
        onClose={() => setShowTableOpsModal(false)}
        onConfirmReassign={(reason) => handleConfirmReassignWithReason(reason)}
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
        onSelectSurface={(surface) => {
          setIsAppDrawerOpen(false)
          setActiveStaffSurface?.(surface)
        }}
        staffRole={staffRole}
      />

      <NotificationCenterDrawer
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
        onOpenServiceTickets={() => setShowServiceTickets(true)}
        onOpenTicketValidator={() => setShowEventTicketCheckIn(true)}
        onOpenSupportTicket={() => setShowSupportModal(true)}
      />

      <SupportFeedbackModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        activeViewName="Kasir POS"
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

      <PosPaymentSettlementModal
        show={showPaymentSettlementModal}
        onClose={() => setShowPaymentSettlementModal?.(false)}
        items={cartItems}
        selectedTable={selectedPOSTable}
        subtotal={subtotal}
        pb1Tax={pb1Tax}
        packagingFee={packagingFee}
        grandTotal={grandTotal}
        fulfillmentMode={fulfillmentMode}
        posPayMethod={posPayMethod}
        setPosPayMethod={setPosPayMethod}
        posCashGiven={posCashGiven}
        setPosCashGiven={setPosCashGiven}
        authoritativeQuote={authoritativeQuote}
        checkoutPhase={checkoutPhase}
        onConfirmSettlement={onConfirmSettlement}
        onOpenRoomChargeModal={() => setShowRoomChargeModal(true)}
        onOpenSplitPaymentModal={() => setShowTableOpsModal(true)}
      />
    </>
  )
}
export default UnifiedPosModalsCluster
