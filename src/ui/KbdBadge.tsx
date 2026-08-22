import React from 'react'

export interface KbdBadgeProps {
  shortcut?: string
  children?: React.ReactNode
  label?: string
  className?: string
}

export const KbdBadge: React.FC<KbdBadgeProps> = ({ shortcut, children, label, className = '' }) => {
  const text = shortcut || children
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-200/90 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700/60 px-1.5 py-0.5 rounded shadow-sm select-none ${className}`}
    >
      {label && <span className="text-slate-600 dark:text-slate-300">{label}</span>}
      <kbd className="font-mono">{text}</kbd>
    </span>
  )
}
