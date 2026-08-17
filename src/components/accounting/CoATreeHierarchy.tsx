import React, { useState } from 'react'
import {
  FolderTree,
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  CreditCard,
  Building2,
  DollarSign,
  Plus
} from 'lucide-react'
import { ChartOfAccount, AccountCategory } from '../../types/accounting'
import { PriceTag } from '../../ui/PriceTag'

export interface CoATreeHierarchyProps {
  accounts: ChartOfAccount[]
  onSelectAccount?: (account: ChartOfAccount) => void
}

const CATEGORY_META: Record<AccountCategory, { name: string; icon: React.ReactNode; color: string; badge: string }> = {
  asset: { name: '1. Aset (Assets)', icon: <Building2 className="w-4 h-4" />, color: 'text-sky-400 bg-sky-500/10 border-sky-500/30', badge: 'Normal: Debit' },
  liability: { name: '2. Kewajiban (Liabilities)', icon: <CreditCard className="w-4 h-4" />, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', badge: 'Normal: Kredit' },
  equity: { name: '3. Ekuitas & Modal (Equity)', icon: <DollarSign className="w-4 h-4" />, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', badge: 'Normal: Kredit' },
  revenue: { name: '4. Pendapatan (Revenue)', icon: <TrendingUp className="w-4 h-4" />, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', badge: 'Normal: Kredit' },
  cogs: { name: '5. Beban Pokok (COGS)', icon: <AlertCircle className="w-4 h-4" />, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', badge: 'Normal: Debit' },
  expense: { name: '6. Beban Operasional (Expenses)', icon: <AlertCircle className="w-4 h-4" />, color: 'text-orange-400 bg-orange-500/10 border-orange-500/30', badge: 'Normal: Debit' }
}

const CATEGORIES_ORDER: AccountCategory[] = ['asset', 'liability', 'equity', 'revenue', 'cogs', 'expense']

export const CoATreeHierarchy: React.FC<CoATreeHierarchyProps> = ({
  accounts,
  onSelectAccount
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<AccountCategory | 'all'>('all')

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || acc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-3 sm:p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode akun atau nama (e.g. 1-1001, Kas, Bank, Utang)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Semua ({accounts.length})
          </button>
          {CATEGORIES_ORDER.map((cat) => {
            const count = accounts.filter((a) => a.category === cat).length
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {CATEGORY_META[cat].name.split(' ')[1]} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Hierarchical Group Listing */}
      <div className="flex flex-col gap-4">
        {CATEGORIES_ORDER.filter((cat) => selectedCategory === 'all' || selectedCategory === cat).map((cat) => {
          const groupAccounts = filteredAccounts.filter((a) => a.category === cat)
          if (groupAccounts.length === 0) return null

          const totalBalance = groupAccounts.reduce((sum, a) => sum + a.balance, 0)
          const meta = CATEGORY_META[cat]

          return (
            <div key={cat} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              {/* Category Header */}
              <div className="p-3 sm:p-4 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-1.5 rounded-lg border ${meta.color}`}>
                    {meta.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-white truncate">{meta.name}</h3>
                    <span className="text-[10px] font-mono text-slate-400">{groupAccounts.length} Akun Terdaftar</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    {meta.badge}
                  </span>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Subtotal</span>
                    <PriceTag amount={totalBalance} size="sm" variant={cat === 'asset' || cat === 'revenue' ? 'emerald' : 'default'} />
                  </div>
                </div>
              </div>

              {/* Accounts Table List */}
              <div className="divide-y divide-slate-800/60">
                {groupAccounts.map((acc) => (
                  <div
                    key={acc.code}
                    onClick={() => onSelectAccount?.(acc)}
                    className="p-3 sm:p-3.5 hover:bg-slate-850/50 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono font-bold text-amber-400 shrink-0">
                        {acc.code}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-100 group-hover:text-white truncate">
                            {acc.name}
                          </span>
                          {acc.isReconciled && (
                            <span title="Rekonsiliasi Kernel OK" className="text-emerald-400 shrink-0">
                              <CheckCircle2 className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{acc.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 text-right">
                      <div className="flex flex-col items-end">
                        <PriceTag amount={acc.balance} size="sm" variant={acc.balance < 0 ? 'accent' : 'default'} />
                        <span className="text-[10px] font-mono text-slate-500 uppercase">
                          {acc.normalBalance}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
