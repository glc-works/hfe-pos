// --- HFE POS CORE DOMAIN TYPES ---

export type PrimaryDomainApp = 'landing' | 'customer' | 'cafe'
export type StaffSurfaceMode = 'barista-pos' | 'kds-screen' | 'checker-qc' | 'server-waiter' | 'cafe-config'
export type KdsViewModeType = 'kanban' | 'list' | 'workorder'
export type CustomerLoginType = 'phone' | 'guest-name'
export type PaymentPolicy = 'pay-first' | 'open-tab'
export type PB1TaxMode = 0 | 1 | 2 // 0=Disabled, 1=Exclude (Show), 2=Include (Embedded in price)

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
}

export interface BomIngredient {
  itemCode: string
  name: string
  amount: string
  unitCostEstimate?: number
}

export interface MenuItem {
  id: string
  hfeCategoryCode: string
  name: string
  category: 'Coffee' | 'Non-Coffee' | 'Pastry' | 'Snack'
  price: number
  image: string
  description: string
  temperature?: 'Iced' | 'Hot'
  sugarLevel?: '0%' | '50%' | '100%'
  milkOption?: 'Whole Milk' | 'Oat Milk (+Rp 5.000)' | 'Almond Milk (+Rp 5.000)'
  bomIngredients?: BomIngredient[]
  preparationSteps?: string[]
}

export interface SeatCustomerContact {
  name: string
  phone: string
  favoriteDrink?: string
  preferredMilk?: string
  preferredSugar?: string
  allergenAlert?: string
}

export interface OrderItem extends MenuItem {
  quantity: number
  notes?: string
  seatNumber?: string // Tagging Kursi (Seat 1-4)
  seatCustomerContact?: SeatCustomerContact
}

export interface Order {
  id: string
  table: string
  customerName: string
  items: OrderItem[]
  status: 'queued' | 'brewing' | 'ready' | 'qc-passed' | 'served' | 'cancelled'
  createdAt: string
  totalPrice: number
  paymentStatus: 'pending' | 'paid_qris' | 'paid_cash'
  paymentPolicy: PaymentPolicy
  hfeVoucherCode?: string
  discountAmount?: number
  tipAmount?: number
}

export interface TableInfo {
  id: string
  name: string
  status: 'free' | 'occupied' | 'billing' | 'reserved'
  customerName?: string
  totalBill: number
  orderIds: string[]
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
  totalVisits: number
  loyaltyTier: string
}

export interface StationConfig {
  id: string
  name: string
  icon: string
  categories: string[]
}

export interface CafeThemeConfig {
  id: string
  themeName: string
  authorRole: string
  brandName: string
  pageBgHex: string
  cardBgHex: string
  cardBorderHex: string
  primaryBtnBgHex: string
  primaryBtnTextHex: string
  primaryAccentHex: string
  fontFamilyCss: string
  borderRadiusPx: number
  customCssOverrides?: string
}
