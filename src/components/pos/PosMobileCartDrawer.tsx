import React from 'react'
import { ShoppingBag, X, UtensilsCrossed, ChevronDown, Bike } from 'lucide-react'
import { CartItem, TableStatus, PosPayMethod, OrderFulfillmentMode } from '../../types/pos'
import { PosCartSection } from './PosCartSection'
import { useTranslation } from '../../context/LanguageContext'
import { IconButton } from '@/ui'

export interface PosMobileCartDrawerProps {
  show: boolean
  cartItems: CartItem[]
  selectedPOSTable: TableStatus | null
  posPayMethod: PosPayMethod
  posCashGiven: string
  subtotal: number
  pb1Tax: number
  grandTotal: number
  packagingFee?: number
  fulfillmentMode?: OrderFulfillmentMode
  onClose: () => void
  setPosPayMethod: (method: PosPayMethod) => void
  setPosCashGiven: (val: string) => void
  setFulfillmentMode?: (mode: OrderFulfillmentMode) => void
  onUpdateQty: (index: number, qty: number) => void
  onOpenDirectQtyModal: (item: CartItem, index: number) => void
  onCheckout: () => void
  onOpenSplitPayment: () => void
  onToggleOrderMode?: () => void
  onSwitchToCatalog?: () => void
}

export const PosMobileCartDrawer: React.FC<PosMobileCartDrawerProps> = ({
  show,
  cartItems,
  selectedPOSTable,
  posPayMethod,
  posCashGiven,
  subtotal,
  pb1Tax,
  grandTotal,
  packagingFee = 0,
  fulfillmentMode = 'dine_in',
  onClose,
  setPosPayMethod,
  setPosCashGiven,
  setFulfillmentMode,
  onUpdateQty,
  onOpenDirectQtyModal,
  onCheckout,
  onOpenSplitPayment,
  onToggleOrderMode,
  onSwitchToCatalog
}) => {
  const { t } = useTranslation()

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[80] bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-[440px] max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MOBILE GRAB HANDLE */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-3 mb-1 sm:hidden shrink-0" />

        {/* 1. SINGLE UNIFIED DRAWER HEADER WITH MODE CAPSULE */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0 gap-2">
          {/* FULFILLMENT MODE PILL */}
          {fulfillmentMode === 'dine_in' ? (
            <button
              type="button"
              onClick={onToggleOrderMode}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm active:scale-97 transition-all cursor-pointer min-h-[38px] min-w-0 group"
              title="Ganti Meja / Mode Pesanan"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
                <UtensilsCrossed className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {selectedPOSTable ? `${t.customer.tableNo} ${selectedPOSTable.name}` : `${t.customer.tableNo} OUT-04`}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 transition-colors shrink-0" />
            </button>
          ) : fulfillmentMode === 'takeaway' ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 min-h-[38px] min-w-0">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
                <ShoppingBag className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 truncate font-mono">
                🏷️ {t.cart.takeawayModeLabel} #12
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 min-h-[38px] min-w-0">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0">
                <Bike className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 truncate">
                🛵 {t.cart.deliveryModeLabel}
              </span>
            </div>
          )}

          {/* 1 SINGLE CLOSE BUTTON */}
          <IconButton
            aria-label="Tutup Keranjang"
            icon={<X className="w-4 h-4" />}
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="shrink-0 rounded-full"
          />
        </div>

        {/* 2. CART BODY */}
        <div className="p-3 overflow-y-auto overscroll-contain flex-1 pb-6 custom-scrollbar">
          <PosCartSection
            hideHeader={true}
            cartItems={cartItems}
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
            onUpdateQty={onUpdateQty}
            onOpenDirectQtyModal={onOpenDirectQtyModal}
            onCheckout={onCheckout}
            onOpenSplitPayment={onOpenSplitPayment}
            onSwitchToCatalog={() => {
              onClose()
              onSwitchToCatalog?.()
            }}
          />
        </div>
      </div>
    </div>
  )
}
export default PosMobileCartDrawer
