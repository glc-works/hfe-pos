import React, { useState, useMemo } from 'react'
import { Search, ShieldCheck, Zap, Settings, Plus } from 'lucide-react'
import { ConnectorInstallModal } from './ConnectorInstallModal'
import { CONNECTORS_DATA, EcosystemConnector } from './connectorsData'

export { CONNECTORS_DATA }
export type { EcosystemConnector }

export interface ConnectorsCatalogGridProps {
  onSelectConnectorForSim?: (connector: EcosystemConnector) => void
  onOpenAllowlistModal?: (connector: EcosystemConnector) => void
}

export const ConnectorsCatalogGrid: React.FC<ConnectorsCatalogGridProps> = ({
  onSelectConnectorForSim,
  onOpenAllowlistModal
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [installedSlugs, setInstalledSlugs] = useState<string[]>([
    'bca-snap-bi-gateway',
    'xero-sync-connector',
    'djp-efaktur-gateway'
  ])
  const [activeModalConnector, setActiveModalConnector] = useState<EcosystemConnector | null>(null)

  const filtered = useMemo(() => {
    return CONNECTORS_DATA.filter((c) => {
      const matchRegion = selectedRegion === 'all' || c.region === selectedRegion
      const matchCat = selectedCategory === 'all' || c.category === selectedCategory
      const query = searchQuery.toLowerCase().trim()
      const matchQuery =
        !query ||
        c.name.toLowerCase().includes(query) ||
        c.slug.toLowerCase().includes(query) ||
        c.summary.toLowerCase().includes(query)
      return matchRegion && matchCat && matchQuery
    })
  }, [selectedRegion, selectedCategory, searchQuery])

  const handleOpenInstall = (connector: EcosystemConnector) => {
    setActiveModalConnector(connector)
  }

  const handleInstallSave = (
    connector: EcosystemConnector,
    _creds: Record<string, string>,
    _scopes: string[]
  ) => {
    if (!installedSlugs.includes(connector.slug)) {
      setInstalledSlugs((prev) => [...prev, connector.slug])
    }
  }

  const handleDisconnect = (connector: EcosystemConnector) => {
    setInstalledSlugs((prev) => prev.filter((s) => s !== connector.slug))
  }

  return (
    <div className="space-y-4">
      {/* Control Bar: Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Region Selector */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg px-3 py-2 outline-none focus:border-sky-500"
          >
            <option value="all">🌍 Semua Yurisdiksi (Global)</option>
            <option value="id">🇮🇩 Indonesia (SNAP BI, Jurnal, Moka)</option>
            <option value="sg">🇸🇬 Singapore (PayNow, InvoiceNow)</option>
            <option value="hk">🇭🇰 Hong Kong (FPS, Octopus)</option>
            <option value="uae">🇦🇪 UAE &amp; Dubai (EmaraTax, Foodics)</option>
            <option value="us">🇺🇸 USA (Plaid, Toast)</option>
            <option value="eu">🇪🇺 EU (SEPA, Adyen)</option>
          </select>

          {/* Category Selector */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg px-3 py-2 outline-none focus:border-sky-500"
          >
            <option value="all">📂 Semua Kategori</option>
            <option value="accounting">Cloud Accounting Bridges</option>
            <option value="banking">Open Banking &amp; SNAP BI</option>
            <option value="payments">Payment Gateways</option>
            <option value="pos">POS &amp; Kasir Terminal</option>
            <option value="ecommerce">Omnichannel E-Commerce</option>
            <option value="tax">Tax &amp; E-Invoicing</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px] flex-1 sm:flex-none">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari konektor (BCA, Xero, Toast)..."
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 pl-9 pr-3 py-2 text-xs rounded-lg outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Grid Cards (Fibonacci Spatial Isolation & Anti-Collision) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((connector) => {
          const isInstalled = installedSlugs.includes(connector.slug)
          return (
            <div
              key={connector.slug}
              className={`bg-slate-900/80 hover:bg-slate-850 border rounded-xl p-4 flex flex-col justify-between transition-all duration-200 group shadow-sm hover:shadow-md ${
                isInstalled ? 'border-sky-500/50 bg-slate-900/95' : 'border-slate-800 hover:border-sky-500/40'
              }`}
            >
              {/* Header: Icon, Name & Track Pill */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center text-xl shrink-0">
                      {connector.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-slate-100 truncate group-hover:text-sky-400 transition-colors">
                        {connector.name}
                      </div>
                      <div className="font-mono text-[10px] text-slate-500 truncate">
                        {connector.slug}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {isInstalled && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/40 uppercase">
                        Active
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        connector.track === 'stable'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : connector.track === 'beta'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                      }`}
                    >
                      {connector.track}
                    </span>
                  </div>
                </div>

                {/* Summary text */}
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
                  {connector.summary}
                </p>
              </div>

              {/* Footer: Metadata & Actions */}
              <div>
                <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] mb-3">
                  <div className="flex items-center gap-1.5">
                    {connector.verified ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Official</span>
                      </span>
                    ) : (
                      <span className="text-slate-500">Community</span>
                    )}
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400 uppercase font-mono">{connector.region}</span>
                  </div>
                  <div className="font-mono tabular-nums text-slate-400 font-medium">
                    {connector.installs + (isInstalled ? 1 : 0)} installs
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenInstall(connector)}
                    className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${
                      isInstalled
                        ? 'bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700'
                        : 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold shadow-sm'
                    }`}
                  >
                    {isInstalled ? (
                      <>
                        <Settings className="w-3 h-3 text-sky-400" />
                        <span>Konfigurasi</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        <span>Pasang</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectConnectorForSim?.(connector)}
                    className="py-1.5 px-2.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 border border-sky-500/30 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Simulasi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenAllowlistModal?.(connector)}
                    className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Allowlist
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Dynamic Connector Install Modal */}
      <ConnectorInstallModal
        isOpen={Boolean(activeModalConnector)}
        onClose={() => setActiveModalConnector(null)}
        connector={activeModalConnector}
        isInstalled={
          activeModalConnector ? installedSlugs.includes(activeModalConnector.slug) : false
        }
        onInstall={handleInstallSave}
        onDisconnect={handleDisconnect}
      />
    </div>
  )
}
