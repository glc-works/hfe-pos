import React, { useState } from 'react'
import { MapPin, Building2, Shield, DoorClosed, Users, MessageSquareText, Clock, Navigation, ChevronRight, Edit3, Plus } from 'lucide-react'
import { DeliveryAddressInfo, DeliveryDropOffOption } from '../../types/pos'
import { CustomerDeliveryAddressModal } from './CustomerDeliveryAddressModal'

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
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getDropOffBadge = (option: DeliveryDropOffOption) => {
    switch (option) {
      case 'leave_at_lobby_guard':
        return { label: 'Titip Satpam / Lobby', icon: <Shield className="w-3 h-3 text-amber-500" /> }
      case 'meet_at_door':
        return { label: 'Depan Pintu Unit', icon: <DoorClosed className="w-3 h-3 text-indigo-500" /> }
      case 'meet_in_person':
      default:
        return { label: 'Bertemu Langsung', icon: <Users className="w-3 h-3 text-emerald-500" /> }
    }
  }

  const dropOff = getDropOffBadge(address.dropOffOption)
  const isAddressConfigured = Boolean(address.streetAddress && address.streetAddress.trim().length > 0)

  return (
    <>
      <div className="bg-card border border-border rounded-2xl p-3.5 flex flex-col gap-2.5 shadow-sm transition-all">
        {/* Header with Delivery Mode & Distance */}
        <div className="flex items-center justify-between border-b border-border/70 pb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
              <Navigation className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-black text-foreground flex items-center gap-1.5 truncate">
                <span>Pesan Antar</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full font-bold">
                  {address.distanceKm} km
                </span>
              </span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-amber-500" />
                <span>Estimasi {estimatedMinutes} mnt dari {outletName}</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors shrink-0 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg"
          >
            <Edit3 className="w-3 h-3" />
            <span>Ubah</span>
          </button>
        </div>

        {/* Compact Summary View */}
        {isAddressConfigured ? (
          <div
            onClick={() => setIsModalOpen(true)}
            className="bg-background hover:bg-muted/40 border border-border/80 rounded-xl p-2.5 flex items-start justify-between gap-2.5 cursor-pointer transition-all active:scale-[0.99] group"
          >
            <div className="flex items-start gap-2 min-w-0">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-xs font-bold text-foreground leading-snug break-words">
                  {address.streetAddress}
                </span>

                {address.unitOrFloor && (
                  <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-indigo-500 shrink-0" />
                    <span className="truncate">{address.unitOrFloor}</span>
                  </span>
                )}

                <div className="flex items-center gap-2 flex-wrap mt-0.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-muted text-foreground border border-border rounded-md flex items-center gap-1">
                    {dropOff.icon}
                    <span>{dropOff.label}</span>
                  </span>
                  {address.driverNotes && (
                    <span className="text-[10px] text-muted-foreground italic truncate max-w-[180px]">
                      "{address.driverNotes}"
                    </span>
                  )}
                </div>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0 mt-1" />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-amber-500/10 hover:bg-amber-500/15 border border-dashed border-amber-500/40 rounded-xl p-3 flex items-center justify-center gap-2 text-amber-700 dark:text-amber-300 text-xs font-bold transition-all active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>+ Masukkan Alamat Pengiriman</span>
          </button>
        )}
      </div>

      {/* Dedicated Address Edit Sheet */}
      <CustomerDeliveryAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        address={address}
        onSaveAddress={onChangeAddress}
        outletName={outletName}
      />
    </>
  )
}
