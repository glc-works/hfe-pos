import React, { useState, useRef, useEffect } from 'react'
import { DomainNavigator } from './components/common/DomainNavigator'
import { LandingPageView } from './components/landing/LandingPageView'
import { ReservationModal } from './components/modals/ReservationModal'
import { TableOperationsModal } from './components/modals/TableOperationsModal'
import { ModifierModal } from './components/modals/ModifierModal'
import { QrisModal } from './components/modals/QrisModal'
import { RecipeBomModal } from './components/modals/RecipeBomModal'
import { LoginModal } from './components/modals/LoginModal'
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
  Monitor,
  ClipboardList,
  Barcode,
  Contact,
  UserPlus,
  Heart,
  Palette,
  Download,
  Upload,
  Code2,
  Wand2,
  FileCode,
  Building,
  Globe,
  Radio,
  FileCheck,
  Lock as LockIcon,
  ArrowRightLeft,
  Calendar,
  CalendarCheck,
  MapPin,
  QrCode as QrIcon
} from 'lucide-react'

// --- TYPES ---
type PrimaryDomainApp = 'landing' | 'customer' | 'cafe'
type StaffSurfaceMode = 'barista-pos' | 'kds-screen' | 'checker-qc' | 'server-waiter' | 'cafe-config'
type KdsViewModeType = 'kanban' | 'list' | 'workorder'
type CustomerLoginType = 'phone' | 'guest-name'
type PaymentPolicy = 'pay-first' | 'open-tab'
type PB1TaxMode = 0 | 1 | 2 // 0=Disabled, 1=Exclude (Show), 2=Include (Embedded in price)

export interface TableReservation {
  id: string
  customerName: string
  phone: string
  tableArea: string
  paxCount: number
  reservationDate: string
  timeSlot: string
  dpAmount: number
  dpStatus: 'unpaid' | 'paid_qris'
  approvalPolicy: 'instant' | 'manual_review'
  status: 'pending' | 'confirmed' | 'seated' | 'cancelled'
  specialNotes?: string
  preOrderItems?: { name: string; qty: number; price: number }[]
  totalPreOrderAmount?: number
  createdAt: string
}

export interface HfeCompanyProfile {
  companyBookId: string
  ptLegalName: string
  brandName: string
  logoUrl: string
  taxIdNpwp: string
  nibPermit: string
  address: string
  hfeLedgerApiEndpoint: string
  isLiveHfeSynced: boolean
  lastSyncedAt: string
}

export interface CafeThemeConfig {
  version: string
  themeId: string
  themeName: string
  brandName: string
  fontFamily: string
  primaryAccentHex: string
  primaryAccentHoverHex: string
  pageBgHex: string
  cardBgHex: string
  headerBgHex: string
  textColorHex: string
  secondaryTextColorHex: string
  highlightBadgeBgHex: string
  highlightBadgeTextHex: string
  borderRadiusPx: number
  customCssOverrides?: string
}

interface StationConfig {
  id: string
  name: string
  icon: string
  categories: string[]
}

interface CustomerProfile {
  id: string
  name: string
  phone: string
  favoriteSeat: string
  favoriteDrink: string
  preferredMilk: string
  preferredSugar: string
  allergenAlert?: string
  totalVisits: number
  loyaltyTier: string
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
  bomIngredients?: { itemCode: string; name: string; amount: string }[]
  preparationSteps?: string[]
}

interface CartItem extends MenuItem {
  quantity: number
  seatNumber?: string
  seatCustomerContact?: {
    name: string
    phone?: string
    savedPreferences?: string
  }
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

// --- BUILT-IN THEME STYLESHEET PRESETS ---
const BUILTIN_THEMES: CafeThemeConfig[] = [
  {
    version: '1.0',
    themeId: 'theme-warm-amber',
    themeName: '☕ Kopitiam Warm Amber (Default)',
    brandName: 'Kopitiam Senopati & Roastery',
    fontFamily: 'Inter, sans-serif',
    primaryAccentHex: '#f59e0b',
    primaryAccentHoverHex: '#d97706',
    pageBgHex: '#020617',
    cardBgHex: '#0f172a',
    headerBgHex: '#0f172af2',
    textColorHex: '#f8fafc',
    secondaryTextColorHex: '#94a3b8',
    highlightBadgeBgHex: '#f59e0b20',
    highlightBadgeTextHex: '#fbbf24',
    borderRadiusPx: 16,
    customCssOverrides: `/* Custom Warm Amber Overrides */\n.theme-brand-accent { color: #f59e0b; }`
  },
  {
    version: '1.0',
    themeId: 'theme-botanica-matcha',
    themeName: '🌿 Botanica Matcha (Emerald & Mint)',
    brandName: 'Botanica Coffee & Artisan Matcha',
    fontFamily: 'Inter, sans-serif',
    primaryAccentHex: '#10b981',
    primaryAccentHoverHex: '#059669',
    pageBgHex: '#022c22',
    cardBgHex: '#064e3b',
    headerBgHex: '#064e3bf2',
    textColorHex: '#ecfdf5',
    secondaryTextColorHex: '#a7f3d0',
    highlightBadgeBgHex: '#10b98120',
    highlightBadgeTextHex: '#34d399',
    borderRadiusPx: 20,
    customCssOverrides: `/* Botanica Matcha Glow */\n.theme-brand-accent { color: #10b981; }`
  },
  {
    version: '1.0',
    themeId: 'theme-cyberpunk-neon',
    themeName: '🌌 Cyberpunk Neon (Purple & Cyan)',
    brandName: 'Neon Bistro 2088',
    fontFamily: 'Courier New, monospace',
    primaryAccentHex: '#a855f7',
    primaryAccentHoverHex: '#9333ea',
    pageBgHex: '#09090b',
    cardBgHex: '#18181b',
    headerBgHex: '#18181bf2',
    textColorHex: '#fafafa',
    secondaryTextColorHex: '#a1a1aa',
    highlightBadgeBgHex: '#a855f720',
    highlightBadgeTextHex: '#c084fc',
    borderRadiusPx: 12,
    customCssOverrides: `/* Neon Glow Border Effects */\n.theme-brand-card { border-color: rgba(168, 85, 247, 0.4); }`
  },
  {
    version: '1.0',
    themeId: 'theme-parisian-rose',
    themeName: '🥐 Parisian Rose (Rose & Cream)',
    brandName: 'Maison de Pastry Paris',
    fontFamily: 'Georgia, serif',
    primaryAccentHex: '#f43f5e',
    primaryAccentHoverHex: '#e11d48',
    pageBgHex: '#1c1917',
    cardBgHex: '#292524',
    headerBgHex: '#292524f2',
    textColorHex: '#fef2f2',
    secondaryTextColorHex: '#fca5a5',
    highlightBadgeBgHex: '#f43f5e20',
    highlightBadgeTextHex: '#fb7185',
    borderRadiusPx: 24,
    customCssOverrides: `/* Parisian Elegant Serif Text */\n.theme-brand-title { font-style: italic; }`
  }
]

// --- MOCK PRODUCT MASTER DATA WITH KODE BARANG CAFE & BOM RAW CODES ---
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
      { itemCode: 'RAW-BEAN-01', name: 'Houseblend Arabica Beans', amount: '18 gram' },
      { itemCode: 'RAW-MILK-02', name: 'Oatside Oat Milk / Fresh Milk', amount: '150 ml' },
      { itemCode: 'RAW-SYRUP-03', name: 'Liquid Organic Aren Syrup', amount: '20 ml' },
      { itemCode: 'RAW-ICE-04', name: 'Ice Cubes', amount: '120 gram' }
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
      { itemCode: 'RAW-BEAN-02', name: 'Espresso Beans Single Origin', amount: '18 gram' },
      { itemCode: 'RAW-MILK-03', name: 'Sweetened Condensed Milk', amount: '25 ml' },
      { itemCode: 'RAW-MILK-01', name: 'Fresh Milk Steamed/Cold', amount: '140 ml' }
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
      { itemCode: 'RAW-BEAN-03', name: 'Single Origin Filter Beans (Ethiopia/Gayo)', amount: '15 gram' },
      { itemCode: 'RAW-WATER-01', name: 'Air Panas (92°C)', amount: '150 ml' },
      { itemCode: 'RAW-ICE-04', name: 'Ice Cubes Server', amount: '100 gram' }
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
      { itemCode: 'RAW-MATCHA-01', name: 'Uji Matcha Powder Premium', amount: '6 gram' },
      { itemCode: 'RAW-WATER-01', name: 'Air Hangat (80°C)', amount: '30 ml' },
      { itemCode: 'RAW-MILK-02', name: 'Oatside Oat Milk', amount: '160 ml' }
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
      { itemCode: 'RAW-PASTRY-01', name: 'Pre-baked Butter Croissant', amount: '1 pcs' },
      { itemCode: 'RAW-BUTTER-02', name: 'French Salted Butter', amount: '10 gram' }
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
      { itemCode: 'RAW-POTATO-01', name: 'Shoestring French Fries', amount: '180 gram' },
      { itemCode: 'RAW-TRUFFLE-02', name: 'White Truffle Oil', amount: '5 ml' },
      { itemCode: 'RAW-CHEESE-03', name: 'Grated Parmesan Cheese', amount: '15 gram' },
      { itemCode: 'RAW-HERB-04', name: 'Parsley Flakes', amount: '2 gram' }
    ],
    preparationSteps: [
      '1. Goreng kentang di deep fryer suhu 175°C selama 4 menit hingga golden crispy.',
      '2. Tiriskan, toss dalam mixing bowl dengan 5ml White Truffle Oil & garam.',
      '3. Plating di keranjang saji, taburi 15g keju parmesan serut dan parsley flakes.'
    ]
  },
]

