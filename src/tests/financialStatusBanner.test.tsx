import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { FinancialStatusBanner } from '../components/pos/FinancialStatusBanner'

describe('financial status recovery action', () => {
  it('offers exact CORE reconciliation for a locally posted but unacknowledged attempt', () => {
    const html = renderToStaticMarkup(
      <FinancialStatusBanner
        status="error"
        notice="posted_unacknowledged"
        failureCode={null}
        onResume={vi.fn()}
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
      />,
    )

    expect(html).not.toContain('<button')
  })
})
