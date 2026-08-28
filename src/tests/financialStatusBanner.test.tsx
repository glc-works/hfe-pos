import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { FinancialStatusBanner } from '../components/pos/FinancialStatusBanner'

describe('financial status recovery action', () => {
  it('opens exact verified posting truth in Company Book only for posted status', () => {
    const href = 'http://localhost:8081/app/accounting/company-books/book-a/postings/posting-a?orderId=order-a'
    const html = renderToStaticMarkup(
      <FinancialStatusBanner
        status="posted"
        notice="posted"
        failureCode={null}
        onResume={vi.fn()}
        postingTruthHref={href}
      />,
    )

    expect(html).toContain('Buka Buku')
    expect(html).toContain(`href="${href.replace(/&/g, '&amp;')}"`)
  })

  it('offers exact CORE reconciliation for a locally posted but unacknowledged attempt', () => {
    const html = renderToStaticMarkup(
      <FinancialStatusBanner
        status="error"
        notice="posted_unacknowledged"
        failureCode={null}
        onResume={vi.fn()}
        postingTruthHref={null}
      />,
    )

    expect(html).toContain('Periksa hasil yang sama di CORE')
    expect(html).toContain('<button')
  })

  it('does not offer reconciliation for a validation failure', () => {
    const html = renderToStaticMarkup(
      <FinancialStatusBanner
        status="error"
        notice="failed"
        failureCode="validation"
        onResume={vi.fn()}
        postingTruthHref={null}
      />,
    )

    expect(html).not.toContain('<button')
  })

  it('offers read-only outcome reconciliation for a pending QRIS attempt', () => {
    const html = renderToStaticMarkup(
      <FinancialStatusBanner
        status="pending"
        notice="pending_core"
        failureCode={null}
        onResume={vi.fn()}
        canResume
        postingTruthHref={null}
      />,
    )

    expect(html).toContain('CORE masih memproses')
    expect(html).toContain('<button')
  })
})
