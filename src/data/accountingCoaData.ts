import { ChartOfAccount } from '../types/accounting'

export const MOCK_CHART_OF_ACCOUNTS: ChartOfAccount[] = [
  // 1. Assets (1-xxxx)
  {
    code: '1-1001',
    name: 'Kas Operasional Kasir (Cash Float)',
    category: 'asset',
    normalBalance: 'debit',
    balance: 5000000,
    description: 'Uang tunai fisik pada laci kasir outlet Senopati HQ',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },
  {
    code: '1-1002',
    name: 'Bank BCA Giro Operasional',
    category: 'asset',
    normalBalance: 'debit',
    balance: 48500000,
    description: 'Rekening utama penerimaan QRIS & EDC Bank BCA',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },
  {
    code: '1-1003',
    name: 'Bank Mandiri Settlement EDC',
    category: 'asset',
    normalBalance: 'debit',
    balance: 18200000,
    description: 'Rekening cadangan operasional & payroll Mandiri',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },
  {
    code: '1-1101',
    name: 'Piutang Settlement QRIS & EDC (In-Transit)',
    category: 'asset',
    normalBalance: 'debit',
    balance: 3800000,
    description: 'Penerimaan QRIS H+1 yang belum kliring ke rekening bank',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },
  {
    code: '1-1201',
    name: 'Persediaan Bahan Baku Makanan & Minuman (BOM)',
    category: 'asset',
    normalBalance: 'debit',
    balance: 15600000,
    description: 'Stok biji kopi beans, susu segar, syrup, & raw ingredients',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },
  {
    code: '1-1202',
    name: 'Persediaan Kemasan & Packaging Takeaway',
    category: 'asset',
    normalBalance: 'debit',
    balance: 4500000,
    description: 'Cup plastik, sedotan ramah lingkungan, paper bag',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },
  {
    code: '1-1501',
    name: 'Aset Tetap — Mesin Kopi Espresso & Grinder',
    category: 'asset',
    normalBalance: 'debit',
    balance: 24000000,
    description: 'La Marzocco Linea PB 2-Group + Mahlkonig EK43',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },
  {
    code: '1-1502',
    name: 'Akumulasi Penyusutan Mesin & Peralatan',
    category: 'asset',
    normalBalance: 'credit',
    balance: -4000000,
    description: 'Penyusutan garis lurus peralatan barista (masa manfaat 4 th)',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },

  // 2. Liabilities (2-xxxx)
  {
    code: '2-1001',
    name: 'Utang Usaha Supplier Bahan Baku',
    category: 'liability',
    normalBalance: 'credit',
    balance: 8200000,
    description: 'Tagihan supplier kopi & susu jatuh tempo 14 hari',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },
  {
    code: '2-1101',
    name: 'Utang Pajak Restoran (PB1 10%)',
    category: 'liability',
    normalBalance: 'credit',
    balance: 4200000,
    description: 'Pajak restoran yang dipungut dari customer sebelum disetor Bapenda',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },
  {
    code: '2-1102',
    name: 'Utang Pajak Penghasilan (PPh 21 Karyawan)',
    category: 'liability',
    normalBalance: 'credit',
    balance: 1300000,
    description: 'Pemotongan PPh 21 gaji staf barista dan kasir',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },
  {
    code: '2-1201',
    name: 'Utang Gaji & Tunjangan Karyawan',
    category: 'liability',
    normalBalance: 'credit',
    balance: 9500000,
    description: 'Akrual gaji bulan berjalan yang belum dibayarkan',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },
  {
    code: '2-2001',
    name: 'Utang Bank Jangka Panjang (KUR Mandiri)',
    category: 'liability',
    normalBalance: 'credit',
    balance: 15000000,
    description: 'Pinjaman ekspansi modal kerja outlet',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },

  // 3. Equity (3-xxxx)
  {
    code: '3-1001',
    name: 'Modal Disetor (Paid-in Capital)',
    category: 'equity',
    normalBalance: 'credit',
    balance: 50000000,
    description: 'Setoran modal awal para pendiri PT',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },
  {
    code: '3-2001',
    name: 'Saldo Laba Ditahan (Retained Earnings)',
    category: 'equity',
    normalBalance: 'credit',
    balance: 12400000,
    description: 'Akumulasi laba bersih periode-periode sebelumnya',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },
  {
    code: '3-3001',
    name: 'Laba Periode Berjalan (Current Year Earnings)',
    category: 'equity',
    normalBalance: 'credit',
    balance: 15000000,
    description: 'Laba bersih berjalan tahun 2026',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },

  // 4. Revenue (4-xxxx)
  {
    code: '4-1001',
    name: 'Pendapatan Penjualan F&B Specialty Coffee',
    category: 'revenue',
    normalBalance: 'credit',
    balance: 62500000,
    description: 'Omzet espresso, cold brew, filter coffee, artisan tea',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },
  {
    code: '4-1002',
    name: 'Pendapatan Penjualan Pastry & Bakery',
    category: 'revenue',
    normalBalance: 'credit',
    balance: 18500000,
    description: 'Omzet croissant, sourdough, cakes',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },
  {
    code: '4-1003',
    name: 'Pendapatan Retail Beans & Merchandising',
    category: 'revenue',
    normalBalance: 'credit',
    balance: 6800000,
    description: 'Penjualan whole beans 250g, tumbler, filter paper',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },

  // 5. Cost of Goods Sold (5-xxxx)
  {
    code: '5-1001',
    name: 'Beban Pokok Penjualan — Bahan Baku Makanan & Minuman',
    category: 'cogs',
    normalBalance: 'debit',
    balance: 24800000,
    description: 'Biaya green beans, roasting, fresh milk, sirup',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },
  {
    code: '5-1002',
    name: 'Beban Pokok Penjualan — Kemasan & Packaging',
    category: 'cogs',
    normalBalance: 'debit',
    balance: 3200000,
    description: 'Biaya cup, sedotan, lid, packaging box',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },

  // 6. Operating Expenses (6-xxxx)
  {
    code: '6-1001',
    name: 'Beban Gaji & Upah Barista / Staf',
    category: 'expense',
    normalBalance: 'debit',
    balance: 18500000,
    description: 'Gaji pokok, lembur, dan tunjangan staf operasional',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },
  {
    code: '6-1002',
    name: 'Beban Sewa Outlet & Tempat Usaha',
    category: 'expense',
    normalBalance: 'debit',
    balance: 12000000,
    description: 'Alokasi sewa bulanan ruko Senopati',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },
  {
    code: '6-1003',
    name: 'Beban Utilitas Listrik (PLN), Air (PAM) & Internet',
    category: 'expense',
    normalBalance: 'debit',
    balance: 4200000,
    description: 'Biaya operasional listrik daya 16.500 VA & fiber internet',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },
  {
    code: '6-1004',
    name: 'Beban Pemeliharaan Peralatan & Sanitasi',
    category: 'expense',
    normalBalance: 'debit',
    balance: 1800000,
    description: 'Service rutin mesin espresso, water filtration filter',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },
  {
    code: '6-1005',
    name: 'Beban Pemasaran, Diskon & Promosi Digital',
    category: 'expense',
    normalBalance: 'debit',
    balance: 3100000,
    description: 'Instagram ads, influencer endorsement, loyalty reward promo',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },
  {
    code: '6-1006',
    name: 'Beban Penyusutan Aset Tetap',
    category: 'expense',
    normalBalance: 'debit',
    balance: 1000000,
    description: 'Alokasi penyusutan mesin & peralatan bulan berjalan',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  },
  {
    code: '6-1007',
    name: 'Beban Pajak Penghasilan Final UMKM (PP 23/2018 0.5%)',
    category: 'expense',
    normalBalance: 'debit',
    balance: 439000,
    description: 'Pajak PPh Final 0.5% atas peredaran bruto omzet',
    currency: 'IDR',
    isActive: true,
    isReconciled: true
  }
]
