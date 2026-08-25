// --- MULTI-ENTITY, HOLDING TOPOLOGY & INTER-COMPANY CLEARING TYPES ---

export interface HoldingTenant {
  id: string
  name: string
  slug: string
  tenantCode: string // e.g. 'TNT-01', 'TNT-101'
  isMasterPlatform: boolean
}

export interface LegalCompany {
  id: string
  tenantId: string
  legalName: string // e.g. 'PT Kopi Nusantara Abadi'
  tradeName: string // e.g. 'Kopi Nusantara'
  npwp: string
  nib: string
  baseCurrency: string // e.g. 'IDR'
  companyBookId: string // Link to Hfe CORE Book
  branchesCount: number
  annualRevenueMinor?: number
}

export interface EntityBranch {
  id: string
  companyId: string
  branchCode: string // e.g. 'BR-JKT-01'
  name: string // e.g. 'Senopati Flagship HQ'
  city: string
  address: string
  timezone: string // 'Asia/Jakarta'
  status: 'active' | 'maintenance' | 'closed'
  activeRegisterCount: number
}

export interface InterCompanyAccountMapping {
  id: string
  fromCompanyId: string
  toCompanyId: string
  receivableGlAccount: string // e.g. 'GL 1106 Piutang Antar Perusahaan'
  payableGlAccount: string // e.g. 'GL 2106 Utang Antar Perusahaan'
  isAutoEliminationEnabled: boolean
  lastSettlementDate?: string
  unsettledBalanceMinor: number
}

export type EntityViewScope = 'consolidated_holding' | 'single_company' | 'single_branch'

export interface EntityHierarchySelection {
  scope: EntityViewScope
  tenantId: string
  companyId?: string
  branchId?: string
}
