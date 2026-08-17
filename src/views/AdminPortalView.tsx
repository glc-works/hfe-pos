import React, { useState } from 'react'
import {
  Server,
  Zap,
  ShieldCheck,
  Building,
  CreditCard,
  Key,
  Globe
} from 'lucide-react'
import { WholesaleBillingInspector } from '../components/admin/WholesaleBillingInspector'
import { Badge } from '@/ui'

export type AdminPortalTab = 'wholesale-billing' | 'tenant-isolation' | 'api-quotas'

export const AdminPortalView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminPortalTab>('wholesale-billing')

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-8 space-y-6">
      {/* HEADER BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>HFE Platform Super-Admin &amp; Tenant B2B Portal</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full">
                Pillar 2 Core Admin
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Super-Admin B2B Compute Metering, Multi-Tenant Dual-Ledger Postings &amp; Infrastructure Governance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>TENANT ISOLATION KERNEL ACTIVE</span>
        </div>
      </div>

      {/* HORIZONTAL TAB STRIP */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('wholesale-billing')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'wholesale-billing'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5 text-purple-400" />
          <span>B2B Wholesale Compute Metering (Tenant 02)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tenant-isolation')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'tenant-isolation'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>RLS &amp; Tenant Partitioning</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('api-quotas')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'api-quotas'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Rate Limits &amp; TigerBeetle SLAs</span>
        </button>
      </div>

      {/* ACTIVE TAB CONTENT */}
      <div>
        {activeTab === 'wholesale-billing' && <WholesaleBillingInspector />}

        {activeTab === 'tenant-isolation' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-xs space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Tenant Isolation &amp; Row-Level Security Matrix
            </h3>
            <p className="text-slate-400">
              Setiap mutasi akuntansi dan pos data diisolasi secara deterministik berdasarkan `company_book_id` UUID dan Tenant Context Header `X-Tenant-Id`.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="font-bold text-white">Tenant 01 (Platform HoldCo)</div>
                <div className="text-[11px] text-emerald-400 font-mono mt-1">Status: Active Root</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="font-bold text-white">Tenant 02 (Merchant Enterprise)</div>
                <div className="text-[11px] text-sky-400 font-mono mt-1">Status: Isolated Tenant</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="font-bold text-white">TigerBeetle Dual-Ledger Bridge</div>
                <div className="text-[11px] text-purple-400 font-mono mt-1">Status: Zero-Cross-Leak</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api-quotas' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-xs space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Compute Quotas &amp; Throughput Limits
            </h3>
            <p className="text-slate-400">
              Tenant 02 dialokasikan kuota hingga 5.000.000 mutasi/bulan dengan burst throughput 500 TPS.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
