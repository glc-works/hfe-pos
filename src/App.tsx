import React, { useState } from 'react'
import { 
  Coffee, 
  QrCode, 
  Smartphone, 
  CheckCircle2, 
  Users, 
  ShoppingBag, 
  CreditCard, 
  Ticket, 
  Gift, 
  Printer, 
  Plus, 
  Minus, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  Clock, 
  Flame, 
  DollarSign, 
  RefreshCw, 
  Share2, 
  ChevronRight, 
  Check, 
  Tag, 
  Percent, 
  UtensilsCrossed
} from 'lucide-react'

// --- TYPES ---
type SurfaceMode = 'mobile-qr' | 'barista-pos' | 'kds-kitchen'
type CustomerLoginType = 'phone' | 'guest-name'
type PaymentPolicy = 'pay-first' | 'open-tab'

interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  image: string
  description: string
  hasModifiers?: boolean
}

interface CartItem extends MenuItem {
  quantity: number
  temperature?: 'Hot' | 'Iced'
  sugarLevel?: '0%' | '50%' | '100%'
  milkOption?: 'Whole Milk' | 'Oat Milk (+Rp 5.000)' | 'Almond Milk (+Rp 5.000)'
}

interface TableStatus {
  id: string
  name: string
  status: 'free' | 'occupied' | 'open-tab'
  customerName?: string
  totalBill: number
  orderCount: number
}

interface OrderTicket {
  id: string
  table: string
  customerName: string
  phone?: string
  items: CartItem[]
  policy: PaymentPolicy
  total: number
  status: 'placed' | 'brewing' | 'ready' | 'served'
  timeElapsedSeconds: number
  createdAt: string
}

