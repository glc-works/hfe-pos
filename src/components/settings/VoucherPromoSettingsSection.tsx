import React, { useState } from 'react'
import {
  Ticket, Plus, Trash2, Info, ToggleLeft, ToggleRight
} from 'lucide-react'
import { useMerchantConfig } from '../../context/MerchantConfigContext'
import { Voucher } from '../../types/pos'
import { VoucherCard } from '../pos/VoucherCard'
import { VoucherDetailModal } from '../pos/VoucherDetailModal'
import { CreateVoucherModal } from './CreateVoucherModal'
import { CreatePartnerContactModal } from './CreatePartnerContactModal'

export const VoucherPromoSettingsSection: React.FC = () => {
  const {
    vouchers,
    partnerContacts,
    addVoucher,
    deleteVoucher,
    toggleVoucherStatus,
    addPartnerContact
  } = useMerchantConfig()

  const [activeFilter, setActiveFilter] = useState<'all' | 'platform' | 'merchant'>('all')
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [showNewContactModal, setShowNewContactModal] = useState<boolean>(false)
  const [selectedVoucherForDetails, setSelectedVoucherForDetails] = useState<Voucher | null>(null)

  const filteredVouchers = vouchers.filter(v => {
    if (activeFilter === 'platform') return v.issuerOrigin === 'platform'
    if (activeFilter === 'merchant') return v.issuerOrigin === 'merchant'
    return true
  })

  return (
    <div className="flex flex-col gap-5 w-full animate-fadeIn pb-8">
      {/* 1. TOP HEADER BANNER & ACTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xl shadow shrink-0">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>Manajemen Kupon & Promo Mitra</span>
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                {vouchers.length} Kupon
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Terbitkan kupon promosi merchant atau aktifkan promo platform & perbankan terintegrasi Contact CRM.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Terbitkan Kupon Baru</span>
        </button>
      </div>

      {/* 2. STATS & CATEGORY FILTER TABS */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
              activeFilter === 'all'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua ({vouchers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('platform')}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
              activeFilter === 'platform'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Platform Partner ({vouchers.filter(v => v.issuerOrigin === 'platform').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('merchant')}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
              activeFilter === 'merchant'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🏠 Merchant Sendiri ({vouchers.filter(v => v.issuerOrigin === 'merchant').length})
          </button>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Sinkronisasi Otomatis ke Menu Pelanggan (QR)
        </span>
      </div>

      {/* 3. VOUCHERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredVouchers.map((v) => (
          <div
            key={v.code}
            className={`bg-slate-900 border rounded-2xl p-4 flex flex-col gap-3 shadow transition-all ${
              v.isActive !== false ? 'border-slate-800' : 'border-slate-800/40 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <VoucherCard
                  voucher={v}
                  mode="copyable"
                  onViewDetails={(voucher) => setSelectedVoucherForDetails(voucher)}
                />
              </div>
            </div>

            {/* CONTROL ROW: TOGGLE STATUS & DELETE */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
              <button
                type="button"
                onClick={() => toggleVoucherStatus(v.code)}
                className={`flex items-center gap-1.5 font-bold text-[11px] px-2.5 py-1 rounded-xl transition-colors ${
                  v.isActive !== false
                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                    : 'text-slate-400 bg-slate-800 border border-slate-700'
                }`}
              >
                {v.isActive !== false ? (
                  <>
                    <ToggleRight className="w-4 h-4 text-emerald-400" />
                    <span>Aktif di Menu QR</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 text-slate-400" />
                    <span>Non-Aktif</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedVoucherForDetails(v)}
                  className="text-[11px] font-bold text-slate-400 hover:text-amber-400 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Lihat S&K</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Hapus kupon promo ${v.code}?`)) {
                      deleteVoucher(v.code)
                    }
                  }}
                  className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                  title="Hapus Kupon"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE VOUCHER MODAL */}
      <CreateVoucherModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        partnerContacts={partnerContacts}
        onOpenNewContactModal={() => setShowNewContactModal(true)}
        onSaveVoucher={(v) => addVoucher(v)}
      />

      {/* CREATE NEW CONTACT MODAL */}
      <CreatePartnerContactModal
        isOpen={showNewContactModal}
        onClose={() => setShowNewContactModal(false)}
        onSaveContact={(c) => addPartnerContact(c)}
      />

      {/* S&K DETAIL MODAL */}
      <VoucherDetailModal
        voucher={selectedVoucherForDetails}
        isOpen={!!selectedVoucherForDetails}
        onClose={() => setSelectedVoucherForDetails(null)}
        mode="copyable"
      />
    </div>
  )
}
