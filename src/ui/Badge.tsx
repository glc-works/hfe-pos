import React from 'react'

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'destructive'
  | 'amber'
  | 'emerald'
  | 'warning'
  | 'success'
  | 'indigo'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant
  glyph?: string
  children: React.ReactNode
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  glyph,
  children,
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-slate-900 text-slate-100 border-slate-700 dark:bg-slate-800 dark:text-slate-100',
    secondary: 'bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
    outline: 'bg-transparent text-slate-700 border-slate-300 dark:text-slate-300 dark:border-slate-700',
    destructive: 'bg-rose-500/20 text-rose-700 border-rose-500/40 dark:text-rose-300',
    amber: 'bg-amber-500/20 text-amber-900 border-amber-500/40 dark:text-amber-300',
    emerald: 'bg-emerald-500/20 text-emerald-900 border-emerald-500/40 dark:text-emerald-300',
    warning: 'bg-amber-500/20 text-amber-900 border-amber-500/40 dark:text-amber-300',
    success: 'bg-emerald-500/20 text-emerald-900 border-emerald-500/40 dark:text-emerald-300',
    indigo: 'bg-indigo-500/20 text-indigo-900 border-indigo-500/40 dark:text-indigo-300'
  }[variant]

  return (
    <div
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border select-none transition-colors ${variantStyles} ${className}`}
      {...props}
    >
      {glyph && <span className="flex-shrink-0">{glyph}</span>}
      <span>{children}</span>
    </div>
  )
}
