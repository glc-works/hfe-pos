import React, { useState } from 'react'
import { UserAccount, UserRole, UserStatus } from '../../types/admin'
import {
  Users,
  Search,
  UserPlus,
  Shield,
  Key,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  Store,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react'

export interface UserRbacSectionProps {
  users: UserAccount[]
  onInviteUserClick: () => void
  onResetUserPin: (userId: string) => void
  onToggleUserStatus: (userId: string) => void
}

export const UserRbacSection: React.FC<UserRbacSectionProps> = ({
  users,
  onInviteUserClick,
  onResetUserPin,
  onToggleUserStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all')

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery) ||
      u.assignedMerchantName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  // KPIs
  const totalStaff = users.length
  const activeStaff = users.filter((u) => u.status === 'active').length
  const cashierCount = users.filter((u) => u.role === 'cashier' || u.role === 'barista').length
  const managerCount = users.filter((u) => u.role === 'manager' || u.role === 'owner').length

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'owner':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Shield className="w-3 h-3 text-amber-400" /> Owner PT
          </span>
        )
      case 'manager':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Shield className="w-3 h-3 text-purple-400" /> Store Manager
          </span>
        )
      case 'cashier':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Key className="w-3 h-3 text-indigo-400" /> Kasir POS
          </span>
        )
      case 'barista':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
            Barista / Floor
          </span>
        )
      case 'kitchen':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
            Kitchen Chef
          </span>
        )
      case 'accountant':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Akuntan SAK
          </span>
        )
    }
  }

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Aktif
          </span>
        )
      case 'on_leave':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            Cuti / Izin
          </span>
        )
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
            Nonaktif
          </span>
        )
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* 4-ZONE KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Total Staf & Pengguna</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">{totalStaff}</span>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              {activeStaff} Aktif
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Kasir & Barista Staf</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-indigo-400 tabular-nums">{cashierCount}</span>
            <Key className="w-4 h-4 text-indigo-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Manajer & Owner PT</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">{managerCount}</span>
            <Shield className="w-4 h-4 text-amber-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Keamanan PIN Kasir</span>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold text-emerald-400">6-Digit Hash Terenkripsi</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* SEARCH, FILTERS & ACTION BAR */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama staf, email, HP..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          {/* Role Filters */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] overflow-x-auto no-scrollbar">
            {(['all', 'owner', 'manager', 'cashier', 'barista', 'kitchen', 'accountant'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all capitalize whitespace-nowrap ${
                  roleFilter === r ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === 'all' ? 'Semua Peran' : r}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onInviteUserClick}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" /> + Undang Staf Baru
          </button>
        </div>
      </div>

      {/* USER RBAC TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Nama Staf & Kontak</th>
                <th className="py-3 px-4">Peran (RBAC)</th>
                <th className="py-3 px-4">Penugasan Outlet</th>
                <th className="py-3 px-4">PIN Kasir</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Login Terakhir</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                    Tidak ada staf yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-100">{user.name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-500" /> {user.email}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                        <Phone className="w-2.5 h-2.5 text-slate-500" /> {user.phone}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{getRoleBadge(user.role)}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-200">{user.assignedMerchantName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Store className="w-3 h-3 text-indigo-400" /> {user.assignedOutletName}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-slate-300 font-bold tracking-widest bg-slate-950 px-2 py-1 rounded border border-slate-800 flex items-center gap-1.5 w-max">
                        <Lock className="w-2.5 h-2.5 text-amber-400" /> ••••••
                      </span>
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(user.status)}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {user.lastLoginAt}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onResetUserPin(user.id)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1"
                          title="Reset 6-Digit PIN Kasir"
                        >
                          <RefreshCw className="w-3 h-3 text-amber-400" /> Reset PIN
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleUserStatus(user.id)}
                          className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-all ${
                            user.status === 'active'
                              ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {user.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
