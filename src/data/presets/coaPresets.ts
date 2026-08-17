/**
 * Official Chart of Accounts (CoA) Presets Compiled from E2E Master Scenarios
 * Standard: GLC-ARCH-TENANCY-001 Section 10
 */

export interface CoaAccountNode {
  code: string;
  name: string;
  accountType: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'CostOfGoodsSold' | 'Expense' | 'ContraAsset' | 'ContraRevenue';
  normalBalance: 'Debit' | 'Credit';
  description: string;
}

export interface CoaTemplatePreset {
  id: string;
  title: string;
  jurisdiction: string;
  industry: string;
  accounts: CoaAccountNode[];
}

export const COA_ID_FNB_CAFE: CoaTemplatePreset = {
  id: 'COA_ID_FNB_CAFE',
  title: 'Indonesian F&B Cafe, Restaurant & Quick Service CoA',
  jurisdiction: 'ID',
  industry: 'Food & Beverage',
  accounts: [
    { code: '1110', name: 'Kas Laci Kasir (Cash Drawer)', accountType: 'Asset', normalBalance: 'Debit', description: 'Kas fisik di meja kasir' },
    { code: '1120', name: 'Bank BCA Operasional', accountType: 'Asset', normalBalance: 'Debit', description: 'Rekening utama penerimaan QRIS & transfer' },
    { code: '1130', name: 'Kliring QRIS Dinamis (SNAP BI)', accountType: 'Asset', normalBalance: 'Debit', description: 'Dana QRIS in-transit settlement' },
    { code: '1310', name: 'Persediaan Bahan Minuman & Kopi', accountType: 'Asset', normalBalance: 'Debit', description: 'Biji kopi, susu, sirup, teh' },
    { code: '1320', name: 'Persediaan Kemasan & Cup Takeaway', accountType: 'Asset', normalBalance: 'Debit', description: 'Cup, sedotan, paper bag' },
    { code: '1510', name: 'Peralatan Mesin Espresso & Grinder', accountType: 'Asset', normalBalance: 'Debit', description: 'Aset tetap mesin kopi' },
    { code: '1590', name: 'Akumulasi Penyusutan Mesin', accountType: 'ContraAsset', normalBalance: 'Credit', description: 'Akumulasi depresiasi mesin' },
    { code: '2110', name: 'Utang Usaha Supplier Bahan Baku', accountType: 'Liability', normalBalance: 'Credit', description: 'Utang dagang bahan' },
    { code: '2210', name: 'Utang Pajak Restoran (PB1 / PBJT 10%)', accountType: 'Liability', normalBalance: 'Credit', description: 'Pajak daerah F&B 10%' },
    { code: '2220', name: 'Utang PPN Keluaran DJP 11%', accountType: 'Liability', normalBalance: 'Credit', description: 'PPN e-Faktur 11%' },
    { code: '3100', name: "Modal Pemilik (Owner's Equity)", accountType: 'Equity', normalBalance: 'Credit', description: 'Modal disetor pendiri' },
    { code: '4110', name: 'Pendapatan Makanan & Minuman Dine-In', accountType: 'Revenue', normalBalance: 'Credit', description: 'Penjualan meja dine-in' },
    { code: '4120', name: 'Pendapatan Online QR Dining (ORDER)', accountType: 'Revenue', normalBalance: 'Credit', description: 'Penjualan QR table ordering' },
    { code: '4190', name: 'Diskon Member & Poin Loyalty (CARD)', accountType: 'ContraRevenue', normalBalance: 'Debit', description: 'Potongan harga voucher & loyalty' },
    { code: '5110', name: 'HPP Bahan Minuman & Makanan', accountType: 'CostOfGoodsSold', normalBalance: 'Debit', description: 'Biaya bahan terpakai' },
    { code: '6110', name: 'Beban Gaji Barista & Kasir', accountType: 'Expense', normalBalance: 'Debit', description: 'Upah operasional gerai' },
    { code: '6120', name: 'Beban Listrik, Air & Gas', accountType: 'Expense', normalBalance: 'Debit', description: 'Utilitas gerai' },
    { code: '6130', name: 'Beban MDR QRIS & Biaya Bank', accountType: 'Expense', normalBalance: 'Debit', description: 'Potongan fee gateway 0.7%' },
  ],
};

