import { afterEach, describe, expect, it, vi } from 'vitest'
import { exchangeToGrowSession, ownerLogin, ownerRegister, renewFirstPartyAuth } from '../services/hfeAuthApi'
import { parseFirstPartyIdentitySession, renewalDelayMs } from '../hooks/usePosAuth'
import { createInitialHfeCompanyProfile } from '../hooks/useHfeSync'
import { resolveConfiguredCashierSessionId } from '../hooks/useCafeSettlement'
import { createRuntimeProductCatalog } from '../data/mockData'
import { createRuntimeInitialOrders, createRuntimeInitialTables } from '../data/runtimeDemoData'
import { resolveInitialPb1TaxMode } from '../config/firstPartyRuntime'
import {
  connectedRuntimeConfigurationError,
  firstPartyAuthEntryPolicy,
  resolveGovernedQuoteContext,
} from '../config/firstPartyRuntime'

const DEMO_AUTHORITY_CONTEXT_ID = ['10e50fd1', '71af', '4636', '8223', '7f46f06d6648'].join('-')

const SESSION_RESPONSE = {
  access_token: 'opaque-session-token',
  refresh_token: 'opaque-refresh-token',
  token_type: 'Bearer',
  expires_at: '2026-08-25T02:00:00Z',
  refresh_expires_at: '2026-09-01T02:00:00Z',
  session_id: 'session-demo-1',
  user: {
    id: 'person-demo-1',
    email: 'flagship.cafe@demo.hfeit.test',
    display_name: 'Flagship Cafe Demo',
    status: 'ACTIVE',
    email_verified: true,
    created_at: '2026-08-25T00:00:00Z',
    updated_at: '2026-08-25T00:00:00Z',
  },
}

function configureFlagshipRuntime() {
  vi.stubEnv('VITE_TOGROW_URL', 'https://identity.example.test')
  vi.stubEnv('VITE_HFE_RUNTIME_MODE', 'connected')
  vi.stubEnv('VITE_HFE_COMPANY_BOOK_URL', 'https://prv-books.hfeit.com')
  vi.stubEnv('VITE_TOGROW_ORGANIZATION_ID', '01a035df-b618-7612-aef2-6e332bfcdec5')
  vi.stubEnv('VITE_TOGROW_CLIENT_ID', 'client-demo-1')
  vi.stubEnv('VITE_HFE_BOOK_ID', '7ea35a48-4012-556d-bd71-3203795b40dc')
  vi.stubEnv('VITE_HFE_AUTHORITY_CONTEXT_ID', DEMO_AUTHORITY_CONTEXT_ID)
  vi.stubEnv('VITE_HFE_BRANCH_ID', 'branch-demo-1')
  vi.stubEnv('VITE_HFE_OUTLET_ID', 'outlet-demo-1')
  vi.stubEnv('VITE_HFE_TERMINAL_ID', 'terminal-demo-4')
  vi.stubEnv('VITE_HFE_CURRENCY', 'IDR')
  vi.stubEnv('VITE_HFE_CASHIER_SESSION_ID', 'd187e5f3-9aa9-40ff-88a6-011f1885c452')
  vi.stubEnv('VITE_HFE_FLAGSHIP_PRODUCT_ID', 'e0da2016-b6b1-44cc-a672-f08dd0bd0c27')
}

