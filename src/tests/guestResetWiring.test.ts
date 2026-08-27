import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const REPO_ROOT = join(__dirname, '..', '..')
const read = (rel: string) => readFileSync(join(REPO_ROOT, rel), 'utf8')

describe('Canonical guest-session reset wiring (dead-code tripwire)', () => {
  it('reset handler must stay wired across App → MobileView → CheckoutView', () => {
    const app = read('src/App.tsx')
    expect(app).toMatch(/const resetCanonicalGuestSession = \(/)
    expect(app).toContain('onResetGuestSession={resetCanonicalGuestSession}')

    const mobileView = read('src/views/CustomerMobileView.tsx')
    expect(mobileView).toContain('onResetGuestSession?: () => void')
    expect(mobileView).toContain('onResetGuestSession={onResetGuestSession}')

    const checkout = read('src/components/customer/CustomerCheckoutView.tsx')
    expect(checkout).toContain('onResetGuestSession?: () => void')
    expect(checkout).toContain('onClick={onResetGuestSession}')
  })

  it('membership banner strings are i18n-bound, not hardcoded JSX literals', () => {
    const banner = read('src/components/customer/ValueLedMembershipBanner.tsx')
    expect(banner).toContain('t.customer.membershipJoinIdle')
    expect(banner).not.toMatch(/Gabung Member: Hemat/)
    expect(banner).not.toContain("'Simpan'")
    expect(banner).not.toContain("'Batal'")
  })
})
