import React, { useState, useRef, useEffect } from 'react'
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
  Filter,
  BellRing,
  CheckSquare,
  BadgeCheck,
  Footprints,
  AlertTriangle,
  Zap,
  Armchair,
  RotateCcw,
  HeartHandshake,
  ShoppingCart,
  Sliders,
  Building2,
  Store,
  Compass,
  UserCheck,
  LogOut,
  FolderTree,
  Database,
  ExternalLink,
  Monitor
} from 'lucide-react'

// --- TYPES ---
type PrimaryDomainApp = 'customer' | 'cafe'
type StaffSurfaceMode = 'barista-pos' | 'kds-screen' | 'checker-qc' | 'server-waiter' | 'cafe-config'
type CustomerLoginType = 'phone' | 'guest-name'
type PaymentPolicy = 'pay-first' | 'open-tab'
type PB1TaxMode = 0 | 1 | 2 // 0=Disabled, 1=Exclude (Show on bill), 2=Include (Embedded in price)

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
  hfeCategoryCode: string // Official HFE Core Books Category Code (e.g. CAT-COFFEE-01)
  hfeGlAccount: string   // Official HFE Subledger Revenue Account (e.g. 4010-Beverage)
  price: number
  image: string
  description: string
  hasModifiers?: boolean
  bomIngredients?: { name: string; amount: string }[]
  preparationSteps?: string[]
}

interface CartItem extends MenuItem {
  quantity: number
  seatNumber?: string
  allergenNotes?: string
  temperature?: 'Hot' | 'Iced'
  sugarLevel?: '0%' | '50%' | '100%'
  milkOption?: 'Whole Milk' | 'Oat Milk (+Rp 5.000)' | 'Almond Milk (+Rp 5.000)'
  served?: boolean
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
  taxPB1Amount: number
  serviceFeeAmount: number
  tipAmount: number
  status: 'placed' | 'processing' | 'ready' | 'qc-passed' | 'served'
  timeElapsedMinutes: number
  createdAt: string
  waiterCall?: string
}

