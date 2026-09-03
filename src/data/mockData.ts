import { CafeThemeConfig, MenuItem, TableInfo, Order, CustomerProfile, StationConfig, HfeCompanyProfile, PropertyZoneConfig, HotelGuestFolio, TableReservation } from '../types/pos'
import { isConnectedFirstPartyRuntime, requiredRuntimeUuid } from '../config/firstPartyRuntime'

export const DEFAULT_COMPANY_PROFILE: HfeCompanyProfile = {
  companyBookId: 'BOOK-CAFE-HQ-88',
  ptLegalName: 'PT Kopi Karya Nusantara',
  brandName: 'Artisan Cafe & Roastery HQ',
  logoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100&q=80',
  taxIdNpwp: '01.234.567.8-012.000',
  nibPermit: '9120001234567',
  address: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan',
  hfeLedgerApiEndpoint: 'https://api.hfe.internal/v1/company-books/BOOK-CAFE-HQ-88',
  operatingArchetype: 'casual-dine-in',
  workflowToggles: {
    enableMenuCatalog: true,
    enableTableFloorPlan: true,
    enableBookingReservations: false,
    defaultPosMode: 'tables'
  },
  storefrontInfo: {
    tagline: 'Artisan Specialty Coffee & Fresh Pastry',
    storyDescription: 'Pelopor kopi artisan dengan biji nusantara pilihan sejak 2020.',
    operatingHours: 'Senin - Minggu: 07:00 - 22:00 WIB',
    wifiSsid: 'Kopitiam_Senopati_Guest',
    wifiPassword: 'SYNTHETIC-DEMO-WIFI',
    wifiAccessPolicy: 'after_payment'
  }
}

export { BUILTIN_THEMES } from './themePresetsData'

