import React, { useState, useMemo } from 'react'
import {
  Globe,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Filter,
  Layers,
  ArrowUpRight
} from 'lucide-react'

export interface EcosystemConnector {
  slug: string
  name: string
  region: 'id' | 'sg' | 'hk' | 'uae' | 'us' | 'eu'
  category: 'accounting' | 'banking' | 'payments' | 'pos' | 'ecommerce' | 'tax'
  icon: string
  summary: string
  track: 'stable' | 'beta' | 'alpha'
  verified: boolean
  installs: number
  supportedVersions: string[]
  officialDocsUrl?: string
}

export const CONNECTORS_DATA: EcosystemConnector[] = [
  // 🇮🇩 Indonesia (ID)
  {
    slug: 'bca-snap-bi-gateway',
    name: 'BCA SNAP BI Gateway',
    region: 'id',
    category: 'banking',
    icon: '🏦',
    summary: 'KlikBCA corporate statement feeds, balance inquiry & BI-FAST settlement normalizer.',
    track: 'stable',
    verified: true,
    installs: 142,
    supportedVersions: ['v1.0', 'SNAP-BI-2.0']
  },
  {
    slug: 'mandiri-mcm-snap-bi',
    name: 'Mandiri MCM 2.0 SNAP',
    region: 'id',
    category: 'banking',
    icon: '🏦',
    summary: 'Bank Mandiri MCM 2.0 corporate banking & dynamic bill payment auto-reconciliation.',
    track: 'stable',
    verified: true,
    installs: 98,
    supportedVersions: ['v2.1', 'SNAP-BI-2.0']
  },
  {
    slug: 'bri-briapi-snap-gateway',
    name: 'BRI BRIAPI SNAP',
    region: 'id',
    category: 'banking',
    icon: '🏦',
    summary: 'Bank BRI BRIVA virtual accounts and real-time ledger statement sync.',
    track: 'stable',
    verified: true,
    installs: 84,
    supportedVersions: ['v2.0']
  },
  {
    slug: 'bank-jago-bisnis-connector',
    name: 'Bank Jago Bisnis',
    region: 'id',
    category: 'banking',
    icon: '📱',
    summary: 'Neobank business pockets sync to dedicated COA Cash & Bank accounts.',
    track: 'beta',
    verified: true,
    installs: 56,
    supportedVersions: ['v0.9-dev', 'v1.0-rc']
  },
  {
    slug: 'moka-pos-sync',
    name: 'Moka POS Next-Gen',
    region: 'id',
    category: 'pos',
    icon: '☕',
    summary: 'GoTo Moka POS shift closing, gross/net revenue splitting & COGS depletion.',
    track: 'beta',
    verified: true,
    installs: 210,
    supportedVersions: ['v2.0', 'v2.1-rc']
  },
  {
    slug: 'esb-resto-enterprise',
    name: 'ESB Resto Enterprise',
    region: 'id',
    category: 'pos',
    icon: '🍽️',
    summary: 'Enterprise restaurant POS with split-bill & 5-10% service charge accounting.',
    track: 'stable',
    verified: true,
    installs: 135,
    supportedVersions: ['v3.4']
  },
  {
    slug: 'gofood-grabfood-merchant-sync',
    name: 'GoFood & GrabFood Sync',
    region: 'id',
    category: 'ecommerce',
    icon: '🛵',
    summary: 'Food delivery 20% commission & net payout auto-reconciliation into posting journals.',
    track: 'stable',
    verified: true,
    installs: 180,
    supportedVersions: ['v1.5']
  },
  {
    slug: 'xero-sync-connector',
    name: 'Xero Cloud Sync',
    region: 'id',
    category: 'accounting',
    icon: '📊',
    summary: 'Bi-directional sync and 1-click historical migration from Xero API.',
    track: 'stable',
    verified: true,
    installs: 310,
    supportedVersions: ['v2.0']
  },
  {
    slug: 'mekari-jurnal-sync-connector',
    name: 'Mekari Jurnal Sync',
    region: 'id',
    category: 'accounting',
    icon: '📒',
    summary: 'Native import and live sync from Jurnal.id Open API ledger books.',
    track: 'stable',
    verified: true,
    installs: 240,
    supportedVersions: ['v1.8']
  },
  {
    slug: 'accurate-online-sync-connector',
    name: 'Accurate Online Bridge',
    region: 'id',
    category: 'accounting',
    icon: '📗',
    summary: 'CPSSoft Accurate Online master data and opening balance synchronization.',
    track: 'stable',
    verified: true,
    installs: 195,
    supportedVersions: ['v2.2']
  },
  {
    slug: 'djp-efaktur-gateway',
    name: 'DJP e-Faktur Gateway',
    region: 'id',
    category: 'tax',
    icon: '🏛️',
    summary: 'Directorate General of Taxes electronic invoice generation and tax filing.',
    track: 'stable',
    verified: true,
    installs: 420,
    supportedVersions: ['v3.2', 'v4.0-coretax']
  },

  // 🇸🇬 Singapore (SG)
  {
    slug: 'sg-paynow-fast-gateway',
    name: 'Singapore PayNow & FAST',
    region: 'sg',
    category: 'banking',
    icon: '🇸🇬',
    summary: 'DBS IDEAL, OCBC Velocity, UOB Infinity feeds and FAST settlement.',
    track: 'stable',
    verified: true,
    installs: 120,
    supportedVersions: ['v1.2']
  },
  {
    slug: 'sg-invoicenow-peppol',
    name: 'IMDA InvoiceNow Peppol',
    region: 'sg',
    category: 'tax',
    icon: '📨',
    summary: 'IMDA Peppol network e-invoicing and IRAS quarterly GST F5 return.',
    track: 'stable',
    verified: true,
    installs: 85,
    supportedVersions: ['BIS-3.0']
  },
  {
    slug: 'sg-qashier-storehub-pos',
    name: 'Qashier & StoreHub POS',
    region: 'sg',
    category: 'pos',
    icon: '🛒',
    summary: 'Singapore retail/F&B cashier terminal integration (GrabPay, PayLah!).',
    track: 'beta',
    verified: true,
    installs: 64,
    supportedVersions: ['v1.1-beta']
  },

  // 🇭🇰 Hong Kong (HK)
  {
    slug: 'hk-fps-banking-rail',
    name: 'HKMA Faster Payment (FPS)',
    region: 'hk',
    category: 'banking',
    icon: '🇭🇰',
    summary: 'HKMA 24/7 multicurrency FPS rail & HSBC Business Go integration.',
    track: 'stable',
    verified: true,
    installs: 95,
    supportedVersions: ['v1.0']
  },
  {
    slug: 'hk-octopus-alipay-pos',
    name: 'Octopus Card & e-Wallets',
    region: 'hk',
    category: 'pos',
    icon: '💳',
    summary: 'Octopus Card (八達通), AlipayHK, and WeChat Pay HK retail settlement.',
    track: 'beta',
    verified: true,
    installs: 72,
    supportedVersions: ['v0.9']
  },

  // 🇦🇪 UAE & Dubai (UAE)
  {
    slug: 'uae-fta-emaratax-vat',
    name: 'FTA EmaraTax (VAT & CT)',
    region: 'uae',
    category: 'tax',
    icon: '🇦🇪',
    summary: 'UAE Federal Tax Authority 5% VAT and 9% Corporate Tax engine.',
    track: 'stable',
    verified: true,
    installs: 110,
    supportedVersions: ['v1.0']
  },
  {
    slug: 'uae-foodics-pos-bridge',
    name: 'Foodics Cloud POS',
    region: 'uae',
    category: 'pos',
    icon: '🍔',
    summary: 'Leading GCC cloud restaurant and raw material inventory sync.',
    track: 'beta',
    verified: true,
    installs: 88,
    supportedVersions: ['v2.0-rc']
  },

  // 🇺🇸 United States (US)
  {
    slug: 'us-plaid-fednow-bridge',
    name: 'Plaid & FedNow ACH',
    region: 'us',
    category: 'banking',
    icon: '🇺🇸',
    summary: '12,000+ US banks Open Banking ingestion and FedNow / Nacha ACH.',
    track: 'stable',
    verified: true,
    installs: 280,
    supportedVersions: ['v2.0']
  },
  {
    slug: 'us-toast-clover-pos',
    name: 'Toast POS & Clover',
    region: 'us',
    category: 'pos',
    icon: '🍕',
    summary: 'US restaurant POS batching and kitchen display timing synchronization.',
    track: 'beta',
    verified: true,
    installs: 150,
    supportedVersions: ['v1.4-beta']
  },

  // 🇪🇺 European Union (EU)
  {
    slug: 'eu-sepa-instant-tink',
    name: 'SEPA Instant & Tink',
    region: 'eu',
    category: 'banking',
    icon: '🇪🇺',
    summary: 'Pan-European SEPA credit transfers and PSD2 open banking feeds.',
    track: 'stable',
    verified: true,
    installs: 230,
    supportedVersions: ['ISO-20022']
  },
  {
    slug: 'eu-adyen-mollie-gateway',
    name: 'Adyen & Mollie Gateway',
    region: 'eu',
    category: 'payments',
    icon: '💶',
    summary: 'iDEAL, Bancontact, Klarna, and global card acquiring settlement.',
    track: 'stable',
    verified: true,
    installs: 290,
    supportedVersions: ['v3.0']
  }
]

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
        {filtered.map((connector) => (
          <div
            key={connector.slug}
            className="bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-sky-500/40 rounded-xl p-4 flex flex-col justify-between transition-all duration-200 group shadow-sm hover:shadow-md"
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

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider ${
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
                  {connector.installs} installs
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectConnectorForSim?.(connector)}
                  className="flex-1 py-1.5 px-2.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 border border-sky-500/30 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
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
        ))}
      </div>
    </div>
  )
}
