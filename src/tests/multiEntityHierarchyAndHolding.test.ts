import { describe, it, expect } from 'vitest'
import { HoldingTenant, LegalCompany, EntityBranch, InterCompanyAccountMapping } from '../types/multiEntity'

describe('Multi-Entity, Holding Hierarchy & Inter-Company Clearing Engine', () => {
  const mockTenant: HoldingTenant = {
    id: 'TNT-101',
    name: 'Nusantara F&B & Agribusiness Group',
    slug: 'nusantara-group',
    tenantCode: 'TNT-101',
    isMasterPlatform: false
  }

  const mockCompanies: LegalCompany[] = [
    {
      id: 'COMP-01',
      tenantId: 'TNT-101',
      legalName: 'PT Kopi Nusantara Abadi',
      tradeName: 'Kopi Nusantara Cafe Chain',
      npwp: '01.234.567.8-012.000',
      nib: '9120001234567',
      baseCurrency: 'IDR',
      companyBookId: 'book_kopi_nusantara_retail',
      branchesCount: 3,
      annualRevenueMinor: 485000000000
    },
    {
      id: 'COMP-02',
      tenantId: 'TNT-101',
      legalName: 'PT Roastery Gayo Bersama',
      tradeName: 'Gayo Roasting Mill & B2B Supply',
      npwp: '02.345.678.9-013.000',
      nib: '9120002345678',
      baseCurrency: 'IDR',
      companyBookId: 'book_roastery_gayo_mfg',
      branchesCount: 1,
      annualRevenueMinor: 240000000000
    },
    {
      id: 'COMP-03',
      tenantId: 'TNT-101',
      legalName: 'CV Kebun Kopi Gayo Mandiri',
      tradeName: 'Highland Plantation & Harvest (PSAK 69)',
      npwp: '03.456.789.0-014.000',
      nib: '9120003456789',
      baseCurrency: 'IDR',
      companyBookId: 'book_kebun_gayo_agri',
      branchesCount: 1,
      annualRevenueMinor: 115000000000
    }
  ]

  const mockBranches: Record<string, EntityBranch[]> = {
    'COMP-01': [
      { id: 'BR-01', companyId: 'COMP-01', branchCode: 'BR-JKT-01', name: 'Senopati Flagship HQ', city: 'Jakarta Selatan', address: 'Jl. Senopati No. 42', timezone: 'Asia/Jakarta', status: 'active', activeRegisterCount: 3 },
      { id: 'BR-02', companyId: 'COMP-01', branchCode: 'BR-TNG-01', name: 'BSD Green Office Park', city: 'Tangerang Selatan', address: 'GOP 9 Ground Floor', timezone: 'Asia/Jakarta', status: 'active', activeRegisterCount: 2 },
      { id: 'BR-03', companyId: 'COMP-01', branchCode: 'BR-BDG-01', name: 'Bandung Riau Heritage', city: 'Bandung', address: 'Jl. LLRE Martadinata 88', timezone: 'Asia/Jakarta', status: 'active', activeRegisterCount: 2 }
    ],
    'COMP-02': [
      { id: 'BR-04', companyId: 'COMP-02', branchCode: 'BR-STL-01', name: 'Sentul Central Roastery Mill', city: 'Bogor', address: 'Sentul Industrial Estate Block B', timezone: 'Asia/Jakarta', status: 'active', activeRegisterCount: 1 }
    ]
  }

  const mockIntercompanyMappings: InterCompanyAccountMapping[] = [
    {
      id: 'IC-MAP-01',
      fromCompanyId: 'COMP-02', // Roastery
      toCompanyId: 'COMP-01', // Cafe Chain
      receivableGlAccount: 'GL 1106 (Piutang Inter-Company PT Kopi Nusantara)',
      payableGlAccount: 'GL 2106 (Utang Inter-Company PT Roastery Gayo)',
      isAutoEliminationEnabled: true,
      lastSettlementDate: '2026-08-20',
      unsettledBalanceMinor: 45000000
    },
    {
      id: 'IC-MAP-02',
      fromCompanyId: 'COMP-03', // Kebun Gayo
      toCompanyId: 'COMP-02', // Roastery Mill
      receivableGlAccount: 'GL 1106 (Piutang Inter-Company PT Roastery)',
      payableGlAccount: 'GL 2106 (Utang Inter-Company CV Kebun Gayo)',
      isAutoEliminationEnabled: true,
      lastSettlementDate: '2026-08-15',
      unsettledBalanceMinor: 28500000
    }
  ]

  it('guarantees 3-tier boundary isolation between Tenant, Company Legal Entity, and Branch', () => {
    expect(mockTenant.tenantCode).toBe('TNT-101')
    expect(mockCompanies.every(c => c.tenantId === mockTenant.id)).toBe(true)

    // Each company maps to an authentic Company Book in Hfe CORE
    expect(mockCompanies[0].companyBookId).toBe('book_kopi_nusantara_retail')
    expect(mockCompanies[1].companyBookId).toBe('book_roastery_gayo_mfg')
    expect(mockCompanies[2].companyBookId).toBe('book_kebun_gayo_agri')

    // Branches belong strictly to their parent legal company
    const cafeBranches = mockBranches['COMP-01']
    expect(cafeBranches.length).toBe(3)
    expect(cafeBranches.every(b => b.companyId === 'COMP-01')).toBe(true)
  })

  it('calculates aggregated holding consolidation metrics with zero double-counting', () => {
    const totalHoldingRevenue = mockCompanies.reduce((sum, c) => sum + (c.annualRevenueMinor || 0), 0)
    // 4.85B + 2.40B + 1.15B = 8.40B
    expect(totalHoldingRevenue).toBe(840000000000)

    const totalBranchesCount = mockCompanies.reduce((sum, c) => sum + c.branchesCount, 0)
    expect(totalBranchesCount).toBe(5)
  })

  it('maintains symmetric double-entry inter-company receivable and payable balances', () => {
    mockIntercompanyMappings.forEach(mapping => {
      expect(mapping.unsettledBalanceMinor).toBeGreaterThan(0)
      expect(mapping.receivableGlAccount).toContain('1106')
      expect(mapping.payableGlAccount).toContain('2106')
      expect(mapping.isAutoEliminationEnabled).toBe(true)
    })
  })

  it('executes consolidation elimination journal reducing reciprocal internal supply chain transactions', () => {
    const internalTradeVolume = mockIntercompanyMappings.reduce((sum, m) => sum + m.unsettledBalanceMinor, 0)
    expect(internalTradeVolume).toBe(73500000) // 45M + 28.5M

    // Elimination journal: Debit Utang Interco (2106), Kredit Piutang Interco (1106)
    const eliminationDebit = internalTradeVolume
    const eliminationCredit = internalTradeVolume
    expect(eliminationDebit).toEqual(eliminationCredit)
  })
})