describe('first-party ToGrow to Hfe CORE identity bridge', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('requires ToGrow owner activation before any connected staff PIN flow exists', () => {
    vi.stubEnv('VITE_HFE_RUNTIME_MODE', 'connected')
    expect(firstPartyAuthEntryPolicy()).toEqual({
      initialTab: 'owner-login',
      allowSyntheticStaffPin: false,
      allowLocalRegistration: false,
    })

    vi.stubEnv('VITE_HFE_RUNTIME_MODE', '')
    expect(firstPartyAuthEntryPolicy()).toEqual({
      initialTab: 'pin',
      allowSyntheticStaffPin: true,
      allowLocalRegistration: true,
    })
  })

  it('exchanges the opaque ToGrow session for the organization-scoped HCB JWT', async () => {
    configureFlagshipRuntime()
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(Response.json(SESSION_RESPONSE))
      .mockResolvedValueOnce(Response.json({
        access_token: 'signed-hcb-jwt',
        token_type: 'Bearer',
        expires_in: 900,
      }))

    const result = await ownerLogin(
      'flagship.cafe@demo.hfeit.test',
      'synthetic-password',
    )

    expect(fetchSpy).toHaveBeenNthCalledWith(1, 'https://identity.example.test/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'flagship.cafe@demo.hfeit.test',
        password: 'synthetic-password',
      }),
    })
    expect(fetchSpy).toHaveBeenNthCalledWith(2, 'https://identity.example.test/v1/auth/hcb-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer opaque-session-token',
      },
      body: JSON.stringify({
        organization_id: '01a035df-b618-7612-aef2-6e332bfcdec5',
        client_id: 'client-demo-1',
      }),
    })
    expect(result).toEqual({
      token: 'signed-hcb-jwt',
      user: {
        user_id: 'person-demo-1',
        name: 'Flagship Cafe Demo',
        role: 'owner',
        branch_id: 'branch-demo-1',
        token: 'signed-hcb-jwt',
        authority_context_id: DEMO_AUTHORITY_CONTEXT_ID,
      },
      firstPartySession: {
        accessToken: 'opaque-session-token',
        refreshToken: 'opaque-refresh-token',
        accessExpiresAt: '2026-08-25T02:00:00Z',
        refreshExpiresAt: '2026-09-01T02:00:00Z',
        hcbExpiresAt: expect.any(Number),
      },
    })
  })

  it('renews an HCB JWT from the retained opaque session without credentials', async () => {
    configureFlagshipRuntime()
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(Response.json({
      access_token: 'renewed-hcb-jwt',
      token_type: 'Bearer',
      expires_in: 900,
    }))

    const result = await renewFirstPartyAuth({
      accessToken: 'opaque-session-token',
      refreshToken: 'opaque-refresh-token',
      accessExpiresAt: new Date(Date.now() + 60_000).toISOString(),
      refreshExpiresAt: new Date(Date.now() + 86_400_000).toISOString(),
      hcbExpiresAt: Date.now() - 1,
    })

    expect(fetchSpy).toHaveBeenCalledWith('https://identity.example.test/v1/auth/hcb-token', expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Bearer opaque-session-token' }),
    }))
    expect(result.token).toBe('renewed-hcb-jwt')
  })

  it('rotates an expired opaque session before minting a new HCB JWT', async () => {
    configureFlagshipRuntime()
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(Response.json({
        ...SESSION_RESPONSE,
        access_token: 'rotated-session-token',
        refresh_token: 'rotated-refresh-token',
        expires_at: new Date(Date.now() + 86_400_000).toISOString(),
      }))
      .mockResolvedValueOnce(Response.json({ access_token: 'renewed-hcb-jwt', expires_in: 900 }))

    await renewFirstPartyAuth({
      accessToken: 'expired-session-token',
      refreshToken: 'opaque-refresh-token',
      accessExpiresAt: new Date(Date.now() - 1).toISOString(),
      refreshExpiresAt: new Date(Date.now() + 86_400_000).toISOString(),
      hcbExpiresAt: Date.now() - 1,
    })

    expect(fetchSpy).toHaveBeenNthCalledWith(1, 'https://identity.example.test/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: 'opaque-refresh-token' }),
    })
    expect(fetchSpy).toHaveBeenNthCalledWith(2, 'https://identity.example.test/v1/auth/hcb-token', expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Bearer rotated-session-token' }),
    }))
  })

  it('fails closed when the HCB JWT exchange is refused', async () => {
    configureFlagshipRuntime()
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(Response.json(SESSION_RESPONSE))
      .mockResolvedValueOnce(new Response(null, { status: 403 }))

    await expect(ownerLogin(
      'flagship.cafe@demo.hfeit.test',
      'synthetic-password',
    )).rejects.toThrow('HCB token exchange failed with status 403')
  })

  it('does not fabricate registration or legacy exchange outside explicit local demo mode', async () => {
    vi.stubEnv('VITE_ENABLE_LOCAL_DEMO', 'false')
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('identity unavailable'))

    await expect(ownerRegister('Flagship Cafe', 'owner@example.test', 'not-a-real-secret', 'https://identity.example.test'))
      .rejects.toThrow('identity unavailable')
    await expect(exchangeToGrowSession('opaque-session', 'https://identity.example.test'))
      .rejects.toThrow('identity unavailable')
  })

  it('restores only a complete first-party identity session and schedules renewal before expiry', () => {
    const session = {
      accessToken: 'opaque-session-token',
      refreshToken: 'opaque-refresh-token',
      accessExpiresAt: '2026-08-25T03:00:00Z',
      refreshExpiresAt: '2026-09-01T03:00:00Z',
      hcbExpiresAt: 1_000_000,
    }

    expect(parseFirstPartyIdentitySession(JSON.stringify(session))).toEqual(session)
    expect(parseFirstPartyIdentitySession('{"accessToken":"partial"}')).toBeNull()
    expect(renewalDelayMs(session, 100_000)).toBe(840_000)
    expect(renewalDelayMs({ ...session, hcbExpiresAt: 100_000 }, 100_000)).toBe(0)
  })

  it('uses the provisioned Company Book instead of the illustrative catalog default', () => {
    configureFlagshipRuntime()

    expect(createInitialHfeCompanyProfile().companyBookId).toBe('7ea35a48-4012-556d-bd71-3203795b40dc')
  })

  it('uses the provisioned open cashier session for CORE posting', () => {
    configureFlagshipRuntime()

    expect(resolveConfiguredCashierSessionId('walk-in-dine-in')).toBe('d187e5f3-9aa9-40ff-88a6-011f1885c452')
  })

  it('uses the provisioned outlet, terminal, and currency for governed quoting', () => {
    configureFlagshipRuntime()

    expect(resolveGovernedQuoteContext()).toEqual({
      outletId: 'outlet-demo-1',
      terminalId: 'terminal-demo-4',
      currency: 'IDR',
    })
  })

  it('maps the flagship menu item to its provisioned CORE product UUID', () => {
    configureFlagshipRuntime()

    const catalog = createRuntimeProductCatalog()
    expect(catalog).toHaveLength(1)
    expect(catalog[0].id).toBe('e0da2016-b6b1-44cc-a672-f08dd0bd0c27')
  })

  it('builds the connected flagship table order only from the provisioned CORE product', () => {
    configureFlagshipRuntime()

    const orders = createRuntimeInitialOrders()
    const tables = createRuntimeInitialTables(orders)
    const flagshipOrder = orders.find((order) => order.id === 'ORD-8801')
    const flagshipTable = tables.find((table) => table.name === 'OUT-04')

    expect(flagshipOrder?.items).toEqual([
      expect.objectContaining({
        id: 'e0da2016-b6b1-44cc-a672-f08dd0bd0c27',
        name: 'Espresso Aren Latte',
        price: 28000,
        quantity: 1,
      }),
    ])
    expect(flagshipOrder).toMatchObject({ table: 'OUT-04', total: 28000, totalPrice: 28000, taxPB1Amount: 0 })
    expect(flagshipTable).toMatchObject({ totalBill: 28000, orderCount: 1, orderIds: ['ORD-8801'] })
  })

  it('locks the connected cash-only flagship to the supported zero-tax policy', () => {
    configureFlagshipRuntime()

    expect(resolveInitialPb1TaxMode('1')).toBe(0)
  })

  it('fails closed before checkout when a connected UUID is missing or malformed', () => {
    configureFlagshipRuntime()
    vi.stubEnv('VITE_HFE_CASHIER_SESSION_ID', 'fixture-session')

    expect(() => resolveConfiguredCashierSessionId('walk-in-dine-in'))
      .toThrow('VITE_HFE_CASHIER_SESSION_ID must be a UUID')
  })

  it('reports an operator-facing configuration error when connected mode drifts', () => {
    vi.stubEnv('VITE_HFE_CORE_URL', '/core')

    expect(connectedRuntimeConfigurationError()).toContain('VITE_HFE_RUNTIME_MODE=connected')
  })

  it('accepts the complete connected flagship bootstrap contract', () => {
    configureFlagshipRuntime()
    vi.stubEnv('VITE_HFE_CORE_URL', '/core')

    expect(connectedRuntimeConfigurationError()).toBeNull()
  })

})