export default function App() {
  // --- HFE COMPANY / PROFIL PT LEGAL ENTITY STATE (REST API INTEGRATION) ---
  const [hfeCompanyProfile, setHfeCompanyProfile] = useState<HfeCompanyProfile>({
    companyBookId: 'BOOK-SENOPATI-01',
    ptLegalName: 'PT Kopi Karya Nusantara',
    brandName: 'Kopitiam Senopati & Roastery',
    logoUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100&q=80',
    taxIdNpwp: '01.234.567.8-012.000',
    nibPermit: '1234000987654',
    address: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan',
    hfeLedgerApiEndpoint: 'http://localhost:8080/v1/company-books/BOOK-SENOPATI-01',
    isLiveHfeSynced: true,
    lastSyncedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  })

  // --- HFE MULTI-BRANCH ENGINE CONFIGURATION STATE ---
  const [hfeBranchMode, setHfeBranchMode] = useState<'dimensional' | 'multi_book' | 'sub_account'>('dimensional')
  const [activeBranchId, setActiveBranchId] = useState<string>('OUTLET-SENOPATI-01')
  const [outletBranches] = useState([
    { id: 'OUTLET-SENOPATI-01', name: 'Kopitiam Senopati & Roastery (HQ)', warehouse: 'WH-SENOPATI-01' },
    { id: 'OUTLET-BSD-02', name: 'Kopitiam BSD Breeze', warehouse: 'WH-BSD-02' },
    { id: 'OUTLET-BDG-03', name: 'Kopitiam Bandung Dago', warehouse: 'WH-BDG-03' }
  ])

  // --- CAFE THEME STYLESHEET STATE (EXPORT & IMPORT ENGINE) ---
  const [activeTheme, setActiveTheme] = useState<CafeThemeConfig>(BUILTIN_THEMES[0])
  const [aiStylesheetInput, setAiStylesheetInput] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync active theme brand name with HFE Company Profile
  useEffect(() => {
    setActiveTheme(prev => ({ ...prev, brandName: hfeCompanyProfile.brandName }))
  }, [hfeCompanyProfile.brandName])

  // --- CAFE USERNAME SLUG ROUTING (/username e.g., /senopati-roastery) ---
  const [cafeUsername, setCafeUsername] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search)
    const userParam = params.get('username')
    if (userParam) return userParam
    const path = window.location.pathname.replace('/', '').trim()
    if (path && path !== 'cafe' && path !== 'customer') return path
    return 'senopati-roastery'
  })

  // --- SEPARATE DOMAIN / 3-URL ROUTING ARCHITECTURE ---
  const [activeApp, setActiveApp] = useState<PrimaryDomainApp>(() => {
    const params = new URLSearchParams(window.location.search)
    const appParam = params.get('app')
    const path = window.location.pathname.replace('/', '').trim()
    if (appParam === 'cafe' || path === 'cafe') return 'cafe'
    if (appParam === 'customer' || path === 'customer') return 'customer'
    return 'landing' // URL 3 default: Official Landing Page (/username e.g., /senopati-roastery)
  })

  // --- DYNAMIC URL SWITCHER EFFECT WITH CAFE USERNAME ---
  const switchDomainApp = (targetApp: PrimaryDomainApp, username: string = cafeUsername) => {
    setActiveApp(targetApp)
    const newUrl = targetApp === 'cafe' ? '?app=cafe' : targetApp === 'customer' ? '?app=customer' : `/${username}`
    window.history.pushState({}, '', newUrl)
  }

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
  const [kdsViewMode, setKdsViewMode] = useState<KdsViewModeType>('workorder')
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

  // --- SAVED CUSTOMER PROFILES DATABASE FOR SEAT-LEVEL BINDING & PREFERENCE PROFILING ---
  const [customerProfiles, setCustomerProfiles] = useState<CustomerProfile[]>([
    {
      id: 'CUST-01',
      name: 'Aldi',
      phone: '081298765432',
      favoriteSeat: 'Seat 1',
      favoriteDrink: 'Espresso Aren Latte',
      preferredMilk: 'Oat Milk (+Rp 5.000)',
      preferredSugar: '50%',
      allergenAlert: 'Alergi Lactose (Ganti Oatside)',
      totalVisits: 14,
      loyaltyTier: 'Gold Tier (Barista Pro)'
    },
    {
      id: 'CUST-02',
      name: 'Siti Rahma',
      phone: '081599887766',
      favoriteSeat: 'Seat 2',
      favoriteDrink: 'Japanese Cold Brew V60',
      preferredMilk: 'Tanpa Susu',
      preferredSugar: '0%',
      totalVisits: 8,
      loyaltyTier: 'Silver Tier'
    }
  ])

  // --- LOCKED PHYSICAL QR TABLE & SEAT SCANNING ENGINE ---
  const [selectedTable, setSelectedTable] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('table') || 'MEJA-04'
  })

  const [scannedSeat, setScannedSeat] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('seat') || 'Seat 1'
  })

  // ADMIN TABLE REASSIGNMENT MODAL STATE
  const [showTableReassignModal, setShowTableReassignModal] = useState<boolean>(false)
  const [reassignFromTable, setReassignFromTable] = useState<string>('MEJA-04')
  const [reassignTargetTable, setReassignTargetTable] = useState<string>('MEJA-08')

  // --- TABLE RESERVATION ENGINE & POLICY STATE ---
  const [reservationPolicyMode, setReservationPolicyMode] = useState<'instant' | 'manual_review'>('manual_review')
  const [dpRequiredMode, setDpRequiredMode] = useState<boolean>(true)
  const [dpAmountConfig, setDpAmountConfig] = useState<number>(50000)

  // --- CAFE OPERATIONAL & RESERVATION ORDER FLOW MODES ---
  // 1. Flow Reservasi: 'table_only' (Meja Saja) | 'optional_order' (Meja + Pre-Order Opsional) | 'mandatory_order' (Wajib Pre-Order Menu)
  const [reservationOrderMode, setReservationOrderMode] = useState<'table_only' | 'optional_order' | 'mandatory_order'>('optional_order')
  // 2. Mode Aplikasi Pelanggan: 'full_ordering' (Order & Checkout Active) | 'catalog_only' (Katalog Digital / Lihat Saja)
  const [customerAppDisplayMode, setCustomerAppDisplayMode] = useState<'full_ordering' | 'catalog_only'>('full_ordering')
  // 3. Visibilitas Harga: 'show_prices' (Tampilkan Rp) | 'hide_prices' (Sembunyikan Harga / Hidden Price Mode)
  const [priceVisibilityMode, setPriceVisibilityMode] = useState<'show_prices' | 'hide_prices'>('show_prices')

  // Selected Pre-Order Menu Items inside Reservation Modal
  const [resPreOrderItems, setResPreOrderItems] = useState<{ itemId: string; name: string; price: number; qty: number }[]>([])

  const [showReservationModal, setShowReservationModal] = useState<boolean>(false)
  const [resDate, setResDate] = useState<string>('2026-08-16')
  const [resTimeSlot, setResTimeSlot] = useState<string>('19:00 WIB')
  const [resArea, setResArea] = useState<string>('Outdoor Garden (Smoking)')
  const [resPax, setResPax] = useState<number>(4)
  const [resCustomerName, setResCustomerName] = useState<string>('Aldi Pratama')
  const [resCustomerPhone, setResCustomerPhone] = useState<string>('081298765432')
  const [resNotes, setResNotes] = useState<string>('Ulang Tahun (Minta Baby Chair 1 pcs)')
  const [resPayDpNow, setResPayDpNow] = useState<boolean>(true)

  const [reservations, setReservations] = useState<TableReservation[]>([
    {
      id: 'RSV-901',
      customerName: 'Dian Sastro',
      phone: '081122334455',
      tableArea: 'VIP Room 1 (AC)',
      paxCount: 6,
      reservationDate: '2026-08-16',
      timeSlot: '18:30 WIB',
      dpAmount: 100000,
      dpStatus: 'paid_qris',
      approvalPolicy: 'manual_review',
      status: 'pending',
      specialNotes: 'Meeting Bisnis & Minta Colokan Listrik',
      createdAt: '18:30'
    },
    {
      id: 'RSV-900',
      customerName: 'Bambang Tri',
      phone: '081999888777',
      tableArea: 'Meja Dining Utama',
      paxCount: 2,
      reservationDate: '2026-08-16',
      timeSlot: '20:00 WIB',
      dpAmount: 50000,
      dpStatus: 'paid_qris',
      approvalPolicy: 'instant',
      status: 'confirmed',
      specialNotes: 'Anniversary Dinner',
      createdAt: '15:10'
    }
  ])

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

  // Cart & Policy State (with Seat Tagging & Contact Binding)
  const [cart, setCart] = useState<CartItem[]>([
    { 
      ...PRODUCT_CATALOG[0], 
      quantity: 2, 
      seatNumber: 'Seat 1', 
      seatCustomerContact: { name: 'Aldi', phone: '081298765432', savedPreferences: 'Oat Milk 50% Sugar' },
      allergenNotes: 'Alergi Lactose (Ganti Oatside)', 
      temperature: 'Iced', 
      sugarLevel: '50%', 
      milkOption: 'Oat Milk (+Rp 5.000)' 
    },
    { 
      ...PRODUCT_CATALOG[4], 
      quantity: 1, 
      seatNumber: 'Seat 2',
      seatCustomerContact: { name: 'Siti Rahma', phone: '081599887766', savedPreferences: 'No Sugar' }
    }
  ])
  const [paymentPolicy, setPaymentPolicy] = useState<PaymentPolicy>('pay-first')
  
  // MODIFIER MODAL STATE WITH SEAT CONTACT BINDING
  const [showModifierModal, setShowModifierModal] = useState<MenuItem | null>(null)
  const [modTemp, setModTemp] = useState<'Hot' | 'Iced'>('Iced')
  const [modSugar, setModSugar] = useState<'0%' | '50%' | '100%'>('50%')
  const [modMilk, setModMilk] = useState<'Whole Milk' | 'Oat Milk (+Rp 5.000)' | 'Almond Milk (+Rp 5.000)'>('Oat Milk (+Rp 5.000)')
  const [modSeat, setModSeat] = useState<string>('Seat 1')
  const [modSeatCustomerName, setModSeatCustomerName] = useState<string>('Aldi')
  const [modSeatCustomerPhone, setModSeatCustomerPhone] = useState<string>('081298765432')
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
        { 
          ...PRODUCT_CATALOG[0], 
          quantity: 2, 
          seatNumber: 'Seat 1', 
          seatCustomerContact: { name: 'Aldi', phone: '081298765432', savedPreferences: 'Oat Milk 50% Sugar' },
          allergenNotes: 'Alergi Lactose (Ganti Oatside)', 
          temperature: 'Iced', 
          sugarLevel: '50%', 
          milkOption: 'Oat Milk (+Rp 5.000)' 
        },
        { 
          ...PRODUCT_CATALOG[4], 
          quantity: 1, 
          seatNumber: 'Seat 2',
          seatCustomerContact: { name: 'Siti Rahma', phone: '081599887766', savedPreferences: 'No Sugar' }
        }
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
    }
  ])

  // --- POS TABLES & CASHIER STATE ---
  const [tablesGrid, setTablesGrid] = useState<TableStatus[]>([
    { id: 'T1', name: 'MEJA-01', status: 'free', totalBill: 0, orderCount: 0 },
    { id: 'T2', name: 'MEJA-02', status: 'free', totalBill: 0, orderCount: 0 },
    { id: 'T3', name: 'MEJA-03', status: 'free', totalBill: 0, orderCount: 0 },
    { id: 'T4', name: 'MEJA-04', status: 'occupied', customerName: 'Aldi', totalBill: 86000, orderCount: 2 },
    { id: 'T5', name: 'MEJA-05', status: 'free', totalBill: 0, orderCount: 0 },
    { id: 'T8', name: 'MEJA-08', status: 'free', totalBill: 0, orderCount: 0 },
    { id: 'T12', name: 'MEJA-12', status: 'open-tab', customerName: 'Budi Santoso', totalBill: 140000, orderCount: 4 },
  ])
  const [selectedPOSTable, setSelectedPOSTable] = useState<TableStatus | null>(tablesGrid[3])
  const [posPayMethod, setPosPayMethod] = useState<'cash' | 'qris' | 'card'>('cash')
  const [posCashGiven, setPosCashGiven] = useState<string>('100000')

  // ADMIN TABLE REASSIGNMENT, SPLIT & JOIN MODAL STATE
  const [tableOpMode, setTableOpMode] = useState<'move' | 'split' | 'join'>('move')
  const [splitSourceTable, setSplitSourceTable] = useState<string>('MEJA-04')
  const [splitTargetTable, setSplitTargetTable] = useState<string>('MEJA-05')
  const [splitSelectedSeat, setSplitSelectedSeat] = useState<string>('Seat 2')

  const [joinSourceTable, setJoinSourceTable] = useState<string>('MEJA-12')
  const [joinTargetTable, setJoinTargetTable] = useState<string>('MEJA-04')

  // 1. HANDLER PINDAH MEJA (MOVE TABLE)
  const handleConfirmTableReassign = () => {
    if (reassignFromTable === reassignTargetTable) {
      alert('Meja tujuan tidak boleh sama dengan meja asal!')
      return
    }

    setOrders(prev => prev.map(o => o.table === reassignFromTable ? { ...o, table: reassignTargetTable } : o))

    setTablesGrid(prev => {
      const sourceTableObj = prev.find(t => t.name === reassignFromTable)
      if (!sourceTableObj) return prev
      const bill = sourceTableObj.totalBill
      const count = sourceTableObj.orderCount
      const custName = sourceTableObj.customerName

      return prev.map(t => {
        if (t.name === reassignFromTable) {
          return { ...t, status: 'free', totalBill: 0, orderCount: 0, customerName: undefined }
        }
        if (t.name === reassignTargetTable) {
          return { ...t, status: 'occupied', totalBill: bill, orderCount: count, customerName: custName }
        }
        return t
      })
    })

    if (selectedTable === reassignFromTable) {
      setSelectedTable(reassignTargetTable)
    }

    setShowTableReassignModal(false)
    alert(`🔀 Berhasil! Pesanan pelanggan dari ${reassignFromTable} dipindahkan ke ${reassignTargetTable} oleh Staf Kafe.`)
  }

  // 2. HANDLER SPLIT MEJA (SPLIT TABLE / BILL PER SEAT)
  const handleConfirmTableSplit = () => {
    if (splitSourceTable === splitTargetTable) {
      alert('Meja tujuan split tidak boleh sama dengan meja asal!')
      return
    }

    const sourceOrderIndex = orders.findIndex(o => o.table === splitSourceTable)
    if (sourceOrderIndex >= 0) {
      const sourceOrder = orders[sourceOrderIndex]
      const splitItems = sourceOrder.items.filter(i => i.seatNumber === splitSelectedSeat)
      const remainingItems = sourceOrder.items.filter(i => i.seatNumber !== splitSelectedSeat)

      if (splitItems.length === 0) {
        alert(`Tidak ada item pesanan di ${splitSelectedSeat} untuk di-split!`)
        return
      }

      const splitSubtotal = splitItems.reduce((s, i) => s + (i.price * i.quantity), 0)
      const remainingSubtotal = remainingItems.reduce((s, i) => s + (i.price * i.quantity), 0)

      const updatedOrders = [...orders]
      updatedOrders[sourceOrderIndex] = {
        ...sourceOrder,
        items: remainingItems,
        total: remainingSubtotal
      }

      const newSplitOrder: OrderTicket = {
        id: `ORD-SPLIT-${Math.floor(100 + Math.random() * 900)}`,
        table: splitTargetTable,
        customerName: `${sourceOrder.customerName} (${splitSelectedSeat})`,
        items: splitItems,
        policy: sourceOrder.policy,
        total: splitSubtotal,
        taxPB1Amount: Math.round(splitSubtotal * 0.1),
        serviceFeeAmount: Math.round(splitSubtotal * 0.05),
        tipAmount: 0,
        status: 'processing',
        timeElapsedMinutes: 1,
        createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }

      setOrders([newSplitOrder, ...updatedOrders])

      setTablesGrid(prev => prev.map(t => {
        if (t.name === splitSourceTable) {
          return { ...t, totalBill: remainingSubtotal, orderCount: remainingItems.length }
        }
        if (t.name === splitTargetTable) {
          return { ...t, status: 'occupied', customerName: newSplitOrder.customerName, totalBill: splitSubtotal, orderCount: splitItems.length }
        }
        return t
      }))

      setShowTableReassignModal(false)
      alert(`✂️ Sukses! Item ${splitSelectedSeat} dari ${splitSourceTable} berhasil di-split ke ${splitTargetTable} (Rp ${splitSubtotal.toLocaleString('id-ID')}).`)
    }
  }

  // 3. HANDLER JOIN / MERGE MEJA (GABUNG MEJA)
  const handleConfirmTableJoin = () => {
    if (joinSourceTable === joinTargetTable) {
      alert('Meja yang digabung tidak boleh sama!')
      return
    }

    const sourceTableObj = tablesGrid.find(t => t.name === joinSourceTable)
    const targetTableObj = tablesGrid.find(t => t.name === joinTargetTable)

    if (!sourceTableObj || !targetTableObj) return

    const combinedBill = sourceTableObj.totalBill + targetTableObj.totalBill
    const combinedCount = sourceTableObj.orderCount + targetTableObj.orderCount

    setOrders(prev => prev.map(o => {
      if (o.table === joinSourceTable) {
        return { ...o, table: joinTargetTable }
      }
      return o
    }))

    setTablesGrid(prev => prev.map(t => {
      if (t.name === joinSourceTable) {
        return { ...t, status: 'free', totalBill: 0, orderCount: 0, customerName: undefined }
      }
      if (t.name === joinTargetTable) {
        return { ...t, status: 'occupied', totalBill: combinedBill, orderCount: combinedCount, customerName: `${t.customerName || 'Group'} & ${sourceTableObj.customerName || 'Gabungan'}` }
      }
      return t
    }))

    setShowTableReassignModal(false)
    alert(`🔗 Sukses! Meja ${joinSourceTable} berhasil digabungkan dengan ${joinTargetTable}! Total Tagihan Gabungan: Rp ${combinedBill.toLocaleString('id-ID')}.`)
  }

  // --- RESERVATION ENGINE HANDLERS ---
  const handleCreateReservation = () => {
    if (!resCustomerName.trim() || !resCustomerPhone.trim()) {
      alert('Nama dan Nomor HP Pemesan Wajib diisi!')
      return
    }

    if (reservationOrderMode === 'mandatory_order' && resPreOrderItems.length === 0) {
      alert('⚠️ Kebijakan Kafe: Wajib memilih minimal 1 menu Pre-Order untuk melakukan reservasi meja!')
      return
    }

    const totalPreOrderAmount = resPreOrderItems.reduce((sum, item) => sum + (item.price * item.qty), 0)
    const finalDpAmount = (dpRequiredMode && resPayDpNow) ? dpAmountConfig : 0
    const initialStatus = reservationPolicyMode === 'instant' ? 'confirmed' : 'pending'

    const newReservation: TableReservation = {
      id: `RSV-${Math.floor(100 + Math.random() * 900)}`,
      customerName: resCustomerName,
      phone: resCustomerPhone,
      tableArea: resArea,
      paxCount: resPax,
      reservationDate: resDate,
      timeSlot: resTimeSlot,
      dpAmount: finalDpAmount,
      dpStatus: finalDpAmount > 0 ? 'paid_qris' : 'unpaid',
      approvalPolicy: reservationPolicyMode,
      status: initialStatus,
      specialNotes: resNotes.trim() || undefined,
      preOrderItems: resPreOrderItems.length > 0 ? resPreOrderItems.map(i => ({ name: i.name, qty: i.qty, price: i.price })) : undefined,
      totalPreOrderAmount: totalPreOrderAmount > 0 ? totalPreOrderAmount : undefined,
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }

    setReservations([newReservation, ...reservations])
    setShowReservationModal(false)
    setResPreOrderItems([])

    if (initialStatus === 'confirmed') {
      alert(`🎉 Reservasi Instan Berhasil Disetujui! Direservasikan untuk ${resCustomerName} (${resDate} @ ${resTimeSlot}). DP Rp ${finalDpAmount.toLocaleString('id-ID')} Terposting ke Ledger Deposit HFE!`)
    } else {
      alert(`⏳ Permohonan Reservasi Terkirim! Status: Menunggu Konfirmasi Staf/Kasir Kafe. Notifikasi akan dikirim via WA ${resCustomerPhone}.`)
    }
  }

  const handleApproveReservation = (id: string) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'confirmed' } : r))
    alert(`✓ Reservasi ${id} Disetujui! Meja resmi dibooking di sistem.`)
  }

  const handleRejectReservation = (id: string) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r))
    alert(`❌ Reservasi ${id} Dibatalkan.`)
  }

  // --- HFE COMPANY PROFILE REST API SYNC HANDLERS ---
  const handleFetchHfeCompanyProfile = () => {
    const mockSyncedProfile: HfeCompanyProfile = {
      ...hfeCompanyProfile,
      isLiveHfeSynced: true,
      lastSyncedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
    setHfeCompanyProfile(mockSyncedProfile)
    alert(`🔄 Success GET /v1/company-books/${hfeCompanyProfile.companyBookId}/profile! Profil PT "${mockSyncedProfile.ptLegalName}" & Branding "${mockSyncedProfile.brandName}" Ter-sync Live dari HFE Rust Backend.`)
  }

  const handlePushHfeCompanyProfile = () => {
    setHfeCompanyProfile(prev => ({
      ...prev,
      isLiveHfeSynced: true,
      lastSyncedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }))
    alert(`💾 Success POST /v1/company-books/${hfeCompanyProfile.companyBookId}/profile! Perubahan Profil PT "${hfeCompanyProfile.ptLegalName}" & Logo Outlet Berhasil Diposting ke HFE Engine.`)
  }

  // --- EXPORT & IMPORT THEME STYLESHEET ENGINE HANDLERS ---
  const handleExportThemeFile = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(activeTheme, null, 2))}`
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', jsonString)
    downloadAnchor.setAttribute('download', `${activeTheme.themeId}-stylesheet.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  const handleImportThemeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader()
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8")
      fileReader.onload = (event) => {
        try {
          const parsedTheme = JSON.parse(event.target?.result as string) as CafeThemeConfig
          if (parsedTheme.themeId && parsedTheme.primaryAccentHex) {
            setActiveTheme(parsedTheme)
            alert(`✅ Stylesheet Tema "${parsedTheme.themeName}" Berhasil Di-import & Diterapkan ke Aplikasi Customer!`)
          } else {
            alert('⚠️ Format file Stylesheet JSON tidak valid. Pastikan berisi properti themeId & primaryAccentHex.')
          }
        } catch (err) {
          alert('⚠️ Gagal membaca file JSON stylesheet.')
        }
      }
    }
  }

  const handleApplyAIThemeString = () => {
    try {
      const parsedTheme = JSON.parse(aiStylesheetInput) as CafeThemeConfig
      if (parsedTheme.themeId && parsedTheme.primaryAccentHex) {
        setActiveTheme(parsedTheme)
        alert(`⚡ Tema AI "${parsedTheme.themeName}" Berhasil Diterapkan ke Layar Pelanggan!`)
      } else {
        alert('⚠️ Format JSON tidak valid.')
      }
    } catch (err) {
      alert('⚠️ Syntax JSON error. Silakan periksa kembali format teks yang di-paste dari AI.')
    }
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
    
    // Save or Update Customer Profile in CRM Matrix
    if (modSeatCustomerName.trim()) {
      const existingProfileIndex = customerProfiles.findIndex(c => c.name.toLowerCase() === modSeatCustomerName.toLowerCase() || (modSeatCustomerPhone && c.phone === modSeatCustomerPhone))
      
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
      alert(`Pesanan Open Tab meja ${selectedTable} terkirim ke KDS Dapur! Terkoneksi dengan Hfe Ledger (${hfeCompanyProfile.ptLegalName}).`)
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
    alert(`Pembayaran QRIS Sukses! Pesanan meja ${selectedTable} masuk KDS Dapur & Terposting ke Hfe Engine (${hfeCompanyProfile.ptLegalName}).`)
  }

  const handlePOSCheckoutTable = () => {
    if (!selectedPOSTable || selectedPOSTable.totalBill === 0) return
    setTablesGrid(prev => prev.map(t => t.id === selectedPOSTable.id ? { ...t, status: 'free', totalBill: 0, customerName: undefined } : t))
    alert(`Pembayaran Meja ${selectedPOSTable.name} (${selectedPOSTable.customerName}) LUNAS via ${posPayMethod.toUpperCase()}! Struk Terposting ke Hfe REST API (${hfeCompanyProfile.ptLegalName}).`)
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
      
      {/* INJECT DYNAMIC CUSTOMER STYLESHEET CSS VARIABLES */}
      <style>{`
        :root {
          --brand-primary: ${activeTheme.primaryAccentHex};
          --brand-primary-hover: ${activeTheme.primaryAccentHoverHex};
          --brand-bg: ${activeTheme.pageBgHex};
          --brand-card-bg: ${activeTheme.cardBgHex};
          --brand-header-bg: ${activeTheme.headerBgHex};
          --brand-text: ${activeTheme.textColorHex};
          --brand-secondary-text: ${activeTheme.secondaryTextColorHex};
          --brand-badge-bg: ${activeTheme.highlightBadgeBgHex};
          --brand-badge-text: ${activeTheme.highlightBadgeTextHex};
          --brand-radius: ${activeTheme.borderRadiusPx}px;
          --brand-font: ${activeTheme.fontFamily};
        }
        .theme-customer-container {
          background-color: var(--brand-bg) !important;
          color: var(--brand-text) !important;
          font-family: var(--brand-font) !important;
        }
        .theme-customer-header {
          background-color: var(--brand-header-bg) !important;
          border-radius: 0 0 var(--brand-radius) var(--brand-radius) !important;
        }
        .theme-customer-card {
          background-color: var(--brand-card-bg) !important;
          border-radius: var(--brand-radius) !important;
        }
        .theme-customer-btn-primary {
          background-color: var(--brand-primary) !important;
          color: #020617 !important;
          border-radius: calc(var(--brand-radius) * 0.75) !important;
        }
        .theme-customer-btn-primary:hover {
          background-color: var(--brand-primary-hover) !important;
        }
        .theme-customer-badge {
          background-color: var(--brand-badge-bg) !important;
          color: var(--brand-badge-text) !important;
        }
        ${activeTheme.customCssOverrides || ''}
      `}</style>

      {/* --- TOP GLOBAL DOMAIN NAVIGATOR BAR (3 SEPARATED WEBSITES) --- */}
      <DomainNavigator
        activeApp={activeApp}
        cafeUsername={cafeUsername}
        onSwitchDomain={switchDomainApp}
      />

      {/* --- APPLICATION ROUTE 3: OFFICIAL CAFE & RESTO BRAND LANDING PAGE --- */}
      {activeApp === 'landing' && (
        <LandingPageView
          hfeCompanyProfile={hfeCompanyProfile}
          productCatalog={PRODUCT_CATALOG}
          onOpenReservationModal={() => setShowReservationModal(true)}
          onSwitchToCustomerApp={() => switchDomainApp('customer')}
        />
      )}

      {/* --- APPLICATION ROUTE 1: CUSTOMER MOBILE QR WEB APP --- */}
      {activeApp === 'customer' && (
        <div className="flex-1 flex flex-col theme-customer-container">
          
          {/* STICKY MICRO-COMPACT INTEGRATED BRANDING & NAVIGATION CONTAINER (LOCKED QR TABLE & SEAT) */}
          <header className="border-b border-slate-800/90 backdrop-blur-md sticky top-0 z-40 px-3 py-2 flex flex-col gap-2 shadow-2xl theme-customer-header">
            
            {/* ROW 1: CAFE BRANDING LOGO & LOCKED QR TABLE BADGE */}
            <div className="flex items-center justify-between gap-2">
              
              {/* BRANDING CAFE LOGO & PROFIL PT */}
              <div className="flex items-center gap-2">
                {hfeCompanyProfile.logoUrl ? (
                  <img 
                    src={hfeCompanyProfile.logoUrl} 
                    alt={hfeCompanyProfile.brandName} 
                    className="w-7 h-7 rounded-lg object-cover border border-amber-500/50 shadow"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg theme-customer-btn-primary flex items-center justify-center font-black text-xs shadow-md">
                    <Coffee className="w-4 h-4 text-slate-950" />
                  </div>
                )}
                <div>
                  <h1 className="font-bold text-xs sm:text-sm text-white tracking-tight leading-none">
                    {hfeCompanyProfile.brandName}
                  </h1>
                  <p className="text-[9px] text-slate-400 mt-0.5 font-medium flex items-center gap-1">
                    <Building className="w-2.5 h-2.5 text-amber-500" /> {hfeCompanyProfile.ptLegalName}
                  </p>
                </div>
              </div>

              {/* LOCKED TABLE BADGE (NO MANUAL SELECTOR FOR USER) & PROFILE BUTTON */}
              <div className="flex items-center gap-1.5">
                {/* LOCKED TABLE PILL BADGE FROM PHYSICAL QR SCAN */}
                <div 
                  onClick={() => alert(`🔒 Nomor Meja ${selectedTable} (${scannedSeat}) Terkunci dari Scan QR Fisik Meja. Untuk pindah meja, silakan minta Staf/Waitress Kafe melalui Kasir.`)}
                  className="flex items-center gap-1 theme-customer-badge px-2.5 py-1 rounded-lg text-[11px] font-bold border border-amber-500/30 cursor-pointer shadow-sm"
                  title="Nomor Meja Terkunci dari Scan QR Meja"
                >
                  <LockIcon className="w-3 h-3" style={{ color: activeTheme.primaryAccentHex }} />
                  <span className="font-mono text-xs text-amber-300 font-extrabold">{selectedTable}</span>
                  <span className="text-[9px] font-mono text-amber-400/80">({scannedSeat})</span>
                </div>

                {/* RESERVATION BUTTON */}
                <button
                  onClick={() => setShowReservationModal(true)}
                  className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-[10px] px-2 py-1 rounded-lg shadow flex items-center gap-1 transition-all"
                  title="Reservasi Slot Meja Cafe"
                >
                  <Calendar className="w-3 h-3 text-white" />
                  <span>Reservasi</span>
                </button>

                {/* COMPACT SAVED PROFILE BADGE */}
                {isCustomerSessionActive ? (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center gap-1 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 px-2 py-1 rounded-lg text-[10px] font-bold text-slate-200 transition-all"
                  >
                    <UserCheck className="w-3 h-3 text-emerald-400" />
                    <span className="max-w-[70px] truncate">{loginType === 'phone' ? customerPhone : guestName}</span>
                    {loginType === 'phone' && <span className="font-mono" style={{ color: activeTheme.primaryAccentHex }}>({loyaltyPoints}p)</span>}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="theme-customer-btn-primary font-bold text-[10px] px-2 py-1 rounded-lg shadow"
                  >
                    Masuk
                  </button>
                )}
              </div>
            </div>

            {/* ROW 2: INTEGRATED CATEGORY NAVIGATOR PILLS (SINGLE ELEMENT CONTINUOUS SCROLL) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-0.5 pb-0.5 no-scrollbar">
              {[
                { id: 'Coffee', icon: '☕', name: 'Coffee' },
                { id: 'Non-Coffee', icon: '🍵', name: 'Non-Coffee' },
                { id: 'Pastry', icon: '🥐', name: 'Pastry' },
                { id: 'Snack', icon: '🍟', name: 'Snack' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategorySection(cat.id)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap bg-slate-950/90 text-slate-300 hover:text-slate-950 border border-slate-800 transition-all shadow-sm"
                  style={{ borderRadius: `${Math.min(activeTheme.borderRadiusPx, 12)}px` }}
                >
                  <span className="text-xs">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

          </header>

          <main className="flex-1 max-w-md w-full mx-auto p-3 sm:p-4 flex flex-col gap-4 pb-28">
            {/* STEP 1: KATALOG MENU VIEW */}
            {qrStepView === 'catalog' && (
              <>
                {/* LANDING PAGE TABLE RESERVATION BANNER */}
                <div className="bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-2xl p-4 flex flex-col gap-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
                        📅
                      </span>
                      <div>
                        <h3 className="text-xs font-bold text-white tracking-tight">Reservasi Slot Meja Cafe & VIP Room</h3>
                        <p className="text-[10px] text-slate-400">Jamin slot tempat duduk untuk acara dinner / meeting</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30 uppercase">
                      {reservationPolicyMode === 'instant' ? '⚡ INSTANT BOOK' : '⏳ CONFIRMATION'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-[10px] text-slate-300">
                    <span className="bg-slate-950/80 px-2 py-1 rounded border border-slate-800 flex items-center justify-center gap-1">🍃 Outdoor</span>
                    <span className="bg-slate-950/80 px-2 py-1 rounded border border-slate-800 flex items-center justify-center gap-1">❄️ VIP AC</span>
                    <span className="bg-slate-950/80 px-2 py-1 rounded border border-slate-800 flex items-center justify-center gap-1">🅿️ Free Valet</span>
                  </div>

                  <button
                    onClick={() => setShowReservationModal(true)}
                    className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs py-2.5 rounded-xl shadow flex items-center justify-center gap-2 transition-all"
                  >
                    <CalendarCheck className="w-4 h-4 text-white" /> Pilih Slot Jam & Reservasi Meja ➔
                  </button>
                </div>

                {/* CONTINUOUS SMOOTH SCROLL CATALOG SECTIONS */}
                <div className="flex flex-col gap-6 pt-1">
                  
                  {/* SECTION 1: COFFEE SHOWCASE */}
                  <div ref={coffeeSecRef} className="flex flex-col gap-3 scroll-mt-28">
                    <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border-l-4 px-3.5 py-2 rounded-r-xl flex items-center justify-between" style={{ borderColor: activeTheme.primaryAccentHex }}>
                      <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2" style={{ color: activeTheme.primaryAccentHex }}>
                        <Coffee className="w-4 h-4" style={{ color: activeTheme.primaryAccentHex }} /> ☕ ETALASE KOPI SPECIALTY & ESPRESSO
                      </h3>
                      <span className="text-[10px] font-mono font-bold">3 Items</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {PRODUCT_CATALOG.filter(p => p.category === 'Coffee').map(item => (
                        <div key={item.id} className="theme-customer-card border border-slate-800/80 p-3 flex gap-3 hover:border-slate-700 transition-all shadow-lg">
                          <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover border border-slate-800" />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-sm text-slate-100">{item.name}</h4>
                                {priceVisibilityMode === 'show_prices' ? (
                                  <span className="text-xs font-bold font-mono" style={{ color: activeTheme.primaryAccentHex }}>Rp {item.price.toLocaleString('id-ID')}</span>
                                ) : (
                                  <span className="text-[10px] font-bold text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">🏷️ Kontak Barista</span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.description}</p>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-2">
                              {customerAppDisplayMode === 'full_ordering' ? (
                                <>
                                  <button onClick={() => handleReorderSameItem(item)} className="bg-slate-950/80 hover:bg-slate-800 text-slate-300 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-slate-800">
                                    <RotateCcw className="w-3 h-3 text-slate-400" /> Re-Order
                                  </button>
                                  <button onClick={() => handleAddToCart(item)} className="theme-customer-btn-primary text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md">
                                    <Plus className="w-3.5 h-3.5" /> Tambah
                                  </button>
                                </>
                              ) : (
                                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 font-bold">
                                  📖 Buku Menu (View Only)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 2: NON-COFFEE SHOWCASE */}
                  <div ref={nonCoffeeSecRef} className="flex flex-col gap-3 scroll-mt-28">
                    <div className="bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent border-l-4 border-emerald-500 px-3.5 py-2 rounded-r-xl flex items-center justify-between">
                      <h3 className="text-xs sm:text-sm font-black text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-500" /> 🍵 ETALASE NON-COFFEE & ARTISAN MATCHA
                      </h3>
                      <span className="text-[10px] font-mono font-bold text-emerald-400/80">1 Item</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {PRODUCT_CATALOG.filter(p => p.category === 'Non-Coffee').map(item => (
                        <div key={item.id} className="theme-customer-card border border-slate-800/80 p-3 flex gap-3 hover:border-slate-700 transition-all shadow-lg">
                          <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover border border-slate-800" />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-sm text-slate-100">{item.name}</h4>
                                {priceVisibilityMode === 'show_prices' ? (
                                  <span className="text-xs font-bold font-mono" style={{ color: activeTheme.primaryAccentHex }}>Rp {item.price.toLocaleString('id-ID')}</span>
                                ) : (
                                  <span className="text-[10px] font-bold text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">🏷️ Kontak Barista</span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.description}</p>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-2">
                              {customerAppDisplayMode === 'full_ordering' ? (
                                <>
                                  <button onClick={() => handleReorderSameItem(item)} className="bg-slate-950/80 hover:bg-slate-800 text-slate-300 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-slate-800">
                                    <RotateCcw className="w-3 h-3 text-slate-400" /> Re-Order
                                  </button>
                                  <button onClick={() => handleAddToCart(item)} className="theme-customer-btn-primary text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md">
                                    <Plus className="w-3.5 h-3.5" /> Tambah
                                  </button>
                                </>
                              ) : (
                                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 font-bold">
                                  📖 Buku Menu (View Only)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 3: PASTRY & BAKERY SHOWCASE */}
                  <div ref={pastrySecRef} className="flex flex-col gap-3 scroll-mt-28">
                    <div className="bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-transparent border-l-4 border-orange-500 px-3.5 py-2 rounded-r-xl flex items-center justify-between">
                      <h3 className="text-xs sm:text-sm font-black text-orange-300 uppercase tracking-wider flex items-center gap-2">
                        <UtensilsCrossed className="w-4 h-4 text-orange-500" /> 🥐 ETALASE PASTRY & WARM BAKERY
                      </h3>
                      <span className="text-[10px] font-mono font-bold text-orange-400/80">1 Item</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {PRODUCT_CATALOG.filter(p => p.category === 'Pastry').map(item => (
                        <div key={item.id} className="theme-customer-card border border-slate-800/80 p-3 flex gap-3 hover:border-slate-700 transition-all shadow-lg">
                          <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover border border-slate-800" />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-sm text-slate-100">{item.name}</h4>
                                {priceVisibilityMode === 'show_prices' ? (
                                  <span className="text-xs font-bold font-mono" style={{ color: activeTheme.primaryAccentHex }}>Rp {item.price.toLocaleString('id-ID')}</span>
                                ) : (
                                  <span className="text-[10px] font-bold text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">🏷️ Kontak Barista</span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.description}</p>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-2">
                              {customerAppDisplayMode === 'full_ordering' ? (
                                <>
                                  <button onClick={() => handleReorderSameItem(item)} className="bg-slate-950/80 hover:bg-slate-800 text-slate-300 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-slate-800">
                                    <RotateCcw className="w-3 h-3 text-slate-400" /> Re-Order
                                  </button>
                                  <button onClick={() => handleAddToCart(item)} className="theme-customer-btn-primary text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md">
                                    <Plus className="w-3.5 h-3.5" /> Tambah
                                  </button>
                                </>
                              ) : (
                                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 font-bold">
                                  📖 Buku Menu (View Only)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 4: SNACK & FINGER FOODS SHOWCASE */}
                  <div ref={snackSecRef} className="flex flex-col gap-3 scroll-mt-28">
                    <div className="bg-gradient-to-r from-indigo-500/20 via-indigo-500/10 to-transparent border-l-4 border-indigo-500 px-3.5 py-2 rounded-r-xl flex items-center justify-between">
                      <h3 className="text-xs sm:text-sm font-black text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                        <Flame className="w-4 h-4 text-indigo-500" /> 🍟 ETALASE SNACK & SAVORY FINGER FOODS
                      </h3>
                      <span className="text-[10px] font-mono font-bold text-indigo-400/80">1 Item</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {PRODUCT_CATALOG.filter(p => p.category === 'Snack').map(item => (
                        <div key={item.id} className="theme-customer-card border border-slate-800/80 p-3 flex gap-3 hover:border-slate-700 transition-all shadow-lg">
                          <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover border border-slate-800" />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-sm text-slate-100">{item.name}</h4>
                                {priceVisibilityMode === 'show_prices' ? (
                                  <span className="text-xs font-bold font-mono" style={{ color: activeTheme.primaryAccentHex }}>Rp {item.price.toLocaleString('id-ID')}</span>
                                ) : (
                                  <span className="text-[10px] font-bold text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">🏷️ Kontak Barista</span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.description}</p>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-2">
                              {customerAppDisplayMode === 'full_ordering' ? (
                                <>
                                  <button onClick={() => handleReorderSameItem(item)} className="bg-slate-950/80 hover:bg-slate-800 text-slate-300 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-slate-800">
                                    <RotateCcw className="w-3 h-3 text-slate-400" /> Re-Order
                                  </button>
                                  <button onClick={() => handleAddToCart(item)} className="theme-customer-btn-primary text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md">
                                    <Plus className="w-3.5 h-3.5" /> Tambah
                                  </button>
                                </>
                              ) : (
                                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 font-bold">
                                  📖 Buku Menu (View Only)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* FOOTER PT ENTITY PROFIL BRANDING */}
                <div className="pt-6 border-t border-slate-800/60 text-center flex flex-col gap-1 text-[11px] text-slate-500">
                  <p className="font-bold text-slate-400 flex items-center justify-center gap-1">
                    <Building className="w-3 h-3 text-amber-500" /> {hfeCompanyProfile.ptLegalName}
                  </p>
                  <p className="font-mono text-[10px]">NPWP: {hfeCompanyProfile.taxIdNpwp} • {hfeCompanyProfile.address}</p>
                  <p className="text-[9px] text-slate-600 mt-1">Powered by Headless Company Books (HFE) Core Engine</p>
                </div>

                {/* STICKY FLOATING BOTTOM CART BAR -> NAVIGATE TO DEDICATED CHECKOUT VIEW */}
                {cart.length > 0 && customerAppDisplayMode === 'full_ordering' && (
                  <div 
                    onClick={() => setQrStepView('checkout')}
                    className="fixed bottom-4 inset-x-3 max-w-md mx-auto z-40 theme-customer-btn-primary rounded-2xl p-3.5 shadow-2xl flex items-center justify-between font-bold cursor-pointer border transition-all transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center font-mono font-black text-xs relative">
                        <ShoppingCart className="w-4 h-4" style={{ color: activeTheme.primaryAccentHex }} />
                        <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                          {totalCartCount}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-900 tracking-wider">Keranjang Meja ({totalCartCount} Items)</span>
                        <h4 className="text-sm font-black font-mono">Rp {grandTotalBill.toLocaleString('id-ID')}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-black bg-slate-950 text-white px-3 py-1.5 rounded-xl">
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
                <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
                  <button
                    onClick={() => setQrStepView('catalog')}
                    className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800"
                  >
                    <ArrowLeft className="w-4 h-4" /> Kembali Tambah Menu
                  </button>
                  <span className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1">
                    <LockIcon className="w-3 h-3 text-amber-500" /> {selectedTable} ({scannedSeat})
                  </span>
                </div>

                {/* Dedicated Checkout Container */}
                <div className="theme-customer-card border border-slate-800 rounded-2xl p-4 flex flex-col gap-4 shadow-2xl">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
                    <ShoppingBag className="w-5 h-5 text-amber-500" /> Ringkasan Pesanan & Pelunasan Meja
                  </h3>

                  {/* Items Breakdown */}
                  <div className="flex flex-col gap-2.5 divide-y divide-slate-800/80">
                    {cart.map((item, idx) => (
                      <div key={idx} className="pt-2.5 first:pt-0 flex flex-col gap-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="font-bold text-white text-sm">{item.name}</p>
                              {item.seatNumber && (
                                <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/30">
                                  {item.seatNumber}
                                </span>
                              )}
                              {item.seatCustomerContact && (
                                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                                  <Contact className="w-3 h-3 text-emerald-400" /> {item.seatCustomerContact.name} ({item.seatCustomerContact.savedPreferences})
                                </span>
                              )}
                            </div>
                            
                            {item.temperature && (
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {item.temperature} • Sugar {item.sugarLevel} • {item.milkOption}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleUpdateQty(idx, -1)}
                              className="w-7 h-7 bg-slate-950/80 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-800"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-bold font-mono text-slate-100 w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => handleUpdateQty(idx, 1)}
                              className="w-7 h-7 bg-slate-950/80 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-800"
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
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
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
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 mt-1">
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
                      <span className="font-mono text-lg" style={{ color: activeTheme.primaryAccentHex }}>Rp {grandTotalBill.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {/* Submit Order Button */}
                  <button
                    onClick={handleSubmitOrder}
                    className="w-full theme-customer-btn-primary font-bold text-sm py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 mt-2"
                  >
                    {paymentPolicy === 'pay-first' ? (
                      <> <CreditCard className="w-5 h-5 text-slate-950" /> Bayar QRIS Sekarang (Rp {grandTotalBill.toLocaleString('id-ID')}) </>
                    ) : (
                      <> <CheckCircle2 className="w-5 h-5 text-slate-950" /> Konfirmasi Open Tab Meja </>
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
                  
                  {/* ADMIN REASSIGN TABLE BUTTON */}
                  <button
                    onClick={() => setShowTableReassignModal(true)}
                    className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 border border-indigo-500/40 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow transition-all"
                  >
                    <ArrowRightLeft className="w-4 h-4 text-indigo-400" /> 🔀 Reassign / Pindah Meja (Admin)
                  </button>
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
                  <h3 className="text-xs font-bold text-slate-200 flex items-center justify-between">
                    <span className="flex items-center gap-2"><Coffee className="w-4 h-4 text-indigo-400" /> Katalog Kasir Touchscreen (Pesanan Walk-In / Takeaway)</span>
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-bold">MODE STAF: SHOW SKU CODES</span>
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
                        className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left p-2.5 rounded-xl flex flex-col justify-between h-24 transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                              {item.id}
                            </span>
                            <span className="text-[9px] font-mono text-indigo-400">{item.hfeCategoryCode}</span>
                          </div>
                          <span className="font-bold text-xs text-slate-200 line-clamp-1 mt-1">{item.name}</span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-emerald-400">Rp {item.price.toLocaleString('id-ID')}</span>
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
              
              {/* STATION FILTER HEADER */}
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

              {/* KDS CONTROLS: 3 VIEW MODES SWITCHER */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-indigo-400 font-mono">Station Aktif: {currentStation.name}</span>
                  <p className="text-[11px] sm:text-xs text-slate-400">Pilih Mode Tampilan Layar Dapur & Barista</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setKdsViewMode('workorder')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                        kdsViewMode === 'workorder' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400'
                      }`}
                    >
                      <ClipboardList className="w-3.5 h-3.5" /> Mode Work Order (BOM & SOP)
                    </button>

                    <button
                      onClick={() => setKdsViewMode('kanban')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                        kdsViewMode === 'kanban' ? 'bg-indigo-500 text-white font-bold shadow' : 'text-slate-400'
                      }`}
                    >
                      <Kanban className="w-3.5 h-3.5" /> Kanban
                    </button>

                    <button
                      onClick={() => setKdsViewMode('list')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                        kdsViewMode === 'list' ? 'bg-indigo-500 text-white font-bold shadow' : 'text-slate-400'
                      }`}
                    >
                      <List className="w-3.5 h-3.5" /> List
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800">
                    <SlidersHorizontal className="w-3 h-3 text-indigo-400" />
                    <select
                      value={kdsSortBy}
                      onChange={(e) => setKdsSortBy(e.target.value as any)}
                      className="bg-transparent text-indigo-400 font-bold focus:outline-none text-xs"
                    >
                      <option value="time-desc">Terlama (Priority)</option>
                      <option value="time-asc">Terbaru</option>
                      <option value="category">Kategori</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* MODE 1: WORK ORDER VIEW WITH SEAT-LEVEL CONTACT PROFILING */}
              {kdsViewMode === 'workorder' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {sortedOrders.map(order => (
                    <div key={order.id} className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-sm text-amber-400">{order.id}</span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                              order.status === 'placed' 
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                : order.status === 'processing'
                                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-white mt-0.5">{order.table} • {order.customerName}</h3>
                        </div>

                        <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                          {order.createdAt} ({order.timeElapsedMinutes}m ago)
                        </span>
                      </div>

                      {/* Item Work Orders with Seat-Level Contact Binding Badges */}
                      <div className="flex flex-col gap-3">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><ClipboardList className="w-4 h-4 text-amber-500" /> Lembar Kerja Fabrikasi (Work Order):</span>
                          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">SEAT CONTACT BOUND</span>
                        </span>

                        {order.items.map((item, idx) => (
                          <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2.5">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-xs font-bold text-white flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                                    {item.id}
                                  </span>
                                  {item.quantity}x {item.name}
                                  {item.seatNumber && (
                                    <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/30">
                                      {item.seatNumber}
                                    </span>
                                  )}
                                </h4>

                                {item.seatCustomerContact && (
                                  <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 mt-0.5 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 w-fit">
                                    <Contact className="w-3 h-3 text-emerald-400" /> Tamu Ter-profil: {item.seatCustomerContact.name} ({item.seatCustomerContact.savedPreferences})
                                  </div>
                                )}

                                {item.temperature && (
                                  <p className="text-[10px] text-amber-400 font-medium mt-0.5">
                                    {item.temperature} • Sugar {item.sugarLevel} • {item.milkOption}
                                  </p>
                                )}
                              </div>
                              
                              <button
                                onClick={() => setSelectedRecipeBOM(item)}
                                className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 flex items-center gap-1"
                              >
                                <BookOpen className="w-3 h-3 text-indigo-400" /> Detail SOP
                              </button>
                            </div>

                            {/* BOM Ingredients Breakdown */}
                            {item.bomIngredients && (
                              <div className="bg-slate-900/90 border border-slate-800/90 rounded-lg p-2.5 flex flex-col gap-1.5 text-[11px]">
                                <span className="font-semibold text-slate-400 flex items-center justify-between text-[10px]">
                                  <span className="flex items-center gap-1"><Layers className="w-3 h-3 text-amber-500" /> Komposisi Bahan Baku (BOM):</span>
                                  <span className="text-[9px] font-mono text-emerald-400">Inventory Sync</span>
                                </span>
                                {item.bomIngredients.map((ing, ingIdx) => (
                                  <div key={ingIdx} className="flex items-center justify-between text-slate-300 bg-slate-950/80 px-2 py-1 rounded border border-slate-800/80">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1 rounded border border-amber-500/20">
                                        {ing.itemCode}
                                      </span>
                                      <span>{ing.name}</span>
                                    </div>
                                    <span className="font-mono font-bold text-amber-400 text-xs">{ing.amount}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Allergen Warning Note */}
                            {item.allergenNotes && (
                              <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-1 bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/20">
                                <AlertTriangle className="w-3 h-3 text-rose-500" /> Allergen Note: {item.allergenNotes}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-2 border-t border-slate-800">
                        {order.status === 'placed' && (
                          <button
                            onClick={() => handleMoveStatus(order.id, 'processing')}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2"
                          >
                            <ChefHat className="w-4 h-4" /> Mulai Kerjakan Work Order ➔
                          </button>
                        )}
                        {order.status === 'processing' && (
                          <button
                            onClick={() => handleMoveStatus(order.id, 'ready')}
                            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Selesai Kerjakan & Kirim ke Checker ➔
                          </button>
                        )}
                        {(order.status === 'ready' || order.status === 'qc-passed') && (
                          <button
                            onClick={() => alert(`Struk Work Order ${order.id} dicetak!`)}
                            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2.5 rounded-xl border border-slate-700 flex items-center justify-center gap-2"
                          >
                            <Printer className="w-4 h-4" /> Print Tiket Work Order
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* MODE 2: KANBAN BOARD */}
              {kdsViewMode === 'kanban' && (
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
                              <div key={idx} onClick={() => setSelectedRecipeBOM(item)} className="bg-slate-900/80 p-2 rounded-lg cursor-pointer flex items-center justify-between">
                                <span className="font-bold text-slate-200">{item.quantity}x {item.name}</span>
                                <span className="text-[9px] font-mono text-amber-400 font-bold">{item.id}</span>
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
                              <div key={idx} onClick={() => setSelectedRecipeBOM(item)} className="bg-slate-900/80 p-2 rounded-lg cursor-pointer flex items-center justify-between">
                                <span className="font-bold text-slate-200">{item.quantity}x {item.name}</span>
                                <span className="text-[9px] font-mono text-amber-400 font-bold">{item.id}</span>
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
              )}

              {/* MODE 3: LIST VIEW */}
              {kdsViewMode === 'list' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col gap-3 shadow-xl overflow-x-auto">
                  <div className="grid grid-cols-6 text-xs font-bold text-slate-400 border-b border-slate-800 pb-2 px-3 min-w-[600px]">
                    <span>ID Tiket</span>
                    <span>Meja / Customer</span>
                    <span>Item Pesanan</span>
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
                              [{item.id}] {item.quantity}x {item.name} <BookOpen className="w-3 h-3 text-amber-500 inline" />
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
                              onClick={() => handleMoveStatus(order.id, 'processing')}
                              className="bg-amber-500 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs"
                            >
                              Proses ➔
                            </button>
                          )}
                          {order.status === 'processing' && (
                            <button
                              onClick={() => handleMoveStatus(order.id, 'ready')}
                              className="bg-emerald-500 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs"
                            >
                              Selesai ➔
                            </button>
                          )}
                          {(order.status === 'ready' || order.status === 'qc-passed') && (
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

          {/* STAFF SURFACE 4: MODE SERVER / WAITER WITH SEAT-LEVEL CONTACT BINDING */}
          {activeStaffSurface === 'server-waiter' && (
            <main className="flex-1 p-3 sm:p-6 max-w-7xl mx-auto w-full flex flex-col gap-4 sm:gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <Footprints className="w-5 h-5 text-indigo-400" /> Mode Server (Pramusaji & Food Runner Delivery)
                  </h2>
                  <p className="text-xs text-slate-400">Pengantaran Nampan Presisi Berdasarkan Penandaan Nomor Kursi & Profil Kontak Tamu (Seat 1-4)</p>
                </div>

                <button
                  onClick={() => setShowTableReassignModal(true)}
                  className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 border border-indigo-500/40 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow"
                >
                  <ArrowRightLeft className="w-4 h-4" /> 🔀 Reassign / Pindah Meja Tamu
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {orders.filter(o => o.status === 'qc-passed').map(order => (
                  <div key={order.id} className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 flex flex-col justify-between gap-4 shadow-xl">
                    <div>
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="font-mono font-bold text-xs text-emerald-400">{order.id} • {order.table}</span>
                        <span className="text-xs font-bold text-white">{order.customerName}</span>
                      </div>

                      <div className="flex flex-col gap-2 mt-3">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rincian Antar Kursi Meja:</span>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                            <div>
                              <div className="flex items-center gap-1.5 font-bold text-white">
                                <span>{item.quantity}x {item.name}</span>
                                {item.seatNumber && (
                                  <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-400 px-1.5 py-0.2 rounded border border-indigo-500/30">
                                    {item.seatNumber}
                                  </span>
                                )}
                              </div>
                              {item.seatCustomerContact && (
                                <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                                  👤 Kontak: {item.seatCustomerContact.name} ({item.seatCustomerContact.phone})
                                </p>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-amber-400 font-bold">{item.temperature || 'Reg'}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        handleMoveStatus(order.id, 'served')
                        alert(`Pesanan Meja ${order.table} telah selesai diantar! Profil preferensi tamu diperbarui.`)
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

          {/* STAFF SURFACE 5: DEDICATED HALAMAN KONFIGURASI CAFE & BRANDING SETTINGS */}
          {activeStaffSurface === 'cafe-config' && (
            <main className="flex-1 p-3 sm:p-6 max-w-5xl mx-auto w-full flex flex-col gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">Halaman Konfigurasi Cafe & Owner Settings</h2>
                    <p className="text-xs text-slate-400">Profil PT Legal Entity, HFE REST API, Stylesheet Customizer, Pajak PB1, & Service Charge</p>
                  </div>
                </div>
                <button 
                  onClick={handlePushHfeCompanyProfile}
                  className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <Check className="w-4 h-4" /> Push & Simpan Seluruh Konfigurasi
                </button>
              </div>

              {/* CARD 1: HFE COMPANY / PROFIL PT LEGAL ENTITY REST API INTEGRATION */}
              <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                        <Building className="w-4 h-4 text-indigo-400" /> Profil PT & HFE Core Ledger REST API Connection
                      </h3>
                      <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                        <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> LIVE HFE SYNCED
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Identitas Legal PT, Logo Outlet, NPWP Pajak E-Faktur, & Endpoint HFE Book ID: <span className="font-mono text-indigo-300 font-bold">{hfeCompanyProfile.companyBookId}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleFetchHfeCompanyProfile}
                      className="bg-slate-950 hover:bg-slate-800 text-indigo-400 border border-indigo-500/30 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow"
                    >
                      <RefreshCw className="w-4 h-4 text-indigo-400" /> Sync Ulang dari REST API
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* PT LEGAL ENTITY NAME */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Nama Badan Hukum (Profil PT Official):
                    </label>
                    <input
                      type="text"
                      value={hfeCompanyProfile.ptLegalName}
                      onChange={(e) => setHfeCompanyProfile(prev => ({ ...prev, ptLegalName: e.target.value }))}
                      className="bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3.5 py-2.5 font-bold focus:outline-none focus:border-indigo-500"
                      placeholder="cth: PT Kopi Karya Nusantara"
                    />
                  </div>

                  {/* TRADING BRAND NAME */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                      <Store className="w-3.5 h-3.5 text-amber-500" /> Nama Branding Outlet Kafe:
                    </label>
                    <input
                      type="text"
                      value={hfeCompanyProfile.brandName}
                      onChange={(e) => setHfeCompanyProfile(prev => ({ ...prev, brandName: e.target.value }))}
                      className="bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3.5 py-2.5 font-bold focus:outline-none focus:border-indigo-500"
                      placeholder="cth: Kopitiam Senopati & Roastery"
                    />
                  </div>

                  {/* CAFE LOGO URL */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-indigo-400" /> URL Logo Outlet Kafe:
                    </label>
                    <input
                      type="text"
                      value={hfeCompanyProfile.logoUrl}
                      onChange={(e) => setHfeCompanyProfile(prev => ({ ...prev, logoUrl: e.target.value }))}
                      className="bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3.5 py-2.5 font-mono focus:outline-none focus:border-indigo-500"
                      placeholder="https://..."
                    />
                  </div>

                  {/* NPWP TAX ID */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-400" /> NPWP Badan Pajak (E-Faktur DJP):
                    </label>
                    <input
                      type="text"
                      value={hfeCompanyProfile.taxIdNpwp}
                      onChange={(e) => setHfeCompanyProfile(prev => ({ ...prev, taxIdNpwp: e.target.value }))}
                      className="bg-slate-950 border border-slate-800 text-emerald-400 text-xs rounded-xl px-3.5 py-2.5 font-mono focus:outline-none focus:border-indigo-500"
                      placeholder="01.234.567.8-012.000"
                    />
                  </div>
                </div>

                {/* HFE REST API CONNECTION FOOTER */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-400" />
                    <span className="text-slate-400">Endpoint HFE REST API:</span>
                    <span className="font-mono text-indigo-300 font-bold">{hfeCompanyProfile.hfeLedgerApiEndpoint}</span>
                  </div>
                  <button
                    onClick={handlePushHfeCompanyProfile}
                    className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow flex items-center gap-1.5 w-full sm:w-auto justify-center"
                  >
                    <Check className="w-3.5 h-3.5" /> Push & Sync ke HFE Core
                  </button>
                </div>
              </div>

              {/* CARD 1.5: HFE MULTI-BRANCH ENGINE CONFIGURATION (3 TREATMENT MODES) */}
              <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-indigo-400" /> Konfigurasi Multi-Branch / Multi-Outlet HFE Engine
                      </h3>
                      <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30 uppercase">
                        MODE: {hfeBranchMode}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Pilih treatment akuntansi pencatatan cabang: <b className="text-white">Dimensional Tagging</b>, <b className="text-white">Multi-Book Hierarchy</b>, atau <b className="text-white">Sub-Account COA</b>.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                    <Store className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-xs text-slate-400 font-semibold">Cabang Aktif:</span>
                    <select
                      value={activeBranchId}
                      onChange={(e) => setActiveBranchId(e.target.value)}
                      className="bg-transparent text-indigo-300 font-mono font-bold text-xs focus:outline-none"
                    >
                      {outletBranches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3 BRANCH TREATMENT MODE CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* MODE 1: DIMENSIONAL */}
                  <div
                    onClick={() => setHfeBranchMode('dimensional')}
                    className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-2 cursor-pointer transition-all ${
                      hfeBranchMode === 'dimensional'
                        ? 'bg-indigo-500/20 border-indigo-500 ring-1 ring-indigo-500'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">Opsi 1 (Default F&B)</span>
                        {hfeBranchMode === 'dimensional' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                      </div>
                      <h4 className="font-bold text-xs text-white mt-1">Dimensional Tagging</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                        1 CompanyBook PT Utama. Setiap transaksi diberi tag <code className="text-amber-400">branch_id</code>. Konsolidasi P&L real-time instan.
                      </p>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold w-fit">
                      RECOMMENDED UMKM & F&B
                    </span>
                  </div>

                  {/* MODE 2: MULTI-BOOK HIERARCHY */}
                  <div
                    onClick={() => setHfeBranchMode('multi_book')}
                    className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-2 cursor-pointer transition-all ${
                      hfeBranchMode === 'multi_book'
                        ? 'bg-indigo-500/20 border-indigo-500 ring-1 ring-indigo-500'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">Opsi 2 (Holding/Franchise)</span>
                        {hfeBranchMode === 'multi_book' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                      </div>
                      <h4 className="font-bold text-xs text-white mt-1">Multi-Book Hierarchy</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                        Setiap outlet punya <code className="text-indigo-300">CompanyBook</code> terpisah. HFE Consolidation Engine memproses agregasi ke HQ.
                      </p>
                    </div>
                    <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-bold w-fit">
                      ENTERPRISE & FRANCHISE
                    </span>
                  </div>

                  {/* MODE 3: SUB-ACCOUNT COA */}
                  <div
                    onClick={() => setHfeBranchMode('sub_account')}
                    className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-2 cursor-pointer transition-all ${
                      hfeBranchMode === 'sub_account'
                        ? 'bg-indigo-500/20 border-indigo-500 ring-1 ring-indigo-500'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">Opsi 3 (Strict COA)</span>
                        {hfeBranchMode === 'sub_account' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                      </div>
                      <h4 className="font-bold text-xs text-white mt-1">Sub-Account COA</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                        Transaksi langsung memposting ke Sub-Akun COA spesifik cabang (<code className="text-amber-400">1010-01 Kas Senopati</code>).
                      </p>
                    </div>
                    <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold w-fit">
                      AUDIT PHYSICAL CASH/INV
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Cabang Terpilih:</span>
                    <span className="font-bold text-white">{outletBranches.find(b => b.id === activeBranchId)?.name}</span>
                    <span className="font-mono text-amber-400 font-bold text-[11px]">({activeBranchId})</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400">Gudang BOM: {outletBranches.find(b => b.id === activeBranchId)?.warehouse}</span>
                </div>
              </div>

              {/* CARD 1.7: TABLE RESERVATION ENGINE POLICY & DP SETTINGS */}
              <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                        <CalendarCheck className="w-4 h-4 text-indigo-400" /> Kebijakan Reservasi Meja & Down Payment (DP Commitment)
                      </h3>
                      <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30 uppercase">
                        {reservationPolicyMode === 'instant' ? '⚡ INSTANT' : '⏳ MANUAL REVIEW'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Atur persetujuan reservasi meja (Otomatis vs Manual Review) dan nominal DP jaminan tempat.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* APPROVAL POLICY SWITCHER */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">Kebijakan Persetujuan Reservasi:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setReservationPolicyMode('manual_review')}
                        className={`p-2.5 rounded-xl text-xs font-bold border text-left flex flex-col gap-0.5 transition-all ${
                          reservationPolicyMode === 'manual_review'
                            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>⏳ Perlu Konfirmasi Admin</span>
                        <span className="text-[9px] font-normal text-slate-400">Kasir/Admin harus klik Approve dulu</span>
                      </button>

                      <button
                        onClick={() => setReservationPolicyMode('instant')}
                        className={`p-2.5 rounded-xl text-xs font-bold border text-left flex flex-col gap-0.5 transition-all ${
                          reservationPolicyMode === 'instant'
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>⚡ Instant Reserve</span>
                        <span className="text-[9px] font-normal text-slate-400">Langsung auto-confirm slot meja</span>
                      </button>
                    </div>
                  </div>

                  {/* DP COMMITMENT CONFIG */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">Nominal Down Payment (DP Commitment Opsional):</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDpRequiredMode(!dpRequiredMode)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                          dpRequiredMode ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        {dpRequiredMode ? '✓ Wajib DP' : 'Tanpa DP'}
                      </button>

                      {dpRequiredMode && (
                        <select
                          value={dpAmountConfig}
                          onChange={(e) => setDpAmountConfig(Number(e.target.value))}
                          className="flex-1 bg-slate-950 border border-slate-800 text-amber-400 font-mono font-bold text-xs rounded-xl p-2 focus:outline-none focus:border-indigo-500"
                        >
                          <option value={25000}>Rp 25.000 / Reservasi</option>
                          <option value={50000}>Rp 50.000 / Reservasi</option>
                          <option value={100000}>Rp 100.000 / Reservasi</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>

                {/* RESERVATION LIST TABLE FOR STAFF / OWNER MANAGER */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <CalendarCheck className="w-4 h-4 text-indigo-400" /> Daftar Permohonan Reservasi Meja ({reservations.length})
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                      {reservations.filter(r => r.status === 'pending').length} Pending
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {reservations.map(res => (
                      <div key={res.id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-amber-400">{res.id}</span>
                            <h4 className="font-bold text-white text-sm">{res.customerName} ({res.phone})</h4>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                              res.status === 'confirmed'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : res.status === 'pending'
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                            }`}>
                              {res.status}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-1">
                            <span>📅 {res.reservationDate} @ {res.timeSlot}</span>
                            <span>📍 {res.tableArea} ({res.paxCount} Pax)</span>
                            {res.dpAmount > 0 && (
                              <span className="text-emerald-400 font-mono font-bold">DP: Rp {res.dpAmount.toLocaleString('id-ID')} (QRIS Paid)</span>
                            )}
                          </div>

                          {res.specialNotes && (
                            <p className="text-[10px] text-slate-400 italic mt-0.5">Catatan: "{res.specialNotes}"</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          {res.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveReservation(res.id)}
                                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg shadow"
                              >
                                ✓ Approve
                              </button>
                              <button
                                onClick={() => handleRejectReservation(res.id)}
                                className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 font-bold text-xs px-3 py-1.5 rounded-lg"
                              >
                                ❌ Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CARD 1.8: OPERATIONAL FLOWS, RESERVATION ORDER MODE & PRICE VISIBILITY CONFIG */}
              <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" /> Mode Operasional Aplikasi Pelanggan, Order Reservasi & Visibilitas Harga
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Konfigurasi alur pemesanan reservasi, apakah pelanggan bisa pesan langsung / hanya lihat katalog, dan sembunyikan harga.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 1. FLOW RESERVASI MEJA & ORDER */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
                    <label className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CalendarCheck className="w-3.5 h-3.5 text-indigo-400" /> Flow Order Reservasi Meja:
                    </label>
                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => setReservationOrderMode('table_only')}
                        className={`px-3 py-2 rounded-lg text-xs font-bold border text-left flex items-center justify-between transition-all ${
                          reservationOrderMode === 'table_only' ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>🪑 Reservasi Meja Saja</span>
                        {reservationOrderMode === 'table_only' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </button>

                      <button
                        onClick={() => setReservationOrderMode('optional_order')}
                        className={`px-3 py-2 rounded-lg text-xs font-bold border text-left flex items-center justify-between transition-all ${
                          reservationOrderMode === 'optional_order' ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>☕ Meja + Pre-Order (Opsional)</span>
                        {reservationOrderMode === 'optional_order' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </button>

                      <button
                        onClick={() => setReservationOrderMode('mandatory_order')}
                        className={`px-3 py-2 rounded-lg text-xs font-bold border text-left flex items-center justify-between transition-all ${
                          reservationOrderMode === 'mandatory_order' ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>⚠️ Wajib Pre-Order Menu</span>
                        {reservationOrderMode === 'mandatory_order' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </button>
                    </div>
                  </div>

                  {/* 2. MODE APLIKASI PELANGGAN (ORDER VS CATALOG ONLY) */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
                    <label className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> Mode Aplikasi Pelanggan:
                    </label>
                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => setCustomerAppDisplayMode('full_ordering')}
                        className={`px-3 py-2 rounded-lg text-xs font-bold border text-left flex items-center justify-between transition-all ${
                          customerAppDisplayMode === 'full_ordering' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>🛍️ Full Ordering (Order Active)</span>
                        {customerAppDisplayMode === 'full_ordering' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>

                      <button
                        onClick={() => setCustomerAppDisplayMode('catalog_only')}
                        className={`px-3 py-2 rounded-lg text-xs font-bold border text-left flex items-center justify-between transition-all ${
                          customerAppDisplayMode === 'catalog_only' ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>📖 Katalog Digital (View Only)</span>
                        {customerAppDisplayMode === 'catalog_only' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </button>
                    </div>
                  </div>

                  {/* 3. VISIBILITAS HARGA MENU */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
                    <label className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-400" /> Visibilitas Harga Menu (Rp):
                    </label>
                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => setPriceVisibilityMode('show_prices')}
                        className={`px-3 py-2 rounded-lg text-xs font-bold border text-left flex items-center justify-between transition-all ${
                          priceVisibilityMode === 'show_prices' ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>🏷️ Tampilkan Harga (Rp)</span>
                        {priceVisibilityMode === 'show_prices' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </button>

                      <button
                        onClick={() => setPriceVisibilityMode('hide_prices')}
                        className={`px-3 py-2 rounded-lg text-xs font-bold border text-left flex flex-col transition-all ${
                          priceVisibilityMode === 'hide_prices' ? 'bg-rose-500/20 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>🙈 Sembunyikan Harga</span>
                          {priceVisibilityMode === 'hide_prices' && <Check className="w-3.5 h-3.5 text-rose-400" />}
                        </div>
                        <span className="text-[9px] text-slate-400 font-normal mt-0.5">Cocok untuk Buku Menu Eksklusif / Fine Dining</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: THEME STYLESHEET CUSTOMIZER ENGINE (AI EXPORT & IMPORT) */}
              <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                      <Palette className="w-4 h-4 text-amber-500" /> Stylesheet Theme Manager & AI Theme Customizer Engine
                    </h3>
                    <p className="text-xs text-slate-400">Kustomisasi warna, font, border, & tema tanpa mengubah struktur layout. Mudah di-edit dengan AI!</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* EXPORT BUTTON */}
                    <button
                      onClick={handleExportThemeFile}
                      className="bg-slate-950 hover:bg-slate-800 text-amber-400 border border-amber-500/30 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow"
                    >
                      <Download className="w-4 h-4 text-amber-500" /> Export Stylesheet (.json)
                    </button>

                    {/* IMPORT BUTTON */}
                    <label className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow">
                      <Upload className="w-4 h-4 text-slate-950" /> Import File
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".json"
                        onChange={handleImportThemeFile}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* BUILT-IN PRESET SELECTOR */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-300 font-semibold">Pilih Preset Tema Bawaan:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {BUILTIN_THEMES.map(t => (
                      <button
                        key={t.themeId}
                        onClick={() => setActiveTheme(t)}
                        className={`p-3 rounded-xl text-left border flex flex-col gap-1 transition-all ${
                          activeTheme.themeId === t.themeId
                            ? 'bg-amber-500/20 border-amber-500 ring-1 ring-amber-500'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.primaryAccentHex }} />
                          <span className="text-[9px] font-mono text-slate-400">{t.version}</span>
                        </div>
                        <span className="font-bold text-xs text-white line-clamp-1">{t.themeName}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI THEME PASTE CODE BOX */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Wand2 className="w-4 h-4 text-amber-500" /> AI Stylesheet Prompting Workflow:
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      Export file ➔ Minta AI ubah warna ➔ Paste di sini
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    💡 <b>Cara Kustomisasi Mudah:</b> Klik <b>Export Stylesheet</b> di atas, lalu berikan file JSON ke ChatGPT/Gemini dengan contoh perintah: 
                    <i className="text-amber-300"> "AI, ubah tema ini jadi Neon Cyberpunk Pink Gold"</i>. Setelah AI membalas, tempelkan teks JSON hasil buatan AI ke dalam kotak di bawah ini lalu klik <b>Applikasikan Tema AI</b>!
                  </p>

                  <textarea
                    rows={4}
                    value={aiStylesheetInput}
                    onChange={(e) => setAiStylesheetInput(e.target.value)}
                    placeholder='Paste Teks JSON Stylesheet Hasil Buatan AI di sini... (Contoh: {"version": "1.0", "themeId": "my-ai-theme", ...})'
                    className="bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-xs rounded-xl p-3 focus:outline-none focus:border-amber-500"
                  />

                  <button
                    onClick={handleApplyAIThemeString}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow flex items-center justify-center gap-2"
                  >
                    <Wand2 className="w-4 h-4 text-slate-950" /> Applikasikan Teks Stylesheet AI ke Layar Pelanggan ➔
                  </button>
                </div>

                {/* ACTIVE THEME STYLESHEET SUMMARY */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Tema Aktif:</span>
                    <span className="font-bold text-white">{activeTheme.themeName}</span>
                    <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: activeTheme.primaryAccentHex }} />
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                    <span>Accent: {activeTheme.primaryAccentHex}</span>
                    <span>Bg: {activeTheme.pageBgHex}</span>
                    <span>Radius: {activeTheme.borderRadiusPx}px</span>
                  </div>
                </div>
              </div>

              {/* CARD CUSTOMER PROFILING & SEAT-LEVEL PREFERENCE DATABASE */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <Contact className="w-4 h-4 text-emerald-400" /> Database Profil & Preferensi Tamu (Seat Binding CRM)
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                    {customerProfiles.length} Contacts Profiled
                  </span>
                </div>
                <p className="text-xs text-slate-400">Profil preferensi otomatis terikat saat kustomisasi item dengan penandaan nomor kursi meja:</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {customerProfiles.map((cust) => (
                    <div key={cust.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                            👤
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-white">{cust.name}</h4>
                            <p className="text-[10px] font-mono text-slate-400">{cust.phone}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {cust.loyaltyTier}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                        <div>
                          <span>Preferensi Kursi:</span>
                          <p className="font-bold text-indigo-400 font-mono">{cust.favoriteSeat}</p>
                        </div>
                        <div>
                          <span>Minuman Favorit:</span>
                          <p className="font-bold text-slate-200 truncate">{cust.favoriteDrink}</p>
                        </div>
                        <div>
                          <span>Jenis Susu Preferensi:</span>
                          <p className="font-bold text-emerald-400">{cust.preferredMilk}</p>
                        </div>
                        <div>
                          <span>Level Gula Preferensi:</span>
                          <p className="font-bold text-amber-400">{cust.preferredSugar}</p>
                        </div>
                      </div>

                      {cust.allergenAlert && (
                        <div className="text-[10px] text-rose-400 font-semibold bg-rose-500/10 p-1.5 rounded border border-rose-500/20 flex items-center gap-1 mt-1">
                          <AlertTriangle className="w-3 h-3 text-rose-500" /> Profil Alergen: {cust.allergenAlert}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD HFE PRODUCT CATEGORIES & SKU INVENTORY MATRIX */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 shadow-lg">
                <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2 border-b border-slate-800 pb-2.5">
                  <Barcode className="w-4 h-4 text-indigo-400" /> Matriks Kode Menu POS & Raw Material BOM (Inventori Kafe)
                </h3>
                <p className="text-xs text-slate-400">Kode Barang Internal Kasir & Bahan Baku BOM (Hanya Tampil di Portal Staf Kafe):</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PRODUCT_CATALOG.map((item) => (
                    <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {item.id}
                          </span>
                          <h4 className="text-xs font-bold text-white">{item.name}</h4>
                        </div>
                        <span className="text-[10px] font-mono text-indigo-400 font-semibold">{item.hfeCategoryCode}</span>
                      </div>

                      <div className="flex flex-col gap-1 text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-300 text-[10px]">Kode Bahan Baku BOM:</span>
                        {item.bomIngredients?.map((ing, ingIdx) => (
                          <div key={ingIdx} className="flex justify-between text-slate-400 font-mono text-[10px]">
                            <span>• [{ing.itemCode}] {ing.name}</span>
                            <span className="text-amber-400">{ing.amount}</span>
                          </div>
                        ))}
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
          </div>
        </div>
      )}

      {/* --- F&B TABLE OPERATIONS MODAL (PINDAH, SPLIT & JOIN MEJA) --- */}
      <TableOperationsModal
        show={showTableReassignModal}
        onClose={() => setShowTableReassignModal(false)}
        tablesGrid={tablesGrid}
        reassignFromTable={reassignFromTable}
        setReassignFromTable={setReassignFromTable}
        reassignTargetTable={reassignTargetTable}
        setReassignTargetTable={setReassignTargetTable}
        onConfirmReassign={handleConfirmTableReassign}
        onConfirmSplit={(seatNum) => {
          setSplitSelectedSeat(seatNum)
          handleConfirmTableSplit()
        }}
        onConfirmJoin={(tblA, tblB) => {
          setJoinSourceTable(tblA)
          setJoinTargetTable(tblB)
          handleConfirmTableJoin()
        }}
      />

      {/* --- DRINK MODIFIER MODAL WITH SEAT TAGGING & CUSTOMER PROFILE BINDING --- */}
      <ModifierModal
        show={!!showModifierModal}
        onClose={() => setShowModifierModal(null)}
        selectedItemForModifier={showModifierModal}
        modSeatNumber={modSeat}
        setModSeatNumber={setModSeat}
        modSeatCustomerName={modSeatCustomerName}
        setModSeatCustomerName={setModSeatCustomerName}
        modSeatCustomerPhone={modSeatCustomerPhone}
        setModSeatCustomerPhone={setModSeatCustomerPhone}
        modAllergen={modAllergen}
        setModAllergen={setModAllergen}
        modTemp={modTemp}
        setModTemp={setModTemp}
        modSugar={modSugar}
        setModSugar={setModSugar}
        modMilk={modMilk}
        setModMilk={setModMilk}
        onConfirmModifier={handleConfirmModifier}
      />

      {/* --- RECIPE BOM & PREPARATION SOP DRAWER POPUP --- */}
      <RecipeBomModal
        selectedRecipeBOM={selectedRecipeBOM}
        onClose={() => setSelectedRecipeBOM(null)}
      />

      {/* --- QRIS PAYMENT MODAL --- */}
      <QrisModal
        show={showQRISModal}
        onCompletePayment={handleCompletePayFirstQRIS}
      />

      {/* --- CUSTOMER TABLE RESERVATION BOOKING MODAL --- */}
      <ReservationModal
        show={showReservationModal}
        onClose={() => setShowReservationModal(false)}
        hfeCompanyProfile={hfeCompanyProfile}
        productCatalog={PRODUCT_CATALOG}
        resDate={resDate}
        setResDate={setResDate}
        resTimeSlot={resTimeSlot}
        setResTimeSlot={setResTimeSlot}
        resArea={resArea}
        setResArea={setResArea}
        resPax={resPax}
        setResPax={setResPax}
        resCustomerName={resCustomerName}
        setResCustomerName={setResCustomerName}
        resCustomerPhone={resCustomerPhone}
        setResCustomerPhone={setResCustomerPhone}
        resNotes={resNotes}
        setResNotes={setResNotes}
        resPayDpNow={resPayDpNow}
        setResPayDpNow={setResPayDpNow}
        dpRequiredMode={dpRequiredMode}
        dpAmountConfig={dpAmountConfig}
        reservationPolicyMode={reservationPolicyMode}
        reservationOrderMode={reservationOrderMode}
        priceVisibilityMode={priceVisibilityMode}
        resPreOrderItems={resPreOrderItems}
        setResPreOrderItems={setResPreOrderItems}
        onCreateReservation={handleCreateReservation}
      />

      {/* --- CUSTOMER PROFILE LOGIN MODAL --- */}
      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        loginType={loginType}
        setLoginType={setLoginType}
        customerPhone={customerPhone}
        setCustomerPhone={setCustomerPhone}
        guestName={guestName}
        setGuestName={setGuestName}
        loyaltyPoints={loyaltyPoints}
        isCustomerSessionActive={isCustomerSessionActive}
        onSaveLogin={handleSaveLogin}
        onClearSession={handleClearSession}
      />
    </div>
  )
}
