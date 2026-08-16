import React, { useState } from 'react'
import { useTeamMembership } from '../../hooks/useTeamMembership'
import { InviteStaffModal } from './InviteStaffModal'
import { EmployeePinBindingModal } from './EmployeePinBindingModal'
import { StaffRole } from '../../types/pos'
import { Users, UserPlus, KeyRound, Crown, Landmark, Coffee, UtensilsCrossed, Footprints, ClipboardCheck, Trash2, Shield, CheckCircle2, Clock } from 'lucide-react'

export const TeamRosterSection: React.FC = () => {
  const {
    roster,
    loading,
    currentStaffRole,
    canAccessSettings,
    canAccessPos,
    canAccessKds,
    canAccessShiftReconcile,
    setCurrentStaffRole,
    inviteStaff,
    bindEmployeePin,
    revokeMembership,
  } = useTeamMembership()

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [isPinModalOpen, setIsPinModalOpen] = useState(false)

  const getRoleBadge = (role: StaffRole) => {
    switch (role) {
      case 'owner':
        return { label: 'Owner / Manager', emoji: '👑', icon: Crown, color: 'bg-amber-600/20 text-amber-800 dark:text-amber-200 border-amber-600/30' }
      case 'cashier':
        return { label: 'Cashier', emoji: '💵', icon: Landmark, color: 'bg-blue-500/20 text-blue-800 dark:text-blue-200 border-blue-500/30' }
      case 'barista':
        return { label: 'Barista', emoji: '☕', icon: Coffee, color: 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border-emerald-500/30' }
      case 'chef':
        return { label: 'Kitchen Chef', emoji: '👨‍🍳', icon: UtensilsCrossed, color: 'bg-orange-500/20 text-orange-800 dark:text-orange-200 border-orange-500/30' }
      case 'waiter':
        return { label: 'Server / Waiter', emoji: '🍽️', icon: Footprints, color: 'bg-purple-500/20 text-purple-800 dark:text-purple-200 border-purple-500/30' }
      case 'checker_qc':
        return { label: 'Checker QC', emoji: '📋', icon: ClipboardCheck, color: 'bg-indigo-500/20 text-indigo-800 dark:text-indigo-200 border-indigo-500/30' }
      default:
        return { label: role, emoji: '👤', icon: Users, color: 'bg-gray-500/20 text-gray-800 border-gray-500/30' }
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Bar */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-900/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-base font-bold text-amber-950 dark:text-amber-100">
              Pengaturan Roster Tim & Hak Akses RBAC Staf
            </h3>
          </div>
          <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
            Kelola peran tim kasir, barcode PIN aktivasi tablet, & pembatasan modul surface.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPinModalOpen(true)}
            className="text-xs font-bold px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-950 dark:text-amber-100 border border-amber-900/20 transition-all flex items-center gap-1.5"
          >
            <KeyRound className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            Aktivasi PIN Tablet
          </button>

          <button
            type="button"
            onClick={() => setIsInviteModalOpen(true)}
            className="text-xs font-bold px-4 py-2 rounded-xl bg-amber-600 text-white hover:bg-amber-700 shadow-md transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            Undang Staf Baru
          </button>
        </div>
      </div>

      {/* Role Tester Access Guard Matrix */}
      <div className="p-4 rounded-xl border border-amber-900/15 bg-amber-500/5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-amber-950 dark:text-amber-100">
              Evaluator Hak Akses RBAC Sesuai Peran Aktif:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-800/80 dark:text-amber-300/80">Simulasi Peran:</span>
            <select
              value={currentStaffRole}
              onChange={(e) => setCurrentStaffRole(e.target.value as StaffRole)}
              className="text-xs font-bold px-2.5 py-1 rounded-lg border border-amber-900/20 bg-amber-500/10 text-amber-950 dark:text-amber-100 focus:outline-none"
            >
              <option value="owner">👑 Owner / Manager</option>
              <option value="cashier">💵 Cashier</option>
              <option value="barista">☕ Barista</option>
              <option value="chef">👨‍🍳 Kitchen Chef</option>
              <option value="waiter">🍽️ Server / Waiter</option>
              <option value="checker_qc">📋 Checker QC</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className={`p-2 rounded-lg border text-center ${canAccessSettings ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-950 dark:text-emerald-100 font-bold' : 'bg-gray-500/10 border-gray-500/20 opacity-50'}`}>
            {canAccessSettings ? '✓ Cafe Settings' : '✗ Cafe Settings'}
          </div>
          <div className={`p-2 rounded-lg border text-center ${canAccessPos ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-950 dark:text-emerald-100 font-bold' : 'bg-gray-500/10 border-gray-500/20 opacity-50'}`}>
            {canAccessPos ? '✓ Barista POS' : '✗ Barista POS'}
          </div>
          <div className={`p-2 rounded-lg border text-center ${canAccessKds ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-950 dark:text-emerald-100 font-bold' : 'bg-gray-500/10 border-gray-500/20 opacity-50'}`}>
            {canAccessKds ? '✓ Layar KDS' : '✗ Layar KDS'}
          </div>
          <div className={`p-2 rounded-lg border text-center ${canAccessShiftReconcile ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-950 dark:text-emerald-100 font-bold' : 'bg-gray-500/10 border-gray-500/20 opacity-50'}`}>
            {canAccessShiftReconcile ? '✓ Shift Reconcile' : '✗ Shift Reconcile'}
          </div>
        </div>
      </div>

      {/* Roster List Table */}
      <div className="rounded-2xl border border-amber-900/15 overflow-hidden bg-amber-50/50 dark:bg-amber-950/50 shadow-sm">
        <div className="px-5 py-3 border-b border-amber-900/10 bg-amber-500/10 flex items-center justify-between">
          <h4 className="text-xs font-bold text-amber-950 dark:text-amber-100">
            Daftar Anggota Tim ({roster.length} Orang)
          </h4>
          {loading && <span className="text-xs text-amber-700 animate-pulse">Memuat roster...</span>}
        </div>

        <div className="divide-y divide-amber-900/10">
          {roster.map((m) => {
            const badge = getRoleBadge(m.role)

            return (
              <div key={m.id} className="p-4 flex items-center justify-between gap-4 hover:bg-amber-500/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-600/20 text-amber-900 dark:text-amber-100 font-bold flex items-center justify-center text-sm shadow-sm">
                    {m.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-bold text-amber-950 dark:text-amber-100">
                        {m.name}
                      </h5>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                        {badge.emoji} {badge.label}
                      </span>
                    </div>
                    <p className="text-xs text-amber-900/70 dark:text-amber-200/70 mt-0.5">
                      {m.contact}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Status Badge */}
                  {m.status === 'active' ? (
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Aktif
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                      <Clock className="w-3.5 h-3.5" />
                      Pending Invite
                    </span>
                  )}

                  {/* PIN Preview */}
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-amber-900/60 dark:text-amber-200/60 block">PIN Tablet</span>
                    <code className="text-xs font-mono font-bold text-amber-900 dark:text-amber-100 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-900/15">
                      {m.pinCode}
                    </code>
                  </div>

                  {/* Revoke Action */}
                  <button
                    type="button"
                    onClick={() => revokeMembership(m.id)}
                    className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-500/15 transition-colors"
                    title="Revoke Akun Staf"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modals */}
      <InviteStaffModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={async (payload) => {
          await inviteStaff(payload)
        }}
      />

      <EmployeePinBindingModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onBindPin={async (pinCode) => {
          return await bindEmployeePin(pinCode)
        }}
      />
    </div>
  )
}
