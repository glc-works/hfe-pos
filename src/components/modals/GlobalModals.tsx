import React from 'react'
import { LoginModal } from './LoginModal'
import { TableOperationsModal } from './TableOperationsModal'
import { ReservationModal } from './ReservationModal'
import { ModifierModal } from './ModifierModal'
import { QrisModal } from './QrisModal'
import { RecipeBomModal } from './RecipeBomModal'
import { PwaInstallPromptModal } from '../shared/PwaInstallPromptModal'
import { PRODUCT_CATALOG } from '../../data/mockData'
import { MenuItem, CustomerProfile, HfeCompanyProfile } from '../../types/pos'

export interface GlobalModalsProps {
  showLoginModal: boolean
  setShowLoginModal: (show: boolean) => void
  isCustomerSessionActive: boolean
  sync: { hfeCompanyProfile: HfeCompanyProfile }
  table: any
  cart: any
  selectedRecipeBOM: MenuItem | null
  setSelectedRecipeBOM: (item: MenuItem | null) => void
  customerProfiles: CustomerProfile[]
  setCustomerProfiles: React.Dispatch<React.SetStateAction<CustomerProfile[]>>
  setQrStepView: (v: 'catalog' | 'checkout') => void
}

export const GlobalModals: React.FC<GlobalModalsProps> = ({
  showLoginModal,
  setShowLoginModal,
  isCustomerSessionActive,
  sync,
  table,
  cart,
  selectedRecipeBOM,
  setSelectedRecipeBOM,
  customerProfiles,
  setCustomerProfiles,
  setQrStepView
}) => {
  return (
    <>
      <PwaInstallPromptModal />

      {showLoginModal && (
        <LoginModal
          show={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          loginType={cart.loginType}
          setLoginType={cart.setLoginType}
          customerPhone={cart.customerPhone}
          setCustomerPhone={cart.setCustomerPhone}
          guestName={cart.guestName}
          setGuestName={cart.setGuestName}
          customerAvatar={cart.customerAvatar}
          setCustomerAvatar={cart.setCustomerAvatar}
          loyaltyPoints={cart.loyaltyPoints}
          isCustomerSessionActive={isCustomerSessionActive}
          onSaveLogin={() => setShowLoginModal(false)}
          onClearSession={() => setShowLoginModal(false)}
        />
      )}

      {table.showTableReassignModal && (
        <TableOperationsModal
          show={table.showTableReassignModal}
          onClose={() => table.setShowTableReassignModal(false)}
          tablesGrid={table.tablesGrid}
          reassignFromTable={table.reassignFromTable}
          setReassignFromTable={table.setReassignFromTable}
          reassignTargetTable={table.reassignTargetTable}
          setReassignTargetTable={table.setReassignTargetTable}
          onConfirmReassign={table.handleConfirmTableReassign}
          onConfirmSplit={() => table.handleConfirmTableSplit()}
          onConfirmJoin={() => table.handleConfirmTableJoin()}
        />
      )}

      {table.showReservationModal && (
        <ReservationModal
          show={table.showReservationModal}
          onClose={() => table.setShowReservationModal(false)}
          hfeCompanyProfile={sync.hfeCompanyProfile}
          productCatalog={PRODUCT_CATALOG}
          resDate={table.resDate}
          setResDate={table.setResDate}
          resTimeSlot={table.resTimeSlot}
          setResTimeSlot={table.setResTimeSlot}
          resArea={table.resArea}
          setResArea={table.setResArea}
          resPax={table.resPax}
          setResPax={table.setResPax}
          resCustomerName={table.resCustomerName}
          setResCustomerName={table.setResCustomerName}
          resCustomerPhone={table.resCustomerPhone}
          setResCustomerPhone={table.setResCustomerPhone}
          resNotes={table.resNotes}
          setResNotes={table.setResNotes}
          resPayDpNow={table.resPayDpNow}
          setResPayDpNow={table.setResPayDpNow}
          dpRequiredMode={table.dpRequiredMode}
          dpAmountConfig={table.dpAmountConfig}
          reservationPolicyMode={table.reservationPolicyMode}
          reservationOrderMode={table.reservationOrderMode}
          priceVisibilityMode={table.priceVisibilityMode}
          resPreOrderItems={table.resPreOrderItems}
          setResPreOrderItems={table.setResPreOrderItems}
          onCreateReservation={table.handleCreateReservation}
        />
      )}

      {cart.showModifierModal && (
        <ModifierModal
          show={!!cart.showModifierModal}
          onClose={() => cart.setShowModifierModal(null)}
          selectedItemForModifier={cart.showModifierModal}
          modSeatNumber={cart.modSeat}
          setModSeatNumber={cart.setModSeat}
          modSeatCustomerName={cart.modSeatCustomerName}
          setModSeatCustomerName={cart.setModSeatCustomerName}
          modSeatCustomerPhone={cart.modSeatCustomerPhone}
          setModSeatCustomerPhone={cart.setModSeatCustomerPhone}
          modAllergen={cart.modAllergen}
          setModAllergen={cart.setModAllergen}
          modTemp={cart.modTemp}
          setModTemp={cart.setModTemp}
          modSugar={cart.modSugar}
          setModSugar={cart.setModSugar}
          modMilk={cart.modMilk}
          setModMilk={cart.setModMilk}
          onConfirmModifier={() => cart.handleConfirmModifier(customerProfiles, setCustomerProfiles)}
        />
      )}

      {cart.showQRISModal && (
        <QrisModal
          show={cart.showQRISModal}
          onCompletePayment={() => cart.handleCompletePayFirstQRIS(table.selectedTable, setQrStepView)}
        />
      )}

      {selectedRecipeBOM && (
        <RecipeBomModal
          selectedRecipeBOM={selectedRecipeBOM}
          onClose={() => setSelectedRecipeBOM(null)}
        />
      )}
    </>
  )
}