export const COA_ID_ROASTING_MFG: CoaTemplatePreset = {
  id: 'COA_ID_ROASTING_MFG',
  title: 'Indonesian Coffee Roasting & Manufacturing CoA',
  jurisdiction: 'ID',
  industry: 'Manufacturing',
  accounts: [
    { code: '1120', name: 'Bank Mandiri Rekening Pabrik', accountType: 'Asset', normalBalance: 'Debit', description: 'Rekening operasional pabrik' },
    { code: '1310', name: 'Persediaan Bahan Baku (Green Beans)', accountType: 'Asset', normalBalance: 'Debit', description: 'Biji kopi mentah belum disangrai' },
    { code: '1320', name: 'Barang Dalam Proses (WIP Roasting)', accountType: 'Asset', normalBalance: 'Debit', description: 'Biji kopi sedang dalam oven' },
    { code: '1330', name: 'Persediaan Barang Jadi (Roasted Beans)', accountType: 'Asset', normalBalance: 'Debit', description: 'Biji kopi sangrai siap kirim' },
    { code: '1340', name: 'Persediaan Kemasan Valve Bag & Box', accountType: 'Asset', normalBalance: 'Debit', description: 'Kemasan alumunium valve' },
    { code: '1510', name: 'Mesin Roasting Komersial 20kg', accountType: 'Asset', normalBalance: 'Debit', description: 'Mesin oven sangrai' },
    { code: '2110', name: 'Utang Pembelian Green Beans Petani', accountType: 'Liability', normalBalance: 'Credit', description: 'Utang pengadaan bahan' },
    { code: '4110', name: 'Penjualan Grosir B2B Biji Kopi Sangrai', accountType: 'Revenue', normalBalance: 'Credit', description: 'Pendapatan suplai ke kafe' },
    { code: '5100', name: 'Harga Pokok Produksi (COGM)', accountType: 'CostOfGoodsSold', normalBalance: 'Debit', description: 'Bahan + Gas + Upah Roaster' },
    { code: '5210', name: 'Biaya Bahan Bakar Gas Oven', accountType: 'CostOfGoodsSold', normalBalance: 'Debit', description: 'LPG pemanas mesin sangrai' },
    { code: '5220', name: 'Biaya Tenaga Kerja Langsung Roaster', accountType: 'CostOfGoodsSold', normalBalance: 'Debit', description: 'Upah operator sangrai' },
    { code: '5230', name: 'Biaya Susut Kadar Air Sangrai (15%)', accountType: 'CostOfGoodsSold', normalBalance: 'Debit', description: 'Alokasi susut berat sangrai' },
  ],
};

export const COA_ID_AGRICULTURE_FARM: CoaTemplatePreset = {
  id: 'COA_ID_AGRICULTURE_FARM',
  title: 'Indonesian Agriculture & Coffee Plantation CoA (PSAK 69 / IAS 41)',
  jurisdiction: 'ID',
  industry: 'Agriculture',
  accounts: [
    { code: '1120', name: 'Bank BSI Syariah Rekening Kebun', accountType: 'Asset', normalBalance: 'Debit', description: 'Rekening operasional kebun' },
    { code: '1410', name: 'Aset Biologis Tanaman Kopi Menghasilkan', accountType: 'Asset', normalBalance: 'Debit', description: 'Pohon kopi produktif (PSAK 69)' },
    { code: '1420', name: 'Tanaman Belum Menghasilkan (Bibit Muda)', accountType: 'Asset', normalBalance: 'Debit', description: 'Pohon kopi usia <3 tahun' },
    { code: '1350', name: 'Persediaan Hasil Panen (Ceri Merah Kopi)', accountType: 'Asset', normalBalance: 'Debit', description: 'Hasil panen ceri segar' },
    { code: '1510', name: 'Lahan Perkebunan Hak Guna Usaha 50 Ha', accountType: 'Asset', normalBalance: 'Debit', description: 'Tanah kebun Takengon' },
    { code: '4210', name: 'Keuntungan Nilai Wajar Aset Biologis', accountType: 'Revenue', normalBalance: 'Credit', description: 'Revaluasi nilai wajar pohon kopi' },
    { code: '5310', name: 'Biaya Panen Ceri Kopi (Upah Buruh Pemetik)', accountType: 'CostOfGoodsSold', normalBalance: 'Debit', description: 'Upah petik ceri merah' },
    { code: '6310', name: 'Beban Pupuk Organik & Perawatan Lahan', accountType: 'Expense', normalBalance: 'Debit', description: 'Pupuk dan herbisida' },
  ],
};

export const ALL_COA_PRESETS: CoaTemplatePreset[] = [
  COA_ID_FNB_CAFE,
  COA_ID_ROASTING_MFG,
  COA_ID_AGRICULTURE_FARM,
];
