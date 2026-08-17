import React, { useState } from 'react'
import { Check, Sparkles, Zap, Building2, Rocket, HelpCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Button, PriceTag } from '@/ui'

export interface CorePricingSectionProps {
  onSelectTier?: (tierId: string, billingCycle: 'monthly' | 'annual') => void
  onContactSales?: () => void
}

interface PricingPlan {
  id: string
  name: string
  tagline: string
  monthlyPrice: number
  annualPrice: number
  isPopular?: boolean
  badgeText: string
  badgeVariant: 'default' | 'secondary' | 'emerald' | 'indigo'
  icon: React.ComponentType<{ className?: string }>
  features: string[]
  limits: string
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter Node',
    tagline: 'Single boutique F&B outlet or standalone retail store',
    monthlyPrice: 499000,
    annualPrice: 399000,
    badgeText: 'Single Outlet',
    badgeVariant: 'secondary',
    icon: Rocket,
    limits: 'Up to 3 Workstations • 1 Branch',
    features: [
      'TigerBeetle Core Double-Entry Ledger',
      'Unified POS & Barista Console',
      '100% Offline-First Mode with IndexedDB',
      'Table QR Ordering & Open-Tab',
      'Standard Sales & Cash Reports',
      'Email & Community Support'
    ]
  },
  {
    id: 'growth',
    name: 'Growth Cluster',
    tagline: 'Fast-casual chains and multi-station fine dining venues',
    monthlyPrice: 1499000,
    annualPrice: 1199000,
    isPopular: true,
    badgeText: 'Most Popular',
    badgeVariant: 'default',
    icon: Zap,
    limits: 'Up to 15 Workstations • 5 Branches',
    features: [
      'All Starter Node Features Included',
      'Unified Kitchen Display System (KDS Kanban)',
      'Sommelier & Maitre D\' Specialized Workstations',
      'Multi-Warehouse Inventory & BOM Depletion',
      'Customer Loyalty, Tiers & Voucher Wallets',
      'Connect Hub Bank Feeds & QRIS Dynamic',
      'Priority 24/7 Operational SLA'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise Holding',
    tagline: 'F&B conglomerates, franchise holdings & multi-brand groups',
    monthlyPrice: 4999000,
    annualPrice: 3999000,
    badgeText: 'Holding Scale',
    badgeVariant: 'indigo',
    icon: Building2,
    limits: 'Unlimited Workstations • Unlimited Branches',
    features: [
      'All Growth Cluster Features Included',
      'Multi-Tenant Holding Hierarchy Consolidation',
      'Automated ESG & Sustainability Telemetry',
      'Custom Connectors & Private Developer Sandboxes',
      'Dedicated TigerBeetle Journal Partition',
      'Custom Chart of Accounts & Direct ERP Feeds',
      'Dedicated Technical Account Manager'
    ]
  }
]

export const CorePricingSection: React.FC<CorePricingSectionProps> = ({
  onSelectTier,
  onContactSales
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')

  return (
    <section id="pricing" className="py-16 md:py-24 bg-slate-950/95 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Badge variant="default" className="mb-3">
            TRANSPARENT PRICING
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Predictable Plans for Any Operating Scale
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            From single craft cafes to enterprise holding conglomerates, scale deterministically with zero transaction markups.
          </p>

          {/* Monthly / Annual Toggle Switch */}
          <div className="mt-8 inline-flex items-center gap-1.5 p-1 rounded-2xl border border-slate-800 bg-slate-900/80">
            <Button
              size="sm"
              variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
              onClick={() => setBillingCycle('monthly')}
              className="text-xs font-semibold rounded-xl"
            >
              Monthly Billing
            </Button>
            <Button
              size="sm"
              variant={billingCycle === 'annual' ? 'default' : 'ghost'}
              onClick={() => setBillingCycle('annual')}
              className="text-xs font-semibold rounded-xl gap-1.5"
            >
              <span>Annual Billing</span>
              <Badge variant="emerald" className="text-[10px] py-0 px-1.5 font-mono">
                SAVE 20%
              </Badge>
            </Button>
          </div>
        </div>

        {/* Pricing Cards 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const Icon = plan.icon
            const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice
            return (
              <Card
                key={plan.id}
                className={`flex flex-col justify-between transition-all duration-200 relative ${
                  plan.isPopular
                    ? 'border-amber-500/80 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 shadow-2xl shadow-amber-500/10'
                    : 'border-slate-800/90 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge variant="default" className="shadow-lg shadow-amber-500/30 text-slate-950 font-bold text-xs px-3">
                      MOST RECOMMENDED
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-amber-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant={plan.badgeVariant} className="text-[10px]">
                      {plan.badgeText}
                    </Badge>
                  </div>

                  <CardTitle className="text-xl text-white font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-xs text-slate-400 min-h-[32px] mt-1">
                    {plan.tagline}
                  </CardDescription>

                  {/* Price Row with PriceTag Atom */}
                  <div className="pt-4 pb-2 border-y border-slate-800/80 my-2">
                    <div className="flex items-baseline gap-1">
                      <PriceTag
                        amount={price}
                        size="xl"
                        variant={plan.isPopular ? 'accent' : 'default'}
                      />
                      <span className="text-xs text-slate-400 font-normal">/ month</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 font-mono">{plan.limits}</div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pb-6 flex-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Included Capabilities
                  </div>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-300 font-medium leading-tight">
                        {feat}
                      </span>
                    </div>
                  ))}
                </CardContent>

                <CardFooter className="pt-0">
                  <Button
                    variant={plan.isPopular ? 'default' : 'outline'}
                    className="w-full font-bold"
                    onClick={() => onSelectTier?.(plan.id, billingCycle)}
                  >
                    {plan.id === 'enterprise' ? 'Contact Enterprise Team' : 'Get Started Now'}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
