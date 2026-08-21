import React from 'react'

export type StatusPillVariant = 'slate' | 'amber' | 'emerald' | 'rose' | 'sky'

export interface StatusPillProps {
  label: string
  glyph?: string
  variant?: StatusPillVariant
  count?: number | string
  className?: string
  onClick?: () => void
}

export const StatusPill: React.FC<StatusPillProps> = ({
  label,
  glyph,
  variant = 'slate',
  count,
  className = '',
  onClick
}) => {
  const variantStyles = {
    slate: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    amber: 'bg-amber-500/20 text-amber-900 dark:text-amber-300 border-amber-500/40',
    emerald: 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border-emerald-500/40',
    rose: 'bg-rose-500/20 text-rose-900 dark:text-rose-300 border-rose-500/40',
    sky: 'bg-sky-500/20 text-sky-900 dark:text-sky-300 border-sky-500/40'
  }[variant]

  const Component = onClick ? 'button' : 'span'

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border select-none transition-all ${
        onClick ? 'active:scale-95 cursor-pointer hover:opacity-80 touch-manipulation' : ''
      } ${variantStyles} ${className}`}
    >
      {glyph && <span className="flex-shrink-0">{glyph}</span>}
      <span className="truncate">{label}</span>
      {count !== undefined && (
        <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-mono rounded-full bg-slate-900/20 dark:bg-slate-950/40">
          {count}
        </span>
      )}
    </Component>
  )
}
