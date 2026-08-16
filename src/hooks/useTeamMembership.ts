import { useState, useEffect, useMemo } from 'react'
import { StaffRole, TeamMember, InviteStaffPayload } from '../types/pos'
import { fetchTeamRoster, sendStaffInvitation, acceptStaffPin, revokeStaffAccess } from '../services/hfeApi'

export interface AccessControlEvaluator {
  canAccessSettings: boolean
  canAccessPos: boolean
  canAccessKds: boolean
  canAccessShiftReconcile: boolean
}

export function evaluateAccessControl(role: StaffRole): AccessControlEvaluator {
  switch (role) {
    case 'owner':
      return {
        canAccessSettings: true,
        canAccessPos: true,
        canAccessKds: true,
        canAccessShiftReconcile: true,
      }
    case 'cashier':
      return {
        canAccessSettings: false,
        canAccessPos: true,
        canAccessKds: false,
        canAccessShiftReconcile: true,
      }
    case 'barista':
    case 'chef':
      return {
        canAccessSettings: false,
        canAccessPos: false,
        canAccessKds: true,
        canAccessShiftReconcile: false,
      }
    case 'waiter':
      return {
        canAccessSettings: false,
        canAccessPos: true,
        canAccessKds: false,
        canAccessShiftReconcile: false,
      }
    case 'checker_qc':
      return {
        canAccessSettings: false,
        canAccessPos: false,
        canAccessKds: true,
        canAccessShiftReconcile: false,
      }
    default:
      return {
        canAccessSettings: false,
        canAccessPos: false,
        canAccessKds: false,
        canAccessShiftReconcile: false,
      }
  }
}

export function useTeamMembership(bookId: string = 'BOOK-CAFE-HQ-88') {
  const [roster, setRoster] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currentStaffRole, setCurrentStaffRole] = useState<StaffRole>('owner')
  const [activePinMember, setActivePinMember] = useState<TeamMember | null>(null)

  const loadRoster = async () => {
    setLoading(true)
    try {
      const data = await fetchTeamRoster(bookId)
      setRoster(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRoster()
  }, [bookId])

  const accessControl = useMemo(() => {
    return evaluateAccessControl(currentStaffRole)
  }, [currentStaffRole])

  const inviteStaff = async (payload: InviteStaffPayload): Promise<TeamMember> => {
    const newMember = await sendStaffInvitation(payload, bookId)
    setRoster((prev) => [newMember, ...prev])
    return newMember
  }

  const bindEmployeePin = async (pinCode: string): Promise<{ success: boolean; member?: TeamMember; message?: string }> => {
    if (!/^\d{6}$/.test(pinCode)) {
      return { success: false, message: 'PIN harus berupa 6 angka digit' }
    }

    const matched = roster.find((m) => m.pinCode === pinCode)
    if (!matched) {
      return { success: false, message: 'PIN 6-digit tidak terdaftar pada roster staf' }
    }

    const res = await acceptStaffPin(pinCode, bookId)
    if (res.success) {
      const updatedMember: TeamMember = {
        ...matched,
        status: 'active',
        activatedAt: new Date().toISOString(),
      }

      setRoster((prev) => prev.map((m) => (m.id === matched.id ? updatedMember : m)))
      setCurrentStaffRole(matched.role)
      setActivePinMember(updatedMember)
      return { success: true, member: updatedMember }
    }

    return { success: false, message: 'Gagal memverifikasi PIN tablet' }
  }

  const revokeMembership = async (membershipId: string): Promise<boolean> => {
    const res = await revokeStaffAccess(membershipId, bookId)
    if (res.success) {
      setRoster((prev) => prev.filter((m) => m.id !== membershipId))
      return true
    }
    return false
  }

  return {
    roster,
    loading,
    currentStaffRole,
    activePinMember,
    canAccessSettings: accessControl.canAccessSettings,
    canAccessPos: accessControl.canAccessPos,
    canAccessKds: accessControl.canAccessKds,
    canAccessShiftReconcile: accessControl.canAccessShiftReconcile,
    setCurrentStaffRole,
    inviteStaff,
    bindEmployeePin,
    revokeMembership,
    reloadRoster: loadRoster,
  }
}
