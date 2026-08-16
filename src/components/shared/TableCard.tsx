import React from 'react'
import { TableStatus } from '../../types/pos'
import { PriceTag } from '../../ui/PriceTag'
import { TimerPill } from '../../ui/TimerPill'
import { MinSpendPill } from '../../ui/MinSpendPill'
import { CapacityBadge } from '../../ui/CapacityBadge'

export interface TableCardProps {
  table: TableStatus
  slotSpan?: 1 | 2
  viewMode?: 'compact' | 'expanded'
  isSelected?: boolean
  onClick?: () => void
  onOpenOpsModal?: (e: React.MouseEvent) => void
  className?: string
}

export const TableCard: React.FC<TableCardProps> = ({
  table,
  slotSpan = 1,
  viewMode = 'compact',
  isSelected = false,
  onClick,
  onOpenOpsModal,
  className = '',
}) => {
  const isOccupied = table.status !== 'free' && table.status !== 'reserved'
  const isVip = table.zoneId === 'vip-private' || Boolean(table.minSpend && table.minSpend > 0)
  const isExpanded = viewMode === 'expanded'

  // Dynamic status-colored borders and backgrounds
  const statusClasses = {
    free: 'border-slate-700/60 bg-slate-900/60 hover:border-slate-500',
    occupied: 'border-amber-500/50 bg-amber-950/20 hover:border-amber-400',
    'open-tab': 'border-amber-500/50 bg-amber-950/20 hover:border-amber-400',
    billing: 'border-emerald-500/50 bg-emerald-950/20 hover:border-emerald-400',
    reserved: 'border-blue-500/50 bg-blue-950/20 hover:border-blue-400',
  }[table.status] || 'border-slate-800 bg-slate-900/40'

  const selectedClass = isSelected
    ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950 shadow-lg shadow-amber-500/10'
    : ''

  const colSpanClass = slotSpan === 2 ? 'col-span-2' : 'col-span-1'
  const maxCapacity = table.maxCapacity || table.pax || 4

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col justify-between p-2.5 rounded-xl border transition-all duration-150 cursor-pointer select-none min-w-[105px] ${colSpanClass} ${statusClasses} ${selectedClass} ${className}`}
    >
      {/* Top Anchor Row: Table Number + Capacity + Timer */}
      <div className="flex items-center justify-between gap-1.5 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-mono font-bold text-sm text-slate-100 truncate">
            {table.name}
          </span>
          {isVip && (
            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold shrink-0">
              VIP
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <CapacityBadge
            seatedGuests={table.seatedGuests}
            maxCapacity={maxCapacity}
            isOccupied={isOccupied}
          />
          {table.seatedDurationMinutes !== undefined && table.seatedDurationMinutes > 0 && (
            <TimerPill elapsedMinutes={table.seatedDurationMinutes} />
          )}
        </div>
      </div>

      {/* Middle Content: Guest Name / Order Count / VIP Min Spend */}
      <div className="my-2 flex-1 min-w-0 flex flex-col justify-center">
        {isOccupied ? (
          <div className="space-y-1 min-w-0">
            {table.customerName && (
              <p className="text-xs text-slate-200 font-medium truncate">
                {table.customerName}
              </p>
            )}
            {isExpanded && table.orderCount > 0 && (
              <p className="text-[10px] text-slate-400 truncate">
                🍽️ {table.orderCount} Menu dipesan
              </p>
            )}
            {table.minSpend && table.minSpend > 0 && (
              <div className="mt-1">
                <MinSpendPill
                  currentBill={table.totalBill || 0}
                  minimumSpend={table.minSpend}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="py-1">
            <span className="text-[11px] text-slate-500 font-mono">
              {table.status === 'reserved' ? '📅 Dipesan' : '✨ Siap Digunakan'}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Outcome Row: Total Bill + Quick Ops Button */}
      <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-slate-800/60 min-w-0">
        <div className="min-w-0 flex-1">
          {isOccupied && table.totalBill !== undefined ? (
            <PriceTag
              amount={table.totalBill}
              size={isExpanded ? 'md' : 'sm'}
              variant={table.status === 'billing' ? 'emerald' : 'accent'}
            />
          ) : (
            <span className="text-[10px] text-slate-500 font-mono">IDR 0</span>
          )}
        </div>

        {onOpenOpsModal && isOccupied && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onOpenOpsModal(e)
            }}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors shrink-0 text-xs"
            title="Opsi Meja (Pindah/Gabung)"
          >
            ⚙️
          </button>
        )}
      </div>
    </div>
  )
}
