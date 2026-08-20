import React, { useState } from 'react'
import { MerchantAccount, SubscriptionTier, MerchantStatus } from '../../types/admin'
import {
  Building2,
  Search,
  ExternalLink,
  ShieldCheck,
  Zap,
  Crown,
  AlertCircle,
  Radio,
  Sliders,
  Users
} from 'lucide-react'

export interface MerchantListSectionProps {
  merchants: MerchantAccount[]
  onSelectMerchant: (merchant: MerchantAccount) => void
  onAddNewMerchant?: () => void
}

export const MerchantListSection: React.FC<MerchantListSectionProps> = ({
  merchants,
  onSelectMerchant,
  onAddNewMerchant
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | MerchantStatus>('all')
  const [tierFilter, setTierFilter] = useState<'all' | SubscriptionTier>('all')

  const filteredMerchants = merchants.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.legalEntityName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter
    const matchesTier = tierFilter === 'all' || m.tier === tierFilter
    return matchesSearch && matchesStatus && matchesTier
  })

  // KPIs
  const totalMrr = merchants.reduce((sum, m) => sum + m.mrrAmountIdr, 0)
  const totalOutlets = merchants.reduce((sum, m) => sum + m.outletsCount, 0)
  const activeCount = merchants.filter((m) => m.status === 'active').length

  const getTierBadge = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'enterprise':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Crown className="w-3 h-3 text-purple-400" /> Enterprise
          </span>
        )
      case 'pro':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Zap className="w-3 h-3 text-indigo-400" /> Pro Growth
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
            Starter Free
          </span>
        )
    }
  }

  const getStatusBadge = (status: MerchantStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Aktif
          </span>
        )
      case 'trial':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Trial 14 Hari
          </span>
        )
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertCircle className="w-3 h-3" /> Suspended
          </span>
        )
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* 4-ZONE KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Total Merchant Terdaftar</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">{merchants.length}</span>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              {activeCount} Aktif
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Total Outlet / Cabang</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">{totalOutlets}</span>
            <Building2 className="w-4 h-4 text-indigo-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Total Monthly Recurring Revenue</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
              Rp {totalMrr.toLocaleString('id-ID')}
            </span>
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Ecosystem Tenancy Status</span>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold text-slate-200">Tenant 100+ Multi-Tenant</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS CONTROLS */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari merchant, PT, subdomain..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
            {(['all', 'active', 'trial', 'suspended'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all capitalize ${
                  statusFilter === st ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {st === 'all' ? 'Semua Status' : st}
              </button>
            ))}
          </div>

          {/* Tier Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
            {(['all', 'starter', 'pro', 'enterprise'] as const).map((tr) => (
              <button
                key={tr}
                type="button"
                onClick={() => setTierFilter(tr)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all capitalize ${
                  tierFilter === tr ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tr === 'all' ? 'Semua Paket' : tr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MERCHANTS DATA TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Merchant & Legal PT</th>
                <th className="py-3 px-4">Subdomain Storefront</th>
                <th className="py-3 px-4">Paket SaaS</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Outlet / Kasir</th>
                <th className="py-3 px-4 text-right">MRR (IDR)</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredMerchants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                    Tidak ada merchant yang cocok dengan pencarian atau filter.
                  </td>
                </tr>
              ) : (
                filteredMerchants.map((merchant) => (
                  <tr key={merchant.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-100">{merchant.name}</div>
                      <div className="text-[11px] text-slate-400 font-sans">{merchant.legalEntityName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Tenant ID: {merchant.tenantId}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-indigo-300">
                      <span className="flex items-center gap-1">
                        {merchant.subdomain}.pos.hfeit.com
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </span>
                    </td>
                    <td className="py-3.5 px-4">{getTierBadge(merchant.tier)}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(merchant.status)}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono font-bold text-slate-200 tabular-nums">
                        {merchant.outletsCount} Cabang • {merchant.activeCashiersCount} Kasir
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 tabular-nums">
                      Rp {merchant.mrrAmountIdr.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectMerchant(merchant)}
                        className="bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ml-auto shadow-sm"
                      >
                        <Sliders className="w-3 h-3" /> Kelola Toko
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
