import React, { useState, useEffect } from 'react'
import { MapPin, Building2, Shield, DoorClosed, Users, MessageSquareText, X, Check } from 'lucide-react'
import { DeliveryAddressInfo, DeliveryDropOffOption } from '../../types/pos'

export interface CustomerDeliveryAddressModalProps {
  isOpen: boolean
  onClose: () => void
  address: DeliveryAddressInfo
  onSaveAddress: (updated: Partial<DeliveryAddressInfo>) => void
  outletName?: string
}

export const CustomerDeliveryAddressModal: React.FC<CustomerDeliveryAddressModalProps> = ({
  isOpen,
  onClose,
  address,
  onSaveAddress,
  outletName = 'Artisan Cafe HQ (Sudirman)'
}) => {
  const [streetAddress, setStreetAddress] = useState(address.streetAddress)
  const [unitOrFloor, setUnitOrFloor] = useState(address.unitOrFloor)
  const [dropOffOption, setDropOffOption] = useState<DeliveryDropOffOption>(address.dropOffOption)
  const [driverNotes, setDriverNotes] = useState(address.driverNotes || '')

  useEffect(() => {
    if (isOpen) {
      setStreetAddress(address.streetAddress)
      setUnitOrFloor(address.unitOrFloor)
      setDropOffOption(address.dropOffOption)
      setDriverNotes(address.driverNotes || '')
    }
  }, [isOpen, address])

  if (!isOpen) return null

  const dropOffOptions: { id: DeliveryDropOffOption; label: string; icon: React.ReactNode }[] = [
    { id: 'leave_at_lobby_guard', label: 'Titip Satpam / Lobby', icon: <Shield className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'meet_at_door', label: 'Depan Pintu Unit', icon: <DoorClosed className="w-3.5 h-3.5 text-indigo-500" /> },
    { id: 'meet_in_person', label: 'Bertemu Langsung', icon: <Users className="w-3.5 h-3.5 text-emerald-500" /> },
  ]

  const handleSave = () => {
    onSaveAddress({
      streetAddress: streetAddress.trim(),
      unitOrFloor: unitOrFloor.trim(),
      dropOffOption,
      driverNotes: driverNotes.trim()
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-card border border-border rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto custom-scrollbar animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-foreground">Detail Alamat Pengiriman</h3>
              <p className="text-[11px] text-muted-foreground">Dikirim dari {outletName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground flex items-center justify-center transition-all"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Alamat Utama */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>Alamat Utama & Titik Lokasi</span>
          </label>
          <textarea
            rows={2}
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            placeholder="Nama jalan, gedung, nomor rumah..."
            className="w-full bg-background border border-border focus:border-amber-500 text-foreground px-3 py-2 rounded-xl text-xs font-semibold placeholder:text-muted-foreground outline-none resize-none transition-all"
          />
        </div>

        {/* 2. Detail Unit / Lantai */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>Detail Unit / Lantai / Patokan</span>
          </label>
          <input
            type="text"
            value={unitOrFloor}
            onChange={(e) => setUnitOrFloor(e.target.value)}
            placeholder="Contoh: Lantai 18, Ruang 1802 / Rumah Pagar Putih"
            className="w-full bg-background border border-border focus:border-indigo-500 text-foreground px-3 py-2 rounded-xl text-xs font-semibold placeholder:text-muted-foreground outline-none transition-all"
          />
        </div>

        {/* 3. Drop-off Option */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-muted-foreground">
            Opsi Drop-off / Titip Pesanan
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            {dropOffOptions.map((opt) => {
              const isSelected = dropOffOption === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDropOffOption(opt.id)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all text-left ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/60 text-amber-900 dark:text-amber-300 shadow-sm'
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

        {/* 4. Catatan Driver */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
            <MessageSquareText className="w-3.5 h-3.5 text-emerald-500" />
            <span>Catatan Khusus Pengemudi (Opsional)</span>
          </label>
          <input
            type="text"
            value={driverNotes}
            onChange={(e) => setDriverNotes(e.target.value)}
            placeholder="Contoh: Tolong titip di meja resepsionis lantai 1..."
            className="w-full bg-background border border-border focus:border-emerald-500 text-foreground px-3 py-2 rounded-xl text-xs font-medium placeholder:text-muted-foreground outline-none transition-all"
          />
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full mt-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
        >
          <Check className="w-4 h-4" />
          <span>Simpan Alamat Pengiriman</span>
        </button>
      </div>
    </div>
  )
}
