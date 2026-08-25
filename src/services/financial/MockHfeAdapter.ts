// --- HFE MOCK FINANCIAL ADAPTER (POS-ENG-STD-001) ---
// Explicit Mock Implementation for Storybook, Vitest, and Local Simulation

import {
  HfePosFinancialPort,
  CompanyBookSettingsResponse,
  ResolveContactResponse,
  SubmitRetailTransactionPayload,
  SubmitRetailTransactionResponse,
  RetailPostingContext,
  UniversalMultiTenderRequest,
  UniversalMultiTenderResponse,
  GenerateQrisPayload,
  QrisPaymentResponse,
  CashierShiftResponse,
  CashierShiftCloseResponse,
  GlPostingEntry
} from './HfePosFinancialPort'
import { MenuItem } from '../../types/pos'
import { PRODUCT_CATALOG } from '../../data/mockData'

interface InternalMockShift {
  shiftId: string
  cashierId: string
  openedAt: string
  initialFloat: number
  cashSales: number
  totalSales: number
  status: 'open' | 'closed'
}

export class MockHfeAdapter implements HfePosFinancialPort {
  readonly isSimulated = true
  readonly adapterName = 'MockHfeAdapter'

  private mockCatalog: MenuItem[] = [...PRODUCT_CATALOG]
  private mockShifts: Map<string, InternalMockShift> = new Map()
  private mockContacts: Map<string, ResolveContactResponse> = new Map()

  constructor() {
    this.seedDefaultData()
  }

  private seedDefaultData() {
    this.mockContacts.set('081234567890', {
      contact_id: 'CUST-081234567890',
      loyalty_tier: 'Platinum VIP',
      loyalty_points: 1250,
      active_vouchers_count: 3,
      isSimulated: true,
    })
  }

  async fetchProductCatalog(_bookId?: string): Promise<MenuItem[]> {
    return Promise.resolve([...this.mockCatalog])
  }

  async resolveContact(
    entryMode: 'phone' | 'guest-name',
    phone?: string,
    name?: string,
    _bookId?: string
  ): Promise<ResolveContactResponse> {
    if (phone && this.mockContacts.has(phone)) {
      return Promise.resolve(this.mockContacts.get(phone)!)
    }

    const contactId = phone ? `CUST-${phone}` : `CUST-GUEST-${(name || '01').replace(/\s+/g, '-').toUpperCase()}`
    const result: ResolveContactResponse = {
      contact_id: contactId,
      loyalty_tier: phone ? 'Gold Member' : 'Guest Member',
      loyalty_points: phone ? 250 : 0,
      active_vouchers_count: 1,
      isSimulated: true,
    }
    if (phone) {
      this.mockContacts.set(phone, result)
    }
    return Promise.resolve(result)
  }