// --- MOCK PRODUCT MASTER DATA (REST API /v1/products) ---
const PRODUCT_CATALOG: MenuItem[] = [
  { id: 'PRD-01', name: 'Espresso Aren Latte', category: 'Coffee', price: 28000, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&q=80', description: 'Double espresso dengan gula aren organik dan susu segar', hasModifiers: true },
  { id: 'PRD-02', name: 'Spanish Latte', category: 'Coffee', price: 32000, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80', description: 'Rich espresso blended dengan condensed milk dan velvety foam', hasModifiers: true },
  { id: 'PRD-03', name: 'Japanese Cold Brew V60', category: 'Coffee', price: 35000, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80', description: 'Single-origin beans diseduh V60 langsung ke atas es batu', hasModifiers: true },
  { id: 'PRD-04', name: 'Matcha Oat Latte', category: 'Non-Coffee', price: 34000, image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80', description: 'Uji Matcha Jepang premium dicampur susu gandum Oatside', hasModifiers: true },
  { id: 'PRD-05', name: 'Croissant Butter Paris', category: 'Pastry', price: 25000, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80', description: 'Flaky pastry mentega Prancis panggang hangat' },
  { id: 'PRD-06', name: 'Truffle French Fries', category: 'Snack', price: 38000, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80', description: 'Kentang goreng renyah minyak truffle dan taburan keju parmesan' },
]

export default function App() {
  // --- SURFACE APP STATE ---
  const [activeSurface, setActiveSurface] = useState<SurfaceMode>('mobile-qr')
  
  // --- MOBILE QR SURFACE STATE ---
  const [selectedTable, setSelectedTable] = useState<string>('MEJA-04')
  const [loginType, setLoginType] = useState<CustomerLoginType>('phone')
  const [customerPhone, setCustomerPhone] = useState<string>('081298765432')
  const [guestName, setGuestName] = useState<string>('Aldi')
  const [referralInput, setReferralInput] = useState<string>('')
  const [referralClaimed, setReferralClaimed] = useState<boolean>(false)
  const [promoCodeInput, setPromoCodeInput] = useState<string>('')
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null)
  
  // Customer Loyalty & Wallet State (fetched via REST API)
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(450)
  const [userTier, setUserTier] = useState<{ name: string; multiplier: string; perk: string; icon: string }>({
    name: 'Kopi Barista (Gold Tier)',
    multiplier: '1.5x Multiplier',
    perk: 'Antrean Barista Prioritas & Diskon Biji Kopi 10%',
    icon: '🥇'
  })
  const [redeemedVoucher, setRedeemedVoucher] = useState<boolean>(false)

  // Cart & Policy State
  const [cart, setCart] = useState<CartItem[]>([
    { ...PRODUCT_CATALOG[0], quantity: 2, temperature: 'Iced', sugarLevel: '50%', milkOption: 'Oat Milk (+Rp 5.000)' },
    { ...PRODUCT_CATALOG[4], quantity: 1 }
  ])
  const [paymentPolicy, setPaymentPolicy] = useState<PaymentPolicy>('pay-first')
  const [showModifierModal, setShowModifierModal] = useState<MenuItem | null>(null)
  const [modTemp, setModTemp] = useState<'Hot' | 'Iced'>('Iced')
  const [modSugar, setModSugar] = useState<'0%' | '50%' | '100%'>('50%')
  const [modMilk, setModMilk] = useState<'Whole Milk' | 'Oat Milk (+Rp 5.000)' | 'Almond Milk (+Rp 5.000)'>('Oat Milk (+Rp 5.000)')
  const [showQRISModal, setShowQRISModal] = useState<boolean>(false)

  // --- KITCHEN & POS ORDERS STATE ---
  const [orders, setOrders] = useState<OrderTicket[]>([
    {
      id: 'ORD-8821',
      table: 'MEJA-04',
      customerName: 'Aldi',
      phone: '081298765432',
      items: [
        { ...PRODUCT_CATALOG[0], quantity: 2, temperature: 'Iced', sugarLevel: '50%', milkOption: 'Oat Milk (+Rp 5.000)' },
        { ...PRODUCT_CATALOG[4], quantity: 1 }
      ],
      policy: 'pay-first',
      total: 86000,
      status: 'brewing',
      timeElapsedSeconds: 180,
      createdAt: '19:24'
    },
    {
      id: 'ORD-8820',
      table: 'MEJA-12',
      customerName: 'Budi Santoso',
      phone: '081311223344',
      items: [
        { ...PRODUCT_CATALOG[1], quantity: 1, temperature: 'Hot', sugarLevel: '100%' },
        { ...PRODUCT_CATALOG[5], quantity: 1 }
      ],
      policy: 'open-tab',
      total: 70000,
      status: 'placed',
      timeElapsedSeconds: 450,
      createdAt: '19:18'
    }
  ])

  // --- POS TABLES FLOOR PLAN STATE ---
  const [tablesGrid, setTablesGrid] = useState<TableStatus[]>([
    { id: 'T1', name: 'MEJA-01', status: 'free', totalBill: 0, orderCount: 0 },
    { id: 'T2', name: 'MEJA-02', status: 'free', totalBill: 0, orderCount: 0 },
    { id: 'T3', name: 'MEJA-03', status: 'free', totalBill: 0, orderCount: 0 },
    { id: 'T4', name: 'MEJA-04', status: 'occupied', customerName: 'Aldi', totalBill: 86000, orderCount: 2 },
    { id: 'T5', name: 'MEJA-05', status: 'free', totalBill: 0, orderCount: 0 },
    { id: 'T12', name: 'MEJA-12', status: 'open-tab', customerName: 'Budi Santoso', totalBill: 140000, orderCount: 4 },
  ])

  // --- COMPUTED CART TOTALS ---
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
  const finalTotal = Math.max(0, rawSubtotal - totalDiscount)

  // --- HANDLERS ---
  const handleAddToCart = (item: MenuItem) => {
    if (item.hasModifiers) {
      setShowModifierModal(item)
    } else {
      setCart(prev => {
        const existing = prev.find(i => i.id === item.id)
        if (existing) {
          return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
        }
        return [...prev, { ...item, quantity: 1 }]
      })
    }
  }

  const handleConfirmModifier = () => {
    if (!showModifierModal) return
    setCart(prev => [
      ...prev,
      {
        ...showModifierModal,
        quantity: 1,
        temperature: modTemp,
        sugarLevel: modSugar,
        milkOption: modMilk
      }
    ])
    setShowModifierModal(null)
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

  const handleSubmitOrder = () => {
    if (cart.length === 0) return
    if (paymentPolicy === 'pay-first') {
      setShowQRISModal(true)
    } else {
      // Open Tab Direct Submit
      const newOrder: OrderTicket = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        table: selectedTable,
        customerName: loginType === 'phone' ? 'Customer HP' : guestName,
        phone: loginType === 'phone' ? customerPhone : undefined,
        items: [...cart],
        policy: 'open-tab',
        total: finalTotal,
        status: 'placed',
        timeElapsedSeconds: 10,
        createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
      setOrders(prev => [newOrder, ...prev])
      setCart([])
      alert(`Pesanan Open Tab meja ${selectedTable} telah terkirim ke Barista!`)
    }
  }

  const handleCompletePayFirstQRIS = () => {
    setShowQRISModal(false)
    const newOrder: OrderTicket = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      table: selectedTable,
      customerName: loginType === 'phone' ? 'Customer HP' : guestName,
      phone: loginType === 'phone' ? customerPhone : undefined,
      items: [...cart],
      policy: 'pay-first',
      total: finalTotal,
      status: 'brewing',
      timeElapsedSeconds: 15,
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
    setOrders(prev => [newOrder, ...prev])
    setCart([])
    setLoyaltyPoints(prev => prev + Math.floor(finalTotal / 10000))
    alert(`Pembayaran QRIS Berhasil! Pesanan meja ${selectedTable} sedang diseduh Barista.`)
  }

  const handleBumpKDSStatus = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const nextStatus = o.status === 'placed' ? 'brewing' : o.status === 'brewing' ? 'ready' : 'served'
        return { ...o, status: nextStatus }
      }
      return o
    }))
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      
      {/* --- TOP SYSTEM BAR SWITCHER --- */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/10">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight flex items-center gap-2">
              Hfe POS <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">F&B Suite</span>
            </h1>
            <p className="text-xs text-slate-400">Cafe Experience Layer • Hfe REST API Backend</p>
          </div>
        </div>

        {/* Surface Switcher Buttons */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSurface('mobile-qr')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSurface === 'mobile-qr'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            1. Customer Mobile QR
          </button>

          <button
            onClick={() => setActiveSurface('barista-pos')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSurface === 'barista-pos'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            2. Barista Touch POS
          </button>

          <button
            onClick={() => setActiveSurface('kds-kitchen')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSurface === 'kds-kitchen'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            3. Kitchen Display (KDS)
          </button>
        </div>
      </header>

      {/* --- SURFACE 1: CUSTOMER MOBILE QR WEB APP --- */}
      {activeSurface === 'mobile-qr' && (
        <main className="flex-1 max-w-md w-full mx-auto p-4 flex flex-col gap-5 pb-24">
          
          {/* Table Banner */}
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
                QR
              </div>
              <div>
                <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">Nomor Meja Ter-Scan</span>
                <h2 className="text-lg font-bold text-white">{selectedTable}</h2>
              </div>
            </div>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
            >
              {Array.from({ length: 20 }, (_, i) => `MEJA-${String(i + 1).padStart(2, '0')}`).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Customer Entry Mode Selector */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-500" /> Mode Masuk Pelanggan
              </span>
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setLoginType('phone')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    loginType === 'phone' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Nomor HP (Poin & Wallet)
                </button>
                <button
                  onClick={() => setLoginType('guest-name')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    loginType === 'guest-name' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Pure Guest (Nama Saja)
                </button>
              </div>
            </div>

            {loginType === 'phone' ? (
              <div className="flex flex-col gap-2 pt-1">
                <label className="text-[11px] text-slate-400">Nomor WhatsApp untuk Struk & Loyalty Wallet:</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 font-mono"
                  placeholder="0812..."
                />
                
                {/* Loyalty Tier & Wallet Badge */}
                <div className="mt-2 bg-gradient-to-br from-amber-500/10 via-slate-950 to-slate-950 border border-amber-500/30 rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      {userTier.icon} {userTier.name}
                    </span>
                    <span className="text-xs font-black text-amber-500 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                      {loyaltyPoints} Poin Hfe
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{userTier.perk}</p>
                  
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <span className="text-[11px] text-slate-400">Voucher Rp 10.000 Hfe</span>
                    <button
                      onClick={() => setRedeemedVoucher(!redeemedVoucher)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                        redeemedVoucher
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500 text-slate-950 border-amber-500 hover:bg-amber-400'
                      }`}
                    >
                      {redeemedVoucher ? '✓ Voucher Terpasang (-10rb)' : 'Tukar Poin Diskon'}
                    </button>
                  </div>
                </div>

                {/* Referral Code Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1"><Share2 className="w-3 h-3 text-amber-500" /> Kode Referral Anda:</span>
                    <span className="font-mono font-bold text-amber-400">ALDI-CAFE10</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={referralInput}
                      onChange={(e) => setReferralInput(e.target.value)}
                      placeholder="Masukkan Kode Referral Teman"
                      className="flex-1 bg-slate-900 border border-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none uppercase font-mono"
                    />
                    <button
                      onClick={handleClaimReferral}
                      disabled={referralClaimed}
                      className="bg-slate-800 hover:bg-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-200"
                    >
                      {referralClaimed ? '✓ Klaim (+100 Poin)' : 'Klaim'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <label className="text-[11px] text-slate-400">Nama Tampilan untuk Pengantaran Meja:</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 font-semibold"
                  placeholder="Masukkan Nama Anda..."
                />
              </div>
            )}
          </div>

          {/* Catalog Menu Grid */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Coffee className="w-4 h-4 text-amber-500" /> Katalog Menu Kafe
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {PRODUCT_CATALOG.map(item => (
                <div 
                  key={item.id}
                  className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 flex gap-3 hover:border-slate-700 transition-all"
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 rounded-xl object-cover border border-slate-800"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          {item.category}
                        </span>
                        <span className="text-xs font-bold text-emerald-400">
                          Rp {item.price.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-100 mt-1">{item.name}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                    </div>

                    <button
                      onClick={() => handleAddToCart(item)}
                      className="mt-2 self-end bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah Pesanan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart & Payment Policy Bar */}
          {cart.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-2xl">
              <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <ShoppingBag className="w-4 h-4 text-amber-500" /> Ringkasan Keranjang Pesanan Meja
              </h3>

              <div className="flex flex-col gap-2 divide-y divide-slate-800/60">
                {cart.map((item, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-200">{item.name}</p>
                      {item.temperature && (
                        <p className="text-[10px] text-slate-400">
                          {item.temperature} • Sugar {item.sugarLevel} • {item.milkOption}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleUpdateQty(idx, -1)}
                        className="w-6 h-6 bg-slate-800 rounded-md flex items-center justify-center text-slate-300 hover:bg-slate-700"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold font-mono text-slate-100 w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQty(idx, 1)}
                        className="w-6 h-6 bg-slate-800 rounded-md flex items-center justify-center text-slate-300 hover:bg-slate-700"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  placeholder="Kode Promo (cth: HAPPYHOUR)"
                  className="flex-1 bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-1.5 focus:outline-none uppercase font-mono"
                />
                <button
                  onClick={handleApplyPromo}
                  className="bg-slate-800 hover:bg-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl text-slate-200"
                >
                  Gunakan
                </button>
              </div>

              {/* Payment Policy Selector */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 mt-1">
                <span className="text-[11px] font-semibold text-slate-300">Kebijakan Pembayaran Kafe:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentPolicy('pay-first')}
                    className={`p-2 rounded-xl text-xs font-bold border text-left flex flex-col gap-0.5 transition-all ${
                      paymentPolicy === 'pay-first'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>1. Pay-First (Pre-Paid)</span>
                    <span className="text-[9px] font-normal text-slate-400">Bayar QRIS dulu baru diseduh</span>
                  </button>

                  <button
                    onClick={() => setPaymentPolicy('open-tab')}
                    className={`p-2 rounded-xl text-xs font-bold border text-left flex flex-col gap-0.5 transition-all ${
                      paymentPolicy === 'open-tab'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>2. Open Tab (Post-Paid)</span>
                    <span className="text-[9px] font-normal text-slate-400">Pesan dulu, bayar saat pulang</span>
                  </button>
                </div>
              </div>

              {/* Total Calculation Breakdown */}
              <div className="pt-2 border-t border-slate-800 flex flex-col gap-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span>Rp {rawSubtotal.toLocaleString('id-ID')}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Promo ({appliedPromo.code}):</span>
                    <span>-Rp {appliedPromo.discount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                {redeemedVoucher && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Voucher Points Hfe:</span>
                    <span>-Rp 10.000</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-white pt-1 border-t border-slate-800">
                  <span>Total Tagihan Meja:</span>
                  <span className="text-amber-400 font-mono">Rp {finalTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                onClick={handleSubmitOrder}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 mt-1"
              >
                {paymentPolicy === 'pay-first' ? (
                  <> <CreditCard className="w-4 h-4" /> Bayar QRIS & Kirim Dapur (Rp {finalTotal.toLocaleString('id-ID')}) </>
                ) : (
                  <> <CheckCircle2 className="w-4 h-4" /> Tambah ke Open Tab Meja </>
                )}
              </button>
            </div>
          )}
        </main>
      )}

      {/* --- SURFACE 2: BARISTA & CASHIER TOUCH POS --- */}
      {activeSurface === 'barista-pos' && (
        <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
          
          {/* Floor Plan & Tables Grid */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" /> Matriks Floor Plan Meja Kafe
                </h2>
                <p className="text-xs text-slate-400">Monitoring status keterisian meja & Open Tab Billing</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Free</span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">Occupied</span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">Open Tab</span>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {tablesGrid.map(table => (
                <div
                  key={table.id}
                  className={`border rounded-2xl p-4 flex flex-col justify-between h-32 transition-all cursor-pointer ${
                    table.status === 'occupied' 
                      ? 'bg-amber-500/10 border-amber-500/50'
                      : table.status === 'open-tab'
                      ? 'bg-indigo-500/10 border-indigo-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-slate-200">{table.name}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      table.status === 'occupied' ? 'bg-amber-500' : table.status === 'open-tab' ? 'bg-indigo-500' : 'bg-emerald-500'
                    }`} />
                  </div>

                  <div>
                    {table.customerName ? (
                      <p className="text-xs font-semibold text-slate-300 truncate">{table.customerName}</p>
                    ) : (
                      <p className="text-xs text-slate-500">Kosong</p>
                    )}
                    <p className="text-xs font-mono font-bold text-amber-400 mt-1">
                      {table.totalBill > 0 ? `Rp ${table.totalBill.toLocaleString('id-ID')}` : 'Rp 0'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cashier Control & Shift Drawer Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
              <DollarSign className="w-4 h-4 text-amber-500" /> Stasiun Kasir & Modal Shift (1010-Cash Drawer)
            </h3>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Kasir Shift Aktif:</span>
                <span className="font-semibold text-amber-400">Barista Staff #102</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Modal Kasir Awal:</span>
                <span className="font-mono text-slate-200">Rp 500.000</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Pemasukan Tunai Hari Ini:</span>
                <span className="font-mono text-emerald-400 font-bold">+Rp 1.450.000</span>
              </div>
            </div>

            <button 
              onClick={() => alert('Rekonsiliasi Modal Kasir Berhasil Dicetak & Disimpan ke Hfe!')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-2.5 rounded-xl border border-slate-700 flex items-center justify-center gap-2"
            >
              <Printer className="w-3.5 h-3.5" /> Rekonsiliasi & Tutup Shift Kasir
            </button>
          </div>
        </main>
      )}

      {/* --- SURFACE 3: KITCHEN DISPLAY SYSTEM (KDS) --- */}
      {activeSurface === 'kds-kitchen' && (
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-amber-500" /> Kitchen & Barista Display System (KDS)
              </h2>
              <p className="text-xs text-slate-400">Real-time Order Queue (<span className="text-emerald-400 font-mono">&lt; 500ms sync</span>)</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                {orders.length} Antrean Pesanan Active
              </span>
            </div>
          </div>

          {/* KDS Order Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map(order => (
              <div 
                key={order.id}
                className={`border rounded-2xl p-4 flex flex-col justify-between gap-4 shadow-xl ${
                  order.status === 'placed' 
                    ? 'bg-amber-950/20 border-amber-500/40' 
                    : order.status === 'brewing'
                    ? 'bg-indigo-950/20 border-indigo-500/40'
                    : 'bg-emerald-950/20 border-emerald-500/40'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div>
                    <span className="font-mono font-black text-sm text-white">{order.id}</span>
                    <h4 className="text-xs font-bold text-amber-400">{order.table} • {order.customerName}</h4>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                    order.status === 'placed' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {order.status}
                  </span>
                </div>

                {/* Items List */}
                <div className="flex flex-col gap-2 flex-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-200">{item.quantity}x {item.name}</p>
                        {item.temperature && (
                          <p className="text-[10px] text-amber-400/90 font-medium">
                            {item.temperature} • {item.sugarLevel} Sugar • {item.milkOption}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* KDS Action Button */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">{order.createdAt}</span>
                  <button
                    onClick={() => handleBumpKDSStatus(order.id)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg shadow"
                  >
                    Bump Status ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* --- DRINK MODIFIER MODAL --- */}
      {showModifierModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 flex flex-col gap-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Coffee className="w-5 h-5 text-amber-500" /> Kustomisasi {showModifierModal.name}
            </h3>

            {/* Temp */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">Suhu Minuman:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setModTemp('Iced')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    modTemp === 'Iced' ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  🧊 Iced
                </button>
                <button
                  onClick={() => setModTemp('Hot')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    modTemp === 'Hot' ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  ☕ Hot
                </button>
              </div>
            </div>

            {/* Sugar */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">Tingkat Manis / Sugar:</label>
              <div className="grid grid-cols-3 gap-2">
                {(['0%', '50%', '100%'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setModSugar(s)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      modSugar === s ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleConfirmModifier}
              className="w-full bg-amber-500 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-lg mt-2"
            >
              Konfirmasi & Tambah ke Keranjang
            </button>
          </div>
        </div>
      )}

      {/* --- QRIS PAYMENT MODAL --- */}
      {showQRISModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 flex flex-col items-center gap-4 text-center shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-amber-500" /> Pembayaran QRIS ASPI
            </h3>
            
            <div className="bg-white p-4 rounded-2xl shadow-inner border border-slate-200">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=HFE-POS-CAFE-QRIS" 
                alt="QRIS Code" 
                className="w-44 h-44"
              />
            </div>

            <p className="text-xs text-slate-400">Scan QRIS menggunakan GoPay, OVO, ShopeePay, atau Mobile Banking Anda</p>

            <button
              onClick={handleCompletePayFirstQRIS}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-lg"
            >
              ✓ Simulasi Pembayaran Sukses (Pay-First)
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