export const PRODUCT_CATALOG: MenuItem[] = [
  {
    id: 'MN-001',
    hfeCategoryCode: 'SKU-COF-001',
    name: 'Espresso Aren Latte',
    category: 'Coffee',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&q=80',
    description: 'Espresso ganda Arabica kintamani dipadu gula aren alami dan susu segar.',
    badge: 'best_seller',
    badgeStory: 'Menu terlaris kami sejak 2020. Dipesan lebih dari 1.800 cangkir setiap bulannya oleh pelanggan setia.',
    tastingNotes: ['Gula Aren', 'Caramel', 'Dark Chocolate'],
    dietaryTags: ['halal'],
    originInfo: 'Arabica Kintamani Bali & Aren Organik Banten',
    hasModifiers: true,
    modifierGroups: [
      {
        id: 'mod-temp',
        name: 'Suhu Penyajian',
        selectionType: 'single',
        options: [
          { id: 'opt-iced', name: 'Dingin (Iced)', priceDelta: 0 },
          { id: 'opt-hot', name: 'Panas (Hot)', priceDelta: 0 }
        ]
      },
      {
        id: 'mod-sugar',
        name: 'Tingkat Kemanisan (Sugar Level)',
        selectionType: 'single',
        options: [
          { id: 'opt-sugar-100', name: 'Normal (100%)', priceDelta: 0 },
          { id: 'opt-sugar-50', name: 'Less Sugar (50%)', priceDelta: 0 },
          { id: 'opt-sugar-0', name: 'No Sugar (0%)', priceDelta: 0 }
        ]
      },
      {
        id: 'mod-milk-addons',
        name: 'Tambahan & Topping (Add-ons)',
        selectionType: 'multiple',
        options: [
          { id: 'opt-oat', name: 'Upgrade Susu Oat', priceDelta: 6000 },
          { id: 'opt-shot', name: 'Extra Espresso Shot', priceDelta: 6000 }
        ]
      }
    ],
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
    badge: 'chef_recommendation',
    badgeStory: 'Pilihan utama Head Roaster kami. Ekstraksi dingin tetes demi tetes selama 8 jam menghadirkan profil teh melati yang sangat bersih.',
    tastingNotes: ['Peach', 'Melati', 'Citrus'],
    dietaryTags: ['vegan', 'gluten_free', 'halal'],
    originInfo: 'Single Origin Ethiopia Yirgacheffe Washed',
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
    badge: 'signature',
    badgeStory: 'Matcha seremonial dipasok langsung dari perkebunan tertua di Uji, Kyoto. Dikocok tradisional menggunakan Chasen bambu.',
    tastingNotes: ['Umami', 'Creamy Oat', 'Sweet Vegetal'],
    dietaryTags: ['vegan', 'dairy_free', 'halal'],
    originInfo: 'Uji Prefecture, Kyoto, Japan',
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
    badge: 'best_seller',
    badgeStory: 'Dipanggang fresh setiap pagi dengan 100% mentega fermentasi AOP Normandia Prancis.',
    tastingNotes: ['Rich Butter', 'Flaky', 'Golden Crust'],
    dietaryTags: ['halal'],
    originInfo: 'Normandy Butter AOP',
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
    badge: 'signature',
    badgeStory: 'Kentang goreng renyah diselimuti minyak black truffle murni dan parutan keju parmesan berumur 12 bulan.',
    tastingNotes: ['Aromatic Truffle', 'Savory Cheese', 'Garlic Crunch'],
    dietaryTags: ['halal'],
    originInfo: 'Umbria Black Truffle Oil',
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
  },
  {
    id: 'MN-006',
    hfeCategoryCode: 'SKU-COF-003',
    name: 'Caramel Macchiato Cloud',
    category: 'Coffee',
    price: 36000,
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500&q=80',
    description: 'Vanilla bean syrup, steamed milk velvety, espresso roast, dan saus karamel drizzle.',
    badge: 'new_arrival',
    badgeStory: 'Kreasi terbaru musim ini! Memadukan cold foam velvety dengan karamel mentega buatan sendiri.',
    tastingNotes: ['Sweet Vanilla', 'Toffee', 'Silky Cloud'],
    dietaryTags: ['halal'],
    originInfo: 'Madagascar Vanilla Bean',
    bomIngredients: [],
    preparationSteps: ['1. Siapkan sirup vanilla dan susu.', '2. Drizzle caramel drizzle di atas froth.']
  },
  {
    id: 'MN-007',
    hfeCategoryCode: 'SKU-COF-004',
    name: 'Americano On The Rocks',
    category: 'Coffee',
    price: 24000,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80',
    description: 'Double shot espresso murni dengan air dingin terfilter dan es batu bening.',
    tastingNotes: ['Bold Cocoa', 'Nutty', 'Clean Finish'],
    dietaryTags: ['vegan', 'gluten_free', 'halal'],
    originInfo: 'Arabica Mandheling & Gayo Aceh',
    bomIngredients: [],
    preparationSteps: ['1. Double espresso over ice.']
  },
  {
    id: 'MN-008',
    hfeCategoryCode: 'SKU-COF-005',
    name: 'Piccolo Flat White',
    category: 'Coffee',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=500&q=80',
    description: 'Ristretto pekat dalam gelas kecil dengan microfoam susu lembut.',
    tastingNotes: ['Intense Cocoa', 'Creamy Sweet'],
    dietaryTags: ['halal'],
    originInfo: 'Toraja Sapan Single Origin',
    bomIngredients: [],
    preparationSteps: ['1. Single ristretto with microfoam.']
  },
  {
    id: 'MN-009',
    hfeCategoryCode: 'SKU-MAT-002',
    name: 'Hojicha Roasted Tea Latte',
    category: 'Non-Coffee',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&q=80',
    description: 'Teh hijau sangrai aroma kayu manis alami dengan susu creamy.',
    badge: 'seasonal',
    badgeStory: '🍂 Edisi Spesial Musiman — Daun teh hijau musim gugur yang disangrai di atas arang tradisional Kyoto.',
    tastingNotes: ['Toasty Smoky', 'Caramelized Tea', 'Warm Woody'],
    dietaryTags: ['vegan', 'halal'],
    originInfo: 'Shizuoka Autumn Harvest, Japan',
    bomIngredients: [],
    preparationSteps: ['1. Whisk hojicha powder with milk.']
  },
  {
    id: 'MN-010',
    hfeCategoryCode: 'SKU-MAT-003',
    name: 'Dark Chocolate 70%',
    category: 'Non-Coffee',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=500&q=80',
    description: 'Cokelat hitam Belgia 70% meleleh kaya antioksidan dengan taburan sea salt.',
    bomIngredients: [],
    preparationSteps: ['1. Melt chocolate with hot steamed milk.']
  },
  {
    id: 'MN-011',
    hfeCategoryCode: 'SKU-PAS-002',
    name: 'Pain au Chocolat Valrhona',
    category: 'Pastry',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&q=80',
    description: 'Pastry mentega Prancis dengan double batons cokelat Valrhona leleh.',
    bomIngredients: [],
    preparationSteps: ['1. Warm pastry in convection oven.']
  },
  {
    id: 'MN-012',
    hfeCategoryCode: 'SKU-PAS-003',
    name: 'Almond Kouign-Amann',
    category: 'Pastry',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80',
    description: 'Pastry Breton karamelisasi gula tebu renyah dengan taburan roasted almond.',
    bomIngredients: [],
    preparationSteps: ['1. Warm for 2 mins.']
  },
  {
    id: 'MN-013',
    hfeCategoryCode: 'SKU-FOD-001',
    name: 'Nasi Goreng Wagyu Roastery',
    category: 'Main Course',
    price: 58000,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80',
    description: 'Nasi goreng beras aromatik dengan potongan daging sapi Wagyu meltique & telur onsen.',
    bomIngredients: [],
    preparationSteps: ['1. Wok fry with special soy reduction and beef fat.']
  },
  {
    id: 'MN-014',
    hfeCategoryCode: 'SKU-FOD-002',
    name: 'Truffle Cream Carbonara Pasta',
    category: 'Main Course',
    price: 62000,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&q=80',
    description: 'Fettuccine pasta al dente dengan smoked beef, egg yolk emulsion, dan keju Grana Padano.',
    bomIngredients: [],
    preparationSteps: ['1. Cook pasta al dente, toss with sauce.']
  },
  {
    id: 'MN-015',
    hfeCategoryCode: 'SKU-FOD-003',
    name: 'Crispy Duck Sambal Matah Bowl',
    category: 'Main Course',
    price: 54000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
    description: 'Bebek krispi rempah khas Bali dengan sambal matah serai segar dan nasi hangat.',
    bomIngredients: [],
    preparationSteps: ['1. Fry duck to perfection, serve with fresh sambal matah.']
  },
  {
    id: 'MN-016',
    hfeCategoryCode: 'SKU-RET-001',
    name: 'Whole Bean Arabica Kintamani 250g',
    category: 'Retail',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=500&q=80',
    description: 'Biji kopi sangrai specialty Bali Kintamani anaerobic natural. Notes: Orange, Brown Sugar.',
    bomIngredients: [],
    preparationSteps: ['1. Retail packaging.']
  },
  {
    id: 'MN-017',
    hfeCategoryCode: 'SKU-RET-002',
    name: 'Artisan Ceramic Tumbler 500ml',
    category: 'Retail',
    price: 135000,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80',
    description: 'Tumbler keramik handmade tahan panas dingin 12 jam dengan tutup silicone food grade.',
    bomIngredients: [],
    preparationSteps: ['1. Pack in gift box.']
  },
  {
    id: 'MN-018',
    hfeCategoryCode: 'SKU-MCK-001',
    name: 'Sparkling Yuzu Espresso Fizz',
    category: 'Mocktails',
    price: 38000,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80',
    description: 'Espresso shot dingin dengan sari jeruk Yuzu Jepang, sparkling soda, dan daun rosemary.',
    bomIngredients: [],
    preparationSteps: ['1. Build over ice with sparkling soda and cold espresso float.']
  },
  {
    id: 'MN-019',
    hfeCategoryCode: 'SKU-DST-001',
    name: 'Basque Burnt Cheesecake',
    category: 'Dessert',
    price: 36000,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80',
    description: 'Kue keju panggang khas San Sebastian dengan karamelisasi atas gosong wangi dan isi molten lembut.',
    bomIngredients: [],
    preparationSteps: ['1. Slice fresh and serve chilled.']
  }
]

