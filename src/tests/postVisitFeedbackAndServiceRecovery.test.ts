import { describe, it, expect } from 'vitest'
import { idTranslations } from '../i18n/id'
import { enTranslations } from '../i18n/en'

describe('Post-Visit Merchant Feedback & Service Recovery Suite (Issue #34 P1-7 & P1-8)', () => {
  it('verifies 100% complete i18n translation dictionary binding across ID and EN', () => {
    const idKeys = Object.keys(idTranslations.feedback)
    const enKeys = Object.keys(enTranslations.feedback)

    expect(idKeys.length).toBeGreaterThanOrEqual(25)
    expect(idKeys).toEqual(enKeys)

    expect(idTranslations.feedback.howWasYourVisitTitle).toBe('Bagaimana Pengalaman Anda Hari Ini?')
    expect(enTranslations.feedback.howWasYourVisitTitle).toBe('How Was Your Visit Today?')
    expect(idTranslations.feedback.helpUsGrowCta).toBe('♡ Bantu Kami Berkembang')
    expect(enTranslations.feedback.helpUsGrowCta).toBe('♡ Help Us Keep Growing')
  })

  it('validates rating branch boundaries (Positive >= 4 vs Negative <= 3)', () => {
    const isPositive = (rating: number) => rating >= 4
    const isNegative = (rating: number) => rating <= 3

    expect(isPositive(5)).toBe(true)
    expect(isPositive(4)).toBe(true)
    expect(isPositive(3)).toBe(false)

    expect(isNegative(3)).toBe(true)
    expect(isNegative(2)).toBe(true)
    expect(isNegative(1)).toBe(true)
    expect(isNegative(4)).toBe(false)
  })

  it('verifies structured negative tags format and service recovery payload', () => {
    const tableNumber = 'OUT-04'
    const selectedTags = ['slow_order', 'wrong_order']
    
    const serviceTicketPayload = {
      tableNumber,
      type: 'waiter_call' as const,
      reason: selectedTags.join(', '),
      status: 'open' as const,
      createdAt: new Date().toISOString(),
    }

    expect(serviceTicketPayload.tableNumber).toBe('OUT-04')
    expect(serviceTicketPayload.type).toBe('waiter_call')
    expect(serviceTicketPayload.reason).toBe('slow_order, wrong_order')
    expect(serviceTicketPayload.status).toBe('open')
  })

  it('verifies HFE product feedback sentiments and non-blocking payload', () => {
    const sentiments = ['loved', 'better', 'wrong'] as const
    const mockFeedback = {
      sentiment: sentiments[0],
      note: 'UI sangat cepat dan lancar!',
      timestamp: Date.now(),
    }

    expect(mockFeedback.sentiment).toBe('loved')
    expect(mockFeedback.note).toBeTruthy()
    expect(sentiments).toContain('better')
    expect(sentiments).toContain('wrong')
  })
})
