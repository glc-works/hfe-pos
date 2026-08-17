import React, { useState } from 'react'
import {
  Cpu,
  Terminal,
  Layers,
  Sparkles,
  ShieldCheck,
  Zap,
  Code2,
  Database,
  ArrowUpRight
} from 'lucide-react'
import { ScalarApiExplorer } from '../components/core/docs/ScalarApiExplorer'
import { CorePillarsShowcase } from '../components/core/landing/CorePillarsShowcase'
import { CoreArchitectureVisualizer } from '../components/core/landing/CoreArchitectureVisualizer'
import { CoreHeroSection } from '../components/core/landing/CoreHeroSection'

export type CoreViewTab = 'api-docs' | 'pillars' | 'architecture'

export interface CoreLandingViewProps {
  initialTab?: CoreViewTab
  onSwitchToPos?: () => void
  onSwitchToConnectHub?: () => void
}

export const CoreLandingView: React.FC<CoreLandingViewProps> = ({
  initialTab = 'api-docs',
  onSwitchToPos,
  onSwitchToConnectHub
}) => {
  const [activeTab, setActiveTab] = useState<CoreViewTab>(initialTab)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-8 space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>HFE-X Core Financial Kernel</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full">
                Pillar 0 (CORE)
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Deterministic double-entry posting pipeline, multi-tenant book isolation, and OpenAPI 3.1 Scalar reference.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-sm" />
            <span>TIGERBEETLE KERNEL 200k+ TPS</span>
          </div>
        </div>
      </div>

      {/* Hero Strip */}
      <CoreHeroSection
        onOpenApiRef={() => setActiveTab('api-docs')}
        onOpenConnectHub={onSwitchToConnectHub}
        onLaunchPos={onSwitchToPos}
      />

      {/* Tab Switcher */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('api-docs')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'api-docs'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-purple-400" />
          <span>Developer API Reference (Scalar OAS 3.1)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pillars')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'pillars'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-sky-400" />
          <span>9-Pillar Architectural Matrix</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('architecture')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'architecture'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Kernel Pipeline Visualizer</span>
        </button>
      </div>

      {/* Active Tab Content */}
      <div>
        {activeTab === 'api-docs' && (
          <div className="h-[750px]">
            <ScalarApiExplorer />
          </div>
        )}

        {activeTab === 'pillars' && <CorePillarsShowcase />}

        {activeTab === 'architecture' && <CoreArchitectureVisualizer />}
      </div>
    </div>
  )
}
