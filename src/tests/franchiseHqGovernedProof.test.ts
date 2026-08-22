import { describe, it, expect } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { BranchManagementView } from '../views/BranchManagementView'

describe('Franchise / HQ Governed Proof Moment Suite (Issue #33 Part C)', () => {
  it('renders the HQ Network Impact module with delta metrics and governed boundary badge', () => {
    const html = renderToString(React.createElement(BranchManagementView, { bookId: 'BOOK-CAFE-HQ-88' }))

    // Assert title & badge
    expect(html).toContain('HQ Network Impact: Transaksi Terakhir Outlet')
    expect(html).toContain('Governed Consensus Active ✓')

    // Assert delta movements
    expect(html).toContain('+Rp 57.500')
    expect(html).toContain('+Rp 36.000 (72%)')
    expect(html).toContain('Protected Boundary')
    expect(html).toContain('1 Transaksi. 1 Kebenaran.')
  })
})
