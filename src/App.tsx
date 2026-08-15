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
  UtensilsCrossed,
  ArrowRight,
  ArrowLeft,
  ChefHat,
  Banknote,
  Receipt,
  List,
  Kanban,
  BookOpen,
  SlidersHorizontal,
  FileText,
  Layers,
  X,
  Settings,
  Filter
} from 'lucide-react'

// --- TYPES ---
type SurfaceMode = 'mobile-qr' | 'barista-pos' | 'kds-screen'
type CustomerLoginType = 'phone' | 'guest-name'
type PaymentPolicy = 'pay-first' | 'open-tab'

interface StationConfig {
  id: string
  name: string
  icon: string
  categories: string[]
}

interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  image: string
  description: string
  hasModifiers?: boolean
  bomIngredients?: { name: string; amount: string }[]
  preparationSteps?: string[]
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
  status: 'placed' | 'processing' | 'ready'
  timeElapsedMinutes: number
  createdAt: string
}

// --- MOCK PRODUCT MASTER DATA WITH BOM & PREPARATION SOP ---
const PRODUCT_CATALOG: MenuItem[] = [
  { 
    id: 'PRD-01', 
    name: 'Espresso Aren Latte', 
    category: 'Coffee', 
    price: 28000, 
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&q=80', 
    description: 'Double espresso dengan gula aren organik dan susu segar', 
    hasModifiers: true,
    bomIngredients: [
      { name: 'Houseblend Arabica Beans', amount: '18 gram' },
      { name: 'Oatside Oat Milk / Fresh Milk', amount: '150 ml' },
      { name: 'Liquid Organic Aren Syrup', amount: '20 ml' },
      { name: 'Ice Cubes', amount: '120 gram' }
    ],
    preparationSteps: [
      '1. Grinding 18g biji kopi Arabica Houseblend ke portafilter double shot.',
      '2. Tamping rata & ekstraksi espresso 36ml yield dalam durasi 26-28 detik.',
      '3. Tuang 20ml Sirup Aren Organik ke dasar gelas saji.',
      '4. Masukkan es batu 120g dan tuang 150ml Susu Oat / Fresh Milk.',
      '5. Tuangkan double shot espresso di lapisan paling atas (layering visual).'
    ]
  },
  { 
    id: 'PRD-02', 
    name: 'Spanish Latte', 
    category: 'Coffee', 
    price: 32000, 
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80', 
    description: 'Rich espresso blended dengan condensed milk dan velvety foam', 
    hasModifiers: true,
    bomIngredients: [
      { name: 'Espresso Beans Single Origin', amount: '18 gram' },
      { name: 'Sweetened Condensed Milk', amount: '25 ml' },
      { name: 'Fresh Milk Steamed/Cold', amount: '140 ml' }
    ],
    preparationSteps: [
      '1. Campur 25ml kental manis ke gelas saji.',
      '2. Ekstraksi double shot espresso (36ml).',
      '3. Foam susu segar hingga microfoam creamy (65°C untuk Hot / Cold froth untuk Iced).',
      '4. Aduk rata sebelum disajikan.'
    ]
  },
  { 
    id: 'PRD-03', 
    name: 'Japanese Cold Brew V60', 
    category: 'Coffee', 
    price: 35000, 
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80', 
    description: 'Single-origin beans diseduh V60 langsung ke atas es batu', 
    hasModifiers: true,
    bomIngredients: [
      { name: 'Single Origin Filter Beans (Ethiopia/Gayo)', amount: '15 gram' },
      { name: 'Air Panas (92°C)', amount: '150 ml' },
      { name: 'Ice Cubes Server', amount: '100 gram' }
    ],
    preparationSteps: [
      '1. Giling 15g kopi medium-coarse filter grind.',
      '2. Masukkan 100g es batu ke dalam server V60.',
      '3. Pouring bloom 30ml selama 45 detik, dilanjutkan pour melingkar hingga total 150ml air.'
    ]
  },
  { 
    id: 'PRD-04', 
    name: 'Matcha Oat Latte', 
    category: 'Non-Coffee', 
    price: 34000, 
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80', 
    description: 'Uji Matcha Jepang premium dicampur susu gandum Oatside', 
    hasModifiers: true,
    bomIngredients: [
      { name: 'Uji Matcha Powder Premium', amount: '6 gram' },
      { name: 'Air Hangat (80°C)', amount: '30 ml' },
      { name: 'Oatside Oat Milk', amount: '160 ml' }
    ],
    preparationSteps: [
      '1. Whisk 6g bubuk Matcha Uji dengan 30ml air hangat 80°C hingga terlarut sempurna.',
      '2. Tuang 160ml Susu Oatside dingin dan es batu ke gelas.',
      '3. Tuangkan konsentrat matcha di bagian atas.'
    ]
  },
  { 
    id: 'PRD-05', 
    name: 'Croissant Butter Paris', 
    category: 'Pastry', 
    price: 25000, 
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80', 
    description: 'Flaky pastry mentega Prancis panggang hangat',
    bomIngredients: [
      { name: 'Pre-baked Butter Croissant', amount: '1 pcs' },
      { name: 'French Salted Butter', amount: '10 gram' }
    ],
    preparationSteps: [
      '1. Masukkan croissant ke oven salamander / air fryer suhu 180°C selama 3 menit.',
      '2. Sajikan hangat di atas piring pastry kayu dengan rincian butter pad di samping.'
    ]
  },
  { 
    id: 'PRD-06', 
    name: 'Truffle French Fries', 
    category: 'Snack', 
    price: 38000, 
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80', 
    description: 'Kentang goreng renyah minyak truffle dan taburan keju parmesan',
    bomIngredients: [
      { name: 'Shoestring French Fries', amount: '180 gram' },
      { name: 'White Truffle Oil', amount: '5 ml' },
      { name: 'Grated Parmesan Cheese', amount: '15 gram' },
      { name: 'Parsley Flakes', amount: '2 gram' }
    ],
    preparationSteps: [
      '1. Goreng kentang di deep fryer suhu 175°C selama 4 menit hingga golden crispy.',
      '2. Tiriskan, toss dalam mixing bowl dengan 5ml White Truffle Oil & garam.',
      '3. Plating di keranjang saji, taburi 15g keju parmesan serut dan parsley flakes.'
    ]
  },
]

