import React, { useState } from 'react'
import { Card, Button, Badge, TruthChannelBadge } from '@/ui'
import { useDataTruth } from '@/context/DataTruthContext'
import { 
  Building2, Layers, GitFork, ArrowRightLeft, ShieldCheck, 
  ChevronRight, CheckCircle2, Globe, Store, Sparkles, RefreshCw, FileText
} from 'lucide-react'
import { 
  HoldingTenant, LegalCompany, EntityBranch, 
  InterCompanyAccountMapping, EntityViewScope, EntityHierarchySelection 
} from '../../types/multiEntity'

const MOCK_TENANT: HoldingTenant = {
  id: 'TNT-101',
  name: 'Nusantara F&B & Agribusiness Group',
  slug: 'nusantara-group',
  tenantCode: 'TNT-101',
  isMasterPlatform: false
}

const MOCK_COMPANIES: LegalCompany[] = [
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
    annualRevenueMinor: 485000000000 // 4.85 Miliar
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
    annualRevenueMinor: 240000000000 // 2.40 Miliar
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
    annualRevenueMinor: 115000000000 // 1.15 Miliar
  }
]

const MOCK_BRANCHES: Record<string, EntityBranch[]> = {
  'COMP-01': [
    { id: 'BR-01', companyId: 'COMP-01', branchCode: 'BR-JKT-01', name: 'Senopati Flagship HQ', city: 'Jakarta Selatan', address: 'Jl. Senopati No. 42', timezone: 'Asia/Jakarta', status: 'active', activeRegisterCount: 3 },
    { id: 'BR-02', companyId: 'COMP-01', branchCode: 'BR-TNG-01', name: 'BSD Green Office Park', city: 'Tangerang Selatan', address: 'GOP 9 Ground Floor', timezone: 'Asia/Jakarta', status: 'active', activeRegisterCount: 2 },
    { id: 'BR-03', companyId: 'COMP-01', branchCode: 'BR-BDG-01', name: 'Bandung Riau Heritage', city: 'Bandung', address: 'Jl. LLRE Martadinata 88', timezone: 'Asia/Jakarta', status: 'active', activeRegisterCount: 2 }
  ],
  'COMP-02': [
    { id: 'BR-04', companyId: 'COMP-02', branchCode: 'BR-STL-01', name: 'Sentul Central Roastery Mill', city: 'Bogor', address: 'Sentul Industrial Estate Block B', timezone: 'Asia/Jakarta', status: 'active', activeRegisterCount: 1 }
  ],
  'COMP-03': [
    { id: 'BR-05', companyId: 'COMP-03', branchCode: 'BR-TKG-01', name: 'Takengon Highland Lot 4', city: 'Aceh Tengah', address: 'Lereng Gunung Burni Telong', timezone: 'Asia/Jakarta', status: 'active', activeRegisterCount: 1 }
  ]
}

const MOCK_INTERCOMPANY_MAPPINGS: InterCompanyAccountMapping[] = [
  {
    id: 'IC-MAP-01',
    fromCompanyId: 'COMP-02', // Roastery
    toCompanyId: 'COMP-01', // Cafe Chain
    receivableGlAccount: 'GL 1106 (Piutang Inter-Company PT Kopi Nusantara)',
    payableGlAccount: 'GL 2106 (Utang Inter-Company PT Roastery Gayo)',
    isAutoEliminationEnabled: true,
    lastSettlementDate: '2026-08-20',
    unsettledBalanceMinor: 45000000 // Rp 45.000.000
  },
  {
    id: 'IC-MAP-02',
    fromCompanyId: 'COMP-03', // Kebun Gayo
    toCompanyId: 'COMP-02', // Roastery Mill
    receivableGlAccount: 'GL 1106 (Piutang Inter-Company PT Roastery)',
    payableGlAccount: 'GL 2106 (Utang Inter-Company CV Kebun Gayo)',
    isAutoEliminationEnabled: true,
    lastSettlementDate: '2026-08-15',
    unsettledBalanceMinor: 28500000 // Rp 28.500.000
  }
]

