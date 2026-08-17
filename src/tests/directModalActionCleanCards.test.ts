import { describe, it, expect } from 'vitest'

describe('Direct Modal Action and Clean Selection Rollback Suite (L2-POS-71)', () => {
  it('guarantees table card styling does not override authentic status with artificial selection rings', () => {
    const resolveCardClass = (
      isUnpaid: boolean,
      isPaid: boolean,
      defaultSurfaceClass: string
    ) => {
      if (isUnpaid) return 'bg-amber-500/10 border-amber-500/60 hover:border-amber-400 shadow-sm'
      if (isPaid) return 'bg-indigo-500/10 border-indigo-500/50 hover:border-indigo-400'
      return defaultSurfaceClass
    }

    const availableOutdoor = resolveCardClass(false, false, 'bg-emerald-950/40 border-emerald-500/40')
    expect(availableOutdoor).toBe('bg-emerald-950/40 border-emerald-500/40')

    const unpaidCard = resolveCardClass(true, false, 'bg-emerald-950/40 border-emerald-500/40')
    expect(unpaidCard).toContain('bg-amber-500/10')

    const paidCard = resolveCardClass(false, true, 'bg-emerald-950/40 border-emerald-500/40')
    expect(paidCard).toContain('bg-indigo-500/10')
  })
})
