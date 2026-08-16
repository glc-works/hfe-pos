import React, { useState } from 'react'
import { Users, Search, Plus, Award, AlertCircle, Phone, DollarSign, Filter } from 'lucide-react'
import { useCustomerContacts, CustomerContact } from '../hooks/useCustomerContacts'
import { ContactDetailModal } from '../components/crm/ContactDetailModal'

export const CustomerContactsView: React.FC = () => {
  const { contacts, addContact, updateContact } = useCustomerContacts()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTier, setSelectedTier] = useState<string>('all')
  const [activeContact, setActiveContact] = useState<CustomerContact | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const filteredContacts = contacts.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
    const matchTier = selectedTier === 'all' || c.tier === selectedTier
    return matchSearch && matchTier
  })

  const handleOpenDetail = (contact: CustomerContact) => {
    setActiveContact(contact)
    setShowDetailModal(true)
  }

  return (
    <main className="flex-1 p-3 sm:p-6 max-w-6xl mx-auto w-full flex flex-col gap-6">
      {/* HEADER BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Master Kontak Pelanggan & CRM POS</h2>
            <p className="text-xs text-slate-400">Kelola Direktori Pelanggan, Limit Kasbon Hutang, Alergen Makanan, & Tier Loyalty</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            const name = prompt('Nama Pelanggan Baru:')
            const phone = prompt('Nomor WhatsApp (Contoh: 62812...):')
            if (name && phone) {
              addContact({
                name,
                phone,
                tier: 'bronze',
                kasbonLimit: 500000,
                kasbonBalance: 0,
                allergens: [],
                totalOrdersCount: 0,
                totalSpend: 0,
                favoriteItems: []
              })
            }
          }}
          className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> Tambah Kontak Baru
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-md">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari Nama / No WhatsApp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Tier:
          </span>
          {['all', 'bronze', 'silver', 'gold', 'platinum'].map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                selectedTier === tier
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* CONTACTS TABLE / CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => handleOpenDetail(contact)}
            className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-lg cursor-pointer transition-all hover:scale-[1.01]"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  {contact.name}
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {contact.tier}
                  </span>
                </h4>
                <p className="text-xs text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-emerald-400" /> +{contact.phone}
                </p>
              </div>
            </div>

            {/* ALLERGEN BADGES */}
            {contact.allergens.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                {contact.allergens.map((alg) => (
                  <span key={alg} className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-mono font-bold px-2 py-0.5 rounded-md">
                    {alg}
                  </span>
                ))}
              </div>
            )}

            {/* KASBON LIMIT & SPEND SUMMARY */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block">Total Spend</span>
                <strong className="text-emerald-400">Rp {contact.totalSpend.toLocaleString('id-ID')}</strong>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Hutang Kasbon</span>
                <strong className={contact.kasbonBalance > 0 ? 'text-rose-400' : 'text-slate-400'}>
                  Rp {contact.kasbonBalance.toLocaleString('id-ID')}
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ContactDetailModal
        show={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        contact={activeContact}
        onSave={(updated) => {
          if (activeContact) {
            updateContact(activeContact.id, updated)
          }
        }}
      />
    </main>
  )
}
