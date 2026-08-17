import { describe, it, expect } from 'vitest'
import { getBusinessTypePolicy, getOperationScalePolicy } from '../hooks/useOnboarding'
import { evaluateAccessControl } from '../hooks/useTeamMembership'
import { fetchTeamRoster, sendStaffInvitation, acceptStaffPin, revokeStaffAccess, saveStoreSettings } from '../services/hfeApi'

describe('Store Onboarding & Preset Policy Engine', () => {
  it('generates correct preset policy for Cafe & Resto F&B', () => {
    const policy = getBusinessTypePolicy('cafe_fnb')
    expect(policy.enableTableFloorPlan).toBe(true)
    expect(policy.enableDrinkModifiers).toBe(true)
    expect(policy.enableKdsKanban).toBe(true)
    expect(policy.enableRecipeBom).toBe(true)
    expect(policy.enableBarcodeScanner).toBe(false)
    expect(policy.enableKasbonLedger).toBe(false)
  })

  it('generates correct preset policy for Toko Kelontong', () => {
    const policy = getBusinessTypePolicy('toko_kelontong')
    expect(policy.enableBarcodeScanner).toBe(true)
    expect(policy.enableMultiUom).toBe(true)
    expect(policy.enableKasbonLedger).toBe(true)
    expect(policy.enableScanAndGo).toBe(true)
    expect(policy.enableTableFloorPlan).toBe(false)
    expect(policy.enableDrinkModifiers).toBe(false)
  })

  it('generates correct preset policy for Fine Dining', () => {
    const policy = getBusinessTypePolicy('fine_dining')
    expect(policy.enableCourseFiring).toBe(true)
    expect(policy.enableSommelierCellar).toBe(true)
    expect(policy.enableMaitreDVip).toBe(true)
    expect(policy.enableTableFloorPlan).toBe(true)
  })

  it('generates correct operation scale policy for Single Person & Enterprise', () => {
    const singlePolicy = getOperationScalePolicy('single_person')
    expect(singlePolicy.enableAutoBumpOnCheckout).toBe(true)
    expect(singlePolicy.requireStaffPinAuth).toBe(false)

    const entPolicy = getOperationScalePolicy('enterprise')
    expect(entPolicy.enableMultiStationKds).toBe(true)
    expect(entPolicy.requireStaffPinAuth).toBe(true)
  })

  it('persists store settings via REST API transport client', async () => {
    const result = await saveStoreSettings({ test: true })
    expect(result.success).toBe(true)
    expect(result.updated_at).toBeDefined()
  })

  it('validates 1-Click Persona Kafe BSD preset structure and cluster mapping', async () => {
    const { PERSONA_KAFE_BSD, PERSONA_ROASTERY } = await import('../hooks/useOnboarding')
    expect(PERSONA_KAFE_BSD.cluster).toBe('CLUSTER_FNB')
    expect(PERSONA_KAFE_BSD.capacityScale).toBe('20 Meja (👥 3/4)')
    expect(PERSONA_KAFE_BSD.country).toBe('ID')
    expect(PERSONA_KAFE_BSD.currency).toBe('IDR')

    expect(PERSONA_ROASTERY.cluster).toBe('CLUSTER_ROASTERY')
    expect(PERSONA_ROASTERY.capacityScale).toBe('20kg Batch Oven')
  })
})

describe('Team Membership & RBAC Access Control Evaluator', () => {
  it('evaluates full administrative surface access for Owner role', () => {
    const access = evaluateAccessControl('owner')
    expect(access.canAccessSettings).toBe(true)
    expect(access.canAccessPos).toBe(true)
    expect(access.canAccessKds).toBe(true)
    expect(access.canAccessShiftReconcile).toBe(true)
  })

  it('evaluates restricted cashier access (POS & Shift Reconcile allowed, Settings & KDS blocked)', () => {
    const access = evaluateAccessControl('cashier')
    expect(access.canAccessSettings).toBe(false)
    expect(access.canAccessPos).toBe(true)
    expect(access.canAccessKds).toBe(false)
    expect(access.canAccessShiftReconcile).toBe(true)
  })

  it('evaluates kitchen KDS access for Barista & Chef (KDS allowed, POS & Settings blocked)', () => {
    const baristaAccess = evaluateAccessControl('barista')
    expect(baristaAccess.canAccessSettings).toBe(false)
    expect(baristaAccess.canAccessPos).toBe(false)
    expect(baristaAccess.canAccessKds).toBe(true)
    expect(baristaAccess.canAccessShiftReconcile).toBe(false)

    const chefAccess = evaluateAccessControl('chef')
    expect(chefAccess.canAccessSettings).toBe(false)
    expect(chefAccess.canAccessPos).toBe(false)
    expect(chefAccess.canAccessKds).toBe(true)
    expect(chefAccess.canAccessShiftReconcile).toBe(false)
  })

  it('evaluates floor waiter access (POS ordering allowed, Settings & KDS blocked)', () => {
    const access = evaluateAccessControl('waiter')
    expect(access.canAccessSettings).toBe(false)
    expect(access.canAccessPos).toBe(true)
    expect(access.canAccessKds).toBe(false)
    expect(access.canAccessShiftReconcile).toBe(false)
  })

  it('evaluates checker QC access (KDS audit allowed, Settings & POS blocked)', () => {
    const access = evaluateAccessControl('checker_qc')
    expect(access.canAccessSettings).toBe(false)
    expect(access.canAccessPos).toBe(false)
    expect(access.canAccessKds).toBe(true)
    expect(access.canAccessShiftReconcile).toBe(false)
  })

  it('fetches team roster and handles invitations & PIN accept via REST client', async () => {
    const roster = await fetchTeamRoster()
    expect(roster.length).toBeGreaterThan(0)
    expect(roster[0].pinCode).toBe('123456')

    const newStaff = await sendStaffInvitation({
      name: 'Dewi Lestari',
      contact: 'dewi@artisancafe.id',
      role: 'barista',
    })
    expect(newStaff.name).toBe('Dewi Lestari')
    expect(newStaff.role).toBe('barista')
    expect(newStaff.pinCode).toHaveLength(6)

    const acceptRes = await acceptStaffPin('654321')
    expect(acceptRes.success).toBe(true)

    const revokeRes = await revokeStaffAccess('MEM-003')
    expect(revokeRes.success).toBe(true)
  })
})
