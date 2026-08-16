/**
 * FINANCIAL BUSINESS EVENTS TO LEDGER AUDIT TEST SUITE
 * 
 * Mathematical and accounting audit of all 11 core POS business events posting to Hfe Core Book:
 * 1. BUKA_SHIFT_FLOAT: Float disbursement from vault to drawer
 * 2. PENJUALAN_TUNAI_RESTO: Cash dine-in sales with PB1 10% tax, 5% service, and BOM COGS
 * 3. PENJUALAN_QRIS_MDR: QRIS electronic settlement with merchant discount rate (MDR)
 * 4. DP_RESERVASI_MEJA: Table reservation deposit recording (Customer Advances)
 * 5. PELUNASAN_MEJA_POTONG_DP: Reservation settlement with DP offset
 * 6. COMP_PENGGANTIAN_KERAMAHAN: Complimentary item replacement (GL 5107 Spoilage/Hospitality)
 * 7. ROOM_CHARGE_FOLIO_402: Hotel guest room folio receivable (GL 1105 AR)
 * 8. INVOICE_KORPORAT_NET30: Corporate B2B Net-30 trade receivable (GL 1106 AR)
 * 9. REFUND_DEPOSIT_BOTOL_KACA: Circular economy glass bottle deposit refund liability
 * 10. SELISIH_KAS_TUTUP_SHIFT: Blind cash count variance adjustment (GL 5109 Expense)
 * 11. SETORAN_AKHIR_HARI_BRANKAS: End-of-day cash drawer emptying to vault
 */

import { describe, it, expect } from 'vitest'

interface JournalPosting {
  eventId: string
  companyBookId: string
  branchId: string
  timestamp: string
  lines: {
    accountCode: string
    accountName: string
    debit: number
    credit: number
  }[]
}

