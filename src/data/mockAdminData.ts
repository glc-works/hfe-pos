import { MerchantAccount, UserAccount } from '../types/admin'

export const INITIAL_MERCHANTS: MerchantAccount[] = [
  {
    id: 'merch_01',
    tenantId: 'tenant_101',
    name: 'Kopi Nusantara Senopati',
    legalEntityName: 'PT Kopi Nusantara Abadi',
    subdomain: 'senopati',
    tier: 'pro',
    status: 'active',
    outletsCount: 3,
    activeCashiersCount: 6,
    mrrAmountIdr: 1490000,
    joinedAt: '2026-06-15',
    contactEmail: 'hendra@kopinusantara.id',
    contactPhone: '0812-9876-5432',
    features: {
      enableKds: true,
      enableOpenTab: true,
      enableMultiZone: true,
      enableSnapBi: true,
      enableCustomerLoyalty: true,
      enableBiologicalAssets: true
    }
  },
  {
    id: 'merch_02',
    tenantId: 'tenant_102',
    name: 'Senopati Dining & Lounge',
    legalEntityName: 'PT Rasa Kuliner Mahakarya',
    subdomain: 'dining',
    tier: 'enterprise',
    status: 'active',
    outletsCount: 5,
    activeCashiersCount: 14,
    mrrAmountIdr: 4900000,
    joinedAt: '2026-07-01',
    contactEmail: 'finance@senopatidining.co.id',
    contactPhone: '0811-2233-4455',
    features: {
      enableKds: true,
      enableOpenTab: true,
      enableMultiZone: true,
      enableSnapBi: true,
      enableCustomerLoyalty: true,
      enableBiologicalAssets: false
    }
  },
  {
    id: 'merch_03',
    tenantId: 'tenant_103',
    name: 'Specialty Roasters BSD',
    legalEntityName: 'CV Roaster Mandiri Sejahtera',
    subdomain: 'bsdroasters',
    tier: 'starter',
    status: 'trial',
    outletsCount: 1,
    activeCashiersCount: 2,
    mrrAmountIdr: 0,
    joinedAt: '2026-08-10',
    contactEmail: 'halo@bsdroasters.com',
    contactPhone: '0819-8765-4321',
    features: {
      enableKds: true,
      enableOpenTab: true,
      enableMultiZone: false,
      enableSnapBi: false,
      enableCustomerLoyalty: false,
      enableBiologicalAssets: true
    }
  }
]

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr_01',
    name: 'Bpk. Hendra Gunawan',
    email: 'hendra@kopinusantara.id',
    phone: '0812-9876-5432',
    role: 'owner',
    assignedMerchantId: 'merch_01',
    assignedMerchantName: 'Kopi Nusantara Senopati',
    assignedOutletName: 'Outlet Senopati Utama',
    pinCode: '112233',
    status: 'active',
    lastLoginAt: '2026-08-20 14:30 WIB',
    createdAt: '2026-06-15'
  },
  {
    id: 'usr_02',
    name: 'Siti Rahmawati',
    email: 'siti.rahma@kopinusantara.id',
    phone: '0813-8899-0011',
    role: 'manager',
    assignedMerchantId: 'merch_01',
    assignedMerchantName: 'Kopi Nusantara Senopati',
    assignedOutletName: 'Outlet Senopati Utama',
    pinCode: '223344',
    status: 'active',
    lastLoginAt: '2026-08-20 15:15 WIB',
    createdAt: '2026-06-20'
  },
  {
    id: 'usr_03',
    name: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@kopinusantara.id',
    phone: '0815-1122-3344',
    role: 'cashier',
    assignedMerchantId: 'merch_01',
    assignedMerchantName: 'Kopi Nusantara Senopati',
    assignedOutletName: 'Outlet Senopati Utama',
    pinCode: '123456',
    status: 'active',
    lastLoginAt: '2026-08-20 15:45 WIB',
    createdAt: '2026-07-01'
  },
  {
    id: 'usr_04',
    name: 'Chef Mike Kurniawan',
    email: 'mike@senopatidining.co.id',
    phone: '0817-4455-6677',
    role: 'kitchen',
    assignedMerchantId: 'merch_02',
    assignedMerchantName: 'Senopati Dining & Lounge',
    assignedOutletName: 'Main Dining Hall',
    pinCode: '654321',
    status: 'active',
    lastLoginAt: '2026-08-20 13:00 WIB',
    createdAt: '2026-07-05'
  },
  {
    id: 'usr_05',
    name: 'Dewi Lestari, SE',
    email: 'dewi.akuntan@senopatidining.co.id',
    phone: '0818-7788-9900',
    role: 'accountant',
    assignedMerchantId: 'merch_02',
    assignedMerchantName: 'Senopati Dining & Lounge',
    assignedOutletName: 'Headquarters',
    pinCode: '998877',
    status: 'active',
    lastLoginAt: '2026-08-19 18:00 WIB',
    createdAt: '2026-07-10'
  }
]
