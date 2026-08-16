import { describe, it, expect } from 'vitest'
import { generateUUIDv4, submitTransaction, SubmitTransactionPayload } from '../services/hfeApi'

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

describe('Idempotency Key & Header Protocol Engine', () => {
  it('generates valid RFC 4122 UUID v4 strings', () => {
    const key = generateUUIDv4()
    expect(key).toMatch(UUID_V4_REGEX)
  })

  it('guarantees uniqueness across 1,000 consecutive key generations', () => {
    const keySet = new Set<string>()
    const count = 1000

    for (let i = 0; i < count; i++) {
      const key = generateUUIDv4()
      expect(key).toMatch(UUID_V4_REGEX)
      keySet.add(key)
    }

    expect(keySet.size).toBe(count)
  })

  it('automatically attaches a valid UUID v4 idempotency key when submitting transactions', async () => {
    const payload: SubmitTransactionPayload = {
      table_id: 'MEJA-04',
      contact_id: 'CUST-081298765432',
      policy: 'pay-first',
      items: [
        {
          product_id: 'PRD-01',
          hfe_gl_account: '4010-Beverage Sales',
          qty: 2,
          price: 28000,
        },
      ],
      subtotal: 56000,
      tax_pb1_amount: 5600,
      service_fee_amount: 2800,
      discount_amount: 0,
      grand_total: 64400,
    }

    const response = await submitTransaction(payload)
    expect(response.idempotency_key).toBeDefined()
    expect(response.idempotency_key).toMatch(UUID_V4_REGEX)
  })

  it('preserves user-provided idempotency key for transaction retries', async () => {
    const customKey = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
    const payload: SubmitTransactionPayload = {
      table_id: 'MEJA-04',
      contact_id: 'CUST-081298765432',
      policy: 'pay-first',
      items: [],
      subtotal: 50000,
      tax_pb1_amount: 5000,
      service_fee_amount: 2500,
      discount_amount: 0,
      grand_total: 57500,
      idempotency_key: customKey,
    }

    const response = await submitTransaction(payload)
    expect(response.idempotency_key).toBe(customKey)
  })
})
