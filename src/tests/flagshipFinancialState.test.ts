import { describe, expect, it } from 'vitest'

import {
  createPendingFinancialState,
  verifyPostingReadBack,
} from '../services/financial/flagshipFinancialState'

describe('flagship financial state', () => {
  it('keeps a paid order pending until canonical posting read-back matches its source', () => {
    const pending = createPendingFinancialState('ORDER-001', 'IDEMP-001')

    expect(pending.status).toBe('pending')
    expect(pending.displayLabel).toBe('Pending verification')

    const mismatched = verifyPostingReadBack(pending, {
      postingId: 'POST-001',
      sourceObjectId: 'ORDER-OTHER',
      stableEffectKey: 'IDEMP-001',
      stateRevision: '7',
    })

    expect(mismatched.status).toBe('failed')
    expect(mismatched.displayLabel).not.toContain('Posted')
  })

  it('allows Posted only after posting identity, source, and stable effect match', () => {
    const pending = createPendingFinancialState('ORDER-001', 'IDEMP-001')
    const verified = verifyPostingReadBack(pending, {
      postingId: 'POST-001',
      sourceObjectId: 'ORDER-001',
      stableEffectKey: 'IDEMP-001',
      stateRevision: '7',
    })

    expect(verified.status).toBe('posted')
    expect(verified.displayLabel).toBe('Posted to CORE')
    expect(verified.postingId).toBe('POST-001')
    expect(verified.postingStateRevision).toBe('7')
  })

  it('rejects read-back evidence without a canonical posting identity', () => {
    const pending = createPendingFinancialState('ORDER-001', 'IDEMP-001')
    const unbound = verifyPostingReadBack(pending, {
      postingId: '',
      sourceObjectId: 'ORDER-001',
      stableEffectKey: 'IDEMP-001',
      stateRevision: '7',
    })

    expect(unbound.status).toBe('failed')
    expect(unbound.displayLabel).not.toContain('Posted')
  })

  it('does not verify a posting without its optimistic concurrency revision', () => {
    const pending = createPendingFinancialState('ORDER-001', 'IDEMP-001')
    const unversioned = verifyPostingReadBack(pending, {
      postingId: 'POST-001',
      sourceObjectId: 'ORDER-001',
      stableEffectKey: 'IDEMP-001',
    } as any)

    expect(unversioned.status).toBe('failed')
  })
})
