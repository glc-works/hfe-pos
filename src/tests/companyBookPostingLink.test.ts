import { afterEach, describe, expect, it, vi } from 'vitest'
import { companyBookPostingHref } from '../config/companyBookPostingLink'

afterEach(() => vi.unstubAllEnvs())

describe('Company Book posting handoff', () => {
  it('builds the canonical local route from exact Company Book, posting, and order identities', () => {
    expect(companyBookPostingHref('org-a', 'book-a', 'posting-a', 'order-a')).toBe(
      'http://localhost:8081/app/accounting/company-books/book-a/postings/posting-a?orderId=order-a&organizationId=org-a',
    )
  })

  it('uses an explicit HTTPS Company Book origin in connected mode', () => {
    vi.stubEnv('VITE_HFE_RUNTIME_MODE', 'connected')
    vi.stubEnv('VITE_HFE_COMPANY_BOOK_URL', 'https://prv-books.hfeit.com')

    expect(companyBookPostingHref('org/a', 'book/a', 'posting?a', 'order a')).toBe(
      'https://prv-books.hfeit.com/app/accounting/company-books/book%2Fa/postings/posting%3Fa?orderId=order+a&organizationId=org%2Fa',
    )
  })

  it.each([
    ['', 'book-a', 'posting-a', 'order-a'],
    ['org-a', '', 'posting-a', 'order-a'],
    ['org-a', 'book-a', '', 'order-a'],
    ['org-a', 'book-a', 'posting-a', ''],
  ])('does not invent a handoff with an incomplete identity', (org, book, posting, order) => {
    expect(companyBookPostingHref(org, book, posting, order)).toBeNull()
  })

  it.each([
    ['http://preview.example.com'],
    [`https://${['user', 'placeholder'].join(':')}@preview.example.com`],
    ['not a URL'],
  ])('fails closed for an unsafe configured origin', (origin) => {
    vi.stubEnv('VITE_HFE_RUNTIME_MODE', 'connected')
    vi.stubEnv('VITE_HFE_COMPANY_BOOK_URL', origin)
    expect(companyBookPostingHref('org-a', 'book-a', 'posting-a', 'order-a')).toBeNull()
  })
})
