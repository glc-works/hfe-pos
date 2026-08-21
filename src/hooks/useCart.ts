import { useState } from 'react'
import { CartItem, MenuItem, PaymentPolicy, PB1TaxMode, OrderTicket, CustomerProfile } from '../types/pos'
import { createPendingFinancialState } from '../services/financial/flagshipFinancialState'

export interface UseCartOptions {
  productCatalog: MenuItem[]
  hfeCompanyProfile: { ptLegalName: string; brandName: string }
  onOrderSubmitted?: (newOrder: OrderTicket) => void
}

export function useCart(options: UseCartOptions) {
  const { productCatalog, hfeCompanyProfile, onOrderSubmitted } = options

  // Login / Referral / Loyalty State
  const [loginType, setLoginType] = useState<'phone' | 'guest-name'>('phone')
  const [customerPhone, setCustomerPhone] = useState<string>('081298765432')
  const [guestName, setGuestName] = useState<string>('Aldi')
  const [customerAvatar, setCustomerAvatar] = useState<string>('☕')
  const [referralInput, setReferralInput] = useState<string>('')
  const [referralClaimed, setReferralClaimed] = useState<boolean>(false)
  const [promoCodeInput, setPromoCodeInput] = useState<string>('')
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null)
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(450)
  const [redeemedVoucher, setRedeemedVoucher] = useState<boolean>(false)

  // Cart & Policy State
  const [cart, setCart] = useState<CartItem[]>([
    {
      ...productCatalog[0],
      quantity: 2,
      seatNumber: 'Seat 1',
      seatCustomerContact: { name: 'Aldi', phone: '081298765432', savedPreferences: 'Oat Milk 50% Sugar' },
      allergenNotes: 'Alergi Lactose (Ganti Oatside)',
      temperature: 'Iced',
      sugarLevel: '50%',
      milkOption: 'Oat Milk (+Rp 5.000)'
    },
    {
      ...productCatalog[4],
      quantity: 1,
      seatNumber: 'Seat 2',
      seatCustomerContact: { name: 'Siti Rahma', phone: '081599887766', savedPreferences: 'No Sugar' }
    }
  ])
  const [paymentPolicy, setPaymentPolicy] = useState<PaymentPolicy>('pay-first')

  // Modifier Modal State
  const [showModifierModal, setShowModifierModal] = useState<MenuItem | null>(null)
  const [modTemp, setModTemp] = useState<'Hot' | 'Iced'>('Iced')
  const [modSugar, setModSugar] = useState<'0%' | '50%' | '100%'>('50%')
  const [modMilk, setModMilk] = useState<'Whole Milk' | 'Oat Milk (+Rp 5.000)' | 'Almond Milk (+Rp 5.000)'>('Oat Milk (+Rp 5.000)')
  const [modSeat, setModSeat] = useState<string>('Seat 1')
  const [modSeatCustomerName, setModSeatCustomerName] = useState<string>('Aldi')
  const [modSeatCustomerPhone, setModSeatCustomerPhone] = useState<string>('081298765432')
  const [modAllergen, setModAllergen] = useState<string>('')
  const [showQRISModal, setShowQRISModal] = useState<boolean>(false)

  // Tax & Fee Configurations
  const [taxPB1Mode, setTaxPB1Mode] = useState<PB1TaxMode>(1) // 0=Off, 1=Exclude (Show), 2=Include (Embedded)
  const [serviceFeeRate, setServiceFeeRate] = useState<number>(5) // 5% Service Charge
  const [selectedTipAmount, setSelectedTipAmount] = useState<number>(5000) // Default Rp 5.000 Tip

  // Dynamic Pricing Math
  const rawSubtotal = cart.reduce((sum, item) => {
    let itemPrice = item.price
    if (item.milkOption?.includes('Oat Milk') || item.milkOption?.includes('Almond Milk')) {
      itemPrice += 5000
    }
    return sum + (itemPrice * item.quantity)
  }, 0)

  const promoDiscount = appliedPromo ? appliedPromo.discount : 0
  const voucherDiscount = redeemedVoucher ? 10000 : 0
  const totalDiscount = promoDiscount + voucherDiscount
  const discountedSubtotal = Math.max(0, rawSubtotal - totalDiscount)

  const calculatedServiceFee = Math.round(discountedSubtotal * (serviceFeeRate / 100))

  let calculatedPB1Tax = 0
  if (taxPB1Mode === 1) {
    calculatedPB1Tax = Math.round(discountedSubtotal * 0.10)
  } else if (taxPB1Mode === 2) {
    calculatedPB1Tax = Math.round(discountedSubtotal - (discountedSubtotal / 1.10))
  }

  const grandTotalBill = taxPB1Mode === 1
    ? discountedSubtotal + calculatedServiceFee + calculatedPB1Tax + selectedTipAmount
    : discountedSubtotal + calculatedServiceFee + selectedTipAmount

  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0)

  // Actions & Handlers
  const handleAddToCart = (item: MenuItem | CartItem) => {
    // If it's already a configured CartItem (e.g. from modifier sheet with quantity or temperature)
    if ('quantity' in item && typeof item.quantity === 'number') {
      const cartItem = item as CartItem
      setCart(prev => {
        const existingIdx = prev.findIndex(i => 
          i.id === cartItem.id && 
          i.temperature === cartItem.temperature && 
          i.sugarLevel === cartItem.sugarLevel && 
          i.milkOption === cartItem.milkOption &&
          i.customNotes === cartItem.customNotes
        )
        if (existingIdx >= 0) {
          return prev.map((i, idx) => idx === existingIdx ? { ...i, quantity: i.quantity + cartItem.quantity } : i)
        }
        return [...prev, { ...cartItem, seatNumber: cartItem.seatNumber || 'Seat 1' }]
      })
    } else if ('hasModifiers' in item && item.hasModifiers) {
      setShowModifierModal(item as MenuItem)
    } else {
      setCart(prev => {
        const existing = prev.find(i => i.id === item.id)
        if (existing) {
          return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
        }
        return [...prev, { ...item, quantity: 1, seatNumber: 'Seat 1' }]
      })
    }
  }

  const handleConfirmModifier = (customerProfiles: CustomerProfile[], setCustomerProfiles: React.Dispatch<React.SetStateAction<CustomerProfile[]>>) => {
    if (!showModifierModal) return

    if (modSeatCustomerName.trim()) {
      const existingProfileIndex = customerProfiles.findIndex(
        c => c.name.toLowerCase() === modSeatCustomerName.toLowerCase() || (modSeatCustomerPhone && c.phone === modSeatCustomerPhone)
      )

      if (existingProfileIndex >= 0) {
        setCustomerProfiles(prev => prev.map((c, idx) => idx === existingProfileIndex ? {
          ...c,
          favoriteSeat: modSeat,
          preferredMilk: modMilk,
          preferredSugar: modSugar,
          allergenAlert: modAllergen || c.allergenAlert,
          totalVisits: c.totalVisits + 1
        } : c))
      } else {
        setCustomerProfiles(prev => [
          ...prev,
          {
            id: `CUST-0${prev.length + 1}`,
            name: modSeatCustomerName,
            phone: modSeatCustomerPhone || '081200009999',
            favoriteSeat: modSeat,
            favoriteDrink: showModifierModal.name,
            preferredMilk: modMilk,
            preferredSugar: modSugar,
            allergenAlert: modAllergen || undefined,
            totalVisits: 1,
            loyaltyTier: 'Silver Member'
          }
        ])
      }
    }

    setCart(prev => [
      ...prev,
      {
        ...showModifierModal,
        quantity: 1,
        seatNumber: modSeat,
        seatCustomerContact: modSeatCustomerName ? {
          name: modSeatCustomerName,
          phone: modSeatCustomerPhone,
          savedPreferences: `${modMilk.replace(' (+Rp 5.000)', '')} • ${modSugar}`
        } : undefined,
        allergenNotes: modAllergen.trim() || undefined,
        temperature: modTemp,
        sugarLevel: modSugar,
        milkOption: modMilk
      }
    ])
    setShowModifierModal(null)
    setModAllergen('')
  }

  const handleUpdateQty = (index: number, delta: number) => {
    setCart(prev => {
      const updated = [...prev]
      const newQty = updated[index].quantity + delta
      if (newQty <= 0) {
        updated.splice(index, 1)
      } else {
        updated[index].quantity = newQty
      }
      return updated
    })
  }

  const handleApplyPromo = () => {
    if (promoCodeInput.toUpperCase() === 'HAPPYHOUR' || promoCodeInput.toUpperCase() === 'WEEKEND20') {
      setAppliedPromo({ code: promoCodeInput.toUpperCase(), discount: 15000 })
    } else {
      alert('Kode Promo tidak ditemukan atau sudah kadaluarsa')
    }
  }

  const handleClaimReferral = () => {
    if (referralInput.trim()) {
      setReferralClaimed(true)
      setLoyaltyPoints(prev => prev + 100)
    }
  }

  const handleSubmitOrder = (selectedTable: string, setQrStepView: (v: 'catalog' | 'checkout') => void) => {
    if (cart.length === 0) return
    if (paymentPolicy === 'pay-first') {
      setShowQRISModal(true)
    } else {
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`
      const newOrder: OrderTicket = {
        id: orderId,
        table: selectedTable,
        customerName: loginType === 'phone' ? 'Customer HP' : guestName,
        phone: loginType === 'phone' ? customerPhone : undefined,
        items: [...cart],
        policy: 'open-tab',
        total: grandTotalBill,
        taxPB1Amount: calculatedPB1Tax,
        serviceFeeAmount: calculatedServiceFee,
        tipAmount: selectedTipAmount,
        status: 'placed',
        timeElapsedMinutes: 1,
        createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        financialState: {
          status: 'not_started',
          sourceOrderId: orderId,
          idempotencyKey: `POS-${orderId}`,
          displayLabel: 'Not started',
        },
      }
      onOrderSubmitted?.(newOrder)
      setCart([])
      setQrStepView('catalog')
      alert(`Pesanan Open Tab meja ${selectedTable} terkirim ke KDS Dapur (${hfeCompanyProfile.ptLegalName}). Status pembukuan: belum dimulai.`)
    }
  }

  const handleCompletePayFirstQRIS = (selectedTable: string, setQrStepView: (v: 'catalog' | 'checkout') => void) => {
    setShowQRISModal(false)
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`
    const newOrder: OrderTicket = {
      id: orderId,
      table: selectedTable,
      customerName: loginType === 'phone' ? 'Customer HP' : guestName,
      phone: loginType === 'phone' ? customerPhone : undefined,
      items: [...cart],
      policy: 'pay-first',
      total: grandTotalBill,
      taxPB1Amount: calculatedPB1Tax,
      serviceFeeAmount: calculatedServiceFee,
      tipAmount: selectedTipAmount,
      status: 'processing',
      timeElapsedMinutes: 1,
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      financialState: createPendingFinancialState(orderId, `POS-${orderId}`),
    }
    onOrderSubmitted?.(newOrder)
    setCart([])
    setQrStepView('catalog')
    setLoyaltyPoints(prev => prev + Math.floor(grandTotalBill / 10000))
    alert(`Pesanan meja ${selectedTable} masuk KDS Dapur (${hfeCompanyProfile.ptLegalName}). Status pembukuan: menunggu verifikasi Hfe CORE.`)
  }

  const clearCart = () => setCart([])

  return {
    cart,
    setCart,
    paymentPolicy,
    setPaymentPolicy,
    loginType,
    setLoginType,
    customerPhone,
    setCustomerPhone,
    guestName,
    setGuestName,
    customerAvatar,
    setCustomerAvatar,
    referralInput,
    setReferralInput,
    referralClaimed,
    setReferralClaimed,
    promoCodeInput,
    setPromoCodeInput,
    appliedPromo,
    setAppliedPromo,
    loyaltyPoints,
    setLoyaltyPoints,
    redeemedVoucher,
    setRedeemedVoucher,
    taxPB1Mode,
    setTaxPB1Mode,
    serviceFeeRate,
    setServiceFeeRate,
    selectedTipAmount,
    setSelectedTipAmount,
    showModifierModal,
    setShowModifierModal,
    modTemp,
    setModTemp,
    modSugar,
    setModSugar,
    modMilk,
    setModMilk,
    modSeat,
    setModSeat,
    modSeatCustomerName,
    setModSeatCustomerName,
    modSeatCustomerPhone,
    setModSeatCustomerPhone,
    modAllergen,
    setModAllergen,
    showQRISModal,
    setShowQRISModal,
    rawSubtotal,
    promoDiscount,
    voucherDiscount,
    totalDiscount,
    discountedSubtotal,
    calculatedServiceFee,
    calculatedPB1Tax,
    grandTotalBill,
    totalCartCount,
    handleAddToCart,
    handleConfirmModifier,
    handleUpdateQty,
    handleApplyPromo,
    handleClaimReferral,
    handleSubmitOrder,
    handleCompletePayFirstQRIS,
    clearCart
  }
}
