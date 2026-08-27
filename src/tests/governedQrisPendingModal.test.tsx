import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { GovernedQrisPendingModal } from '../components/pos/GovernedQrisPendingModal'

describe('governed QRIS pending receipt', () => {
  it('renders only the CORE-issued QR receipt without a fake payment confirmation action', () => {
    const html = renderToStaticMarkup(
      <GovernedQrisPendingModal
        payment={{
          payment_id: 'QRIS-INTENT-001',
          tender_id: 'TENDER-001',
          qris_string: '000201010212',
          qr_image_url: 'https://provider.example/QRIS-INTENT-001.png',
          expires_at: '2026-08-27T12:00:00Z',
        }}
        onClose={vi.fn()}
      />,
    )

    expect(html).toContain('https://provider.example/QRIS-INTENT-001.png')
    expect(html).toContain('QRIS-INTENT-001')
    expect(html).toContain('2026-08-27T12:00:00Z')
    expect(html).not.toMatch(/simulasi pembayaran sukses|confirm payment/i)
    expect(html.match(/<button/g)).toHaveLength(1)
  })
})
