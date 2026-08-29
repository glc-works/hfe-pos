import React from 'react'
import { MapPin, Building2, Shield, DoorClosed, Users, MessageSquareText, Clock, Navigation } from 'lucide-react'
import { DeliveryAddressInfo, DeliveryDropOffOption } from '../../types/pos'

export interface CustomerDeliveryAddressCardProps {
  address: DeliveryAddressInfo
  onChangeAddress: (updated: Partial<DeliveryAddressInfo>) => void
  estimatedMinutes?: string
  outletName?: string
}

export const CustomerDeliveryAddressCard: React.FC<CustomerDeliveryAddressCardProps> = ({
  address,
  onChangeAddress,
  estimatedMinutes = '25–35',
  outletName = 'Artisan Cafe HQ (Sudirman)'
}) => {
  const dropOffOptions: { id: DeliveryDropOffOption; label: string; icon: React.ReactNode }[] = [
    { id: 'leave_at_lobby_guard', label: 'Titip Satpam / Lobby', icon: <Shield className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'meet_at_door', label: 'Depan Pintu Unit', icon: <DoorClosed className="w-3.5 h-3.5 text-indigo-500" /> },
    { id: 'meet_in_person', label: 'Bertemu Langsung', icon: <Users className="w-3.5 h-3.5 text-emerald-500" /> },
  ]

  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 shadow-lg transition-all">
      {/* 1. Header with Estimated Delivery Time & Distance */}
      <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
            <Navigation className="w-4 h-4 animate-pulse" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black text-foreground flex items-center gap-1.5 truncate">
              <span>Pesan Antar (Online Delivery)</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full font-bold">
                {address.distanceKm} km
              </span>
            </span>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-500" />
              <span>Estimasi {estimatedMinutes} mnt dari {outletName}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Tier 1: Main Street Address & Recipient */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-rose-500" />
          <span>Alamat Utama & Titik Lokasi</span>
        </label>
        <input
          type="text"
          value={address.streetAddress}
          onChange={(e) => onChangeAddress({ streetAddress: e.target.value })}
          placeholder="Nama jalan, gedung, atau patokan utama..."
          className="w-full bg-background border border-border focus:border-amber-500 text-foreground px-3 py-2 rounded-xl text-xs font-semibold placeholder:text-muted-foreground outline-none transition-all"
        />
      </div>

      {/* 3. Tier 2: Unit / Floor / Landmark */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5 text-indigo-500" />
          <span>Detail Unit / Lantai / Patokan</span>
        </label>
        <input
          type="text"
          value={address.unitOrFloor}
          onChange={(e) => onChangeAddress({ unitOrFloor: e.target.value })}
          placeholder="Contoh: Lantai 18, Ruang 1802 / Rumah Pagar Putih"
          className="w-full bg-background border border-border focus:border-indigo-500 text-foreground px-3 py-2 rounded-xl text-xs font-semibold placeholder:text-muted-foreground outline-none transition-all"
        />
      </div>

      {/* 4. Tier 3: Drop-Off Options (Interactive Pills) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-muted-foreground">
          Opsi Drop-off / Titip Pesanan
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
          {dropOffOptions.map((opt) => {
            const isSelected = address.dropOffOption === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangeAddress({ dropOffOption: opt.id })}
                className={`px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all text-left ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-900 dark:text-amber-300 shadow-sm'
                    : 'bg-background hover:bg-muted/50 border-border text-muted-foreground'
                }`}
              >
                {opt.icon}
                <span className="truncate">{opt.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 5. Driver Notes Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
          <MessageSquareText className="w-3.5 h-3.5 text-emerald-500" />
          <span>Catatan Khusus Pengemudi (Opsional)</span>
        </label>
        <input
          type="text"
          value={address.driverNotes || ''}
          onChange={(e) => onChangeAddress({ driverNotes: e.target.value })}
          placeholder="Contoh: Tolong telepon saat sampai di lobi..."
          className="w-full bg-background border border-border focus:border-emerald-500 text-foreground px-3 py-2 rounded-xl text-xs font-medium placeholder:text-muted-foreground outline-none transition-all"
        />
      </div>
    </div>
  )
}
