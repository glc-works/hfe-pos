import React from 'react'

export interface SegmentedOption<T extends string = string> {
  value: T
  label: string
  icon?: string | React.ReactNode
  badge?: string | number
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  size?: 'sm' | 'md'
  fullWidth?: boolean
  className?: string
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  size = 'md',
  fullWidth = true,
  className = ''
}: SegmentedControlProps<T>) {
  const containerSize = size === 'sm' ? 'p-0.5 rounded-xl' : 'p-1 rounded-2xl'
  const itemSize = size === 'sm' ? 'py-1 px-2.5 text-xs' : 'py-2 px-3 text-xs sm:text-sm font-bold min-h-[38px]'

  return (
    <div
      role="radiogroup"
      className={`inline-flex items-center bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 ${
        fullWidth ? 'w-full grid' : ''
      } ${containerSize} ${className}`}
      style={fullWidth ? { gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` } : undefined}
    >
      {options.map((opt) => {
        const isActive = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(opt.value)}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl select-none transition-all active:scale-[0.98] touch-manipulation font-medium ${itemSize} ${
              isActive
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-300/50 dark:hover:bg-slate-800/50'
            }`}
          >
            {opt.icon && <span className="flex-shrink-0">{opt.icon}</span>}
            <span className="truncate">{opt.label}</span>
            {opt.badge !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.2 text-[10px] font-mono rounded-full ${
                  isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-300 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {opt.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