// --- MOCK PRODUCT MASTER DATA WITH OFFICIAL HFE BACKEND CATEGORY CODES ---
const PRODUCT_CATALOG: MenuItem[] = [
  { 
    id: 'PRD-01', 
    name: 'Espresso Aren Latte', 
    category: 'Coffee', 
    hfeCategoryCode: 'CAT-COFFEE-01',
    hfeGlAccount: '4010-Beverage Sales',
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
    hfeCategoryCode: 'CAT-COFFEE-01',
    hfeGlAccount: '4010-Beverage Sales',
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
    hfeCategoryCode: 'CAT-COFFEE-01',
    hfeGlAccount: '4010-Beverage Sales',
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
    hfeCategoryCode: 'CAT-NONCOFFEE-02',
    hfeGlAccount: '4010-Beverage Sales',
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
    hfeCategoryCode: 'CAT-PASTRY-03',
    hfeGlAccount: '4020-Food Sales',
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
    hfeCategoryCode: 'CAT-SNACK-04',
    hfeGlAccount: '4020-Food Sales',
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
  // --- SEPARATE DOMAIN / URL ROUTING ARCHITECTURE ---
  const [activeApp, setActiveApp] = useState<PrimaryDomainApp>(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('app') === 'cafe' || window.location.pathname.startsWith('/cafe')) {
      return 'cafe'
    }
    return 'customer' // default customer web app URL
  })

  const [activeStaffSurface, setActiveStaffSurface] = useState<StaffSurfaceMode>('barista-pos')
  
  // Dedicated Step 2 Checkout Screen View State for Mobile QR
  const [qrStepView, setQrStepView] = useState<'catalog' | 'checkout'>('catalog')

  // PERSISTENT 1-TIME CUSTOMER LOGIN STATE (TERSIMPAN)
  const [isCustomerSessionActive, setIsCustomerSessionActive] = useState<boolean>(true)
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false)

  // Section Refs for Smooth Category Scrolling
  const coffeeSecRef = useRef<HTMLDivElement>(null)
  const nonCoffeeSecRef = useRef<HTMLDivElement>(null)
  const pastrySecRef = useRef<HTMLDivElement>(null)
  const snackSecRef = useRef<HTMLDivElement>(null)

  // --- OWNER DYNAMIC TAX (PB1 10%), SERVICE FEE % & TIPS ENGINE STATE ---
  const [taxPB1Mode, setTaxPB1Mode] = useState<PB1TaxMode>(1) // 0=Off, 1=Exclude (Show), 2=Include (Embedded)
  const [serviceFeeRate, setServiceFeeRate] = useState<number>(5) // 5% Service Charge
  const [selectedTipAmount, setSelectedTipAmount] = useState<number>(5000) // Default Rp 5.000 Tip
  const [cashDrawerFloat, setCashDrawerFloat] = useState<number>(500000)

  // --- KDS VIEW, SORTING & CUSTOM STATIONS STATE ---
  const [kdsViewMode, setKdsViewMode] = useState<'kanban' | 'list'>('kanban')
  const [kdsSortBy, setKdsSortBy] = useState<'time-desc' | 'time-asc' | 'category'>('time-desc')
  const [selectedRecipeBOM, setSelectedRecipeBOM] = useState<MenuItem | null>(null)
  
  // Owner Custom Station Split State
  const [activeStationId, setActiveStationId] = useState<string>('all')
  const [stations] = useState<StationConfig[]>([
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

  // Cart & Policy State (with Chef Mike's Seat Tagging & Allergen Notes)
  const [cart, setCart] = useState<CartItem[]>([
    { ...PRODUCT_CATALOG[0], quantity: 2, seatNumber: 'Seat 1', allergenNotes: 'Alergi Lactose (Ganti Oatside)', temperature: 'Iced', sugarLevel: '50%', milkOption: 'Oat Milk (+Rp 5.000)' },
    { ...PRODUCT_CATALOG[4], quantity: 1, seatNumber: 'Seat 2' }
  ])
  const [paymentPolicy, setPaymentPolicy] = useState<PaymentPolicy>('pay-first')
  const [showModifierModal, setShowModifierModal] = useState<MenuItem | null>(null)
  const [modTemp, setModTemp] = useState<'Hot' | 'Iced'>('Iced')
  const [modSugar, setModSugar] = useState<'0%' | '50%' | '100%'>('50%')
  const [modMilk, setModMilk] = useState<'Whole Milk' | 'Oat Milk (+Rp 5.000)' | 'Almond Milk (+Rp 5.000)'>('Oat Milk (+Rp 5.000)')
  const [modSeat, setModSeat] = useState<string>('Seat 1')
  const [modAllergen, setModAllergen] = useState<string>('')
  const [showQRISModal, setShowQRISModal] = useState<boolean>(false)

  // --- KITCHEN KANBAN & EXPEDITOR ORDERS STATE ---
  const [orders, setOrders] = useState<OrderTicket[]>([
    {
      id: 'ORD-8821',
      table: 'MEJA-04',
      customerName: 'Aldi',
      phone: '081298765432',
      items: [
        { ...PRODUCT_CATALOG[0], quantity: 2, seatNumber: 'Seat 1', allergenNotes: 'Alergi Lactose (Ganti Oatside)', temperature: 'Iced', sugarLevel: '50%', milkOption: 'Oat Milk (+Rp 5.000)' },
        { ...PRODUCT_CATALOG[4], quantity: 1, seatNumber: 'Seat 2' }
      ],
      policy: 'pay-first',
      total: 86000,
      taxPB1Amount: 8600,
      serviceFeeAmount: 4300,
      tipAmount: 5000,
      status: 'placed',
      timeElapsedMinutes: 12,
      createdAt: '19:24',
      waiterCall: 'Minta Tambah Sedotan & Sendok Garpu'
    },
    {
      id: 'ORD-8820',
      table: 'MEJA-12',
      customerName: 'Budi Santoso',
      phone: '081311223344',
      items: [
        { ...PRODUCT_CATALOG[1], quantity: 1, seatNumber: 'Seat 1', temperature: 'Hot', sugarLevel: '100%' },
        { ...PRODUCT_CATALOG[5], quantity: 1, seatNumber: 'Seat 3', allergenNotes: 'No Truffle Oil (Garam Saja)' }
      ],
      policy: 'open-tab',
      total: 70000,
      taxPB1Amount: 7000,
      serviceFeeAmount: 3500,
      tipAmount: 0,
      status: 'processing',
      timeElapsedMinutes: 4,
      createdAt: '19:18'
    },
    {
      id: 'ORD-8819',
      table: 'MEJA-08',
      customerName: 'Siti Rahma',
      phone: '081599887766',
      items: [
        { ...PRODUCT_CATALOG[2], quantity: 2, seatNumber: 'Seat 2', temperature: 'Iced', sugarLevel: '0%' }
      ],
      policy: 'pay-first',
      total: 70000,
      taxPB1Amount: 7000,
      serviceFeeAmount: 3500,
      tipAmount: 5000,
      status: 'qc-passed',
      timeElapsedMinutes: 6,
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
  const [posPayMethod, setPosPayMethod] = useState<'cash' | 'qris' | 'card'>('cash')
  const [posCashGiven, setPosCashGiven] = useState<string>('100000')

  // --- DYNAMIC URL SWITCHER EFFECT ---
  const switchDomainApp = (targetApp: PrimaryDomainApp) => {
    setActiveApp(targetApp)
    const newUrl = targetApp === 'cafe' ? '?app=cafe' : '?app=customer'
    window.history.pushState({}, '', newUrl)
  }

  // --- DYNAMIC TAX, SERVICE FEE & TIP CALCULATION ---
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

  // Service Fee
  const calculatedServiceFee = Math.round(discountedSubtotal * (serviceFeeRate / 100))

  // Resto Tax PB1 10% Modes
  let calculatedPB1Tax = 0
  if (taxPB1Mode === 1) {
    calculatedPB1Tax = Math.round(discountedSubtotal * 0.10)
  } else if (taxPB1Mode === 2) {
    calculatedPB1Tax = Math.round(discountedSubtotal - (discountedSubtotal / 1.10))
  }

  // Final Grand Total
  const grandTotalBill = taxPB1Mode === 1
    ? discountedSubtotal + calculatedServiceFee + calculatedPB1Tax + selectedTipAmount
    : discountedSubtotal + calculatedServiceFee + selectedTipAmount

  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0)

  // --- SMOOTH SCROLL CATEGORY JUMP HANDLER ---
  const scrollToCategorySection = (category: string) => {
    let targetRef: React.RefObject<HTMLDivElement> | null = null
    if (category === 'Coffee') targetRef = coffeeSecRef
    else if (category === 'Non-Coffee') targetRef = nonCoffeeSecRef
    else if (category === 'Pastry') targetRef = pastrySecRef
    else if (category === 'Snack') targetRef = snackSecRef

    targetRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // --- HANDLERS ---
  const handleSaveInitialLogin = () => {
    setIsCustomerSessionActive(true)
    setShowLoginModal(false)
    alert(`Profil berhasil tersimpan! Selamat datang kembali, ${loginType === 'phone' ? 'Customer ' + customerPhone : guestName}.`)
  }

  const handleAddToCart = (item: MenuItem) => {
    if (item.hasModifiers) {
      setShowModifierModal(item)
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

  const handleConfirmModifier = () => {
    if (!showModifierModal) return
    setCart(prev => [
      ...prev,
      {
        ...showModifierModal,
        quantity: 1,
        seatNumber: modSeat,
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

  const handleReorderSameItem = (item: MenuItem) => {
    handleAddToCart(item)
    alert(`1x ${item.name} berhasil ditambahkan kembali ke keranjang pesanan meja!`)
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
        total: grandTotalBill,
        taxPB1Amount: calculatedPB1Tax,
        serviceFeeAmount: calculatedServiceFee,
        tipAmount: selectedTipAmount,
        status: 'placed',
        timeElapsedMinutes: 1,
        createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
      setOrders(prev => [newOrder, ...prev])
      setCart([])
      setQrStepView('catalog')
      alert(`Pesanan Open Tab meja ${selectedTable} terkirim ke KDS Dapur! Terkoneksi dengan Hfe Ledger.`)
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
      total: grandTotalBill,
      taxPB1Amount: calculatedPB1Tax,
      serviceFeeAmount: calculatedServiceFee,
      tipAmount: selectedTipAmount,
      status: 'processing',
      timeElapsedMinutes: 1,
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
    setOrders(prev => [newOrder, ...prev])
    setCart([])
    setQrStepView('catalog')
    setLoyaltyPoints(prev => prev + Math.floor(grandTotalBill / 10000))
    alert(`Pembayaran QRIS Sukses! Pesanan meja ${selectedTable} masuk KDS Dapur & Terposting ke Hfe Engine.`)
  }

  const handlePOSCheckoutTable = () => {
    if (!selectedPOSTable || selectedPOSTable.totalBill === 0) return
    setTablesGrid(prev => prev.map(t => t.id === selectedPOSTable.id ? { ...t, status: 'free', totalBill: 0, customerName: undefined } : t))
    alert(`Pembayaran Meja ${selectedPOSTable.name} (${selectedPOSTable.customerName}) LUNAS via ${posPayMethod.toUpperCase()}! Struk Penjualan Terkirim ke Hfe REST API.`)
    setSelectedPOSTable(null)
  }

  const handleMoveStatus = (orderId: string, targetStatus: OrderTicket['status']) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: targetStatus }
      }
      return o
    }))
  }

  const handleDismissWaiterCall = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, waiterCall: undefined } : o))
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
  const readyOrders = sortedOrders.filter(o => o.status === 'ready' || o.status === 'qc-passed')

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans relative">
      
      {/* --- TOP GLOBAL DOMAIN NAVIGATOR BAR (SEPARATED WEBSITES) --- */}
      <div className="bg-slate-950 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400">DOMAIN APP:</span>
          <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
            activeApp === 'customer' 
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
              : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
          }`}>
            {activeApp === 'customer' ? '📱 ORDER.CAFE.COM (?app=customer)' : '🏪 POS.CAFE.COM (?app=cafe)'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => switchDomainApp('customer')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all ${
              activeApp === 'customer' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Web Pelanggan (QR)
          </button>
          
          <button
            onClick={() => switchDomainApp('cafe')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all ${
              activeApp === 'cafe' ? 'bg-indigo-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Store className="w-3.5 h-3.5" /> Web Staf Kafe (POS/KDS/Owner)
          </button>
        </div>
      </div>

      {/* --- APPLICATION ROUTE 1: CUSTOMER MOBILE QR WEB APP --- */}
      {activeApp === 'customer' && (
        <div className="flex-1 flex flex-col">
          {/* Customer App Top Banner */}
          <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-sm text-white tracking-tight flex items-center gap-1.5">
                  Mobile Order <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">QR Menu</span>
                </h1>
                <p className="text-[10px] text-slate-400">Pesan langsung dari meja tanpa perlu mengantre</p>
              </div>
            </div>

            <button
              onClick={() => switchDomainApp('cafe')}
              className="text-[11px] font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800"
            >
              <span>⚙️ Ke Web Staf Kafe</span> <ExternalLink className="w-3 h-3 text-slate-500" />
            </button>
          </header>

          <main className="flex-1 max-w-md w-full mx-auto p-3 sm:p-4 flex flex-col gap-4 pb-28">
            {/* STEP 1: KATALOG MENU VIEW */}
            {qrStepView === 'catalog' && (
              <>
                {/* Table & Persistent Saved User Session Banner */}
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

                  <div className="flex items-center gap-2">
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
                </div>

                {/* PERSISTENT SAVED GUEST SESSION BADGE */}
                {isCustomerSessionActive ? (
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-xs font-bold text-white">
                            {loginType === 'phone' ? `HP: ${customerPhone}` : `Tamu: ${guestName}`}
                          </h3>
                          {loginType === 'phone' && (
                            <span className="text-[9px] font-bold bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/30">
                              {userTier.icon} {loyaltyPoints} Poin
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400">Sesi Login Tersimpan • Siap Pesan Menu</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="text-[10px] font-bold text-amber-400 hover:text-amber-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800"
                    >
                      Ubah
                    </button>
                  </div>
                ) : (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between">
                    <span className="text-xs text-amber-400 font-semibold">Belum masuk?</span>
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="bg-amber-500 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-xl shadow"
                    >
                      Masuk Sekali
                    </button>
                  </div>
                )}

                {/* STICKY CATEGORY JUMP NAVIGATOR BAR WITH HFE CATEGORY CODES */}
                <div className="sticky top-[60px] z-30 bg-slate-900/95 backdrop-blur-md border border-slate-800/90 p-2 rounded-2xl flex items-center gap-1.5 overflow-x-auto shadow-xl">
                  {[
                    { id: 'Coffee', icon: '☕', name: 'Coffee', hfeCode: 'CAT-COFFEE-01' },
                    { id: 'Non-Coffee', icon: '🍵', name: 'Non-Coffee', hfeCode: 'CAT-NONCOFFEE-02' },
                    { id: 'Pastry', icon: '🥐', name: 'Pastry', hfeCode: 'CAT-PASTRY-03' },
                    { id: 'Snack', icon: '🍟', name: 'Snack', hfeCode: 'CAT-SNACK-04' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => scrollToCategorySection(cat.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap bg-slate-950 text-slate-300 hover:bg-amber-500 hover:text-slate-950 border border-slate-800 transition-all shadow-sm"
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>

                {/* CONTINUOUS SMOOTH SCROLL CATALOG SECTIONS */}
                <div className="flex flex-col gap-6 pt-1">
                  
                  {/* SECTION 1: COFFEE SHOWCASE */}
                  <div ref={coffeeSecRef} className="flex flex-col gap-3 scroll-mt-24">
                    <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border-l-4 border-amber-500 px-3.5 py-2 rounded-r-xl flex items-center justify-between">
                      <div>
                        <h3 className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                          <Coffee className="w-4 h-4 text-amber-500" /> ☕ ETALASE KOPI SPECIALTY & ESPRESSO
                        </h3>
                        <span className="text-[9px] font-mono text-amber-400/70 font-semibold">HFE Core Category: CAT-COFFEE-01 • GL 4010-Beverage</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-amber-400/80">3 Items</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {PRODUCT_CATALOG.filter(p => p.category === 'Coffee').map(item => (
                        <div key={item.id} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 flex gap-3 hover:border-slate-700 transition-all">
                          <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover border border-slate-800" />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                                  {item.hfeCategoryCode}
                                </span>
                                <span className="text-xs font-bold text-emerald-400">Rp {item.price.toLocaleString('id-ID')}</span>
                              </div>
                              <h4 className="font-bold text-sm text-slate-100 mt-1">{item.name}</h4>
                              <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-2">
                              <button onClick={() => handleReorderSameItem(item)} className="bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-slate-700">
                                <RotateCcw className="w-3 h-3 text-amber-500" /> Re-Order
                              </button>
                              <button onClick={() => handleAddToCart(item)} className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md">
                                <Plus className="w-3.5 h-3.5" /> Tambah
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 2: NON-COFFEE SHOWCASE */}
                  <div ref={nonCoffeeSecRef} className="flex flex-col gap-3 scroll-mt-24">
                    <div className="bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent border-l-4 border-emerald-500 px-3.5 py-2 rounded-r-xl flex items-center justify-between">
                      <div>
                        <h3 className="text-xs sm:text-sm font-black text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-500" /> 🍵 ETALASE NON-COFFEE & ARTISAN MATCHA
                        </h3>
                        <span className="text-[9px] font-mono text-emerald-400/70 font-semibold">HFE Core Category: CAT-NONCOFFEE-02 • GL 4010-Beverage</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400/80">1 Item</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {PRODUCT_CATALOG.filter(p => p.category === 'Non-Coffee').map(item => (
                        <div key={item.id} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 flex gap-3 hover:border-slate-700 transition-all">
                          <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover border border-slate-800" />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                  {item.hfeCategoryCode}
                                </span>
                                <span className="text-xs font-bold text-emerald-400">Rp {item.price.toLocaleString('id-ID')}</span>
                              </div>
                              <h4 className="font-bold text-sm text-slate-100 mt-1">{item.name}</h4>
                              <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-2">
                              <button onClick={() => handleReorderSameItem(item)} className="bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-slate-700">
                                <RotateCcw className="w-3 h-3 text-amber-500" /> Re-Order
                              </button>
                              <button onClick={() => handleAddToCart(item)} className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md">
                                <Plus className="w-3.5 h-3.5" /> Tambah
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 3: PASTRY & BAKERY SHOWCASE */}
                  <div ref={pastrySecRef} className="flex flex-col gap-3 scroll-mt-24">
                    <div className="bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-transparent border-l-4 border-orange-500 px-3.5 py-2 rounded-r-xl flex items-center justify-between">
                      <div>
                        <h3 className="text-xs sm:text-sm font-black text-orange-300 uppercase tracking-wider flex items-center gap-2">
                          <UtensilsCrossed className="w-4 h-4 text-orange-500" /> 🥐 ETALASE PASTRY & WARM BAKERY
                        </h3>
                        <span className="text-[9px] font-mono text-orange-400/70 font-semibold">HFE Core Category: CAT-PASTRY-03 • GL 4020-Food</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-orange-400/80">1 Item</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {PRODUCT_CATALOG.filter(p => p.category === 'Pastry').map(item => (
                        <div key={item.id} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 flex gap-3 hover:border-slate-700 transition-all">
                          <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover border border-slate-800" />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono font-bold text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">
                                  {item.hfeCategoryCode}
                                </span>
                                <span className="text-xs font-bold text-emerald-400">Rp {item.price.toLocaleString('id-ID')}</span>
                              </div>
                              <h4 className="font-bold text-sm text-slate-100 mt-1">{item.name}</h4>
                              <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-2">
                              <button onClick={() => handleReorderSameItem(item)} className="bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-slate-700">
                                <RotateCcw className="w-3 h-3 text-amber-500" /> Re-Order
                              </button>
                              <button onClick={() => handleAddToCart(item)} className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md">
                                <Plus className="w-3.5 h-3.5" /> Tambah
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 4: SNACK & FINGER FOODS SHOWCASE */}
                  <div ref={snackSecRef} className="flex flex-col gap-3 scroll-mt-24">
                    <div className="bg-gradient-to-r from-indigo-500/20 via-indigo-500/10 to-transparent border-l-4 border-indigo-500 px-3.5 py-2 rounded-r-xl flex items-center justify-between">
                      <div>
                        <h3 className="text-xs sm:text-sm font-black text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                          <Flame className="w-4 h-4 text-indigo-500" /> 🍟 ETALASE SNACK & SAVORY FINGER FOODS
                        </h3>
                        <span className="text-[9px] font-mono text-indigo-400/70 font-semibold">HFE Core Category: CAT-SNACK-04 • GL 4020-Food</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-indigo-400/80">1 Item</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {PRODUCT_CATALOG.filter(p => p.category === 'Snack').map(item => (
                        <div key={item.id} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 flex gap-3 hover:border-slate-700 transition-all">
                          <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover border border-slate-800" />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                                  {item.hfeCategoryCode}
                                </span>
                                <span className="text-xs font-bold text-emerald-400">Rp {item.price.toLocaleString('id-ID')}</span>
                              </div>
                              <h4 className="font-bold text-sm text-slate-100 mt-1">{item.name}</h4>
                              <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-2">
                              <button onClick={() => handleReorderSameItem(item)} className="bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-slate-700">
                                <RotateCcw className="w-3 h-3 text-amber-500" /> Re-Order
                              </button>
                              <button onClick={() => handleAddToCart(item)} className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md">
                                <Plus className="w-3.5 h-3.5" /> Tambah
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* STICKY FLOATING BOTTOM CART BAR -> NAVIGATE TO DEDICATED CHECKOUT VIEW */}
                {cart.length > 0 && (
                  <div 
                    onClick={() => setQrStepView('checkout')}
                    className="fixed bottom-4 inset-x-3 max-w-md mx-auto z-40 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl p-3.5 shadow-2xl flex items-center justify-between font-bold cursor-pointer border border-amber-300 transition-all transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-mono font-black text-xs relative">
                        <ShoppingCart className="w-4 h-4" />
                        <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                          {totalCartCount}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-900 tracking-wider">Keranjang Meja ({totalCartCount} Items)</span>
                        <h4 className="text-sm font-black font-mono">Rp {grandTotalBill.toLocaleString('id-ID')}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-black bg-slate-950 text-amber-400 px-3 py-1.5 rounded-xl">
                      <span>Lanjut ke Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* STEP 2: DEDICATED CHECKOUT SCREEN VIEW */}
            {qrStepView === 'checkout' && (
              <div className="flex flex-col gap-4">
                {/* Back to Catalog Header Button */}
                <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-2xl">
                  <button
                    onClick={() => setQrStepView('catalog')}
                    className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800"
                  >
                    <ArrowLeft className="w-4 h-4" /> Kembali Tambah Menu
                  </button>
                  <span className="text-xs font-bold text-slate-300 font-mono">{selectedTable}</span>
                </div>

                {/* Dedicated Checkout Container */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4 shadow-2xl">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
                    <ShoppingBag className="w-5 h-5 text-amber-500" /> Ringkasan Pesanan & Pelunasan Meja
                  </h3>

                  {/* Items Breakdown */}
                  <div className="flex flex-col gap-2.5 divide-y divide-slate-800/80">
                    {cart.map((item, idx) => (
                      <div key={idx} className="pt-2.5 first:pt-0 flex flex-col gap-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-white flex items-center gap-1.5 text-sm">
                              {item.name} 
                              {item.seatNumber && (
                                <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/30">
                                  {item.seatNumber}
                                </span>
                              )}
                            </p>
                            <span className="text-[9px] font-mono text-amber-400">
                              {item.hfeCategoryCode} • GL: {item.hfeGlAccount}
                            </span>
                            {item.temperature && (
                              <p className="text-[11px] text-slate-400">
                                {item.temperature} • Sugar {item.sugarLevel} • {item.milkOption}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleUpdateQty(idx, -1)}
                              className="w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-700"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-bold font-mono text-slate-100 w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => handleUpdateQty(idx, 1)}
                              className="w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-700"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Allergen Badge */}
                        {item.allergenNotes && (
                          <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-1 bg-rose-500/10 px-2.5 py-0.5 rounded border border-rose-500/20 w-fit">
                            <AlertTriangle className="w-3 h-3 text-rose-500" /> Catatan Alergen: {item.allergenNotes}
                          </span>
                        )}
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
                      className="flex-1 bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 focus:outline-none uppercase font-mono"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="bg-slate-800 hover:bg-slate-700 text-xs font-semibold px-4 py-2 rounded-xl text-slate-200"
                    >
                      Gunakan
                    </button>
                  </div>

                  {/* OPTIONAL CUSTOMER TIPS SELECTION */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
                    <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                      <HeartHandshake className="w-3.5 h-3.5 text-amber-500" /> Ucapkan Terima Kasih ke Staf / Barista (Tips Opsional):
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { label: 'Tanpa Tip', val: 0 },
                        { label: 'Rp 2.000', val: 2000 },
                        { label: 'Rp 5.000', val: 5000 },
                        { label: 'Rp 10.000', val: 10000 }
                      ].map(tip => (
                        <button
                          key={tip.label}
                          onClick={() => setSelectedTipAmount(tip.val)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            selectedTipAmount === tip.val
                              ? 'bg-amber-500 text-slate-950 border-amber-500'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          {tip.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Policy Selector */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 mt-1">
                    <span className="text-[11px] font-semibold text-slate-300">Kebijakan Pembayaran Kafe:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setPaymentPolicy('pay-first')}
                        className={`p-2.5 rounded-xl text-xs font-bold border text-left flex flex-col gap-0.5 transition-all ${
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
                        className={`p-2.5 rounded-xl text-xs font-bold border text-left flex flex-col gap-0.5 transition-all ${
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

                  {/* Dynamic Tax PB1, Service Fee & Grand Total Calculation */}
                  <div className="pt-3 border-t border-slate-800 flex flex-col gap-1.5 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal Pesanan:</span>
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

                    {/* Service Fee Line */}
                    {serviceFeeRate > 0 && (
                      <div className="flex justify-between text-slate-400">
                        <span>Service Fee ({serviceFeeRate}%):</span>
                        <span>+Rp {calculatedServiceFee.toLocaleString('id-ID')}</span>
                      </div>
                    )}

                    {/* PB1 Resto Tax Modes Display */}
                    {taxPB1Mode === 1 && (
                      <div className="flex justify-between text-amber-400 font-medium">
                        <span>Pajak Restoran PB1 (10% Exclude):</span>
                        <span>+Rp {calculatedPB1Tax.toLocaleString('id-ID')}</span>
                      </div>
                    )}

                    {taxPB1Mode === 2 && (
                      <div className="flex justify-between text-slate-400 italic text-[11px]">
                        <span>Pajak PB1 (10% Include Dibelakang):</span>
                        <span>[Terhitung Rp {calculatedPB1Tax.toLocaleString('id-ID')}]</span>
                      </div>
                    )}

                    {/* Tips Line */}
                    {selectedTipAmount > 0 && (
                      <div className="flex justify-between text-amber-400 font-bold">
                        <span>Tips Staf & Barista:</span>
                        <span>+Rp {selectedTipAmount.toLocaleString('id-ID')}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                      <span>Total Tagihan Akhir:</span>
                      <span className="text-amber-400 font-mono text-lg">Rp {grandTotalBill.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {/* Submit Order Button */}
                  <button
                    onClick={handleSubmitOrder}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 mt-2"
                  >
                    {paymentPolicy === 'pay-first' ? (
                      <> <CreditCard className="w-5 h-5" /> Bayar QRIS Sekarang (Rp {grandTotalBill.toLocaleString('id-ID')}) </>
                    ) : (
                      <> <CheckCircle2 className="w-5 h-5" /> Konfirmasi Open Tab Meja </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* --- APPLICATION ROUTE 2: CAFE STAFF & MANAGEMENT PORTAL --- */}
      {activeApp === 'cafe' && (
        <div className="flex-1 flex flex-col">
          {/* Staff App Top Bar Switcher */}
          <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-40 px-3 sm:px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
                  <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h1 className="font-bold text-sm sm:text-base tracking-tight flex items-center gap-1.5">
                    Hfe Cafe <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-mono">Staff Suite</span>
                  </h1>
                  <p className="text-[10px] sm:text-xs text-slate-400">Portal Kasir, Dapur, Waiter & Konfigurasi Kafe</p>
                </div>
              </div>

              <button
                onClick={() => switchDomainApp('customer')}
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800"
              >
                <span>📱 Web Pelanggan (QR)</span> <ExternalLink className="w-3 h-3 text-amber-500" />
              </button>
            </div>

            {/* 5 Staff Surface Buttons */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto gap-1">
              <button
                onClick={() => setActiveStaffSurface('barista-pos')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeStaffSurface === 'barista-pos' ? 'bg-indigo-500 text-white shadow-md font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" /> 1. Touch POS Kasir
              </button>

              <button
                onClick={() => setActiveStaffSurface('kds-screen')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeStaffSurface === 'kds-screen' ? 'bg-indigo-500 text-white shadow-md font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" /> 2. Kitchen KDS
              </button>

              <button
                onClick={() => setActiveStaffSurface('checker-qc')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeStaffSurface === 'checker-qc' ? 'bg-indigo-500 text-white shadow-md font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BadgeCheck className="w-3.5 h-3.5" /> 3. Mode Checker (QC)
              </button>

              <button
                onClick={() => setActiveStaffSurface('server-waiter')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeStaffSurface === 'server-waiter' ? 'bg-indigo-500 text-white shadow-md font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Footprints className="w-3.5 h-3.5" /> 4. Mode Server (Waiter)
              </button>

              <button
                onClick={() => setActiveStaffSurface('cafe-config')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeStaffSurface === 'cafe-config' ? 'bg-indigo-500 text-white shadow-md font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Store className="w-3.5 h-3.5" /> 5. Konfigurasi Cafe (Owner)
              </button>
            </div>
          </header>

          {/* STAFF SURFACE 1: BARISTA & CASHIER TOUCH POS */}
          {activeStaffSurface === 'barista-pos' && (
            <main className="flex-1 p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto w-full">
              <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" /> Matriks Floor Plan Meja Kafe
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
                      className={`border rounded-2xl p-3 sm:p-4 flex flex-col justify-between h-28 sm:h-32 transition-all cursor-pointer relative overflow-hidden ${
                        selectedPOSTable?.id === table.id
                          ? 'ring-2 ring-indigo-500 bg-indigo-500/20 border-indigo-500'
                          : table.status === 'occupied' 
                          ? 'bg-amber-500/10 border-amber-500/50'
                          : table.status === 'open-tab'
                          ? 'bg-indigo-500/10 border-indigo-500/50'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                        table.status === 'occupied' ? 'bg-amber-500' : table.status === 'open-tab' ? 'bg-indigo-500' : 'bg-emerald-500'
                      }`} />

                      <div className="flex items-center justify-between pl-1">
                        <span className="font-mono font-bold text-xs sm:text-sm text-slate-200">{table.name}</span>
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          table.status === 'occupied' ? 'bg-amber-500' : table.status === 'open-tab' ? 'bg-indigo-500' : 'bg-emerald-500'
                        }`} />
                      </div>

                      <div className="pl-1">
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
                    <Coffee className="w-4 h-4 text-indigo-400" /> Katalog Kasir Touchscreen (Pesanan Walk-In / Takeaway)
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
                    <Receipt className="w-4 h-4 text-indigo-400" /> Stasiun Kasir & Pelunasan Meja
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

                      <div className="flex flex-col gap-1.5 pt-2">
                        <label className="text-[11px] text-slate-400">Metode Pembayaran Kasir:</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['cash', 'qris', 'card'] as const).map(method => (
                            <button
                              key={method}
                              onClick={() => setPosPayMethod(method)}
                              className={`py-2 rounded-lg text-xs font-bold border uppercase transition-all ${
                                posPayMethod === method
                                  ? 'bg-indigo-500 text-white border-indigo-500'
                                  : 'bg-slate-900 border-slate-800 text-slate-400'
                              }`}
                            >
                              {method}
                            </button>
                          ))}
                        </div>
                      </div>

                      {posPayMethod === 'cash' && (
                        <div className="flex flex-col gap-2 pt-1">
                          <label className="text-[11px] text-slate-400">Uang Tunai Diterima:</label>
                          <input
                            type="text"
                            value={posCashGiven}
                            onChange={(e) => setPosCashGiven(e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none font-mono"
                          />

                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-semibold text-amber-400 flex items-center gap-1">
                              <Zap className="w-3 h-3 text-amber-500" /> Quick Cash Nominal (Pakuwon's Speed Rule):
                            </span>
                            <div className="grid grid-cols-4 gap-1.5">
                              {[
                                { label: 'Uang Pas', value: String(selectedPOSTable.totalBill) },
                                { label: '20rb', value: '20000' },
                                { label: '50rb', value: '50000' },
                                { label: '100rb', value: '100000' }
                              ].map(qc => (
                                <button
                                  key={qc.label}
                                  onClick={() => setPosCashGiven(qc.value)}
                                  className="bg-slate-900 hover:bg-indigo-500 hover:text-white text-slate-300 font-mono text-[11px] font-bold py-1.5 rounded-lg border border-slate-800 transition-all"
                                >
                                  {qc.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <p className="text-[11px] text-emerald-400 font-mono pt-0.5">
                            Kembalian: Rp {Math.max(0, parseInt(posCashGiven || '0') - selectedPOSTable.totalBill).toLocaleString('id-ID')}
                          </p>
                        </div>
                      )}

                      <button
                        onClick={handlePOSCheckoutTable}
                        disabled={selectedPOSTable.totalBill === 0}
                        className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
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

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-indigo-400" /> Modal Shift Kasir (1010-Cash Drawer)
                  </span>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Modal Awal:</span>
                    <span className="font-mono text-slate-200">Rp {cashDrawerFloat.toLocaleString('id-ID')}</span>
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

          {/* STAFF SURFACE 2: KITCHEN DISPLAY SCREEN */}
          {activeStaffSurface === 'kds-screen' && (
            <main className="flex-1 p-3 sm:p-6 max-w-7xl mx-auto w-full flex flex-col gap-4 sm:gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                    <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" /> Kitchen Stations (Split Screen Mode)
                  </h2>

                  <button
                    onClick={() => setActiveStaffSurface('cafe-config')}
                    className="bg-slate-800 hover:bg-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 text-slate-300 flex items-center gap-1.5"
                  >
                    <Settings className="w-3.5 h-3.5 text-indigo-400" /> Setting Station (Owner Portal)
                  </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {stations.map(station => (
                    <button
                      key={station.id}
                      onClick={() => setActiveStationId(station.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                        activeStationId === station.id
                          ? 'bg-indigo-500 text-white border-indigo-500 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span>{station.icon}</span>
                      <span>{station.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {/* INCOMING */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4 flex flex-col gap-3">
                  <h3 className="text-xs sm:text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Clock className="w-4 h-4 text-amber-500" /> 1. Incoming ({placedOrders.length})
                  </h3>
                  <div className="flex flex-col gap-3">
                    {placedOrders.map(order => (
                      <div key={order.id} className="bg-slate-950 border border-amber-500/40 rounded-xl p-3.5 flex flex-col gap-3 shadow-lg">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                          <div>
                            <span className="font-mono font-black text-xs text-amber-400">{order.id}</span>
                            <h4 className="text-xs font-bold text-white">{order.table} • {order.customerName}</h4>
                          </div>
                          <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {order.timeElapsedMinutes}m ago
                          </span>
                        </div>

                        <div className="flex flex-col gap-1.5 text-xs">
                          {order.items.map((item, idx) => (
                            <div key={idx} onClick={() => setSelectedRecipeBOM(item)} className="bg-slate-900/80 p-2 rounded-lg cursor-pointer">
                              <span className="font-bold text-slate-200">{item.quantity}x {item.name}</span>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => handleMoveStatus(order.id, 'processing')}
                          className="w-full bg-amber-500 text-slate-950 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 shadow"
                        >
                          <ChefHat className="w-4 h-4" /> Proses Pesanan ➔
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* IN PROGRESS */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4 flex flex-col gap-3">
                  <h3 className="text-xs sm:text-sm font-bold text-indigo-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                    <ChefHat className="w-4 h-4 text-indigo-500" /> 2. In Progress ({processingOrders.length})
                  </h3>
                  <div className="flex flex-col gap-3">
                    {processingOrders.map(order => (
                      <div key={order.id} className="bg-slate-950 border border-indigo-500/40 rounded-xl p-3.5 flex flex-col gap-3 shadow-lg">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                          <span className="font-mono font-black text-xs text-indigo-400">{order.id}</span>
                          <span className="text-[10px] text-indigo-400 font-mono font-bold">{order.timeElapsedMinutes}m active</span>
                        </div>

                        <div className="flex flex-col gap-1.5 text-xs">
                          {order.items.map((item, idx) => (
                            <div key={idx} onClick={() => setSelectedRecipeBOM(item)} className="bg-slate-900/80 p-2 rounded-lg cursor-pointer">
                              <span className="font-bold text-slate-200">{item.quantity}x {item.name}</span>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => handleMoveStatus(order.id, 'ready')}
                          className="w-full bg-emerald-500 text-slate-950 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 shadow"
                        >
                          Kirim ke Checker (QC) ➔
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* READY */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4 flex flex-col gap-3">
                  <h3 className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 3. Ready ({readyOrders.length})
                  </h3>
                  <div className="flex flex-col gap-3">
                    {readyOrders.map(order => (
                      <div key={order.id} className="bg-slate-950 border border-emerald-500/40 rounded-xl p-3.5 flex flex-col gap-3 shadow-lg">
                        <span className="font-mono font-black text-xs text-emerald-400">{order.id} • {order.table}</span>
                        <button
                          onClick={() => alert(`Struk ${order.id} dicetak!`)}
                          className="w-full bg-slate-800 text-slate-200 text-xs font-bold py-2 rounded-lg border border-slate-700"
                        >
                          Print Struk Dapur
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </main>
          )}

          {/* STAFF SURFACE 3: CHECKER / EXPEDITOR STATION */}
          {activeStaffSurface === 'checker-qc' && (
            <main className="flex-1 p-3 sm:p-6 max-w-7xl mx-auto w-full flex flex-col gap-4 sm:gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <BadgeCheck className="w-5 h-5 text-indigo-400" /> Mode Checker (Expeditor & Quality Control Pass)
                  </h2>
                  <p className="text-xs text-slate-400">Verifikasi kelengkapan nampan masakan & racikan minuman sebelum diserahkan ke Waiter/Runner</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {orders.filter(o => o.status === 'ready').map(order => (
                  <div key={order.id} className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div>
                        <span className="font-mono font-bold text-xs text-amber-400">{order.id}</span>
                        <h3 className="text-sm font-bold text-white">{order.table} • {order.customerName}</h3>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        handleMoveStatus(order.id, 'qc-passed')
                        alert(`Order ${order.id} Lolos QC Pass & Diteruskan ke Layar Waiter!`)
                      }}
                      className="w-full bg-emerald-500 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
                    >
                      <BadgeCheck className="w-4 h-4" /> QC Pass & Serahkan ke Waiter ➔
                    </button>
                  </div>
                ))}
              </div>
            </main>
          )}

          {/* STAFF SURFACE 4: MODE SERVER / WAITER */}
          {activeStaffSurface === 'server-waiter' && (
            <main className="flex-1 p-3 sm:p-6 max-w-7xl mx-auto w-full flex flex-col gap-4 sm:gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <Footprints className="w-5 h-5 text-indigo-400" /> Mode Server (Pramusaji & Food Runner)
                  </h2>
                  <p className="text-xs text-slate-400">Pengantaran Nampan Presisi Berdasarkan Penandaan Kursi Tamu (Seat 1, Seat 2, dst)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {orders.filter(o => o.status === 'qc-passed').map(order => (
                  <div key={order.id} className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 flex flex-col justify-between gap-4 shadow-xl">
                    <span className="font-mono font-bold text-xs text-emerald-400">{order.id} • {order.table}</span>
                    <button
                      onClick={() => {
                        handleMoveStatus(order.id, 'served')
                        alert(`Pesanan Meja ${order.table} telah selesai diantar!`)
                      }}
                      className="w-full bg-emerald-500 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Tandai Selesai Diantar (Served)
                    </button>
                  </div>
                ))}
              </div>
            </main>
          )}

          {/* STAFF SURFACE 5: DEDICATED HALAMAN KONFIGURASI CAFE & OWNER POLICY */}
          {activeStaffSurface === 'cafe-config' && (
            <main className="flex-1 p-3 sm:p-6 max-w-5xl mx-auto w-full flex flex-col gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">Halaman Konfigurasi Cafe & Owner Settings</h2>
                    <p className="text-xs text-slate-400">Pajak PB1, Service Charge, KDS Station Split & Mapping Kategori HFE Core</p>
                  </div>
                </div>
                <button 
                  onClick={() => alert('Seluruh Konfigurasi Policy Cafe Berhasil Disimpan ke Hfe Backend!')}
                  className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <Check className="w-4 h-4" /> Simpan Seluruh Konfigurasi
                </button>
              </div>

              {/* CARD HFE PRODUCT CATEGORIES MAPPING PORTAL */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 shadow-lg">
                <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2 border-b border-slate-800 pb-2.5">
                  <FolderTree className="w-4 h-4 text-indigo-400" /> Mapping Kategori Produk HFE Engine & GL Accounts
                </h3>
                <p className="text-xs text-slate-400">Pemetaan resmi kategori etalase POS ke kode kategori produk & subledger akuntansi Headless Company Books:</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: 'Coffee Specialty', code: 'CAT-COFFEE-01', gl: '4010-Beverage Sales', items: 3, icon: '☕' },
                    { name: 'Non-Coffee & Matcha', code: 'CAT-NONCOFFEE-02', gl: '4010-Beverage Sales', items: 1, icon: '🍵' },
                    { name: 'Pastry & Warm Bakery', code: 'CAT-PASTRY-03', gl: '4020-Food Sales', items: 1, icon: '🥐' },
                    { name: 'Snack & Finger Foods', code: 'CAT-SNACK-04', gl: '4020-Food Sales', items: 1, icon: '🍟' }
                  ].map((hfeCat, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{hfeCat.icon}</span> {hfeCat.name}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {hfeCat.code}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                        <span>HFE Subledger GL:</span>
                        <span className="font-mono text-emerald-400 font-bold">{hfeCat.gl}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          )}

        </div>
      )}

      {/* --- INITIAL ONE-TIME CUSTOMER LOGIN ONBOARDING MODAL --- */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 sm:p-6 flex flex-col gap-4 shadow-2xl relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Selamat Datang di Kafe!</h3>
                <p className="text-[11px] text-slate-400">Masuk sekali, tersimpan sepanjang kunjungan</p>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setLoginType('phone')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  loginType === 'phone' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400'
                }`}
              >
                Nomor HP (Poin)
              </button>
              <button
                onClick={() => setLoginType('guest-name')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  loginType === 'guest-name' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400'
                }`}
              >
                Pure Guest (Nama)
              </button>
            </div>

            {loginType === 'phone' ? (
              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-400">Nomor WhatsApp Pelanggan:</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 font-mono"
                  placeholder="081298765432"
                />
                <p className="text-[10px] text-amber-400">✓ Poin & Voucher Hfe otomatis terhubung ke HP ini.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-400">Nama Tampilan Meja:</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 font-semibold"
                  placeholder="Masukkan Nama Anda..."
                />
                <p className="text-[10px] text-slate-400">✓ Untuk pengantaran pesanan oleh waiter.</p>
              </div>
            )}

            <button
              onClick={handleSaveInitialLogin}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-lg mt-1"
            >
              Simpan Profil & Mulai Pesan Menu ➔
            </button>
          </div>
        </div>
      )}

      {/* --- DRINK MODIFIER MODAL WITH SEAT TAGGING & ALLERGEN NOTES --- */}
      {showModifierModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 flex flex-col gap-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Coffee className="w-5 h-5 text-amber-500" /> Kustomisasi {showModifierModal.name}
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                <Armchair className="w-3.5 h-3.5 text-amber-500" /> Penandaan Nomor Kursi (Seat Number):
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {['Seat 1', 'Seat 2', 'Seat 3', 'Seat 4'].map(s => (
                  <button
                    key={s}
                    onClick={() => setModSeat(s)}
                    className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      modSeat === s ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Catatan Alergen / Pantangan (Opsional):
              </label>
              <input
                type="text"
                value={modAllergen}
                onChange={(e) => setModAllergen(e.target.value)}
                placeholder="cth: Alergi Lactose, No Truffle Oil"
                className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500 text-rose-200 font-medium"
              />
            </div>

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
