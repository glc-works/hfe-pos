import { afterEach, expect, it, vi } from 'vitest'
import { readLegacyPosSession } from '../services/auth/personSessionStorage'

afterEach(() => vi.unstubAllEnvs())

it('ignores persisted staff/profile/bearer authority in connected mode', () => {
  vi.stubEnv('VITE_HFE_RUNTIME_MODE', 'connected')
  const storage = { getItem: () => '{"role":"owner","token":"old-token"}', removeItem: vi.fn() }
  expect(readLegacyPosSession('hfe_pos_auth_user', storage, storage)).toBeNull()
})

it('retains the local synthetic cashier session behavior', () => {
  vi.stubEnv('VITE_HFE_RUNTIME_MODE', '')
  const session = { getItem: () => 'local-cashier', removeItem: vi.fn() }
  expect(readLegacyPosSession('hfe_pos_auth_user', session, session)).toBe('local-cashier')
})
