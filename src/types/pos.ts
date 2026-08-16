// --- HFE POS CORE DOMAIN TYPES ---

export type PrimaryDomainApp = 'landing' | 'customer' | 'cafe' | 'design-system'
export type StaffSurfaceMode = 'barista-pos' | 'kds-screen' | 'checker-qc' | 'server-waiter' | 'cafe-config' | 'retail-pos' | 'scan-go' | 'fine-dining-kds' | 'sommelier' | 'maitre-d'
 | 'warehouse-mgmt' | 'branch-mgmt' | 'customer-crm' | 'hfe-insights'
export type KdsViewModeType = 'kanban' | 'list' | 'workorder'
export type CustomerLoginType = 'phone' | 'guest-name'
export type PaymentPolicy = 'pay-first' | 'open-tab'
export type PB1TaxMode = 0 | 1 | 2 // 0=Disabled, 1=Exclude (Show), 2=Include (Embedded in price)
export type PosPayMethod = 'cash' | 'qris' | 'cc' | 'debit' | 'card'
export type ViewportModeType = 'mobile' | 'tablet-portrait' | 'tablet-landscape' | 'tablet' | 'responsive'

export interface CardTenderMetadata {
  cardType: 'cc' | 'debit'
  cardNetwork: 'visa' | 'mastercard' | 'gpn' | 'jcb' | 'amex' | 'other'
  issuingBank: string
  cardPrefix: string // 4 digit depan kartu (BIN/Tipe)
  cardLast3: string  // 3 digit belakang kartu (Rekon EDC)
  cardTier?: string  // e.g. "World", "Batik Air", "Private/Prioritas", "Infinite", "Signature", "Platinum"
  maskedReconNumber?: string // e.g. "4123-***-789"
  approvalCode?: string
}

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
  isLiveHfeSynced?: boolean
  lastSyncedAt?: string

  // 🌐 Cafe / Resto Storefront Social Media Links
  socialMedia?: {
    instagram?: string       // e.g. "@kopitiam.senopati"
    tiktok?: string          // e.g. "@kopitiam_roastery"
    whatsappOrder?: string   // e.g. "6281298765432"
    googleMapsUrl?: string   // Google Maps location pin link
    websiteUrl?: string      // e.g. "https://senopati.togrow.id"
  }

  // ☕ Cafe / Resto Operational Landing Information
  storefrontInfo?: {
    tagline?: string         // e.g. "Artisan Specialty Coffee & Fresh Pastry"
    storyDescription?: string// Cafe history / brand story text
    operatingHours?: string  // e.g. "Senin - Minggu: 07:00 - 22:00 WIB"
    wifiSsid?: string        // e.g. "Kopitiam_Guest_Free"
    wifiPassword?: string    // e.g. "kopiuenak2026"
    heroBannerUrl?: string   // High res cafe interior photo
  }
}

export interface BomIngredient {
  itemCode: string
  name: string
  amount: string
  unitCostEstimate?: number
}

export type ModifierPolicy = 'always' | 'never' | 'inherit_category'

export interface CategoryEtalaseConfig {
  id: string
  name: string
  icon: string
  enableModifiersDefault: boolean
  allowCustomNotesDefault: boolean
}

export interface MenuItem {
  id: string
  name: string
  category: 'Coffee' | 'Non-Coffee' | 'Pastry' | 'Snack' | string
  hfeCategoryCode: string
  hfeGlAccount?: string
  price: number
  image: string
  description: string
  hasModifiers?: boolean
  modifierPolicy?: ModifierPolicy
  allowCustomNotes?: boolean
  temperature?: 'Iced' | 'Hot'
  sugarLevel?: '0%' | '50%' | '100%'
  milkOption?: 'Whole Milk' | 'Fresh Milk' | 'Oat Milk (+Rp 5.000)' | 'Almond Milk (+Rp 5.000)' | string
  bomIngredients?: BomIngredient[]
  preparationSteps?: string[]
}

export interface SeatCustomerContact {
  name: string
  phone?: string
  savedPreferences?: string
  favoriteDrink?: string
  preferredMilk?: string
  preferredSugar?: string
  allergenAlert?: string
}

export interface CartItem extends MenuItem {
  quantity: number
  seatNumber?: string // Tagging Kursi (Seat 1-4)
  seatCustomerContact?: SeatCustomerContact
  customNotes?: string
  allergenNotes?: string
  served?: boolean
}

export interface OrderTicket {
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
  status: 'placed' | 'processing' | 'ready' | 'qc-passed' | 'served' | 'queued' | 'brewing' | 'cancelled'
  timeElapsedMinutes: number
  createdAt: string
  waiterCall?: string
}

