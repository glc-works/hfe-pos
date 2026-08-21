import React from 'react'

export type ButtonVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'amber'
  | 'emerald'
  | 'danger'
  | 'destructive'
  | 'ghost'

export type ButtonSize = 'sm' | 'md' | 'lg' | 'default' | 'icon'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: React.ReactNode
  loading?: boolean
  fullWidth?: boolean
  children?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  icon,
  loading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-9 px-3 text-xs gap-1.5 rounded-lg',
    md: 'min-h-[44px] h-11 px-4 text-xs sm:text-sm font-bold gap-2 rounded-xl',
    default: 'min-h-[44px] h-11 px-4 text-xs sm:text-sm font-bold gap-2 rounded-xl',
    lg: 'min-h-[48px] h-12 px-6 text-sm sm:text-base font-bold gap-2.5 rounded-2xl',
    icon: 'w-10 h-10 min-w-[40px] min-h-[40px] p-0 rounded-xl'
  }[size]

  const variantClasses = {
    default:
      'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border border-slate-700/60 shadow-sm',
    primary:
      'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border border-slate-700/60 shadow-sm',
    secondary:
      'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-800',
    outline:
      'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700',
    amber:
      'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20 border border-amber-400',
    emerald:
      'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20 border border-emerald-400',
    danger:
      'bg-rose-500 hover:bg-rose-400 text-white font-bold shadow-md shadow-rose-500/20 border border-rose-400',
    destructive:
      'bg-rose-500 hover:bg-rose-400 text-white font-bold shadow-md shadow-rose-500/20 border border-rose-400',
    ghost:
      'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
  }[variant]

  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium select-none transition-all active:scale-[0.97] touch-manipulation focus:outline-none focus:ring-2 focus:ring-amber-500/40 disabled:opacity-50 disabled:pointer-events-none ${
        fullWidth ? 'w-full' : ''
      } ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children && <span className="truncate">{children}</span>}
    </button>
  )
}