export function createRuntimeProductCatalog(): MenuItem[] {
  if (!isConnectedFirstPartyRuntime()) return PRODUCT_CATALOG
  return [{ ...PRODUCT_CATALOG[0], id: requiredRuntimeUuid('VITE_HFE_FLAGSHIP_PRODUCT_ID') }]
}

export const PROPERTY_ZONES: PropertyZoneConfig[] = [
  { id: 'all', name: 'Semua Area', icon: '🏢', tablePrefix: 'ALL', totalTables: 22, hasDedicatedServiceStaff: false },
  { id: 'outdoor-garden', name: 'Outdoor Garden', icon: '🌿', tablePrefix: 'OUT', totalTables: 6, hasDedicatedServiceStaff: true },
  { id: 'indoor-ac', name: 'Indoor AC Dining', icon: '❄️', tablePrefix: 'IND', totalTables: 6, hasDedicatedServiceStaff: true },
  { id: 'vip-private', name: 'VIP Private Rooms', icon: '👑', tablePrefix: 'VIP', totalTables: 2, hasDedicatedServiceStaff: true, defaultMinSpend: 2500000, minSpend: 2500000 },
  { id: 'poolside-cabana', name: 'Poolside Cabana', icon: '🏊', tablePrefix: 'POOL', totalTables: 4, hasDedicatedServiceStaff: true },
  { id: 'rooftop-skybar', name: 'Rooftop Sky Bar', icon: '🍸', tablePrefix: 'ROOF', totalTables: 4, hasDedicatedServiceStaff: true }
]

