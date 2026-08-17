import { BalanceSheetData, ProfitAndLossData, TaxObligation } from '../types/accounting'

export const MOCK_BALANCE_SHEET: BalanceSheetData = {
  asOfDate: '31 Agustus 2026',
  currentAssets: [
    { id: 'ca-1', code: '1-1001', name: 'Kas Operasional Kasir', currentPeriod: 5000000, previousPeriod: 2000000 },
    { id: 'ca-2', code: '1-1002', name: 'Bank BCA Giro Operasional', currentPeriod: 48500000, previousPeriod: 25000000 },
    { id: 'ca-3', code: '1-1003', name: 'Bank Mandiri Settlement EDC', currentPeriod: 18200000, previousPeriod: 18200000 },
    { id: 'ca-4', code: '1-1101', name: 'Piutang Settlement QRIS', currentPeriod: 3800000, previousPeriod: 1200000 },
    { id: 'ca-5', code: '1-1201', name: 'Persediaan Bahan Baku (BOM)', currentPeriod: 15600000, previousPeriod: 14200000 },
    { id: 'ca-6', code: '1-1202', name: 'Persediaan Kemasan & Packaging', currentPeriod: 4500000, previousPeriod: 4500000 }
  ],
  nonCurrentAssets: [
    { id: 'nca-1', code: '1-1501', name: 'Aset Tetap — Mesin Kopi Espresso', currentPeriod: 24000000, previousPeriod: 24000000 },
    { id: 'nca-2', code: '1-1502', name: 'Akumulasi Penyusutan Mesin', currentPeriod: -4000000, previousPeriod: -3000000 }
  ],
  totalAssets: 115600000,
  currentLiabilities: [
    { id: 'cl-1', code: '2-1001', name: 'Utang Usaha Supplier', currentPeriod: 8200000, previousPeriod: 2000000 },
    { id: 'cl-2', code: '2-1101', name: 'Utang Pajak Restoran (PB1 10%)', currentPeriod: 4200000, previousPeriod: 2800000 },
    { id: 'cl-3', code: '2-1102', name: 'Utang PPh 21 Karyawan', currentPeriod: 1300000, previousPeriod: 900000 },
    { id: 'cl-4', code: '2-1201', name: 'Utang Gaji & Tunjangan Staf', currentPeriod: 9500000, previousPeriod: 9500000 }
  ],
  nonCurrentLiabilities: [
    { id: 'ncl-1', code: '2-2001', name: 'Utang Bank Jangka Panjang (KUR)', currentPeriod: 15000000, previousPeriod: 15000000 }
  ],
  totalLiabilities: 38200000,
  equityLines: [
    { id: 'eq-1', code: '3-1001', name: 'Modal Disetor (Paid-in Capital)', currentPeriod: 50000000, previousPeriod: 50000000 },
    { id: 'eq-2', code: '3-2001', name: 'Saldo Laba Ditahan', currentPeriod: 12400000, previousPeriod: 12400000 },
    { id: 'eq-3', code: '3-3001', name: 'Laba Periode Berjalan', currentPeriod: 15000000, previousPeriod: 0 }
  ],
  totalEquity: 77400000,
  isBalanced: true
}

export const MOCK_PROFIT_AND_LOSS: ProfitAndLossData = {
  period: '1 Jan 2026 – 31 Agu 2026 (YTD)',
  revenueLines: [
    { id: 'rev-1', code: '4-1001', name: 'Penjualan F&B Specialty Coffee', currentPeriod: 62500000, previousPeriod: 45000000 },
    { id: 'rev-2', code: '4-1002', name: 'Penjualan Pastry & Bakery', currentPeriod: 18500000, previousPeriod: 12000000 },
    { id: 'rev-3', code: '4-1003', name: 'Penjualan Retail Whole Beans', currentPeriod: 6800000, previousPeriod: 4500000 }
  ],
  totalRevenue: 87800000,
  cogsLines: [
    { id: 'cogs-1', code: '5-1001', name: 'Bahan Baku Makanan & Minuman', currentPeriod: 24800000, previousPeriod: 16500000 },
    { id: 'cogs-2', code: '5-1002', name: 'Kemasan & Packaging', currentPeriod: 3200000, previousPeriod: 2100000 }
  ],
  totalCogs: 28000000,
  grossProfit: 59800000,
  grossMarginPct: 68.1,
  expenseLines: [
    { id: 'exp-1', code: '6-1001', name: 'Beban Gaji & Upah Barista', currentPeriod: 18500000, previousPeriod: 12000000 },
    { id: 'exp-2', code: '6-1002', name: 'Beban Sewa Outlet Ruko', currentPeriod: 12000000, previousPeriod: 8000000 },
    { id: 'exp-3', code: '6-1003', name: 'Beban Listrik, Air & Internet', currentPeriod: 4200000, previousPeriod: 3100000 },
    { id: 'exp-4', code: '6-1004', name: 'Beban Pemeliharaan Mesin & Sanitasi', currentPeriod: 1800000, previousPeriod: 1200000 },
    { id: 'exp-5', code: '6-1005', name: 'Beban Pemasaran & Promo Digital', currentPeriod: 3100000, previousPeriod: 2400000 },
    { id: 'exp-6', code: '6-1006', name: 'Beban Penyusutan Aset Tetap', currentPeriod: 1000000, previousPeriod: 800000 }
  ],
  totalExpenses: 40600000,
  operatingProfit: 19200000,
  operatingMarginPct: 21.87,
  taxExpense: 4200000,
  netIncome: 15000000,
  netMarginPct: 17.08
}

export const MOCK_TAX_OBLIGATIONS: TaxObligation[] = [
  {
    id: 'TAX-2026-08-PB1',
    taxType: 'PB1_RESTO',
    taxName: 'Pajak Restoran Daerah PB1 (10%)',
    period: 'Masa Agustus 2026',
    taxableBase: 87800000,
    ratePercent: 10,
    taxAmount: 8780000,
    status: 'calculated',
    dueDate: '2026-09-15',
    billingCode: '990182736451',
    sptpdNumber: 'SPTPD-DKI-2026-08-9901'
  },
  {
    id: 'TAX-2026-08-PPH21',
    taxType: 'PPH_21',
    taxName: 'PPh Pasal 21 Staf & Karyawan',
    period: 'Masa Agustus 2026',
    taxableBase: 18500000,
    ratePercent: 5,
    taxAmount: 1300000,
    status: 'filed',
    dueDate: '2026-09-10',
    billingCode: '109827364501',
    ntpnCode: 'NTPN-880199283741'
  },
  {
    id: 'TAX-2026-08-FINAL',
    taxType: 'PPH_FINAL_05',
    taxName: 'PPh Final PP 23/2018 UMKM (0.5%)',
    period: 'Masa Agustus 2026',
    taxableBase: 87800000,
    ratePercent: 0.5,
    taxAmount: 439000,
    status: 'settled',
    dueDate: '2026-09-15',
    billingCode: '209182736499',
    ntpnCode: 'NTPN-771829304192'
  }
]
