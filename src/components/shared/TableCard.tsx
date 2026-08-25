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
    free: 'bg-white dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md',
    occupied: 'bg-amber-500/[0.06] dark:bg-amber-950/30 border-amber-500/40 dark:border-amber-500/40 text-amber-950 dark:text-amber-100 shadow-sm hover:border-amber-500 hover:shadow-md hover:shadow-amber-500/5',
    'open-tab': 'bg-amber-500/[0.06] dark:bg-amber-950/30 border-amber-500/40 dark:border-amber-500/40 text-amber-950 dark:text-amber-100 shadow-sm hover:border-amber-500 hover:shadow-md hover:shadow-amber-500/5',
    billing: 'bg-emerald-500/[0.06] dark:bg-emerald-950/30 border-emerald-500/40 dark:border-emerald-500/40 text-emerald-950 dark:text-emerald-100 shadow-sm hover:border-emerald-500 hover:shadow-md hover:shadow-emerald-500/5',
    reserved: 'bg-blue-500/[0.06] dark:bg-blue-950/30 border-blue-500/40 dark:border-blue-500/40 text-blue-950 dark:text-blue-100 shadow-sm hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/5',
  }[table.status] || 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'

  const selectedClass = isSelected
    ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-950 shadow-lg shadow-amber-500/10'
    : ''

  const colSpanClass = slotSpan === 2 ? 'col-span-2' : 'col-span-1'
  const maxCapacity = table.maxCapacity || table.pax || 4

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col justify-between p-3 rounded-2xl border transition-all duration-150 cursor-pointer select-none min-w-[105px] active:scale-[0.98] ${colSpanClass} ${statusClasses} ${selectedClass} ${className}`}
    >
      {/* Top Anchor Row: Table Number + Capacity + Timer */}
      <div className="flex items-center justify-between gap-1.5 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
            {table.name}
          </span>
          {isVip && (
            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-semibold shrink-0">
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
              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium truncate">
                {table.customerName}
              </p>
            )}
            {isExpanded && table.orderCount > 0 && (
              <p className="text-[10px] text-slate-600 dark:text-slate-400 truncate">
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
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              {table.status === 'reserved' ? '📅 Dipesan' : '✨ Siap Digunakan'}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Outcome Row: Total Bill + Quick Ops Button */}
      <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-slate-200 dark:border-slate-800/60 min-w-0">
        <div className="min-w-0 flex-1">
          {isOccupied && table.totalBill !== undefined ? (
            <PriceTag
              amount={table.totalBill}
              size={isExpanded ? 'md' : 'sm'}
              variant={table.status === 'billing' ? 'emerald' : 'accent'}
            />
          ) : (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">IDR 0</span>
          )}
        </div>

        {onOpenOpsModal && isOccupied && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onOpenOpsModal(e)
            }}
            className="p-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 text-xs"
            title="Opsi Meja (Pindah/Gabung)"
          >
            ⚙️
          </button>
        )}
      </div>
    </div>
  )
}
