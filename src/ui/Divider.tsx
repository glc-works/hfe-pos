import React from 'react'

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  label?: string
  className?: string
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  label,
  className = ''
}) => {
  if (orientation === 'vertical') {
    return <div className={`w-[1px] h-full bg-slate-200 dark:bg-slate-800 ${className}`} />
  }

  if (label) {
    return (
      <div className={`flex items-center gap-3 w-full my-2 ${className}`}>
        <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-800" />
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 select-none uppercase tracking-wider">
          {label}
        </span>
        <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-800" />
      </div>
    )
  }

  return <div className={`w-full h-[1px] bg-slate-200 dark:bg-slate-800 my-2 ${className}`} />
}
