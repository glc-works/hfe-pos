import { CafeThemeConfig, MenuItem, TableInfo, Order, CustomerProfile, StationConfig, HfeCompanyProfile } from '../types/pos'

export const DEFAULT_COMPANY_PROFILE: HfeCompanyProfile = {
  companyBookId: 'BOOK-CAFE-HQ-88',
  ptLegalName: 'PT Kopi Karya Nusantara',
  brandName: 'Artisan Cafe & Roastery HQ',
  logoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100&q=80',
  taxIdNpwp: '01.234.567.8-012.000',
  nibPermit: '9120001234567',
  address: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan',
  hfeLedgerApiEndpoint: 'https://api.hfe.internal/v1/company-books/BOOK-CAFE-HQ-88'
}

export const BUILTIN_THEMES: CafeThemeConfig[] = [
  {
    id: 'theme-pakuwon-warm',
    themeName: 'Pakuwon Warm Wood Roastery',
    authorRole: 'Pakuwon Mall Owner Persona',
    brandName: 'Artisan Cafe & Roastery HQ',
    pageBgHex: '#0f172a',
    cardBgHex: '#1e293b',
    cardBorderHex: '#334155',
    primaryBtnBgHex: '#f59e0b',
    primaryBtnTextHex: '#020617',
    primaryAccentHex: '#fbbf24',
    fontFamilyCss: 'Plus Jakarta Sans, sans-serif',
    borderRadiusPx: 16
  },
  {
    id: 'theme-mike-bold',
    themeName: 'Chef Mike Cyberpunk Neon Bar',
    authorRole: 'Chef Mike Bistro Persona',
    brandName: 'Artisan Cafe & Roastery HQ',
    pageBgHex: '#09090b',
    cardBgHex: '#18181b',
    cardBorderHex: '#27272a',
    primaryBtnBgHex: '#6366f1',
    primaryBtnTextHex: '#ffffff',
    primaryAccentHex: '#818cf8',
    fontFamilyCss: 'Inter, sans-serif',
    borderRadiusPx: 12
  },
  {
    id: 'theme-esb-emerald',
    themeName: 'Ali ex-ESB Emerald Enterprise',
    authorRole: 'Ali ex-ESB F&B Director Persona',
    brandName: 'Artisan Cafe & Roastery HQ',
    pageBgHex: '#022c22',
    cardBgHex: '#064e3b',
    cardBorderHex: '#047857',
    primaryBtnBgHex: '#10b981',
    primaryBtnTextHex: '#022c22',
    primaryAccentHex: '#34d399',
    fontFamilyCss: 'Plus Jakarta Sans, sans-serif',
    borderRadiusPx: 14
  }
]

export const PRODUCT_CATALOG: MenuItem[] = [
  {
    id: 'MN-001',
    hfeCategoryCode: 'SKU-COF-001',
    name: 'Espresso Aren Latte',
    category: 'Coffee',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&q=80',
    description: 'Espresso ganda Arabica kintamani dipadu gula aren alami dan susu segar.',
    bomIngredients: [
      { itemCode: 'RAW-BEAN-01', name: 'Biji Kopi Arabica Kintamani', amount: '18g', unitCostEstimate: 4500 },
      { itemCode: 'RAW-MILK-01', name: 'Fresh Milk Pasteurisasi', amount: '150ml', unitCostEstimate: 2800 },
      { itemCode: 'RAW-SYR-01', name: 'Sirup Gula Aren Cair', amount: '25ml', unitCostEstimate: 1200 }
    ],
    preparationSteps: [
      '1. Grind 18 gram biji Kintamani fine setting.',
      '2. Tamping & tumpahkan 36ml espresso shot selama 27 detik.',
      '3. Tuang 25ml gula aren ke dasar cangkir, tambahkan es batu & susu pasteurisasi.',
      '4. Layer espresso di atasnya.'
    ]
  },
  {
    id: 'MN-002',
    hfeCategoryCode: 'SKU-COF-002',
    name: 'Japanese Cold Brew V60',
    category: 'Coffee',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&q=80',
    description: 'Manual brew es metode drip V60 dengan notes buah peach & melati segar.',
    bomIngredients: [
      { itemCode: 'RAW-BEAN-02', name: 'Biji Kopi Ethiopia Yirgacheffe', amount: '15g', unitCostEstimate: 7500 },
      { itemCode: 'RAW-ICE-01', name: 'Es Batu Filtered Water', amount: '120g', unitCostEstimate: 500 }
    ],
    preparationSteps: [
      '1. Giling 15 gram Yirgacheffe medium-coarse.',
      '2. Tuang es batu 120g ke server server glass.',
      '3. Pouring V60: 40ml blooming 30 detik, total seduh 150ml air 92°C.'
    ]
  },
  {
    id: 'MN-003',
    hfeCategoryCode: 'SKU-MAT-001',
    name: 'Uji Matcha Oat Latte',
    category: 'Non-Coffee',
    price: 34000,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&q=80',
    description: 'Bubuk ceremonial Uji Matcha Kyoto kocok bambu Chasen dengan susu gandum Oatside.',
    bomIngredients: [
      { itemCode: 'RAW-MAT-01', name: 'Bubuk Ceremonial Uji Matcha Kyoto', amount: '4g', unitCostEstimate: 9000 },
      { itemCode: 'RAW-OAT-01', name: 'Susu Gandum Oatside Barista Edition', amount: '180ml', unitCostEstimate: 4200 }
    ],
    preparationSteps: [
      '1. Ayak 4g Uji Matcha ke chawan, tambahkan 40ml air hangat 80°C.',
      '2. Whisk dengan Chasen hingga foam halus tebal terbentuk.',
      '3. Tuang Oatside iced ke gelas, layer matcha di atasnya.'
    ]
  },
  {
    id: 'MN-004',
    hfeCategoryCode: 'SKU-PAS-001',
    name: 'Croissant Butter Paris',
    category: 'Pastry',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80',
    description: 'Pastry mentega Prancis dengan lapisan flaking krispi gurih.',
    bomIngredients: [
      { itemCode: 'RAW-PAS-01', name: 'Croissant Dough Premium Butter', amount: '1 pcs', unitCostEstimate: 9500 }
    ],
    preparationSteps: [
      '1. Heat oven conveyer 180°C selama 3 menit.',
      '2. Sajikan piring kayu hangat dengan mentega isi mini.'
    ]
  },
  {
    id: 'MN-005',
    hfeCategoryCode: 'SKU-SNK-001',
    name: 'Truffle Fries with Garlic Mayo',
    category: 'Snack',
    price: 38000,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&q=80',
    description: 'Kentang goreng impor garing dilumuri minyak truffle asli dan keju parmesan parut.',
    bomIngredients: [
      { itemCode: 'RAW-POT-01', name: 'Kentang Shoestring French Fries', amount: '180g', unitCostEstimate: 6000 },
      { itemCode: 'RAW-TRF-01', name: 'Minyak Black Truffle Impor', amount: '5ml', unitCostEstimate: 5000 },
      { itemCode: 'RAW-PAR-01', name: 'Keju Parmesan Grated', amount: '10g', unitCostEstimate: 3000 }
    ],
    preparationSteps: [
      '1. Deep fry kentang 175°C selama 4 menit hingga golden crispy.',
      '2. Toss kentang dengan garam laut, parutan parmesan, dan drip truffle oil.',
      '3. Rangkai dengan Garlic Mayo ramekin di samping.'
    ]
  }
]

