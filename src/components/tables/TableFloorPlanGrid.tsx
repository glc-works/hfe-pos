import React, { useState } from 'react'
import {
  Users,
  Sparkles,
  Heart,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle2,
  Filter,
  Star,
  Award
} from 'lucide-react'

export interface TableWithGuestInfo {
  id: string
  name: string
  status: 'free' | 'occupied' | 'open-tab' | 'billing' | 'reserved' | 'seated_vip' | 'available'
  zone?: 'Main Dining' | 'Chef Table' | 'Patio Glasshouse' | 'Private Room' | string
  capacity?: number
  customerName?: string
  guestName?: string
  totalBill?: number
  orderCount?: number
  contactId?: string
  avatarUrl?: string
  isVip?: boolean
  vipTier?: string
  savedPreferences?: string
  anniversaryBadge?: boolean
  birthdayBadge?: boolean
  allergenAlert?: string
  allergenFlags?: ('lactose' | 'nuts' | 'gluten' | 'seafood')[]
  preferredSommelier?: string
  specialNotes?: string
}

const DEFAULT_FLOOR_PLAN_TABLES: TableWithGuestInfo[] = [
  {
    id: 'TBL-VIP-01',
    name: 'Table 01 (Chef Table Corner)',
    zone: 'Chef Table',
    capacity: 4,
    status: 'seated_vip',
    guestName: 'Drs. H. Bambang Soeprapto',
    contactId: 'VIP-001',
    isVip: true,
    vipTier: 'Platinum VIP',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    savedPreferences: 'Pilih tempat duduk pojok, Kopi Less Sugar',
    anniversaryBadge: true,
    allergenAlert: 'Kacang / Nut Allergy',
    allergenFlags: ['nuts'],
    totalBill: 1250000,
    orderCount: 4,
    preferredSommelier: 'Jean-Luc'
  },
  {
    id: 'TBL-VIP-02',
    name: 'Table 02 (Glasshouse Bay)',
    zone: 'Patio Glasshouse',
    capacity: 2,
    status: 'seated_vip',
    guestName: 'Ibu Hj. Ratna',
    contactId: 'VIP-002',
    isVip: true,
    vipTier: 'Gold VIP',
    savedPreferences: 'Disukai: Oat Milk Latte, Sofa Panjang',
    birthdayBadge: true,
    allergenAlert: 'Lactose Intolerant',
    allergenFlags: ['lactose'],
    totalBill: 450000,
    orderCount: 2,
    preferredSommelier: 'Marco'
  },
  {
    id: 'TBL-03',
    name: 'Table 03 (Center Fountain)',
    zone: 'Main Dining',
    capacity: 4,
    status: 'occupied',
    customerName: 'Bapak Erick & Rekan',
    savedPreferences: 'Duduk dekat jendela',
    totalBill: 320000,
    orderCount: 3
  },
  {
    id: 'TBL-04',
    name: 'Private Room Emerald',
    zone: 'Private Room',
    capacity: 8,
    status: 'seated_vip',
    guestName: 'Direksi Bank Mandiri',
    contactId: 'VIP-003',
    isVip: true,
    vipTier: 'Platinum VIP',
    anniversaryBadge: true,
    birthdayBadge: false,
    allergenAlert: 'Seafood Intolerant',
    allergenFlags: ['seafood'],
    totalBill: 3800000,
    orderCount: 12
  },
  {
    id: 'TBL-05',
    name: 'Table 05 (Patio Garden)',
    zone: 'Patio Glasshouse',
    capacity: 4,
    status: 'reserved',
    customerName: 'Ibu Maya (Reservasi 19:30)',
    totalBill: 0,
    orderCount: 0
  },
  {
    id: 'TBL-06',
    name: 'Table 06 (Main Hall)',
    zone: 'Main Dining',
    capacity: 2,
    status: 'available',
    totalBill: 0,
    orderCount: 0
  }
]

export interface TableFloorPlanGridProps {
  tables?: TableWithGuestInfo[]
  selectedTableId?: string
  onSelectTable?: (table: TableWithGuestInfo) => void
  onOpenGuestProfile?: (contactId: string) => void
  activeZone?: string
  onZoneChange?: (zone: string) => void
  showVipOnly?: boolean
  onToggleVipOnly?: (vip: boolean) => void
}

