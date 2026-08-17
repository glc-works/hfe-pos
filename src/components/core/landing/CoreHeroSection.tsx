import React from 'react'
import { ArrowRight, Terminal, Layers, Activity, ShieldCheck, Zap, Server, Globe } from 'lucide-react'
import { Button, Badge } from '@/ui'

export interface CoreHeroSectionProps {
  onOpenConnectHub?: () => void
  onOpenApiRef?: () => void
  onLaunchPos?: () => void
}

interface StatMetric {
  id: string
  label: string
  value: string
  sublabel: string
  icon: React.ComponentType<{ className?: string }>
  badgeText: string
  badgeVariant: 'default' | 'secondary' | 'emerald' | 'indigo'
}

const LIVE_STATS: StatMetric[] = [
  {
    id: 'tps',
    label: 'TigerBeetle Throughput',
    value: '200,000+',
    sublabel: 'Deterministic Transactions / Sec',
    icon: Zap,
    badgeText: 'Kernel Benchmark',
    badgeVariant: 'default',
  },
  {
    id: 'latency',
    label: 'Commit SLA',
    value: '< 2ms',
    sublabel: 'Double-Entry Journal Posting',
    icon: Activity,
    badgeText: 'P99 In-Memory',
    badgeVariant: 'emerald',
  },
  {
    id: 'discrepancy',
    label: 'Ledger Integrity',
    value: '0.00',
    sublabel: 'Strict Debit/Credit Invariant',
    icon: ShieldCheck,
    badgeText: 'Zero Drift',
    badgeVariant: 'indigo',
  },
  {
    id: 'uptime',
    label: 'Availability SLA',
    value: '99.999%',
    sublabel: 'Distributed Fault-Tolerant Engine',
    icon: Server,
    badgeText: 'Multi-Tenant Scale',
    badgeVariant: 'secondary',
  },
]

export const CoreHeroSection: React.FC<CoreHeroSectionProps> = ({
  onOpenConnectHub,
  onOpenApiRef,
  onLaunchPos,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Status Capsule */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-inner text-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold text-slate-300">Pillar 0 (CORE) Active</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 font-mono text-[11px]">TigerBeetle Financial Kernel v2.4</span>
            <Badge variant="emerald" className="text-[10px] py-0 px-2 ml-1">
              PROD-READY
            </Badge>
          </div>
        </div>

        {/* High-Impact Platform Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            The Headless Engine for{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
              Commerce, Financial Ledger
            </span>{' '}
            & Ecosystem Connectivity
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Unifying multi-tenant enterprise holding hierarchy, double-entry financial posting,
            offline-first client CRDT synchronisation, and universal ecosystem connectors in a
            single deterministic architecture.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Button
              size="lg"
              onClick={onOpenConnectHub}
              className="gap-2 shadow-lg shadow-amber-500/20 text-slate-950 font-bold"
            >
              <Globe className="w-4 h-4 text-slate-950" />
              <span>Explore Connect Hub</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={onOpenApiRef}
              className="gap-2 border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800"
            >
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>View API Reference</span>
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={onLaunchPos}
              className="gap-2 bg-slate-800/90 text-slate-200 hover:bg-slate-700 border border-slate-700/60"
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Launch POS Console</span>
            </Button>
          </div>
        </div>

        {/* Live Stats Counters Bar */}
        <div className="mt-14 sm:mt-18 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LIVE_STATS.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.id}
                className="relative group rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5 backdrop-blur-md transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/90"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/50 text-amber-400 group-hover:text-amber-300">
                    <Icon className="w-4 h-4" />
                  </div>
                  <Badge variant={stat.badgeVariant} className="text-[10px]">
                    {stat.badgeText}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold text-slate-300 truncate">
                    {stat.label}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-tight">
                    {stat.sublabel}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
