import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { generatePayloadChecksum, verifyPayloadIntegrity } from '../utils/cryptoHasher'
import { FlushManager } from '../services/flushManager'
import { employeeLogin } from '../services/hfeApi'
import demoAccess from '../../fixtures/demo/access.json'

describe('SHA-256 Web Crypto Payload Integrity Hasher', () => {
  it('generates deterministic 64-character hex checksums for identical payloads', async () => {
    const payloadA = {
      table_id: 'MEJA-01',
      subtotal: 50000,
      items: [{ product_id: 'P01', qty: 2, price: 25000 }],
    }

    const payloadB = {
      subtotal: 50000,
      table_id: 'MEJA-01',
      items: [{ price: 25000, qty: 2, product_id: 'P01' }],
    }

    const hashA = await generatePayloadChecksum(payloadA)
    const hashB = await generatePayloadChecksum(payloadB)

    expect(hashA).toHaveLength(64)
    expect(hashB).toHaveLength(64)
    expect(hashA).toBe(hashB)
  })

  it('verifies valid payload integrity and detects tampered payloads', async () => {
    const originalPayload = {
      table_id: 'MEJA-04',
      grand_total: 85000,
      contact_id: 'CUST-081298765432',
    }

    const validChecksum = await generatePayloadChecksum(originalPayload)
    const isValid = await verifyPayloadIntegrity(originalPayload, validChecksum)
    expect(isValid).toBe(true)

    // Tampered payload (altered amount)
    const tamperedPayload = {
      table_id: 'MEJA-04',
      grand_total: 10000, // Altered!
      contact_id: 'CUST-081298765432',
    }

    const isTamperedValid = await verifyPayloadIntegrity(tamperedPayload, validChecksum)
    expect(isTamperedValid).toBe(false)
  })
})

describe('Exponential Backoff Delay Calculations', () => {
  it('calculates correct exponential backoff delays capped at 30 seconds', () => {
    expect(FlushManager.calculateBackoffDelay(0)).toBe(1000)  // 1s
    expect(FlushManager.calculateBackoffDelay(1)).toBe(2000)  // 2s
    expect(FlushManager.calculateBackoffDelay(2)).toBe(4000)  // 4s
    expect(FlushManager.calculateBackoffDelay(3)).toBe(8000)  // 8s
    expect(FlushManager.calculateBackoffDelay(4)).toBe(16000) // 16s
    expect(FlushManager.calculateBackoffDelay(5)).toBe(30000) // 32s -> max 30s
    expect(FlushManager.calculateBackoffDelay(10)).toBe(30000)// capped at 30s
  })
})

describe('Security & Rate-Limiting Guard Logic', () => {
  beforeEach(() => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('local demo has no Hfe Core'))
  })

  afterEach(() => vi.restoreAllMocks())

  class RateLimiter {
    public failedAttempts = 0
    public cooldownSeconds = 0

    async attemptLogin(pin: string) {
      if (this.cooldownSeconds > 0) {
        throw new Error(`Terlalu banyak percobaan gagal. Silakan tunggu ${this.cooldownSeconds} detik.`)
      }
      try {
        return await employeeLogin('BRANCH-HQ-01', pin)
      } catch (err) {
        this.failedAttempts++
        if (this.failedAttempts >= 5) {
          this.cooldownSeconds = 60
        }
        throw err
      }
    }
  }

  it('triggers 60-second cooldown timer after 5 consecutive failed login attempts', async () => {
    const limiter = new RateLimiter()

    expect(limiter.failedAttempts).toBe(0)
    expect(limiter.cooldownSeconds).toBe(0)

    // Simulate 4 failed attempts
    for (let i = 0; i < 4; i++) {
      await expect(limiter.attemptLogin('999999')).rejects.toThrow()
    }
    expect(limiter.failedAttempts).toBe(4)
    expect(limiter.cooldownSeconds).toBe(0)

    // 5th failed attempt -> triggers 60s cooldown
    await expect(limiter.attemptLogin('999999')).rejects.toThrow()
    expect(limiter.failedAttempts).toBe(5)
    expect(limiter.cooldownSeconds).toBe(60)

    // Attempting during cooldown blocks immediately
    await expect(limiter.attemptLogin('999998')).rejects.toThrow(
      /Terlalu banyak percobaan gagal/
    )
  })

  it('authenticates valid employee PIN successfully', async () => {
    const auth = await employeeLogin(demoAccess.branchId, demoAccess.staff.pin, demoAccess.bookId)
    expect(auth.token).toBeDefined()
    expect(auth.user.name).toBe(demoAccess.staff.name)
    expect(auth.user.role).toBe(demoAccess.staff.role)
  })
})