export const INITIAL_TABLES: TableInfo[] = [
  { id: 'TBL-01', name: 'MEJA-01', status: 'free', totalBill: 0, orderIds: [] },
  { id: 'TBL-02', name: 'MEJA-02', status: 'free', totalBill: 0, orderIds: [] },
  { id: 'TBL-03', name: 'MEJA-03', status: 'free', totalBill: 0, orderIds: [] },
  { id: 'TBL-04', name: 'MEJA-04', status: 'occupied', customerName: 'Aldi (QR)', totalBill: 63000, orderIds: ['ORD-8801'] },
  { id: 'TBL-05', name: 'MEJA-05', status: 'free', totalBill: 0, orderIds: [] },
  { id: 'TBL-06', name: 'MEJA-06', status: 'free', totalBill: 0, orderIds: [] },
  { id: 'TBL-07', name: 'MEJA-07', status: 'free', totalBill: 0, orderIds: [] },
  { id: 'TBL-08', name: 'MEJA-08', status: 'occupied', customerName: 'Chef Mike', totalBill: 120000, orderIds: ['ORD-8802'] },
]

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-8801',
    table: 'MEJA-04',
    customerName: 'Aldi (QR)',
    items: [
      {
        ...PRODUCT_CATALOG[0],
        quantity: 1,
        seatNumber: 'Seat 1',
        seatCustomerContact: { name: 'Aldi', phone: '081298765432', favoriteDrink: 'Espresso Aren Latte', preferredMilk: 'Oat Milk (+Rp 5.000)', preferredSugar: '50%', allergenAlert: 'Alergi Lactose' },
        milkOption: 'Oat Milk (+Rp 5.000)',
        sugarLevel: '50%'
      },
      {
        ...PRODUCT_CATALOG[3],
        quantity: 1,
        seatNumber: 'Seat 1',
        seatCustomerContact: { name: 'Aldi', phone: '081298765432' }
      }
    ],
    status: 'brewing',
    createdAt: '19:42 WIB',
    totalPrice: 63000,
    paymentStatus: 'paid_qris',
    paymentPolicy: 'pay-first'
  },
  {
    id: 'ORD-8802',
    table: 'MEJA-08',
    customerName: 'Chef Mike',
    items: [
      {
        ...PRODUCT_CATALOG[2],
        quantity: 2,
        seatNumber: 'Seat 2',
        seatCustomerContact: { name: 'Siti Rahma', phone: '081599887766' }
      },
      {
        ...PRODUCT_CATALOG[4],
        quantity: 1,
        seatNumber: 'Seat 3'
      }
    ],
    status: 'qc-passed',
    createdAt: '19:35 WIB',
    totalPrice: 106000,
    paymentStatus: 'pending',
    paymentPolicy: 'open-tab'
  }
]

export const INITIAL_CUSTOMER_PROFILES: CustomerProfile[] = [
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
]

export const STATIONS: StationConfig[] = [
  { id: 'all', name: 'Semua Station (Gabungan)', icon: '🌟', categories: ['Coffee', 'Non-Coffee', 'Pastry', 'Snack'] },
  { id: 'drink-bar', name: 'Drink Bar (Barista)', icon: '☕', categories: ['Coffee', 'Non-Coffee'] },
  { id: 'hot-kitchen', name: 'Hot Kitchen (Dapur Utm)', icon: '🍳', categories: ['Snack'] },
  { id: 'pastry-bakery', name: 'Pastry & Bakery', icon: '🥐', categories: ['Pastry'] },
]

export const OUTLET_BRANCHES = [
  { id: 'OUTLET-SENOPATI-01', name: 'Kopitiam Senopati & Roastery (HQ)', warehouse: 'WH-SENOPATI-01' },
  { id: 'OUTLET-BSD-02', name: 'Kopitiam BSD Breeze', warehouse: 'WH-BSD-02' },
  { id: 'OUTLET-BDG-03', name: 'Kopitiam Bandung Dago', warehouse: 'WH-BDG-03' }
]
