import React from 'react'

export interface CapacityBadgeProps {
  seatedGuests?: number
  maxCapacity: number
  isOccupied?: boolean
  className?: string
}

export const CapacityBadge: React.FC<CapacityBadgeProps> = ({
  seatedGuests,
  maxCapacity,
  isOccupied = false,
  className = '',
}) => {
  const displayRatio =
    isOccupied && seatedGuests !== undefined
      ? `${seatedGuests}/${maxCapacity}`
      : `${maxCapacity}`

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/50 ${className}`}
    >
      <span>👥</span>
      <span>{displayRatio} Kursi</span>
    </span>
  )
}
