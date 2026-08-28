import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { CafeCheckoutAttemptCoordinator, type CheckoutAttemptRecord, type CheckoutAttemptStore } from '../services/financial/CafeCheckoutAttemptCoordinator'
import { OfflineIntentQueue } from '../services/financial/OfflineIntentQueue'
import type { SubmitRetailTransactionPayload } from '../services/financial/HfePosFinancialPort'
import {
  appendDeadLetterEntry,
  listDeadLetterEntries,
  removeDeadLetterEntry,
  buildDeadLetterCsv,
} from '../services/financial/deadLetterLedger'

function fakeStore(): CheckoutAttemptStore & { history: CheckoutAttemptRecord[] } {
  const map = new Map<string, CheckoutAttemptRecord>()
  const history: CheckoutAttemptRecord[] = []
  return {
    history,
    async get(k) { return map.get(k) ?? null },
    async createIfAbsent(r) {
      const existing = map.get(r.checkoutKey)
      if (existing) return existing
      map.set(r.checkoutKey, { ...r }); history.push({ ...r }); return r
    },
    async put(r) { map.set(r.checkoutKey, { ...r }); history.push({ ...r }) },
    async remove(k) { map.delete(k) },
  }
}

const basePayload: SubmitRetailTransactionPayload = {
  table_id: 'TBL-04',
  contact_id: '',
  policy: 'pay-first',
  payment_method: 'cash',
  items: [{ product_id: 'PRD-01', hfe_gl_account: '4010', qty: 2, price: 25000 }],
  subtotal: 50000,
  tax_pb1_amount: 0,
  service_fee_amount: 0,
  discount_amount: 0,
  grand_total: 50000,
  cashier_id: 'cashier-1',
}

const postedResponse = (idem: string) => ({
  tx_id: `TX-${idem}`,
  status: 'posted' as const,
  created_at: new Date().toISOString(),
  grand_total: basePayload.grand_total,
  idempotency_key: idem,
  posting_id: `POSTING-${idem}`,
})

