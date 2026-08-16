import React from 'react'
import { Award, Zap, ChevronRight, TrendingUp } from 'lucide-react'
import { LoyaltyTier, TIER_THRESHOLDS, getTierMultiplier } from '../../hooks/useLoyalty'

export interface LoyaltyTierBadgeProps {
  tier: LoyaltyTier
  points: number
  lifetimeSpend: number
  showProgress?: boolean
  onClick?: () => void
}

const TIER_CONFIG: Record<
  LoyaltyTier,
  {
    icon: string
    badgeBg: string
    textColor: string
    borderColor: string
    label: string
  }
> = {
  Bronze: {
    icon: '🥉',
    badgeBg: 'bg-amber-900/40',
    textColor: 'text-amber-300',
    borderColor: 'border-amber-700/50',
    label: 'Bronze Member',
  },
  Silver: {
    icon: '🥈',
    badgeBg: 'bg-slate-700/50',
    textColor: 'text-slate-200',
    borderColor: 'border-slate-500/50',
    label: 'Silver Member',
  },
  Gold: {
    icon: '🥇',
    badgeBg: 'bg-amber-500/20',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    label: 'Gold Member',
  },
  Platinum: {
    icon: '💎',
    badgeBg: 'bg-cyan-500/20',
    textColor: 'text-cyan-300',
    borderColor: 'border-cyan-400/40',
    label: 'Platinum Member',
  },
}

export const LoyaltyTierBadge: React.FC<LoyaltyTierBadgeProps> = ({
  tier,
  points,
  lifetimeSpend,
  showProgress = true,
  onClick,
}) => {
  const config = TIER_CONFIG[tier] || TIER_CONFIG.Bronze
  const multiplier = getTierMultiplier(tier)
  const tierInfo = TIER_THRESHOLDS[tier]
  const nextTier = tierInfo?.nextTier

  let progressPercent = 100
  let spendNeeded = 0
  let targetSpend = 0

  if (nextTier) {
    const nextTierConfig = TIER_THRESHOLDS[nextTier]
    targetSpend = nextTierConfig.minSpend
    const currentMin = tierInfo.minSpend
    const spendInTier = Math.max(0, lifetimeSpend - currentMin)
    const tierSpan = targetSpend - currentMin
    progressPercent = Math.min(100, Math.max(0, Math.round((spendInTier / tierSpan) * 100)))
    spendNeeded = Math.max(0, targetSpend - lifetimeSpend)
  }

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 ${config.badgeBg} ${config.borderColor} ${
        onClick ? 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900/80 text-2xl shadow-inner border border-white/10">
            {config.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-bold text-base tracking-wide ${config.textColor}`}>
                {config.label}
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-400/20">
                <Zap className="h-3 w-3 fill-amber-400 text-amber-400" />
                {multiplier}x Poin
              </span>
            </div>
            <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
              <Award className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-semibold text-white">{points} Poin Loyalty</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-400 text-[11px]">
                Total: Rp {lifetimeSpend.toLocaleString('id-ID')}
              </span>
            </p>
          </div>
        </div>

        {onClick && <ChevronRight className="h-5 w-5 text-slate-400 shrink-0" />}
      </div>

      {showProgress && nextTier && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex justify-between items-center text-[11px] mb-1.5">
            <span className="text-slate-300 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-amber-400" />
              Menuju <strong className="text-white">{nextTier}</strong>
            </span>
            <span className="text-slate-400 font-medium">
              Butuh Rp {spendNeeded.toLocaleString('id-ID')} lagi
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-900/80 p-0.5 border border-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
