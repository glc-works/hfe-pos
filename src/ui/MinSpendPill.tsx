import React from 'react'

export interface MinSpendPillProps {
  currentBill: number
  minimumSpend: number
  currency?: string
  className?: string
}

export const MinSpendPill: React.FC<MinSpendPillProps> = ({
  currentBill,
  minimumSpend,
  currency = 'IDR',
  className = '',
}) => {
  if (!minimumSpend || minimumSpend <= 0) return null

  const progressPct = Math.min(100, Math.round((currentBill / minimumSpend) * 100))
  const remaining = Math.max(0, minimumSpend - currentBill)
  const isReached = currentBill >= minimumSpend

  const formattedRemaining = new Intl.NumberFormat('id-ID').format(remaining)

  return (
    <span
      className={`inline-flex items-center gap-1 text-[9px] font-mono tabular-nums px-1.5 py-0.5 rounded border ${
        isReached
          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
          : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
      } ${className}`}
    >
      <span>👑</span>
      <span className="font-semibold">{progressPct}%</span>
      <span>•</span>
      <span>
        {isReached ? 'Target Tercapai' : `Sisa ${currency} ${formattedRemaining}`}
      </span>
    </span>
  )
}