  async submitRetailTransaction(
    payload: SubmitRetailTransactionPayload,
    _bookId?: string
  ): Promise<SubmitRetailTransactionResponse> {
    const txId = `TX-SIM-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const journalId = `JRN-SIM-${Date.now()}`
    const nowIso = new Date().toISOString()

    // Build balanced double-entry GL ledger posting entries
    const glEntries: GlPostingEntry[] = []

    // 1. Debit Settlement / Cash Asset Account
    let assetAccount = '1010-Kasir Utama'
    if (payload.payment_method === 'qris') {
      assetAccount = '1020-Kliring QRIS Settlement'
    } else if (payload.payment_method === 'card') {
      assetAccount = '1030-Kliring EDC Card Settlement'
    } else if (payload.payment_method === 'kasbon') {
      assetAccount = '1100-Piutang Dagang Kasbon'
    }

    glEntries.push({
      account: assetAccount,
      account_name: 'Cash / Settlement Asset',
      debit: payload.grand_total,
      credit: 0,
    })

    // 2. Credit Revenue Account (Net of Discount)
    const netRevenue = Math.max(0, payload.subtotal - payload.discount_amount)
    if (netRevenue > 0) {
      glEntries.push({
        account: '4010-Pendapatan Penjualan Retail/F&B',
        account_name: 'Sales Revenue',
        debit: 0,
        credit: netRevenue,
      })
    }

    // 3. Credit Tax Liability Account (PB1)
    if (payload.tax_pb1_amount > 0) {
      glEntries.push({
        account: '2050-Hutang Pajak Restoran PB1',
        account_name: 'PB1 Restaurant Tax Payable',
        debit: 0,
        credit: payload.tax_pb1_amount,
      })
    }

    // 4. Credit Service Charge Liability Account
    if (payload.service_fee_amount > 0) {
      glEntries.push({
        account: '2060-Hutang Alokasi Service Charge Staff',
        account_name: 'Service Charge Allocation Payable',
        debit: 0,
        credit: payload.service_fee_amount,
      })
    }

    // Update active cashier shift if applicable
    if (payload.cashier_id) {
      for (const shift of this.mockShifts.values()) {
        if (shift.cashierId === payload.cashier_id && shift.status === 'open') {
          shift.totalSales += payload.grand_total
          if (payload.payment_method === 'cash') {
            shift.cashSales += payload.grand_total
          }
          break
        }
      }
    }

    return Promise.resolve({
      tx_id: txId,
      status: 'posted',
      created_at: nowIso,
      grand_total: payload.grand_total,
      idempotency_key: payload.idempotency_key || `IDEMP-SIM-${Date.now()}`,
      ledger_journal_id: journalId,
      gl_entries_posted: glEntries,
      isSimulated: true,
    })
  }

  async postRetailOrder(
    payload: SubmitRetailTransactionPayload,
    _context: RetailPostingContext
  ): Promise<SubmitRetailTransactionResponse> {
    return this.submitRetailTransaction(payload)
  }

  async settleUniversalMultiTender(
    payload: UniversalMultiTenderRequest,
    _bookId?: string
  ): Promise<UniversalMultiTenderResponse> {
    const totalTendered = payload.tenders.reduce((sum, t) => sum + t.amount_minor, 0)
    const totalDiscrepancy = (payload.discrepancies || []).reduce((sum, d) => sum + d.amount_minor, 0)

    const nowIso = new Date().toISOString()
    const settlementId = `SETTLE-SIM-${Date.now()}`
    const journalId = `JRN-SETTLE-SIM-${Date.now()}`

    const glEntries: GlPostingEntry[] = []

    payload.tenders.forEach((t) => {
      glEntries.push({
        account:
          t.gl_account_override ||
          (t.tender_type === 'cash' ? '1010-Kas Kasir' : '1020-Bank QRIS/EDC Clearing'),
        account_name: `Tender ${t.tender_type.toUpperCase()}`,
        debit: t.amount_minor,
        credit: 0,
      })
    })

    glEntries.push({
      account: '4010-Pendapatan Penjualan Resto F&B',
      account_name: 'F&B Restaurant Sales',
      debit: 0,
      credit: payload.total_obligation_minor,
    })

    return Promise.resolve({
      settlement_id: settlementId,
      document_reference_id: payload.document_reference_id,
      total_obligation_minor: payload.total_obligation_minor,
      total_tendered_minor: totalTendered,
      total_discrepancy_minor: totalDiscrepancy,
      status: 'settled',
      settled_at: nowIso,
      journal_posting_id: journalId,
      gl_entries_posted: glEntries,
      isSimulated: true,
    })
  }

  async generateQrisPayment(
    payload: GenerateQrisPayload,
    _bookId?: string
  ): Promise<QrisPaymentResponse> {
    const paymentId = `PAY-SIM-QRIS-${payload.transaction_id}`
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()
    const qrisString = `00020101021226670016ID.CO.QRIS.WWW.HFE.TOGROW.ID.MNO0102030405065204581253033605802ID5915Artisan Cafe HQ6007Jakarta61051211062070703A016304${payload.transaction_id.slice(-4)}`

    return Promise.resolve({
      payment_id: paymentId,
      qris_string: qrisString,
      qr_image_url: `https://hfe.togrow.id/qr/${paymentId}.png`,
      expires_at: expiresAt,
      isSimulated: true,
    })
  }

  async openCashierShift(
    cashierId: string,
    initialFloat: number,
    _bookId?: string
  ): Promise<CashierShiftResponse> {
    const shiftId = `SHIFT-SIM-${Date.now()}`
    const openedAt = new Date().toISOString()

    const newShift: InternalMockShift = {
      shiftId,
      cashierId,
      openedAt,
      initialFloat,
      cashSales: 0,
      totalSales: 0,
      status: 'open',
    }
    this.mockShifts.set(shiftId, newShift)

    return Promise.resolve({
      shift_id: shiftId,
      cashier_id: cashierId,
      opened_at: openedAt,
      initial_float: initialFloat,
      status: 'open',
      isSimulated: true,
    })
  }

  async closeCashierShift(
    shiftId: string,
    reportedCash: number,
    _bookId?: string
  ): Promise<CashierShiftCloseResponse> {
    const shift = this.mockShifts.get(shiftId)
    const initialFloat = shift ? shift.initialFloat : 500000
    const cashSales = shift ? shift.cashSales : 1250000
    const totalSales = shift ? shift.totalSales : 2850000
    const expectedCash = initialFloat + cashSales
    const cashVariance = reportedCash - expectedCash
    const closedAt = new Date().toISOString()

    if (shift) {
      shift.status = 'closed'
    }

    return Promise.resolve({
      shift_id: shiftId,
      cashier_id: shift?.cashierId || 'CASHIER-SIM-01',
      opened_at: shift?.openedAt || new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
      closed_at: closedAt,
      initial_float: initialFloat,
      reported_cash: reportedCash,
      expected_cash: expectedCash,
      cash_variance: cashVariance,
      total_sales: totalSales,
      status: 'closed',
      isSimulated: true,
    })
  }

  async fetchCompanyBookSettings(bookId?: string): Promise<CompanyBookSettingsResponse> {
    const targetBook = bookId || 'BOOK-CAFE-HQ-88'
    return Promise.resolve({
      company_book_id: targetBook,
      legal_entity_name: 'PT Kopi Karya Nusantara (Simulated)',
      brand_name: 'Kopitiam Senopati & Roastery',
      currency: 'IDR',
      tax_id_npwp: '01.234.567.8-012.000',
      nib_permit: '9120001234567',
      accounting_topology: {
        mode: 'dimensional',
        default_sales_gl_account: '4010-Pendapatan Penjualan Retail/F&B',
        default_cogs_gl_account: '5010-Beban Pokok Penjualan (HPP)',
        default_cash_gl_account: '1010-Kasir Utama',
        default_tax_gl_account: '2050-Hutang Pajak Restoran PB1',
        default_service_gl_account: '2060-Hutang Alokasi Service Charge Staff',
        default_receivable_gl_account: '1100-Piutang Dagang Kasbon',
        cost_centers: [
          { id: 'CC-01', name: 'Outlet Senopati HQ', code: 'BR-01', is_active: true },
          { id: 'CC-02', name: 'Outlet Kemang Roastery', code: 'BR-02', is_active: true },
          { id: 'CC-03', name: 'Outlet BSD Flavor Bliss', code: 'BR-03', is_active: true },
        ],
      },
      isSimulated: true,
      fetched_at: new Date().toISOString(),
    })
  }
}
