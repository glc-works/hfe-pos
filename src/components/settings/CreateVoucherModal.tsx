import React, { useState } from 'react'
import { Plus, Check, Store, Building, X } from 'lucide-react'
import { Voucher, PartnerContact } from '../../types/pos'
import { VoucherCard } from '../pos/VoucherCard'

export interface CreateVoucherModalProps {
  isOpen: boolean
  onClose: () => void
  partnerContacts: PartnerContact[]
  onOpenNewContactModal: () => void
  onSaveVoucher: (voucher: Voucher) => void
}

export const CreateVoucherModal: React.FC<CreateVoucherModalProps> = ({
  isOpen,
  onClose,
  partnerContacts,
  onOpenNewContactModal,
  onSaveVoucher
}) => {
  const [formOrigin, setFormOrigin] = useState<'platform' | 'merchant'>('merchant')
  const [selectedContactId, setSelectedContactId] = useState<string>(
    partnerContacts.find(c => c.category === 'merchant')?.id || partnerContacts[0]?.id || ''
  )
  const [formCode, setFormCode] = useState<string>('')
  const [formTitle, setFormTitle] = useState<string>('')
  const [formDescription, setFormDescription] = useState<string>('')
  const [formDiscountAmount, setFormDiscountAmount] = useState<number>(10000)
  const [formMinSpend, setFormMinSpend] = useState<number>(30000)
  const [formIsStackable, setFormIsStackable] = useState<boolean>(true)
  const [formQuantity, setFormQuantity] = useState<number>(1)
  const [formExpiryDate, setFormExpiryDate] = useState<string>('31 Des 2026')
  const [formTerms, setFormTerms] = useState<string>(
    '1. Berlaku untuk seluruh menu kategori minuman dan makanan.\n2. Minimum transaksi sebelum pajak PB1 dan service charge.\n3. Dapat digabungkan dengan promo merchant lainnya.'
  )

  if (!isOpen) return null

  const selectedContact = partnerContacts.find(c => c.id === selectedContactId) || partnerContacts[0]

  const livePreviewVoucher: Voucher = {
    code: formCode.trim().toUpperCase() || 'KODEPROMO',
    title: formTitle.trim() || 'Judul Promo Diskon',
    description: formDescription.trim() || 'Deskripsi singkat syarat dan keuntungan promo...',
    discountAmount: formDiscountAmount || 0,
    discountType: 'flat',
    minSpend: formMinSpend || 0,
    expiryDate: formExpiryDate || '31 Des 2026',
    isStackable: formIsStackable,
    issuerOrigin: formOrigin,
    contactId: selectedContact?.id,
    sponsorType: selectedContact?.category === 'bank' ? 'bank' : selectedContact?.category === 'loyalty' ? 'loyalty' : selectedContact?.category === 'partner' ? 'partner' : 'merchant',
    sponsorName: selectedContact?.brandName || 'Sponsor Promo',
    sponsorIcon: selectedContact?.icon || '🎟️',
    sponsorBrandColor: selectedContact?.brandColor || '#d97706',
    quantity: formQuantity,
    termsAndConditions: formTerms.split('\n').filter(t => t.trim().length > 0),
    isActive: true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formCode.trim() || !formTitle.trim()) {
      alert('Mohon isi Kode Kupon dan Judul Promo!')
      return
    }

    onSaveVoucher(livePreviewVoucher)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/85 backdrop-blur-md p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto no-scrollbar animate-slideUp">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Terbitkan Kupon / Promo Baru</h3>
              <p className="text-xs text-slate-400">Pilih kontak mitra penerbit dan atur parameter diskon</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* STEP 1: ASAL PENERBIT PROMO */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">1. Asal Penerbit Promo:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormOrigin('merchant')}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 text-left transition-all ${
                  formOrigin === 'merchant'
                    ? 'bg-amber-500/15 border-amber-500 text-white shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Store className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold">🏠 Promo Merchant Sendiri</h4>
                  <p className="text-[10px] text-slate-400">Dibiayai toko / loyalti kafe</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormOrigin('platform')}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 text-left transition-all ${
                  formOrigin === 'platform'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Building className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold">⚡ Platform / Bank Partner</h4>
                  <p className="text-[10px] text-slate-400">Kerjasama bank / sponsor Hfe</p>
                </div>
              </button>
            </div>
          </div>

          {/* STEP 2: PILIH MITRA / CONTACT BRAND */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">2. Hubungkan Kontak Mitra Penerbit:</label>
              <button
                type="button"
                onClick={onOpenNewContactModal}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Tambah Kontak Baru
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {partnerContacts.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedContactId(c.id)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                    selectedContactId === c.id
                      ? 'border-amber-500 bg-amber-500/10 text-white shadow font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-base shrink-0">{c.icon || '🏛️'}</span>
                  <div className="min-w-0">
                    <h5 className="text-[11px] truncate font-bold text-white">{c.brandName}</h5>
                    <p className="text-[9px] text-slate-400 font-mono capitalize">{c.category}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 3: DETAIL FORM INPUTS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-300">Kode Promo (Caps):</label>
              <input
                type="text"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                placeholder="Misal: BCAWEEKEND"
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-400 uppercase placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-300">Nominal Potongan (Rp):</label>
              <input
                type="number"
                value={formDiscountAmount}
                onChange={(e) => setFormDiscountAmount(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-300">Judul Promo:</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Misal: Diskon Spesial Debit BCA Rp 15.000"
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-300">Deskripsi Singkat:</label>
              <input
                type="text"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Misal: Min. transaksi Rp 50.000 dengan EDC resto"
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-300">Minimum Belanja (Rp):</label>
              <input
                type="number"
                value={formMinSpend}
                onChange={(e) => setFormMinSpend(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-300">Kuantitas per User:</label>
              <input
                type="number"
                value={formQuantity}
                min={1}
                max={10}
                onChange={(e) => setFormQuantity(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 sm:col-span-2 pt-1">
              <input
                type="checkbox"
                id="stackableCheck"
                checked={formIsStackable}
                onChange={(e) => setFormIsStackable(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700"
              />
              <label htmlFor="stackableCheck" className="text-xs font-bold text-slate-200 cursor-pointer">
                ⚡ Stackable (Dapat digabungkan dengan promo merchant/poin loyalitas)
              </label>
            </div>
          </div>

          {/* LIVE CARD PREVIEW */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-slate-400">Pratinjau Tampilan Kupon (Live Preview):</span>
            <VoucherCard voucher={livePreviewVoucher} mode="copyable" />
          </div>

          {/* ACTION SUBMIT BUTTONS */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Terbitkan Kupon Sekarang</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
