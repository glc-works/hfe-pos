import React from 'react'
import { ShoppingBag, X } from 'lucide-react'
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
  onOpenSplitPayment
}) => {
  const { t } = useTranslation()

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end justify-center p-0">
      <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl w-full max-w-[420px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-400" /> {t.cart.mobileCartTitle}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1 pb-8">
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
          />
        </div>
      </div>
    </div>
  )
}
