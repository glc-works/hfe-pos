import React, { useState } from 'react'
import { CreateUserPayload, UserRole } from '../../types/admin'
import {
  X,
  UserPlus,
  User,
  Mail,
  Phone,
  Shield,
  Key,
  Store,
  Check
} from 'lucide-react'

export interface InviteUserModalProps {
  isOpen: boolean
  onClose: () => void
  onInviteUser: (payload: CreateUserPayload) => void
  availableMerchants: { id: string; name: string }[]
}

export const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isOpen,
  onClose,
  onInviteUser,
  availableMerchants
}) => {
  if (!isOpen) return null

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<UserRole>('cashier')
  const [merchantId, setMerchantId] = useState(availableMerchants[0]?.id || '')
  const [outletName, setOutletName] = useState('Outlet Senopati')
  const [pinCode, setPinCode] = useState('123456')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setErrorMsg('Nama staf wajib diisi.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Email staf tidak valid.')
      return
    }
    if (!/^\d{6}$/.test(pinCode)) {
      setErrorMsg('PIN Kasir harus tepat 6 digit angka.')
      return
    }

    onInviteUser({
      name,
      email,
      phone,
      role,
      assignedMerchantId: merchantId,
      assignedOutletName: outletName,
      pinCode
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Undang Staf & Buat Akun Baru</h2>
              <p className="text-xs text-slate-400">Role-Based Access Control & Penerbitan PIN</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL FORM */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl text-rose-400 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Nama Lengkap Staf</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="misal: Bpk. Hendra Gunawan"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Email Staf</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hendra@kopinusantara.id"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">No. WhatsApp</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812-3456-7890"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Peran Akun (RBAC Role)</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="owner">Owner PT (Full Admin)</option>
                <option value="manager">Store Manager</option>
                <option value="cashier">Kasir POS Utama</option>
                <option value="barista">Barista / Waiter Floor</option>
                <option value="kitchen">Kitchen Chef</option>
                <option value="accountant">Akuntan SAK</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">PIN Kasir (6 Digit)</label>
              <div className="relative">
                <Key className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white font-mono tracking-widest focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* MODAL FOOTER */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" /> Terbitkan Undangan Staf
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