export const MultiEntityHoldingTab: React.FC = () => {
  const { channel } = useDataTruth()
  const isLiveCore = channel === 'live-core'
  const [selection, setSelection] = useState<EntityHierarchySelection>({
    scope: 'consolidated_holding',
    tenantId: MOCK_TENANT.id
  })
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('COMP-01')
  const [eliminationSuccess, setEliminationSuccess] = useState<boolean>(false)

  const activeCompany = MOCK_COMPANIES.find(c => c.id === selectedCompanyId) || MOCK_COMPANIES[0]
  const branchesOfActiveCompany = MOCK_BRANCHES[activeCompany.id] || []

  const totalHoldingRevenue = MOCK_COMPANIES.reduce((sum, c) => sum + (c.annualRevenueMinor || 0), 0)
  const totalBranchesCount = MOCK_COMPANIES.reduce((sum, c) => sum + c.branchesCount, 0)

  const handleRunElimination = () => {
    setEliminationSuccess(true)
    setTimeout(() => setEliminationSuccess(false), 3000)
  }

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100 font-sans">
      
      {/* 3-TIER BREADCRUMB & SCOPE SWITCHER BAR */}
      <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-black border border-purple-500/20">
              <Layers className="w-3.5 h-3.5" />
              <span>Grup: {MOCK_TENANT.name}</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20">
              <Building2 className="w-3.5 h-3.5" />
              <span>PT: {activeCompany.tradeName}</span>
            </div>
            {selection.branchId && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                  <Store className="w-3.5 h-3.5" />
                  <span>Cabang Senopati</span>
                </div>
              </>
            )}
            <TruthChannelBadge />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {(['consolidated_holding', 'single_company', 'single_branch'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSelection({ ...selection, scope: s })}
                className={`px-3 py-1 text-xs rounded-xl font-bold transition-all ${
                  selection.scope === s
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {s === 'consolidated_holding' ? '🌐 Konsolidasi Holding' : s === 'single_company' ? '🏛️ Entitas PT' : '📍 Per Cabang'}
              </button>
            ))}
          </div>

        </div>
      </Card>

      {/* TOP HOLDING METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-purple-950/20 via-background to-background border-purple-500/30">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1 text-purple-600 dark:text-purple-400">
              <Globe className="w-4 h-4" /> Total Omzet Konsolidasi
            </span>
            <Badge variant="outline" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-[10px]">
              Holding 3 PT
            </Badge>
          </div>
          <div className="text-2xl font-mono font-black text-slate-900 dark:text-white tabular-nums my-1">
            Rp {(totalHoldingRevenue / 100).toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            Total seluruh pendapatan entitas ritel, roastery, dan perkebunan dalam satu tenant.
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <Building2 className="w-4 h-4" /> Entitas Legal (PT & CV)
            </span>
            <Badge variant="outline" className="text-[10px]">
              {MOCK_COMPANIES.length} Entitas
            </Badge>
          </div>
          <div className="text-2xl font-mono font-black text-slate-900 dark:text-white tabular-nums my-1">
            {MOCK_COMPANIES.length} Perseroan
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            Terhubung ke masing-masing Buku Besar (Company Book) terisolasi di Hfe CORE.
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Store className="w-4 h-4" /> Jaringan Cabang & Pabrik
            </span>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
              {totalBranchesCount} Outlet Aktif
            </Badge>
          </div>
          <div className="text-2xl font-mono font-black text-slate-900 dark:text-white tabular-nums my-1">
            {totalBranchesCount} Lokasi Fisik
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            3 Cafe Senopati/BSD/Bandung + 1 Roastery Sentul + 1 Kebun Takengon.
          </p>
        </Card>
      </div>

      {/* 2-COLUMN STRUCTURE: COMPANIES & BRANCHES (LEFT) + INTER-COMPANY LINKAGE (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: COMPANY & BRANCH SELECTOR (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  Daftar Entitas Legal Perusahaan
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pilih entitas untuk melihat detail izin, nomor buku besar, dan daftar cabang
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {MOCK_COMPANIES.map(company => {
                const isSelected = company.id === selectedCompanyId
                return (
                  <div
                    key={company.id}
                    onClick={() => setSelectedCompanyId(company.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-purple-50 dark:bg-purple-950/20 border-purple-500 ring-1 ring-purple-500/30 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{company.legalName}</span>
                      <Badge variant="outline" className="text-[10px] font-mono bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30">
                        {company.companyBookId}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>{company.tradeName} • NPWP: <strong className="font-mono">{company.npwp}</strong></span>
                      <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                        {company.branchesCount} Cabang
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* BRANCHES LIST OF SELECTED COMPANY */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-blue-500" />
                Unit Kerja / Cabang di Bawah {activeCompany.legalName} ({branchesOfActiveCompany.length})
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {branchesOfActiveCompany.map(branch => (
                  <div
                    key={branch.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{branch.name}</span>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[9px]">
                        {branch.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {branch.branchCode} • {branch.city} • {branch.activeRegisterCount} Kasir POS
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </Card>
        </div>

        {/* RIGHT COLUMN: INTER-COMPANY ACCOUNT LINKAGE & ELIMINATION (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Kliring Saldo Antar-Perusahaan
                </h4>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                  Inter-Co GL
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Rekonsiliasi transaksi supply chain internal antara Roastery ⇄ Cafe Chain ⇄ Kebun Gayo.
              </p>
            </div>

            <div className="space-y-3">
              {MOCK_INTERCOMPANY_MAPPINGS.map(map => {
                const fromComp = MOCK_COMPANIES.find(c => c.id === map.fromCompanyId)
                const toComp = MOCK_COMPANIES.find(c => c.id === map.toCompanyId)
                return (
                  <div
                    key={map.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {fromComp?.tradeName} ➔ {toComp?.tradeName}
                      </span>
                      <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                        Rp {map.unsettledBalanceMinor.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="text-[10px] space-y-1 text-slate-500 dark:text-slate-400 font-mono bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                      <div>Piutang: {map.receivableGlAccount}</div>
                      <div>Utang: {map.payableGlAccount}</div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" /> 100% Simetris
                      </span>
                      <span>Kliring: {map.lastSettlementDate}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {eliminationSuccess && (
              <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 animate-fadeIn ${
                isLiveCore
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
              }`}>
                <div className={`flex items-center gap-2 font-bold ${
                  isLiveCore ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${
                    isLiveCore ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                  }`} />
                  <span>{isLiveCore ? '🟢 Jurnal Eliminasi Konsolidasi Diposting ke Hfe CORE:' : '🧪 Draft Jurnal Eliminasi Konsolidasi Dibuat (Memori Lokal):'}</span>
                </div>
                <div className={`font-mono text-[10px] bg-white dark:bg-slate-900 p-2 rounded border space-y-0.5 ${
                  isLiveCore ? 'border-emerald-500/20' : 'border-amber-500/20'
                }`}>
                  <div>Debit:  GL 2106 (Utang Inter-Co)   Rp 45.000.000</div>
                  <div>Kredit: GL 1106 (Piutang Inter-Co) Rp 45.000.000</div>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {isLiveCore
                    ? 'Posting berhasil diaplikasikan secara permanen pada multi-tenant general ledger Hfe CORE.'
                    : 'Draft tersimpan di sesi browser. Hubungkan ke Hfe CORE Multi-Tenant API untuk posting final.'}
                </p>
              </div>
            )}

            <Button
              onClick={handleRunElimination}
              className={`w-full text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg ${
                isLiveCore
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/40'
                  : 'bg-amber-600 hover:bg-amber-500 shadow-amber-950/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isLiveCore ? 'Posting Jurnal Eliminasi ke Hfe CORE' : 'Simulasikan Jurnal Eliminasi Konsolidasi'}</span>
            </Button>
          </Card>
        </div>

      </div>

    </div>
  )
}
export default MultiEntityHoldingTab
