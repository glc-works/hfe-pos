// --- HFE POS CORE DOMAIN TYPES ---

export type PrimaryDomainApp = 'landing' | 'customer' | 'cafe' | 'design-system' | 'customer-portal'
export type StaffSurfaceMode = 'barista-pos' | 'kds-screen' | 'checker-qc' | 'server-waiter' | 'cafe-config' | 'retail-pos' | 'scan-go' | 'fine-dining-kds' | 'sommelier' | 'maitre-d'
 | 'warehouse-mgmt' | 'branch-mgmt' | 'customer-crm' | 'hfe-insights' | 'hfe-connect-hub' | 'hfe-company-book' | 'admin-hub'
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

export type WifiAccessPolicy = 'always_visible' | 'after_payment' | 'disabled'
export type BusinessOperatingArchetype = 'quick-service-stall' | 'casual-dine-in' | 'full-service-resto'

export interface PosWorkflowToggles {
  enableMenuCatalog: boolean
  enableTableFloorPlan: boolean
  enableBookingReservations: boolean
  defaultPosMode: 'catalog' | 'tables' | 'booking'
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
  operatingArchetype?: BusinessOperatingArchetype
  workflowToggles?: PosWorkflowToggles
  socialMedia?: {
    instagram?: string
    tiktok?: string
    whatsappOrder?: string
    googleMapsUrl?: string
    websiteUrl?: string
  }
  storefrontInfo?: {
    tagline?: string
    storyDescription?: string
    operatingHours?: string
    wifiSsid?: string
    wifiPassword?: string
    wifiAccessPolicy?: WifiAccessPolicy
    heroBannerUrl?: string
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
  wholesalePrice?: number
  wholesaleMinQty?: number
  barcode?: string
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

export type PropertyZoneId = 'all' | 'outdoor-garden' | 'indoor-ac' | 'vip-private' | 'poolside-cabana' | 'rooftop-skybar' | string

export interface PropertyZoneConfig {
  id: string
  name: string
  icon?: string
  tablePrefix?: string
  totalTables?: number
  hasDedicatedServiceStaff?: boolean
  defaultMinSpend?: number
  minSpend?: number
}

export interface HotelGuestFolio {
  roomNumber: string
  guestName: string
  checkInDate: string
  checkOutDate: string
  status: 'checked_in' | 'checked_out'
  creditLimit: number
  currentBalance: number
  glAccountReceivable: string
  folioId?: string
}

export interface RoomChargeSettlementPayload {
  roomNumber: string
  guestName: string
  tableNumber?: string
  subtotal: number
  taxPB1: number
  serviceFee?: number
  grandTotal: number
  staffPin: string
  signatureDataUrl?: string
  notes?: string
}

export interface TableStatus {
  id: string
  name: string
  status: 'free' | 'occupied' | 'open-tab' | 'billing' | 'reserved'
  customerName?: string
  totalBill: number
  orderCount: number
  orderIds?: string[]
  zoneId?: PropertyZoneId
  seatedDurationMinutes?: number
  minSpend?: number
  pax?: number
  seatedGuests?: number
  maxCapacity?: number
}

export type TableInfo = TableStatus

export type MemberTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum'

export interface CustomerPreferences {
  favoriteDrink?: string
  preferredMilk?: 'Whole Milk' | 'Fresh Milk' | 'Oat Milk (+Rp 5.000)' | 'Almond Milk (+Rp 5.000)' | string
  preferredSugar?: '0%' | '50%' | '100%' | string
  dietaryNotes?: string
  vehiclePlateNumber?: string
  deliveryAddress?: string
  allergens?: ('lactose' | 'nuts' | 'gluten' | 'seafood' | 'eggs')[]
  paperlessReceipts?: boolean
  ecoPointsEarned?: number
}

export interface DigitalMemberCardData {
  cardNumber: string
  customerName: string
  phone: string
  tier: MemberTier
  pointsBalance: number
  stampCount: number
  stampMax: number
  joinedDate: string
  expiryDate?: string
  barcodeData: string
  qrData: string
  brandName: string
  logoUrl?: string
  allergens?: ('lactose' | 'nuts' | 'gluten' | 'seafood' | 'eggs')[]
}

export interface CustomerProfile {
  id: string
  name: string
  phone: string
  favoriteSeat: string
  favoriteDrink: string
  preferredMilk: string
  preferredSugar: string
  allergenAlert?: string
  allergenFlags?: ('lactose' | 'nuts' | 'gluten' | 'seafood' | 'eggs')[]
  totalVisits: number
  loyaltyTier: string
  pointsBalance?: number
  stampCount?: number
  stampMax?: number
  preferences?: CustomerPreferences

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

export interface StorefrontSocialLinks {
  instagram?: string
  whatsapp?: string
  tiktok?: string
  googleMapsUrl?: string
  website?: string
}

export type QrMenuLayoutMode = 'grid_2col' | 'list_compact' | 'story_cards'

export interface StorefrontCustomizationConfig {
  // 1. Landing Page Studio
  heroHeadline: string
  heroTagline: string
  heroBannerUrl: string
  announcementBarText: string
  announcementBarActive: boolean
  ctaOrderText: string
  ctaReserveText: string
  brandStoryText: string
  operatingHoursText: string
  socialLinks: StorefrontSocialLinks

  // 2. QR Order Customer Space Studio
  greetingMessage: string
  qrBannerUrl: string
  qrMenuLayout: QrMenuLayoutMode
  wifiAccessPolicy: WifiAccessPolicy
  enableAllergenBadges: boolean
  enableDigitalReceiptSharing: boolean
  receiptCustomFooter: string
}

// --- STORE ONBOARDING & PRESET POLICY TYPES ---
export type BusinessType = 'cafe_fnb' | 'toko_kelontong' | 'fine_dining'
export type OperationScale = 'single_person' | 'small_team' | 'enterprise'
export type BusinessCluster = 'CLUSTER_FNB' | 'CLUSTER_ROASTERY' | 'CLUSTER_PLANTATION' | 'CLUSTER_TRADING' | 'CLUSTER_RETAIL' | 'CLUSTER_OTHER'
export type MigrationSource = 'fresh' | 'xero' | 'moka' | 'jurnal' | 'accurate' | 'csv'
export type SupportedCountry = 'ID' | 'SG' | 'MY' | 'HK'
export type SupportedCurrency = 'IDR' | 'SGD' | 'MYR' | 'HKD'

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
  cluster?: BusinessCluster
  migrationSource?: MigrationSource
  migrationFileName?: string
  country?: SupportedCountry
  currency?: SupportedCurrency
  capacityScale?: string
  brandName: string
  logoUrl: string
  address: string
  instagram: string
  whatsappOrder: string
  wifiSsid: string
  wifiPassword: string
  wifiAccessPolicy?: WifiAccessPolicy
  pb1TaxMode: PB1TaxMode
  initialKasFloat: number
  tenancyUuid?: string
}

// --- TEAM MEMBERSHIP & RBAC TYPES ---
export type StaffRole = 'owner' | 'store_manager' | 'cashier' | 'barista' | 'chef' | 'waiter' | 'checker_qc' | 'sommelier' | 'courier' | 'warehouse_keeper'

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

// --- EVENT TICKETING & WORKSHOP CLASS BOOKING TYPES ---
export interface EventTicketItem {
  id: string; title: string; category: 'music_event' | 'workshop_class' | 'sports_class' | 'seminar'
  date: string; time: string; location: string; price: number; quotaTotal: number; quotaRemaining: number
  instructorName?: string; description: string; bannerUrl?: string; includedBenefits?: string[]
}

export interface PurchasedEventTicket {
  ticketCode: string; eventId: string; eventTitle: string; participantName: string; participantPhone: string
  participantEmail?: string; quantity: number; totalAmountPaid: number; paymentMethod: string
  purchasedAt: string; qrBarcodeData: string; status: 'valid' | 'used' | 'cancelled'
}

export interface InviteStaffPayload {
  name: string; contact: string; role: StaffRole
}

// --- PROMO PARTNERS & VOUCHER SETTINGS TYPES ---
export interface PartnerContact {
  id: string; name: string; category: 'bank' | 'merchant' | 'partner' | 'payment_gateway' | 'supplier' | 'loyalty'
  brandName: string; logoUrl?: string; icon?: string; brandColor?: string; contactPerson?: string
  email?: string; phone?: string; isVerifiedPartner?: boolean
}

export interface Voucher {
  code: string; title: string; description: string; discountAmount: number; discountType: 'flat' | 'percentage'
  minSpend?: number; expiryDate?: string; isStackable?: boolean; issuerOrigin: 'platform' | 'merchant'
  contactId?: string; sponsorType?: 'bank' | 'merchant' | 'partner' | 'loyalty'; sponsorName?: string
  sponsorIcon?: string; sponsorLogoUrl?: string; sponsorBrandColor?: string; quantity?: number
  termsAndConditions?: string[]; isActive?: boolean
}

// --- NOTIFICATION CENTER & SERVICE TICKETING TYPES (L2-POS-49) ---
export type NotificationCategory = 'operational' | 'tickets' | 'feedback' | 'safety_allergen' | 'financial_shifts' | 'system'

export interface HfeNotification {
  id: string; title: string; message: string; category: NotificationCategory; timestamp: string; isRead: boolean
  priority?: 'low' | 'normal' | 'high' | 'urgent'; actionUrl?: string; tableNumber?: string; metadata?: Record<string, any>
}

export interface ServiceTicket {
  id: string; tableNumber: string; type: 'bill_request' | 'waiter_call' | 'water_refill' | 'clean_table' | 'sommelier_advice'
  status: 'open' | 'in_progress' | 'resolved'; createdAt: string; resolvedAt?: string; assignedStaffName?: string; notes?: string
}

// --- RE-EXPORT HFE CARD DUAL-PERSONA & MULTI-IDENTITY TYPES ---
export * from './identity'
