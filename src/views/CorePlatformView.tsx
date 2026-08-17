import React, { useState } from 'react'
import {
  Cpu,
  Terminal,
  Layers,
  Globe,
  CreditCard,
  Database,
  Key,
  Zap,
  ExternalLink
} from 'lucide-react'
import { Button, Badge } from '@/ui'
import {
  CoreHeroSection,
  CoreArchitectureVisualizer,
  CorePillarsShowcase,
  CorePricingSection
} from '@/components/core/landing'
import {
  ConnectorsCatalogGrid,
  WebhookRelayPanel,
  BetaAllowlistTable,
  VendorClaimsTable,
  DeveloperKeysManager
} from '@/components/core/hub'
import { ScalarApiExplorer } from '@/components/core/docs/ScalarApiExplorer'
import { DoubleEntrySandbox } from '@/components/core/sandbox/DoubleEntrySandbox'

export type CorePlatformTab =
  | 'overview'
  | 'connect-hub'
  | 'pricing'
  | 'api-docs'
  | 'sandbox'
  | 'console'

export interface CorePlatformViewProps {
  initialTab?: CorePlatformTab
  onSwitchToPos?: () => void
  className?: string
}

interface NavTabItem {
  id: CorePlatformTab
  label: string
  shortLabel: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const NAV_TABS: NavTabItem[] = [
  { id: 'overview', label: 'Overview & Architecture', shortLabel: 'Overview', icon: Layers },
  { id: 'connect-hub', label: 'Connect Hub Ecosystem', shortLabel: 'Connect Hub', icon: Globe, badge: '44+' },
  { id: 'pricing', label: 'Pricing & Compute Tiers', shortLabel: 'Pricing', icon: CreditCard },
  { id: 'api-docs', label: 'Scalar OpenAPI 3.1 Reference', shortLabel: 'API Docs', icon: Terminal, badge: 'OAS 3.1' },
  { id: 'sandbox', label: 'Double-Entry Simulator', shortLabel: 'Sandbox', icon: Database },
  { id: 'console', label: 'Developer Keys & SSO', shortLabel: 'Console', icon: Key }
]

export const CorePlatformView: React.FC<CorePlatformViewProps> = ({
  initialTab = 'overview',
  onSwitchToPos,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<CorePlatformTab>(initialTab)
  const [hubSubTab, setHubSubTab] = useState<'catalog' | 'webhooks' | 'allowlist'>('catalog')
  const [consoleSubTab, setConsoleSubTab] = useState<'keys' | 'claims'>('keys')

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col ${className}`}>
      {/* 1. STICKY TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Brand Logo & Engine Indicator */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-inner">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-tight text-white font-mono">
                    CORE<span className="text-purple-400">.Hfeit</span>
                  </span>
                  <Badge variant="secondary" className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-slate-800 text-slate-300 border-slate-700">
                    FERRUM ENGINE
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Platform Engine Online (200k+ TPS)</span>
                </div>
              </div>
            </div>

            {/* Desktop Center Navigation Bar */}
            <nav className="hidden xl:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80">
              {NAV_TABS.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-purple-600/25 text-purple-200 border border-purple-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                    <span>{tab.shortLabel}</span>
                    {tab.badge && (
                      <span className="text-[9px] font-bold px-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>

            {/* Right Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('console')}
                className="hidden sm:flex items-center gap-1.5 text-xs font-medium border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300"
              >
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>API Keys</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => setActiveTab('api-docs')}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs gap-1.5 shadow-sm"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Launch Scalar Docs</span>
                <span className="sm:hidden">Docs</span>
              </Button>
              {onSwitchToPos && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSwitchToPos}
                  className="hidden lg:flex items-center gap-1 text-xs border-slate-700 text-slate-400 hover:text-slate-200"
                >
                  <span>POS Terminal</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Scroll Tab Row */}
        <div className="xl:hidden border-t border-slate-800/80 bg-slate-950/95 overflow-x-auto px-4 py-2 flex items-center gap-1.5 no-scrollbar">
          {NAV_TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-purple-600/25 text-purple-200 border border-purple-500/40'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/50 border border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] font-bold px-1 rounded bg-purple-500/20 text-purple-300">
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </header>

      {/* 2. MAIN VIEW CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* TAB 1: OVERVIEW & ARCHITECTURE */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            <CoreHeroSection
              onOpenConnectHub={() => setActiveTab('connect-hub')}
              onOpenApiRef={() => setActiveTab('api-docs')}
              onLaunchPos={onSwitchToPos}
            />
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-200 uppercase tracking-wider">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Deterministic Kernel Pipeline</span>
              </div>
              <CoreArchitectureVisualizer onOpenSpecs={() => setActiveTab('api-docs')} />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-200 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>9-Pillar Architectural Matrix</span>
              </div>
              <CorePillarsShowcase
                onSelectPillarAction={(pillarId) => {
                  if (pillarId === 'connectors') setActiveTab('connect-hub')
                  else if (pillarId === 'docs' || pillarId === 'core') setActiveTab('api-docs')
                }}
              />
            </div>
          </div>
        )}

        {/* TAB 2: CONNECT HUB ECOSYSTEM */}
        {activeTab === 'connect-hub' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Connect Hub Marketplace</span>
                    <Badge variant="indigo" className="font-mono text-[10px]">44+ Integrations</Badge>
                  </h2>
                  <p className="text-xs text-slate-400">Ecosystem bridges, webhooks dispatchers, and beta channel allowlists.</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['catalog', 'webhooks', 'allowlist'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setHubSubTab(mode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                      hubSubTab === mode
                        ? 'bg-purple-600/25 text-purple-300 border border-purple-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode === 'catalog' ? 'Connector Catalog' : mode === 'webhooks' ? 'Webhook Relay' : 'Beta Allowlist'}
                  </button>
                ))}
              </div>
            </div>

            {hubSubTab === 'catalog' && <ConnectorsCatalogGrid onSelectConnectorForSim={() => setActiveTab('sandbox')} />}
            {hubSubTab === 'webhooks' && <WebhookRelayPanel />}
            {hubSubTab === 'allowlist' && <BetaAllowlistTable />}
          </div>
        )}

        {/* TAB 3: PRICING & COMPUTE TIERS */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <CorePricingSection
              onSelectTier={(_tierId, _cycle) => setActiveTab('console')}
              onContactSales={() => window.open('mailto:enterprise@hfe.id', '_blank')}
            />
          </div>
        )}

        {/* TAB 4: SCALAR OPENAPI 3.1 REFERENCE */}
        {activeTab === 'api-docs' && (
          <div className="space-y-4">
            <div className="h-[800px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <ScalarApiExplorer />
            </div>
          </div>
        )}

        {/* TAB 5: DOUBLE-ENTRY SIMULATOR */}
        {activeTab === 'sandbox' && (
          <div className="space-y-6">
            <DoubleEntrySandbox />
          </div>
        )}

        {/* TAB 6: DEVELOPER CONSOLE & AUTH */}
        {activeTab === 'console' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Developer Console &amp; Security Claims</span>
                    <Badge variant="secondary" className="font-mono text-[10px]">OIDC / PKCE</Badge>
                  </h2>
                  <p className="text-xs text-slate-400">Manage tenant API keys, scoped token lifetimes, and cryptographic sentinel domain claims.</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['keys', 'claims'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setConsoleSubTab(mode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      consoleSubTab === mode
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode === 'keys' ? 'API Keys Manager' : 'Sentinel Vendor Claims'}
                  </button>
                ))}
              </div>
            </div>

            {consoleSubTab === 'keys' && <DeveloperKeysManager />}
            {consoleSubTab === 'claims' && <VendorClaimsTable />}
          </div>
        )}
      </main>
    </div>
  )
}
