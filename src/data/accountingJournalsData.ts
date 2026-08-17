import { JournalEntry, TrialBalanceRow } from '../types/accounting'

export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'JRN-2026-0801',
    date: '2026-08-01',
    referenceNumber: 'REF-CAP-INIT-001',
    description: 'Penyetoran Modal Awal Pendiri PT ke Rekening BCA',
    postedAt: '2026-08-01T08:00:00Z',
    postedBy: 'Aldi Pratama (Direktur)',
    kernelProofId: 'TB-PROOF-7781-A',
    status: 'posted',
    totalDebit: 50000000,
    totalCredit: 50000000,
    lines: [
      {
        id: 'L-01',
        accountCode: '1-1002',
        accountName: 'Bank BCA Giro Operasional',
        debit: 50000000,
        credit: 0,
        memo: 'Setoran modal via transfer bank'
      },
      {
        id: 'L-02',
        accountCode: '3-1001',
        accountName: 'Modal Disetor (Paid-in Capital)',
        debit: 0,
        credit: 50000000,
        memo: 'Penerbitan 50.000 lembar saham seri A'
      }
    ]
  },
  {
    id: 'JRN-2026-0802',
    date: '2026-08-05',
    referenceNumber: 'REF-INV-SUPPLIER-88',
    description: 'Pembelian Biji Kopi Specialty & Susu Segar dari Supplier',
    postedAt: '2026-08-05T10:30:00Z',
    postedBy: 'Budi Santoso (Warehouse Mgr)',
    kernelProofId: 'TB-PROOF-7782-B',
    status: 'posted',
    totalDebit: 6200000,
    totalCredit: 6200000,
    lines: [
      {
        id: 'L-03',
        accountCode: '1-1201',
        accountName: 'Persediaan Bahan Baku Makanan & Minuman (BOM)',
        debit: 6200000,
        credit: 0,
        memo: 'Inbound PO-8801: 50kg Arabica Gayo + 120L Greenfields Milk'
      },
      {
        id: 'L-04',
        accountCode: '2-1001',
        accountName: 'Utang Usaha Supplier Bahan Baku',
        debit: 0,
        credit: 6200000,
        memo: 'Invoice INV-GAYO-991 TOP 14 Days'
      }
    ]
  },
  {
    id: 'JRN-2026-0803',
    date: '2026-08-10',
    referenceNumber: 'REF-POS-BATCH-0810',
    description: 'Rekonsiliasi Omzet Kasir Shift Harian & Piutang QRIS',
    postedAt: '2026-08-10T23:15:00Z',
    postedBy: 'System Auto-Posting (TigerBeetle)',
    kernelProofId: 'TB-PROOF-7783-C',
    status: 'posted',
    totalDebit: 15400000,
    totalCredit: 15400000,
    lines: [
      {
        id: 'L-05',
        accountCode: '1-1001',
        accountName: 'Kas Operasional Kasir (Cash Float)',
        debit: 4400000,
        credit: 0,
        memo: 'Penerimaan pembayaran uang tunai kasir'
      },
      {
        id: 'L-06',
        accountCode: '1-1101',
        accountName: 'Piutang Settlement QRIS & EDC (In-Transit)',
        debit: 11000000,
        credit: 0,
        memo: 'Settlement QRIS Bank Indonesia & EDC BCA'
      },
      {
        id: 'L-07',
        accountCode: '4-1001',
        accountName: 'Pendapatan Penjualan F&B Specialty Coffee',
        debit: 0,
        credit: 14000000,
        memo: 'Penjualan bersih F&B harian'
      },
      {
        id: 'L-08',
        accountCode: '2-1101',
        accountName: 'Utang Pajak Restoran (PB1 10%)',
        debit: 0,
        credit: 1400000,
        memo: 'Pajak PB1 10% dipungut dari customer'
      }
    ]
  },
  {
    id: 'JRN-2026-0804',
    date: '2026-08-12',
    referenceNumber: 'REF-BOM-COGS-AUTO',
    description: 'Otomasi Pengakuan HPP Bahan Baku atas Order Terjual',
    postedAt: '2026-08-12T23:59:00Z',
    postedBy: 'System Auto-Posting (TigerBeetle)',
    kernelProofId: 'TB-PROOF-7784-D',
    status: 'posted',
    totalDebit: 4800000,
    totalCredit: 4800000,
    lines: [
      {
        id: 'L-09',
        accountCode: '5-1001',
        accountName: 'Beban Pokok Penjualan — Bahan Baku Makanan & Minuman',
        debit: 4800000,
        credit: 0,
        memo: 'BOM deduction batch ORD-8801 to ORD-8940'
      },
      {
        id: 'L-10',
        accountCode: '1-1201',
        accountName: 'Persediaan Bahan Baku Makanan & Minuman (BOM)',
        debit: 0,
        credit: 4800000,
        memo: 'Pengurangan stok fisik gudang barista'
      }
    ]
  },
  {
    id: 'JRN-2026-0805',
    date: '2026-08-15',
    referenceNumber: 'REF-PAYROLL-AUG-01',
    description: 'Penyaluran Gaji Staf Barista & Pemotongan PPh 21',
    postedAt: '2026-08-15T15:00:00Z',
    postedBy: 'Siti Aminah (Finance / HR)',
    kernelProofId: 'TB-PROOF-7785-E',
    status: 'posted',
    totalDebit: 8500000,
    totalCredit: 8500000,
    lines: [
      {
        id: 'L-11',
        accountCode: '6-1001',
        accountName: 'Beban Gaji & Upah Barista / Staf',
        debit: 8500000,
        credit: 0,
        memo: 'Gaji periode tengah bulan 6 barista'
      },
      {
        id: 'L-12',
        accountCode: '1-1002',
        accountName: 'Bank BCA Giro Operasional',
        debit: 0,
        credit: 8100000,
        memo: 'Transfer payroll via BCA KlikBisnis'
      },
      {
        id: 'L-13',
        accountCode: '2-1102',
        accountName: 'Utang Pajak Penghasilan (PPh 21 Karyawan)',
        debit: 0,
        credit: 400000,
        memo: 'Withholding tax PPh 21 disetor ke kas negara'
      }
    ]
  }
]

