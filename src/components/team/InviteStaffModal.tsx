import React, { useState } from 'react'
import { StaffRole, InviteStaffPayload } from '../../types/pos'
import { UserPlus, X, Mail, Phone, ShieldCheck, Crown, Landmark, Coffee, UtensilsCrossed, Footprints, ClipboardCheck } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onInvite: (payload: InviteStaffPayload) => Promise<void>
}

export const InviteStaffModal: React.FC<Props> = ({ isOpen, onClose, onInvite }) => {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [role, setRole] = useState<StaffRole>('cashier')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const rolesList = [
    {
      id: 'owner' as StaffRole,
      title: 'Owner / Direktur',
      emoji: '👑',
      icon: Crown,
      description: 'Akses penuh ke semua menu, Laporan Keuangan P&L, Pajak PB1, & Pengaturan Perusahaan.',
    },
    {
      id: 'store_manager' as StaffRole,
      title: 'Store Manager / Supervisor',
      emoji: '👔',
      icon: ShieldCheck,
      description: 'Otorisasi PIN Void/Refund, Kas Kecil (Petty Cash), Stok Opname, & Operasional Shift.',
    },
    {
      id: 'cashier' as StaffRole,
      title: 'Kasir & Front-Desk',
      emoji: '💵',
      icon: Landmark,
      description: 'Akses ke Kasir POS, Scan Barcode, Pembayaran QRIS/Card, & Blind Cash Count.',
    },
    {
      id: 'barista' as StaffRole,
      title: 'Barista / Bartender',
      emoji: '☕',
      icon: Coffee,
      description: 'Akses khusus Layar KDS Barista untuk meracik minuman, Resep BOM & Toggle 86.',
    },
    {
      id: 'chef' as StaffRole,
      title: 'Kitchen Chef / Cook',
      emoji: '👨‍🍳',
      icon: UtensilsCrossed,
      description: 'Akses khusus Layar KDS Dapur untuk memasak, Course Firing & Resep SOP.',
    },
    {
      id: 'waiter' as StaffRole,
      title: 'Server / Waiter Pramusaji',
      emoji: '🍽️',
      icon: Footprints,
      description: 'Akses pesan meja mobile via tablet, respon panggilan waiter & antar menu.',
    },
    {
      id: 'checker_qc' as StaffRole,
      title: 'Checker QC & Expediter',
      emoji: '📋',
      icon: ClipboardCheck,
      description: 'Akses ke layar audit QC sebelum pesanan disajikan / dibungkus delivery.',
    },
    {
      id: 'sommelier' as StaffRole,
      title: 'Sommelier & Wine Cellar',
      emoji: '🍷',
      icon: UtensilsCrossed,
      description: 'Akses inventori wine cellar, catatan pouring botol & rekomendasi pairing tamu.',
    },
    {
      id: 'courier' as StaffRole,
      title: 'Kurir Toko / Delivery Runner',
      emoji: '🛵',
      icon: Footprints,
      description: 'Akses companion kurir, navigasi GMaps, bukti foto serah terima & setoran COD.',
    },
    {
      id: 'warehouse_keeper' as StaffRole,
      title: 'Petugas Gudang & Logistik',
      emoji: '📦',
      icon: Landmark,
      description: 'Akses penerimaan barang supplier (GRN), mutasi antar-gudang cabang, & spoilage.',
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Nama staf wajib diisi')
      return
    }
    if (!contact.trim()) {
      setError('WhatsApp atau Email staf wajib diisi')
      return
    }

    setError(null)
    setIsSubmitting(true)
    try {
      await onInvite({ name, contact, role })
      setName('')
      setContact('')
      setRole('cashier')
      onClose()
    } catch {
      setError('Gagal mengirim undangan staf')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-amber-50 dark:bg-amber-950/95 rounded-2xl shadow-2xl border border-amber-900/20 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-900/10 bg-amber-500/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-600 text-white shadow-md">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-amber-950 dark:text-amber-100">
                Undang Anggota Staf Baru
              </h3>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                Kirim tautan aktivasi PIN 6-digit untuk tablet operasional staf.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-amber-800 dark:text-amber-200 hover:bg-amber-500/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1">
              Nama Lengkap Staf <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Rian Pratama"
              className="w-full px-3 py-2 text-sm rounded-lg border border-amber-900/20 bg-amber-500/5 focus:bg-amber-500/10 focus:border-amber-600 focus:outline-none text-amber-950 dark:text-amber-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1">
              Kontak (Nomor WhatsApp / Email) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Contoh: 6281234567890 atau rian@artisancafe.id"
              className="w-full px-3 py-2 text-sm rounded-lg border border-amber-900/20 bg-amber-500/5 focus:bg-amber-500/10 focus:border-amber-600 focus:outline-none text-amber-950 dark:text-amber-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-2">
              Pilih Peran RBAC Staf <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {rolesList.map((r) => {
                const isSelected = role === r.id
                const IconComponent = r.icon

                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-amber-600 bg-amber-500/15 shadow-sm ring-2 ring-amber-500/30'
                        : 'border-amber-900/15 bg-amber-500/5 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{r.emoji}</span>
                      <IconComponent className="w-4 h-4 text-amber-700 dark:text-amber-300" />
                      <span className="text-xs font-bold text-amber-950 dark:text-amber-100">
                        {r.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-900/70 dark:text-amber-200/70 leading-relaxed">
                      {r.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-900/15 flex items-center gap-2 text-xs text-amber-900 dark:text-amber-200">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Sistem akan membuatkan <strong>PIN 6-digit unik</strong> yang digunakan staf untuk login di layar tablet toko.
            </span>
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-amber-900/20 bg-amber-500/10 text-amber-900 dark:text-amber-100 hover:bg-amber-500/20 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-600 text-white hover:bg-amber-700 shadow-md transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Undangan Staf'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
