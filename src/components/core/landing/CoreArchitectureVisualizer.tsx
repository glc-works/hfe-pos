import React, { useState } from 'react'
import {
  Layers,
  Database,
  Network,
  Cpu,
  ShieldCheck,
  Zap,
  ArrowDown,
  RefreshCw,
  Lock,
  GitCommit,
  CheckCircle,
  FileCode2
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from '@/ui'

export interface CoreArchitectureVisualizerProps {
  onOpenSpecs?: () => void
}

interface ArchLayer {
  id: string
  stepNumber: string
  title: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  badgeText: string
  badgeVariant: 'default' | 'secondary' | 'emerald' | 'indigo'
  description: string
  guarantees: string[]
  specs: { label: string; value: string }[]
}

const ARCH_LAYERS: ArchLayer[] = [
  {
    id: 'edge',
    stepNumber: '01',
    title: 'Offline-First Edge & Client Tier',
    subtitle: 'IndexedDB CRDT & Optimistic Mutations',
    icon: Database,
    badgeText: 'Zero-Downtime Edge',
    badgeVariant: 'emerald',
    description:
      'Frontend POS, Barista workstations, and mobile apps operate with full autonomy on local IndexedDB. Orders, tabs, and payments mutate optimistically with deterministic background synchronization.',
    guarantees: [
      '100% Offline Transaction Queue',
      'Deterministic CRDT State Convergence',
      'Local Master PIN & Role Invariants'
    ],
    specs: [
      { label: 'Local Store', value: 'IndexedDB + Dexie' },
      { label: 'Sync Protocol', value: 'Deterministic Delta Sync' },
      { label: 'Offline SLA', value: 'Full Ops without Internet' }
    ]
  },
  {
    id: 'gateway',
    stepNumber: '02',
    title: 'API Gateway & Invariant Verifier',
    subtitle: 'HMAC Authentication & Idempotency Sentinel',
    icon: Network,
    badgeText: 'Zero-Tamper Gateway',
    badgeVariant: 'indigo',
    description:
      'High-throughput OpenAPI routing gateway executing rigorous cryptographic checks, rate limiting, and tenant token validation. Enforces unique idempotency keys to eliminate double charges.',
    guarantees: [
      'X-Idempotency-Key Deduplication',
      'HMAC SHA-256 Signature Verification',
      'Tenant Scoped Database Isolation'
    ],
    specs: [
      { label: 'Idempotency TTL', value: '24 Hours Deduplication' },
      { label: 'Auth Scheme', value: 'Bearer JWT + HMAC Fingerprint' },
      { label: 'Gateway Latency', value: '< 1.2ms P99' }
    ]
  },
  {
    id: 'kernel',
    stepNumber: '03',
    title: 'TigerBeetle Financial Posting Kernel',
    subtitle: 'In-Memory Double-Entry Ledger Engine',
    icon: Cpu,
    badgeText: '200k+ TPS Core',
    badgeVariant: 'default',
    description:
      'The core financial heart written for absolute determinism. Every single cashflow, split-bill, inventory movement, and loyalty point resolves through strict double-entry balance contracts.',
    guarantees: [
      'Strict Invariant: Debits == Credits',
      'Immutable Append-Only Audit Trail',
      'Zero Discrepancy & Overflow Guard'
    ],
    specs: [
      { label: 'Throughput', value: '200,000+ Transfers / Sec' },
      { label: 'Consistency', value: 'Strict Serializability' },
      { label: 'Kernel Storage', value: 'Direct I/O Block Engine' }
    ]
  },
  {
    id: 'connect',
    stepNumber: '04',
    title: 'Connect Hub & Settlement Mesh',
    subtitle: 'Bank Feeds, ERP & Ecosystem Connectors',
    icon: Layers,
    badgeText: 'Universal Mesh',
    badgeVariant: 'secondary',
    description:
      'Real-time connector mesh bridging the financial ledger with banking rails (BCA, Mandiri, BRI, QRIS), tax filing authorities, supply chain partners, and external ERP systems.',
    guarantees: [
      'Automated Bank Statement Matching',
      'Webhook Delivery with Exponential Backoff',
      'Sandboxed Developer Connector Manifests'
    ],
    specs: [
      { label: 'Webhooks', value: 'HMAC-Signed Guaranteed Delivery' },
      { label: 'Bank Feeds', value: 'Direct MT940 / API Reconcile' },
      { label: 'Manifest Schema', value: 'POS-ENG-STD-001 Verified' }
    ]
  }
]

export const CoreArchitectureVisualizer: React.FC<CoreArchitectureVisualizerProps> = ({
  onOpenSpecs
}) => {
  const [activeLayerId, setActiveLayerId] = useState<string>('kernel')
  const activeLayer = ARCH_LAYERS.find((l) => l.id === activeLayerId) || ARCH_LAYERS[2]
  const ActiveIcon = activeLayer.icon

  return (
    <section id="architecture" className="py-16 md:py-24 bg-slate-900/40 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="emerald" className="mb-3">
            TECHNICAL DEEP DIVE
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Deterministic Kernel Architecture
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            From offline POS client mutations to sub-millisecond TigerBeetle double-entry posting,
            explore how HFE guarantees zero data loss and ledger integrity.
          </p>
        </div>

        {/* 4-Layer Interactive Architecture Topology */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Stack Pipeline Cards */}
          <div className="lg:col-span-6 space-y-3">
            {ARCH_LAYERS.map((layer, index) => {
              const isSelected = layer.id === activeLayerId
              const Icon = layer.icon
              return (
                <div key={layer.id} className="relative">
                  <div
                    onClick={() => setActiveLayerId(layer.id)}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                      isSelected
                        ? 'border-amber-500/80 bg-slate-900/95 shadow-lg shadow-amber-500/10'
                        : 'border-slate-800/80 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-2.5 rounded-xl border shrink-0 ${
                            isSelected
                              ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-amber-400/90">
                              LAYER {layer.stepNumber}
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="text-xs text-slate-400 truncate">{layer.subtitle}</span>
                          </div>
                          <div className="text-sm font-bold text-white truncate mt-0.5">
                            {layer.title}
                          </div>
                        </div>
                      </div>

                      <Badge variant={layer.badgeVariant} className="text-[10px] shrink-0">
                        {layer.badgeText}
                      </Badge>
                    </div>
                  </div>

                  {/* Connecting Arrow between stacked layers */}
                  {index < ARCH_LAYERS.length - 1 && (
                    <div className="flex justify-center my-1 text-slate-700">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Right Column: Layer Detailed Deep-Dive Inspector */}
          <div className="lg:col-span-6">
            <Card className="border-slate-800 bg-slate-950/90 backdrop-blur-xl shadow-2xl sticky top-24">
              <CardHeader className="border-b border-slate-800/80 pb-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <ActiveIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="text-[10px] font-mono">
                          LAYER {activeLayer.stepNumber}
                        </Badge>
                        <Badge variant={activeLayer.badgeVariant} className="text-[10px]">
                          {activeLayer.badgeText}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg sm:text-xl text-white font-bold mt-1">
                        {activeLayer.title}
                      </CardTitle>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                  {activeLayer.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-5 space-y-5">
                {/* Structural Guarantees */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Architectural Invariants & Guarantees
                  </div>
                  <div className="space-y-2">
                    {activeLayer.guarantees.map((g, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-800 bg-slate-900/50"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs text-slate-200 font-medium">{g}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Specifications Grid */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Engine Technical Specifications
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {activeLayer.specs.map((spec, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl border border-slate-800/80 bg-slate-900/40"
                      >
                        <div className="text-[11px] text-slate-400 font-medium">{spec.label}</div>
                        <div className="text-xs font-bold font-mono text-amber-300 mt-0.5 truncate">
                          {spec.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Footer */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>POS-ENG-STD-001 Verified</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onOpenSpecs}
                    className="gap-1.5 border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 text-xs"
                  >
                    <FileCode2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>View Specifications</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
