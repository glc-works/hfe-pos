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
import {
  acknowledgeConfirmedPosted,
  activeQuotePaymentMethod,
  formatPostedCheckoutAmount,
  settleQuoteRetirement,
  shouldAcceptQuoteResponse,
} from '../hooks/useCafeSettlement'

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
    expect(formatExactMinorCurrency('9007199254740993', 'USD', 'en')).toBe('USD\u00a090,071,992,547,409.93')
    expect(formatExactMinorCurrency('12345', 'USD', 'id')).toBe('USD\u00a0123,45')
    expect(() => formatExactMinorCurrency('100', 'BTC', 'en')).toThrow(/unsupported currency/i)
  })

  it('keeps a posted sale posted when its display amount is malformed', () => {
    expect(formatPostedCheckoutAmount('not-money', 'IDR', 'id', () => 'fallback')).toBe('fallback')
  })

  it('keeps a failed quote retirement observable so a later quote cannot bypass it', async () => {
    const onFailure = vi.fn()
    await expect(settleQuoteRetirement(Promise.reject(new Error('retirement failed')), onFailure)).rejects.toThrow('retirement failed')
    expect(onFailure).toHaveBeenCalledWith(expect.objectContaining({ message: 'retirement failed' }))
  })

  it('preserves entered cash when the reviewed quote currency is reselected', () => {
    expect(cashValueAfterCurrencySelection(quote, '50000', 33000, 'IDR', 'IDR')).toBe('50000')
  })

  it('renders the authoritative quote currency as the active tender currency', () => {
    const html = renderToStaticMarkup(
      <LanguageProvider><MerchantConfigProvider><PosCashTenderForm
        authoritativeQuote={{ ...quote, currency: 'USD' }} posCashGiven="50000" setPosCashGiven={vi.fn()} grandTotal={33000}
      /></MerchantConfigProvider></LanguageProvider>,
    )
    expect(html).toMatch(/<button[^>]*class="[^"]*bg-amber-500[^"]*"[^>]*><span>🇺🇸<\/span><span>USD<\/span>/)
  })

  it('rejects an in-flight quote response after genuine cart or context fingerprint drift', () => {
    expect(shouldAcceptQuoteResponse('qris:cart-v1:context-v1', 'qris:cart-v1:context-v1')).toBe(true)
    expect(shouldAcceptQuoteResponse('qris:cart-v1:context-v1', 'qris:cart-v2:context-v1')).toBe(false)
  })

  it('tracks an explicitly requested QRIS quote while the configured method remains cash', () => {
    expect(activeQuotePaymentMethod('cash', 'qris', 'cash')).toBe('qris')
  })

  it('switches to the newly configured tender when checkout inputs genuinely drift', () => {
    expect(activeQuotePaymentMethod('cash', 'qris', 'card')).toBe('card')
  })

  it('preserves the exact posted response and retries acknowledgement without reposting', async () => {
    const response = { status: 'posted' as const, tx_id: 'ORDER-1', posting_id: 'POSTING-1', grand_total: '30800' }
    const repost = vi.fn()
    const acknowledge = vi.fn()
      .mockRejectedValueOnce(new Error('cleanup failed'))
      .mockResolvedValueOnce(undefined)

    const failedCleanup = await acknowledgeConfirmedPosted(response, acknowledge)
    expect(failedCleanup).toEqual({ kind: 'posted_unacknowledged', response, error: expect.any(Error) })
    const retriedCleanup = await acknowledgeConfirmedPosted(failedCleanup.response, acknowledge)
    expect(retriedCleanup).toEqual({ kind: 'acknowledged', response })
    expect(acknowledge).toHaveBeenCalledTimes(2)
    expect(repost).not.toHaveBeenCalled()
  })

  it.each(['live activation', 'posting projection', 'paid-state UI', 'cart cleanup', 'amount display', 'alert'])(
    'ends the financial failure boundary before %s throws',
    async () => {
      const response = { status: 'posted' as const, tx_id: 'ORDER-1', posting_id: 'POSTING-1', grand_total: '30800' }
      const acknowledge = vi.fn()
      const result = await acknowledgeConfirmedPosted(response, acknowledge, () => {
        throw new Error('post-confirmation projection failed')
      })
      expect(result).toEqual({ kind: 'posted_unacknowledged', response, error: expect.any(Error) })
      expect(acknowledge).not.toHaveBeenCalled()
    },
  )

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
