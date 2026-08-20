export type SubscriptionTier = 'starter' | 'pro' | 'enterprise'
export type MerchantStatus = 'active' | 'suspended' | 'trial'
export type UserRole = 'owner' | 'manager' | 'cashier' | 'barista' | 'kitchen' | 'accountant'
export type UserStatus = 'active' | 'inactive' | 'on_leave'

export interface MerchantFeatureToggles {
  enableKds: boolean
  enableOpenTab: boolean
  enableMultiZone: boolean
  enableSnapBi: boolean
  enableCustomerLoyalty: boolean
  enableBiologicalAssets: boolean
}

export interface MerchantAccount {
  id: string
  tenantId: string
  name: string
  legalEntityName: string
  subdomain: string
  tier: SubscriptionTier
  status: MerchantStatus
  outletsCount: number
  activeCashiersCount: number
  mrrAmountIdr: number
  joinedAt: string
  features: MerchantFeatureToggles
  contactEmail: string
  contactPhone: string
}

export interface UserAccount {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  assignedMerchantId: string
  assignedMerchantName: string
  assignedOutletName: string
  pinCode: string
  status: UserStatus
  lastLoginAt: string
  createdAt: string
}

export interface CreateMerchantPayload {
  name: string
  legalEntityName: string
  subdomain: string
  tier: SubscriptionTier
  contactEmail: string
  contactPhone: string
  initialFeatures?: Partial<MerchantFeatureToggles>
}

export interface CreateUserPayload {
  name: string
  email: string
  phone: string
  role: UserRole
  assignedMerchantId: string
  assignedOutletName: string
  pinCode: string
}
