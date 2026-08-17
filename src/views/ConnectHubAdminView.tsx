import React, { useState } from 'react'
import {
  Globe,
  Key,
  ShieldCheck,
  Zap,
  Sparkles,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Building2,
  Server
} from 'lucide-react'
import {
  ConnectorsCatalogGrid,
  EcosystemConnector
} from '../components/connect_hub/ConnectorsCatalogGrid'
import { BetaAllowlistTable } from '../components/connect_hub/BetaAllowlistTable'
import { VendorClaimsTable } from '../components/connect_hub/VendorClaimsTable'
import { BankFeedSimulator } from '../components/connect_hub/BankFeedSimulator'
import { DeveloperKeysManager } from '../components/connect_hub/DeveloperKeysManager'

export type ConnectHubTab = 'catalog' | 'allowlist' | 'claims' | 'simulator' | 'keys'

export const ConnectHubAdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ConnectHubTab>('catalog')
  const [simulatorBank, setSimulatorBank] = useState<string>('BCA')

  const handleSelectConnectorForSim = (connector: EcosystemConnector) => {
    if (connector.category === 'banking') {
      const bankCode = connector.slug.includes('mandiri')
        ? 'MANDIRI'
        : connector.slug.includes('bri')
        ? 'BRI'
        : connector.slug.includes('jago')
        ? 'JAGO'
        : 'BCA'
      setSimulatorBank(bankCode)
    }
    setActiveTab('simulator')
  }

  const handleOpenAllowlist = (connector: EcosystemConnector) => {
    setActiveTab('allowlist')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>HFE Connect Hub &amp; Global Ecosystem</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full">
                  Operator Super-Admin
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Open Banking SNAP BI, Cloud Accounting Bridges, POS Terminals, and TestFlight-Style Beta Allowlist.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm" />
          <span>HFE KERNEL &amp; CONNECT HUB ENGINE ONLINE</span>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Konektor Global
          </div>
          <div className="text-2xl font-black font-mono tabular-nums text-white mt-1">45+</div>
          <div className="text-[11px] text-slate-500 mt-0.5">ID, SG, HK, UAE, US &amp; EU</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Bank Feeds &amp; SNAP BI
          </div>
          <div className="text-2xl font-black font-mono tabular-nums text-sky-400 mt-1">12</div>
          <div className="text-[11px] text-slate-500 mt-0.5">BCA, Mandiri, BRI, Jago, PayNow</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Beta Tenant Allowlist
          </div>
          <div className="text-2xl font-black font-mono tabular-nums text-amber-400 mt-1">8</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Enrolled Early Channels</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Vendor Claims Proved
          </div>
          <div className="text-2xl font-black font-mono tabular-nums text-emerald-400 mt-1">15</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Cryptographic Sentinel Verified</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'catalog'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-sky-400" />
          <span>Ecosystem Catalog (45+)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('allowlist')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'allowlist'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Beta Allowlist &amp; Gating</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('claims')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'claims'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Vendor Claims &amp; Proofs</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('simulator')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'simulator'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-sky-400" />
          <span>Bank Feed Simulator</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('keys')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'keys'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Key className="w-3.5 h-3.5 text-purple-400" />
          <span>Developer API Keys</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div>
        {activeTab === 'catalog' && (
          <ConnectorsCatalogGrid
            onSelectConnectorForSim={handleSelectConnectorForSim}
            onOpenAllowlistModal={handleOpenAllowlist}
          />
        )}

        {activeTab === 'allowlist' && <BetaAllowlistTable />}

        {activeTab === 'claims' && <VendorClaimsTable />}

        {activeTab === 'simulator' && <BankFeedSimulator initialBank={simulatorBank} />}

        {activeTab === 'keys' && <DeveloperKeysManager />}
      </div>
    </div>
  )
}
