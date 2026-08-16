import React from 'react'

export interface PriceTagProps {
  amount: number
  currency?: string
  originalAmount?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'accent' | 'emerald' | 'muted'
  className?: string
}

export const PriceTag: React.FC<PriceTagProps> = ({
  amount,
  currency = 'IDR',
  originalAmount,
  size = 'md',
  variant = 'default',
  className = '',
}) => {
  const formatted = new Intl.NumberFormat('id-ID').format(amount)
  const formattedOriginal = originalAmount
    ? new Intl.NumberFormat('id-ID').format(originalAmount)
    : null

  const sizeClasses = {
    xs: 'text-[11px]',
    sm: 'text-xs',
    md: 'text-sm font-semibold',
    lg: 'text-base font-bold',
    xl: 'text-lg sm:text-xl font-bold',
  }[size]

  const variantClasses = {
    default: 'text-slate-200',
    accent: 'text-amber-400',
    emerald: 'text-emerald-400',
    muted: 'text-slate-400',
  }[variant]

  return (
    <span className={`inline-flex items-baseline gap-1 font-mono tabular-nums ${className}`}>
      {formattedOriginal && (
        <span className="text-[10px] text-slate-500 line-through">
          {currency} {formattedOriginal}
        </span>
      )}
      <span className={`${sizeClasses} ${variantClasses}`}>
        {currency} {formatted}
      </span>
    </span>
  )
}
