import React from 'react'
import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { LanguageProvider } from '../context/LanguageContext'
import { MerchantConfigProvider } from '../context/MerchantConfigContext'
import { PosCashTenderForm, cashValueAfterCurrencySelection } from '../components/pos/PosCashTenderForm'
import { MockHfeAdapter } from '../services/financial/MockHfeAdapter'
import type { GovernedRetailCheckoutPayload, ReviewedPosQuote } from '../services/financial/HfePosFinancialPort'
import { formatExactMinorCurrency } from '../utils/localeNumberFormat'
import { formatPostedCheckoutAmount, settleQuoteRetirement } from '../hooks/useCafeSettlement'

const quote: ReviewedPosQuote = {
  quoteId: 'QUOTE-1', revision: '1', digestSha256: 'd'.repeat(64), currency: 'IDR',
  subtotalMinor: '28000', amountDueMinor: '30800', discountTotalMinor: '0', taxTotalMinor: '2800',
  serviceChargeTotalMinor: '0', tipTotalMinor: '0', roundingTotalMinor: '0', presetId: 'PRESET-1', presetVersion: '1',
  lines: [], expiresAt: new Date(Date.now() + 60_000).toISOString(),
  tenderEligibility: [{ tenderType: 'cash', eligible: true }], intentFingerprint: 'intent', source: 'hfe-core',
}

describe('CodeRabbit checkout remediation', () => {
  it('formats exact minor-unit strings with their currency without Number coercion', () => {
    expect(formatExactMinorCurrency('9007199254740993', 'IDR', 'id')).toBe('IDR\u00a09.007.199.254.740.993')
  })

  it('keeps a posted sale posted when its display amount is malformed', () => {
    expect(formatPostedCheckoutAmount('not-money', 'IDR', 'id', () => 'fallback')).toBe('fallback')
  })

  it('settles a failed quote retirement so a later quote is not poisoned', async () => {
    const onFailure = vi.fn()
    await expect(settleQuoteRetirement(Promise.reject(new Error('retirement failed')), onFailure)).resolves.toBeUndefined()
    expect(onFailure).toHaveBeenCalledWith(expect.objectContaining({ message: 'retirement failed' }))
  })

  it('preserves entered cash when the reviewed quote currency is reselected', () => {
    expect(cashValueAfterCurrencySelection(quote, '50000', 33000, 'IDR', 'IDR')).toBe('50000')
  })

  it('renders the mobile cash input at a zoom-safe 16px font size', () => {
    const html = renderToStaticMarkup(
      <LanguageProvider><MerchantConfigProvider><PosCashTenderForm
        authoritativeQuote={quote} posCashGiven="50000" setPosCashGiven={vi.fn()} grandTotal={33000}
      /></MerchantConfigProvider></LanguageProvider>,
    )
    expect(html).toMatch(/<input[^>]*class="[^"]*text-base/)
  })

  it('binds the synthetic posted amount to the reviewed quote', async () => {
    const payload = {
      contact_id: '', policy: 'pay-first', payment_method: 'cash', outlet_id: 'OUTLET-1', terminal_id: 'TERM-1',
      currency: 'IDR', items: [{ product_id: 'ITEM-1', quantity: 1 }], cashier_id: 'CASHIER-1', idempotency_key: 'attempt-1',
    } satisfies GovernedRetailCheckoutPayload
    const result = await new MockHfeAdapter().postGovernedRetailOrder(payload, {
      companyBookId: 'BOOK-1', authorityContext: 'AUTH-1', sessionId: 'SESSION-1', financialDate: '2026-08-28',
      handover: { actorPrincipalId: 'CASHIER-1', evidenceReference: 'POS-1', occurredAt: '2026-08-28T00:00:00Z' },
    }, quote)
    expect(result.grand_total).toBe('30800')
  })

  it('keeps the DOM click event out of the checkout callback contract', () => {
    const source = readFileSync(new URL('../components/pos/PosCartSection.tsx', import.meta.url), 'utf8')
    expect(source).toContain('onClick={() => onCheckout()}')
  })
})
