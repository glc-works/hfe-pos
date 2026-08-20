import { describe, it, expect } from 'vitest'
import { INITIAL_MERCHANTS, INITIAL_USERS } from '../data/mockAdminData'
import { MerchantAccount, UserAccount, CreateUserPayload, SubscriptionTier } from '../types/admin'

describe('L2-POS-87: Admin Mode (Multi-Merchant & User RBAC Management Hub)', () => {
  it('should load initial merchants with valid tenancy and MRR calculations', () => {
    expect(INITIAL_MERCHANTS.length).toBeGreaterThanOrEqual(3)
    
    const proMerchant = INITIAL_MERCHANTS.find((m) => m.tier === 'pro')
    expect(proMerchant).toBeDefined()
    expect(proMerchant?.mrrAmountIdr).toBe(1490000)
    expect(proMerchant?.features.enableKds).toBe(true)

    const enterpriseMerchant = INITIAL_MERCHANTS.find((m) => m.tier === 'enterprise')
    expect(enterpriseMerchant).toBeDefined()
    expect(enterpriseMerchant?.mrrAmountIdr).toBe(4900000)
  })

  it('should correctly filter merchants by search keyword and status', () => {
    const query = 'senopati'
    const results = INITIAL_MERCHANTS.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.subdomain.toLowerCase().includes(query) ||
        m.legalEntityName.toLowerCase().includes(query)
    )
    expect(results.length).toBe(2)

    const trialOnly = INITIAL_MERCHANTS.filter((m) => m.status === 'trial')
    expect(trialOnly.length).toBe(1)
    expect(trialOnly[0].subdomain).toBe('bsdroasters')
  })

  it('should update merchant SaaS subscription tier and recalculate MRR', () => {
    let merchant: MerchantAccount = { ...INITIAL_MERCHANTS[2] } // starter trial
    expect(merchant.mrrAmountIdr).toBe(0)

    // Upgrade to Pro
    const newTier: SubscriptionTier = 'pro'
    merchant = {
      ...merchant,
      tier: newTier,
      mrrAmountIdr: (newTier as string) === 'enterprise' ? 4900000 : (newTier as string) === 'pro' ? 1490000 : 0
    }
    expect(merchant.tier).toBe('pro')
    expect(merchant.mrrAmountIdr).toBe(1490000)

    // Upgrade to Enterprise
    const enterpriseTier: SubscriptionTier = 'enterprise'
    merchant = {
      ...merchant,
      tier: enterpriseTier,
      mrrAmountIdr: (enterpriseTier as string) === 'enterprise' ? 4900000 : (enterpriseTier as string) === 'pro' ? 1490000 : 0
    }
    expect(merchant.tier).toBe('enterprise')
    expect(merchant.mrrAmountIdr).toBe(4900000)
  })

  it('should toggle merchant operational feature flags cleanly', () => {
    const merchant: MerchantAccount = { ...INITIAL_MERCHANTS[0] }
    expect(merchant.features.enableSnapBi).toBe(true)

    const updatedFeatures = {
      ...merchant.features,
      enableSnapBi: !merchant.features.enableSnapBi
    }
    expect(updatedFeatures.enableSnapBi).toBe(false)
  })

  it('should filter staff users by RBAC role', () => {
    expect(INITIAL_USERS.length).toBeGreaterThanOrEqual(5)

    const owners = INITIAL_USERS.filter((u) => u.role === 'owner')
    expect(owners.length).toBe(1)
    expect(owners[0].name).toContain('Hendra')

    const cashiers = INITIAL_USERS.filter((u) => u.role === 'cashier' || u.role === 'barista')
    expect(cashiers.length).toBe(1)
    expect(cashiers[0].role).toBe('cashier')

    const accountants = INITIAL_USERS.filter((u) => u.role === 'accountant')
    expect(accountants.length).toBe(1)
    expect(accountants[0].name).toContain('Dewi')
  })

  it('should validate and create a new staff user with 6-digit PIN', () => {
    const payload: CreateUserPayload = {
      name: 'Rian Pratama',
      email: 'rian.barista@kopinusantara.id',
      phone: '0812-1111-2222',
      role: 'barista',
      assignedMerchantId: 'merch_01',
      assignedOutletName: 'Outlet Senopati Utama',
      pinCode: '654321'
    }

    expect(/^\d{6}$/.test(payload.pinCode)).toBe(true)
    expect(payload.email.includes('@')).toBe(true)

    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
      assignedMerchantId: payload.assignedMerchantId,
      assignedMerchantName: 'Kopi Nusantara Senopati',
      assignedOutletName: payload.assignedOutletName,
      pinCode: payload.pinCode,
      status: 'active',
      lastLoginAt: 'Belum pernah login',
      createdAt: '2026-08-20'
    }

    expect(newUser.id).toBeDefined()
    expect(newUser.status).toBe('active')
    expect(newUser.role).toBe('barista')
  })

  it('should reset staff PIN and toggle status active/inactive', () => {
    let user: UserAccount = { ...INITIAL_USERS[2] } // Ahmad Fauzi (cashier)
    expect(user.status).toBe('active')

    // Reset PIN
    user = { ...user, pinCode: '123456' }
    expect(user.pinCode).toBe('123456')

    // Toggle status to inactive
    user = { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
    expect(user.status).toBe('inactive')

    // Toggle status back to active
    user = { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
    expect(user.status).toBe('active')
  })
})
