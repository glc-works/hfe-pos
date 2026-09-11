import React, { useState, useMemo } from 'react'
import { X, Search, UserPlus, Phone, Crown, AlertTriangle, Check, User } from 'lucide-react'
import { useCustomerContacts, CustomerContact } from '../../hooks/useCustomerContacts'

export interface CustomerPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectCustomer: (customer: CustomerContact) => void
  currentSelectedId?: string
}

export const CustomerPickerModal: React.FC<CustomerPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectCustomer,
  currentSelectedId
}) => {
  const { contacts, addContact } = useCustomerContacts()
  const [searchQuery, setSearchQuery] = useState('')
  const [isQuickAdd, setIsQuickAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return contacts
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.id.toLowerCase().includes(q)
    )
  }, [contacts, searchQuery])

  if (!isOpen) return null

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    const created: CustomerContact = {
      id: `CUST-${Date.now().toString().slice(-4)}`,
      name: newName.trim(),
      phone: newPhone.trim() || '-',
      tier: 'bronze',
      kasbonLimit: 500000,
      kasbonBalance: 0,
      allergens: [],
      totalOrdersCount: 1,
      totalSpend: 0,
      favoriteItems: []
    }
    addContact(created)
    onSelectCustomer(created)
    setIsQuickAdd(false)
    setNewName('')
    setNewPhone('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-4 sm:p-5 flex flex-col gap-3.5 shadow-2xl relative max-h-[88vh] overflow-hidden text-slate-900 dark:text-slate-100 animate-scaleUp">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold shadow-sm">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Pasang Pelanggan / Member
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Poin loyalitas, diskon member, struk WhatsApp & kasbon
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SEARCH & TOGGLE QUICK ADD */}
        {!isQuickAdd ? (
          <>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ketik Nama atau No. WhatsApp..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                  autoFocus
                />
              </div>
              <button
                type="button"
                onClick={() => setIsQuickAdd(true)}
                className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 transition-all shrink-0 cursor-pointer shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tambah Baru</span>
              </button>
            </div>

            {/* CONTACTS LIST */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1 flex flex-col gap-2 max-h-[50vh]">
              {filtered.length === 0 ? (
                <div className="py-8 text-center flex flex-col items-center justify-center gap-2">
                  <User className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pelanggan "{searchQuery}" tidak ditemukan.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setNewName(searchQuery)
                      setIsQuickAdd(true)
                    }}
                    className="mt-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-xl border border-border cursor-pointer transition-all"
                  >
                    + Daftarkan "{searchQuery}" Sekarang
                  </button>
                </div>
              ) : (
                filtered.map((contact) => {
                  const isSelected = contact.id === currentSelectedId
                  return (
                    <button
                      key={contact.id}
                      type="button"
                      onClick={() => {
                        onSelectCustomer(contact)
                        onClose()
                      }}
                      className={`w-full p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer group ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 shadow-sm'
                          : 'bg-slate-50/70 hover:bg-slate-100 dark:bg-slate-950/60 dark:hover:bg-slate-800/60 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
                          {contact.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                              {contact.name}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0">
                              {contact.tier}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-0.5 font-mono">
                              <Phone className="w-2.5 h-2.5 text-emerald-500" />
                              {contact.phone}
                            </span>
                            {contact.allergens.length > 0 && (
                              <span className="flex items-center gap-0.5 text-rose-500 font-semibold text-[10px]">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                {contact.allergens.join(', ')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          Pilih ➔
                        </span>
                      )}
                    </button>
                  )
                })
              )}
            </div>
          </>
        ) : (
          /* QUICK REGISTER FORM */
          <form onSubmit={handleQuickAddSubmit} className="flex flex-col gap-3 py-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Pendaftaran Cepat Pelanggan Baru
              </span>
              <button
                type="button"
                onClick={() => setIsQuickAdd(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                Kembali ke Pencarian
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Nama Pelanggan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Nomor WhatsApp (Untuk kirim nota & simpan poin)
              </label>
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Contoh: 08123456789"
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsQuickAdd(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-md"
              >
                Simpan & Pasang ke Keranjang ➔
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