export const MOCK_TRIAL_BALANCE: TrialBalanceRow[] = [
  {
    accountCode: '1-1001',
    accountName: 'Kas Operasional Kasir (Cash Float)',
    category: 'asset',
    openingDebit: 2000000,
    openingCredit: 0,
    movementDebit: 3000000,
    movementCredit: 0,
    closingDebit: 5000000,
    closingCredit: 0
  },
  {
    accountCode: '1-1002',
    accountName: 'Bank BCA Giro Operasional',
    category: 'asset',
    openingDebit: 31500000,
    openingCredit: 0,
    movementDebit: 25100000,
    movementCredit: 8100000,
    closingDebit: 48500000,
    closingCredit: 0
  },
  {
    accountCode: '1-1003',
    accountName: 'Bank Mandiri Settlement EDC',
    category: 'asset',
    openingDebit: 18200000,
    openingCredit: 0,
    movementDebit: 0,
    movementCredit: 0,
    closingDebit: 18200000,
    closingCredit: 0
  },
  {
    accountCode: '1-1101',
    accountName: 'Piutang Settlement QRIS (In-Transit)',
    category: 'asset',
    openingDebit: 1200000,
    openingCredit: 0,
    movementDebit: 11000000,
    movementCredit: 8400000,
    closingDebit: 3800000,
    closingCredit: 0
  },
  {
    accountCode: '1-1201',
    accountName: 'Persediaan Bahan Baku (BOM)',
    category: 'asset',
    openingDebit: 14200000,
    openingCredit: 0,
    movementDebit: 6200000,
    movementCredit: 4800000,
    closingDebit: 15600000,
    closingCredit: 0
  },
  {
    accountCode: '1-1202',
    accountName: 'Persediaan Kemasan & Packaging',
    category: 'asset',
    openingDebit: 4500000,
    openingCredit: 0,
    movementDebit: 0,
    movementCredit: 0,
    closingDebit: 4500000,
    closingCredit: 0
  },
  {
    accountCode: '1-1501',
    accountName: 'Aset Tetap — Mesin Kopi Espresso',
    category: 'asset',
    openingDebit: 24000000,
    openingCredit: 0,
    movementDebit: 0,
    movementCredit: 0,
    closingDebit: 24000000,
    closingCredit: 0
  },
  {
    accountCode: '1-1502',
    accountName: 'Akumulasi Penyusutan Mesin',
    category: 'asset',
    openingDebit: 0,
    openingCredit: 3000000,
    movementDebit: 0,
    movementCredit: 1000000,
    closingDebit: 0,
    closingCredit: 4000000
  },
  {
    accountCode: '2-1001',
    accountName: 'Utang Usaha Supplier Bahan Baku',
    category: 'liability',
    openingDebit: 0,
    openingCredit: 2000000,
    movementDebit: 0,
    movementCredit: 6200000,
    closingDebit: 0,
    closingCredit: 8200000
  },
  {
    accountCode: '2-1101',
    accountName: 'Utang Pajak Restoran (PB1 10%)',
    category: 'liability',
    openingDebit: 0,
    openingCredit: 2800000,
    movementDebit: 0,
    movementCredit: 1400000,
    closingDebit: 0,
    closingCredit: 4200000
  },
  {
    accountCode: '2-1102',
    accountName: 'Utang PPh 21 Karyawan',
    category: 'liability',
    openingDebit: 0,
    openingCredit: 900000,
    movementDebit: 0,
    movementCredit: 400000,
    closingDebit: 0,
    closingCredit: 1300000
  },
  {
    accountCode: '2-1201',
    accountName: 'Utang Gaji & Tunjangan',
    category: 'liability',
    openingDebit: 0,
    openingCredit: 9500000,
    movementDebit: 0,
    movementCredit: 0,
    closingDebit: 0,
    closingCredit: 9500000
  },
  {
    accountCode: '2-2001',
    accountName: 'Utang Bank Jangka Panjang',
    category: 'liability',
    openingDebit: 0,
    openingCredit: 15000000,
    movementDebit: 0,
    movementCredit: 0,
    closingDebit: 0,
    closingCredit: 15000000
  },
  {
    accountCode: '3-1001',
    accountName: 'Modal Disetor (Paid-in Capital)',
    category: 'equity',
    openingDebit: 0,
    openingCredit: 50000000,
    movementDebit: 0,
    movementCredit: 0,
    closingDebit: 0,
    closingCredit: 50000000
  },
  {
    accountCode: '3-2001',
    accountName: 'Saldo Laba Ditahan',
    category: 'equity',
    openingDebit: 0,
    openingCredit: 12400000,
    movementDebit: 0,
    movementCredit: 0,
    closingDebit: 0,
    closingCredit: 12400000
  },
  {
    accountCode: '3-3001',
    accountName: 'Laba Periode Berjalan',
    category: 'equity',
    openingDebit: 0,
    openingCredit: 0,
    movementDebit: 0,
    movementCredit: 15000000,
    closingDebit: 0,
    closingCredit: 15000000
  }
]
