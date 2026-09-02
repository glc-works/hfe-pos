import React, { useState } from 'react'
import { X, User, Phone, Award, DollarSign, AlertTriangle, Send, Save } from 'lucide-react'
import { CustomerContact } from '../../hooks/useCustomerContacts'

export interface ContactDetailModalProps {
  show: boolean
  onClose: () => void
  contact: CustomerContact | null
  onSave: (updated: Partial<CustomerContact>) => void
}

export const ContactDetailModal: React.FC<ContactDetailModalProps> = ({
  show,
  onClose,
  contact,
  onSave
}) => {
  const [kasbonLimit, setKasbonLimit] = useState<number>(contact?.kasbonLimit || 0)
  const [notes, setNotes] = useState<string>(contact?.notes || '')
  const [allergensText, setAllergensText] = useState<string>(contact?.allergens.join(', ') || '')

  if (!show || !contact) return null

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      kasbonLimit,
      notes,
      allergens: allergensText.split(',').map((s) => s.trim()).filter(Boolean)
    })
    onClose()
  }

  const handleSendWaAlert = () => {
    const msg = encodeURIComponent(
      `Halo Kak ${contact.name}! Terima kasih telah menjadi pelanggan setia ${contact.tier.toUpperCase()} kami. Cek voucher promo spesial Anda di etalase kami.`
    )
    window.open(`https://wa.me/${contact.phone}?text=${msg}`, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-4 sm:p-6 flex flex-col gap-4 shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {contact.name}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Tier {contact.tier}
                </span>
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Phone className="w-3 h-3 text-emerald-400" /> +{contact.phone}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-xl">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* FINANCIAL SUMMARY */}
        <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Total Transaksi</span>
            <strong className="text-white font-mono text-sm">{contact.totalOrdersCount} Order</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Total Belanja</span>
            <strong className="text-emerald-400 font-mono text-sm">Rp {contact.totalSpend.toLocaleString('id-ID')}</strong>
          </div>
        </div>

        {/* EDIT FORM */}
        <form onSubmit={handleSaveSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Limit Kasbon Hutang (Rp)</label>
            <input
              type="number"
              value={kasbonLimit}
              onChange={(e) => setKasbonLimit(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Hutang Aktif: <strong className="text-rose-400 font-mono">Rp {contact.kasbonBalance.toLocaleString('id-ID')}</strong>
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Dietary & Alergen (Pisah koma)</label>
            <input
              type="text"
              value={allergensText}
              onChange={(e) => setAllergensText(e.target.value)}
              placeholder="Contoh: Lactose, Nuts, Gluten"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Catatan Khusus Pelanggan</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* ACTIONS */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handleSendWaAlert}
              className="py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" /> Kirim Promo WA
            </button>
            <button
              type="submit"
              className="py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              <Save className="w-3.5 h-3.5" /> Simpan Profil Contact
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
