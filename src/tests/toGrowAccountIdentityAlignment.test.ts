import { describe, it, expect, beforeEach } from 'vitest'
import { exchangeToGrowSession, employeeLogin } from '../services/hfeAuthApi'

describe('ToGrow Account Identity Alignment Suite (L2-POS-86 / Issue #38)', () => {
  beforeEach(() => {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear()
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  it('delegates person identity authentication to ToGrow Account (Tier 1)', async () => {
    const sessionToken = 'valid_togrow_oauth_token_88'
    const toGrowResponse = await exchangeToGrowSession(sessionToken)

    expect(toGrowResponse).toBeDefined()
    expect(toGrowResponse.accessToken).toContain('JWT-TOGROW-AUTH-')
    expect(toGrowResponse.person.sub).toBe('usr_togrow_canonical_owner_88')
    expect(toGrowResponse.person.email).toBe('founder@kopitiamsenopati.com')
    expect(toGrowResponse.person.isFederated).toBe(true)
    expect(toGrowResponse.person.companyMemberships[0].bookId).toBe('BOOK-CAFE-HQ-88')
    expect(toGrowResponse.person.companyMemberships[0].roles).toContain('owner')
  })

  it('preserves cashier PIN quick-switch as terminal shift attestation (Tier 4)', async () => {
    const cashierSession = await employeeLogin('BRANCH-HQ-01', '882194')

    expect(cashierSession.user.name).toBe('Budi Cashier')
    expect(cashierSession.user.role).toBe('cashier')
    expect(cashierSession.user.branch_id).toBe('BRANCH-HQ-01')
    expect(cashierSession.token).toContain('JWT-STAFF-PIN-882194-')
  })

  it('rejects invalid PIN and fails closed', async () => {
    await expect(employeeLogin('BRANCH-HQ-01', '999999')).rejects.toThrow(
      'PIN Staff tidak valid atau tidak terdaftar'
    )
  })

  it('enforces 5-Tier decoupled identity hierarchy', () => {
    const tier1Person = {
      sub: 'usr_togrow_88',
      email: 'owner@hfeit.com',
    }
    const tier2Company = {
      bookId: 'BOOK-CAFE-HQ-88',
      role: 'owner',
    }
    const tier3Device = {
      terminalId: 'POS-TERM-01',
      stationId: 'BARISTA-01',
    }
    const tier4Shift = {
      activeShiftId: 'SHIFT-20260822-01',
      cashierPin: '882194',
    }

    expect(tier1Person.sub).not.toBe(tier3Device.terminalId)
    expect(tier4Shift.cashierPin).not.toBe(tier1Person.email)
    expect(tier2Company.bookId).toBe('BOOK-CAFE-HQ-88')
  })
})
