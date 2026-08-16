import React from 'react'

export interface TimerPillProps {
  elapsedMinutes: number
  showIcon?: boolean
  className?: string
}

export const TimerPill: React.FC<TimerPillProps> = ({
  elapsedMinutes,
  showIcon = true,
  className = '',
}) => {
  // Tiered duration alerting: <30m calm, 30-60m warning amber, >60m alert rose
  const colorClass =
    elapsedMinutes > 60
      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
      : elapsedMinutes >= 30
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      : 'bg-slate-800 text-slate-400 border-slate-700/50'

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded-full border ${colorClass} ${className}`}
    >
      {showIcon && <span>⏱️</span>}
      <span>{elapsedMinutes}m</span>
    </span>
  )
}