export interface Order extends OrderTicket {
  totalPrice?: number
  paymentStatus?: 'pending' | 'paid_qris' | 'paid_cash'
  paymentPolicy?: PaymentPolicy
  hfeVoucherCode?: string
  discountAmount?: number
}

export interface TableStatus {
  id: string
  name: string
  status: 'free' | 'occupied' | 'open-tab' | 'billing' | 'reserved'
  customerName?: string
  totalBill: number
  orderCount: number
  orderIds?: string[]
}

export type TableInfo = TableStatus


export interface CustomerProfile {
  id: string
  name: string
  phone: string
  favoriteSeat: string
  favoriteDrink: string
  preferredMilk: string
  preferredSugar: string
  allergenAlert?: string
  allergenFlags?: ('lactose' | 'nuts' | 'gluten' | 'seafood')[]
  totalVisits: number
  loyaltyTier: string

  // 👤 Customer Personal Social Handles & Birthday Trigger
  instagramHandle?: string   // e.g. "@aldi_pratama"
  tiktokHandle?: string      // e.g. "@aldikopi"
  birthdayDate?: string      // Used for automated VOUCHER-BIRTHDAY trigger
}

export interface StationConfig {
  id: string
  name: string
  icon: string
  categories: string[]
}

export interface CafeThemeConfig {
  version?: string
  themeId?: string
  themeName: string
  brandName?: string
  fontFamily: string
  primaryAccentHex: string
  primaryAccentHoverHex?: string
  pageBgHex: string
  cardBgHex: string
  headerBgHex?: string
  textColorHex: string
  secondaryTextColorHex?: string
  textMutedHex?: string
  highlightBadgeBgHex?: string
  highlightBadgeTextHex?: string
  borderRadiusPx?: number
  mode?: 'light' | 'dark'
  targetScope?: 'customer' | 'merchant' | 'both'
  customCssOverrides?: string
}

// --- STORE ONBOARDING & PRESET POLICY TYPES ---
export type BusinessType = 'cafe_fnb' | 'toko_kelontong' | 'fine_dining'
export type OperationScale = 'single_person' | 'small_team' | 'enterprise'

export interface BusinessTypePolicy {
  enableTableFloorPlan: boolean
  enableDrinkModifiers: boolean
  enableKdsKanban: boolean
  enableRecipeBom: boolean
  enableBarcodeScanner: boolean
  enableMultiUom: boolean
  enableKasbonLedger: boolean
  enableScanAndGo: boolean
  enableCourseFiring: boolean
  enableSommelierCellar: boolean
  enableMaitreDVip: boolean
}

export interface OperationScalePolicy {
  enableAutoBumpOnCheckout: boolean
  enableUnifiedSingleScreen: boolean
  requireStaffPinAuth: boolean
  enableMultiStationKds: boolean
}

export interface OnboardingData {
  businessType: BusinessType
  operationScale: OperationScale
  brandName: string
  logoUrl: string
  address: string
  instagram: string
  whatsappOrder: string
  wifiSsid: string
  wifiPassword: string
  pb1TaxMode: PB1TaxMode
  initialKasFloat: number
}

// --- TEAM MEMBERSHIP & RBAC TYPES ---
export type StaffRole = 'owner' | 'cashier' | 'barista' | 'chef' | 'waiter' | 'checker_qc'

export interface TeamMember {
  id: string
  name: string
  contact: string
  role: StaffRole
  status: 'active' | 'pending_invite'
  pinCode: string
  invitedAt: string
  activatedAt?: string
}

export interface InviteStaffPayload {
  name: string
  contact: string
  role: StaffRole
}

// --- PROMO PARTNERS & VOUCHER SETTINGS TYPES ---
export interface PartnerContact {
  id: string
  name: string
  category: 'bank' | 'merchant' | 'partner' | 'payment_gateway' | 'supplier' | 'loyalty'
  brandName: string
  logoUrl?: string
  icon?: string
  brandColor?: string
  contactPerson?: string
  email?: string
  phone?: string
  isVerifiedPartner?: boolean
}

export interface Voucher {
  code: string
  title: string
  description: string
  discountAmount: number
  discountType: 'flat' | 'percentage'
  minSpend?: number
  expiryDate?: string
  isStackable?: boolean
  issuerOrigin: 'platform' | 'merchant' // Hfe Platform Partner vs Merchant Own
  contactId?: string // Link to PartnerContact ID
  sponsorType?: 'bank' | 'merchant' | 'partner' | 'loyalty'
  sponsorName?: string
  sponsorIcon?: string
  sponsorLogoUrl?: string
  sponsorBrandColor?: string
  quantity?: number // Multi-voucher quantity indicator
  termsAndConditions?: string[]
  isActive?: boolean
}



