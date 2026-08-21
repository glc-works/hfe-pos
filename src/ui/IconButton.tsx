import React from 'react'

export type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'amber' | 'emerald' | 'danger'
export type IconButtonSize = 'sm' | 'md' | 'lg'

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string
  icon: React.ReactNode
  variant?: IconButtonVariant
  size?: IconButtonSize
}

export const IconButton: React.FC<IconButtonProps> = ({
  'aria-label': ariaLabel,
  icon,
  variant = 'secondary',
  size = 'md',
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl',
    lg: 'min-w-[48px] min-h-[48px] w-12 h-12 rounded-2xl'
  }[size]

  const variantClasses = {
    primary: 'bg-slate-900 dark:bg-slate-800 text-white border border-slate-700/60 hover:bg-slate-800',
    secondary: 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800',
    ghost: 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800',
    amber: 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30',
    danger: 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
  }[variant]

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      title={ariaLabel}
      disabled={disabled}
      className={`inline-flex items-center justify-center select-none transition-all active:scale-95 touch-manipulation focus:outline-none focus:ring-2 focus:ring-amber-500/40 disabled:opacity-50 disabled:pointer-events-none ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {icon}
    </button>
  )
}
