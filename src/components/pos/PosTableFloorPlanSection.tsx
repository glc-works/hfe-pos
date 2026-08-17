import React, { useState, useMemo } from 'react'
import { Clock, Crown } from 'lucide-react'
import { TableStatus, PropertyZoneConfig, PropertyZoneId } from '../../types/pos'
import { PROPERTY_ZONES } from '../../data/mockData'
import { useTranslation } from '../../context/LanguageContext'
import { PriceTag } from '../../ui/PriceTag'
import { AreaSurfaceOverlay, AREA_SURFACE_PALETTES } from './AreaSurfaceOverlay'

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
  const { t, formatPrice, formatCompactPrice, language } = useTranslation()
  const [internalZoneId, setInternalZoneId] = useState<PropertyZoneId>('all')

  const activeZoneId = propSelectedZoneId !== undefined ? propSelectedZoneId : internalZoneId

  const resolveZone = (t: TableStatus): PropertyZoneId =>
    t.zoneId || (t.name.startsWith('OUT') ? 'outdoor-garden' : t.name.startsWith('IND') ? 'indoor-ac' : t.name.startsWith('VIP') ? 'vip-private' : t.name.startsWith('POOL') ? 'poolside-cabana' : t.name.startsWith('ROOF') ? 'rooftop-skybar' : 'indoor-ac')

  // Combined Zone & Status Filtering
  const effectiveTables = useMemo(() => {
    return tablesGrid.filter((table) => {
      const matchZone = activeZoneId === 'all' || resolveZone(table) === activeZoneId
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
      const currentZoneConfig = propertyZones.find(z => z.id === activeZoneId) || { id: activeZoneId, name: activeZoneId.replace('-', ' '), icon: '🏢' }
      return [{ zone: currentZoneConfig, tables: effectiveTables }]
    }

    const zonesWithTables: { zone: PropertyZoneConfig; tables: TableStatus[] }[] = []
    propertyZones.filter(z => z.id !== 'all').forEach(zone => {
      const matchingTables = effectiveTables.filter(t => resolveZone(t) === zone.id)
      if (matchingTables.length > 0) zonesWithTables.push({ zone, tables: matchingTables })
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

  // GRID & COMPACT VIEWS: SEPARATED SPATIAL ENGINES
  const isCompact = viewMode === 'compact'

  const renderTableCard = (table: TableStatus, isCompactMode: boolean, isContinuousGrid = false) => {
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

    const zoneIcon = table.zoneId === 'outdoor-garden' ? '🌿'
      : table.zoneId === 'indoor-ac' ? '❄️'
      : table.zoneId === 'vip-private' ? '👑'
      : table.zoneId === 'poolside-cabana' ? '🏊'
      : '🍸'

    // Glyph-First Micro-Budget Table Name for Compact View
    const displayTableName = isCompactMode
      ? (isVip ? table.name : `${zoneIcon} ${table.name.replace(/^(OUT|IND|POOL|ROOF)-/i, '')}`)
      : `${zoneIcon} ${table.name}`

    // Fixed-Slot Allocation:
    // Standard Table: 1 Slot (25% width in Grid View, 16.6% in 6-Col Compact)
    // VIP Table: 2 Slots in Grid View and 2 Slots in Compact View
    const slotSpanClass = isVip
      ? (isCompactMode ? 'col-span-2 sm:col-span-2 lg:col-span-2' : 'col-span-1 sm:col-span-2')
      : 'col-span-1'
    const zonePalette = AREA_SURFACE_PALETTES[table.zoneId as PropertyZoneId] || AREA_SURFACE_PALETTES.all
    const defaultSurfaceClass = `${zonePalette.bgCard} ${zonePalette.borderCard} ${zonePalette.hoverBorderCard}`

    return (
      <div
        key={table.id}
        onClick={() => handleTableClick(table)}
        className={`${slotSpanClass} border rounded-2xl p-3 flex flex-col justify-between gap-1.5 ${
          isCompactMode ? 'min-h-[72px] sm:min-h-[76px]' : 'min-h-[114px] sm:min-h-[122px]'
        } transition-all duration-150 cursor-pointer relative overflow-hidden group active:scale-[0.98] ${
          isUnpaid
            ? 'bg-amber-500/10 border-amber-500/60 hover:border-amber-400 shadow-sm'
            : isPaid
            ? 'bg-indigo-500/10 border-indigo-500/50 hover:border-indigo-400'
            : defaultSurfaceClass
        }`}
      >
        {/* CASE A: COMPACT VIEW */}
        {isCompactMode ? (
          !isAvailable ? (
            <>
              {/* ROW 1: TABLE ID (LEFT) & UTILISATION (RIGHT) — EXACTLY 2 ELEMENTS */}
              <div className="flex items-center justify-between gap-1 min-w-0">
                <div className="flex items-center gap-1 min-w-0 truncate">
                  {isVip && <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  <span className="font-mono font-black text-xs text-white truncate">
                    {displayTableName}
                  </span>
                </div>

                {/* RIGHT ANCHOR: HEADCOUNT UTILISATION */}
                <span className="font-mono font-bold text-[10px] sm:text-[11px] text-amber-300 shrink-0 whitespace-nowrap">
                  👥 {table.seatedGuests || table.pax || 2}/{table.maxCapacity || table.pax || 4}
                </span>
              </div>

              {/* ROW 2: FULL WIDTH MONETARY LINE (EXACTLY 1 ELEMENT — ZERO CLIPPING) */}
              <div className="pt-1 border-t border-slate-800/70 flex items-center justify-center min-w-0">
                {table.totalBill > 0 ? (
                  <PriceTag
                    amount={table.totalBill}
                    mode="adaptive"
                    isVipSpan={isVip}
                    variant={isUnpaid ? 'accent' : 'emerald'}
                    size="sm"
                    className="font-black text-xs sm:text-sm"
                  />
                ) : (
                  <span className="font-mono font-black text-xs sm:text-sm text-emerald-400">
                    {language === 'en' ? 'PAID' : 'LUNAS'}
                  </span>
                )}
              </div>

              {/* VIP EXECUTIVE GOLD PILL (IF MIN SPEND CONFIGURED) */}
              {table.minSpend && (
                <div className={`text-[9px] sm:text-[10px] font-mono font-bold rounded px-1.5 py-0.5 text-center mt-0.5 whitespace-nowrap truncate ${
                  minSpendShortfall > 0
                    ? 'text-amber-400 bg-amber-500/15 border border-amber-500/30'
                    : 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30'
                }`}>
                  {minSpendShortfall > 0
                    ? `👑 ${minSpendProgress}% • Sisa ${formatCompactPrice(minSpendShortfall)}`
                    : `👑 Lolos Min Spend (${minSpendProgress}%)`}
                </div>
              )}
            </>
          ) : (
            /* EMPTY TABLE (COMPACT: SOLID 2-ROW BALANCED MONAD) */
            <>
              <div className="flex items-center justify-between gap-1 min-w-0">
                <div className="flex items-center gap-1 min-w-0 truncate">
                  {isVip && <Crown className="w-3.5 h-3.5 text-amber-400/60 shrink-0" />}
                  <span className="font-mono font-black text-xs text-white truncate">
                    {displayTableName}
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono font-medium shrink-0 whitespace-nowrap">
                  👥 {table.maxCapacity || table.pax || 4}
                </span>
              </div>
              <div className="text-center text-[10px] font-mono text-slate-500 group-hover:text-slate-300 transition-colors py-0.5 whitespace-nowrap">
                + {language === 'en' ? 'Available' : 'Kosong'}
              </div>
            </>
          )
        ) : (
          /* CASE B: FULL GRID VIEW */
          !isAvailable ? (
            <>
              {/* ROW 1: HEADER (ID LEFT • UTILISATION CENTER • TIMER RIGHT) */}
              <div className="flex items-center justify-between gap-1 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0 truncate">
                  {isVip && <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  <span className="font-mono font-black text-xs sm:text-sm text-white whitespace-nowrap">
                    {isVip ? table.name : displayTableName}
                  </span>
                  <span className="font-mono font-bold text-[11px] text-amber-300 shrink-0">
                    👥 {table.seatedGuests || table.pax || 2}/{table.maxCapacity || table.pax || 4}
                  </span>
                </div>

                {/* RIGHT: TIMER */}
                {table.seatedDurationMinutes ? (
                  <div className={`flex items-center gap-0.5 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded shrink-0 ${
                    table.seatedDurationMinutes > 40
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    <Clock className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                    <span>{table.seatedDurationMinutes}m</span>
                  </div>
                ) : null}
              </div>

              {/* ROW 2: GUEST NAME & MENU GLYPH / VIP COMPACT PROGRESS */}
              <div className="flex items-center justify-between gap-1.5 min-w-0">
                <span className="text-[11px] font-medium text-slate-200 truncate flex-1 min-w-0">
                  {table.customerName || t.pos?.walkInGuest || (language === 'en' ? 'Walk-In' : 'Tamu Walk-In')}
                </span>
                {minSpendProgress !== null ? (
                  <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 rounded shrink-0">
                    👑 {minSpendProgress}%
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.2 rounded shrink-0">
                    🍽️ {table.orderCount || 2}
                  </span>
                )}
              </div>

              {/* VIP INTEGRATED MICRO PROGRESS BAR (1px SLIM) */}
              {minSpendProgress !== null && (
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden -my-0.5">
                  <div
                    className={`h-full transition-all duration-300 ${minSpendProgress >= 100 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                    style={{ width: `${Math.min(100, minSpendProgress)}%` }}
                  />
                </div>
              )}

              {/* ROW 3: FOOTER (TICKET / DINE-IN • TOTAL PRICE TABULAR) */}
              <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between gap-2 min-w-0">
                <span className="text-[10px] font-mono text-slate-400 truncate">
                  {table.orderIds?.[0] || 'Dine-In'}
                </span>
                {table.totalBill > 0 ? (
                  <PriceTag
                    amount={table.totalBill}
                    mode="full"
                    variant={isUnpaid ? 'accent' : 'emerald'}
                    size="sm"
                    className="font-black shrink-0"
                  />
                ) : (
                  <span className="font-mono font-black text-xs text-emerald-400 shrink-0">
                    {language === 'en' ? 'PAID' : 'LUNAS'}
                  </span>
                )}
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
  }

  const renderZoneCard = (group: typeof groupedZones[0]) => {
    const totalTables = group.tables.length
    const occupiedCount = group.tables.filter(t => t.status !== 'free').length
    const totalZoneSales = group.tables.reduce((sum, t) => sum + (t.totalBill || 0), 0)
    const isSingleZoneView = activeZoneId !== 'all'
    const isVipZone = group.zone.id === 'vip-private'

    let zoneSpanClass = 'w-full'
    if (isCompact && !isSingleZoneView) {
      if (isVipZone || totalTables <= 2) {
        zoneSpanClass = 'col-span-1 sm:col-span-2 lg:col-span-2 lg:row-span-2 h-full'
      } else if (totalTables === 3 || totalTables === 4) {
        zoneSpanClass = 'col-span-1 sm:col-span-2 lg:col-span-4 lg:row-span-1'
      } else {
        zoneSpanClass = 'col-span-1 sm:col-span-2 lg:col-span-3 lg:row-span-2 h-full'
      }
    }

    let internalGridClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    if (isCompact) {
      if (isSingleZoneView) {
        internalGridClass = isMobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-6'
      } else if (isVipZone || totalTables <= 2) {
        internalGridClass = 'grid-cols-1'
      } else if (totalTables === 3 || totalTables === 4) {
        internalGridClass = 'grid-cols-2 sm:grid-cols-4'
      } else {
        internalGridClass = 'grid-cols-2 sm:grid-cols-3'
      }
    }

    const zonePalette = AREA_SURFACE_PALETTES[group.zone.id as PropertyZoneId] || AREA_SURFACE_PALETTES.all

    return (
      <div
        key={group.zone.id}
        className={`${zoneSpanClass} bg-slate-900/60 ${zonePalette.borderCard} rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between gap-2.5 shadow-sm`}
      >
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
                • <PriceTag amount={totalZoneSales} mode="compact" size="xs" variant="emerald" />
              </span>
            )}
          </div>
        </div>

        <div className={`grid gap-2.5 sm:gap-3 ${internalGridClass}`}>
          {group.tables.map(table => renderTableCard(table, isCompact, false))}
        </div>
      </div>
    )
  }

  // 1. COMPACT VIEW: UNIFIED 6-COLUMN MASTER CANVAS (DIRECT CHILDREN, ZERO DOUBLE BOXES)
  if (isCompact) {
    const allTables = activeZoneId === 'all' ? groupedZones.flatMap(g => g.tables) : effectiveTables

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 pb-20">
        {allTables.map(table => renderTableCard(table, true, true))}
      </div>
    )
  }

  // 2. GRID VIEW (ALL ZONES): CONTINUOUS 4-COLUMN INTERLOCKING TETRIS WITH AREA SURFACE OVERLAY
  if (activeZoneId === 'all') {
    const allTables = groupedZones.flatMap(g => g.tables)

    return (
      <div className="relative pb-20">
        {/* LAYER 0: SMOOTH AREA SURFACE GEOMETRY (BACKDROP ISLANDS) */}
        <AreaSurfaceOverlay viewMode={viewMode} />

        {/* LAYER 1: RIGID 4-COLUMN INTERACTIVE TABLE WIDGETS GRID */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {allTables.map(table => renderTableCard(table, false, true))}
        </div>
      </div>
    )
  }

  // 3. GRID VIEW (SINGLE FILTERED ZONE)
  return (
    <div className="flex flex-col gap-3.5 pb-20">
      {groupedZones.map(renderZoneCard)}
    </div>
  )
}