export { MOCK_HOTEL_GUEST_FOLIOS, MOCK_TABLE_RESERVATIONS } from './mockHotelAndReservationsData'


export const INITIAL_TABLES: TableInfo[] = [
  // 🌿 Outdoor Garden Zone (OUT-01 .. OUT-06)
  { id: 'TBL-OUT-01', name: 'OUT-01', status: 'free', totalBill: 0, orderCount: 0, orderIds: [], zoneId: 'outdoor-garden', pax: 4, maxCapacity: 4 },
  { id: 'TBL-OUT-02', name: 'OUT-02', status: 'free', totalBill: 0, orderCount: 0, orderIds: [], zoneId: 'outdoor-garden', pax: 2, maxCapacity: 2 },
  { id: 'TBL-OUT-03', name: 'OUT-03', status: 'free', totalBill: 0, orderCount: 0, orderIds: [], zoneId: 'outdoor-garden', pax: 4, maxCapacity: 4 },
  { id: 'TBL-OUT-04', name: 'OUT-04', status: 'occupied', customerName: 'Aldi (QR)', totalBill: 86000, orderCount: 2, orderIds: ['ORD-8801'], zoneId: 'outdoor-garden', seatedDurationMinutes: 45, pax: 4, maxCapacity: 4, seatedGuests: 3 },
  { id: 'TBL-OUT-05', name: 'OUT-05', status: 'free', totalBill: 0, orderCount: 0, orderIds: [], zoneId: 'outdoor-garden', pax: 6, maxCapacity: 6 },
  { id: 'TBL-OUT-06', name: 'OUT-06', status: 'free', totalBill: 0, orderCount: 0, orderIds: [], zoneId: 'outdoor-garden', pax: 4, maxCapacity: 4 },

  // ❄️ Indoor AC Dining Zone (IND-01 .. IND-06)
  { id: 'TBL-IND-01', name: 'IND-01', status: 'free', totalBill: 0, orderCount: 0, orderIds: [], zoneId: 'indoor-ac', pax: 2, maxCapacity: 2 },
  { id: 'TBL-IND-02', name: 'IND-02', status: 'occupied', customerName: 'Chef Mike', totalBill: 120000, orderCount: 3, orderIds: ['ORD-8802'], zoneId: 'indoor-ac', seatedDurationMinutes: 25, pax: 4, maxCapacity: 4, seatedGuests: 4 },
  { id: 'TBL-IND-03', name: 'IND-03', status: 'free', totalBill: 0, orderCount: 0, orderIds: [], zoneId: 'indoor-ac', pax: 4, maxCapacity: 4 },
  { id: 'TBL-IND-04', name: 'IND-04', status: 'free', totalBill: 0, orderCount: 0, orderIds: [], zoneId: 'indoor-ac', pax: 4, maxCapacity: 4 },
  { id: 'TBL-IND-05', name: 'IND-05', status: 'free', totalBill: 0, orderCount: 0, orderIds: [], zoneId: 'indoor-ac', pax: 6, maxCapacity: 6 },
  { id: 'TBL-IND-06', name: 'IND-06', status: 'free', totalBill: 0, orderCount: 0, orderIds: [], zoneId: 'indoor-ac', pax: 8, maxCapacity: 8 },

  // 👑 VIP Private Rooms (VIP-01 .. VIP-02 with min spend Rp 2.500.000.000)
  { id: 'TBL-VIP-01', name: 'VIP-01', status: 'occupied', customerName: 'Drs. H. Bambang Soeprapto', totalBill: 1850000000, orderCount: 5, orderIds: ['ORD-VIP-01'], zoneId: 'vip-private', minSpend: 2500000000, seatedDurationMinutes: 75, pax: 10, maxCapacity: 10, seatedGuests: 8 },
  { id: 'TBL-VIP-02', name: 'VIP-02', status: 'free', totalBill: 0, orderCount: 0, orderIds: [], zoneId: 'vip-private', minSpend: 2500000000, pax: 12, maxCapacity: 12 },

  // 🏊 Poolside Cabana Zone (POOL-01 .. POOL-04)
  { id: 'TBL-POOL-01', name: 'POOL-01', status: 'occupied', customerName: 'Jessica Wong (Cabana)', totalBill: 24500000, orderCount: 3, orderIds: ['ORD-POOL-01'], zoneId: 'poolside-cabana', seatedDurationMinutes: 30, pax: 4, maxCapacity: 4, seatedGuests: 2 },
  { id: 'TBL-POOL-02', name: 'POOL-02', status: 'free', totalBill: 0, orderCount: 0, orderIds: [], zoneId: 'poolside-cabana', pax: 4, maxCapacity: 4 },
  { id: 'TBL-POOL-03', name: 'POOL-03', status: 'free', totalBill: 0, orderCount: 0, orderIds: [], zoneId: 'poolside-cabana', pax: 4, maxCapacity: 4 },
  { id: 'TBL-POOL-04', name: 'POOL-04', status: 'free', totalBill: 0, orderCount: 0, orderIds: [], zoneId: 'poolside-cabana', pax: 6, maxCapacity: 6 },

  // 🍸 Rooftop Sky Bar Zone (ROOF-01 .. ROOF-04)
  { id: 'TBL-ROOF-01', name: 'ROOF-01', status: 'occupied', customerName: 'Kevin Sanjaya (Sunset)', totalBill: 48000000, orderCount: 4, orderIds: ['ORD-ROOF-01'], zoneId: 'rooftop-skybar', seatedDurationMinutes: 50, pax: 4, maxCapacity: 4, seatedGuests: 3 },
  { id: 'TBL-ROOF-02', name: 'ROOF-02', status: 'free', totalBill: 0, orderCount: 0, orderIds: [], zoneId: 'rooftop-skybar', pax: 2, maxCapacity: 2 },
  { id: 'TBL-ROOF-03', name: 'ROOF-03', status: 'free', totalBill: 0, orderCount: 0, orderIds: [], zoneId: 'rooftop-skybar', pax: 4, maxCapacity: 4 },
  { id: 'TBL-ROOF-04', name: 'ROOF-04', status: 'free', totalBill: 0, orderCount: 0, orderIds: [], zoneId: 'rooftop-skybar', pax: 6, maxCapacity: 6 }
]


