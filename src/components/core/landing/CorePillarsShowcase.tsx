import React, { useState } from 'react'
import {
  Cpu,
  BarChart3,
  SlidersHorizontal,
  Store,
  QrCode,
  CreditCard,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Code2,
  Sparkles,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from '@/ui'

export interface CorePillarsShowcaseProps {
  onSelectPillarAction?: (pillarId: string) => void
}

interface PillarDetail {
  id: string
  pillarNumber: number
  code: string
  name: string
  tagline: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  badgeVariant: 'default' | 'secondary' | 'emerald' | 'indigo'
  keyFeatures: string[]
  technicalInvariants: string[]
  runtimeEndpoint: string
}

const MASTER_PILLARS: PillarDetail[] = [
  {
    id: 'core',
    pillarNumber: 0,
    code: 'PILLAR-0: CORE',
    name: 'TigerBeetle Financial Kernel',
    tagline: 'Multi-Tenant Double-Entry Ledger & Security Engine',
    description:
      'Ultra-fast in-memory financial journal delivering 200k+ TPS with zero ledger discrepancy. Guarantees deterministic debit/credit invariants and strict HMAC tenant isolation.',
    icon: Cpu,
    badgeVariant: 'default',
    keyFeatures: [
      'TigerBeetle Core & In-Memory Journal',
      'Deterministic Double-Entry Posting Pipeline',
      'Tenant Isolation & Multi-Holding Hierarchies',
      'Strict Idempotency via X-Idempotency-Key'
    ],
    technicalInvariants: ['Debits == Credits Invariant', 'P99 Latency < 2ms', 'HMAC SHA-256 Auth'],
    runtimeEndpoint: 'POST /v2/books/{id}/transfers'
  },
  {
    id: 'board',
    pillarNumber: 1,
    code: 'PILLAR-1: BOARD',
    name: 'Executive Analytics & Telemetry',
    tagline: 'Real-Time Insights, ESG Audit & Holding Intelligence',
    description:
      'High-velocity business intelligence aggregating live revenue streams, branch performance matrices, ESG carbon offsets, and executive holding consolidations.',
    icon: BarChart3,
    badgeVariant: 'emerald',
    keyFeatures: [
      'Multi-Branch Revenue Velocity & Radar',
      'Automated ESG & Sustainability Reporting',
      'Shift Settlement Telemetry & Cash Audit',
      'Holding-Level Consolidated Statements'
    ],
    technicalInvariants: ['Sub-second Real-time Aggregation', 'Audited Shift Fingerprints'],
    runtimeEndpoint: 'GET /v2/analytics/executive-summary'
  },
  {
    id: 'admin',
    pillarNumber: 2,
    code: 'PILLAR-2: ADMIN',
    name: 'Master Catalog, BOM & RBAC',
    tagline: 'Enterprise Store Ops, Inventory & Permission Matrix',
    description:
      'Centralized back-office orchestrating Bill of Materials (BOM), multi-warehouse stock allocations, staff shift management, and granular permission matrices.',
    icon: SlidersHorizontal,
    badgeVariant: 'indigo',
    keyFeatures: [
      'Dynamic Recipe BOM & Real-Time Depletion',
      'Multi-Warehouse Transfer & Stock Audits',
      'Staff Workstation Shifts & Fingerprint PIN',
      'Granular Role-Based Access Control (RBAC)'
    ],
    technicalInvariants: ['Atomic Stock Movements', 'Cryptographic PIN Verification'],
    runtimeEndpoint: 'POST /v2/catalog/recipes/batch-sync'
  },
  {
    id: 'pos',
    pillarNumber: 3,
    code: 'PILLAR-3: POS',
    name: 'Specialized Workstations & KDS',
    tagline: 'Barista, Maitre D\', Sommelier & Kitchen Production',
    description:
      'Role-specialized frontend surfaces with offline-first local CRDT sync, fine dining course pacing, table floor plans, and unified kitchen display kanban.',
    icon: Store,
    badgeVariant: 'default',
    keyFeatures: [
      'Role-Specialized Surfaces (Barista, Maitre D\', Wine)',
      'Fine Dining Course Matrix (Appetizer, Main, Dessert)',
      'Multi-Tender Settlement (Cash, QRIS, Kasbon, Card)',
      '100% Offline-First Mode with IndexedDB Sync'
    ],
    technicalInvariants: ['Zero Network Latency Blocking', 'CRDT Conflict Resolution'],
    runtimeEndpoint: 'POST /v2/pos/orders/settle'
  },
  {
    id: 'order',
    pillarNumber: 4,
    code: 'PILLAR-4: ORDER',
    name: 'Omnichannel Ordering Engine',
    tagline: 'Customer Mobile App, Table QR & Scan & Go',
    description:
      'Seamless frictionless guest ordering journeys spanning self-service kiosks, QR code at table, event ticketing, and instant checkout.',
    icon: QrCode,
    badgeVariant: 'emerald',
    keyFeatures: [
      'Customer Web App & Mobile Ordering',
      'Table QR Open-Tab & Real-Time Bill Sharing',
      'Self-Service Kiosks & Scan & Go Journeys',
      'Live Order Tracking & Push Notifications'
    ],
    technicalInvariants: ['Sub-100ms Cart Updates', 'Dynamic Table Floor Locking'],
    runtimeEndpoint: 'POST /v2/customer/orders/submit'
  },
  {
    id: 'card',
    pillarNumber: 5,
    code: 'PILLAR-5: CARD',
    name: 'Loyalty, Wallets & CRM',
    tagline: 'Customer Tiering, Digital Wallets & Voucher Engine',
    description:
      'Omnichannel engagement engine managing customer profiles, dynamic tier upgrades, digital voucher wallets, and seamless point redemption at checkout.',
    icon: CreditCard,
    badgeVariant: 'indigo',
    keyFeatures: [
      'Tiered VIP Progression (Silver, Gold, Platinum)',
      'Digital Voucher Wallet & Auto-Redemption',
      'Customer Contact Management & CRM Insights',
      'Cashback & Point Accrual Ledger Sync'
    ],
    technicalInvariants: ['Atomic Point Ledger Balance', 'Single-Use Voucher Verification'],
    runtimeEndpoint: 'POST /v2/loyalty/vouchers/redeem'
  },
  {
    id: 'book',
    pillarNumber: 6,
    code: 'PILLAR-6: BOOK',
    name: 'Headless Financial Books',
    tagline: 'General Ledger, Bank Reconciliation & Tax Engine',
    description:
      'Accounting engine connecting POS cashflows directly to formal chart of accounts, automated bank feeds (BCA, Mandiri, BRI), tax filing, and fiscal statements.',
    icon: BookOpen,
    badgeVariant: 'default',
    keyFeatures: [
      'Standard Chart of Accounts (Assets, Liabilities, Equity)',
      'Automated Bank Feed Reconciliation Engine',
      'PPH/PPN Tax Calculation & Withholding Proof',
      'Exportable Audit Logs & Trial Balance Statements'
    ],
    technicalInvariants: ['Immutability Proof Chains', 'Full GAAP/IFRS Compliance'],
    runtimeEndpoint: 'GET /v2/books/{id}/trial-balance'
  }
]

export const CorePillarsShowcase: React.FC<CorePillarsShowcaseProps> = ({
  onSelectPillarAction
}) => {
  const [selectedPillarId, setSelectedPillarId] = useState<string>('core')
  const activePillar = MASTER_PILLARS.find((p) => p.id === selectedPillarId) || MASTER_PILLARS[0]
  const ActiveIcon = activePillar.icon

  return (
    <section id="pillars" className="py-16 md:py-24 bg-slate-950/90 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="default" className="mb-3">
            ARCHITECTURE COMPASS
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            The 7 Master Pillars of HFE
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            A fully decoupled, domain-driven ecosystem engineered for resilience, high throughput, and seamless interoperability.
          </p>
        </div>

        {/* Pillar Navigation Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8 justify-start md:justify-center">
          {MASTER_PILLARS.map((pillar) => {
            const isSelected = pillar.id === selectedPillarId
            const Icon = pillar.icon
            return (
              <Button
                key={pillar.id}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPillarId(pillar.id)}
                className={`gap-2 whitespace-nowrap transition-all rounded-xl ${
                  isSelected
                    ? 'shadow-md shadow-amber-500/20'
                    : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="font-mono text-xs font-bold">{pillar.code.split(':')[0]}</span>
                <span className="hidden sm:inline text-xs">{pillar.name.split(' ')[0]}</span>
              </Button>
            )
          })}
        </div>

        {/* Active Pillar Featured Display */}
        <Card className="border-slate-800/90 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 shadow-2xl backdrop-blur-xl">
          <CardHeader className="border-b border-slate-800/70 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <ActiveIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={activePillar.badgeVariant} className="text-[11px] font-mono">
                      {activePillar.code}
                    </Badge>
                    <span className="text-xs text-slate-400 font-medium">Topological Level 1</span>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl mt-1 text-white font-bold">
                    {activePillar.name}
                  </CardTitle>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onSelectPillarAction?.(activePillar.id)}
                  className="gap-1.5 border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs"
                >
                  <span>Explore Capabilities</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                </Button>
              </div>
            </div>
            <CardDescription className="text-sm text-slate-300 mt-3 max-w-3xl">
              {activePillar.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Key Features List */}
              <div className="lg:col-span-7 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Core Capabilities & Modules
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activePillar.keyFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-800/80 bg-slate-900/40"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-200 font-medium leading-tight">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Architectural Invariants & Runtime Contract */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4 rounded-xl border border-slate-800/80 bg-slate-950/70 p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      System Invariants
                    </span>
                    <Badge variant="emerald" className="text-[10px]">
                      ENFORCED
                    </Badge>
                  </div>
                  <div className="space-y-1.5">
                    {activePillar.technicalInvariants.map((inv, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                        <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">{inv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400">Canonical REST Contract</div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-amber-300 flex items-center justify-between">
                    <span className="truncate">{activePillar.runtimeEndpoint}</span>
                    <Code2 className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-2" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
