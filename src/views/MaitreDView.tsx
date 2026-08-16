import React, { useState } from 'react'
import { UserCheck, Heart, Calendar, Award, Info, Users, Sparkles } from 'lucide-react'
import { GuestHistoryModal } from '../components/finedining/GuestHistoryModal'

export interface VipTableFloor {
  id: string
  name: string
  zone: 'Main Dining' | 'Chef Table' | 'Patio Glasshouse' | 'Private Room'
  capacity: number
  status: 'seated_vip' | 'reserved' | 'available' | 'billing'
  guestName?: string
  contactId?: string
  anniversaryBadge?: boolean
  birthdayBadge?: boolean
  preferredSommelier?: string
}

const INITIAL_VIP_TABLES: VipTableFloor[] = [
  {
    id: 'TBL-VIP-01',
    name: 'Table 01 (Chef Table Corner)',
    zone: 'Chef Table',
    capacity: 4,
    status: 'seated_vip',
    guestName: 'Drs. H. Bambang Soeprapto',
    contactId: 'VIP-001',
    anniversaryBadge: true,
    preferredSommelier: 'Jean-Luc'
  },
  {
    id: 'TBL-VIP-02',
    name: 'Table 02 (Glasshouse Bay)',
    zone: 'Patio Glasshouse',
    capacity: 2,
    status: 'reserved',
    guestName: 'Ibu Hj. Ratna',
    contactId: 'VIP-002',
    birthdayBadge: true,
    preferredSommelier: 'Marco'
  },
  {
    id: 'TBL-VIP-03',
    name: 'Private Room Emerald',
    zone: 'Private Room',
    capacity: 8,
    status: 'seated_vip',
    guestName: 'Bapak Erick & Rombongan',
    contactId: 'VIP-003',
    anniversaryBadge: false
  },
  {
    id: 'TBL-VIP-04',
    name: 'Table 04 (Center Fountain)',
    zone: 'Main Dining',
    capacity: 4,
    status: 'available'
  }
]

export const MaitreDView: React.FC = () => {
  const [tables, setTables] = useState<VipTableFloor[]>(INITIAL_VIP_TABLES)
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false)

  const handleOpenGuestHistory = (contactId?: string) => {
    if (!contactId) return
    setSelectedContactId(contactId)
    setShowHistoryModal(true)
  }

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-4 space-y-4 overflow-y-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">Concierge Maître d' VIP Floor Plan</h1>
            <p className="text-xs text-slate-400">Manajemen Meja VIP, Tagging Tamu, & Peringatan Special Anniversary/Ultah</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> VIP Seated</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Reserved</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-600" /> Available</span>
        </div>
      </div>

      {/* Floor Plan Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tables.map((table) => {
          let cardBorder = 'border-slate-800 bg-slate-900'
          let statusBadge = 'bg-slate-800 text-slate-400'
          if (table.status === 'seated_vip') {
            cardBorder = 'border-amber-500/50 bg-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
            statusBadge = 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          } else if (table.status === 'reserved') {
            cardBorder = 'border-indigo-500/50 bg-slate-900'
            statusBadge = 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
          }

          return (
            <div key={table.id} className={`border rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 transition-all ${cardBorder}`}>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{table.zone}</span>
                    <h2 className="text-sm font-bold text-white">{table.name}</h2>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Users className="w-3 h-3" /> Kapasitas: {table.capacity} Pax
                    </p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusBadge}`}>
                    {table.status === 'seated_vip' ? 'VIP Seated' : table.status === 'reserved' ? 'Reserved' : 'Available'}
                  </span>
                </div>

                {/* Seated Guest Card */}
                {table.guestName ? (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-amber-300">{table.guestName}</span>
                      <button
                        onClick={() => handleOpenGuestHistory(table.contactId)}
                        className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5 font-semibold"
                      >
                        <Info className="w-3 h-3" /> Profil VIP
                      </button>
                    </div>

                    {/* Special Anniversary / Birthday Badges */}
                    <div className="flex flex-wrap gap-1">
                      {table.anniversaryBadge && (
                        <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold rounded-md flex items-center gap-1">
                          <Heart className="w-3 h-3" /> Anniversary Event
                        </span>
                      )}
                      {table.birthdayBadge && (
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold rounded-md flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Birthday Celebration
                        </span>
                      )}
                    </div>

                    {table.preferredSommelier && (
                      <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                        Sommelier: <span className="text-slate-200 font-medium">{table.preferredSommelier}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="py-6 text-center text-slate-500 text-xs italic">
                    Meja siap ditempati
                  </div>
                )}
              </div>

              {/* Concierge Action Footer */}
              {table.contactId && (
                <button
                  onClick={() => handleOpenGuestHistory(table.contactId)}
                  className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-amber-400 border border-amber-500/30 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Buka Concierge Ledger
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Guest History Modal */}
      <GuestHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        contactId={selectedContactId || undefined}
      />
    </div>
  )
}