export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-8801',
    table: 'MEJA-04',
    customerName: 'Aldi (QR)',
    items: [
      { ...PRODUCT_CATALOG[0], price: 28000, quantity: 1, seatNumber: 'Seat 1', seatCustomerContact: { name: 'Aldi', phone: '081298765432' }, milkOption: 'Oat Milk (+Rp 5.000)', sugarLevel: '50%' },
      { ...PRODUCT_CATALOG[5], price: 58000, quantity: 1, seatNumber: 'Seat 1', seatCustomerContact: { name: 'Aldi', phone: '081298765432' } }
    ],
    status: 'brewing',
    createdAt: '19:42 WIB',
    total: 86000,
    taxPB1Amount: 7818,
    serviceFeeAmount: 0,
    tipAmount: 0,
    timeElapsedMinutes: 5,
    policy: 'open-tab',
    totalPrice: 86000,
    paymentStatus: 'pending',
    paymentPolicy: 'open-tab'
  },
  {
    id: 'ORD-8802',
    table: 'MEJA-08',
    customerName: 'Chef Mike',
    items: [
      { ...PRODUCT_CATALOG[2], quantity: 2, seatNumber: 'Seat 2', seatCustomerContact: { name: 'Siti Rahma', phone: '081599887766' } },
      { ...PRODUCT_CATALOG[4], quantity: 1, seatNumber: 'Seat 3' }
    ],
    status: 'qc-passed',
    createdAt: '19:35 WIB',
    total: 106000,
    taxPB1Amount: 10600,
    serviceFeeAmount: 5300,
    tipAmount: 0,
    timeElapsedMinutes: 12,
    policy: 'open-tab',
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

