import React from 'react'
import { ShoppingBag, X, Store, ArrowRightLeft } from 'lucide-react'
import { CartItem, TableStatus, PosPayMethod } from '../../types/pos'
import { PosCartSection } from './PosCartSection'
import { useTranslation } from '../../context/LanguageContext'

export interface PosMobileCartDrawerProps {
  show: boolean
  cartItems: CartItem[]
  selectedPOSTable: TableStatus | null
  posPayMethod: PosPayMethod
  posCashGiven: string
  subtotal: number
  pb1Tax: number
  grandTotal: number
  onClose: () => void
  setPosPayMethod: (method: PosPayMethod) => void
  setPosCashGiven: (val: string) => void
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
  onClose,
  setPosPayMethod,
  setPosCashGiven,
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

        {/* HEADER WITH ORDER MODE SWITCHER */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="text-xs font-black text-slate-900 dark:text-white truncate">
                {t.cart.mobileCartTitle}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                {selectedPOSTable ? (
                  <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-500/15 px-2 py-0.2 rounded-full border border-amber-500/30">
                    🍽️ Meja {selectedPOSTable.name}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-500/15 px-2 py-0.2 rounded-full border border-indigo-500/30">
                    🛍️ Takeaway / Walk-In
                  </span>
                )}
                {onToggleOrderMode && (
                  <button
                    type="button"
                    onClick={onToggleOrderMode}
                    className="text-[10px] text-slate-500 hover:text-slate-900 dark:hover:text-white underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <ArrowRightLeft className="w-2.5 h-2.5" />
                    <span>Ubah</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            title="Tutup Keranjang"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CART BODY */}
        <div className="p-3 overflow-y-auto overscroll-contain flex-1 pb-6 custom-scrollbar">
          <PosCartSection
            cartItems={cartItems}
            selectedPOSTable={selectedPOSTable}
            posPayMethod={posPayMethod}
            posCashGiven={posCashGiven}
            subtotal={subtotal}
            pb1Tax={pb1Tax}
            grandTotal={grandTotal}
            setPosPayMethod={setPosPayMethod}
            setPosCashGiven={setPosCashGiven}
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
