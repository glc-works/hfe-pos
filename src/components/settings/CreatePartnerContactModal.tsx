import React, { useState } from 'react'
import { Building, X } from 'lucide-react'
import { PartnerContact } from '../../types/pos'

export interface CreatePartnerContactModalProps {
  isOpen: boolean
  onClose: () => void
  onSaveContact: (contact: PartnerContact) => void
}

export const CreatePartnerContactModal: React.FC<CreatePartnerContactModalProps> = ({
  isOpen,
  onClose,
  onSaveContact
}) => {
  const [newContactName, setNewContactName] = useState<string>('')
  const [newContactBrand, setNewContactBrand] = useState<string>('')
  const [newContactCategory, setNewContactCategory] = useState<PartnerContact['category']>('bank')
  const [newContactIcon, setNewContactIcon] = useState<string>('🏛️')
  const [newContactColor, setNewContactColor] = useState<string>('#0284c7')

  if (!isOpen) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newContactBrand.trim()) {
      alert('Mohon isi Nama Brand / Mitra!')
      return
    }

    const newContact: PartnerContact = {
      id: `contact-${Date.now()}`,
      name: newContactName.trim() || newContactBrand.trim(),
      brandName: newContactBrand.trim(),
      category: newContactCategory,
      icon: newContactIcon || '🎟️',
      brandColor: newContactColor || '#0284c7',
      isVerifiedPartner: true
    }

    onSaveContact(newContact)
    setNewContactName('')
    setNewContactBrand('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 animate-slideUp">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-400" /> Tambah Kontak Mitra / Bank Baru
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-300">Nama Brand / Bank (Tampil di Kupon):</label>
            <input
              type="text"
              value={newContactBrand}
              onChange={(e) => setNewContactBrand(e.target.value)}
              placeholder="Misal: Bank Mandiri / OVO Promo"
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-300">Emoji / Ikon:</label>
              <input
                type="text"
                value={newContactIcon}
                onChange={(e) => setNewContactIcon(e.target.value)}
                placeholder="🏛️"
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white text-center focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-300">Warna Brand (Hex):</label>
              <input
                type="color"
                value={newContactColor}
                onChange={(e) => setNewContactColor(e.target.value)}
                className="w-full h-9 bg-slate-950 border border-slate-700 rounded-xl p-1 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-300">Kategori Mitra:</label>
            <select
              value={newContactCategory}
              onChange={(e) => setNewContactCategory(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="bank">Perbankan / Kartu EDC</option>
              <option value="partner">Partner Merchant / Delivery</option>
              <option value="payment_gateway">QRIS / E-Wallet Gateway</option>
              <option value="merchant">Internal Toko</option>
              <option value="loyalty">Loyalty Club</option>
            </select>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow"
            >
              Simpan Kontak
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