export default function App() {
  // --- SURFACE APP STATE ---
  const [activeSurface, setActiveSurface] = useState<SurfaceMode>('kds-screen')
  
  // --- KDS VIEW, SORTING & CUSTOM STATIONS STATE ---
  const [kdsViewMode, setKdsViewMode] = useState<'kanban' | 'list'>('kanban')
  const [kdsSortBy, setKdsSortBy] = useState<'time-desc' | 'time-asc' | 'category'>('time-desc')
  const [selectedRecipeBOM, setSelectedRecipeBOM] = useState<MenuItem | null>(null)
  
  // Owner Custom Station Split State
  const [activeStationId, setActiveStationId] = useState<string>('all')
  const [showStationSettingsModal, setShowStationSettingsModal] = useState<boolean>(false)
  const [stations, setStations] = useState<StationConfig[]>([
    { id: 'all', name: 'Semua Station (Gabungan)', icon: '🌟', categories: ['Coffee', 'Non-Coffee', 'Pastry', 'Snack'] },
    { id: 'drink-bar', name: 'Drink Bar (Barista)', icon: '☕', categories: ['Coffee', 'Non-Coffee'] },
    { id: 'hot-kitchen', name: 'Hot Kitchen (Dapur Utm)', icon: '🍳', categories: ['Snack'] },
    { id: 'pastry-bakery', name: 'Pastry & Bakery', icon: '🥐', categories: ['Pastry'] },
  ])

  // --- MOBILE QR SURFACE STATE ---
  const [selectedTable, setSelectedTable] = useState<string>('MEJA-04')
  const [loginType, setLoginType] = useState<CustomerLoginType>('phone')
  const [customerPhone, setCustomerPhone] = useState<string>('081298765432')
  const [guestName, setGuestName] = useState<string>('Aldi')
  const [referralInput, setReferralInput] = useState<string>('')
  const [referralClaimed, setReferralClaimed] = useState<boolean>(false)
  const [promoCodeInput, setPromoCodeInput] = useState<string>('')
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null)
  
  // Customer Loyalty & Wallet State
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(450)
  const [userTier] = useState({
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

  // --- KITCHEN KANBAN ORDERS STATE ---
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
      status: 'processing',
      timeElapsedMinutes: 4,
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
      timeElapsedMinutes: 8,
      createdAt: '19:18'
    },
    {
      id: 'ORD-8819',
      table: 'MEJA-08',
      customerName: 'Siti Rahma',
      phone: '081599887766',
      items: [
        { ...PRODUCT_CATALOG[2], quantity: 2, temperature: 'Iced', sugarLevel: '0%' }
      ],
      policy: 'pay-first',
      total: 70000,
      status: 'ready',
      timeElapsedMinutes: 12,
      createdAt: '19:14'
    }
  ])

  // --- POS TABLES & CASHIER STATE ---
  const [tablesGrid, setTablesGrid] = useState<TableStatus[]>([
    { id: 'T1', name: 'MEJA-01', status: 'free', totalBill: 0, orderCount: 0 },
    { id: 'T2', name: 'MEJA-02', status: 'free', totalBill: 0, orderCount: 0 },
    { id: 'T3', name: 'MEJA-03', status: 'free', totalBill: 0, orderCount: 0 },
    { id: 'T4', name: 'MEJA-04', status: 'occupied', customerName: 'Aldi', totalBill: 86000, orderCount: 2 },
    { id: 'T5', name: 'MEJA-05', status: 'free', totalBill: 0, orderCount: 0 },
    { id: 'T12', name: 'MEJA-12', status: 'open-tab', customerName: 'Budi Santoso', totalBill: 140000, orderCount: 4 },
  ])
  const [selectedPOSTable, setSelectedPOSTable] = useState<TableStatus | null>(tablesGrid[3])
  const [posPayMethod, setPosPayMethod] = useState<'cash' | 'qris' | 'card'>('qris')
  const [posCashGiven, setPosCashGiven] = useState<string>('100000')

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
      const newOrder: OrderTicket = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        table: selectedTable,
        customerName: loginType === 'phone' ? 'Customer HP' : guestName,
        phone: loginType === 'phone' ? customerPhone : undefined,
        items: [...cart],
        policy: 'open-tab',
        total: finalTotal,
        status: 'placed',
        timeElapsedMinutes: 1,
        createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
      setOrders(prev => [newOrder, ...prev])
      setCart([])
      alert(`Pesanan Open Tab meja ${selectedTable} terkirim ke KDS Dapur!`)
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
      status: 'processing',
      timeElapsedMinutes: 1,
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
    setOrders(prev => [newOrder, ...prev])
    setCart([])
    setLoyaltyPoints(prev => prev + Math.floor(finalTotal / 10000))
    alert(`Pembayaran QRIS Sukses! Pesanan meja ${selectedTable} masuk KDS Dapur.`)
  }

  const handlePOSCheckoutTable = () => {
    if (!selectedPOSTable || selectedPOSTable.totalBill === 0) return
    setTablesGrid(prev => prev.map(t => t.id === selectedPOSTable.id ? { ...t, status: 'free', totalBill: 0, customerName: undefined } : t))
    alert(`Pembayaran Meja ${selectedPOSTable.name} (${selectedPOSTable.customerName}) LUNAS via ${posPayMethod.toUpperCase()}! Struk Penjualan Terkirim ke Hfe REST API.`)
    setSelectedPOSTable(null)
  }

  const handleMoveKanbanColumn = (orderId: string, targetStatus: 'placed' | 'processing' | 'ready') => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: targetStatus }
      }
      return o
    }))
  }

  // --- KDS STATION FILTERING & SORTING LOGIC ---
  const currentStation = stations.find(s => s.id === activeStationId) || stations[0]

  const stationFilteredOrders = orders.map(order => {
    if (activeStationId === 'all') return order
    const filteredItems = order.items.filter(item => currentStation.categories.includes(item.category))
    if (filteredItems.length === 0) return null
    return { ...order, items: filteredItems }
  }).filter(Boolean) as OrderTicket[]

  const sortedOrders = [...stationFilteredOrders].sort((a, b) => {
    if (kdsSortBy === 'time-desc') return b.timeElapsedMinutes - a.timeElapsedMinutes
    if (kdsSortBy === 'time-asc') return a.timeElapsedMinutes - b.timeElapsedMinutes
    return a.items[0]?.category.localeCompare(b.items[0]?.category || '') || 0
  })

  const placedOrders = sortedOrders.filter(o => o.status === 'placed')
  const processingOrders = sortedOrders.filter(o => o.status === 'processing')
  const readyOrders = sortedOrders.filter(o => o.status === 'ready')

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      
      {/* --- TOP SYSTEM BAR SWITCHER (MOBILE VIEWPORT FIRST • 100% FLUID) --- */}
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-40 px-3 sm:px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/10">
              <Coffee className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base tracking-tight flex items-center gap-1.5">
                Hfe POS <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">F&B Suite</span>
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400">Mobile-First View • Tablet Secondary</p>
            </div>
          </div>

          <span className="sm:hidden text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            📱 Mobile View
          </span>
        </div>

        {/* Surface Switcher Buttons */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto justify-between overflow-x-auto">
          <button
            onClick={() => setActiveSurface('mobile-qr')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeSurface === 'mobile-qr'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            1. Mobile QR
          </button>

          <button
            onClick={() => setActiveSurface('barista-pos')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeSurface === 'barista-pos'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            2. Touch POS
          </button>

          <button
            onClick={() => setActiveSurface('kds-screen')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeSurface === 'kds-screen'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            3. Kitchen KDS
          </button>
        </div>
      </header>

      {/* --- SURFACE 1: CUSTOMER MOBILE QR WEB APP --- */}
      {activeSurface === 'mobile-qr' && (
        <main className="flex-1 max-w-md w-full mx-auto p-3 sm:p-4 flex flex-col gap-4 pb-24">
          
          {/* Table Banner */}
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 p-3.5 rounded-2xl flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">
                QR
              </div>
              <div>
                <span className="text-[10px] font-medium text-amber-400 uppercase tracking-wider">Meja Ter-Scan</span>
                <h2 className="text-base font-bold text-white">{selectedTable}</h2>
              </div>
            </div>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-2 py-1.5 focus:outline-none focus:border-amber-500"
            >
              {Array.from({ length: 20 }, (_, i) => `MEJA-${String(i + 1).padStart(2, '0')}`).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Customer Entry Mode Selector */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-500" /> Mode Masuk Pelanggan
              </span>
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 w-full sm:w-auto justify-between">
                <button
                  onClick={() => setLoginType('phone')}
                  className={`flex-1 sm:flex-initial px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    loginType === 'phone' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Nomor HP (Poin)
                </button>
                <button
                  onClick={() => setLoginType('guest-name')}
                  className={`flex-1 sm:flex-initial px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    loginType === 'guest-name' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Pure Guest (Nama)
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
                <div className="mt-1 bg-gradient-to-br from-amber-500/10 via-slate-950 to-slate-950 border border-amber-500/30 rounded-xl p-3 flex flex-col gap-2">
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
            <h3 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-2">
              <Coffee className="w-4 h-4 text-amber-500" /> Katalog Menu Kafe & Resto
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
                    <span className="text-[9px] font-normal text-slate-400">Bayar QRIS dulu baru diproses</span>
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
        <main className="flex-1 p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto w-full">
          
          {/* Floor Plan & Tables Grid */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" /> Matriks Floor Plan Meja Kafe
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-400">Monitoring status keterisian meja & Open Tab Billing</p>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Free</span>
                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">Occupied</span>
                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">Open Tab</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {tablesGrid.map(table => (
                <div
                  key={table.id}
                  onClick={() => setSelectedPOSTable(table)}
                  className={`border rounded-2xl p-3 sm:p-4 flex flex-col justify-between h-28 sm:h-32 transition-all cursor-pointer ${
                    selectedPOSTable?.id === table.id
                      ? 'ring-2 ring-amber-500 bg-amber-500/20 border-amber-500'
                      : table.status === 'occupied' 
                      ? 'bg-amber-500/10 border-amber-500/50'
                      : table.status === 'open-tab'
                      ? 'bg-indigo-500/10 border-indigo-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs sm:text-sm text-slate-200">{table.name}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      table.status === 'occupied' ? 'bg-amber-500' : table.status === 'open-tab' ? 'bg-indigo-500' : 'bg-emerald-500'
                    }`} />
                  </div>

                  <div>
                    {table.customerName ? (
                      <p className="text-[11px] sm:text-xs font-semibold text-slate-300 truncate">{table.customerName}</p>
                    ) : (
                      <p className="text-[11px] text-slate-500">Kosong</p>
                    )}
                    <p className="text-xs font-mono font-bold text-amber-400 mt-0.5">
                      {table.totalBill > 0 ? `Rp ${table.totalBill.toLocaleString('id-ID')}` : 'Rp 0'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Catalog Grid for Walk-In / Cashier Direct Order */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col gap-3">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Coffee className="w-4 h-4 text-amber-500" /> Katalog Kasir Touchscreen (Pesanan Walk-In / Takeaway)
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRODUCT_CATALOG.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (selectedPOSTable) {
                        setTablesGrid(prev => prev.map(t => t.id === selectedPOSTable.id ? { ...t, status: 'open-tab', totalBill: t.totalBill + item.price, orderCount: t.orderCount + 1 } : t))
                      }
                    }}
                    className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left p-2.5 rounded-xl flex flex-col justify-between h-20 transition-all"
                  >
                    <span className="font-bold text-xs text-slate-200 line-clamp-1">{item.name}</span>
                    <span className="text-[11px] font-mono font-bold text-amber-400">Rp {item.price.toLocaleString('id-ID')}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cashier Control & Open Tab Checkout Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
                <Receipt className="w-4 h-4 text-amber-500" /> Stasiun Kasir & Pelunasan Meja
              </h3>

              {selectedPOSTable ? (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-xs font-bold text-amber-400 font-mono">{selectedPOSTable.name}</span>
                      <h4 className="text-sm font-bold text-white">{selectedPOSTable.customerName || 'Pelanggan Walk-In'}</h4>
                    </div>
                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      {selectedPOSTable.status}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Jumlah Item:</span>
                    <span className="font-bold text-slate-200">{selectedPOSTable.orderCount} Items</span>
                  </div>

                  <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                    <span>Total Tagihan Meja:</span>
                    <span className="text-amber-400 font-mono text-base">Rp {selectedPOSTable.totalBill.toLocaleString('id-ID')}</span>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="flex flex-col gap-1.5 pt-2">
                    <label className="text-[11px] text-slate-400">Metode Pembayaran Kasir:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['cash', 'qris', 'card'] as const).map(method => (
                        <button
                          key={method}
                          onClick={() => setPosPayMethod(method)}
                          className={`py-2 rounded-lg text-xs font-bold border uppercase transition-all ${
                            posPayMethod === method
                              ? 'bg-amber-500 text-slate-950 border-amber-500'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  {posPayMethod === 'cash' && (
                    <div className="flex flex-col gap-1 pt-1">
                      <label className="text-[11px] text-slate-400">Uang Tunai Diterima:</label>
                      <input
                        type="text"
                        value={posCashGiven}
                        onChange={(e) => setPosCashGiven(e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none font-mono"
                      />
                      <p className="text-[11px] text-emerald-400 font-mono pt-0.5">
                        Kembalian: Rp {Math.max(0, parseInt(posCashGiven || '0') - selectedPOSTable.totalBill).toLocaleString('id-ID')}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handlePOSCheckoutTable}
                    disabled={selectedPOSTable.totalBill === 0}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Pelunasan Meja ({posPayMethod.toUpperCase()})
                  </button>
                </div>
              ) : (
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-8 text-center text-xs text-slate-500">
                  Pilihlah salah satu Meja di Matriks Floor Plan untuk melihat & melunasi tagihan.
                </div>
              )}
            </div>

            {/* Shift Cash Drawer Reconciliation Panel */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Banknote className="w-4 h-4 text-amber-500" /> Modal Shift Kasir (1010-Cash Drawer)
              </span>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Modal Awal:</span>
                <span className="font-mono text-slate-200">Rp 500.000</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Total Tunai Masuk:</span>
                <span className="font-mono text-emerald-400 font-bold">+Rp 1.450.000</span>
              </div>
              <button 
                onClick={() => alert('Rekonsiliasi Modal Kasir Berhasil Dicetak & Disimpan ke Hfe!')}
                className="mt-1 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-2 rounded-lg border border-slate-700 flex items-center justify-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" /> Rekonsiliasi Kasir & Print Struk
              </button>
            </div>
          </div>
        </main>
      )}

      {/* --- SURFACE 3: KITCHEN DISPLAY WITH OWNER CUSTOM STATION SPLIT --- */}
      {activeSurface === 'kds-screen' && (
        <main className="flex-1 p-3 sm:p-6 max-w-7xl mx-auto w-full flex flex-col gap-4 sm:gap-6">
          
          {/* OWNER CUSTOM STATION FILTER TABS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" /> Kitchen Stations (Split Screen Mode)
              </h2>

              <button
                onClick={() => setShowStationSettingsModal(true)}
                className="bg-slate-800 hover:bg-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 text-slate-300 flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5 text-amber-500" /> Setting Station (Owner)
              </button>
            </div>

            {/* Station Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {stations.map(station => (
                <button
                  key={station.id}
                  onClick={() => setActiveStationId(station.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    activeStationId === station.id
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{station.icon}</span>
                  <span>{station.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* KDS CONTROLS: VIEW SWITCHER & SORTING */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase text-amber-400 font-mono">Station Aktif: {currentStation.name}</span>
              <p className="text-[11px] sm:text-xs text-slate-400">Menampilkan item kategori: <span className="text-white font-semibold">{currentStation.categories.join(', ')}</span></p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs w-full sm:w-auto justify-between sm:justify-end">
              {/* View Switcher */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setKdsViewMode('kanban')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    kdsViewMode === 'kanban' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400'
                  }`}
                >
                  <Kanban className="w-3.5 h-3.5" /> Kanban
                </button>
                <button
                  onClick={() => setKdsViewMode('list')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    kdsViewMode === 'list' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400'
                  }`}
                >
                  <List className="w-3.5 h-3.5" /> List
                </button>
              </div>

              {/* Sorting Selector */}
              <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800">
                <SlidersHorizontal className="w-3 h-3 text-amber-500" />
                <select
                  value={kdsSortBy}
                  onChange={(e) => setKdsSortBy(e.target.value as any)}
                  className="bg-transparent text-amber-400 font-bold focus:outline-none text-xs"
                >
                  <option value="time-desc">Terlama (Priority)</option>
                  <option value="time-asc">Terbaru</option>
                  <option value="category">Kategori</option>
                </select>
              </div>
            </div>
          </div>

          {/* VIEW MODE 1: KANBAN BOARD */}
          {kdsViewMode === 'kanban' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              
              {/* COLUMN 1: INCOMING */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs sm:text-sm font-bold text-amber-400 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" /> 1. Incoming ({placedOrders.length})
                  </h3>
                </div>

                <div className="flex flex-col gap-3">
                  {placedOrders.map(order => (
                    <div key={order.id} className="bg-slate-950 border border-amber-500/40 rounded-xl p-3.5 flex flex-col gap-3 shadow-lg">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                        <div>
                          <span className="font-mono font-black text-xs text-amber-400">{order.id}</span>
                          <h4 className="text-xs font-bold text-white">{order.table} • {order.customerName}</h4>
                        </div>
                        <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          <Clock className="w-3 h-3" /> {order.timeElapsedMinutes}m ago
                        </span>
                      </div>

                      {/* Clickable Menu Items for BOM Recipe Drawer */}
                      <div className="flex flex-col gap-1.5 text-xs">
                        {order.items.map((item, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setSelectedRecipeBOM(item)}
                            className="flex items-center justify-between bg-slate-900/80 p-2 rounded-lg hover:border-amber-500/50 border border-transparent cursor-pointer transition-all"
                          >
                            <div>
                              <p className="font-bold text-slate-200 flex items-center gap-1">
                                {item.quantity}x {item.name} <BookOpen className="w-3 h-3 text-amber-500 ml-1 inline" />
                              </p>
                              {item.temperature && (
                                <p className="text-[10px] text-slate-400">{item.temperature} • Sugar {item.sugarLevel} • {item.milkOption}</p>
                              )}
                            </div>
                            <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                              {item.category}
                            </span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => handleMoveKanbanColumn(order.id, 'processing')}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 shadow"
                      >
                        <ChefHat className="w-4 h-4" /> Proses Pesanan <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* COLUMN 2: IN PROGRESS */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs sm:text-sm font-bold text-indigo-400 flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-indigo-500" /> 2. In Progress ({processingOrders.length})
                  </h3>
                </div>

                <div className="flex flex-col gap-3">
                  {processingOrders.map(order => (
                    <div key={order.id} className="bg-slate-950 border border-indigo-500/40 rounded-xl p-3.5 flex flex-col gap-3 shadow-lg">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                        <div>
                          <span className="font-mono font-black text-xs text-indigo-400">{order.id}</span>
                          <h4 className="text-xs font-bold text-white">{order.table} • {order.customerName}</h4>
                        </div>
                        <span className="text-[10px] text-indigo-400 font-mono flex items-center gap-1 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                          <Flame className="w-3 h-3" /> {order.timeElapsedMinutes}m active
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5 text-xs">
                        {order.items.map((item, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setSelectedRecipeBOM(item)}
                            className="flex items-center justify-between bg-slate-900/80 p-2 rounded-lg hover:border-indigo-500/50 border border-transparent cursor-pointer transition-all"
                          >
                            <div>
                              <p className="font-bold text-slate-200 flex items-center gap-1">
                                {item.quantity}x {item.name} <BookOpen className="w-3 h-3 text-indigo-400 ml-1 inline" />
                              </p>
                              {item.temperature && (
                                <p className="text-[10px] text-slate-400">{item.temperature} • Sugar {item.sugarLevel} • {item.milkOption}</p>
                              )}
                            </div>
                            <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                              {item.category}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMoveKanbanColumn(order.id, 'placed')}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-semibold py-2 px-2.5 rounded-lg"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveKanbanColumn(order.id, 'ready')}
                          className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 shadow"
                        >
                          Selesai Diproses <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COLUMN 3: READY */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 3. Ready ({readyOrders.length})
                  </h3>
                </div>

                <div className="flex flex-col gap-3">
                  {readyOrders.map(order => (
                    <div key={order.id} className="bg-slate-950 border border-emerald-500/40 rounded-xl p-3.5 flex flex-col gap-3 shadow-lg">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                        <div>
                          <span className="font-mono font-black text-xs text-emerald-400">{order.id}</span>
                          <h4 className="text-xs font-bold text-white">{order.table} • {order.customerName}</h4>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Ready
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5 text-xs">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-slate-900/80 p-2 rounded-lg">
                            <span className="font-bold text-slate-200">{item.quantity}x {item.name}</span>
                            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              {item.category}
                            </span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => alert(`Tiket struk thermal order ${order.id} meja ${order.table} dicetak!`)}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 border border-slate-700"
                      >
                        <Printer className="w-3.5 h-3.5" /> Cetak Struk Dapur
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* VIEW MODE 2: LIST VIEW */}
          {kdsViewMode === 'list' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col gap-3 shadow-xl overflow-x-auto">
              <div className="grid grid-cols-6 text-xs font-bold text-slate-400 border-b border-slate-800 pb-2 px-3 min-w-[600px]">
                <span>ID Tiket</span>
                <span>Meja / Customer</span>
                <span>Item Pesanan (Klik BOM)</span>
                <span>Durasi Antre</span>
                <span>Status KDS</span>
                <span className="text-right">Aksi</span>
              </div>

              <div className="flex flex-col gap-2 divide-y divide-slate-800/60 min-w-[600px]">
                {sortedOrders.map(order => (
                  <div key={order.id} className="pt-2 first:pt-0 grid grid-cols-6 items-center text-xs px-3">
                    <span className="font-mono font-bold text-amber-400">{order.id}</span>
                    <div>
                      <p className="font-bold text-white">{order.table}</p>
                      <p className="text-[11px] text-slate-400">{order.customerName}</p>
                    </div>

                    <div className="flex flex-col gap-1">
                      {order.items.map((item, idx) => (
                        <span 
                          key={idx} 
                          onClick={() => setSelectedRecipeBOM(item)}
                          className="font-semibold text-slate-200 hover:text-amber-400 cursor-pointer flex items-center gap-1"
                        >
                          {item.quantity}x {item.name} <BookOpen className="w-3 h-3 text-amber-500 inline" />
                        </span>
                      ))}
                    </div>

                    <span className="font-mono text-slate-300">{order.timeElapsedMinutes} menit</span>

                    <div>
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                        order.status === 'placed' 
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : order.status === 'processing'
                          ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="text-right">
                      {order.status === 'placed' && (
                        <button
                          onClick={() => handleMoveKanbanColumn(order.id, 'processing')}
                          className="bg-amber-500 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs"
                        >
                          Proses ➔
                        </button>
                      )}
                      {order.status === 'processing' && (
                        <button
                          onClick={() => handleMoveKanbanColumn(order.id, 'ready')}
                          className="bg-emerald-500 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs"
                        >
                          Selesai ➔
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button
                          onClick={() => alert(`Struk ${order.id} dicetak!`)}
                          className="bg-slate-800 text-slate-200 font-bold px-3 py-1 rounded-lg text-xs border border-slate-700"
                        >
                          Print Struk
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      )}

      {/* --- OWNER CUSTOM STATION SETTINGS MODAL --- */}
      {showStationSettingsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-5 sm:p-6 flex flex-col gap-4 shadow-2xl relative">
            <button
              onClick={() => setShowStationSettingsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Settings className="w-5 h-5 text-amber-500" /> Owner Policy: Custom Split Station KDS
            </h3>

            <p className="text-xs text-slate-400">Atur pemisahan layar display untuk stasiun Barista, Dapur Utm, dan Pastry:</p>

            <div className="flex flex-col gap-3">
              {stations.map(st => (
                <div key={st.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{st.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{st.name}</h4>
                      <p className="text-[10px] text-amber-400 font-mono">{st.categories.join(', ')}</p>
                    </div>
                  </div>

                  {st.id !== 'all' && (
                    <button 
                      onClick={() => alert(`Pengaturan station ${st.name} diperbarui!`)}
                      className="text-[11px] text-amber-400 font-bold px-2 py-1 bg-amber-500/10 rounded border border-amber-500/20"
                    >
                      Edit Kategori
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowStationSettingsModal(false)}
              className="w-full bg-amber-500 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-lg mt-2"
            >
              Simpan Pengaturan Station Owner
            </button>
          </div>
        </div>
      )}

      {/* --- RECIPE BOM & PREPARATION SOP DRAWER POPUP --- */}
      {selectedRecipeBOM && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 flex flex-col gap-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedRecipeBOM(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3 pr-8">
              <img 
                src={selectedRecipeBOM.image} 
                alt={selectedRecipeBOM.name} 
                className="w-14 h-14 rounded-xl object-cover border border-slate-700"
              />
              <div>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {selectedRecipeBOM.category}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">{selectedRecipeBOM.name}</h3>
                <p className="text-[11px] text-slate-400">{selectedRecipeBOM.description}</p>
              </div>
            </div>

            {/* Bill of Materials (BOM Ingredients) */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-500" /> Bill of Materials (BOM / Resep Bahan Baku)
              </h4>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-1.5">
                {selectedRecipeBOM.bomIngredients?.map((ing, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-slate-300">
                    <span>• {ing.name}</span>
                    <span className="font-mono font-bold text-amber-400">{ing.amount}</span>
                  </div>
                )) || <p className="text-xs text-slate-500">Resep standar pabrikasi.</p>}
              </div>
            </div>

            {/* Preparation SOP Steps */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                <ChefHat className="w-4 h-4 text-indigo-500" /> Petunjuk SOP Pembuatan / Barista Guide
              </h4>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
                {selectedRecipeBOM.preparationSteps?.map((step, idx) => (
                  <p key={idx} className="text-xs text-slate-300 leading-relaxed">
                    {step}
                  </p>
                )) || <p className="text-xs text-slate-500">Gunakan petunjuk standar penyajian kafe.</p>}
              </div>
            </div>

            <button
              onClick={() => setSelectedRecipeBOM(null)}
              className="w-full bg-amber-500 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-lg mt-1"
            >
              Tutup Petunjuk Resep
            </button>
          </div>
        </div>
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
