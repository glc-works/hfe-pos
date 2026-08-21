import React from 'react'
import { X } from 'lucide-react'

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  leadingIcon?: React.ReactNode
  onClear?: () => void
  error?: string
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  leadingIcon,
  onClear,
  error,
  value,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-1">
      {label && <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</label>}
      <div className="relative flex items-center w-full">
        {leadingIcon && (
          <div className="absolute left-3.5 pointer-events-none text-slate-400 flex items-center justify-center">
            {leadingIcon}
          </div>
        )}
        <input
          value={value}
          className={`w-full min-h-[44px] h-11 bg-white dark:bg-slate-900 border rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all ${
            leadingIcon ? 'pl-10' : 'pl-3.5'
          } ${onClear && value ? 'pr-10' : 'pr-3.5'} ${
            error ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-slate-300 dark:border-slate-800'
          } ${className}`}
          {...props}
        />
        {onClear && value ? (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
            aria-label="Clear input"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>
      {error && <span className="text-[11px] text-rose-500 font-medium pl-1">{error}</span>}
    </div>
  )
}
