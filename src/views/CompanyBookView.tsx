import React, { useState } from 'react'
import {
  BookOpen,
  FolderTree,
  FileText,
  Scale,
  Landmark,
  PieChart,
  Receipt,
  ShieldCheck,
  ChevronDown,
  Calendar,
  Download,
  Plus,
  RefreshCw,
  Flame,
  Trees,
  Building2
} from 'lucide-react'
import { AccountingTabId } from '../types/accounting'
import {
  MOCK_CHART_OF_ACCOUNTS,
  MOCK_JOURNAL_ENTRIES,
  MOCK_TRIAL_BALANCE,
  MOCK_BALANCE_SHEET,
  MOCK_PROFIT_AND_LOSS,
  MOCK_TAX_OBLIGATIONS
} from '../data/accountingMockData'
import {
  CoATreeHierarchy,
  JournalEntryTable,
  TrialBalanceView,
  BalanceSheetStatement,
  ProfitAndLossStatement,
  TaxCompliancePortal,
  InventoryAssemblyModal,
  BiologicalAssetRegistry,
  ConsolidatedStatementView
} from '../components/book'

export interface CompanyBookViewProps {
  bookId?: string
  initialTab?: AccountingTabId
}

interface BookOption {
  id: string
  name: string
  currency: string
  type: string
}

const AVAILABLE_BOOKS: BookOption[] = [
  { id: 'BOOK-CAFE-HQ-88', name: 'PT Maju Jaya Bersama (IDR)', currency: 'IDR', type: 'Headquarter Book' },
  { id: 'BOOK-BR-01', name: 'Kopitiam Senopati Branch', currency: 'IDR', type: 'Outlet Branch Book' },
  { id: 'BOOK-BR-02', name: 'Kopitiam Kemang Roastery', currency: 'IDR', type: 'Outlet Branch Book' }
]

const ACCOUNTING_PERIODS = [
  'Agustus 2026 (YTD)',
  'Juli 2026',
  'Juni 2026',
  'Q3 2026 (Proyeksi)',
  'Tahun Buku 2026'
]

export const CompanyBookView: React.FC<CompanyBookViewProps> = ({
  bookId = 'BOOK-CAFE-HQ-88',
  initialTab = 'coa'
}) => {
  const [activeTab, setActiveTab] = useState<AccountingTabId>(initialTab)
  const [selectedBookId, setSelectedBookId] = useState<string>(bookId)
  const [selectedPeriod, setSelectedPeriod] = useState<string>(ACCOUNTING_PERIODS[0])
  const [isBookDropdownOpen, setIsBookDropdownOpen] = useState(false)
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false)

  const activeBook = AVAILABLE_BOOKS.find((b) => b.id === selectedBookId) || AVAILABLE_BOOKS[0]

  const tabs: { id: AccountingTabId; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'coa', label: 'Bagan Akun (CoA)', icon: <FolderTree className="w-4 h-4" />, count: MOCK_CHART_OF_ACCOUNTS.length },
    { id: 'journals', label: 'Jurnal Umum', icon: <FileText className="w-4 h-4" />, count: MOCK_JOURNAL_ENTRIES.length },
    { id: 'trial-balance', label: 'Neraca Saldo', icon: <Scale className="w-4 h-4" /> },
    { id: 'balance-sheet', label: 'Neraca Keuangan', icon: <Landmark className="w-4 h-4" /> },
    { id: 'pnl', label: 'Laba Rugi (P&L)', icon: <PieChart className="w-4 h-4" /> },
    { id: 'tax', label: 'Portal Pajak (PB1)', icon: <Receipt className="w-4 h-4" />, count: MOCK_TAX_OBLIGATIONS.length },
    { id: 'assembly', label: 'Perakitan BOM', icon: <Flame className="w-4 h-4" /> },
    { id: 'bio-assets', label: 'Aset Biologis (PSAK 69)', icon: <Trees className="w-4 h-4" /> },
    { id: 'consolidation', label: 'Konsolidasi Grup', icon: <Building2 className="w-4 h-4" /> }
  ]

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto no-scrollbar">
      {/* 1. STICKY SUBHEADER: BOOK SELECTOR, PERIOD PICKER & TIGERBEETLE KERNEL STATUS */}
      <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
        {/* Left: Book Switcher Dropdown */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>

          <div className="relative min-w-0">
            <button
              type="button"
              onClick={() => {
                setIsBookDropdownOpen(!isBookDropdownOpen)
                setIsPeriodDropdownOpen(false)
              }}
              className="flex items-center gap-2 text-left bg-slate-950 hover:bg-slate-850 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all group"
            >
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                  Buku Kas Perusahaan
                </span>
                <span className="text-xs font-black text-white truncate block">
                  {activeBook.name}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white shrink-0 ml-1" />
            </button>

            {isBookDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 animate-scaleUp">
                {AVAILABLE_BOOKS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setSelectedBookId(b.id)
                      setIsBookDropdownOpen(false)
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs flex flex-col gap-0.5 transition-colors ${
                      selectedBookId === b.id
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="font-bold text-white">{b.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{b.id} • {b.type}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center/Right: Period Picker & TigerBeetle Status */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Period Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsPeriodDropdownOpen(!isPeriodDropdownOpen)
                setIsBookDropdownOpen(false)
              }}
              className="flex items-center gap-2 bg-slate-950 hover:bg-slate-850 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono font-bold text-slate-200"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{selectedPeriod}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isPeriodDropdownOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 animate-scaleUp">
                {ACCOUNTING_PERIODS.map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => {
                      setSelectedPeriod(period)
                      setIsPeriodDropdownOpen(false)
                    }}
                    className={`w-full text-left p-2 rounded-xl text-xs font-mono transition-colors ${
                      selectedPeriod === period
                        ? 'bg-amber-500/20 text-amber-300 font-bold'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active Posting Engine Badge */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>TigerBeetle Financial Kernel: Active</span>
          </div>
        </div>
      </div>

      {/* 2. HORIZONTAL TAB STRIP */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 pt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-b-2 shrink-0 ${
                isActive
                  ? 'bg-slate-950 text-white border-amber-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-850/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* 3. ACTIVE TAB CONTENT PANEL */}
      <div className="p-4 sm:p-6 flex-1 max-w-7xl w-full mx-auto animate-fadeIn">
        {activeTab === 'coa' && (
          <CoATreeHierarchy accounts={MOCK_CHART_OF_ACCOUNTS} />
        )}

        {activeTab === 'journals' && (
          <JournalEntryTable entries={MOCK_JOURNAL_ENTRIES} />
        )}

        {activeTab === 'trial-balance' && (
          <TrialBalanceView rows={MOCK_TRIAL_BALANCE} periodName={selectedPeriod} />
        )}

        {activeTab === 'balance-sheet' && (
          <BalanceSheetStatement data={MOCK_BALANCE_SHEET} />
        )}

        {activeTab === 'pnl' && (
          <ProfitAndLossStatement data={MOCK_PROFIT_AND_LOSS} />
        )}

        {activeTab === 'tax' && (
          <TaxCompliancePortal obligations={MOCK_TAX_OBLIGATIONS} />
        )}

        {activeTab === 'assembly' && (
          <InventoryAssemblyModal />
        )}

        {activeTab === 'bio-assets' && (
          <BiologicalAssetRegistry />
        )}

        {activeTab === 'consolidation' && (
          <ConsolidatedStatementView />
        )}
      </div>
    </div>
  )
}
