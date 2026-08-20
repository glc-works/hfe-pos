import React, { useState } from 'react'
import { MerchantAccount, UserAccount, CreateUserPayload } from '../../types/admin'
import { INITIAL_MERCHANTS, INITIAL_USERS } from '../../data/mockAdminData'
import { MerchantListSection } from '../../components/admin/MerchantListSection'
import { UserRbacSection } from '../../components/admin/UserRbacSection'
import { MerchantDetailModal } from '../../components/admin/MerchantDetailModal'
import { InviteUserModal } from '../../components/admin/InviteUserModal'
import {
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowLeft
} from 'lucide-react'

export interface AdminMerchantUserViewProps {
  onBackToPos?: () => void
}

export const AdminMerchantUserView: React.FC<AdminMerchantUserViewProps> = ({
  onBackToPos
}) => {
  const [activeTab, setActiveTab] = useState<'merchants' | 'users'>('merchants')
  const [merchants, setMerchants] = useState<MerchantAccount[]>(INITIAL_MERCHANTS)
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS)
  
  // Modals state
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantAccount | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2500)
  }

  const handleSelectMerchant = (merchant: MerchantAccount) => {
    setSelectedMerchant(merchant)
    setIsDetailModalOpen(true)
  }

  const handleUpdateMerchant = (updated: MerchantAccount) => {
    setMerchants((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
    showToast(`✅ Konfigurasi ${updated.name} berhasil diperbarui!`)
  }

  const handleInviteUser = (payload: CreateUserPayload) => {
    const merchant = merchants.find((m) => m.id === payload.assignedMerchantId)
    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
      assignedMerchantId: payload.assignedMerchantId,
      assignedMerchantName: merchant?.name || 'Kopi Nusantara Senopati',
      assignedOutletName: payload.assignedOutletName,
      pinCode: payload.pinCode,
      status: 'active',
      lastLoginAt: 'Belum pernah login',
      createdAt: new Date().toISOString().split('T')[0]
    }
    setUsers((prev) => [newUser, ...prev])
    showToast(`🎉 Staf ${newUser.name} (${newUser.role.toUpperCase()}) berhasil didaftarkan!`)
  }

  const handleResetUserPin = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, pinCode: '123456' } : u))
    )
    showToast('🔑 6-Digit PIN Kasir berhasil di-reset ke default [123456]!')
  }

  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
          : u
      )
    )
    showToast('Status keaktifan staf berhasil diperbarui!')
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain bg-slate-950 text-slate-100 font-sans p-4 sm:p-6 flex flex-col gap-6">
      {/* TOAST FEEDBACK */}
      {toastMessage && (
        <div className="fixed top-14 right-4 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4" /> {toastMessage}
        </div>
      )}

      {/* TOP BAR / HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {onBackToPos && (
              <button
                type="button"
                onClick={onBackToPos}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-xl text-xs font-bold border border-slate-800 flex items-center gap-1 transition-all mr-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Kasir POS
              </button>
            )}
            <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              OPERATIONS PLATFORM
            </span>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Multi-Tenant Engine
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            Mode Admin (Manajemen Merchant & RBAC Staf)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola langganan SaaS merchant, tenancy subdomain, modul fitur toko, serta roster staf dan PIN kasir.
          </p>
        </div>

        {/* 2-TAB SEGMENTED CONTROLLER */}
        <div className="flex items-center gap-1 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-inner w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('merchants')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'merchants'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Kelola Merchant ({merchants.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Pengguna & Staf ({users.length})</span>
          </button>
        </div>
      </div>

      {/* ACTIVE TAB CONTENT */}
      {activeTab === 'merchants' ? (
        <MerchantListSection
          merchants={merchants}
          onSelectMerchant={handleSelectMerchant}
        />
      ) : (
        <UserRbacSection
          users={users}
          onInviteUserClick={() => setIsInviteModalOpen(true)}
          onResetUserPin={handleResetUserPin}
          onToggleUserStatus={handleToggleUserStatus}
        />
      )}

      {/* MODALS */}
      <MerchantDetailModal
        merchant={selectedMerchant}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onUpdateMerchant={handleUpdateMerchant}
      />

      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInviteUser={handleInviteUser}
        availableMerchants={merchants.map((m) => ({ id: m.id, name: m.name }))}
      />
    </div>
  )
}
