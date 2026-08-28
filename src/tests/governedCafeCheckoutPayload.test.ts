import { describe, expect, it } from 'vitest'
import { buildGovernedCafeCheckoutPayload, checkoutIntentFingerprint } from '../hooks/useCafeSettlement'

describe('governed cafe checkout payload', () => {
  it('contains only item identity, quantity, modifiers, tender choice, and CORE quote context', () => {
    const payload = buildGovernedCafeCheckoutPayload({
      tableId: 'table-4',
      contactId: '',
      policy: 'pay-first',
      paymentMethod: 'cash',
      cashierId: 'cashier-1',
      quoteContext: {
        outletId: 'outlet-1',
        terminalId: 'terminal-4',
        currency: 'IDR',
      },
      items: [{
        id: 'product-1',
        quantity: 2,
        price: 42_000,
        hfeGlAccount: 'forbidden-browser-gl',
        modifierIds: ['modifier-oat-milk'],
      }],
    })

    expect(payload).toEqual({
      table_id: 'table-4',
      contact_id: '',
      policy: 'pay-first',
      payment_method: 'cash',
      outlet_id: 'outlet-1',
      terminal_id: 'terminal-4',
      currency: 'IDR',
      promotion_codes: [],
      items: [{
        product_id: 'product-1',
        quantity: 2,
        modifier_ids: ['modifier-oat-milk'],
      }],
      cashier_id: 'cashier-1',
    })

    expect(JSON.stringify(payload)).not.toMatch(/price|subtotal|grand_total|tax|service|discount|gl_account/i)
  })

  it('fails closed before CORE when the connected tender is unsupported', () => {
    expect(() => buildGovernedCafeCheckoutPayload({
      contactId: '',
      policy: 'pay-first',
      paymentMethod: 'card',
      cashierId: 'cashier-1',
      quoteContext: {
        outletId: 'outlet-1',
        terminalId: 'terminal-4',
        currency: 'IDR',
      },
      items: [{ id: 'product-1', quantity: 1, price: 10_000 }],
    })).toThrow(/unsupported governed tender/i)
  })

  it('changes the review fingerprint when modifier or CORE quote scope changes', () => {
    const options = {
      financialPort: {},
      companyBookId: 'book-1',
      organizationId: 'org-1',
      authorityContext: 'authority-1',
      cashierId: 'cashier-1',
      selectedTable: { id: 'table-1' },
      orders: [],
      items: [{ id: 'product-1', quantity: 1, modifierIds: ['oat'] }],
      fulfillmentMode: 'dine_in',
      paymentMethod: 'cash',
      formatPrice: () => '',
      commitPaidState: () => {},
      clearCart: () => {},
    } as any
    const quoteContext = { outletId: 'outlet-1', terminalId: 'terminal-1', currency: 'IDR' }
    const reviewed = checkoutIntentFingerprint(options, 'cash', quoteContext)

    expect(checkoutIntentFingerprint({
      ...options,
      items: [{ ...options.items[0], modifierIds: ['soy'] }],
    }, 'cash', quoteContext)).not.toBe(reviewed)
    expect(checkoutIntentFingerprint(options, 'cash', {
      ...quoteContext,
      terminalId: 'terminal-2',
    })).not.toBe(reviewed)
  })
})
