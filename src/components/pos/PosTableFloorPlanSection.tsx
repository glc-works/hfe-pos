import React, { useState, useMemo } from 'react'
import { Clock, Crown, ShieldAlert, ChevronDown, ArrowRightLeft, Check } from 'lucide-react'
import { TableStatus, PropertyZoneConfig, PropertyZoneId } from '../../types/pos'
import { PROPERTY_ZONES } from '../../data/mockData'
import { useTranslation } from '../../context/LanguageContext'

export interface PosTableFloorPlanSectionProps {
  tablesGrid: TableStatus[]
  selectedPOSTable: TableStatus | null
  tableStatusFilter: 'all' | 'unpaid' | 'paid' | 'available'
  propertyZones?: PropertyZoneConfig[]
  selectedZoneId?: PropertyZoneId
  unpaidCount: number
  paidCount: number
  availableCount: number
  isMobile: boolean
  viewMode?: 'grid' | 'compact' | 'list'
  setTableStatusFilter: (filter: 'all' | 'unpaid' | 'paid' | 'available') => void
  setSelectedZoneId?: (zoneId: PropertyZoneId) => void
  handleTableClick: (table: TableStatus) => void
  onOpenTableOpsModal: () => void
}

export const PosTableFloorPlanSection: React.FC<PosTableFloorPlanSectionProps> = ({
  tablesGrid,
  selectedPOSTable,
  tableStatusFilter,
  propertyZones = PROPERTY_ZONES,
  selectedZoneId: propSelectedZoneId,
  unpaidCount,
  paidCount,
  availableCount,
  isMobile,
  viewMode = 'grid',
  setTableStatusFilter,
  setSelectedZoneId: propSetSelectedZoneId,
  handleTableClick,
  onOpenTableOpsModal
}) => {
  const { t, formatPrice, language } = useTranslation()
  const [internalZoneId, setInternalZoneId] = useState<PropertyZoneId>('all')

  const activeZoneId = propSelectedZoneId !== undefined ? propSelectedZoneId : internalZoneId

  // Combined Zone & Status Filtering
  const effectiveTables = useMemo(() => {
    return tablesGrid.filter((table) => {
      // 1. Zone filter with automatic prefix fallback
      const resolvedZone = table.zoneId || (
        table.name.startsWith('OUT') ? 'outdoor-garden' :
        table.name.startsWith('IND') ? 'indoor-ac' :
        table.name.startsWith('VIP') ? 'vip-private' :
        table.name.startsWith('POOL') ? 'poolside-cabana' :
        table.name.startsWith('ROOF') ? 'rooftop-skybar' : 'indoor-ac'
      )
      const matchZone = activeZoneId === 'all' || resolvedZone === activeZoneId

      // 2. Status filter
      const isUnpaid = (table.status === 'open-tab' || table.status === 'occupied') && table.totalBill > 0
      const isPaid = table.customerName?.includes('(Lunas)') || (table.status === 'occupied' && table.totalBill === 0)
      const isAvailable = table.status === 'free'

      let matchStatus = true
      if (tableStatusFilter === 'unpaid') matchStatus = isUnpaid
      if (tableStatusFilter === 'paid') matchStatus = isPaid
      if (tableStatusFilter === 'available') matchStatus = isAvailable

      return matchZone && matchStatus
    })
  }, [tablesGrid, activeZoneId, tableStatusFilter])

  // Grouped Zones for Adaptive Bounded Surfaces
  const groupedZones = useMemo(() => {
    if (activeZoneId !== 'all') {
      const currentZoneConfig = propertyZones.find(z => z.id === activeZoneId) || {
        id: activeZoneId,
        name: activeZoneId.replace('-', ' '),
        icon: '🏢'
      }
      return [{
        zone: currentZoneConfig,
        tables: effectiveTables
      }]
    }

    const zonesWithTables: { zone: PropertyZoneConfig; tables: TableStatus[] }[] = []
    
    propertyZones.filter(z => z.id !== 'all').forEach(zone => {
      const matchingTables = effectiveTables.filter(t => {
        const resolvedZone = t.zoneId || (
          t.name.startsWith('OUT') ? 'outdoor-garden' :
          t.name.startsWith('IND') ? 'indoor-ac' :
          t.name.startsWith('VIP') ? 'vip-private' :
          t.name.startsWith('POOL') ? 'poolside-cabana' :
          t.name.startsWith('ROOF') ? 'rooftop-skybar' : 'indoor-ac'
        )
        return resolvedZone === zone.id
      })

      if (matchingTables.length > 0) {
        zonesWithTables.push({
          zone,
          tables: matchingTables
        })
      }
    })

    // Catch-all for uncategorized tables
    const matchedIds = new Set(zonesWithTables.flatMap(g => g.tables.map(t => t.id)))
    const remaining = effectiveTables.filter(t => !matchedIds.has(t.id))
    if (remaining.length > 0) {
      zonesWithTables.push({
        zone: { id: 'all', name: 'Area Utama', icon: '📍' },
        tables: remaining
      })
    }

    return zonesWithTables
  }, [effectiveTables, activeZoneId, propertyZones])

  // LIST VIEW: Tabular Layout
  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-1.5 pb-20">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">{t.pos?.tablesCount ? `${t.pos.tablesCount} / ID` : 'Table / ID'}</th>
                <th className="py-2.5 px-3">{language === 'en' ? 'Zone' : 'Zona'}</th>
                <th className="py-2.5 px-3">{language === 'en' ? 'Guest' : 'Tamu'}</th>
                <th className="py-2.5 px-3">{language === 'en' ? 'Duration' : 'Durasi'}</th>
                <th className="py-2.5 px-3 text-right">{language === 'en' ? 'Bill' : 'Tagihan'}</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {effectiveTables.map((table) => {
                const isSelected = selectedPOSTable?.id === table.id
                const isUnpaid = (table.status === 'open-tab' || table.status === 'occupied') && table.totalBill > 0
                const isAvailable = table.status === 'free'
                return (
                  <tr
                    key={table.id}
                    onClick={() => handleTableClick(table)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-amber-500/20 text-white font-bold'
                        : 'hover:bg-slate-850 text-slate-200'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono font-black text-amber-400">{table.name}</td>
                    <td className="py-2.5 px-3 text-slate-400 capitalize">{table.zoneId?.replace('-', ' ') || 'Utama'}</td>
                    <td className="py-2.5 px-3 truncate max-w-[120px]">{table.customerName || '-'}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{table.seatedDurationMinutes ? `${table.seatedDurationMinutes}m` : '-'}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-right text-emerald-400">{formatPrice(table.totalBill)}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isUnpaid ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        isAvailable ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}>
                        {isUnpaid ? (language === 'en' ? 'Bill' : 'Tagihan') : isAvailable ? (language === 'en' ? 'Available' : 'Kosong') : (language === 'en' ? 'Paid' : 'Lunas')}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // GRID & COMPACT VIEWS: PROPORTIONAL TETRIS MASTER GRID
  const renderZoneCard = (group: typeof groupedZones[0]) => {
    const totalTables = group.tables.length
    const occupiedCount = group.tables.filter(t => t.status !== 'free').length
    const totalZoneSales = group.tables.reduce((sum, t) => sum + (t.totalBill || 0), 0)
    const isSingleZoneView = activeZoneId !== 'all'
    const isVipZone = group.zone.id === 'vip-private'

    // Proportional Container 2D Tetris Slot Span (Anti-Empty Space & Symmetric 3x2 Pairing):
    // 6 tables (Outdoor/Indoor) -> col-span-3 row-span-2 h-full (3x2 tables = 6, pairs 3 + 3 = 6!)
    // 4 tables (Poolside/Rooftop) -> col-span-4 row-span-1 (all 4 tables in 1 row)
    // Tall VIP Zone (2 tables stacked) -> col-span-2 row-span-2 h-full
    // (Result: Outdoor & Indoor pair 3+3=6 on Rows 1-2, VIP & Poolside/Rooftop pair 2+4=6 on Rows 3-4!)
    let zoneSpanClass = 'col-span-1 sm:col-span-2 lg:col-span-6 lg:row-span-1'
    if (!isSingleZoneView) {
      if (isVipZone || totalTables <= 2) {
        zoneSpanClass = 'col-span-1 sm:col-span-2 lg:col-span-2 lg:row-span-2 h-full'
      } else if (totalTables === 3 || totalTables === 4) {
        zoneSpanClass = 'col-span-1 sm:col-span-2 lg:col-span-4 lg:row-span-1'
      } else {
        zoneSpanClass = 'col-span-1 sm:col-span-2 lg:col-span-3 lg:row-span-2 h-full'
      }
    }

    // Internal Table Cards Grid matching the container's allocated width:
    let internalGridClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-6'
    if (isSingleZoneView) {
      internalGridClass = viewMode === 'compact'
        ? (isMobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-6')
        : (isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4')
    } else if (isVipZone || totalTables <= 2) {
      // In VIP tall zone, tables stack vertically in 1 column (2 rows tall)
      internalGridClass = 'grid-cols-1'
    } else if (totalTables === 3 || totalTables === 4) {
      internalGridClass = 'grid-cols-2 sm:grid-cols-4'
    } else {
      // 6-table zone: 3 columns x 2 rows = 6 tables (Zero empty cells!)
      internalGridClass = 'grid-cols-2 sm:grid-cols-3'
    }

    return (
      <div
        key={group.zone.id}
        className={`${zoneSpanClass} bg-slate-900/40 border border-slate-800/80 rounded-2xl p-3 flex flex-col justify-between gap-2.5 shadow-sm`}
      >
        {/* ZONE MICRO-HEADER WITH METRICS (CLEAN 1-ROW DEFENSIVE TRUNCATION) */}
        <div className="flex items-center justify-between gap-2 px-1 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0 truncate">
            <span className="text-sm shrink-0">{group.zone.icon || '🏢'}</span>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-200 truncate">
              {group.zone.name}
            </h3>
            <span className="text-[10px] font-mono font-bold bg-slate-800/90 text-slate-400 px-1.5 py-0.2 rounded-md shrink-0">
              {totalTables} {t.pos?.tablesCount || (language === 'en' ? 'Tables' : 'Meja')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-mono shrink-0">
            <span className={occupiedCount > 0 ? 'text-amber-400 font-bold' : 'text-slate-500'}>
              {occupiedCount}/{totalTables} {t.pos?.occupiedCount || (language === 'en' ? 'Occupied' : 'Terisi')}
            </span>
            {totalZoneSales > 0 && (
              <span className="text-emerald-400 font-bold">
                • {formatPrice(totalZoneSales)}
              </span>
            )}
          </div>
        </div>

        {/* PROPORTIONALLY PACKED FIXED-SLOT TABLE CARDS GRID */}
        <div className={`grid gap-2 sm:gap-2.5 ${internalGridClass}`}>
          {group.tables.map((table) => {
            const isUnpaid = (table.status === 'open-tab' || table.status === 'occupied') && table.totalBill > 0
            const isPaid = table.customerName?.includes('(Lunas)') || (table.status === 'occupied' && table.totalBill === 0)
            const isAvailable = table.status === 'free'
            const isVip = table.zoneId === 'vip-private' || !!table.minSpend
            const minSpendShortfall = table.minSpend && table.minSpend > 0
              ? Math.max(0, table.minSpend - table.totalBill)
              : 0
            const minSpendProgress = table.minSpend && table.minSpend > 0
              ? Math.round((table.totalBill / table.minSpend) * 100)
              : null

            // Simplified clean table number for display
            const displayTableName = table.name.replace(/^(OUT|IND|POOL|ROOF)-/i, '')
            const isCompact = viewMode === 'compact'

            // Fixed-Slot Allocation:
            // Standard Table: 1 Slot
            // VIP Table: 2 Slots (Full width on compact mobile, 2 slots on tablet/desktop)
            const slotSpanClass = isVip
              ? (isCompact
                  ? 'col-span-2'
                  : 'col-span-1 sm:col-span-2')
              : 'col-span-1'

            return (
              <div
                key={table.id}
                onClick={() => handleTableClick(table)}
                className={`${slotSpanClass} border rounded-2xl p-2.5 flex flex-col justify-center gap-1.5 ${
                  isCompact ? 'min-h-[72px] sm:min-h-[76px]' : 'min-h-[110px] sm:min-h-[118px]'
                } transition-all cursor-pointer relative overflow-hidden group ${
                  selectedPOSTable?.id === table.id
                    ? 'ring-2 ring-indigo-500 bg-indigo-500/20 border-indigo-500 shadow-lg'
                    : isUnpaid
                    ? 'bg-amber-500/10 border-amber-500/60 hover:border-amber-400'
                    : isPaid
                    ? 'bg-indigo-500/10 border-indigo-500/50 hover:border-indigo-400'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* ========================================================================= */}
                {/* CASE A: COMPACT VIEW (FIBONACCI 2-ROW SOLID GRAVITY - ZERO VOID HOLE)     */}
                {/* ========================================================================= */}
                {isCompact ? (
                  !isAvailable ? (
                    <>
                      {/* ROW 1: TABLE ID (LEFT) & UTILISATION (RIGHT) — EXACTLY 2 ELEMENTS */}
                      <div className="flex items-center justify-between gap-1 min-w-0">
                        <div className="flex items-center gap-1 min-w-0">
                          {isVip && <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                          <span className="font-mono font-black text-xs sm:text-[13px] text-white whitespace-nowrap">
                            {isVip ? table.name : displayTableName}
                          </span>
                        </div>

                        {/* RIGHT ANCHOR: HEADCOUNT UTILISATION */}
                        <span className="font-mono font-bold text-xs text-amber-300 shrink-0">
                          👥 {table.seatedGuests || table.pax || 2}/{table.maxCapacity || table.pax || 4}
                        </span>
                      </div>

                      {/* ROW 2: FULL WIDTH MONETARY LINE (EXACTLY 1 ELEMENT — ZERO CLIPPING) */}
                      <div className="pt-1 border-t border-slate-800/70 flex items-center justify-center min-w-0">
                        <span className={`font-mono font-black text-xs sm:text-sm tabular-nums whitespace-nowrap text-center ${
                          isUnpaid ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {table.totalBill > 0 ? formatPrice(table.totalBill) : (language === 'en' ? 'PAID' : 'LUNAS')}
                        </span>
                      </div>

                      {/* VIP EXECUTIVE GOLD PILL (IF MIN SPEND CONFIGURED) */}
                      {table.minSpend && (
                        <div className={`text-[9px] sm:text-[10px] font-mono font-bold rounded px-1.5 py-0.5 text-center mt-0.5 whitespace-nowrap truncate ${
                          minSpendShortfall > 0
                            ? 'text-amber-400 bg-amber-500/15 border border-amber-500/30'
                            : 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30'
                        }`}>
                          {minSpendShortfall > 0
                            ? `👑 ${minSpendProgress}% • Sisa ${formatPrice(minSpendShortfall)}`
                            : `👑 Lolos Min Spend (${minSpendProgress}%)`}
                        </div>
                      )}
                    </>
                  ) : (
                    /* EMPTY TABLE (COMPACT: SOLID 2-ROW BALANCED MONAD) */
                    <>
                      <div className="flex items-center justify-between gap-1 min-w-0">
                        <div className="flex items-center gap-1 min-w-0">
                          {isVip && <Crown className="w-3.5 h-3.5 text-amber-400/60 shrink-0" />}
                          <span className="font-mono font-black text-xs sm:text-[13px] text-white whitespace-nowrap">
                            {isVip ? table.name : displayTableName}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 font-mono font-medium">
                          👥 {table.maxCapacity || table.pax || 4}
                        </span>
                      </div>
                      <div className="text-center text-[10px] font-mono text-slate-500 group-hover:text-slate-300 transition-colors py-0.5">
                        + {language === 'en' ? 'Available' : 'Kosong'}
                      </div>
                    </>
                  )
                ) : (
                  /* ========================================================================= */
                  /* CASE B: FULL GRID VIEW (RICH OPERATIONAL DATA & COMPOSITE FIBONACCI FLOW) */
                  /* ========================================================================= */
                  !isAvailable ? (
                    <>
                      {/* ROW 1: HEADER (ID LEFT • UTILISATION CENTER • TIMER RIGHT) */}
                      <div className="flex items-center justify-between gap-1 min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0 truncate">
                          {isVip && <Crown className="w-4 h-4 text-amber-400 shrink-0" />}
                          <span className="font-mono font-black text-sm sm:text-base text-white whitespace-nowrap">
                            {isVip ? table.name : displayTableName}
                          </span>
                          <span className="font-mono font-bold text-xs text-amber-300 shrink-0">
                            👥 {table.seatedGuests || table.pax || 2}/{table.maxCapacity || table.pax || 4}
                          </span>
                        </div>

                        {/* RIGHT: TIMER */}
                        {table.seatedDurationMinutes ? (
                          <div className={`flex items-center gap-0.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                            table.seatedDurationMinutes > 40
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}>
                            <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>{table.seatedDurationMinutes}m</span>
                          </div>
                        ) : null}
                      </div>

                      {/* ROW 2: GUEST & MENU COUNT */}
                      <div className="flex items-center justify-between gap-2 my-0.5 min-w-0">
                        <span className="text-[11px] font-medium text-slate-200 truncate">
                          {table.customerName || t.pos?.walkInGuest || (language === 'en' ? 'Walk-In' : 'Tamu Walk-In')}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded shrink-0">
                          🍽️ {table.orderCount || 2} Menu
                        </span>
                      </div>

                      {/* VIP MIN SPEND BAR (IF CONFIGURED) */}
                      {minSpendProgress !== null && table.minSpend && (
                        <div className="flex flex-col gap-1 my-0.5">
                          <div className="flex items-center justify-between text-[9px] font-mono">
                            <span className="text-amber-400/90 font-bold">
                              👑 {minSpendProgress}% {minSpendShortfall > 0 ? `(Sisa ${formatPrice(minSpendShortfall)})` : '(Lolos)'}
                            </span>
                            <span className="text-slate-400">{formatPrice(table.minSpend)}</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${minSpendProgress >= 100 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                              style={{ width: `${Math.min(100, minSpendProgress)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* ROW 3: FOOTER (TICKET / DINE-IN • TOTAL PRICE) */}
                      <div className="pt-1.5 border-t border-slate-800/60 flex items-center justify-between gap-2 min-w-0">
                        <span className="text-[10px] font-mono text-slate-400 truncate">
                          {table.orderIds?.[0] || 'Dine-In'}
                        </span>
                        <span className={`font-mono font-black text-xs sm:text-sm tabular-nums whitespace-nowrap shrink-0 ${
                          isUnpaid ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {table.totalBill > 0 ? formatPrice(table.totalBill) : (language === 'en' ? 'PAID' : 'LUNAS')}
                        </span>
                      </div>
                    </>
                  ) : (
                    /* EMPTY TABLE (FULL VIEW: SOLID CENTER MONAD) */
                    <>
                      <div className="flex items-center justify-between gap-1 min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {isVip && <Crown className="w-4 h-4 text-amber-400/60 shrink-0" />}
                          <span className="font-mono font-black text-sm sm:text-base text-white whitespace-nowrap">
                            {isVip ? table.name : displayTableName}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 font-mono font-medium">
                          👥 {table.maxCapacity || table.pax || 4}
                        </span>
                      </div>

                      <div className="flex flex-col items-center justify-center py-1.5 text-center">
                        <span className="text-[11px] text-slate-400 font-mono group-hover:text-emerald-400 transition-colors">
                          + {language === 'en' ? 'Open Table' : 'Buka Meja'}
                        </span>
                      </div>
                    </>
                  )
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pb-20 grid-flow-dense items-start">
      {groupedZones.map(renderZoneCard)}
    </div>
  )
}
