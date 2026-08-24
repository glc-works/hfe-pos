import { afterEach, describe, expect, it, vi } from 'vitest'
import demoAccess from '../../fixtures/demo/access.json'
import { employeeLogin } from '../services/hfeAuthApi'

describe('canonical local demo entry contract', () => {
  afterEach(() => vi.restoreAllMocks())

  it('accepts the single documented synthetic account when Hfe Core is unavailable', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('local demo has no Hfe Core'))

    const result = await employeeLogin(
      demoAccess.branchId,
      demoAccess.staff.pin,
      demoAccess.bookId
    )

    expect(result.user).toMatchObject({
      user_id: 'USR-DEMO-BARISTA-01',
      name: 'Siti Barista',
      role: 'barista',
      branch_id: 'BRANCH-HQ-01',
    })
  })

  it('rejects undocumented legacy PINs instead of maintaining hidden demo accounts', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('local demo has no Hfe Core'))

    await expect(employeeLogin(demoAccess.branchId, '882194', demoAccess.bookId))
      .rejects.toThrow('PIN Staff tidak valid atau tidak terdaftar')
  })

  it('fails closed when a non-local Hfe Core endpoint is unavailable', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('remote Hfe Core unavailable'))

    await expect(employeeLogin(
      demoAccess.branchId,
      demoAccess.staff.pin,
      demoAccess.bookId,
      'https://core.example.test'
    )).rejects.toThrow('PIN Staff tidak valid atau tidak terdaftar')
  })

  it('preserves authoritative authentication failures without using the demo fallback', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(null, { status: 401 }))

    await expect(employeeLogin(
      demoAccess.branchId,
      demoAccess.staff.pin,
      demoAccess.bookId
    )).rejects.toThrow('Auth failed with status 401')
  })
})
