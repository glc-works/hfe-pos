import React from 'react'
import { formatPrice, formatCompactPrice } from '../utils/currencyFormatter'

export interface PriceTagProps {
  amount: number
  mode?: 'full' | 'compact' | 'adaptive'
  isVipSpan?: boolean
  originalAmount?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'accent' | 'emerald' | 'muted'
  className?: string
}

export const PriceTag: React.FC<PriceTagProps> = ({
  amount,
  mode = 'full',
  isVipSpan = false,
  originalAmount,
  size = 'md',
  variant = 'default',
  className = '',
}) => {
  let displayString = ''
  if (mode === 'compact') {
    displayString = formatCompactPrice(amount)
  } else if (mode === 'adaptive') {
    // In adaptive mode: If not VIP and amount >= 1M (11+ chars), use compact price to prevent clipping
    if (!isVipSpan && amount >= 1_000_000) {
      displayString = formatCompactPrice(amount)
    } else {
      displayString = formatPrice(amount)
    }
  } else {
    displayString = formatPrice(amount)
  }

  const sizeClasses = {
    xs: 'text-[11px]',
    sm: 'text-xs',
    md: 'text-sm font-semibold',
    lg: 'text-base font-bold',
    xl: 'text-lg sm:text-xl font-bold',
  }[size]

  const variantClasses = {
    default: 'text-slate-900 dark:text-slate-100',
    accent: 'text-amber-600 dark:text-amber-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    muted: 'text-slate-500 dark:text-slate-400',
  }[variant]

  return (
    <span className={`inline-flex items-baseline gap-1 font-mono tabular-nums whitespace-nowrap ${className}`}>
      {originalAmount && (
        <span className="text-[10px] text-slate-500 line-through">
          {formatPrice(originalAmount)}
        </span>
      )}
      <span className={`${sizeClasses} ${variantClasses}`}>
        {displayString}
      </span>
    </span>
  )
}
