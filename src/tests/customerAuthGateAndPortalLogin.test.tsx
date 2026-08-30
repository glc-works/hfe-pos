import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CustomerPortalView } from '../views/CustomerPortalView'
import { CustomerAuthGate } from '../components/customer-portal/CustomerAuthGate'
import { DEFAULT_COMPANY_PROFILE } from '../data/mockData'

describe('Customer Auth Gate & Member Portal Login Flow', () => {
  it('renders CustomerAuthGate when isCustomerSessionActive is false', () => {
    const html = renderToStaticMarkup(
      <CustomerPortalView
        hfeCompanyProfile={DEFAULT_COMPANY_PROFILE}
        isCustomerSessionActive={false}
        onBackToLanding={() => {}}
      />
    )

    expect(html).toContain('Masuk / Daftar Member')
    expect(html).toContain('Nomor WhatsApp / HP')
    expect(html).toContain('Masuk Cepat Demo (0812-8888-9999)')
  })

  it('renders HfeCard Passbook and tabs when isCustomerSessionActive is true', () => {
    const html = renderToStaticMarkup(
      <CustomerPortalView
        hfeCompanyProfile={DEFAULT_COMPANY_PROFILE}
        isCustomerSessionActive={true}
        onBackToLanding={() => {}}
      />
    )

    expect(html).toContain('HfeCard Passbook &amp; Hub')
    expect(html).toContain('HfeCard Hub')
    expect(html).toContain('Riwayat Pesanan')
    expect(html).toContain('Voucher Saya')
  })

  it('renders standalone CustomerAuthGate form fields correctly', () => {
    const html = renderToStaticMarkup(
      <CustomerAuthGate
        brandName="Senopati Roastery"
        onLoginSuccess={vi.fn()}
      />
    )

    expect(html).toContain('Senopati Roastery • Member Pass')
    expect(html).toContain('+62')
    expect(html).toContain('812-3456-7890')
    expect(html).toContain('Masuk / Lanjut')
  })
})