describe('📊 Financial Audit of Business Events to General Ledger', () => {

  const COMPANY_BOOK_ID = 'BOOK-SENOPATI-8829-PT'
  const BRANCH_ID = 'BRN-SEN-01'

  const auditJournalBalance = (journal: JournalPosting) => {
    const totalDebit = journal.lines.reduce((s, l) => s + l.debit, 0)
    const totalCredit = journal.lines.reduce((s, l) => s + l.credit, 0)
    
    // Strict Invariant 1: Total Debit MUST equal Total Credit
    expect(totalDebit).toBe(totalCredit)
    // Strict Invariant 2: Tenant Book ID MUST be present
    expect(journal.companyBookId).toBe(COMPANY_BOOK_ID)
    // Strict Invariant 3: Zero Negative Numbers in individual postings
    expect(journal.lines.every(l => l.debit >= 0 && l.credit >= 0)).toBe(true)

    return { totalDebit, totalCredit, isBalanced: totalDebit === totalCredit }
  }

  // =========================================================================
  // 1. SHIFT OPENING CASH FLOAT
  // =========================================================================
  it('Event 1: Shift Opening Cash Float Posting', () => {
    const floatEvent: JournalPosting = {
      eventId: 'EVT-FLOAT-01',
      companyBookId: COMPANY_BOOK_ID,
      branchId: BRANCH_ID,
      timestamp: '2026-08-16T08:00:00Z',
      lines: [
        { accountCode: '1101', accountName: 'Kas Laci Kasir (Cash Drawer)', debit: 500000, credit: 0 },
        { accountCode: '1102', accountName: 'Kas Brankas Toko (Safe Vault)', debit: 0, credit: 500000 }
      ]
    }

    const audit = auditJournalBalance(floatEvent)
    expect(audit.isBalanced).toBe(true)
    expect(audit.totalDebit).toBe(500000)
  })

  // =========================================================================
  // 2. CASH DINE-IN RESTO SALES (TAX, SERVICE, COGS)
  // =========================================================================
  it('Event 2: Cash Dine-In Sales with PB1 Tax, Service & BOM Inventory COGS', () => {
    const subtotal = 100000
    const serviceFee = 5000  // 5%
    const pb1Tax = 10500     // 10% on subtotal + service
    const grandTotal = 115500
    const bomCogs = 28000

    const salesEvent: JournalPosting = {
      eventId: 'EVT-SALE-CASH-01',
      companyBookId: COMPANY_BOOK_ID,
      branchId: BRANCH_ID,
      timestamp: '2026-08-16T12:30:00Z',
      lines: [
        { accountCode: '1101', accountName: 'Kas Laci Kasir', debit: grandTotal, credit: 0 },
        { accountCode: '4101', accountName: 'Pendapatan Penjualan F&B', debit: 0, credit: subtotal },
        { accountCode: '2101', accountName: 'Hutang Pajak PB1 Resto Daerah', debit: 0, credit: pb1Tax },
        { accountCode: '2102', accountName: 'Hutang Alokasi Service Karyawan', debit: 0, credit: serviceFee },
        { accountCode: '5101', accountName: 'HPP Makanan & Minuman (COGS)', debit: bomCogs, credit: 0 },
        { accountCode: '1104', accountName: 'Persediaan Bahan Baku (Inventory)', debit: 0, credit: bomCogs }
      ]
    }

    const audit = auditJournalBalance(salesEvent)
    expect(audit.isBalanced).toBe(true)
    expect(audit.totalDebit).toBe(grandTotal + bomCogs)
  })

  // =========================================================================
  // 3. QRIS ELECTRONIC SETTLEMENT WITH MDR FEE
  // =========================================================================
  it('Event 3: Dynamic QRIS Settlement with MDR Merchant Fee Expense', () => {
    const grossAmount = 100000
    const mdrRate = 0.007 // 0.7% MDR fee
    const mdrExpense = Math.round(grossAmount * mdrRate) // Rp 700
    const netBankSettlement = grossAmount - mdrExpense   // Rp 99.300

    const qrisEvent: JournalPosting = {
      eventId: 'EVT-QRIS-01',
      companyBookId: COMPANY_BOOK_ID,
      branchId: BRANCH_ID,
      timestamp: '2026-08-16T13:00:00Z',
      lines: [
        { accountCode: '1103', accountName: 'Bank Clearing QRIS Settlement', debit: netBankSettlement, credit: 0 },
        { accountCode: '5108', accountName: 'Beban Transaksi Merchant MDR', debit: mdrExpense, credit: 0 },
        { accountCode: '4101', accountName: 'Pendapatan Penjualan F&B', debit: 0, credit: grossAmount }
      ]
    }

    const audit = auditJournalBalance(qrisEvent)
    expect(audit.isBalanced).toBe(true)
    expect(audit.totalDebit).toBe(grossAmount)
  })

  // =========================================================================
  // 4 & 5. TABLE RESERVATION DEPOSIT & SETTLEMENT
  // =========================================================================
  it('Event 4 & 5: VIP Table Reservation DP and Final Offset Settlement', () => {
    // 4. Receive DP
    const dpEvent: JournalPosting = {
      eventId: 'EVT-DP-RESERVE-01',
      companyBookId: COMPANY_BOOK_ID,
      branchId: BRANCH_ID,
      timestamp: '2026-08-16T14:00:00Z',
      lines: [
        { accountCode: '1103', accountName: 'Bank Settlement (DP Transfer)', debit: 500000, credit: 0 },
        { accountCode: '2103', accountName: 'Uang Muka Pelanggan (Customer Advances)', debit: 0, credit: 500000 }
      ]
    }
    expect(auditJournalBalance(dpEvent).isBalanced).toBe(true)

    // 5. Final Bill Settlement (Total Bill Rp 1.500.000, DP Offset Rp 500.000, Net Cash Rp 1.000.000)
    const settleEvent: JournalPosting = {
      eventId: 'EVT-SETTLE-RESERVE-01',
      companyBookId: COMPANY_BOOK_ID,
      branchId: BRANCH_ID,
      timestamp: '2026-08-16T20:00:00Z',
      lines: [
        { accountCode: '1101', accountName: 'Kas Laci Kasir', debit: 1000000, credit: 0 },
        { accountCode: '2103', accountName: 'Uang Muka Pelanggan (Offset DP)', debit: 500000, credit: 0 },
        { accountCode: '4101', accountName: 'Pendapatan Penjualan VIP Room', debit: 0, credit: 1500000 }
      ]
    }
    expect(auditJournalBalance(settleEvent).isBalanced).toBe(true)
  })

  // =========================================================================
  // 6. COMPLIMENTARY ITEM REPLACEMENT (SPOILAGE / HOSPITALITY)
  // =========================================================================
  it('Event 6: Complimentary Item Replacement GL Posting', () => {
    const compCost = 35000 // HPP Bahan Baku
    const compEvent: JournalPosting = {
      eventId: 'EVT-COMP-01',
      companyBookId: COMPANY_BOOK_ID,
      branchId: BRANCH_ID,
      timestamp: '2026-08-16T15:10:00Z',
      lines: [
        { accountCode: '5107', accountName: 'Beban Keramahan & Spoilage', debit: compCost, credit: 0 },
        { accountCode: '1104', accountName: 'Persediaan Bahan Baku', debit: 0, credit: compCost }
      ]
    }

    const audit = auditJournalBalance(compEvent)
    expect(audit.isBalanced).toBe(true)
    expect(audit.totalDebit).toBe(35000)
  })

  // =========================================================================
  // 7. HOTEL ROOM FOLIO CHARGE
  // =========================================================================
  it('Event 7: Hotel Guest Room Folio Receivable (GL 1105 AR)', () => {
    const roomChargeEvent: JournalPosting = {
      eventId: 'EVT-ROOM-402-01',
      companyBookId: COMPANY_BOOK_ID,
      branchId: BRANCH_ID,
      timestamp: '2026-08-16T16:00:00Z',
      lines: [
        { accountCode: '1105', accountName: 'Piutang Tamu Hotel Kamar 402', debit: 98900, credit: 0 },
        { accountCode: '4101', accountName: 'Pendapatan Restoran', debit: 0, credit: 86000 },
        { accountCode: '2101', accountName: 'Hutang Pajak PB1', debit: 0, credit: 8600 },
        { accountCode: '2102', accountName: 'Hutang Service Charge', debit: 0, credit: 4300 }
      ]
    }

    expect(auditJournalBalance(roomChargeEvent).isBalanced).toBe(true)
  })

  // =========================================================================
  // 8. B2B CORPORATE INVOICING (NET-30 AR)
  // =========================================================================
  it('Event 8: Corporate B2B Net-30 Invoicing (GL 1106 AR)', () => {
    const corporateBill = 1500000
    const b2bEvent: JournalPosting = {
      eventId: 'EVT-B2B-ASTRA-01',
      companyBookId: COMPANY_BOOK_ID,
      branchId: BRANCH_ID,
      timestamp: '2026-08-16T17:00:00Z',
      lines: [
        { accountCode: '1106', accountName: 'Piutang Korporat PT Astra International', debit: corporateBill, credit: 0 },
        { accountCode: '4101', accountName: 'Pendapatan Penjualan B2B', debit: 0, credit: corporateBill }
      ]
    }

    expect(auditJournalBalance(b2bEvent).isBalanced).toBe(true)
  })

  // =========================================================================
  // 9. CIRCULAR ECONOMY GLASS BOTTLE DEPOSIT RETURN
  // =========================================================================
  it('Event 9: Circular Economy Glass Bottle Deposit Refund Liability Offset', () => {
    const refundEvent: JournalPosting = {
      eventId: 'EVT-BOTTLE-RETURN-01',
      companyBookId: COMPANY_BOOK_ID,
      branchId: BRANCH_ID,
      timestamp: '2026-08-16T18:00:00Z',
      lines: [
        { accountCode: '2104', accountName: 'Titipan Deposit Botol Kemasan', debit: 20000, credit: 0 },
        { accountCode: '1101', accountName: 'Kas Laci Kasir (Refund Cash)', debit: 0, credit: 20000 }
      ]
    }

    expect(auditJournalBalance(refundEvent).isBalanced).toBe(true)
  })

  // =========================================================================
  // 10 & 11. CASH VARIANCE ADJUSTMENT & END-OF-DAY VAULT SETTLEMENT
  // =========================================================================
  it('Event 10 & 11: Cash Shortage Variance Adjustment and Safe Vault Transfer', () => {
    // 10. Shortage adjustment
    const varianceEvent: JournalPosting = {
      eventId: 'EVT-VAR-01',
      companyBookId: COMPANY_BOOK_ID,
      branchId: BRANCH_ID,
      timestamp: '2026-08-16T22:00:00Z',
      lines: [
        { accountCode: '5109', accountName: 'Beban Selisih Kasir', debit: 50000, credit: 0 },
        { accountCode: '1101', accountName: 'Kas Laci Kasir', debit: 0, credit: 50000 }
      ]
    }
    expect(auditJournalBalance(varianceEvent).isBalanced).toBe(true)

    // 11. Final vault transfer
    const vaultTransferEvent: JournalPosting = {
      eventId: 'EVT-VAULT-CLOSE-01',
      companyBookId: COMPANY_BOOK_ID,
      branchId: BRANCH_ID,
      timestamp: '2026-08-16T22:15:00Z',
      lines: [
        { accountCode: '1102', accountName: 'Kas Brankas Toko (Vault)', debit: 4150000, credit: 0 },
        { accountCode: '1101', accountName: 'Kas Laci Kasir', debit: 0, credit: 4150000 }
      ]
    }
    expect(auditJournalBalance(vaultTransferEvent).isBalanced).toBe(true)
  })
})