describe('Fase 2 #61 — offline chaos requalification (adversarial)', () => {
  let calls: { post: number; reconcile: number }

  beforeEach(() => {
    calls = { post: 0, reconcile: 0 }
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('persists the durable unknown-outcome marker BEFORE any network call', async () => {
    const store = fakeStore()
    const coord = new CafeCheckoutAttemptCoordinator(store)
    await coord.execute({
      checkoutKey: 'k1', bookId: 'b1', payload: basePayload,
      post: async () => { throw new Error('ECONNRESET mid-flight') },
    })
    // status transitions persisted: prepared -> outcome_unknown (marker precedes network I/O),
    // then the forensic write carrying lastError — three durable beats total.
    expect(store.history.map((h) => h.status)).toEqual(['prepared', 'outcome_unknown', 'outcome_unknown'])
    expect(store.history[0].lastError).toBeUndefined()
    expect(store.history.at(-1)!.lastError).toMatch(/ECONNRESET/)
  })

  it('kill-after-submit reconciles with the SAME idempotency key and never re-posts (#19 zero double-posting)', async () => {
    const store = fakeStore()
    const coord = new CafeCheckoutAttemptCoordinator(store)

    const first = await coord.execute({
      checkoutKey: 'k2', bookId: 'b1', payload: basePayload,
      post: async () => { calls.post += 1; throw new Error('network died after CORE applied') },
    })
    expect(first.kind).toBe('outcome_unknown')

    const existingAttempt = store.history.at(-1)!
    const second = await coord.execute({
      checkoutKey: 'k2', bookId: 'b1', payload: basePayload,
      post: () => { calls.post += 100; return Promise.reject(new Error('must never run again')) },
      reconcile: async (_p, attempt) => {
        calls.reconcile += 1
        expect(attempt.idempotencyKey).toBe(existingAttempt.idempotencyKey)
        return postedResponse(attempt.idempotencyKey)
      },
      resumeExisting: true,
    })

    expect(second).toMatchObject({ kind: 'posted' })
    expect(calls.post).toBe(1)          // exactly one original submission
    expect(calls.reconcile).toBe(1)     // exactly one reconciliation
    expect(calls.post % 100).toBe(1)    // the poisoned branch never executed
    await coord.acknowledgePosted('k2')
    expect(await store.get('k2')).toBeNull()
  })

  it('concurrent execute on one checkout key is coalesced (already_in_progress)', async () => {
    const store = fakeStore()
    const coord = new CafeCheckoutAttemptCoordinator(store)
    let release!: () => void
    const gate = new Promise<void>((r) => { release = r })

    const p1 = coord.execute({
      checkoutKey: 'k3', bookId: 'b1', payload: basePayload,
      post: async () => { await gate; return postedResponse('x') },
    })
    const p2 = await coord.execute({
      checkoutKey: 'k3', bookId: 'b1', payload: basePayload,
      post: async () => { calls.post += 1; return postedResponse('y') },
    })
    expect(p2.kind).toBe('already_in_progress')
    release()

    await expect(p1).resolves.toMatchObject({ kind: 'posted' })
    expect(calls.post).toBe(0)
  })

  it('payload drift under an unresolved attempt fails closed for manager resolution', async () => {
    const store = fakeStore()
    const coord = new CafeCheckoutAttemptCoordinator(store)
    await coord.execute({
      checkoutKey: 'k4', bookId: 'b1', payload: basePayload,
      post: async () => { throw new Error('boom') },
    })
    await expect(coord.execute({
      checkoutKey: 'k4', bookId: 'b1',
      payload: { ...basePayload, grand_total: 999_999 },
      post: async () => postedResponse('z'),
    })).rejects.toThrow(/Manager resolution is required/)
  })

  it('intent queue dedupes by idempotency keyPath (re-enqueue collapses to one record)', async () => {
    const queue = new OfflineIntentQueue()
    const payload = { ...basePayload, idempotency_key: 'IDEM-777' }
    const a = await queue.enqueueIntent(payload, 'book-1')
    const b = await queue.enqueueIntent(payload, 'book-1')
    expect(a.idempotencyKey).toBe(b.idempotencyKey)
    expect(await queue.getPendingIntents()).toHaveLength(1)
  })

  it('broken IndexedDB is LOUD on identity writes and refuses silent RAM fallback', async () => {
    vi.stubGlobal('indexedDB', { open: () => { throw new Error('QuotaExceededError') } })
    const queue = new OfflineIntentQueue()
    await expect(queue.put({
      checkoutKey: 'k5', bookId: 'b1', idempotencyKey: 'i5',
      payloadFingerprint: 'f', payload: basePayload,
      status: 'prepared', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    } satisfies CheckoutAttemptRecord)).rejects.toThrow(/Failed to persist checkout identity/)
  })

  describe('dead-letter ledger & emergency export (Rule 19 escape hatch)', () => {
    it('append → list → remove lifecycle works in memory-fallback mode', async () => {
      await appendDeadLetterEntry({ kind: 'outcome_unknown', detail: 'network died after CORE applied', bookId: 'b1', checkoutKey: 'k9' })
      await appendDeadLetterEntry({ kind: 'quota_failure', detail: 'QuotaExceededError' })
      const all = await listDeadLetterEntries()
      expect(all.map((e) => e.kind)).toEqual(['outcome_unknown', 'quota_failure'])

      await removeDeadLetterEntry(all[0].id)
      const after = await listDeadLetterEntries()
      expect(after).toHaveLength(1)
      expect(after[0].kind).toBe('quota_failure')
    })

    it('CSV builder neutralises formula injection and quotes hostile payloads', () => {
      const csv = buildDeadLetterCsv([
        { id: 'a1', kind: 'duplicate_suspect', occurredAt: '2026-08-27T00:00:00Z',
          bookId: 'b,1', checkoutKey: '=CMD("evil")', detail: 'line1\nline2 "quoted"' } as never,
      ])
      expect(csv.split('\n')[0]).toBe('id,kind,occurredAt,bookId,checkoutKey,postingId,idempotencyKey,detail')
      // RFC-4180 quoting keeps the newline inside one logical field...
      expect(csv).toContain('"line1\nline2 ""quoted"""')
      // ...formula injection is neutralised with a leading apostrophe...
      expect(csv).toContain(`"'=CMD(""evil"")"`)
      // ...and commas stay inside the quoted cell.
      expect(csv).toContain('"b,1"')
    })

    it('JSON export roundtrip preserves forensic fields', async () => {
      const before = await listDeadLetterEntries()
      await appendDeadLetterEntry({ kind: 'operator_action_required', detail: 'posted_unacknowledged', postingId: 'P-1', idempotencyKey: 'i-1' })
      const after = await listDeadLetterEntries()
      expect(after.length).toBe(before.length + 1)
      const jsonShape = JSON.parse(JSON.stringify(after))
      expect(jsonShape.at(-1)).toMatchObject({ kind: 'operator_action_required', postingId: 'P-1', idempotencyKey: 'i-1' })
    })
  })
})