export const TableFloorPlanGrid: React.FC<TableFloorPlanGridProps> = ({
  tables = DEFAULT_FLOOR_PLAN_TABLES,
  selectedTableId,
  onSelectTable,
  onOpenGuestProfile,
  activeZone = 'All',
  onZoneChange,
  showVipOnly = false,
  onToggleVipOnly
}) => {
  const [internalZone, setInternalZone] = useState<string>('All')
  const [internalVipOnly, setInternalVipOnly] = useState<boolean>(false)

  const currentZone = onZoneChange ? activeZone : internalZone
  const isVipOnly = onToggleVipOnly ? showVipOnly : internalVipOnly

  const handleZoneSelect = (zone: string) => {
    if (onZoneChange) onZoneChange(zone)
    else setInternalZone(zone)
  }

  const handleVipToggle = () => {
    const next = !isVipOnly
    if (onToggleVipOnly) onToggleVipOnly(next)
    else setInternalVipOnly(next)
  }

  const zones = ['All', 'Main Dining', 'Chef Table', 'Patio Glasshouse', 'Private Room']

  const filteredTables = tables.filter(t => {
    if (isVipOnly && !t.isVip && t.status !== 'seated_vip') return false
    if (currentZone !== 'All' && t.zone !== currentZone) return false
    return true
  })

  const formatIdr = (val: number) => `Rp ${val.toLocaleString('id-ID')}`

  return (
    <div className="space-y-4 w-full">
      {/* FILTER BAR & ZONE TABS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {zones.map(z => (
            <button
              key={z}
              onClick={() => handleZoneSelect(z)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                currentZone === z
                  ? 'bg-indigo-500 text-white border-indigo-500 shadow'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {z === 'All' ? '🗺️ Semua Area' : z}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between w-full md:w-auto gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
          <button
            onClick={handleVipToggle}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isVipOnly
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md font-extrabold'
                : 'bg-slate-950 text-amber-400 border-amber-500/30 hover:bg-slate-900'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            {isVipOnly ? 'Filter: VIP Only (Active)' : 'Filter Tamu VIP'}
          </button>
        </div>
      </div>

      {/* FLOOR PLAN GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTables.map((table) => {
          const isSelected = selectedTableId === table.id
          const isOccupiedOrSeated = table.status === 'occupied' || table.status === 'seated_vip' || table.status === 'open-tab'
          const displayName = table.guestName || table.customerName

          let cardBorder = 'border-slate-800 bg-slate-900'
          let statusBadgeClass = 'bg-slate-800 text-slate-400 border-slate-700'
          let statusLabel = 'Available'

          if (table.status === 'seated_vip') {
            cardBorder = 'border-amber-500/60 bg-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.12)]'
            statusBadgeClass = 'bg-amber-500/20 text-amber-400 border-amber-500/40'
            statusLabel = 'VIP Seated'
          } else if (table.status === 'occupied') {
            cardBorder = 'border-indigo-500/50 bg-slate-900'
            statusBadgeClass = 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'
            statusLabel = 'Occupied'
          } else if (table.status === 'reserved') {
            cardBorder = 'border-sky-500/50 bg-slate-900'
            statusBadgeClass = 'bg-sky-500/20 text-sky-400 border-sky-500/40'
            statusLabel = 'Reserved'
          }

          if (isSelected) {
            cardBorder += ' ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950'
          }

          // Initial fallback avatar
          const initials = displayName
            ? displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
            : 'G'

          return (
            <div
              key={table.id}
              onClick={() => onSelectTable && onSelectTable(table)}
              className={`border rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3 cursor-pointer transition-all hover:scale-[1.01] ${cardBorder}`}
            >
              <div className="space-y-3">
                {/* Tile Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{table.zone || 'Dining Area'}</span>
                    <h3 className="text-sm font-bold text-white leading-tight">{table.name}</h3>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Users className="w-3 h-3 text-slate-400" /> {table.capacity || 4} Pax
                    </p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBadgeClass}`}>
                    {statusLabel}
                  </span>
                </div>

                {/* Occupied / Seated VIP Guest Details Overlay Tile */}
                {isOccupiedOrSeated && displayName ? (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2.5 shadow-inner">
                    {/* Guest Avatar & Name */}
                    <div className="flex items-center gap-2.5">
                      <div className="relative flex-shrink-0">
                        {table.avatarUrl ? (
                          <img
                            src={table.avatarUrl}
                            alt={displayName}
                            className="w-9 h-9 rounded-full object-cover border border-amber-400/60 shadow"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-indigo-600 font-extrabold text-white text-xs flex items-center justify-center border border-amber-400/40 shadow">
                            {initials}
                          </div>
                        )}
                        {(table.isVip || table.status === 'seated_vip') && (
                          <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 rounded-full p-0.5 shadow">
                            <Star className="w-2.5 h-2.5 fill-current" />
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-amber-300 truncate">{displayName}</span>
                        </div>
                        {table.vipTier && (
                          <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                            {table.vipTier}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Preference Badge */}
                    {table.savedPreferences && (
                      <div className="text-[10px] text-slate-300 flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
                        <span className="truncate">{table.savedPreferences}</span>
                      </div>
                    )}

                    {/* Celebration Badges (Anniversary / Birthday) */}
                    <div className="flex flex-wrap gap-1">
                      {table.anniversaryBadge && (
                        <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold rounded-md flex items-center gap-1">
                          <Heart className="w-3 h-3 text-rose-400 fill-rose-500/30" /> Event Anniversary
                        </span>
                      )}
                      {table.birthdayBadge && (
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded-md flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-400" /> Ultah Celebration
                        </span>
                      )}
                    </div>

                    {/* Food Allergen Warning Alert Banner */}
                    {table.allergenAlert && (
                      <div className="p-1.5 bg-rose-500/15 border border-rose-500/30 rounded-lg text-rose-300 text-[10px] font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        <span className="truncate">Alergi: {table.allergenAlert}</span>
                      </div>
                    )}

                    {/* Total Bill Summary */}
                    {table.totalBill ? (
                      <div className="flex justify-between items-center pt-1 border-t border-slate-800 text-[11px]">
                        <span className="text-slate-400">Total Running Bill:</span>
                        <span className="font-mono font-bold text-emerald-400">{formatIdr(table.totalBill)}</span>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="py-6 text-center text-slate-500 text-xs italic bg-slate-950/40 border border-dashed border-slate-800/80 rounded-xl">
                    Meja Kosong (Siap Ditempati)
                  </div>
                )}
              </div>

              {/* Action Button Footer */}
              <div className="pt-1 flex gap-2">
                {table.contactId && onOpenGuestProfile && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenGuestProfile(table.contactId!)
                    }}
                    className="w-full py-1.5 bg-slate-950 hover:bg-slate-800 text-amber-400 border border-amber-500/30 font-bold rounded-xl text-[11px] flex items-center justify-center gap-1 transition-all"
                  >
                    <Info className="w-3 h-3" /> Profil Concierge
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
